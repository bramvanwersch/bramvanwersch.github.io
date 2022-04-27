
const WORLD_HEIGHT = 800;

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

}

class GameObject{
    constructor(x, y, w, h, mass){
        this.rect = new Rectangle(x, y, w, h);
        this.mass = mass;
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
            return 0;
        case 1:
            this.rect.rigth = obj.rect.left;
            return 1;
        case 2:
            this.rect.top = obj.rect.bottom;
            return 2;
        case 3:
            this.rect.left = obj.rect.rigth;
            return 3;
        }
    }
}


class MovableGameObject extends GameObject{
    // a game object that can move and is not a static surrounding
    constructor(x, y, w, h, mass){
        super(x, y, w, h, mass);
        this.yke = 0;  // y kinetic energy
        this.gpe = 0;  // gravitational potential energy
        // adjacent in order of bottom, left, top, rigth
        this.objectAdjacentDirections = [false, false, false, false];
    }

    reset(){
        // reset certain values for the next frame
        this.objectAdjacentDirections = [false, false, false, false];
    }

    handleBottemAdjacent(){
        this.yke = 0;
    }

    handleTopAdjacent(){
        this.yke = -0.5;
    }

    handleLeftAdjacent(){
        // slide along the wall
        if (!this.objectAdjacentDirections[0]){
            this.yke = SLIDE_SPEED;
        }
    }

    handleRigthAdjacent(){
        // slide along the wall
        if (!this.objectAdjacentDirections[0]){
            this.yke = SLIDE_SPEED;
        }
    }

    handleNoAdjacent(){
        this.yke -= this.gpe;
        this.gpe = this.calcGpe();
    }

    calcGpe() {
        // because pixels divide
        return this.mass * (9.8 / 1000000) * ((WORLD_HEIGHT - this.rect.height) - (this.rect.ycoord / 32));  // last 32 is a smoothing parameter
    }

}

// CONSTANTS
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// speed of sliding down walls
const SLIDE_SPEED = -1.5;

let keysDown = {};

const PLAYER = new MovableGameObject(100, 160, 32, 32, 64);

const PLATFORMS = [new GameObject(0, 200, 500, 10, 100),
                   new GameObject(150, 500, 500, 10, 100),
                   new GameObject(500, 190, 50, 250, 100),
                   new GameObject(0, 150, 500, 10, 100)]

let camera = new Vector2(0, 0);


function main(){
    // loop function
    processInput();
    // do this for all moving objects later
    PLAYER.reset();
    applyGravity(PLAYER);
    updateCamera();
    draw();
    requestAnimationFrame(main);
}


function processInput(){
    // A
    if (65 in keysDown){
        PLAYER.rect.xcoord -= 3;
    }
    // D
    if (68 in keysDown){
        PLAYER.rect.xcoord += 3;
    }
    // W
    if (87 in keysDown){
        if (PLAYER.yke == 0){
            PLAYER.yke = 8;
        }
    }
}

// apply gravity
function applyGravity(obj){
    obj.rect.ycoord -= obj.yke;
    checkGameObjectCollission(obj);
    let hasCollided = false;
    for (let index = 0; index < 4; index++){
        if (obj.objectAdjacentDirections[index]){
            hasCollided = true;
            switch (index){
            case 0:
                obj.handleBottemAdjacent();
                break;
            case 1:
                obj.handleLeftAdjacent();
                break;
            case 2:
                obj.handleTopAdjacent();
                break;
            case 3:
                obj.handleRigthAdjacent();
                break;
            }
        }
    }
    if (!hasCollided){
        obj.handleNoAdjacent();
    }
}

function checkGameObjectCollission(obj){
    // check for collission and set the adjacent sides when colliging
    for (let i = 0; i < PLATFORMS.length; i++){
        if (obj.rect.collidesWith(PLATFORMS[i].rect)){
            let collidingDirection = obj.collideWithObject(PLATFORMS[i]);
            PLAYER.objectAdjacentDirections[collidingDirection] = true;
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