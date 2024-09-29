

const closeportfolio = document.getElementById('closeportfolio');
const videoThumbnail = document.querySelector('.video-thumbnail');
const video = videoThumbnail.querySelector('.video');



document.querySelectorAll('.hand-image').forEach((img) => {
    img.addEventListener('click', function() {
        window.location.href = 'hand.html';
    });
});
closeportfolio.addEventListener('click',function(){
    window.location.href = 'index.html';
})

videoThumbnail.addEventListener('mouseenter', () => {
    video.play(); // Play video on mouse enter
});

videoThumbnail.addEventListener('mouseleave', () => {
    video.pause(); // Pause video on mouse leave
    video.currentTime = 0; // Reset video to the beginning
});


