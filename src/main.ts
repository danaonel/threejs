import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'dat.gui'

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)
scene.fog = new THREE.Fog(0x87ceeb, 30, 80)

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(8, 5, 12)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 2, 0)

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const sunLight = new THREE.DirectionalLight(0xfffbe0, 1.5)
sunLight.position.set(12, 18, 10)
sunLight.castShadow = true
sunLight.shadow.mapSize.set(2048, 2048)
sunLight.shadow.camera.near = 0.5
sunLight.shadow.camera.far = 60
sunLight.shadow.camera.left = -15
sunLight.shadow.camera.right = 15
sunLight.shadow.camera.top = 15
sunLight.shadow.camera.bottom = -15
scene.add(sunLight)

// Ground
const groundGeo = new THREE.PlaneGeometry(40, 40)
const groundMat = new THREE.MeshStandardMaterial({ color: 0x4a7c5e })
const ground = new THREE.Mesh(groundGeo, groundMat)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

// House dimensions
const houseWidth = 5
const houseHeight = 3.5
const houseDepth = 6

// Walls
const wallsGeo = new THREE.BoxGeometry(houseWidth, houseHeight, houseDepth)
const wallsMat = new THREE.MeshStandardMaterial({ color: 0xf5deb3 })
const walls = new THREE.Mesh(wallsGeo, wallsMat)
walls.position.y = houseHeight / 2
walls.castShadow = true
walls.receiveShadow = true
scene.add(walls)

// Door
const doorGeo = new THREE.BoxGeometry(0.9, 1.8, 0.05)
const doorMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e })
const door = new THREE.Mesh(doorGeo, doorMat)
door.position.set(0, 0.9, houseDepth / 2 + 0.01)
scene.add(door)

// A-frame roof — triangular prism via ExtrudeGeometry
const overhangX = 0.4
const overhangZ = 0.3
const roofHeight = 2.5
const halfW = houseWidth / 2 + overhangX
const roofDepth = houseDepth + overhangZ * 2

const roofShape = new THREE.Shape()
roofShape.moveTo(-halfW, 0)
roofShape.lineTo(halfW, 0)
roofShape.lineTo(0, roofHeight)
roofShape.closePath()

const roofGeo = new THREE.ExtrudeGeometry(roofShape, {
  depth: roofDepth,
  bevelEnabled: false,
})
roofGeo.translate(0, 0, -roofDepth / 2)



const roofImageOptions = {
  shinglesA: 'pewter-gray-gaf-roof-shingles-0487552-64_600.jpg',
  shinglesB: 'Vinyl-Round-Shingles-87924804.jpg',
  shinglesC: 'antique-slate-gaf-roof-shingles-0711014-64_600.jpg',
}

const roofTextureLoader = new THREE.TextureLoader()
const roofTextureCache = new Map<string, THREE.Texture>()
const roofCapTextureCache = new Map<string, THREE.Texture>()

function getRoofTexture(fileName: string): THREE.Texture {
  let texture = roofTextureCache.get(fileName)
  if (!texture) {
    texture = roofTextureLoader.load(`./img/${encodeURIComponent(fileName)}`)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(0.5, 0.5)
    texture.center.set(0.5, 0.5)
    texture.rotation = 0 * Math.PI
    roofTextureCache.set(fileName, texture)
  }
  return texture
}

function getRoofCapTexture(fileName: string): THREE.Texture {
  let texture = roofCapTextureCache.get(fileName)
  if (!texture) {
    texture = roofTextureLoader.load(`./img/${encodeURIComponent(fileName)}`)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(0.5, 0.5)
    texture.center.set(0.5, 0.5)
    texture.rotation = Math.PI / 2
    roofCapTextureCache.set(fileName, texture)
  }
  return texture
}

const roofMat = new THREE.MeshStandardMaterial({ map: getRoofTexture(roofImageOptions.shinglesA) })
const gableRoofMat = new THREE.MeshStandardMaterial({ map: getRoofCapTexture(roofImageOptions.shinglesA) })
const roof = new THREE.Mesh(roofGeo, [roofMat, gableRoofMat, gableRoofMat])
roof.position.set(0, houseHeight, 0)
roof.castShadow = true
roof.receiveShadow = true
scene.add(roof)

// Front and back gable attic walls (triangular, wall colour)
const gableShape = new THREE.Shape()
gableShape.moveTo(-houseWidth / 2, 0)
gableShape.lineTo(houseWidth / 2, 0)
gableShape.lineTo(0, roofHeight)
gableShape.closePath()
const gableGeo = new THREE.ShapeGeometry(gableShape)

const frontGable = new THREE.Mesh(gableGeo, wallsMat)
frontGable.position.set(0, houseHeight, houseDepth / 2 + 0.002)
frontGable.castShadow = true
frontGable.receiveShadow = true
scene.add(frontGable)

const backGable = new THREE.Mesh(gableGeo, wallsMat)
backGable.position.set(0, houseHeight, -(houseDepth / 2 + 0.002))
backGable.rotation.y = Math.PI
backGable.castShadow = true
backGable.receiveShadow = true
scene.add(backGable)

// Roof ridge line (visual accent)
const ridgeGeo = new THREE.CylinderGeometry(0.05, 0.05, roofDepth, 8)
const ridgeMat = new THREE.MeshStandardMaterial({ color: 0x5a1a1a })
const ridge = new THREE.Mesh(ridgeGeo, ridgeMat)
ridge.rotation.x = Math.PI / 2
ridge.position.set(0, houseHeight + roofHeight, 0)
scene.add(ridge)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const stats = new Stats()
document.body.appendChild(stats.dom)

// GUI
const gui = new GUI()

const roofFolder = gui.addFolder('Roof')
const roofTextureActions: Record<string, () => void> = {}
for (const [buttonLabel, fileName] of Object.entries(roofImageOptions)) {
  roofTextureActions[buttonLabel] = () => {
    roofMat.map = getRoofTexture(fileName)
    roofMat.needsUpdate = true
    gableRoofMat.map = getRoofCapTexture(fileName)
    gableRoofMat.needsUpdate = true
  }
  roofFolder.add(roofTextureActions, buttonLabel)
}
roofFolder.add(roofMat, 'wireframe')
roofFolder.open()

const wallsFolder = gui.addFolder('Walls')
wallsFolder.addColor({ color: 0xf5deb3 }, 'color').onChange((v: number) => wallsMat.setValues({ color: v })).name('color')
wallsFolder.add(wallsMat, 'wireframe')
wallsFolder.open()

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
  stats.update()
}

animate()