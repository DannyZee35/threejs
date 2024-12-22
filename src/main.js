import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
 const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 4;
 

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  alpha:true
});
renderer.setSize(window.innerWidth, window.innerHeight);

const light = new THREE.AmbientLight(0xffffff, 1);  
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100, 100, 100);
let mixer;
const loader = new GLTFLoader();

loader.load(
  "./animated_civilian_helicopter.glb",
  (gltf) => {
    console.log("model loaded", gltf);
    const model = gltf.scene;
   
    mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(gltf.animations[0]).play();
   
    model.position.y=-1
    model.rotation.y = 1.5; 
    
    scene.add(model);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if(mixer)  mixer.update(0.02)
}

animate();
