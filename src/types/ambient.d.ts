// Ambient type declarations for 3D and canvas libraries

declare module "canvas-confetti" {
  export default function confetti(options?: any): Promise<null>;
}

declare module "three" {
  export const Mesh: any;
  export const BoxGeometry: any;
  export const MeshStandardMaterial: any;
  export const Group: any;
  export const Vector3: any;
  export const Color: any;
  const Three: any;
  export default Three;
}

declare module "@react-three/fiber" {
  export const Canvas: any;
  export function useFrame(callback: (state: any, delta: number) => void): void;
  export function useThree(): any;
}

declare module "@react-three/drei" {
  export const OrbitControls: any;
  export const Sphere: any;
  export const MeshDistortMaterial: any;
  export const Float: any;
  export const Html: any;
  export const Text: any;
}
