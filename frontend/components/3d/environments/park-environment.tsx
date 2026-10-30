function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.14, 1, 10]} />
        <meshStandardMaterial color="#6b4a2f" />
      </mesh>
      <mesh position={[0, 1.25, 0]} castShadow>
        <coneGeometry args={[0.6, 1.3, 12]} />
        <meshStandardMaterial color="#4f7a3d" />
      </mesh>
      <mesh position={[0, 1.75, 0]} castShadow>
        <coneGeometry args={[0.42, 0.9, 12]} />
        <meshStandardMaterial color="#5c8a47" />
      </mesh>
    </group>
  );
}

export function ParkEnvironment() {
  return (
    <group>
      {/* grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#6fa35a" />
      </mesh>

      {/* path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -0.5]}>
        <planeGeometry args={[1.4, 6]} />
        <meshStandardMaterial color="#cdb98f" />
      </mesh>

      <Tree position={[-2.2, 0, -2.2]} />
      <Tree position={[2.4, 0, -2.6]} />
      <Tree position={[-1.6, 0, -4]} />

      {/* bench, off to the side so it doesn't occlude the character */}
      <mesh position={[1, 0.28, -1.5]} castShadow>
        <boxGeometry args={[0.9, 0.08, 0.35]} />
        <meshStandardMaterial color="#8a6239" />
      </mesh>
      <mesh position={[0.68, 0.12, -1.63]}>
        <boxGeometry args={[0.08, 0.24, 0.08]} />
        <meshStandardMaterial color="#4a3321" />
      </mesh>
      <mesh position={[1.32, 0.12, -1.63]}>
        <boxGeometry args={[0.08, 0.24, 0.08]} />
        <meshStandardMaterial color="#4a3321" />
      </mesh>

      {/* sky dome tint */}
      <mesh position={[0, 3, -5]}>
        <planeGeometry args={[14, 7]} />
        <meshStandardMaterial color="#bfe0f2" />
      </mesh>

      <ambientLight intensity={0.7} color="#fffaf0" />
      <directionalLight position={[3, 5, 2]} intensity={1.1} color="#fff6d8" castShadow />
      <pointLight position={[-2, 1.5, 1]} intensity={0.25} color="#eaffde" />
      <fog attach="fog" args={["#cfe9c8", 5, 12]} />
    </group>
  );
}
