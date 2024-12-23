import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

 
const getResponsiveValues = () => {
  const isMobile = window.innerWidth <= 768;
  return {
    cameraZ: isMobile ? 6 : 4,
    modelScale: isMobile ? 0.5 : 0.8,
    initialX: isMobile ? -2 : -3,
    circleRadius: isMobile ? 1.5 : 2,
    verticalOffset: isMobile ? 0.3 : 0.5,
    finalY: isMobile ? 1 : 2,
    finalZ: isMobile ? -1 : -2
  };
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

 
const values = getResponsiveValues();
camera.position.z = values.cameraZ;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100, 100, 100);
scene.add(directionalLight);

let mixer;
let helicopterModel;
const loader = new GLTFLoader();

loader.load(
  "./animated_civilian_helicopter.glb",
  (gltf) => {
    console.log("model loaded", gltf);
    helicopterModel = gltf.scene;
    mixer = new THREE.AnimationMixer(helicopterModel);
    mixer.clipAction(gltf.animations[0]).play();
    
    const values = getResponsiveValues();
    helicopterModel.position.set(values.initialX, 0, 0);
    helicopterModel.rotation.y = 1.5;
    helicopterModel.scale.set(values.modelScale, values.modelScale, values.modelScale);
    
    scene.add(helicopterModel);
    setupScrollAnimations();
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

function setupScrollAnimations() {
  const values = getResponsiveValues();

 
  gsap.timeline({
    scrollTrigger: {
      trigger: "#intro",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        if (helicopterModel) {
          helicopterModel.position.x = values.initialX + (self.progress * (Math.abs(values.initialX) * 2));
          helicopterModel.position.y = Math.sin(self.progress * Math.PI) * values.verticalOffset;
        }
      }
    }
  });

 
  gsap.timeline({
    scrollTrigger: {
      trigger: "#about",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        if (helicopterModel) {
          const angle = self.progress * Math.PI * 2;
          helicopterModel.position.x = Math.cos(angle) * values.circleRadius;
          helicopterModel.position.z = Math.sin(angle) * values.circleRadius;
          helicopterModel.rotation.y = angle + Math.PI / 2;
        }
      }
    }
  });

 
  gsap.timeline({
    scrollTrigger: {
      trigger: "#conclusion",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        if (helicopterModel) {
          helicopterModel.position.x = values.initialX - (self.progress * Math.abs(values.initialX));
          helicopterModel.position.y = self.progress * values.finalY;
          helicopterModel.position.z = values.finalZ * self.progress;
          helicopterModel.rotation.x = self.progress * 0.2;
        }
      }
    }
  });
}

 
window.addEventListener('resize', () => {
  const values = getResponsiveValues();
  
 
  camera.position.z = values.cameraZ;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
 
  renderer.setSize(window.innerWidth, window.innerHeight);
  
 
  if (helicopterModel) {
    helicopterModel.scale.set(values.modelScale, values.modelScale, values.modelScale);
  }
});

function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (mixer) mixer.update(0.02);
}

animate();