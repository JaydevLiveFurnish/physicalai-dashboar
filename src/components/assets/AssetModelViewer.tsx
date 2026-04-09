import { Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";

/** GLB via primitive + material pass */
function GltfPrimitive({ url }: { url: string }) {
  const gltf = useGLTF(url);
  const scene = useMemo(() => {
    const s = gltf.scene.clone(true);
    s.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) {
          if (m instanceof THREE.MeshStandardMaterial) {
            m.envMapIntensity = 0.8;
          }
        }
      }
    });
    return s;
  }, [gltf.scene]);
  return <primitive object={scene} />;
}

function SceneContent({ url }: { url: string }) {
  return (
    <Center>
      <GltfPrimitive url={url} />
    </Center>
  );
}

function GltfLoadingOverlay() {
  const { active, progress } = useProgress();
  const pct = Math.max(0, Math.min(100, Math.round(Number.isFinite(progress) ? progress : 0)));
  const show = active || (progress > 0 && progress < 100);

  if (!show) return null;

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-[var(--s-300)] bg-[var(--surface-page-secondary)]/88 px-[var(--s-500)] backdrop-blur-[3px]"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading 3D model"
    >
      <div className="w-full max-w-[min(280px,86%)] space-y-[var(--s-200)]">
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--border-default-secondary)]">
          <div
            className="h-full rounded-full bg-[var(--surface-primary-default)] transition-[width] duration-200 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-center text-[11px] font-medium tracking-[0.02em] text-[var(--text-default-body)]">
          Loading 3D asset{pct > 0 ? ` · ${pct}%` : ""}
        </p>
      </div>
    </div>
  );
}

export function AssetModelViewer({ url }: { url: string }) {
  useEffect(() => {
    useGLTF.preload(url);
  }, [url]);

  return (
    <div className="relative h-full min-h-0 w-full min-w-0 touch-none">
      <Canvas
        className="relative z-0 h-full w-full !h-full"
        camera={{ position: [1.25, 0.85, 1.35], fov: 42, near: 0.01, far: 200 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 10, 5]} intensity={1.05} />
        <directionalLight position={[-4, 2, -3]} intensity={0.35} />
        <Suspense fallback={null}>
          <SceneContent url={url} />
        </Suspense>
        <OrbitControls
          makeDefault
          enablePan
          enableZoom
          minDistance={0.35}
          maxDistance={6}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI - 0.1}
        />
      </Canvas>
      <GltfLoadingOverlay />
      <p className="pointer-events-none absolute bottom-[var(--s-200)] left-[var(--s-200)] right-[var(--s-200)] text-center text-[11px] text-[var(--text-default-placeholder)]">
        Drag to orbit · scroll to zoom
      </p>
    </div>
  );
}
