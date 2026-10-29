export function CafeEnvironment() {
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#d8c4a8" />
      </mesh>

      {/* back wall */}
      <mesh position={[0, 2.5, -3]}>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#efe3d0" />
      </mesh>

      {/* window */}
      <mesh position={[-2.5, 2.7, -2.98]}>
        <planeGeometry args={[2, 2.6]} />
        <meshStandardMaterial color="#bfe3f0" emissive="#bfe3f0" emissiveIntensity={0.4} />
      </mesh>

      {/* table, off to the side so it doesn't occlude the character */}
      <mesh position={[0.9, 0.5, -1.6]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.08, 24]} />
        <meshStandardMaterial color="#7a5133" />
      </mesh>
      <mesh position={[0.9, 0.25, -1.6]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
        <meshStandardMaterial color="#4a3321" />
      </mesh>

      <ambientLight intensity={0.55} color="#fff1e0" />
      <pointLight position={[2, 3, 2]} intensity={0.9} color="#ffddaa" castShadow />
      <directionalLight position={[-3, 4, 2]} intensity={0.35} />
      {/* soft fill so the avatar doesn't read as flat from the front */}
      <pointLight position={[0, 1.2, 1.5]} intensity={0.3} color="#ffe9d6" />
      <fog attach="fog" args={["#e8d9c4", 4, 10]} />
    </group>
  );
}
