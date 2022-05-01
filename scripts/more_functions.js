

// TODO
// 2. add buttons to go next level or restart
// 3. load unload properly
// 4. add levels and or generate them
// 5. add some environmental things
// 6. crouching?
// 7. pause functionality with quit and restart

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
var P1_TILES_REVERSE = loadImage("p1_spritesheet_reverse.png");


// sounds
var COIN_SOUNDS = [loadSound("coin1.wav"), loadSound("coin2.wav"), loadSound("coin3.wav")];
var JUMP_SOUND = loadSound("jump.wav");
JUMP_SOUND.volume = 0.1;
JUMP_SOUND.playbackRate = 1.5;
var DEATH_SOUND = loadSound("death.wav");
var WIN_SOUND = loadSound("win.wav");
var STEP_SOUND1 = loadSound("step1.wav");
STEP_SOUND1.volume = 0.1;
var STEP_SOUND2 = loadSound("step2.wav");
STEP_SOUND2.volume = 0.1;
var START_STAGE_SOUND = loadSound("start_stage.wav");


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

class Button{
    constructor(x, y, text, callable, args){
        this.text = text;
        let textSize = CONTEXT.measureText(this.text);
        let width = textSize.width + 25;
        this.rect = new Rectangle(x - width / 2, y - 35, width, 50);
        this.callable = callable;
        this.args = args;
    }

    draw(){
        CONTEXT.lineWidth = 5;
        // function is at the bottom
        roundRect(this.rect.xcoord, this.rect.ycoord, this.rect.width, 50);

        CONTEXT.font = "30px Impact";
        CONTEXT.fillStyle = "white";
        CONTEXT.textAlign = "center"
        CONTEXT.fillText(this.text, this.rect.xcoord + this.rect.width / 2, this.rect.ycoord + 35);
    }

    click(){
        this.callable(this.args);
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
                CONTEXT.drawImage(this.tileSet.image, imagePos[0], imagePos[1], this.tileSet.tileSize.x,
                                  this.tileSet.tileSize.y, this.rect.xcoord + x, this.rect.ycoord + y, 51, 51)
            }
        }
    }
}

const COIN_SIZE = 30;

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

        CONTEXT.drawImage(this.tileSet.image, imagePos[0], imagePos[1], this.tileSet.tileSize.x,
                          this.tileSet.tileSize.y, this.rect.xcoord, this.rect.ycoord, COIN_SIZE, COIN_SIZE)

    }
}

const GAME_STATES = {
    ALIVE: "a",
    DEAD: "d",
    WIN: "w"
}

class Player extends GameObject{
    // a game object that can move and is not a static surrounding
    constructor(x, y, w, h, mass, material, tileSet, reverseTileSet){
        super(x, y, w, h, mass, material);
        this.yke = 0;  // y kinetic energy
        this.xke = 0;
        this.gpe = 0;  // gravitational potential energy
        // adjacent in order of bottom, left, top, rigth
        this.objectAdjacentPlatforms = [null, null, null, null];
        this.lastJumpedPlatform = null;
        this.tileSet = tileSet;
        this.rTileSet = reverseTileSet;
        this.walkAnimation = new Animation(5, [2, 3, 7, 8, 9], false);
        this.framesTillSound = 20;
    }

    draw(){
        let tileIndex = 12;
        let tileSet = this.tileSet;
        if (gameState == GAME_STATES.DEAD){
            if (this.xke > 0){
                tileIndex = 6;
            }
            else{
                tileIndex = 0;
                tileSet = this.rTileSet;
            }
        }
        // in the air
        else if (this.objectAdjacentPlatforms[0] == null){
            if (this.xke > 0){
                tileIndex = 2;
            }
            else{
                tileIndex = 4;
                tileSet = this.rTileSet;
            }
        }
        // walking on platform
        else if (this.xke > 0.5){
            tileIndex = this.walkAnimation.getImageIndex();
            this.playWalkSound();
        }
        else if (this.xke < -0.5){
            tileIndex = this.walkAnimation.getImageIndex();
            tileIndex = this.tileSet.tilesPerRow * (Math.floor(tileIndex / this.tileSet.tilesPerRow)) +
                        ((this.tileSet.tilesPerRow - 1) -  tileIndex % this.tileSet.tilesPerRow);
            tileSet = this.rTileSet;
            this.playWalkSound();

        }
        let imagePos = tileSet.getTilePos(tileIndex);
        CONTEXT.drawImage(tileSet.image, imagePos[0], imagePos[1], tileSet.tileSize.x,
                          tileSet.tileSize.y, this.rect.xcoord - 10, this.rect.ycoord - 10, this.rect.width + 20,
                          this.rect.height + 10)
    }

