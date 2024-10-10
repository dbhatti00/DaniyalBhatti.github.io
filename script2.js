

const closeportfolio = document.getElementById('closeportfolio');



document.querySelectorAll('.hand-image').forEach((img) => {
    img.addEventListener('click', function() {
        window.location.href = 'hand.html';
    });
});
closeportfolio.addEventListener('click',function(){
    window.location.href = 'index.html';
})



