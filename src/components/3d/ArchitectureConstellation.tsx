"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Line, Text } from "@react-three/drei";
import * as THREE from "three";

interface NodeData {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
}

const NODES: NodeData[] = [
  { id: "client", label: "Client Device", position: [-3, 1.2, 0], color: "#00FF7F" },
  { id: "edge", label: "Edge Cache Layer", position: [-1.5, -0.8, 0], color: "#00C853" },
  { id: "ai", label: "AI Risk ML Engine", position: [0, 1.5, 0], color: "#FFB020" },
  { id: "twin", label: "Digital Twin Store", position: [1.5, -0.8, 0], color: "#00FF7F" },
  { id: "rollback", label: "Rollback Engine", position: [3, 1.2, 0], color: "#00FF7F" },
  { id: "audit", label: "Audit Hash Chain", position: [0, -1.8, 0], color: "#00FF7F" },
];

const CONNECTIONS: [string, string][] = [
  ["client", "edge"],
  ["edge", "ai"],
  ["ai", "twin"],
  ["twin", "rollback"],
  ["rollback", "audit"],
  ["client", "twin"],
  ["edge", "audit"],
];

export const ArchitectureConstellationContent: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#00FF7F" />

      {/* Connecting Lines */}
      {CONNECTIONS.map(([fromId, toId], idx) => {
        const fromNode = NODES.find((n) => n.id === fromId);
        const toNode = NODES.find((n) => n.id === toId);
        if (!fromNode || !toNode) return null;

        const isHighlighted =
          hoveredNode === fromId || hoveredNode === toId;

        return (
          <Line
            key={idx}
            points={[fromNode.position, toNode.position]}
            color={isHighlighted ? "#00FF7F" : "#0A3D24"}
            lineWidth={isHighlighted ? 3 : 1.5}
          />
        );
      })}

      {/* Nodes */}
      {NODES.map((node) => {
        const isHovered = hoveredNode === node.id;
        return (
          <group
            key={node.id}
            position={node.position}
            onPointerOver={() => setHoveredNode(node.id)}
            onPointerOut={() => setHoveredNode(null)}
          >
            <Sphere args={[isHovered ? 0.35 : 0.25, 32, 32]}>
              <meshStandardMaterial
                color={isHovered ? "#00FF7F" : node.color}
                emissive={isHovered ? "#00FF7F" : node.color}
                emissiveIntensity={isHovered ? 1.2 : 0.5}
              />
            </Sphere>

            {/* 3D Label */}
            <Text
              position={[0, 0.45, 0]}
              fontSize={0.22}
              color={isHovered ? "#00FF7F" : "#E8FCEF"}
              anchorX="center"
              anchorY="middle"
              font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7B.woff2"
            >
              {node.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
};
