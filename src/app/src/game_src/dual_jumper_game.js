import * as read_data from "./read_data.js"
import { Rectangle, Vector2, TileSet, Camera, Material, Animation } from "./helper_classes.js"


// TODO
//  4. add levels and or generate them
//  5. add some environmental things
//  8. add background sound that plays
//  9. fix sound loading bug when walking first with player 2 at innitial load


const WORLD_HEIGHT = 800;


let loadImage = read_data.loadImage
let loadSound = read_data.loadSound

var MOUNTAIN_IMAGE = read_data.loadImage("backgrounds/mountains_background.png");
var TILES_IMAGE = read_data.loadImage("tiles_spritesheet.png");
var COIN_IMAGES = read_data.loadImage("coins.png");
var P1_TILES = read_data.loadImage("p1_spritesheet.png");
var P1_TILES_REVERSE = read_data.loadImage("p1_spritesheet_reverse.png");
var P2_TILES = read_data.loadImage("p2_spritesheet.png");
var P2_TILES_REVERSE = read_data.loadImage("p2_spritesheet_reverse.png");

// tilesets
const PLAYER1_TILESET = new TileSet(P1_TILES, new Vector2(73, 97), 7, new Vector2(0, 0))
const R_PLAYER1_TILESET = new TileSet(P1_TILES_REVERSE, new Vector2(73, 97), 7, new Vector2(-2, 0))
const PLAYER2_TILESET = new TileSet(P2_TILES, new Vector2(70, 94), 7, new Vector2(1, 0))
const R_PLAYER2_TILESET = new TileSet(P2_TILES_REVERSE, new Vector2(70, 94), 7, new Vector2(3, 0))
const GRASS_TILE_SET = new TileSet(TILES_IMAGE, new Vector2(70, 70), 8, new Vector2(0, 0));
const COIN_TILESET = new TileSet(COIN_IMAGES, new Vector2(16, 16), 8, new Vector2(0, 0));

// sounds
var COIN_SOUNDS = [read_data.loadSound("coin1.wav"), read_data.loadSound("coin2.wav"), read_data.loadSound("coin3.wav")];
var JUMP_SOUND = read_data.loadSound("jump.wav");
JUMP_SOUND.volume = 0.1;
JUMP_SOUND.playbackRate = 1.5;
var DEATH_SOUND = read_data.loadSound("death.wav");
var WIN_SOUND = read_data.loadSound("win.wav");
var STEP_SOUND1 = read_data.loadSound("step1.wav");
STEP_SOUND1.volume = 0.1;
var STEP_SOUND2 = read_data.loadSound("step2.wav");
STEP_SOUND2.volume = 0.1;
var START_STAGE_SOUND = read_data.loadSound("start_stage.wav");

const GAME_STATES = {
    ALIVE: "a",
    DEAD: "d",
    WIN: "w",
    PAUSED: "p"
}

const STAGES = [
    {
        player1: [-50, 0],
        player2: [50, 0],
        platforms: [[-100, 50, 300, 50, "grass"],
        [200, -200, 50, 300, "grass"],
        [-200, 200, 1500, 50, "grass"],
        [-250, -300, 50, 550, "grass"],
        [250, -200, 1050, 50, "grass"],
        [1300, -300, 50, 550, "grass"]],
        coins: [[200, -250], [600, -250], [1000, -250],
        [200, 150], [600, 150], [1000, 150]]
    },
    {
        player1: [-100, 0],
        player2: [100, 0],
        platforms: [[-150, 500, 350, 50, "grass"],
        [0, 0, 50, 500, "grass"],
        [-200, 300, 50, 250, "grass"],
        [200, 300, 50, 250, "grass"],
        [-600, 300, 400, 50, "grass"],
        [250, 300, 400, 50, "grass"],
        [-600, -400, 50, 750, "grass"],
        [-400, -200, 50, 400, "grass"],
        [650, -400, 50, 750, "grass"],
        [450, -200, 50, 400, "grass"],
        [-350, -200, 800, 50, "grass"]],
        coins: [[-500, 200], [550, 200], [0, -500]]
    },
    {
        player1: [0, 0],
        player2: [-100, 0],
        platforms: [[-500, 50, 1100, 50, "grass"],
        [800, -400, 50, 300, "grass"],
        [1000, -400, 50, 500, "grass"],
        [800, 50, 250, 50, "grass"],
        [0, 180, 800, 50, "grass"]],
        coins: [[-500, 0], [0, 130], [750, -400], [750, -300], [750, -200]]
    },
]

