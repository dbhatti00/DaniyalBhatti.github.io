import * as THREE from './assets/three/three/build/three.module.js';
import { GLTFLoader } from './assets/three/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './assets/three/three/examples/jsm/loaders/DRACOLoader.js';

//old import method:
//import * as THREE from 'three';
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });

// FIX: cap pixel ratio at 2 — without this, mobile renders at CSS pixel
// resolution (blurry on retina screens), and uncapped devicePixelRatio on
// high-end phones (3x) tanks frame rate for no visible benefit.
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

const scene = new THREE.Scene();
// Set up a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1;
camera.position.y = .5;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const loadingElement = document.getElementById('loading');
const pdfdownload = document.getElementById('resumedownload');
const emailcopy = document.getElementById('Email');
const linkedinbutton = document.getElementById('linkedin');
const closeButton = document.getElementById('close-about');
const modelDiv = document.getElementById('model');
modelDiv.appendChild(renderer.domElement);
const model = document.getElementById('model');
const aboutWindow = document.getElementById('about-window');
const name = document.querySelector('.name'); 
const aboutButton = document.getElementById('about');
const portfolioButton = document.getElementById('projects');

scene.background = new THREE.Color(0xF5FFFC);
const intersectionPoint = new THREE.Vector3();
const target = new THREE.Object3D();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();
const mousePosition = new THREE.Vector2();
let mixer;
let armAnimationClip;

let headBone;  
let followMouse = true; 

let tabletModel;
let tabletModel2;
const newRotationX = THREE.MathUtils.degToRad(90); 
const newRotationY = THREE.MathUtils.degToRad(0);  
const newRotationZ = THREE.MathUtils.degToRad(180); 
const newRotationX2 = THREE.MathUtils.degToRad(90); 
const newRotationY2 = THREE.MathUtils.degToRad(0);  
const newRotationZ2 = THREE.MathUtils.degToRad(180);

loadingElement.style.display = 'block';

portfolioButton.classList.add('disabled');
aboutButton.classList.add('disabled');

const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/'); // Update this path
let loader = new GLTFLoader().setPath('/assets/');
loader.setDRACOLoader(dracoLoader);



loader.load('me13.glb', (glb) => {

  const mesh = glb.scene;
  console.log(glb.scene);
    // Center the model
    const box = new THREE.Box3().setFromObject(mesh);
    const center = new THREE.Vector3();
    box.getCenter(center);
    mesh.position.sub(center);

    // Scale the model
    mesh.scale.set(1, 1, 1);
    tabletModel = glb.scene.getObjectByName("tablet");
  
    
    scene.add(mesh);
    portfolioButton.classList.remove('disabled');
    aboutButton.classList.remove('disabled');
    loadingElement.style.display = 'none'; // FIX: was never hidden after load, so the spinner sat on top of the canvas forever (worse on small screens where it covers more of the model)

const animations = glb.animations;
const armAnimationName = 'metarigAction';

armAnimationClip = animations.find(animation => animation.name === armAnimationName);

if (!armAnimationClip) {
    console.error(`Arm animation clip not found for: "${armAnimationName}". Please double-check the animation name.`);
    return; 
}
if (animations && animations.length) {
    mixer = new THREE.AnimationMixer(mesh); 
    
    const blinkAction = mixer.clipAction(animations.find(clip => clip.name === 'Key.003Action')); // Change this line
   
    if (blinkAction) {
        blinkAction.play(); // Play the blink animation
    }
}

    headBone = mesh.getObjectByName('head');
   headBone.rotation.x = Math.PI / 2;
        
}, undefined, (error) => {
    console.error('Model loading error:', error);
});

let lastUpdateTime = 0;

function updateTargetFromClientPoint(clientX, clientY) {
    mousePosition.x = (clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(clientY / window.innerHeight) * 2.5 + 1;
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mousePosition, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    target.position.set(intersectionPoint.x, intersectionPoint.y, 2);
}

window.addEventListener('mousemove', function(e) {
    const now = Date.now();
    if (now - lastUpdateTime < 16) return; // Update every ~16ms (60fps)
    lastUpdateTime = now;
    updateTargetFromClientPoint(e.clientX, e.clientY);
});

// FIX: mousemove never fires on touch devices, so the head-follow effect
// simply didn't do anything on mobile. Mirror it to touch input.
window.addEventListener('touchmove', function(e) {
    if (!e.touches || !e.touches.length) return;
    const now = Date.now();
    if (now - lastUpdateTime < 16) return;
    lastUpdateTime = now;
    const touch = e.touches[0];
    updateTargetFromClientPoint(touch.clientX, touch.clientY);
}, { passive: true });

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedResize = debounce(onWindowResize, 200);

window.addEventListener('resize', debouncedResize);

// FIX: plain 'resize' is unreliable on mobile — orientation changes and the
// address bar showing/hiding don't always fire it consistently, and
// window.innerHeight briefly reports a stale value during the transition.
window.addEventListener('orientationchange', function() {
    // small delay lets the browser settle innerWidth/innerHeight after rotation
    setTimeout(onWindowResize, 300);
});

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', debouncedResize);
}

