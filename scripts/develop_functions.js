

const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");

var keysDown = {}
var keysPressed = {}


function main(){
    processInput();
    resetPressedKeys();
    draw();
    requestAnimationFrame(main);
}

function processInput(){

}

function draw(){
    CANVAS.width  = window.innerWidth - 250;
    CANVAS.height = window.innerHeight;
}


// global event listeners
window.addEventListener("keydown", function(event){
    keysDown[event.keyCode] = true;
    keysPressed[event.keyCode] = true;
});

window.addEventListener("keyup", function(event){
    delete keysDown[event.keyCode];
});


window.addEventListener("mouseup", function(event){
    clickMouse(event);
})

function clickMouse(event) {
    let rect = CANVAS.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    // put mouse dependant code here
}

function resetPressedKeys(){
    keysPressed = {};
}

// make sure that the main function is running
window.onload = function(){
    main();
}