const MATERIALS = {
    "air": new Material(0.9, null, "air"),
    "grass": new Material(0.8, GRASS_TILE_SET, "grass"),
    "player1": new Material(0.8, [PLAYER1_TILESET, R_PLAYER1_TILESET], "player"),
    "player2": new Material(0.8, [PLAYER2_TILESET, R_PLAYER2_TILESET], "player"),
}

const COIN_SIZE = 30;
var CANVAS = null;
var CONTEXT = null;

// these will be drawn depending on gamestate
var BUTTONS = [];

// set these every stage
var PLATFORMS = [];
var COINS = [];
var PLAYERS = [null, null];
var gameState = GAME_STATES.ALIVE;

var keysDown = {};
var keysPressed = {}; // pressed this frame
var camera = null;

var coinCounter = [0, 1];  // current, total
var currentStage = 0;
var totalFrames = 0;

var fontSize = 0;
var fontChange = 0;


export function init() {
    // these will be drawn depending on gamestate
    BUTTONS = [];

    // set these every stage
    PLATFORMS = [];
    COINS = [];
    PLAYERS = [null, null];
    gameState = GAME_STATES.ALIVE;
    keysDown = {};
    keysPressed = {}; // pressed this frame
    camera = null;
    coinCounter = [0, 1];  // current, total
    currentStage = 0;
    totalFrames = 0;
    fontSize = 30;
    fontChange = 1;

    // CONSTANTS
    CANVAS = document.getElementById("jumper-canvas");
    CONTEXT = CANVAS.getContext("2d");

    setupStage([1, true]);

    // global event listeners
    window.addEventListener("keydown", function (event) {
        keysDown[event.keyCode] = true;
        keysPressed[event.keyCode] = true;
    });

    window.addEventListener("keyup", function (event) {
        delete keysDown[event.keyCode];
    });

    window.addEventListener("mouseup", function (event) {
        clickMouse(event);
    })

    main();
}


// CLASSES
class Button {
    constructor(x, y, text, callable, args) {
        this.text = text;
        let textSize = CONTEXT.measureText(this.text);
        let width = textSize.width + 25;
        this.rect = new Rectangle(x - width / 2, y - 35, width, 50);
        this.callable = callable;
        this.args = args;
    }

    draw() {
        CONTEXT.lineWidth = 5;
        // function is at the bottom
        CONTEXT.fillStyle = "white";
        roundRect(this.rect.x, this.rect.y, this.rect.width, 50, 5, true);

        CONTEXT.font = "30px Impact";
        CONTEXT.fillStyle = "black";
        CONTEXT.textAlign = "center"
        CONTEXT.fillText(this.text, this.rect.x + this.rect.width / 2, this.rect.y + 35);
    }

    click() {
        this.callable(this.args);
    }
}

class GameObject {
    constructor(x, y, w, h, material) {
        this.rect = new Rectangle(x, y, w, h);
        this.material = material;
    }

