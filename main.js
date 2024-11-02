import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light setup
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Room setup (walls, floor, and ceiling)
const roomGeometry = new THREE.BoxGeometry(20, 20, 20);
const roomMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.BackSide });
const room = new THREE.Mesh(roomGeometry, roomMaterial);
scene.add(room);

// Cog setup
const cogGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
const cogMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
for (let i = 0; i < 5; i++) {
    const cog = new THREE.Mesh(cogGeometry, cogMaterial);
    cog.position.set(Math.random() * 16 - 8, Math.random() * 16 - 8, Math.random() * 16 - 8);
    cog.rotation.x = Math.random() * Math.PI;
    cog.rotation.y = Math.random() * Math.PI;
    scene.add(cog);
}

// Pipe setup
const pipeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10, 32);
const pipeMaterial = new THREE.MeshPhongMaterial({ color: 0x0000FF });
for (let i = 0; i < 3; i++) {
    const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
    pipe.position.set(Math.random() * 16 - 8, Math.random() * 16 - 8, Math.random() * 16 - 8);
    pipe.rotation.z = Math.random() * Math.PI / 2;
    scene.add(pipe);
}

camera.position.z = 30;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();