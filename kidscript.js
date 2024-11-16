
let renderImage = document.getElementById('renderImage');
let wireframeImage = document.getElementById('wireframeImage');
let isWireframeVisible = false; // Track if the wireframe is visible

document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll('.main-image');
   
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
window.onload = function() {
    document.getElementById("image-toggle").onclick = toggleImage;
}

document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll('.description-box');
   
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



function toggleImage() {
    var image = document.getElementById("image-toggle");
    
    if (image.src.includes("kid.png")) {
        image.src = "models/kidposed.png"; // Replace with the path to your wireframe image
    } else {
        image.src = "models/kid.png"; // Replace with the path to your render image
    }
}