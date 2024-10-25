import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



const renderer = new THREE.WebGLRenderer({ antialias: true });







const scene = new THREE.Scene();
// Set up a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1;
camera.position.y = .5;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const closeportButton = document.getElementById('close-portfolio');
const pdfdownload = document.getElementById('resumedownload');
const emailcopy = document.getElementById('Email');
const linkedinbutton = document.getElementById('linkedin');
const closeButton = document.getElementById('close-about');
const modelDiv = document.getElementById('model');
modelDiv.appendChild(renderer.domElement);
const model = document.getElementById('model');
const aboutWindow = document.getElementById('about-window');
const portfolioWindow = document.getElementById('portfolio-window');
const name = document.querySelector('.name'); // Select your name element
const aboutButton = document.getElementById('about');
const portfolioButton = document.getElementById('projects');

scene.background = new THREE.Color(0xf5f5dc); // Light Gray
const intersectionPoint = new THREE.Vector3();
const target = new THREE.Object3D();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();
const mousePosition = new THREE.Vector2();
let mixer;
let armAnimationClip;
// Load your 3D model
let headBone;  // Variable to store the head bone
let followMouse = true; // Flag to control head movement

let tabletModel;
const newRotationX = THREE.MathUtils.degToRad(90); 
const newRotationY = THREE.MathUtils.degToRad(0);  
const newRotationZ = THREE.MathUtils.degToRad(180); 

const overlay = document.getElementById('overlay');
const loader = new GLTFLoader().setPath('/Models/');



window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / this.window.innerHeight) * 2.5 + 1;
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mousePosition, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    target.position.set(intersectionPoint.x, intersectionPoint.y, 2);
});





loader.load('Me11.glb', (glb) => {

  const mesh = glb.scene;
    
    // Center the model
    const box = new THREE.Box3().setFromObject(mesh);
    const center = new THREE.Vector3();
    box.getCenter(center);
    mesh.position.sub(center);

    // Scale the model
    mesh.scale.set(1, 1, 1);
    tabletModel = glb.scene.getObjectByName("tablet");
    
    scene.add(mesh);

const animations = glb.animations;
const armAnimationName = 'metarigAction'; // Replace this with the name you think is correct

armAnimationClip = animations.find(animation => animation.name === armAnimationName);

if (!armAnimationClip) {
    console.error(`Arm animation clip not found for: "${armAnimationName}". Please double-check the animation name.`);
    return; // Exit if the animation clip is not found
}
if (animations && animations.length) {
    mixer = new THREE.AnimationMixer(mesh); // Create the mixer
    
    const blinkAction = mixer.clipAction(animations.find(clip => clip.name === 'Key.003Action')); // Change this line
   
    if (blinkAction) {
        blinkAction.play(); // Play the blink animation
    }
}




    
    headBone = mesh.getObjectByName('head');
    // Find the head bone (assuming the head is rigged)
   headBone.rotation.x = Math.PI / 2;
        
            
       

    
    
    
    

    
    

}, undefined, (error) => {
    console.error('Model loading error:', error);
});


// Mouse movement listener



// Animate the head to follow the mouse
function animate() {
    requestAnimationFrame(animate);
    if (mixer) {
        mixer.update(0.01); // Adjust the time delta as needed
    }

    
    // Rotate head based on mouse movement
    if (followMouse) {
    if (headBone) {
        
       headBone.lookAt(target.position);
    }
    }
    
    renderer.render(scene, camera);
}
animate();

      // Get the elements for the model and about window
    

    
          // Move the model to the right
       
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
                    // Play the arm animation here if it's defined
                    if (armAnimationClip) {
                        const action = mixer.clipAction(armAnimationClip);
                        action.play(); // Play the arm animation
                    } else {
                        console.error("Arm animation clip not found");
                    }
                }
            };
            animateHeadRotation();
        });
         
        closeButton.addEventListener('click', function() {
            if (armAnimationClip) {
                const action = mixer.clipAction(armAnimationClip);
                action.stop(); // Play the arm animation
            }
            followMouse = true;
            model.classList.remove('move-right');
            aboutWindow.classList.remove('show'); // Remove the "show" class to hide it
        });

        

portfolioButton.addEventListener('click',function(){
   
    aboutWindow.classList.remove('show');
    model.classList.remove('move-right');
    name.style.transform = 'translateY(-100)'; // Move the name up
    name.style.opacity = '0'; // Fade out
    aboutButton.style.opacity = '0'; // Fade out
    portfolioButton.style.opacity = '0';
   
  


// Animate the rotation using GSAP
gsap.to(tabletModel.rotation, {
    x: newRotationX,
    y: newRotationY,
    z: newRotationZ,
    duration: 1.5,  // Animation lasts for 2 seconds
    ease: "power1.inOut"
});
gsap.to(camera.position, {
    
   
    z: 0.1,
    x: -0.08,
    y: 0.08,
    duration: 2, // Duration of animation in seconds
    ease: "power1.inOut", // Easing function for smoothness
    
});
gsap.to(camera.rotation, {
    
    
    x:-.5,
    duration: 2, // Duration of animation in seconds
    ease: "power1.inOut", // Easing function for smoothness
    
});

setTimeout(function() {
    window.location.href = 'portfolio.html'; // Change to your target page
  }, 1800); // Match this time with the transition duration in CSS



})

closeportButton.addEventListener('click', function() {

    
    name.style.opacity = '100'; // Fade out
    aboutButton.style.opacity = '100'; // Fade out
    portfolioButton.style.opacity = '100';
   
  


// Animate the rotation using GSAP
gsap.to(tabletModel.rotation, {
    x: 0,
    y:0,
    z: 0,
    duration: 1.5,  // Animation lasts for 2 seconds
    ease: "power1.inOut"
});
gsap.to(camera.position, {
    
   
    z: 1,
    x: 0,
    y: .5,
    duration: 2, // Duration of animation in seconds
    ease: "power1.inOut", // Easing function for smoothness
    
});
gsap.to(camera.rotation, {
    
    
    x:0,
    duration: 2, // Duration of animation in seconds
    ease: "power1.inOut", // Easing function for smoothness
    
});
portfolioWindow.classList.remove('show');
});
// Handle resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

linkedinbutton.addEventListener('click', function() {
    window.open('https://www.linkedin.com/in/daniyal-bhatti/', '_blank');
})

pdfdownload.addEventListener('click', function() {
    window.open('/Models/Daniyal_Bhatti_Resume.pdf', '_blank');
})

emailcopy.addEventListener('click', function() {
    const customText = "danibatty00@gmail.com";

      // Create a temporary input element
      const tempInput = document.createElement('input');
      tempInput.value = customText;
      
      // Add the input to the body and select its content
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.setSelectionRange(0, 99999);  // For mobile devices

      // Copy the selected text
      document.execCommand('copy');

      // Remove the temporary input element
      document.body.removeChild(tempInput);

      // Optional: Give feedback
      alert('Custom text copied to clipboard: ' + customText);
})
