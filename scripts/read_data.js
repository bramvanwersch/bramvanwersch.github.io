
export const BACKGROUNDS = {
    city: "backgrounds/city_background.png",
    mountains: "backgrounds/mountains_background.png",
    rock: "backgrounds/rock.png"
}


export function loadImage(source){
    let img = new Image();
    img.src = "data/assets/images/" + source;
    return img;
}

export function loadSound(source){
    let sound = new Audio("data/assets/sounds/" + source);
    sound.preload = 'auto';
    sound.load();
    return sound;
}

export async function readLayoutFile(source){
    let fullText = [];
    await fetch(source).then(response => response.text()).then(text => safeText(text, fullText))
    let text = fullText[0];
    let lines = text.split("\n");
    for (let i = 0; i < lines.length; i++){
        console.log(lines[i]);
    }
}

function safeText(text, varaible){
    varaible.push(text);
}