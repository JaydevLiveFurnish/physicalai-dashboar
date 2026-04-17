import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

interface GLBViewerProps {
  glbPath: string
  fallbackImage: string
  className?: string
}

function fitCameraToSelection(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  selection: THREE.Object3D[],
  fitOffset = 1.2,
) {
  if (camera.fov > 25) {
    camera.fov = 25
  }

  const box = new THREE.Box3()
  for (const object of selection) {
    box.expandByObject(object)
  }

  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)

  const maxSize = Math.max(size.x, size.y, size.z)
  const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360))
  const fitWidthDistance = fitHeightDistance / camera.aspect
  const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance)

  const direction = controls.target
    .clone()
    .sub(camera.position)
    .normalize()
    .multiplyScalar(distance)

  controls.maxDistance = distance * 10
  controls.target.copy(center)

  camera.near = distance / 100
  camera.far = distance * 100
  camera.updateProjectionMatrix()
  camera.position.copy(controls.target).sub(direction)
  controls.update()
}

export default function GLBViewer({ glbPath, fallbackImage, className }: GLBViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    setFailed(false)
    setLoading(true)

    // ========== Scene & Environment ==========
    const scene = new THREE.Scene()

    // Cubemap for material envMap reflections
    const cubeLoader = new THREE.CubeTextureLoader()
    const textureCube = cubeLoader.load([
      '/envmap/fishermans_bastion/posx.jpg',
      '/envmap/fishermans_bastion/negx.jpg',
      '/envmap/fishermans_bastion/posy.jpg',
      '/envmap/fishermans_bastion/negy.jpg',
      '/envmap/fishermans_bastion/posz.jpg',
      '/envmap/fishermans_bastion/negz.jpg',
    ])

    // Gradient background via canvas texture
    const bgCanvas = document.createElement('canvas')
    bgCanvas.width = 512
    bgCanvas.height = 512
    const ctx = bgCanvas.getContext('2d')!
    const gradient = ctx.createLinearGradient(0, 0, 0, bgCanvas.height)
    gradient.addColorStop(0, '#f5f5f5')
    gradient.addColorStop(1, '#e0e0e0')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height)
    scene.background = new THREE.CanvasTexture(bgCanvas)

    // ========== Camera ==========
    const { clientWidth, clientHeight } = container
    const camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 10000)

    // Set camera at -25 degree angle using polar coordinates
    const radius = 60
    const angle = THREE.MathUtils.degToRad(-25)
    const x = radius * Math.sin(angle)
    const z = radius * Math.cos(angle)
    camera.position.set(x, 0, z)
    camera.lookAt(0, 0, 0)

    // ========== Renderer ==========
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
    renderer.setSize(clientWidth, clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    // @ts-ignore - deprecated but works in the installed Three.js version
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.setClearColor(0xffffff, 1)
    container.appendChild(renderer.domElement)

    // HDR environment map for scene lighting
    const hdrLoader = new RGBELoader()
    hdrLoader.load('/envmap/hdri/forest_slope_1k.hdr', (texture: THREE.Texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      scene.environment = texture
      renderer.toneMappingExposure = 0.4
    })

    // ========== Post-processing ==========
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))

    // ========== Lights ==========
    const dirLight = new THREE.DirectionalLight(0xffffff, 2)
    dirLight.position.set(5, 10, 5)
    dirLight.castShadow = true
    const ambientLight = new THREE.AmbientLight(0x222222)
    scene.add(dirLight, ambientLight)

    // ========== Controls ==========
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // ========== Load GLB with DRACO ==========
    const loader = new GLTFLoader()
    const draco = new DRACOLoader()
    draco.setDecoderPath('/draco/')
    draco.setDecoderConfig({ type: 'js' })
    loader.setDRACOLoader(draco)

    loader.load(
      glbPath,
      (gltf: { scene: THREE.Group }) => {
        const model = gltf.scene
        model.position.set(0, 0, 0)

        // Apply cubemap envMap for reflections on materials
        model.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            const mat = mesh.material as THREE.MeshStandardMaterial
            mat.envMap = textureCube
            mat.needsUpdate = true
          }
        })

        scene.add(model)
        fitCameraToSelection(camera, controls, [model], 1.5)
        setLoading(false)
      },
      undefined,
      () => {
        setFailed(true)
        setLoading(false)
      },
    )

    // ========== Animate Loop ==========
    let animId: number
    function animate() {
      animId = requestAnimationFrame(animate)
      controls.update()
      dirLight.position.copy(camera.position)
      dirLight.rotation.copy(camera.rotation)
      composer.render()
    }
    animate()

    // ========== Resize ==========
    const ro = new ResizeObserver(() => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
    })
    ro.observe(container)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      controls.dispose()
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => {
              const mat = material as THREE.MeshStandardMaterial
              if (mat.map) mat.map.dispose()
              mat.dispose()
            })
          } else {
            const mat = mesh.material as THREE.MeshStandardMaterial
            if (mat.map) mat.map.dispose()
            mat.dispose()
          }
        }
      })
      scene.clear()
      const disposableComposer = composer as EffectComposer & { dispose?: () => void }
      if (disposableComposer.dispose) disposableComposer.dispose()
      renderer.dispose()
      draco.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [glbPath])

  if (failed) {
    return (
      <div className={className} style={{ background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={fallbackImage}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          color: '#999',
          fontSize: '14px',
        }}>
          Loading 3D model...
        </div>
      )}
    </div>
  )
}
