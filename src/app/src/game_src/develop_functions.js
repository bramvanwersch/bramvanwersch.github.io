import * as data from "./read_data.js"
import { Rectangle, Vector2 } from "./helper_classes.js"

// TODO
// 1. add texture to platforms
// 2. add rotate functionality 90 degrees
// 4. place environmental stuff
// 5. read in the images with xml

const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");
var PLATFORMS = [];
var SELECTED_PLAFORM_INDEX = null;
var idCount = 0;

var backgroundImage = null;

var keysDown = {}
var keysPressed = {}
var mouseLocation = new Vector2(0, 0);
var prevMouseLocation = null;
var isMouseDown = false;
var selectOffset = new Vector2(0, 0);
var camera = new Vector2(0, 0);

var copiedPLatform = null;


var tileImageSet = data.loadTileSet("tiles")

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
    PLATFORMS.push(new Platform(Math.floor(CANVAS.width / 2 - camera.x), Math.floor(CANVAS.height / 2 - camera.y), 50, 50));
}

function main(){
    processInput();
    resetInputValues();
    draw();
    requestAnimationFrame(main);
}

function processInput(){

    if ("w" in keysDown){
        camera.y -= 3;
    }
    if ("a" in keysDown){
        camera.x -= 3;
    }
    if ("s" in keysDown){
        camera.y += 3;
    }
    if ("d" in keysDown){
        camera.x += 3;
    }

    if (isMouseDown){
        if (SELECTED_PLAFORM_INDEX != null){
            PLATFORMS[SELECTED_PLAFORM_INDEX].rect.left = mouseLocation.x - selectOffset.x;
            PLATFORMS[SELECTED_PLAFORM_INDEX].rect.top = mouseLocation.y - selectOffset.y;
        }
        else{
            if (prevMouseLocation != null){
                camera.x += mouseLocation.x - prevMouseLocation.x;
                camera.y += mouseLocation.y - prevMouseLocation.y;
            }
            prevMouseLocation = mouseLocation;
        }
        setSelectedWidgetsInfo();

    }
    else{
        prevMouseLocation = null;
    }
    if (SELECTED_PLAFORM_INDEX != null){
        // arrow up
        let updateSelectedWidget = false;
        if ("ArrowUp" in keysPressed){
            PLATFORMS[SELECTED_PLAFORM_INDEX].rect.y -= 1;
            updateSelectedWidget = true;
        }
        // arrow down
        if ("ArrowDown" in keysPressed){
            PLATFORMS[SELECTED_PLAFORM_INDEX].rect.y += 1;
            updateSelectedWidget = true;
        }
        // arrow left
        if ("ArrowLeft" in keysPressed){
            PLATFORMS[SELECTED_PLAFORM_INDEX].rect.x -= 1;
            updateSelectedWidget = true;
        }
        // arrow right
        if ("ArrowRight" in keysPressed){
            PLATFORMS[SELECTED_PLAFORM_INDEX].rect.x += 1;
            updateSelectedWidget = true;
        }
        // change width
        if ("+" in keysPressed){
            PLATFORMS[SELECTED_PLAFORM_INDEX].rect.width += 50;
            updateSelectedWidget = true;
        }
        if ("_" in keysPressed){
            if (PLATFORMS[SELECTED_PLAFORM_INDEX].rect.width > 50){
                PLATFORMS[SELECTED_PLAFORM_INDEX].rect.width -= 50;
            }
        }
        // rotate
        if ("r" in keysPressed){
            let temp = PLATFORMS[SELECTED_PLAFORM_INDEX].rect.width;
            PLATFORMS[SELECTED_PLAFORM_INDEX].rect.width = PLATFORMS[SELECTED_PLAFORM_INDEX].rect.height;
            PLATFORMS[SELECTED_PLAFORM_INDEX].rect.height = temp;
        }

        // change height
        if ("=" in keysPressed){
            PLATFORMS[SELECTED_PLAFORM_INDEX].rect.height += 50;
            updateSelectedWidget = true;
        }
        if ("-" in keysPressed){
            if (PLATFORMS[SELECTED_PLAFORM_INDEX].rect.height > 50){
                PLATFORMS[SELECTED_PLAFORM_INDEX].rect.height -= 50;
            }
        }

        // copy pasting
        if ("Control" in keysDown){
            if ("c" in keysPressed){
                copiedPLatform = PLATFORMS[SELECTED_PLAFORM_INDEX];
            }
            if ("v" in keysPressed && copiedPLatform != null){
                let pltf = new Platform(copiedPLatform.rect.x + 25, copiedPLatform.rect.y + 25, copiedPLatform.rect.width, copiedPLatform.rect.height);
                PLATFORMS.push(pltf);
            }
        }

        // deselecting or deleting stuff last
        if ("Delete" in keysDown){
            PLATFORMS.splice(SELECTED_PLAFORM_INDEX, 1);
            deselectPlatform();
        }
        if ("Escape" in keysDown){
            deselectPlatform();
        }

        if (updateSelectedWidget){
            setSelectedWidgetsInfo();
        }
    }
    if (PLATFORMS.length > 0){
        if ("e" in keysPressed){
            if (SELECTED_PLAFORM_INDEX == null || SELECTED_PLAFORM_INDEX == PLATFORMS.length - 1){
                selectPlatform(0);
            }
            else{
                selectPlatform(SELECTED_PLAFORM_INDEX + 1);
            }
        }
        if ("q" in keysPressed){
            if (SELECTED_PLAFORM_INDEX == null || SELECTED_PLAFORM_INDEX == 0){
                selectPlatform(PLATFORMS.length - 1);
            }
            else{
                selectPlatform(SELECTED_PLAFORM_INDEX - 1);
            }
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
        if (i == SELECTED_PLAFORM_INDEX){
            continue
        }
        else{
            CONTEXT.fillRect(rect.x + camera.x, rect.y + camera.y, rect.width, rect.height);
        }
    }
    if (SELECTED_PLAFORM_INDEX != null){
        let rect = PLATFORMS[SELECTED_PLAFORM_INDEX].rect;
        CONTEXT.fillStyle = "red";
        CONTEXT.fillRect(rect.x + camera.x, rect.y + camera.y, rect.width, rect.height);
    }
}


// global event listeners
window.addEventListener("keydown", function(event){
    keysDown[event.key] = true;
    keysPressed[event.key] = true;
});

window.addEventListener("keyup", function(event){
    delete keysDown[event.key];
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
    isMouseDown = false;
}

function clickMouseDown(event) {
    let rect = CANVAS.getBoundingClientRect();
    let x = event.clientX - rect.left - camera.x;
    let y = event.clientY - rect.top - camera.y;
    if (x > CANVAS.width - camera.x){
        return;
    }
    isMouseDown = true;
    for (let i = 0; i < PLATFORMS.length; i++){
        let pltf = PLATFORMS[i];
        if (pltf.rect.collidesWith(new Rectangle(x, y, 1, 1))){
            selectOffset = new Vector2(x - pltf.rect.left + camera.x, y - pltf.rect.top + camera.y);
            selectPlatform(i);
            return;
        }
    }
    deselectPlatform();
}

function selectPlatform(index){
    if (SELECTED_PLAFORM_INDEX != null && index == SELECTED_PLAFORM_INDEX){
        return;
    }
    SELECTED_PLAFORM_INDEX = index;
    // change visibility of the platform change menu
    selectedWidgets.style.visibility = "visible";
    setSelectedWidgetsInfo();
}

function setSelectedWidgetsInfo(){
    if (SELECTED_PLAFORM_INDEX == null){
        return;
    }
    selectedXInput.value = PLATFORMS[SELECTED_PLAFORM_INDEX].rect.x;
    selectedYInput.value = PLATFORMS[SELECTED_PLAFORM_INDEX].rect.y;
    selectedWidthInput.value = PLATFORMS[SELECTED_PLAFORM_INDEX].rect.width;
    selectedHeightInput.value = PLATFORMS[SELECTED_PLAFORM_INDEX].rect.height;
}

function deselectPlatform(){
    SELECTED_PLAFORM_INDEX = null;
    selectedWidgets.style.visibility = "hidden";
}

function changePlatform(){
    PLATFORMS[SELECTED_PLAFORM_INDEX].rect.x = Number(selectedXInput.value);
    PLATFORMS[SELECTED_PLAFORM_INDEX].rect.y = Number(selectedYInput.value);
    PLATFORMS[SELECTED_PLAFORM_INDEX].rect.width = Number(selectedWidthInput.value);
    PLATFORMS[SELECTED_PLAFORM_INDEX].rect.height = Number(selectedHeightInput.value);
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

const selectedWidgets = document.getElementById("selected_widget_group");
const selectedXInput = document.getElementById("selected_x");
const selectedYInput = document.getElementById("selected_y");
const selectedWidthInput = document.getElementById("selected_width");
const selectedHeightInput = document.getElementById("selected_height");

const platformChangeButton = document.getElementById("selected_platform_submit");
platformChangeButton.addEventListener("click", changePlatform);


