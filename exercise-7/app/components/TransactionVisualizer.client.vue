<script setup lang="ts">
import type { IXrplTransaction, ITransactionVisual } from '~/types'
import {
  TRANSACTION_COLORS,
  MAX_VISIBLE_SHAPES,
  SHAPE_LIFETIME_MS,
} from '~/utils/constants'

type THREE = typeof import('three')

const { currentBatch } = useXrplStream()

const canvasRef = ref<HTMLDivElement | null>(null)
const hoveredTx = ref<ITransactionVisual | null>(null)
const tooltipPos = ref({ x: 0, y: 0 })

let T: THREE
let scene: InstanceType<THREE['Scene']>
let camera: InstanceType<THREE['PerspectiveCamera']>
let renderer: InstanceType<THREE['WebGLRenderer']>
let raycaster: InstanceType<THREE['Raycaster']>
let mouse: InstanceType<THREE['Vector2']>
let animationId: number
let sceneReady = false

interface ShapeEntry {
  mesh: InstanceType<THREE['Mesh']>
  velocity: InstanceType<THREE['Vector3']>
  createdAt: number
  data: ITransactionVisual
}

const shapes: ShapeEntry[] = []
const geometryCache: Record<string, InstanceType<THREE['BufferGeometry']>> = {}

function getGeometry(type: string): InstanceType<THREE['BufferGeometry']> {
  if (geometryCache[type]) return geometryCache[type]

  switch (type) {
    case 'Payment':
      geometryCache[type] = new T.SphereGeometry(0.4, 16, 16)
      break
    case 'OfferCreate':
      geometryCache[type] = new T.BoxGeometry(0.6, 0.6, 0.6)
      break
    case 'NFTokenMint':
      geometryCache[type] = new T.TorusGeometry(0.35, 0.12, 8, 16)
      break
    case 'EscrowCreate':
      geometryCache[type] = new T.ConeGeometry(0.35, 0.7, 8)
      break
    default:
      geometryCache[type] = new T.SphereGeometry(0.2, 8, 8)
  }
  return geometryCache[type]
}

function getColor(type: string): number {
  return TRANSACTION_COLORS[type] ?? TRANSACTION_COLORS.default
}

function addTransactionShape(tx: IXrplTransaction, index: number, total: number): void {
  if (!sceneReady) return

  const geometry = getGeometry(tx.type)
  const color = getColor(tx.type)
  const material = new T.MeshPhongMaterial({
    color,
    transparent: true,
    opacity: 0.85,
    shininess: 80,
  })

  const mesh = new T.Mesh(geometry, material)

  const angle = (index / Math.max(total, 1)) * Math.PI * 2
  const radius = 1.5 + Math.random() * 2
  mesh.position.set(
    Math.cos(angle) * radius,
    (Math.random() - 0.5) * 3,
    Math.sin(angle) * radius,
  )

  const velocity = new T.Vector3(
    (Math.random() - 0.5) * 0.008,
    0.003 + Math.random() * 0.005,
    (Math.random() - 0.5) * 0.008,
  )

  scene.add(mesh)

  shapes.push({
    mesh,
    velocity,
    createdAt: Date.now(),
    data: {
      id: tx.hash,
      type: tx.type,
      account: tx.account,
      amount: tx.amount,
      destination: tx.destination,
      meshIndex: shapes.length,
    },
  })

  while (shapes.length > MAX_VISIBLE_SHAPES) {
    const removed = shapes.shift()
    if (removed) {
      scene.remove(removed.mesh)
      removed.mesh.geometry.dispose()
      ;(removed.mesh.material as InstanceType<THREE['Material']>).dispose()
    }
  }
}

function initScene(): void {
  if (!canvasRef.value) return

  scene = new T.Scene()
  scene.background = new T.Color(0x000000)

  const rect = canvasRef.value.getBoundingClientRect()
  camera = new T.PerspectiveCamera(60, rect.width / rect.height, 0.1, 100)
  camera.position.set(0, 2, 8)
  camera.lookAt(0, 0, 0)

  renderer = new T.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(rect.width, rect.height)
  canvasRef.value.appendChild(renderer.domElement)

  const ambientLight = new T.AmbientLight(0x404040, 2)
  scene.add(ambientLight)

  const pointLight = new T.PointLight(0xffffff, 1.5, 50)
  pointLight.position.set(5, 10, 5)
  scene.add(pointLight)

  const pointLight2 = new T.PointLight(0xffffff, 0.8, 50)
  pointLight2.position.set(-5, -5, 5)
  scene.add(pointLight2)

  const gridHelper = new T.GridHelper(20, 20, 0x222222, 0x111111)
  gridHelper.position.y = -3
  scene.add(gridHelper)

  raycaster = new T.Raycaster()
  mouse = new T.Vector2()

  renderer.domElement.addEventListener('mousemove', onMouseMove)
  renderer.domElement.addEventListener('click', onClick)
  sceneReady = true
}

