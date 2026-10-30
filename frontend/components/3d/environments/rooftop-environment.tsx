function Building({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#454b6b" emissive="#2a2e48" emissiveIntensity={0.4} />
    </mesh>
  );
}

export function RooftopEnvironment() {
  return (
    <group>
      {/* rooftop deck */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#6b6f7a" />
      </mesh>

      {/* skyline, far behind the character */}
      <Building position={[-3, 2, -7]} size={[1.6, 4, 1.6]} />
      <Building position={[-0.6, 2.8, -8]} size={[1.8, 5.6, 1.8]} />
      <Building position={[2, 1.8, -7.5]} size={[1.4, 3.6, 1.4]} />
      <Building position={[3.6, 2.4, -8.5]} size={[2, 4.8, 2]} />

      {/* glass railing, off to the side so it doesn't occlude the character */}
      <mesh position={[0, 0.5, -2.6]}>
        <boxGeometry args={[3.2, 1, 0.04]} />
        <meshStandardMaterial color="#9fb3c8" transparent opacity={0.25} />
      </mesh>

      {/* small side table */}
      <mesh position={[1, 0.45, -1.6]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.06, 20]} />
        <meshStandardMaterial color="#1f1f24" />
      </mesh>
      <mesh position={[1, 0.22, -1.6]}>
        <cylinderGeometry args={[0.04, 0.04, 0.45, 10]} />
        <meshStandardMaterial color="#1f1f24" />
      </mesh>

      {/* string lights, suggested with small emissive spheres */}
      {[-1.5, -0.5, 0.5, 1.5].map((x) => (
        <mesh key={x} position={[x, 2.2, -1]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ffd98a" emissive="#ffd98a" emissiveIntensity={1.4} />
        </mesh>
      ))}

      {/* dusk sky */}
      <mesh position={[0, 3, -9]}>
        <planeGeometry args={[18, 8]} />
        <meshStandardMaterial color="#6e5c92" emissive="#d98c66" emissiveIntensity={0.25} />
      </mesh>

      <ambientLight intensity={0.75} color="#b3aee0" />
      <directionalLight position={[-3, 3, -2]} intensity={0.9} color="#f0a878" />
      <pointLight position={[0, 1.8, 1.5]} intensity={0.9} color="#ffe2b0" castShadow />
      <pointLight position={[0, 2.2, -1]} intensity={0.6} color="#ffd98a" />
      <fog attach="fog" args={["#5b5180", 6, 14]} />
    </group>
  );
}
