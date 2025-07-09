
const zoomableImages = document.querySelectorAll('.zoomable');
const overlay = document.getElementById('imageZoomOverlay');
const zoomedImg = document.getElementById('zoomedImage');
let scale = 1;



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