function onMouseMove(event: MouseEvent): void {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  tooltipPos.value = { x: event.clientX - rect.left + 12, y: event.clientY - rect.top - 12 }
}

function findHitEntry(): ShapeEntry | null {
  if (!raycaster || !mouse || !camera) return null
  raycaster.setFromCamera(mouse, camera)
  const meshes = shapes.map(s => s.mesh)
  const intersects = raycaster.intersectObjects(meshes)
  if (intersects.length === 0) return null
  return shapes.find(s => s.mesh === intersects[0].object) ?? null
}

function checkHover(): void {
  const entry = findHitEntry()
  hoveredTx.value = entry?.data ?? null
  if (renderer) {
    renderer.domElement.style.cursor = entry ? 'pointer' : 'default'
  }
}

function onClick(): void {
  const entry = findHitEntry()
  if (entry) {
    window.open(`https://livenet.xrpl.org/transactions/${entry.data.id}`, '_blank', 'noopener,noreferrer')
  }
}

function animate(): void {
  animationId = requestAnimationFrame(animate)
  if (!sceneReady) return
  const now = Date.now()

  for (let i = shapes.length - 1; i >= 0; i--) {
    const entry = shapes[i]
    const age = now - entry.createdAt
    const lifeRatio = age / SHAPE_LIFETIME_MS

    if (lifeRatio >= 1) {
      scene.remove(entry.mesh)
      entry.mesh.geometry.dispose()
      ;(entry.mesh.material as InstanceType<THREE['Material']>).dispose()
      shapes.splice(i, 1)
      continue
    }

    entry.mesh.position.add(entry.velocity)
    entry.mesh.rotation.x += 0.005
    entry.mesh.rotation.y += 0.008

    const material = entry.mesh.material as InstanceType<THREE['MeshPhongMaterial']>
    material.opacity = 0.85 * (1 - lifeRatio * 0.7)
  }

  camera.position.x = Math.sin(now * 0.0001) * 0.5
  camera.lookAt(0, 0, 0)

  checkHover()
  renderer.render(scene, camera)
}

function onResize(): void {
  if (!canvasRef.value || !sceneReady) return
  const rect = canvasRef.value.getBoundingClientRect()
  camera.aspect = rect.width / rect.height
  camera.updateProjectionMatrix()
  renderer.setSize(rect.width, rect.height)
}

watch(currentBatch, (batch) => {
  if (!batch.length || !sceneReady) return
  batch.forEach((tx, i) => addTransactionShape(tx, i, batch.length))
})

onMounted(async () => {
  T = await import('three')
  initScene()
  animate()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  sceneReady = false
  window.removeEventListener('resize', onResize)
  cancelAnimationFrame(animationId)
  renderer?.domElement?.removeEventListener('mousemove', onMouseMove)
  renderer?.domElement?.removeEventListener('click', onClick)

  for (const entry of shapes) {
    scene?.remove(entry.mesh)
    entry.mesh.geometry.dispose()
    ;(entry.mesh.material as InstanceType<THREE['Material']>).dispose()
  }
  shapes.length = 0

  for (const key of Object.keys(geometryCache)) {
    geometryCache[key].dispose()
    delete geometryCache[key]
  }

  renderer?.dispose()
})
</script>

<template>
  <div class="relative">
    <div ref="canvasRef" class="w-full h-[500px] border border-#222 bg-black" />

    <div
      v-if="hoveredTx"
      class="absolute pointer-events-none bg-#111 border border-#222 px-4 py-3 z-10 max-w-xs"
      :style="{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }"
    >
      <p class="text-sm font-semibold text-white">{{ hoveredTx.type }}</p>
      <p class="text-xs font-mono text-#888 break-all mt-1">{{ hoveredTx.account }}</p>
      <p v-if="hoveredTx.amount" class="text-xs text-#888 mt-1">Amount: {{ hoveredTx.amount }}</p>
      <p v-if="hoveredTx.destination" class="text-xs font-mono text-#888 mt-1 break-all">
        To: {{ hoveredTx.destination }}
      </p>
      <p class="text-xs text-#888 mt-2 border-t border-#222 pt-2">Click to open in explorer</p>
    </div>
  </div>
</template>
