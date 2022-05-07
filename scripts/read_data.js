

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