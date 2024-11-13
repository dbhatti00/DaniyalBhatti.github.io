


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

document.getElementById('chair').addEventListener('click', function() {
    window.location.href = 'chair.html'; 
})
document.getElementById('kid').addEventListener('click', function() {
    window.location.href = 'kid.html'; 
})

document.getElementById('horse').addEventListener('click', function() {
    window.location.href = 'horse.html'; 
})
document.getElementById('tulio').addEventListener('click', function() {
    window.location.href = 'tulio.html'; 
})
document.getElementById('mech').addEventListener('click', function() {
    window.location.href = 'mech.html'; 
})
document.getElementById('jinx').addEventListener('click', function() {
    window.location.href = 'jinx.html'; 
})