

// TODO
// 1. add player texture
// 3. load unload properly
// 4. add levels and or generate them
// 5. add some environmental things

// loading textures and images

function loadImage(source){
    let img = new Image();
    img.src = "data/assets/images/" + source;
    return img;
}

function loadSound(source){
    let sound = new Audio("data/assets/sounds/" + source);
    sound.preload = 'auto';
    sound.load();
    return sound;
}

var MOUNTAIN_IMAGE = loadImage("mountains_background.png");
var TILES_IMAGE = loadImage("tiles_spritesheet.png");
var COIN_IMAGES = loadImage("coins.png");
var P1_TILES = loadImage("p1_spritesheet.png");


// sounds
var COIN_SOUNDS = [loadSound("coin1.wav"), loadSound("coin2.wav"), loadSound("coin3.wav")];
var JUMP_SOUND = loadSound("jump.wav");
JUMP_SOUND.volume = 0.25;
JUMP_SOUND.playbackRate = 1.5;
var DEATH_SOUND = loadSound("death.wav");


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


class Platform extends GameObject{
    // make sure that it is multiple of 50
    constructor(x, y, w, h, mass, material, tileSet){
        super(x, y, w, h, mass, material);
        this.tileSet = tileSet;
    }

    draw(){
        // make sure that tileset order is the same
        let maxx = (Math.floor(this.rect.width / 50) - 1) * 50;
        let maxy = (Math.floor(this.rect.height / 50) - 1) * 50;
        for (let y = 0; y < this.rect.height; y += 50){
            for (let x = 0; x < this.rect.width; x += 50){
                let tileIndex = 0;
                if (y == 0){
                    if (y == 0 && y == maxy && x == 0 && x == maxx){
                        tileIndex = 8;
                    }
                    else if (y == maxy && x == 0){
                        tileIndex = 2;
                    }
                    else if (y == maxy && x == maxx){
                        tileIndex = 5;
                    }
                    else if (x == 0 && x == maxx){
                        tileIndex = 9;
                    }
                    else if (x == 0){
                        tileIndex = 3;
                    }
                    else if (x == maxx){
                        tileIndex = 4;
                    }
                    else{
                        tileIndex = 1;
                    }
                }
                else if (y == maxy){
                    if (x == 0 && x == maxx){
                        tileIndex = 10;
                    }
                    else if (x == 0){
                        tileIndex = 6;
                    }
                    else if (x == maxx){
                        tileIndex = 7;
                    }
                }
                let imagePos = this.tileSet.getTilePos(tileIndex);
                context.drawImage(this.tileSet.image, imagePos[0], imagePos[1], this.tileSet.tileSize.x,
                                  this.tileSet.tileSize.y, this.rect.xcoord + x, this.rect.ycoord + y, 51, 51)
            }
        }
    }
}

const COIN_SIZE = 30;
const COIN_FRAME_PER_IMAGE = 7;

class Coin extends GameObject{
    constructor(x, y, tileSet){
        let size = 50;
        super(x, y, COIN_SIZE, COIN_SIZE, 5, null);
        this.tileSet = tileSet;
        this.animation = new Animation(7, [0, 1, 2, 3, 4, 5, 6, 7], true)
    }

    draw(){
        let frameIndex = this.animation.getImageIndex();
        let imagePos = this.tileSet.getTilePos(frameIndex);

        context.drawImage(this.tileSet.image, imagePos[0], imagePos[1], this.tileSet.tileSize.x,
                          this.tileSet.tileSize.y, this.rect.xcoord, this.rect.ycoord, COIN_SIZE, COIN_SIZE)

    }
}


class Player extends GameObject{
    // a game object that can move and is not a static surrounding
    constructor(x, y, w, h, mass){
        super(x, y, w, h, mass);
        this.yke = 0;  // y kinetic energy
        this.xke = 0;
        this.gpe = 0;  // gravitational potential energy
        // adjacent in order of bottom, left, top, rigth
        this.objectAdjacentPlatforms = [null, null, null, null];
        this.lastJumpedPlatform = null;
        this.is_dead = false;
        this.currentWalkingFrame = 0;
    }