    collideWithObject(obj) {
        // check what side to push to
        let changes = [Math.abs(this.rect.bottom - obj.rect.top), Math.abs(this.rect.rigth - obj.rect.left),
        Math.abs(this.rect.top - obj.rect.bottom), Math.abs(this.rect.left - obj.rect.rigth)];
        let max = Math.min(...changes);
        let index = changes.indexOf(max);
        switch (index) {
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

    equals(otherObject) {
        if (otherObject == null) {
            return false;
        }
        return this.rect.equals(otherObject.rect);
    }

}

class Platform extends GameObject {
    // make sure that it is multiple of 50
    constructor(x, y, w, h, material, tileSet) {
        super(x, y, w, h, material);
        this.tileSet = tileSet;
    }

    draw() {
        // make sure that tileset order is the same
        let maxx = (Math.floor(this.rect.width / 50) - 1) * 50;
        let maxy = (Math.floor(this.rect.height / 50) - 1) * 50;
        for (let y = 0; y < this.rect.height; y += 50) {
            for (let x = 0; x < this.rect.width; x += 50) {
                let tileIndex = 0;
                if (y == 0) {
                    if (y == 0 && y == maxy && x == 0 && x == maxx) {
                        tileIndex = 8;
                    }
                    else if (y == maxy && x == 0) {
                        tileIndex = 2;
                    }
                    else if (y == maxy && x == maxx) {
                        tileIndex = 5;
                    }
                    else if (x == 0 && x == maxx) {
                        tileIndex = 9;
                    }
                    else if (x == 0) {
                        tileIndex = 3;
                    }
                    else if (x == maxx) {
                        tileIndex = 4;
                    }
                    else {
                        tileIndex = 1;
                    }
                }
                else if (y == maxy) {
                    if (x == 0 && x == maxx) {
                        tileIndex = 10;
                    }
                    else if (x == 0) {
                        tileIndex = 6;
                    }
                    else if (x == maxx) {
                        tileIndex = 7;
                    }
                }
                let imagePos = this.tileSet.getTilePos(tileIndex);
                CONTEXT.drawImage(this.tileSet.image, imagePos[0], imagePos[1], this.tileSet.tileSize.x,
                    this.tileSet.tileSize.y, this.rect.x + x, this.rect.y + y, 51, 51)
            }
        }
    }
}

class Coin extends GameObject {
    constructor(x, y, tileSet) {
        let size = 50;
        super(x, y, COIN_SIZE, COIN_SIZE, null);
        this.tileSet = tileSet;
        this.animation = new Animation(7, [0, 1, 2, 3, 4, 5, 6, 7], true)
    }

    draw() {
        let frameIndex = this.animation.getImageIndex();
        let imagePos = this.tileSet.getTilePos(frameIndex);

        CONTEXT.drawImage(this.tileSet.image, imagePos[0], imagePos[1], this.tileSet.tileSize.x,
            this.tileSet.tileSize.y, this.rect.x, this.rect.y, COIN_SIZE, COIN_SIZE)

    }
}

class Player extends GameObject {
    // a game object that can move and is not a static surrounding
    constructor(x, y, w, h, mass, material, tileSet, reverseTileSet) {
        super(x, y, w, h, material);
        this.mass = mass;
        this.yke = 0;  // y kinetic energy
        this.xke = 0;
        this.gpe = 0;  // gravitational potential energy
        // adjacent in order of bottom, left, top, rigth
        this.adjacentGameObjects = [null, null, null, null];
        this.lastJumpedPlatform = null;
        this.tileSet = tileSet;
        this.rTileSet = reverseTileSet;
        this.walkAnimation = new Animation(5, [2, 3, 7, 8, 9], false);
        this.framesTillSound = 20;
    }

    draw() {
        let tileIndex = 12;
        let tileSet = this.tileSet;
        if (gameState == GAME_STATES.DEAD) {
            if (this.xke > 0) {
                tileIndex = 6;
            }
            else {
                tileIndex = 0;
                tileSet = this.rTileSet;
            }
        }
        else if (gameState == GAME_STATES.WIN) {
            tileIndex = 12;
        }
        // in the air
        else if (this.adjacentGameObjects[0] == null) {
            if (this.xke > 0) {
                tileIndex = 2;
            }
            else {
                tileIndex = 4;
                tileSet = this.rTileSet;
            }
        }
        // walking on platform
        else if (this.xke > 0.5) {
            tileIndex = this.walkAnimation.getImageIndex();
            this.playWalkSound();
        }
        else if (this.xke < -0.5) {
            tileIndex = this.walkAnimation.getImageIndex();
            tileIndex = this.tileSet.tilesPerRow * (Math.floor(tileIndex / this.tileSet.tilesPerRow)) +
                ((this.tileSet.tilesPerRow - 1) - tileIndex % this.tileSet.tilesPerRow);
            tileSet = this.rTileSet;
            this.playWalkSound();

        }
        let imagePos = tileSet.getTilePos(tileIndex);
        CONTEXT.drawImage(tileSet.image, imagePos[0], imagePos[1], tileSet.tileSize.x,
            tileSet.tileSize.y, this.rect.x - 10, this.rect.y - 10, this.rect.width + 20,
            this.rect.height + 10)
    }

    playWalkSound() {
        if (this.framesTillSound > 0) {
            this.framesTillSound -= 1;
            if (this.framesTillSound == 10) {
                STEP_SOUND2.play();
            }
        }
        else {
            this.framesTillSound = 20;
            STEP_SOUND1.play();
        }
    }

    reset() {
        // reset certain values for the next frame
        this.adjacentGameObjects = [null, null, null, null];
    }

    move() {
        // move based on kinetic energy
        this.rect.y -= this.yke;
        this.rect.x += this.xke;

        handleCollision(this);

        // adjust y kinetic energy
        this.yke -= this.gpe;
        this.gpe = this.calcGpe();

        // adjust x kinetic energy
        let resistance = 0;
        if (this.adjacentGameObjects[0] == null) {
            resistance = MATERIALS["air"].resistance;
        }
        else {
            resistance = this.adjacentGameObjects[0].material.resistance;
        }
        this.xke *= resistance;
    }

    onTopOf(player) {
        if (this.adjacentGameObjects[0] == null) {
            return false;
        }
        if (this.adjacentGameObjects[0].material.name == "player") {
            return true;
        }
        return false;
    }

    handleBottemAdjacent() {
        this.yke = 0;
        this.lastJumpedPlatform = null;
    }

    handleTopAdjacent() {
        this.yke = -0.5;
    }

    handleLeftAdjacent() {
        this.xke = 0;
    }

    handleRigthAdjacent() {
        this.xke = 0;
    }

    calcGpe() {
        // because pixels divide
        return this.mass * (9.8 / 1000000) * ((WORLD_HEIGHT - this.rect.height) - (this.rect.y / 32));  // last 32 is a smoothing parameter
    }

}

function setupStage(values) {
    if (!values[1]) {
        START_STAGE_SOUND.play();
    }
    let stageNr = values[0];
    // loop back around
    if (stageNr > STAGES.length) {
        stageNr = 1;
    }
    totalFrames = 0;
    currentStage = stageNr;
    BUTTONS = []; // reset these
    gameState = GAME_STATES.ALIVE;

    let stageData = STAGES[stageNr - 1];
    PLAYERS = [];
    PLAYERS.push(new Player(stageData.player1[0], stageData.player1[1], 40, 70, 64, MATERIALS["player1"],
        MATERIALS["player1"].tileSet[0], MATERIALS["player1"].tileSet[1]),
        new Player(stageData.player2[0], stageData.player2[1], 45, 90, 64, MATERIALS["player2"],
            MATERIALS["player2"].tileSet[0], MATERIALS["player2"].tileSet[1]));

    PLATFORMS = [];
    for (let i = 0; i < stageData.platforms.length; i++) {
        let pData = stageData.platforms[i];
        PLATFORMS.push(new Platform(pData[0], pData[1], pData[2], pData[3], MATERIALS[pData[4]],
            MATERIALS[pData[4]].tileSet));
    }
    COINS = [];
    for (let i = 0; i < stageData.coins.length; i++) {
        let cData = stageData.coins[i];
        COINS.push(new Coin(cData[0], cData[1], COIN_TILESET));
    }

    coinCounter = [0, COINS.length];
    camera = new Camera(CANVAS);
}

function main() {
    processInput();
    resetPressedKeys();
    if (gameState == GAME_STATES.PAUSED) {
        draw();
    }
    else if (gameState == GAME_STATES.ALIVE) {
        // loop function
        // do this for all moving objects later
        for (let i = 0; i < PLAYERS.length; i++) {
            PLAYERS[i].reset();
            PLAYERS[i].move();
        }
        updateCamera();
        totalFrames += 1;
        draw();
    }
    else if (gameState == GAME_STATES.WIN) {
        draw();
        notifyText(`You won stage ${currentStage} in ${totalFrames} frames. Congratulations.`);
        // slow down camera
        camera.multiply(0.9);
    }
    else {
        draw();
        notifyText("Oops you died");
        // slow down camera
        camera.multiply(0.9);
    }
    requestAnimationFrame(main);
}


function notifyText(text) {
    // text with a wobble, relies on global fontSize parameter
    if (fontSize > 70 && fontChange > 0) {
        fontChange = -1;
    }
    else if (fontSize < 30 && fontChange < 0) {
        fontChange = 1;
    }
    fontSize += fontChange;
    CONTEXT.font = fontSize + "px Impact";
    CONTEXT.fillStyle = "black";
    CONTEXT.textAlign = "center";
    CONTEXT.fillText(text, CANVAS.width / 2, CANVAS.height / 2);
}


function processInput() {

    if (gameState == GAME_STATES.DEAD || gameState == GAME_STATES.WIN || gameState == GAME_STATES.PAUSED) {
        // quite lazy, will cause lots of troubles if extended on
        if (8 in keysDown) { // backspace
            for (let i = 0; i < BUTTONS.length; i++) {
                if (BUTTONS[i].text == "Retry") {
                    BUTTONS[i].click();
                    return;
                }
            }
        }
        if (13 in keysDown) { // enter
            for (let i = 0; i < BUTTONS.length; i++) {
                if (BUTTONS[i].text == "Next") {
                    BUTTONS[i].click();
                    return;
                }
            }
        }
        if (gameState == GAME_STATES.PAUSED) {
            if (27 in keysPressed) { // escape --> unpause
                unpauseStage();
            }
        }
    }
    else {
        // player 1
        // A
        if (65 in keysDown) {
            if (PLAYERS[0].adjacentGameObjects[0] != null) {
                PLAYERS[0].xke -= 2;
            }
            else {
                PLAYERS[0].xke -= 0.75;
            }
        }
        // D
        if (68 in keysDown) {
            if (PLAYERS[0].adjacentGameObjects[0] != null) {
                PLAYERS[0].xke += 2;
            }
            else {
                PLAYERS[0].xke += 0.75;
            }
        }
        // W
        if (87 in keysDown) {
            if (PLAYERS[0].adjacentGameObjects[0] != null) {
                PLAYERS[0].yke = 8;
                JUMP_SOUND.play();
            }
            else if (PLAYERS[0].adjacentGameObjects[1] != null && !PLAYERS[0].adjacentGameObjects[1].equals(PLAYERS[0].lastJumpedPlatform)) {
                PLAYERS[0].yke = 8;
                PLAYERS[0].xke = -7;
                PLAYERS[0].lastJumpedPlatform = PLAYERS[0].adjacentGameObjects[1];
                JUMP_SOUND.play();
            }
            else if (PLAYERS[0].adjacentGameObjects[3] != null && !PLAYERS[0].adjacentGameObjects[3].equals(PLAYERS[0].lastJumpedPlatform)) {
                PLAYERS[0].yke = 8;
                PLAYERS[0].xke = 7;
                PLAYERS[0].lastJumpedPlatform = PLAYERS[0].adjacentGameObjects[3];
                JUMP_SOUND.play();
            }
        }
        // player 2
        // left
        if (37 in keysDown) {
            if (PLAYERS[1].adjacentGameObjects[0] != null) {
                PLAYERS[1].xke -= 2.5;
            }
            else {
                PLAYERS[1].xke -= 0.8;
            }
        }
        // right
        if (39 in keysDown) {
            if (PLAYERS[1].adjacentGameObjects[0] != null) {
                PLAYERS[1].xke += 2.5;
            }
            else {
                PLAYERS[1].xke += 0.8;
            }
        }
        // up
        if (38 in keysDown) {
            if (PLAYERS[1].adjacentGameObjects[0] != null) {
                PLAYERS[1].yke = 8;
                JUMP_SOUND.play();
            }
            else if (PLAYERS[1].adjacentGameObjects[1] != null && !PLAYERS[1].adjacentGameObjects[1].equals(PLAYERS[1].lastJumpedPlatform)) {
                PLAYERS[1].yke = 8;
                PLAYERS[1].xke = -7;
                PLAYERS[1].lastJumpedPlatform = PLAYERS[1].adjacentGameObjects[1];
                JUMP_SOUND.play();
            }
            else if (PLAYERS[1].adjacentGameObjects[3] != null && !PLAYERS[1].adjacentGameObjects[3].equals(PLAYERS[1].lastJumpedPlatform)) {
                PLAYERS[1].yke = 8;
                PLAYERS[1].xke = 7;
                PLAYERS[1].lastJumpedPlatform = PLAYERS[1].adjacentGameObjects[3];
                JUMP_SOUND.play();
            }
        }
        if (27 in keysPressed) { // escape
            pauseStage();
        }
    }
}


function handleCollision(obj) {
    // check for collision and adjust per side
    checkGameObjectCollission(obj);
    for (let index = 0; index < 4; index++) {
        if (obj.adjacentGameObjects[index] != null) {
            switch (index) {
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

function checkGameObjectCollission(obj) {
    let miny = 0;
    let maxy = 0;
    // check for collission and set the adjacent sides when colliding
    for (let i = 0; i < PLATFORMS.length; i++) {
        if (obj.rect.collidesWith(PLATFORMS[i].rect)) {
            let collisionValues = obj.collideWithObject(PLATFORMS[i]);
            obj.adjacentGameObjects[collisionValues[0]] = collisionValues[1];
        }
        miny = Math.min(miny, PLATFORMS[i].rect.top);
        maxy = Math.max(maxy, PLATFORMS[i].rect.bottom);
    }

    if (PLAYERS[0].onTopOf(PLAYERS[1])) {
        PLAYERS[0].rect.bottom = PLAYERS[1].rect.top;
        PLAYERS[0].rect.left += PLAYERS[1].xke;
    }
    else if (PLAYERS[1].onTopOf(PLAYERS[0])) {
        PLAYERS[1].rect.bottom = PLAYERS[0].rect.top;
        PLAYERS[1].rect.left += PLAYERS[0].xke;
    }

    // check player collisions
    for (let i = 0; i < PLAYERS.length; i++) {
        if (obj == PLAYERS[i]) {
            continue;
        }
        if (obj.rect.collidesWith(PLAYERS[i].rect)) {
            let collisionValues = obj.collideWithObject(PLAYERS[i]);
            obj.adjacentGameObjects[collisionValues[0]] = collisionValues[1];
        }
    }


    // if either player goes of the stage loose
    if (PLAYERS[0].rect.y > maxy + 250) {
        loseStage();
    }
    if (PLAYERS[1].rect.y > maxy + 250) {
        loseStage();
    }
    // check coin collision
    for (let i = COINS.length - 1; i >= 0; i--) {
        if (obj.rect.collidesWith(COINS[i].rect)) {
            COINS.splice(i, 1);
            // play random coin sound
            COIN_SOUNDS[Math.floor(Math.random() * COIN_SOUNDS.length)].play();
            coinCounter[0] += 1;
            if (coinCounter[0] == coinCounter[1]) {
                winStage();
            }
        }
    }
}

function winStage() {
    gameState = GAME_STATES.WIN;
    WIN_SOUND.play();
    BUTTONS.push(new Button(CANVAS.width / 2 - 100, CANVAS.height / 2 + 100, "Retry", setupStage, [currentStage, true]));
    BUTTONS.push(new Button(CANVAS.width / 2 + 100, CANVAS.height / 2 + 100, "Next", setupStage, [currentStage + 1, false]));
}

function loseStage() {
    gameState = GAME_STATES.DEAD;
    DEATH_SOUND.play();
    BUTTONS.push(new Button(CANVAS.width / 2, CANVAS.height / 2 + 100, "Retry", setupStage, [currentStage, true]));
}

function pauseStage() {
    gameState = GAME_STATES.PAUSED;
    BUTTONS.push(new Button(CANVAS.width / 2, CANVAS.height / 2 - 200, "Resume", unpauseStage, []));
    BUTTONS.push(new Button(CANVAS.width / 2, CANVAS.height / 2 - 100, "Retry", setupStage, [currentStage, true]));
    BUTTONS.push(new Button(CANVAS.width / 2, CANVAS.height / 2, "Back", backToIndex, []));
}

function unpauseStage() {
    if (gameState == GAME_STATES.PAUSED) {
        gameState = GAME_STATES.ALIVE;
        BUTTONS = []; // might be problematic
    }
}

function backToIndex() {
    window.location.href = "index.html";
}

function updateCamera() {
    let x = ((CANVAS.width / 2 - PLAYERS[0].rect.center.x) + (CANVAS.width / 2 - PLAYERS[1].rect.center.x)) / 2;
    let y = ((CANVAS.height / 2 - PLAYERS[0].rect.center.y) + (CANVAS.height / 2 - PLAYERS[1].rect.center.y)) / 2;
    let beforeCenter = camera.center;
    camera.add(new Vector2(x, y));
    camera.substract(beforeCenter)
}


// drawing functions
function draw() {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
    drawBackground();
    drawPlatforms();
    drawCoins();
    drawPlayer();
    drawUI();
}

function drawBackground() {
    CONTEXT.drawImage(MOUNTAIN_IMAGE, 0, 0, CANVAS.width, CANVAS.height);
}

function drawPlatforms() {
    // draw all the PLATFORMS

    for (let i = 0; i < PLATFORMS.length; i++) {
        PLATFORMS[i].rect.move(camera.center);
        if (camera.rect.collidesWith(PLATFORMS[i].rect)) {
            PLATFORMS[i].draw();
        }
    }
}

function drawCoins() {
    for (let i = 0; i < COINS.length; i++) {
        COINS[i].rect.move(camera.center);
        if (camera.rect.collidesWith(COINS[i].rect)) {
            COINS[i].draw();
        }
    }
}

function drawPlayer() {
    for (let i = 0; i < PLAYERS.length; i++) {
        PLAYERS[i].rect.move(camera.center);
        PLAYERS[i].draw();
    }
}

function drawUI() {
    // draw coin goal
    CONTEXT.font = "30px Impact";
    CONTEXT.fillStyle = "black";
    CONTEXT.textAlign = "start"
    CONTEXT.fillText("Stage " + currentStage, 10, 35);
    CONTEXT.fillText(`${coinCounter[0]} / ${coinCounter[1]}`, 10, 70);
    let w = CONTEXT.measureText(`${coinCounter[0]} / ${coinCounter[1]}`).width

    let imagePos = COIN_TILESET.getTilePos(0);
    CONTEXT.drawImage(COIN_TILESET.image, imagePos[0], imagePos[1], COIN_TILESET.tileSize.x,
        COIN_TILESET.tileSize.y, w + 15, 40, 40, 40)

    for (let i = 0; i < BUTTONS.length; i++) {
        BUTTONS[i].draw();
    }
}


function clickMouse(event) {
    let rect = CANVAS.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    for (let i = 0; i < BUTTONS.length; i++) {
        if (BUTTONS[i].rect.collidesWith(new Rectangle(x, y, 1, 1))) {
            BUTTONS[i].click();
        }
    }
}

function resetPressedKeys() {
    keysPressed = {};
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
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    }
    else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
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