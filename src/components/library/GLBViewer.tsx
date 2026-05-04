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

function toPhysicalMaterial(mat: THREE.Material): THREE.MeshPhysicalMaterial {
  // Already physical — just ensure envMapIntensity is set
  if (mat instanceof THREE.MeshPhysicalMaterial) {
    mat.envMapIntensity = 2.0
    mat.needsUpdate = true
    return mat
  }

  const phys = new THREE.MeshPhysicalMaterial()

  // Common base properties
  phys.name = mat.name
  phys.opacity = mat.opacity
  phys.transparent = mat.transparent
  phys.alphaTest = mat.alphaTest
  phys.side = mat.side
  phys.visible = mat.visible
  phys.envMapIntensity = 2.0

  if (mat instanceof THREE.MeshStandardMaterial) {
    // Full 1:1 copy of all standard PBR channels
    phys.color.copy(mat.color)
    phys.map = mat.map
    phys.roughness = mat.roughness
    phys.roughnessMap = mat.roughnessMap
    phys.metalness = mat.metalness
    phys.metalnessMap = mat.metalnessMap
    phys.normalMap = mat.normalMap
    phys.normalScale.copy(mat.normalScale)
    phys.bumpMap = mat.bumpMap
    phys.bumpScale = mat.bumpScale
    phys.emissive.copy(mat.emissive)
    phys.emissiveMap = mat.emissiveMap
    phys.emissiveIntensity = mat.emissiveIntensity
    phys.aoMap = mat.aoMap
    phys.aoMapIntensity = mat.aoMapIntensity
    phys.alphaMap = mat.alphaMap
    phys.lightMap = mat.lightMap
    phys.lightMapIntensity = mat.lightMapIntensity
    phys.displacementMap = mat.displacementMap
    phys.displacementScale = mat.displacementScale
    phys.displacementBias = mat.displacementBias
  } else if (mat instanceof THREE.MeshPhongMaterial) {
    phys.color.copy(mat.color)
    phys.map = mat.map
    phys.normalMap = mat.normalMap
    phys.normalScale.copy(mat.normalScale)
    phys.bumpMap = mat.bumpMap
    phys.bumpScale = mat.bumpScale
    phys.emissive.copy(mat.emissive)
    phys.emissiveMap = mat.emissiveMap
    phys.emissiveIntensity = mat.emissiveIntensity
    phys.aoMap = mat.aoMap
    phys.aoMapIntensity = mat.aoMapIntensity
    phys.alphaMap = mat.alphaMap
    phys.lightMap = mat.lightMap
    phys.lightMapIntensity = mat.lightMapIntensity
    phys.displacementMap = mat.displacementMap
    phys.displacementScale = mat.displacementScale
    phys.displacementBias = mat.displacementBias
    // shininess 0–100+ → roughness 1→0
    phys.roughness = Math.max(0, 1.0 - Math.min(mat.shininess / 100, 1.0))
    phys.metalness = mat.specular.r > 0.5 ? 0.6 : 0.0
  } else if (mat instanceof THREE.MeshLambertMaterial) {
    phys.color.copy(mat.color)
    phys.map = mat.map
    phys.emissive.copy(mat.emissive)
    phys.emissiveMap = mat.emissiveMap
    phys.emissiveIntensity = mat.emissiveIntensity
    phys.aoMap = mat.aoMap
    phys.aoMapIntensity = mat.aoMapIntensity
    phys.alphaMap = mat.alphaMap
    phys.lightMap = mat.lightMap
    phys.lightMapIntensity = mat.lightMapIntensity
    phys.roughness = 0.9
    phys.metalness = 0.0
  } else if (mat instanceof THREE.MeshBasicMaterial) {
    phys.color.copy(mat.color)
    phys.map = mat.map
    phys.alphaMap = mat.alphaMap
    phys.aoMap = mat.aoMap
    phys.aoMapIntensity = mat.aoMapIntensity
    phys.lightMap = mat.lightMap
    phys.lightMapIntensity = mat.lightMapIntensity
    phys.roughness = 1.0
    phys.metalness = 0.0
  }

  phys.needsUpdate = true
  return phys
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

    // Clean studio white gradient background
    // const bgCanvas = document.createElement('canvas')
    // bgCanvas.width = 512
    // bgCanvas.height = 512
    // const ctx = bgCanvas.getContext('2d')!
    // const gradient = ctx.createRadialGradient(256, 200, 0, 256, 256, 380)
    // gradient.addColorStop(0, '#ffffff')
    // gradient.addColorStop(1, '#ffffff')
    // ctx.fillStyle = gradient
    // ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height)
    // scene.background = new THREE.CanvasTexture(bgCanvas)

    // ========== Camera ==========
    const { clientWidth, clientHeight } = container
    const camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 10000)
    camera.up.set(0, 0, 1)

    // Set camera at -25 degree angle using polar coordinates (Z-up: orbit in XY plane)
    const radius = 60
    const angle = THREE.MathUtils.degToRad(-25)
    const x = radius * Math.sin(angle)
    const y = radius * Math.cos(angle)
    camera.position.set(x, y, radius * 0.3)
    camera.lookAt(0, 0, 0)

    // ========== Renderer ==========
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
    renderer.setSize(clientWidth, clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.8
    renderer.setClearColor(0xffffff, 1)
    container.appendChild(renderer.domElement)

    // HDR environment — drives PBR reflections on metallic/specular surfaces
    const hdrLoader = new RGBELoader()
    hdrLoader.load('/envmap/hdri/brown_photostudio_02_2k.hdr', (texture: THREE.Texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      scene.environment = texture
      // Keep exposure at 1.0 — let PBR reflections do the work for metallic objects
    })

    // ========== Post-processing ==========
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))

    // ========== Lights ==========
    // Ambient — flat base fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
    scene.add(ambientLight)

    // Directional light parented to the camera so it always faces the object
    // from the viewer's direction regardless of orbit position
    const dirLight = new THREE.DirectionalLight(0xffffff, 3)
    dirLight.position.set(0, 0, 0)  // slightly in front of camera in camera-local space
    camera.add(dirLight)
    scene.add(camera)

    // ========== Controls ==========
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // ========== Load GLB with DRACO ==========
    const loader = new GLTFLoader()
    const draco = new DRACOLoader()
    draco.setDecoderPath('/draco/')
    draco.setDecoderConfig({ type: 'js' })
    loader.setDRACOLoader(draco)

    let loaded = false
    let cancelled = false
    const loadTimeout = setTimeout(() => {
      if (!loaded && !cancelled) {
        setFailed(true)
        setLoading(false)
      }
    }, 30000)

    loader.load(
      glbPath,
      (gltf: { scene: THREE.Group }) => {
        loaded = true
        clearTimeout(loadTimeout)
        if (cancelled) return
        const model = gltf.scene
        model.position.set(0, 0, 0)
        model.rotation.z = THREE.MathUtils.degToRad(240)

        // Convert all materials to MeshPhysicalMaterial
        model.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            if (Array.isArray(mesh.material)) {
              mesh.material = mesh.material.map(toPhysicalMaterial)
            } else {
              mesh.material = toPhysicalMaterial(mesh.material)
            }
          }
        })

        scene.add(model)
        fitCameraToSelection(camera, controls, [model], 1.5)
        // Recover from a timeout-triggered failed state if the model
        // eventually arrives — hide the fallback image overlay.
        setFailed(false)
        setLoading(false)
      },
      undefined,
      () => {
        loaded = true
        clearTimeout(loadTimeout)
        if (cancelled) return
        setFailed(true)
        setLoading(false)
      },
    )

    // ========== Animate Loop ==========
    let animId: number
    function animate() {
      animId = requestAnimationFrame(animate)
      controls.update()
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
      cancelled = true
      clearTimeout(loadTimeout)
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
      if (composer.dispose) composer.dispose()
      renderer.dispose()
      draco.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [glbPath])

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative' }}>
      {loading && !failed && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          color: '#999',
          fontSize: '14px',
          zIndex: 1,
        }}>
          Loading 3D model...
        </div>
      )}
      {failed && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}>
          <img
            src={fallbackImage}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}
    </div>
  )
}