    playWalkSound(){
        if (this.framesTillSound > 0){
            this.framesTillSound -= 1;
            if (this.framesTillSound == 10){
                STEP_SOUND2.play();
            }
        }
        else{
            this.framesTillSound = 20;
            STEP_SOUND1.play();
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
    constructor(image, tileSize, tilesPerRow, offset){
        this.image = image;
        this.tilesPerRow = tilesPerRow;
        this.tileSize = tileSize;
        this.offset = offset;
    }

    getTilePos(index){
        let x = index % this.tilesPerRow;
        let y = Math.floor(index / this.tilesPerRow);
        return [this.offset.x + x * this.tileSize.x, this.offset.y + y * this.tileSize.y];
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

    get totalImages(){
        return this.imageIndexes.length;
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
const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");

MATERIALS = {
    "air": new Material(0.9),
    "wall": new Material(0.8),
    "flesh": new Material(0.3)
}

// tilesets
const PLAYER_TILESET = new TileSet(P1_TILES, new Vector2(73, 97), 7, new Vector2(0, 0))
const R_PLAYER_TILESET = new TileSet(P1_TILES_REVERSE, new Vector2(73, 97), 7, new Vector2(-2, 0))
const COIN_TILESET = new TileSet(COIN_IMAGES, new Vector2(16, 16), 8, new Vector2(0, 0));

// these will be drawn depending on gamestate
var BUTTONS = [];

// set these every stage
var PLATFORMS = [];
var COINS = [];
var PLAYER = null;
var gameState = GAME_STATES.ALIVE;

var keysDown = {};
var camera = null;

var coinCounter = [0, 1];  // current, total
var currentStage = 0;
var totalFrames = 0;

// hardcoded call  for now
setupStage([1, true]);


function setupStage(values){
    if (!values[1]){
        START_STAGE_SOUND.play();
    }
    let stageNr = values[0];
    totalFrames = 0;
    currentStage = stageNr;
    gameState = GAME_STATES.ALIVE;
    BUTTONS = []; // reset these
    PLAYER = new Player(100, 160, 40, 70, 64, MATERIALS["flesh"], PLAYER_TILESET, R_PLAYER_TILESET);
    GRASS_TILE_SET = new TileSet(TILES_IMAGE, new Vector2(70, 70), 8, new Vector2(0, 0));
    PLATFORMS = [new Platform(0, 200, 500, 50, 100, MATERIALS["wall"], GRASS_TILE_SET),
                       new Platform(150, 500, 800, 50, 100, MATERIALS["wall"], GRASS_TILE_SET),
                       new Platform(500, 190, 50, 250, 100, MATERIALS["wall"], GRASS_TILE_SET),
                       new Platform(700, 190, 50, 250, 100, MATERIALS["wall"], GRASS_TILE_SET),
                       new Platform(-800, 150, 600, 100, 100, MATERIALS["wall"], GRASS_TILE_SET)]

    COINS = [new Coin(0, 0, COIN_TILESET)]

    coinCounter = [0, COINS.length];
    camera = new Vector2(0, 0);
}

function main(){
    if (gameState == GAME_STATES.ALIVE){
        // loop function
        processInput();
        // do this for all moving objects later
        PLAYER.reset();
        PLAYER.move();
        updateCamera();
        draw();
        totalFrames += 1;
    }
    else if (gameState == GAME_STATES.WIN){
        draw();
        notifyText(`You won stage ${currentStage} in ${totalFrames} frames. Congratulations.`);
        // slow down camera
        camera = camera.multiply(0.9);
    }
    else{
        draw();
        notifyText("Oops you died");
        // slow down camera
        camera = camera.multiply(0.9);
    }
    requestAnimationFrame(main);
}

var fontSize = 30;
var fontChange = 1;

function notifyText(text){
    // text with a wobble, relies on global fontSize parameter
    if (fontSize > 70 && fontChange > 0){
        fontChange = -1;
    }
    else if (fontSize < 30 && fontChange < 0){
        fontChange = 1;
    }
    fontSize += fontChange;
    CONTEXT.font = fontSize + "px Impact";
    CONTEXT.fillStyle = "darkred";
    CONTEXT.textAlign = "center";
    CONTEXT.fillText(text, CANVAS.width/2, CANVAS.height/2);
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
        loseStage();
    }
    // check coin collision
    for (let i = COINS.length - 1; i >= 0; i--){
        if (obj.rect.collidesWith(COINS[i].rect)){
            COINS.splice(i, 1);
            COIN_SOUNDS[i].play();
            coinCounter[0] += 1;
            if (coinCounter[0] == coinCounter[1]){
                winStage();
            }
        }
    }
}

function winStage(){
    gameState = GAME_STATES.WIN;
    WIN_SOUND.play();
    BUTTONS.push(new Button(CANVAS.width / 2 - 100, CANVAS.height / 2 + 100, "Retry", setupStage, [currentStage, true]));
    BUTTONS.push(new Button(CANVAS.width / 2 + 100, CANVAS.height / 2 + 100, "Next", setupStage, [currentStage + 1, false]));
}

function loseStage(){
    gameState = GAME_STATES.DEAD;
    DEATH_SOUND.play();
    BUTTONS.push(new Button(CANVAS.width / 2, CANVAS.height / 2 + 100, "Retry", setupStage, [currentStage, true]));
}

function updateCamera(){
    let x = CANVAS.width / 2 - PLAYER.rect.center.x;
    let y = CANVAS.height / 2 - PLAYER.rect.center.y;
    camera = camera.add(new Vector2(x, y).substract(camera));
}


// drawing functions
function draw(){
    CANVAS.width  = window.innerWidth;
    CANVAS.height = window.innerHeight;
    drawBackground();
    drawPlatforms();
    drawCoins();
    drawPlayer();
    drawUI();
}

function drawBackground(){
    CONTEXT.drawImage(MOUNTAIN_IMAGE, 0, 0, CANVAS.width, CANVAS.height);
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
    PLAYER.rect.move(camera);
    PLAYER.draw();
}

function drawUI(){
    // draw coin goal
    CONTEXT.font = "30px Impact";
    CONTEXT.fillStyle = "black";
    CONTEXT.textAlign = "start"
    CONTEXT.fillText(`${coinCounter[0]} / ${coinCounter[1]}`, 10, 40);

    let imagePos = COIN_TILESET.getTilePos(0);
    CONTEXT.drawImage(COIN_TILESET.image, imagePos[0], imagePos[1], COIN_TILESET.tileSize.x,
                      COIN_TILESET.tileSize.y, 62, 10, 40, 40)

    for (let i = 0; i < BUTTONS.length; i++){
        BUTTONS[i].draw();
    }
}


// global event listeners
window.addEventListener("keydown", function(event){
    keysDown[event.keyCode] = true;
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

    for (let i = 0; i < BUTTONS.length; i++){
        if (BUTTONS[i].rect.collidesWith(new Rectangle(x, y, 1, 1))){
            BUTTONS[i].click();
        }

    }
}

// make sure that the main function is running
window.onload = function(){
    main();
}

function roundRect(x, y, width, height, radius, fill, stroke) {
// https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-using-html-canvas
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    }
    else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
          radius[side] = radius[side] || defaultRadius[side];
        }
    }
    CONTEXT.beginPath();
    CONTEXT.moveTo(x + radius.tl, y);
    CONTEXT.lineTo(x + width - radius.tr, y);
    CONTEXT.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    CONTEXT.lineTo(x + width, y + height - radius.br);
    CONTEXT.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    CONTEXT.lineTo(x + radius.bl, y + height);
    CONTEXT.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    CONTEXT.lineTo(x, y + radius.tl);
    CONTEXT.quadraticCurveTo(x, y, x + radius.tl, y);
    CONTEXT.closePath();
    if (fill) {
        CONTEXT.fill();
    }
    if (stroke) {
        CONTEXT.stroke();
    }

}