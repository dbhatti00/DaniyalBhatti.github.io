import * as THREE from './models/three/three/build/three.module.js';
import { GLTFLoader } from './models/three/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './models/three/three/examples/jsm/loaders/DRACOLoader.js';


document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll('.image-grid');
   
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of the image is in view

    images.forEach(image => observer.observe(image));
});

document.getElementById('shoe').addEventListener('click', function() {
    window.location.href = 'shoe.html'; 
})


document.getElementById('material').addEventListener('click', function() {
    window.location.href = 'material.html'; 
})

document.getElementById('Samus').addEventListener('click', function() {
    window.location.href = 'samus.html'; 
})
document.getElementById('Tiefling').addEventListener('click', function() {
    window.location.href = 'Tiefling.html'; 
})
