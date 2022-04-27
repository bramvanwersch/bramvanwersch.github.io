
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");


class TwoDVector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    add(otherVector){
        return new Vector(this.x + otherVector.x, this.y + otherVector.y);
    }

    substract(otherVector){
        return new Vector(this.x - otherVector.x, this.y - otherVector.y);
    }
}


class Rectangle{
    constructor(x, y, w, h){
        this.xcoord = x;
        this.ycoord = y;
        this.width = w;
        this.height = h;
    }

    get rigth(){
        return this.xcoord + this.width;
    }

    set rigth(value){
        this.xcoord = value - this.width;
    }

    get left(){
        return this.xcoord;
    }

    set left(value){
        this.xcoord = value;
    }

    get bottom(){
        return this.ycoord + this.height;
    }

    set bottom(value){
        this.ycoord = value - this.height;
    }

    get top(){
        return this.ycoord;
    }

    set top(value){
        this.ycoord = value;
    }

    get center(){
        return new Vector(this.xcoord + 0.5 * this.width, this.ycoord + 0.5 * this.height);
    }

    collidesWith(rect){
        if (this.left >= rect.rigth){
            return false;
        }
        if (this.rigth <= rect.left){
            return false;
        }
        if (this.top >= rect.bottom){
            return false;
        }
        if (this.bottom <= rect.top){
            return false;
        }
        return true;
    }

}

class GameObject{
    constructor(x, y, w, h, mass){
        this.rect = new Rectangle(x, y, w, h);
        this.mass = mass;
        this.yke = 0;
        this.gpe = 0;
    }

    collideWithObject(obj){
        // check what side to push to
        let changes = [Math.abs(this.rect.bottom - obj.rect.top), Math.abs(this.rect.rigth - obj.rect.left),
                       Math.abs(this.rect.top - obj.rect.bottom), Math.abs(this.rect.left - obj.rect.rigth)];
        let max = Math.min(...changes);
        let index = changes.indexOf(max);
        switch (index){
        case 0:
            this.rect.bottom = obj.rect.top;
            break;
        case 1:
            this.rect.rigth = obj.rect.left;
            break;
        case 2:
            this.rect.top = obj.rect.bottom;
            break;
        case 3:
            this.rect.left = obj.rect.rigth;
            break;
        }
    }
}


const player = new GameObject(100, 160, 32, 32, 64);

const DEFAULT_DOWN = -1.0;

let keysDown = {};

const platforms = [new GameObject(0, 200, 500, 10, 100),
                   new GameObject(150, 500, 500, 10, 100),
                   new GameObject(500, 190, 50, 250, 100),
                   new GameObject(0, 150, 500, 10, 100)]


function main(){
    // loop function
    processInput();
    applyGravity(player);
    draw();
    requestAnimationFrame(main);
}


function processInput(){
    // A
    if (65 in keysDown){
        player.rect.xcoord -= 3;
    }
    // D
    if (68 in keysDown){
        player.rect.xcoord += 3;
    }
    // W
    if (87 in keysDown){
        if (player.yke == DEFAULT_DOWN){
            player.yke = 8;
        }
    }
}

// apply gravity
function applyGravity(obj){
    obj.rect.ycoord -= obj.yke;
    if (checkPlatformCollission(obj)){
        obj.yke = DEFAULT_DOWN;
        obj.gpe = calcGPE(obj);
    }
    else{
        obj.yke -= obj.gpe;
        obj.gpe = calcGPE(obj);
    }
}

function calcGPE(obj) {
    // because pixels divide
    return obj.mass * (9.8 / 1000000) * ((canvas.height - obj.rect.height) - (obj.rect.ycoord / 32));  // last 32 is a smoothing parameter
}


function checkPlatformCollission(obj){
    // check and correct for collision. return a new yke
    let hasCollided = false;
    for (let i = 0; i < platforms.length; i++){
        if (obj.rect.collidesWith(platforms[i].rect)){
            obj.collideWithObject(platforms[i]);
            hasCollided = true;
        }
    }
    return hasCollided;
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
        context.rect(platforms[i].rect.xcoord, platforms[i].rect.ycoord, platforms[i].rect.width, platforms[i].rect.height)
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