// Animate the head to follow the mouse
let isAnimating = true; // Default is true if there's an initial animation
function animate() {
    if (isAnimating) {
        requestAnimationFrame(animate);
        if (mixer) mixer.update(0.01);
        if (followMouse && headBone) headBone.lookAt(target.position);
        renderer.render(scene, camera);
    }
}


async function loadGSAP() {
    const { gsap } = await import('gsap');
    return gsap;
}

function startAnimation() {
    isAnimating = true;
    animate();
}



// Start and stop as needed
startAnimation();

     
       
          aboutButton.addEventListener('click', function() {
           
            
            followMouse = false; // Disable mouse following
            const targetHeadRotation = new THREE.Vector3(Math.PI / 1.65, 0, 0);
            // Move the model to the right
            model.classList.add('move-right');
            
            // Show the "About" window
            aboutWindow.classList.add('show');
           

            const animateHeadRotation = () => {
                headBone.rotation.x += (targetHeadRotation.x - headBone.rotation.x) * 0.05; // Smooth transition
                headBone.rotation.y += (targetHeadRotation.y - headBone.rotation.y) * 0.05;
                headBone.rotation.z += (targetHeadRotation.z - headBone.rotation.z) * 0.05;
        
                if (Math.abs(headBone.rotation.x - targetHeadRotation.x) > 0.01 ||
                    Math.abs(headBone.rotation.y - targetHeadRotation.y) > 0.01 ||
                    Math.abs(headBone.rotation.z - targetHeadRotation.z) > 0.01) {
                    requestAnimationFrame(animateHeadRotation); // Keep animating until close enough
                }
                else {
                   
                    if (armAnimationClip) {
                        const action = mixer.clipAction(armAnimationClip);
                        action.play(); // Play the arm animation
                    } else {
                        console.error("Arm animation clip not found");
                    }
                }
            };
            animateHeadRotation();
            linkedinbutton.addEventListener('click', function() {
                window.open('https://www.linkedin.com/in/daniyal-bhatti/', '_blank');
            })
            
            pdfdownload.addEventListener('click', function() {
                window.open('/assets/Daniyal_Bhatti_Resume.pdf', '_blank');
            })
            
            emailcopy.addEventListener('click', function() {
                const customText = "daniyal.h.bhatti";
            
                  
                  const tempInput = document.createElement('input');
                  tempInput.value = customText;
                  
               
                  document.body.appendChild(tempInput);
                  tempInput.select();
                  tempInput.setSelectionRange(0, 99999);  
            
                  
                  document.execCommand('copy');
            
                
                  document.body.removeChild(tempInput);
            
                
                  alert('Custom text copied to clipboard: ' + customText);
            })

        });
         
        closeButton.addEventListener('click', function() {
            if (armAnimationClip) {
                const action = mixer.clipAction(armAnimationClip);
                action.stop(); // Play the arm animation
            }
            followMouse = true;
            model.classList.remove('move-right');
            aboutWindow.classList.remove('show'); 
        });

        

        document.getElementById('projects').addEventListener('click', async function() {
           
   
   
  


           
gsap.to(tabletModel.rotation, {
    x: newRotationX,
    y: newRotationY,
    z: newRotationZ,
    duration: 1.5,  
    ease: "power1.inOut"
});



gsap.to(camera.position, {
    
   
    z: 0.1,
    x: -0.08,
    y: 0.08,
    duration: 2, 
    ease: "power1.inOut",
    
});
gsap.to(camera.rotation, {
    
    
    x:-.5,
    duration: 2, 
    ease: "power1.inOut", 
    
});

setTimeout(function() {
    window.location.href = 'portfolio.html'; 
  }, 1800); 
  aboutWindow.classList.remove('show');
  model.classList.remove('move-right');
  name.style.transform = 'translateY(-100)'; // Move the name up
  name.style.opacity = '0'; // Fade out
  aboutButton.style.opacity = '0'; // Fade out
  portfolioButton.style.opacity = '0';

})

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
    }
});