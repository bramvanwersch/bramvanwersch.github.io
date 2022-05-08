import * as data from "./read_data.js"
import { Rectangle, Vector2 } from "./rectangle.js"

// TODO
// 1. add texture to platforms
// 3. move camera with wasd
// 4. place environmental stuff
// 5. read in the images with xml

const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");
var PLATFORMS = [];
var SELECTED_PLAFORM = null;
var idCount = 0;

var backgroundImage = null;

var keysDown = {}
var keysPressed = {}
var mouseLocation = new Vector2(0, 0);
var isMouseDown = false;
var selectOffset = new Vector2(0, 0);

class Platform{
    constructor(x, y, w, h){
        this.rect = new Rectangle(x, y, w, h);
        this.id = idCount;
        idCount += 1;

    }
}

function setup(){
    setupDynamicComponents();
    main();
}

function setupDynamicComponents(){
    backgroundSelect.options[backgroundSelect.options.length] = new Option("white", "white");
    for (const key in data.BACKGROUNDS){
        backgroundSelect.options[backgroundSelect.options.length] = new Option(key, key);
    }
}

function changeBackground(){
    if (backgroundSelect.value == "white"){
        backgroundImage = null;
        return;
    }
    let imgFile = data.BACKGROUNDS[backgroundSelect.value];
    backgroundImage = data.loadImage(imgFile)

}

function addPlatform(){
    PLATFORMS.push(new Platform(0, 0, 100, 100));
}

function main(){
    processInput();
    resetInputValues();
    draw();
    requestAnimationFrame(main);
}

function processInput(){
    if (isMouseDown){
        if (SELECTED_PLAFORM != null){
            SELECTED_PLAFORM.rect.left = mouseLocation.x - selectOffset.x;
            SELECTED_PLAFORM.rect.top = mouseLocation.y - selectOffset.y;
        }
        setSelectedWidgetsInfo();
    }
    if (SELECTED_PLAFORM != null){
        // arrow up
        if (38 in keysDown){
            SELECTED_PLAFORM.rect.y -= 1;
            setSelectedWidgetsInfo();
        }
        // arrow down
        if (40 in keysDown){
            SELECTED_PLAFORM.rect.y += 1;
            setSelectedWidgetsInfo();
        }
        // arrow left
        if (37 in keysDown){
            SELECTED_PLAFORM.rect.x -= 1;
            setSelectedWidgetsInfo();
        }
        // arrow right
        if (39 in keysDown){
            SELECTED_PLAFORM.rect.x += 1;
            setSelectedWidgetsInfo();
        }
        if (27 in keysDown){
            deselectPlatform();
        }
    }
}

function draw(){
    CANVAS.width  = window.innerWidth - 250;
    CANVAS.height = window.innerHeight;
    drawBackground();
    drawPlatforms();
}


function drawBackground(){
    if (backgroundImage != null){
        CONTEXT.drawImage(backgroundImage, 0, 0, CANVAS.width, CANVAS.height);
    }
}


function drawPlatforms(){
    for (let i = 0; i < PLATFORMS.length; i++){
        let rect = PLATFORMS[i].rect;
        CONTEXT.beginPath();
        CONTEXT.rect(rect.x, rect.y, rect.width, rect.height);
        CONTEXT.fill();
        if (SELECTED_PLAFORM != null && PLATFORMS[i].id == SELECTED_PLAFORM.id){
            CONTEXT.strokeStyle  = "red";
            CONTEXT.lineWidth = 2;
            CONTEXT.stroke();
        }
    }
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
    clickMouseUp(event);
})

window.addEventListener("mousedown", function(event){
    clickMouseDown(event);
})

document.addEventListener("mousemove", function(event){
    moveMouse(event);
});

function clickMouseUp(event) {
    let rect = CANVAS.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    isMouseDown = false;
}

function clickMouseDown(event) {
    let rect = CANVAS.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    if (x > CANVAS.width){
        return;
    }

    isMouseDown = true;
    for (let i = 0; i < PLATFORMS.length; i++){
        let pltf = PLATFORMS[i];
        if (pltf.rect.collidesWith(new Rectangle(x, y, 1, 1))){
            selectOffset = new Vector2(x - pltf.rect.left, y - pltf.rect.top);
            selectPlatform(pltf);
            return;
        }
    }
    deselectPlatform();
}

function selectPlatform(platform){
    if (SELECTED_PLAFORM != null && platform.id == SELECTED_PLAFORM.id){
        return;
    }
    SELECTED_PLAFORM = platform;
    // change visibility of the platform change menu
    selecedWidgets.style.visibility = "visible";
    setSelectedWidgetsInfo();
}

function setSelectedWidgetsInfo(){
    selectedXInput.value = SELECTED_PLAFORM.rect.x;
    selectedYInput.value = SELECTED_PLAFORM.rect.y;
    selectedWidthInput.value = SELECTED_PLAFORM.rect.width;
    selectedHeightInput.value = SELECTED_PLAFORM.rect.height;
}

function deselectPlatform(){
    SELECTED_PLAFORM = null;
    selecedWidgets.style.visibility = "hidden";
}

function changePlatform(){
    SELECTED_PLAFORM.rect.x = Number(selectedXInput.value);
    SELECTED_PLAFORM.rect.y = Number(selectedYInput.value);
    SELECTED_PLAFORM.rect.width = Number(selectedWidthInput.value);
    SELECTED_PLAFORM.rect.height = Number(selectedHeightInput.value);
}

function moveMouse(event){
    let x = event.clientX;
    let y = event.clientY;
    mouseLocation = new Vector2(x, y);
}

function resetInputValues(){
    keysPressed = {};
}

// make sure that the main function is running
window.onload = function(){
    setup();
}

// bind events and set values for html widgets
const backgroundSelect = document.getElementById("background_select");
backgroundSelect.addEventListener('change', changeBackground);

const platformButton = document.getElementById("new_platform_button");
platformButton.addEventListener("click", addPlatform);

const selecedWidgets = document.getElementById("selected_widget_group");
const selectedXInput = document.getElementById("selected_x");
const selectedYInput = document.getElementById("selected_y");
const selectedWidthInput = document.getElementById("selected_width");
const selectedHeightInput = document.getElementById("selected_height");

const platformChangeButton = document.getElementById("selected_platform_submit");
platformChangeButton.addEventListener("click", changePlatform);


