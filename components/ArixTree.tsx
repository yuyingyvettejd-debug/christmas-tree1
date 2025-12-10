import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Object3D, MathUtils, InstancedMesh, Vector3, Quaternion, Euler } from 'three';
import { Sparkles, Float } from '@react-three/drei';
import { 
  OrnamentGoldMaterial, 
  OrnamentRedMaterial, 
  OrnamentPearlMaterial, 
  EmeraldMaterial, 
  StarMaterial 
} from './Materials';

// --- Configuration ---
const NEEDLE_COUNT = 2500;
const ORNAMENT_GOLD_COUNT = 150;
const ORNAMENT_RED_COUNT = 80;
const ORNAMENT_PEARL_COUNT = 60;

// --- Helpers ---
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate transformation data for both states: SCATTERED and TREE
const generateTransformData = (count: number, type: 'branch' | 'ornament', seedOffset: number) => {
  const data = [];
  const tempPos = new Vector3();
  const tempRot = new Euler();
  const tempQuat = new Quaternion();
  const tempScale = new Vector3();

  // Golden Angle for spiral distribution
  const phi = Math.PI * (3 - Math.sqrt(5)); 

  for (let i = 0; i < count; i++) {
    const t = i / count; 
    
    // --- TREE POSITION (Cone Spiral) ---
    // Height from -2 to +2.5
    const treeY = -2.0 + (t * 4.5);
    
    // Radius tapers as we go up
    // Power curve for nice shape
    const radiusBase = 2.4 * (1 - Math.pow(t, 0.8)); 
    // Add noise to radius for fluffiness
    const radius = Math.max(0, radiusBase + randomRange(-0.15, 0.15));
    
    const theta = i * phi * 15 + seedOffset; // 15 turns for density
    
    const treeX = radius * Math.cos(theta);
    const treeZ = radius * Math.sin(theta);

    // If ornament, push slightly further out
    const finalTreeX = type === 'ornament' ? treeX * 1.15 : treeX;
    const finalTreeZ = type === 'ornament' ? treeZ * 1.15 : treeZ;

    // --- SCATTER POSITION (Sphere Cloud) ---
    // Random point in sphere radius 6
    const rScatter = 6 * Math.cbrt(Math.random());
    const thetaScatter = Math.random() * 2 * Math.PI;
    const phiScatter = Math.acos(2 * Math.random() - 1);
    
    const scatterX = rScatter * Math.sin(phiScatter) * Math.cos(thetaScatter);
    const scatterY = rScatter * Math.sin(phiScatter) * Math.sin(thetaScatter);
    const scatterZ = rScatter * Math.cos(phiScatter);

    // --- ROTATION ---
    // Tree Rotation: Point outwards from center
    // We look at the center, then flip
    const lookAtPos = new Vector3(0, treeY, 0);
    const currentPos = new Vector3(finalTreeX, treeY, finalTreeZ);
    // Helper to calculate rotation
    const dummyObj = new Object3D();
    dummyObj.position.copy(currentPos);
    dummyObj.lookAt(lookAtPos);
    // Branches point out (-Z in local space usually, depends on geo)
    // Adjust logic to make cones point OUT
    if (type === 'branch') {
       dummyObj.rotation.x -= Math.PI / 2; // Point cone tip out
       dummyObj.rotation.x += randomRange(-0.2, 0.2); // Random tilt
       dummyObj.rotation.z += randomRange(-0.2, 0.2); // Random roll
    } else {
       dummyObj.rotation.set(randomRange(0, Math.PI), randomRange(0, Math.PI), randomRange(0, Math.PI));
    }
    const treeRot = dummyObj.rotation.clone();

    // Scatter Rotation: Random
    const scatterRot = new Euler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    // --- SCALE ---
    let scale = 1;
    if (type === 'branch') scale = randomRange(0.8, 1.4) * (1 - t * 0.4); // Smaller at top
    if (type === 'ornament') scale = randomRange(0.8, 1.3);

    data.push({
      treePos: [finalTreeX, treeY, finalTreeZ],
      scatterPos: [scatterX, scatterY, scatterZ],
      treeRot: [treeRot.x, treeRot.y, treeRot.z],
      scatterRot: [scatterRot.x, scatterRot.y, scatterRot.z],
      scale: scale,
    });
  }
  return data;
};

