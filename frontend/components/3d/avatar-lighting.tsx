import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

/** A studio-style three-point lighting rig built entirely from procedural
 * Lightformers (no HDRI fetch - everything renders offline), plus real
 * scene lights for direct specular highlights and a soft contact shadow
 * under the character. Shared by CharacterBust and DateScene so every
 * avatar reads with the same realistic, soft-shaded look. */
export function AvatarLighting() {
  return (
    <>
      <ambientLight intensity={0.35} color="#fff3ea" />
      {/* key */}
      <directionalLight
        position={[2.2, 2.6, 2]}
        intensity={1.3}
        color="#fff1df"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* fill */}
      <pointLight position={[-2, 0.6, 1.4]} intensity={0.4} color="#c9b8ff" />
      {/* rim */}
      <pointLight position={[-0.6, 1.8, -1.6]} intensity={0.9} color="#ff9fae" />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={1.1} position={[2, 2, 1]} scale={3} color="#ffe8d6" />
        <Lightformer form="rect" intensity={0.5} position={[-3, 1, 2]} scale={4} color="#cbb8ff" />
        <Lightformer form="ring" intensity={0.8} position={[0, 2.5, -2]} scale={2} color="#ffd6d6" />
      </Environment>

      <ContactShadows
        position={[0, 0, -0.8]}
        opacity={0.35}
        scale={3}
        blur={2.4}
        far={1.2}
      />
    </>
  );
}
