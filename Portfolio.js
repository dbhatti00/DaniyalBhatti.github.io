

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

document.getElementById('Shoe').addEventListener('click', function() {
    window.location.href = 'shoe.html'; 
})


document.getElementById('Material').addEventListener('click', function() {
    window.location.href = 'material.html'; 
})

document.getElementById('Cress').addEventListener('click', function() {
    window.location.href = 'Cress.html'; 
})
document.getElementById('Tiefling').addEventListener('click', function() {
    window.location.href = 'Tiefling.html'; 
})