// Generic Instanced Morph Component
const MorphingInstances: React.FC<{
  count: number;
  type: 'branch' | 'ornament';
  meshRef: React.RefObject<InstancedMesh>;
  geometry: React.ReactNode;
  material: React.ReactNode;
  seedOffset: number;
  isAssembled: boolean;
  baseScale: number;
}> = ({ count, type, meshRef, geometry, material, seedOffset, isAssembled, baseScale }) => {
  
  const data = useMemo(() => generateTransformData(count, type, seedOffset), [count, type, seedOffset]);
  const dummy = useMemo(() => new Object3D(), []);

  // Animation progress ref (0 = scatter, 1 = tree)
  const progress = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smoothly interpolate progress
    const target = isAssembled ? 1 : 0;
    // Damping for smooth cinematic transition
    progress.current = MathUtils.damp(progress.current, target, 2.5, delta);
    
    // Animate every instance
    data.forEach((item, i) => {
      const p = progress.current;

      // Interpolate Position
      dummy.position.set(
        MathUtils.lerp(item.scatterPos[0], item.treePos[0], p),
        MathUtils.lerp(item.scatterPos[1], item.treePos[1], p),
        MathUtils.lerp(item.scatterPos[2], item.treePos[2], p)
      );

      // Interpolate Rotation (using Quaternions for smoothness would be better, but Euler lerp is okay for this chaos)
      // For simple chaos -> order transition, direct Euler lerp usually looks fine if we normalize angles, 
      // but let's just lerp the values.
      dummy.rotation.set(
        MathUtils.lerp(item.scatterRot[0], item.treeRot[0], p),
        MathUtils.lerp(item.scatterRot[1], item.treeRot[1], p),
        MathUtils.lerp(item.scatterRot[2], item.treeRot[2], p)
      );
      
      // Floating effect when scattered (add noise to position based on time)
      if (p < 0.95) {
         const t = state.clock.getElapsedTime();
         dummy.position.y += Math.sin(t * 0.5 + i) * 0.05 * (1 - p);
         dummy.rotation.y += delta * 0.2 * (1 - p);
      }

      // Scale transition (pop in effect)
      const s = item.scale * baseScale * (0.5 + 0.5 * p); // Start smaller in scatter
      dummy.scale.set(s, s, s);

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      {geometry}
      {material}
    </instancedMesh>
  );
};


// --- Main Component ---
interface ArixTreeProps {
  isAssembled: boolean;
}

export const ArixTree: React.FC<ArixTreeProps> = ({ isAssembled }) => {
  const branchesRef = useRef<InstancedMesh>(null);
  const goldOrnRef = useRef<InstancedMesh>(null);
  const redOrnRef = useRef<InstancedMesh>(null);
  const pearlOrnRef = useRef<InstancedMesh>(null);
  
  const starRef = useRef<Object3D>(null);
  const starProgress = useRef(0);

  // Star Animation
  useFrame((state, delta) => {
    if (starRef.current) {
        const target = isAssembled ? 1 : 0;
        starProgress.current = MathUtils.damp(starProgress.current, target, 2, delta);
        
        const p = starProgress.current;
        
        // Star Morph: From random high point to tree top
        const startY = 4;
        const startX = 3;
        const endY = 2.6; // Top of tree
        
        starRef.current.position.set(
            MathUtils.lerp(startX, 0, p),
            MathUtils.lerp(startY, endY, p),
            0
        );

        // Scale up when assembling
        const s = MathUtils.lerp(0.1, 1, p);
        starRef.current.scale.set(s, s, s);
        
        // Spin
        starRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* 1. BRANCHES (Pine Needles) */}
      <MorphingInstances
        count={NEEDLE_COUNT}
        type="branch"
        meshRef={branchesRef}
        seedOffset={0}
        isAssembled={isAssembled}
        baseScale={0.35}
        geometry={<coneGeometry args={[0.3, 1.2, 5]} />} // Elongated cones for pine tufts
        material={<EmeraldMaterial />}
      />

      {/* 2. GOLD ORNAMENTS */}
      <MorphingInstances
        count={ORNAMENT_GOLD_COUNT}
        type="ornament"
        meshRef={goldOrnRef}
        seedOffset={123}
        isAssembled={isAssembled}
        baseScale={0.25}
        geometry={<dodecahedronGeometry args={[1, 0]} />} // Diamond/Geodesic look
        material={<OrnamentGoldMaterial />}
      />

      {/* 3. RED ORNAMENTS */}
      <MorphingInstances
        count={ORNAMENT_RED_COUNT}
        type="ornament"
        meshRef={redOrnRef}
        seedOffset={456}
        isAssembled={isAssembled}
        baseScale={0.25}
        geometry={<sphereGeometry args={[0.8, 16, 16]} />}
        material={<OrnamentRedMaterial />}
      />

      {/* 4. PEARL ORNAMENTS */}
      <MorphingInstances
        count={ORNAMENT_PEARL_COUNT}
        type="ornament"
        meshRef={pearlOrnRef}
        seedOffset={789}
        isAssembled={isAssembled}
        baseScale={0.22}
        geometry={<sphereGeometry args={[0.8, 16, 16]} />}
        material={<OrnamentPearlMaterial />}
      />

      {/* 5. TOP STAR */}
      <group ref={starRef}>
         <mesh>
            <dodecahedronGeometry args={[0.5, 0]} />
            <StarMaterial />
         </mesh>
         <pointLight distance={4} intensity={10} color="#fffacd" decay={2} />
      </group>

      {/* Floating Sparkles that are always there for atmosphere */}
      <Sparkles 
        count={300} 
        scale={[10, 10, 10]} 
        size={3} 
        speed={0.4} 
        opacity={isAssembled ? 0.8 : 0.3} 
        color="#FFD700" 
      />

      {/* Base Platform (Fades in) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2.5, 0]} 
        scale={isAssembled ? [1,1,1] : [0,0,0]} // Hide when scattered
        receiveShadow
      >
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial color="#00150f" roughness={0.1} metalness={0.9} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};