import * as THREE from './models/three/three/build/three.module.js';
import { GLTFLoader } from './models/three/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './models/three/three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from './models/three/three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const zoomableImages = document.querySelectorAll('.zoomable');
const overlay = document.getElementById('imageZoomOverlay');
const zoomedImg = document.getElementById('zoomedImage');
let scale = 1;



const camera = new THREE.PerspectiveCamera(75, window.innerWidght / window.innerHeight, 0.1, 1000);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let object;

let controls;

let objToRender = 'Tiefling';


scene.background = new THREE.Color(0x222220);

//Load the file
let loader = new GLTFLoader().setPath('/');
loader.load('tiefling.glb', (glb) => {
    //If the file is loaded, add it to the scene
    object = glb.scene;
    scene.add(object);

  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);




if (objToRender === "Tiefling") {
  controls = new OrbitControls(camera, renderer.domElement);
 // Set initial camera position
  camera.rotation.x = -0.2;
  camera.position.set(0, 1.3, 1.3);

  // Set the point you want the camera to orbit around
  controls.target.set(0, 1, 0); // This is usually the model's head or center

  // Apply the target immediately
  controls.update();
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);
onWindowResize(); // Call it once at the start too
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  renderer.render(scene, camera);
}
animate();

zoomableImages.forEach(img => {
  img.addEventListener('click', () => {
    zoomedImg.src = img.src;
    overlay.classList.add('active');
  });
});

overlay.addEventListener('click', () => {
  overlay.classList.remove('active');
  zoomedImg.src = '';
});

