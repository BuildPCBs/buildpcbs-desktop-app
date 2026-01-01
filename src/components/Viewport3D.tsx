import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";
import { EnclosureSpec, ViewSettings } from "../types";

interface Viewport3DProps {
  enclosure: EnclosureSpec;
  viewSettings: ViewSettings;
}

function EnclosureRenderer({
  enclosure,
  viewSettings,
}: {
  enclosure: EnclosureSpec;
  viewSettings: ViewSettings;
}) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame((_state, delta) => {
    meshRef.current.rotation.y += delta * 0.1;
  });

  const { length, width, height } = enclosure.dimensions;
  const { wallThickness } = enclosure;
  const { exploded, clipping } = viewSettings;

  // Scaling factor: 1 unit = 10mm
  const s = (val: number) => val / 10;

  const w = s(width);
  const h = s(height);
  const l = s(length);
  const t = s(wallThickness);

  // Exploded Offset
  const lidOffset = exploded ? 2 : 0; // 2 units = 20mm

  // Clipping Plane (Y-plane at standard height)
  // We use the basic clippingPlanes property of material.
  // Note: For R3F, we need to make sure 'localClippingEnabled' is true on the renderer (set in <Canvas>).
  const clippingPlanes = clipping
    ? [
        new THREE.Plane(
          new THREE.Vector3(0, -1, 0),
          exploded ? h / 2 + lidOffset - 0.1 : h / 2 - 0.1
        ),
      ]
    : [];

  // NOTE: A simpler clipping approach for now is just not to render the Lid if clipping is on.
  // Real clipping planes can be complex. Let's do that for the MVP requested.
  // "Clipping Plane so we can cut through the model" - usually means a real plane.
  // Let's attach a global clipping plane at Y=0 for simplicity if that's what's asked.
  // But wait, "cut through so we can see interior". Removing the lid does that.
  // Let actually implement a clipping plane at Y = 2 (arbitrary) or center.
  // Actually, standard ClippingPlane usage:
  // plane constant determines position. (0, -1, 0) cuts everything ABOVE the plane.

  const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1); // Cuts Y > 1

  return (
    <group ref={meshRef}>
      {/* Floor */}
      <mesh position={[0, -h / 2 + t / 2, 0]}>
        <boxGeometry args={[w, t, l]} />
        <meshStandardMaterial color="#0038DF" />
      </mesh>

      {/* Lid */}
      {/* If clipping is fully enabled, we might want to hide the lid or clip it. */}
      <mesh position={[0, h / 2 - t / 2 + lidOffset, 0]}>
        <boxGeometry args={[w, t, l]} />
        <meshStandardMaterial
          color="#0038DF"
          clippingPlanes={clipping ? [clipPlane] : []}
        />
      </mesh>

      {/* Front Wall (+Z) */}
      <mesh position={[0, 0, l / 2 - t / 2]}>
        <boxGeometry args={[w, h - t * 2, t]} />
        <meshStandardMaterial
          color="#0038DF"
          clippingPlanes={clipping ? [clipPlane] : []}
        />
      </mesh>

      {/* Back Wall (-Z) */}
      <mesh position={[0, 0, -l / 2 + t / 2]}>
        <boxGeometry args={[w, h - t * 2, t]} />
        <meshStandardMaterial
          color="#0038DF"
          clippingPlanes={clipping ? [clipPlane] : []}
        />
      </mesh>

      {/* Left Wall (-X) */}
      <mesh position={[-w / 2 + t / 2, 0, 0]}>
        <boxGeometry args={[t, h - t * 2, l - t * 2]} />
        <meshStandardMaterial
          color="#0038DF"
          clippingPlanes={clipping ? [clipPlane] : []}
        />
      </mesh>

      {/* Right Wall (+X) */}
      <mesh position={[w / 2 - t / 2, 0, 0]}>
        <boxGeometry args={[t, h - t * 2, l - t * 2]} />
        <meshStandardMaterial
          color="#0038DF"
          clippingPlanes={clipping ? [clipPlane] : []}
        />
      </mesh>
    </group>
  );
}

export function Viewport3D({ enclosure, viewSettings }: Viewport3DProps) {
  return (
    <div className="w-full h-full bg-black overflow-hidden shadow-inner relative">
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        gl={{ localClippingEnabled: true }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <spotLight
          position={[20, 20, 20]}
          angle={0.25}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <EnclosureRenderer enclosure={enclosure} viewSettings={viewSettings} />

        <Grid
          position={[0, -5, 0]}
          args={[50, 50]}
          cellColor="#0038DF"
          sectionColor="#FFFFFF"
          fadeDistance={50}
        />

        <OrbitControls makeDefault />
      </Canvas>

      <div className="absolute top-4 left-4 text-[#0038DF] text-xs px-2 py-1 rounded pointer-events-none font-mono">
        {enclosure.dimensions.length}x{enclosure.dimensions.width}x
        {enclosure.dimensions.height}mm
      </div>
    </div>
  );
}
