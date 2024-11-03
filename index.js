import * as THREE from './three.js-master/three.js-master/build/three.module.js';

const canvas = document.querySelector(".webgl")
const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
})

const boxMesh = new THREE.Mesh(geometry,material)
scene.add(boxMesh)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100)
camera.position.set(0,1,2)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.gammaOutput = true
renderer.render(scene, camera)
