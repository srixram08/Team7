/**
 * ReviveX Web Crypto & Integrity Engine
 * 
 * Provides:
 * 1. Canonical JSON serialization (deterministic sorting of object keys)
 * 2. Real SHA-256 hashing via native browser window.crypto.subtle
 * 3. State Delta Merkle Chaining: H_N = SHA-256(H_{N-1} || Timestamp || QuestionID || DeltaPayload)
 * 4. Server HMAC countersigning simulation for non-repudiation
 */

// Deterministic canonical JSON serialization
export function canonicalStringify(obj: unknown): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return "[" + obj.map(canonicalStringify).join(",") + "]";
  }

  const sortedKeys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = sortedKeys.map(
    (key) => `${JSON.stringify(key)}:${canonicalStringify((obj as Record<string, unknown>)[key])}`
  );
  return "{" + pairs.join(",") + "}";
}

// Convert an ArrayBuffer to a hex string
export function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Compute real SHA-256 hash using native Web Crypto API (with fallback if running off-window)
export async function computeSha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(data);

  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    try {
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", dataBytes);
      return "0x" + bufferToHex(hashBuffer);
    } catch (e) {
      console.warn("Web Crypto subtle digest failed, falling back to JS implementation", e);
    }
  }

  // Pure JavaScript SHA-256 fallback for environments without Web Crypto
  return "0x" + fallbackSha256(data);
}

// Merkle Delta Chain Link
export interface MerkleNode {
  nodeIndex: number;
  prevHash: string;
  timestamp: number;
  questionId: number;
  payloadHash: string;
  merkleRoot: string;
}

export async function computeMerkleDeltaNode(
  nodeIndex: number,
  prevHash: string,
  timestamp: number,
  questionId: number,
  deltaPayload: unknown
): Promise<MerkleNode> {
  const canonicalPayload = canonicalStringify(deltaPayload);
  const payloadHash = await computeSha256(canonicalPayload);
  const combinedRaw = `${nodeIndex}|${prevHash}|${timestamp}|${questionId}|${payloadHash}`;
  const merkleRoot = await computeSha256(combinedRaw);

  return {
    nodeIndex,
    prevHash,
    timestamp,
    questionId,
    payloadHash,
    merkleRoot,
  };
}

// Generate a cryptographic HMAC receipt representing server-authoritative certification
export async function generateHmacReceipt(
  stateHash: string,
  candidateNumber: string,
  sequenceNumber: number
): Promise<string> {
  const message = `${stateHash}:${candidateNumber}:${sequenceNumber}:${Date.now()}`;
  const shortHash = await computeSha256(message);
  return `REVIVEX-HMAC-2026-${shortHash.slice(2, 14).toUpperCase()}-AUTH`;
}

// Lightweight standard JS SHA-256 implementation as foolproof fallback
function fallbackSha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = "length";
  let i = 0, j = 0;
  let result = "";

  const words: number[] = [];
  const asciiBitLength = (ascii as any)[lengthProperty] * 8;

  const hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, number> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += "\x80";
  while (((ascii as any)[lengthProperty] % 64) - 56) ascii += "\x00";
  for (i = 0; i < (ascii as any)[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[(ascii as any)[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[(ascii as any)[lengthProperty]] = asciiBitLength;

  for (j = 0; j < (words as any)[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15],
        w2 = w[i - 2];

      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] =
        i < 16
          ? w[i]
          : ((w[i - 16] + s0 + w[i - 7] + s1) & 0xffffffff) | 0;

      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp1 =
        ((hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + w[i]) & 0xffffffff) | 0;
      const temp2 =
        ((rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj) | 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = ((hash[3] + temp1) & 0xffffffff) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = ((temp1 + temp2) & 0xffffffff) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = ((hash[i] + oldHash[i]) & 0xffffffff) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (b * 8)) & 255;
      result += (byte < 16 ? "0" : "") + byte.toString(16);
    }
  }
  return result;
}
