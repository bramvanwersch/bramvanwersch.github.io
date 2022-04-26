
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");


class Rectangle{
    constructor(x, y, w, h){
        this.xcoord = x;
        this.ycoord = y;
        this.width = w;
        this.height = h;
    }
}

class GameObject{
    constructor(x, y, w, h, mass){
        this.rect = new Rectangle(x, y, w, h);
        this.mass = mass;
        this.yke = 0;
        this.gpe = 0;
    }
}


const player = new GameObject(100, 100, 32, 32, 64);

let keysDown = {};

const platforms = [[0, 200, 500, 10]]


function main(){
    // loop function
    processInput();
    applyGravity(player);
    draw();
    requestAnimationFrame(main);
}


function processInput(){
    // A
    if(65 in keysDown){
        player.rect.xcoord -= 3;
    }
    // D
    if(68 in keysDown){
        player.rect.xcoord += 3;
    }
}

// apply gravity
function applyGravity(obj){
    obj.rect.ycoord -= obj.yke;
    obj.yke -= obj.gpe;
    obj.gpe = calcGPE(obj);
}

function calcGPE(obj) {
    // because pixels divide
    return obj.mass * (9.8 / 1000000) * ((canvas.height - obj.rect.height) - (obj.rect.ycoord / 32));  // last 32 is a smoothing parameter
}


// drawing functions
function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
    drawPlayer();
}

function drawPlatforms(){
// draw all the platforms
    context.beginPath();
    for (let i = 0; i < platforms.length; i++){
        context.rect(platforms[i][0], platforms[i][1], platforms[i][2], platforms[i][3])
    }
    context.stroke();
}

function drawPlayer(){
// draw player
    context.fillStyle = "red";
    context.fillRect(player.rect.xcoord, player.rect.ycoord, player.rect.width, player.rect.height);
}


// global event listeners
window.addEventListener("keydown", function(event){
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event){
  delete keysDown[event.keyCode];
});

// make sure that the main function is running
window.onload = function(){
  main();
}