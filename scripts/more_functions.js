
const WORLD_HEIGHT = 800;
const MAX_SPEED = 15.0;
var ID_COUNT = 0;

// CLASSES

class Vector2{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    add(otherVector){
        return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
    }

    substract(otherVector){
        return new Vector2(this.x - otherVector.x, this.y - otherVector.y);
    }

    multiply(value){
        return new Vector2(this.x * value, this.y * value);
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
        return new Vector2(this.xcoord + 0.5 * this.width, this.ycoord + 0.5 * this.height);
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

    move(vector){
        this.xcoord += vector.x;
        this.ycoord += vector.y;
    }

    equals(otherRect){
        if (otherRect.xcoord != this.xcoord){
            return false;
        }
        if (otherRect.ycoord != this.ycoord){
            return false;
        }
        if (otherRect.width != this.width){
            return false;
        }
        if (otherRect.height != this.height){
            return false;
        }
        return true;
    }

}

class GameObject{
    constructor(x, y, w, h, mass, material){
        this.rect = new Rectangle(x, y, w, h);
        this.mass = mass;
        this.material = material;
        this.id = ID_COUNT;
        ID_COUNT += 1;
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
            return [0, obj];
        case 1:
            this.rect.rigth = obj.rect.left;
            return [1, obj];
        case 2:
            this.rect.top = obj.rect.bottom;
            return [2, obj];
        case 3:
            this.rect.left = obj.rect.rigth;
            return [3, obj];
        }
    }

    equals(otherObject){
        if (otherObject == null){
            return false;
        }
        return this.rect.equals(otherObject.rect);
    }

}


class MovableGameObject extends GameObject{
    // a game object that can move and is not a static surrounding
    constructor(x, y, w, h, mass){
        super(x, y, w, h, mass);
        this.yke = 0;  // y kinetic energy
        this.xke = 0;
        this.gpe = 0;  // gravitational potential energy
        // adjacent in order of bottom, left, top, rigth
        this.objectAdjacentPlatforms = [null, null, null, null];
        this.lastTouchedPlatform = null;
    }

    reset(){
        // reset certain values for the next frame
        this.objectAdjacentPlatforms = [null, null, null, null];
        this.lastTouchedPlatform = null;
    }

    move(){
        // move based on kinetic energy
        this.rect.ycoord -= this.yke;
        this.rect.xcoord += this.xke;

        // check for collision and adjust per side
        checkGameObjectCollission(this);
        let hasCollided = false;
        for (let index = 0; index < 4; index++){
            if (this.objectAdjacentPlatforms[index] != null){
                hasCollided = true;
                switch (index){
                case 0:
                    this.handleBottemAdjacent();
                    break;
                case 1:
                    this.handleLeftAdjacent();
                    break;
                case 2:
                    this.handleTopAdjacent();
                    break;
                case 3:
                    this.handleRigthAdjacent();
                    break;
                }
            }
        }

        // adjust y kinetic energy
        this.yke -= this.gpe;
        this.gpe = this.calcGpe();

        // adjust x kinetic energy
        let resistance = 0;
        if (this.objectAdjacentPlatforms[0] == null){
            resistance = MATERIALS["air"].resistance;
        }
        else{
            resistance = this.objectAdjacentPlatforms[0].material.resistance;
        }
        this.xke *= resistance;
    }

    handleBottemAdjacent(){
        this.yke = 0;
    }

    handleTopAdjacent(){
        this.yke = -0.5;
    }

    handleLeftAdjacent(){
        // slide along the wall
        this.xke = 0;
        if (this.objectAdjacentPlatforms[0] == null){
            this.yke = this.objectAdjacentPlatforms[1].material.slideSpeed;
        }
    }

    handleRigthAdjacent(){
        // slide along the wall
        this.xke = 0;
        if (this.objectAdjacentPlatforms[0] == null){
            this.yke = this.objectAdjacentPlatforms[3].material.slideSpeed;
        }
    }

