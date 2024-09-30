import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, useGLTF, OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import './Home.css';
import sceneGlb from '../assets/scene.glb';
import Button from '@mui/material/Button';

function Model({ url }) {
    const { nodes } = useGLTF(url)
    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} scale={7}>
            <group rotation={[Math.PI / 13.5, -Math.PI / 5.8, Math.PI / 5.6]}>
                <mesh receiveShadow castShadow geometry={nodes.planet002.geometry} material={nodes.planet002.material} />
                <mesh geometry={nodes.planet003.geometry} material={nodes.planet003.material} />
            </group>
        </group>
    )
}

export default function Home() {
    return (
        <>
            <div className="bg" />
            <h1>EstágioJá <p style={{ letterSpacing: '1px', fontSize: '38pt', textShadow: '#000000b8 1px 1px 5px' }}>Explore oportunidades que vão impulsionar sua trajetória profissional e prepare-se para o futuro!</p><Button variant="contained" style={{ zIndex: 9999 }}>Ver vagas</Button></h1>

            <div className="canvas-stars">
                <Canvas dpr={[1.5, 2]} linear shadows>
                    <fog attach="fog" args={['#272730', 16, 30]} />
                    <ambientLight intensity={1000} />
                    <Stars radius={500} depth={10} count={2000} factor={10} />
                </Canvas>
            </div>

            <div className="canvas-rocket">
                <Canvas dpr={[1.5, 2]} linear shadows>
                    <ambientLight intensity={1} />
                    <PerspectiveCamera makeDefault position={[15, 0, 15]} fov={80}>
                        <pointLight intensity={1600} position={[-15, 10, -10]} />
                        <spotLight castShadow intensity={4.25} angle={0.2} penumbra={5} position={[-25, 20, -15]} shadow-mapSize={[2048, 2048]} shadow-bias={-0.0005} />
                    </PerspectiveCamera>
                    <Suspense fallback={null}>
                        <Model url={sceneGlb} />
                    </Suspense>
                    <OrbitControls autoRotate enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
                </Canvas>
            </div>

            <div className="layer" />
            <Loader />
        </>
    );
}