    draw(){
        if (this.xke != 0){

        }
    }

    reset(){
        // reset certain values for the next frame
        this.objectAdjacentPlatforms = [null, null, null, null];
    }

    move(){
        // move based on kinetic energy
        this.rect.ycoord -= this.yke;
        this.rect.xcoord += this.xke;

        handleCollision(this);

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
        this.lastJumpedPlatform = null;
    }

    handleTopAdjacent(){
        this.yke = -0.5;
    }

    handleLeftAdjacent(){
        this.xke = 0;
    }

    handleRigthAdjacent(){
        this.xke = 0;
    }

    calcGpe() {
        // because pixels divide
        return this.mass * (9.8 / 1000000) * ((WORLD_HEIGHT - this.rect.height) - (this.rect.ycoord / 32));  // last 32 is a smoothing parameter
    }

}

class Material{
    constructor(resistance){
        this.resistance = resistance;
    }
}


class TileSet{
    constructor(image, tileSize, tilesPerRow){
        this.image = image;
        this.tilesPerRow = tilesPerRow;
        this.tileSize = tileSize;
    }

    getTilePos(index){
        let x = index % this.tilesPerRow;
        let y = Math.floor(index / this.tilesPerRow);
        return [x * this.tileSize.x, y * this.tileSize.y];
    }
}

class Animation{
    constructor(framesPerImage, imageIndexes, randomStart){
        this.framesPerImage = framesPerImage;
        this.imageIndexes = imageIndexes;
        this.currentIndex = 0;
        this.randomStart = randomStart;
        this.framesTillNext = this.framesPerImage;
        this.restart();
    }

    restart(){
        if (this.randomStart){
            this.currentIndex = Math.floor(Math.random() * this.imageIndexes.length);
        }
        else{
            this.currentIndex = 0;
        }
        this.framesTillNext = this.framesPerImage;
    }

    _set_start_index(){

    }

    getImageIndex(){
        if (this.framesTillNext > 0){
            this.framesTillNext -= 1;
        }
        else{
            this.framesTillNext = this.framesPerImage;
            this.currentIndex = (this.currentIndex + 1) % this.imageIndexes.length;
        }
        return this.imageIndexes[this.currentIndex];
    }
}

// CONSTANTS
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

MATERIALS = {
    "air": new Material(0.9),
    "wall": new Material(0.8),
    "flesh": new Material(0.3)
}

let keysDown = {};

const PLAYER = new Player(100, 160, 32, 32, 64, MATERIALS["flesh"]);

const GRASS_TILE_SET = new TileSet(TILES_IMAGE, new Vector2(70, 70), 8);

const PLATFORMS = [new Platform(0, 200, 500, 50, 100, MATERIALS["wall"], GRASS_TILE_SET),
                   new Platform(150, 500, 800, 50, 100, MATERIALS["wall"], GRASS_TILE_SET),
                   new Platform(500, 190, 50, 250, 100, MATERIALS["wall"], GRASS_TILE_SET),
                   new Platform(700, 190, 50, 250, 100, MATERIALS["wall"], GRASS_TILE_SET),
                   new Platform(50, 100, 500, 50, 100, MATERIALS["wall"], GRASS_TILE_SET),
                   new Platform(-800, 150, 600, 100, 100, MATERIALS["wall"], GRASS_TILE_SET)]

const COIN_TILESET = new TileSet(COIN_IMAGES, new Vector2(16, 16), 8);

const COINS = [new Coin(0, 0, COIN_TILESET),
               new Coin(100, 0, COIN_TILESET),
               new Coin(250, 400, COIN_TILESET)]

let camera = new Vector2(0, 0);