    calcGpe() {
        // because pixels divide
        return this.mass * (9.8 / 1000000) * ((WORLD_HEIGHT - this.rect.height) - (this.rect.ycoord / 32));  // last 32 is a smoothing parameter
    }

}

class Material{
    constructor(slideSpeed, resistance){
        this.slideSpeed = slideSpeed;
        this.resistance = resistance;
    }
}

// CONSTANTS
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

MATERIALS = {
    "air": new Material(0, 0.9),
    "wall": new Material(-1.5, 0.7),
    "flesh": new Material(-2, 0.3)
}

let keysDown = {};

const PLAYER = new MovableGameObject(100, 160, 32, 32, 64, MATERIALS["flesh"]);

const PLATFORMS = [new GameObject(0, 200, 500, 50, 100, MATERIALS["wall"]),
                   new GameObject(150, 500, 800, 50, 100, MATERIALS["wall"]),
                   new GameObject(500, 190, 50, 250, 100, MATERIALS["wall"]),
                   new GameObject(700, 190, 50, 250, 100, MATERIALS["wall"]),
                   new GameObject(50, 100, 500, 50, 100, MATERIALS["wall"]),
                   new GameObject(-800, 150, 600, 100, 100, MATERIALS["wall"])]

let camera = new Vector2(0, 0);


function main(){
    // loop function
    processInput();
    // do this for all moving objects later
    PLAYER.reset();
    PLAYER.move();
    updateCamera();
    draw();
    requestAnimationFrame(main);
}


function processInput(){
    // A
    if (65 in keysDown){
        if (PLAYER.objectAdjacentPlatforms[0] != null){
            PLAYER.xke -= 3;
        }
        else{
            PLAYER.xke -= 0.75;
        }

    }
    // D
    if (68 in keysDown){
        if (PLAYER.objectAdjacentPlatforms[0] != null){
            PLAYER.xke += 3;
        }
        else{
            PLAYER.xke += 0.75;
        }
    }
    // W
    if (87 in keysDown){
        if (PLAYER.objectAdjacentPlatforms[0] != null){
            PLAYER.yke = 8;
        }
        else if (PLAYER.objectAdjacentPlatforms[1] != null && !PLAYER.objectAdjacentPlatforms[1].equals(PLAYER.lastTouchedPlatform)){
            PLAYER.yke = 8;
            PLAYER.xke = -10;
        }
        else if (PLAYER.objectAdjacentPlatforms[3] != null && !PLAYER.objectAdjacentPlatforms[3].equals(PLAYER.lastTouchedPlatform)){
            PLAYER.yke = 8;
            PLAYER.xke = 10;
        }
    }
}

function checkGameObjectCollission(obj){
    // check for collission and set the adjacent sides when colliging
    for (let i = 0; i < PLATFORMS.length; i++){
        if (obj.rect.collidesWith(PLATFORMS[i].rect)){
            let collisionValues = obj.collideWithObject(PLATFORMS[i]);
            obj.objectAdjacentPlatforms[collisionValues[0]] = collisionValues[1];
            obj.lastTouchedPlatform = collisionValues[1];
        }
    }
}


function updateCamera(){
    let x = canvas.width / 2 - PLAYER.rect.center.x;
    let y = canvas.height / 2 - PLAYER.rect.center.y;
    camera = camera.add(new Vector2(x, y).substract(camera));
}


// drawing functions
function draw(){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
    drawPlayer();
}

function drawPlatforms(){
// draw all the PLATFORMS
    context.beginPath();
    for (let i = 0; i < PLATFORMS.length; i++){
        PLATFORMS[i].rect.move(camera);
        context.rect(PLATFORMS[i].rect.xcoord, PLATFORMS[i].rect.ycoord, PLATFORMS[i].rect.width, PLATFORMS[i].rect.height)
    }
    context.stroke();
}

function drawPlayer(){
// draw PLAYER
    context.fillStyle = "red";
    PLAYER.rect.move(camera);
    context.fillRect(PLAYER.rect.xcoord, PLAYER.rect.ycoord, PLAYER.rect.width, PLAYER.rect.height);
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