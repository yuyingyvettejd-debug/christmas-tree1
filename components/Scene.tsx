import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { ArixTree } from './ArixTree';

interface SceneProps {
  isAssembled: boolean;
}

const Scene: React.FC<SceneProps> = ({ isAssembled }) => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-arix-emeraldDark">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1, 10], fov: 45 }}
        gl={{ antialias: false, toneMappingExposure: 1.2 }}
      >
        <Environment preset="city" background={false} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <color attach="background" args={['#011a11']} />
        
        <ambientLight intensity={0.4} color="#004225" />
        <spotLight
          position={[10, 15, 10]}
          angle={0.2}
          penumbra={1}
          intensity={1200}
          castShadow
          shadow-bias={-0.0001}
          color="#FFD700"
        />
        <spotLight
          position={[-10, 5, -10]}
          angle={0.3}
          penumbra={1}
          intensity={600}
          color="#4ade80"
        />
        <pointLight position={[0, -2, 2]} intensity={40} color="#FEDC56" distance={8} />

        <Suspense fallback={null}>
          <ArixTree isAssembled={isAssembled} />
          
          <ContactShadows 
            opacity={0.6} 
            scale={12} 
            blur={3} 
            far={4} 
            resolution={256} 
            color="#000000" 
          />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 1.8}
          minDistance={6}
          maxDistance={14}
          autoRotate={isAssembled} // Only rotate when tree is formed
          autoRotateSpeed={0.5}
          dampingFactor={0.05}
        />

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={1.2} 
            mipmapBlur 
            intensity={1.2} 
            radius={0.7}
          />
          <Bloom 
            luminanceThreshold={0.6} 
            mipmapBlur 
            intensity={0.3} 
            radius={0.4}
          />
          <Noise opacity={0.03} />
          <Vignette eskil={false} offset={0.1} darkness={0.7} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Scene;