function main(){
    if (!PLAYER.is_dead){
        // loop function
        processInput();
        // do this for all moving objects later
        PLAYER.reset();
        PLAYER.move();
        updateCamera();
        draw();
    }
    else{
        draw();
        context.font = "50px Impact";
        context.fillStyle = "darkred";
        context.textAlign = "center";
        context.fillText("Oops you died. Try again (f5)", canvas.width/2, canvas.height/2);
        // slow down camera
        camera = camera.multiply(0.9);
    }
    requestAnimationFrame(main);
}


function processInput(){
    // A
    if (65 in keysDown){
        if (PLAYER.objectAdjacentPlatforms[0] != null){
            PLAYER.xke -= 2;
        }
        else{
            PLAYER.xke -= 0.75;
        }

    }
    // D
    if (68 in keysDown){
        if (PLAYER.objectAdjacentPlatforms[0] != null){
            PLAYER.xke += 2;
        }
        else{
            PLAYER.xke += 0.75;
        }
    }
    // W
    if (87 in keysDown){
        if (PLAYER.objectAdjacentPlatforms[0] != null){
            PLAYER.yke = 8;
            JUMP_SOUND.play();
        }
        else if (PLAYER.objectAdjacentPlatforms[1] != null && !PLAYER.objectAdjacentPlatforms[1].equals(PLAYER.lastJumpedPlatform)){
            PLAYER.yke = 8;
            PLAYER.xke = -7;
            PLAYER.lastJumpedPlatform = PLAYER.objectAdjacentPlatforms[1];
            JUMP_SOUND.play();
        }
        else if (PLAYER.objectAdjacentPlatforms[3] != null && !PLAYER.objectAdjacentPlatforms[3].equals(PLAYER.lastJumpedPlatform)){
            PLAYER.yke = 8;
            PLAYER.xke = 7;
            PLAYER.lastJumpedPlatform = PLAYER.objectAdjacentPlatforms[3];
            JUMP_SOUND.play();
        }
    }
}


function handleCollision(obj){
    // check for collision and adjust per side
    checkGameObjectCollission(obj);
    let hasCollided = false;
    for (let index = 0; index < 4; index++){
        if (obj.objectAdjacentPlatforms[index] != null){
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
}

function checkGameObjectCollission(obj){
    let minx = 0;
    let miny = 0;
    let maxx = 0;
    let maxy = 0;
    // check for collission and set the adjacent sides when colliding
    for (let i = 0; i < PLATFORMS.length; i++){
        if (obj.rect.collidesWith(PLATFORMS[i].rect)){
            let collisionValues = obj.collideWithObject(PLATFORMS[i]);
            obj.objectAdjacentPlatforms[collisionValues[0]] = collisionValues[1];
        }
        minx = Math.min(minx, PLATFORMS[i].rect.left);
        miny = Math.min(miny, PLATFORMS[i].rect.top);
        maxx = Math.max(maxx, PLATFORMS[i].rect.rigth);
        maxy = Math.max(maxy, PLATFORMS[i].rect.bottom);
    }
    // if player is to far from platforms KILL
    if (PLAYER.rect.xcoord < minx - 250 || PLAYER.rect.xcoord > maxx + 250 || PLAYER.rect.ycoord < miny - 250 || PLAYER.rect.ycoord > maxy + 250){
        PLAYER.is_dead = true;
        DEATH_SOUND.play();
    }
    // check coin collision
    for (let i = COINS.length - 1; i >= 0; i--){
        if (obj.rect.collidesWith(COINS[i].rect)){
            COINS.splice(i, 1);
            COIN_SOUNDS[i].play();
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
    drawBackground();
    drawPlatforms();
    drawCoins();
    drawPlayer();
}

function drawBackground(){
    context.drawImage(MOUNTAIN_IMAGE, 0, 0, canvas.width, canvas.height);
}

function drawPlatforms(){
// draw all the PLATFORMS

    for (let i = 0; i < PLATFORMS.length; i++){
        PLATFORMS[i].rect.move(camera);
        PLATFORMS[i].draw();
    }
}

function drawCoins(){
    for (let i = 0; i < COINS.length; i++){
        COINS[i].rect.move(camera);
        COINS[i].draw();
        let sound = Math.floor(Math.random() * 3);
    }
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