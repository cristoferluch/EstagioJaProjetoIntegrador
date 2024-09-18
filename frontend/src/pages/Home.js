import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, useGLTF, OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import './Home.css';
import sceneGlb from '../assets/scene.glb';

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
            <h1>EstágioJá <p style={{ letterSpacing: '1px', fontSize: '40pt', textShadow: '#000000b8 1px 1px 5px' }}>Explore oportunidades que vão impulsionar sua trajetória profissional e prepare-se para o futuro!</p> </h1>

            <Canvas dpr={[1.5, 2]} linear shadows>
                <fog attach="fog" args={['#272730', 16, 30]} />
                <ambientLight intensity={0.75} />
                <PerspectiveCamera makeDefault position={[0, 5, 16]} fov={83}>
                    <pointLight intensity={1500} position={[-15, 10, -10]} />
                    <spotLight castShadow intensity={2.25} angle={0.2} penumbra={1} position={[-25, 20, -15]} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0001} />
                </PerspectiveCamera>
                <Suspense fallback={null}>
                    <Model url={sceneGlb} />
                </Suspense>
                <OrbitControls autoRotate enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
                <Stars radius={500} depth={50} count={1000} factor={10} />
            </Canvas>
            <div className="layer" />
            <Loader />
        </>
    )
}
