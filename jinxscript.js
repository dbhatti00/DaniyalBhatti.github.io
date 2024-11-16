
let renderImage = document.getElementById('renderImage');
let wireframeImage = document.getElementById('wireframeImage');
let isWireframeVisible = false; // Track if the wireframe is visible


window.onload = function() {
    document.getElementById("image-toggle").onclick = toggleImage;
}

const backbutton = document.getElementById('back');

backbutton.addEventListener('click',function(){
    window.location.href = 'portfolio.html';
})

function toggleImage() {
    var image = document.getElementById("image-toggle");
    
    if (image.src.includes("jinx.png")) {
        image.src = "models/jinx2.png"; // Replace with the path to your wireframe image
    } else {
        image.src = "models/jinx.png"; // Replace with the path to your render image
    }
}