import React from 'react';
import { MeshStandardMaterial, MeshPhysicalMaterial, Color } from 'three';

// We export component-based materials to be used within the R3F ecosystem seamlessly
// although pure Three.js material instances could also be created.

export const GoldMaterial: React.FC = () => (
  <meshStandardMaterial
    color="#FFD700"
    emissive="#C5A000"
    emissiveIntensity={0.2}
    metalness={1}
    roughness={0.15}
    envMapIntensity={1.5}
  />
);

export const EmeraldMaterial: React.FC = () => (
  <meshStandardMaterial
    color="#002b1c"
    emissive="#001a11"
    emissiveIntensity={0.1}
    metalness={0.2}
    roughness={0.7}
    envMapIntensity={0.5}
  />
);

export const OrnamentGoldMaterial: React.FC = () => (
  <meshPhysicalMaterial
    color="#FFDF00"
    metalness={1}
    roughness={0.1}
    clearcoat={1}
    clearcoatRoughness={0.1}
    envMapIntensity={2}
  />
);

export const OrnamentRedMaterial: React.FC = () => (
  <meshPhysicalMaterial
    color="#8a0303"
    metalness={0.6}
    roughness={0.2}
    clearcoat={1}
    clearcoatRoughness={0.1}
    envMapIntensity={1.2}
  />
);

export const OrnamentPearlMaterial: React.FC = () => (
  <meshPhysicalMaterial
    color="#F8F8FF"
    emissive="#222222"
    metalness={0.9}
    roughness={0.1}
    clearcoat={1}
    clearcoatRoughness={0.05}
    envMapIntensity={1.5}
  />
);

export const StarMaterial: React.FC = () => (
  <meshStandardMaterial
    color="#FFFFE0"
    emissive="#FFFACD"
    emissiveIntensity={2}
    toneMapped={false} // Allows bloom to blow out
  />
);