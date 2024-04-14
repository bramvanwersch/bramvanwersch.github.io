
import { Rectangle, Vector2 } from "./helper_classes.js"


export const BACKGROUNDS = {
    city: "backgrounds/city_background.png",
    mountains: "backgrounds/mountains_background.png",
    rock: "backgrounds/rock.png"
}


export function loadImage(source){
    let img = new Image();
    img.src = "assets/game_assets/images/" + source;
    return img;
}

export function loadSound(source){
    let sound = new Audio("assets/game_assets/sounds/" + source);
    sound.preload = 'auto';
    sound.load();
    return sound;
}


export function loadTileSet(name){
    let imageset = tileSets[name];
    return new ImageSheet(imageset);
}


class ImageSheet{
    constructor(imageset){
        this.image = null;
        this.imageMapping = {};
        this.readTileSet(imageset);
        console.log(this.imageMapping)
    }

    readTileSet(imageset){
        for (let i = 0; i < imageset.length; i++){
            let ti = imageset[i];
            if ("image" in ti){
                this.image = ti["image"];
            }
            else{
                this.imageMapping[ti["name"]] = new Rectangle(Number(ti["x"]), Number(ti["y"]), Number(ti["width"]), Number(ti["height"]));
            }
        }
    }

    getImage(name){
        if (name in this.imageMapping){
            return this.imageMapping[name];
        }
        return null;
    }
}

var tileSets = {
tiles : [
    {"image":"tiles_spritesheet.png"},
    {"name":"box","x":"0","y":"864","width":"70","height":"70"},
    {"name":"boxAlt","x":"0","y":"792","width":"70","height":"70"},
    {"name":"boxCoin","x":"0","y":"720","width":"70","height":"70"},
    {"name":"boxCoinAlt","x":"0","y":"576","width":"70","height":"70"},
    {"name":"boxCoinAlt_disabled","x":"0","y":"504","width":"70","height":"70"},
    {"name":"boxCoin_disabled","x":"0","y":"648","width":"70","height":"70"},
    {"name":"boxEmpty","x":"0","y":"432","width":"70","height":"70"},
    {"name":"boxExplosive","x":"0","y":"360","width":"70","height":"70"},
    {"name":"boxExplosiveAlt","x":"0","y":"216","width":"70","height":"70"},
    {"name":"boxExplosive_disabled","x":"0","y":"288","width":"70","height":"70"},
    {"name":"boxItem","x":"0","y":"144","width":"70","height":"70"},
    {"name":"boxItemAlt","x":"0","y":"0","width":"70","height":"70"},
    {"name":"boxItemAlt_disabled","x":"432","y":"432","width":"70","height":"70"},
    {"name":"boxItem_disabled","x":"0","y":"72","width":"70","height":"70"},
    {"name":"boxWarning","x":"72","y":"648","width":"70","height":"70"},
    {"name":"brickWall","x":"216","y":"0","width":"70","height":"70"},
    {"name":"bridge","x":"216","y":"72","width":"70","height":"70"},
    {"name":"bridgeLogs","x":"288","y":"720","width":"70","height":"70"},
    {"name":"castle","x":"288","y":"792","width":"70","height":"70"},
    {"name":"castleCenter","x":"504","y":"288","width":"70","height":"70"},
    {"name":"castleCenter_rounded","x":"504","y":"720","width":"70","height":"70"},
    {"name":"castleCliffLeft","x":"504","y":"792","width":"70","height":"70"},
    {"name":"castleCliffLeftAlt","x":"648","y":"720","width":"70","height":"70"},
    {"name":"castleCliffRight","x":"648","y":"792","width":"70","height":"70"},
    {"name":"castleCliffRightAlt","x":"792","y":"288","width":"70","height":"70"},
    {"name":"castleHalf","x":"792","y":"360","width":"70","height":"70"},
    {"name":"castleHalfLeft","x":"432","y":"720","width":"70","height":"70"},
    {"name":"castleHalfMid","x":"648","y":"648","width":"70","height":"70"},
    {"name":"castleHalfRight","x":"792","y":"648","width":"70","height":"70"},
    {"name":"castleHillLeft","x":"648","y":"576","width":"70","height":"70"},
    {"name":"castleHillLeft2","x":"792","y":"576","width":"70","height":"70"},
    {"name":"castleHillRight","x":"792","y":"504","width":"70","height":"70"},
    {"name":"castleHillRight2","x":"792","y":"432","width":"70","height":"70"},
    {"name":"castleLedgeLeft","x":"856","y":"868","width":"5","height":"22"},
    {"name":"castleLedgeRight","x":"842","y":"868","width":"5","height":"22"},
    {"name":"castleLeft","x":"792","y":"216","width":"70","height":"70"},
    {"name":"castleMid","x":"792","y":"144","width":"70","height":"70"},
    {"name":"castleRight","x":"792","y":"72","width":"70","height":"70"},
    {"name":"dirt","x":"792","y":"0","width":"70","height":"70"},
    {"name":"dirtCenter","x":"720","y":"864","width":"70","height":"70"},
    {"name":"dirtCenter_rounded","x":"720","y":"792","width":"70","height":"70"},
    {"name":"dirtCliffLeft","x":"720","y":"720","width":"70","height":"70"},
    {"name":"dirtCliffLeftAlt","x":"720","y":"648","width":"70","height":"70"},
    {"name":"dirtCliffRight","x":"720","y":"576","width":"70","height":"70"},
    {"name":"dirtCliffRightAlt","x":"720","y":"504","width":"70","height":"70"},
    {"name":"dirtHalf","x":"720","y":"432","width":"70","height":"70"},
    {"name":"dirtHalfLeft","x":"720","y":"360","width":"70","height":"70"},
    {"name":"dirtHalfMid","x":"720","y":"288","width":"70","height":"70"},
    {"name":"dirtHalfRight","x":"720","y":"216","width":"70","height":"70"},
    {"name":"dirtHillLeft","x":"720","y":"144","width":"70","height":"70"},
    {"name":"dirtHillLeft2","x":"720","y":"72","width":"70","height":"70"},
    {"name":"dirtHillRight","x":"720","y":"0","width":"70","height":"70"},
    {"name":"dirtHillRight2","x":"648","y":"864","width":"70","height":"70"},
    {"name":"dirtLedgeLeft","x":"842","y":"892","width":"5","height":"18"},
    {"name":"dirtLedgeRight","x":"842","y":"912","width":"5","height":"18"},
    {"name":"dirtLeft","x":"504","y":"432","width":"70","height":"70"},
    {"name":"dirtMid","x":"504","y":"360","width":"70","height":"70"},
    {"name":"dirtRight","x":"648","y":"504","width":"70","height":"70"},
    {"name":"door_closedMid","x":"648","y":"432","width":"70","height":"70"},
    {"name":"door_closedTop","x":"648","y":"360","width":"70","height":"70"},
    {"name":"door_openMid","x":"648","y":"288","width":"70","height":"70"},
    {"name":"door_openTop","x":"648","y":"216","width":"70","height":"70"},
    {"name":"fence","x":"648","y":"144","width":"70","height":"70"},
    {"name":"fenceBroken","x":"648","y":"72","width":"70","height":"70"},
    {"name":"grass","x":"648","y":"0","width":"70","height":"70"},
    {"name":"grassCenter","x":"576","y":"864","width":"70","height":"70"},
    {"name":"grassCenter_rounded","x":"576","y":"792","width":"70","height":"70"},
    {"name":"grassCliffLeft","x":"576","y":"720","width":"70","height":"70"},
    {"name":"grassCliffLeftAlt","x":"576","y":"648","width":"70","height":"70"},
    {"name":"grassCliffRight","x":"576","y":"576","width":"70","height":"70"},
    {"name":"grassCliffRightAlt","x":"576","y":"504","width":"70","height":"70"},
    {"name":"grassHalf","x":"576","y":"432","width":"70","height":"70"},
    {"name":"grassHalfLeft","x":"576","y":"360","width":"70","height":"70"},
    {"name":"grassHalfMid","x":"576","y":"288","width":"70","height":"70"},
    {"name":"grassHalfRight","x":"576","y":"216","width":"70","height":"70"},
    {"name":"grassHillLeft","x":"576","y":"144","width":"70","height":"70"},
    {"name":"grassHillLeft2","x":"576","y":"72","width":"70","height":"70"},
    {"name":"grassHillRight","x":"576","y":"0","width":"70","height":"70"},
    {"name":"grassHillRight2","x":"504","y":"864","width":"70","height":"70"},
    {"name":"grassLedgeLeft","x":"849","y":"868","width":"5","height":"24"},
    {"name":"grassLedgeRight","x":"849","y":"894","width":"5","height":"24"},
    {"name":"grassLeft","x":"504","y":"648","width":"70","height":"70"},
    {"name":"grassMid","x":"504","y":"576","width":"70","height":"70"},
    {"name":"grassRight","x":"504","y":"504","width":"70","height":"70"},
    {"name":"hill_large","x":"842","y":"720","width":"48","height":"146"},
    {"name":"hill_largeAlt","x":"864","y":"0","width":"48","height":"146"},
    {"name":"hill_small","x":"792","y":"828","width":"48","height":"106"},
    {"name":"hill_smallAlt","x":"792","y":"720","width":"48","height":"106"},
    {"name":"ladder_mid","x":"504","y":"144","width":"70","height":"70"},
    {"name":"ladder_top","x":"504","y":"72","width":"70","height":"70"},
    {"name":"liquidLava","x":"504","y":"0","width":"70","height":"70"},
    {"name":"liquidLavaTop","x":"432","y":"864","width":"70","height":"70"},
    {"name":"liquidLavaTop_mid","x":"432","y":"792","width":"70","height":"70"},
    {"name":"liquidWater","x":"504","y":"216","width":"70","height":"70"},
    {"name":"liquidWaterTop","x":"432","y":"648","width":"70","height":"70"},
    {"name":"liquidWaterTop_mid","x":"432","y":"576","width":"70","height":"70"},
    {"name":"lock_blue","x":"432","y":"504","width":"70","height":"70"},
    {"name":"lock_green","x":"72","y":"576","width":"70","height":"70"},
    {"name":"lock_red","x":"432","y":"360","width":"70","height":"70"},
    {"name":"lock_yellow","x":"432","y":"288","width":"70","height":"70"},
    {"name":"rockHillLeft","x":"432","y":"216","width":"70","height":"70"},
    {"name":"rockHillRight","x":"432","y":"144","width":"70","height":"70"},
    {"name":"ropeAttached","x":"432","y":"72","width":"70","height":"70"},
    {"name":"ropeHorizontal","x":"432","y":"0","width":"70","height":"70"},
    {"name":"ropeVertical","x":"360","y":"864","width":"70","height":"70"},
    {"name":"sand","x":"360","y":"792","width":"70","height":"70"},
    {"name":"sandCenter","x":"576","y":"864","width":"70","height":"70"},
    {"name":"sandCenter_rounded","x":"576","y":"792","width":"70","height":"70"},
    {"name":"sandCliffLeft","x":"360","y":"720","width":"70","height":"70"},
    {"name":"sandCliffLeftAlt","x":"360","y":"648","width":"70","height":"70"},
    {"name":"sandCliffRight","x":"360","y":"576","width":"70","height":"70"},
    {"name":"sandCliffRightAlt","x":"360","y":"504","width":"70","height":"70"},
    {"name":"sandHalf","x":"360","y":"432","width":"70","height":"70"},
    {"name":"sandHalfLeft","x":"360","y":"360","width":"70","height":"70"},
    {"name":"sandHalfMid","x":"360","y":"288","width":"70","height":"70"},
    {"name":"sandHalfRight","x":"360","y":"216","width":"70","height":"70"},
    {"name":"sandHillLeft","x":"360","y":"144","width":"70","height":"70"},
    {"name":"sandHillLeft2","x":"360","y":"72","width":"70","height":"70"},
    {"name":"sandHillRight","x":"360","y":"0","width":"70","height":"70"},
    {"name":"sandHillRight2","x":"288","y":"864","width":"70","height":"70"},
    {"name":"sandLedgeLeft","x":"856","y":"892","width":"5","height":"18"},
    {"name":"sandLedgeRight","x":"856","y":"912","width":"5","height":"18"},
    {"name":"sandLeft","x":"288","y":"648","width":"70","height":"70"},
    {"name":"sandMid","x":"288","y":"576","width":"70","height":"70"},
    {"name":"sandRight","x":"288","y":"504","width":"70","height":"70"},
    {"name":"sign","x":"288","y":"432","width":"70","height":"70"},
    {"name":"signExit","x":"288","y":"360","width":"70","height":"70"},
    {"name":"signLeft","x":"288","y":"288","width":"70","height":"70"},
    {"name":"signRight","x":"288","y":"216","width":"70","height":"70"},
    {"name":"snow","x":"288","y":"144","width":"70","height":"70"},
    {"name":"snowCenter","x":"720","y":"864","width":"70","height":"70"},
    {"name":"snowCenter_rounded","x":"288","y":"72","width":"70","height":"70"},
    {"name":"snowCliffLeft","x":"288","y":"0","width":"70","height":"70"},
    {"name":"snowCliffLeftAlt","x":"216","y":"864","width":"70","height":"70"},
    {"name":"snowCliffRight","x":"216","y":"792","width":"70","height":"70"},
    {"name":"snowCliffRightAlt","x":"216","y":"720","width":"70","height":"70"},
    {"name":"snowHalf","x":"216","y":"648","width":"70","height":"70"},
    {"name":"snowHalfLeft","x":"216","y":"576","width":"70","height":"70"},
    {"name":"snowHalfMid","x":"216","y":"504","width":"70","height":"70"},
    {"name":"snowHalfRight","x":"216","y":"432","width":"70","height":"70"},
    {"name":"snowHillLeft","x":"216","y":"360","width":"70","height":"70"},
    {"name":"snowHillLeft2","x":"216","y":"288","width":"70","height":"70"},
    {"name":"snowHillRight","x":"216","y":"216","width":"70","height":"70"},
    {"name":"snowHillRight2","x":"216","y":"144","width":"70","height":"70"},
    {"name":"snowLedgeLeft","x":"863","y":"868","width":"5","height":"18"},
    {"name":"snowLedgeRight","x":"863","y":"888","width":"5","height":"18"},
    {"name":"snowLeft","x":"144","y":"864","width":"70","height":"70"},
    {"name":"snowMid","x":"144","y":"792","width":"70","height":"70"},
    {"name":"snowRight","x":"144","y":"720","width":"70","height":"70"},
    {"name":"stone","x":"144","y":"648","width":"70","height":"70"},
    {"name":"stoneCenter","x":"144","y":"576","width":"70","height":"70"},
    {"name":"stoneCenter_rounded","x":"144","y":"504","width":"70","height":"70"},
    {"name":"stoneCliffLeft","x":"144","y":"432","width":"70","height":"70"},
    {"name":"stoneCliffLeftAlt","x":"144","y":"360","width":"70","height":"70"},
    {"name":"stoneCliffRight","x":"144","y":"288","width":"70","height":"70"},
    {"name":"stoneCliffRightAlt","x":"144","y":"216","width":"70","height":"70"},
    {"name":"stoneHalf","x":"144","y":"144","width":"70","height":"70"},
    {"name":"stoneHalfLeft","x":"144","y":"72","width":"70","height":"70"},
    {"name":"stoneHalfMid","x":"144","y":"0","width":"70","height":"70"},
    {"name":"stoneHalfRight","x":"72","y":"864","width":"70","height":"70"},
    {"name":"stoneHillLeft2","x":"72","y":"792","width":"70","height":"70"},
    {"name":"stoneHillRight2","x":"72","y":"720","width":"70","height":"70"},
    {"name":"stoneLedgeLeft","x":"863","y":"908","width":"5","height":"24"},
    {"name":"stoneLedgeRight","x":"864","y":"148","width":"5","height":"24"},
    {"name":"stoneLeft","x":"72","y":"504","width":"70","height":"70"},
    {"name":"stoneMid","x":"72","y":"432","width":"70","height":"70"},
    {"name":"stoneRight","x":"72","y":"360","width":"70","height":"70"},
    {"name":"stoneWall","x":"72","y":"288","width":"70","height":"70"},
    {"name":"tochLit","x":"72","y":"216","width":"70","height":"70"},
    {"name":"tochLit2","x":"72","y":"144","width":"70","height":"70"},
    {"name":"torch","x":"72","y":"72","width":"70","height":"70"},
    {"name":"window","x":"72","y":"0","width":"70","height":"70"}],
items:[
    {"image":"items_spritesheet.png"},
    {"name":"bomb","x":"432","y":"432","width":"70","height":"70"},
    {"name":"bombFlash","x":"432","y":"360","width":"70","height":"70"},
    {"name":"bush","x":"346","y":"144","width":"70","height":"70"},
    {"name":"buttonBlue","x":"288","y":"504","width":"70","height":"70"},
    {"name":"buttonBlue_pressed","x":"419","y":"72","width":"70","height":"70"},
    {"name":"buttonGreen","x":"419","y":"0","width":"70","height":"70"},
    {"name":"buttonGreen_pressed","x":"418","y":"144","width":"70","height":"70"},
    {"name":"buttonRed","x":"360","y":"504","width":"70","height":"70"},
    {"name":"buttonRed_pressed","x":"360","y":"432","width":"70","height":"70"},
    {"name":"buttonYellow","x":"360","y":"360","width":"70","height":"70"},
    {"name":"buttonYellow_pressed","x":"360","y":"288","width":"70","height":"70"},
    {"name":"cactus","x":"360","y":"216","width":"70","height":"70"},
    {"name":"chain","x":"347","y":"72","width":"70","height":"70"},
    {"name":"cloud1","x":"0","y":"146","width":"128","height":"71"},
    {"name":"cloud2","x":"0","y":"73","width":"129","height":"71"},
    {"name":"cloud3","x":"0","y":"0","width":"129","height":"71"},
    {"name":"coinBronze","x":"288","y":"432","width":"70","height":"70"},
    {"name":"coinGold","x":"288","y":"360","width":"70","height":"70"},
    {"name":"coinSilver","x":"288","y":"288","width":"70","height":"70"},
    {"name":"fireball","x":"0","y":"435","width":"70","height":"70"},
    {"name":"flagBlue","x":"275","y":"72","width":"70","height":"70"},
    {"name":"flagBlue2","x":"275","y":"0","width":"70","height":"70"},
    {"name":"flagBlueHanging","x":"216","y":"504","width":"70","height":"70"},
    {"name":"flagGreen","x":"216","y":"432","width":"70","height":"70"},
    {"name":"flagGreen2","x":"216","y":"360","width":"70","height":"70"},
    {"name":"flagGreenHanging","x":"216","y":"288","width":"70","height":"70"},
    {"name":"flagRed","x":"274","y":"144","width":"70","height":"70"},
    {"name":"flagRed2","x":"216","y":"216","width":"70","height":"70"},
    {"name":"flagRedHanging","x":"203","y":"72","width":"70","height":"70"},
    {"name":"flagYellow","x":"203","y":"0","width":"70","height":"70"},
    {"name":"flagYellow2","x":"202","y":"144","width":"70","height":"70"},
    {"name":"flagYellowHanging","x":"144","y":"434","width":"70","height":"70"},
    {"name":"gemBlue","x":"144","y":"362","width":"70","height":"70"},
    {"name":"gemGreen","x":"144","y":"290","width":"70","height":"70"},
    {"name":"gemRed","x":"144","y":"218","width":"70","height":"70"},
    {"name":"gemYellow","x":"131","y":"72","width":"70","height":"70"},
    {"name":"keyBlue","x":"131","y":"0","width":"70","height":"70"},
    {"name":"keyGreen","x":"130","y":"146","width":"70","height":"70"},
    {"name":"keyRed","x":"72","y":"435","width":"70","height":"70"},
    {"name":"keyYellow","x":"72","y":"363","width":"70","height":"70"},
    {"name":"mushroomBrown","x":"72","y":"291","width":"70","height":"70"},
    {"name":"mushroomRed","x":"72","y":"219","width":"70","height":"70"},
    {"name":"particleBrick1a","x":"0","y":"553","width":"19","height":"14"},
    {"name":"particleBrick1b","x":"0","y":"530","width":"21","height":"21"},
    {"name":"particleBrick2a","x":"21","y":"553","width":"19","height":"14"},
    {"name":"particleBrick2b","x":"0","y":"507","width":"21","height":"21"},
    {"name":"plant","x":"0","y":"363","width":"70","height":"70"},
    {"name":"plantPurple","x":"0","y":"291","width":"70","height":"70"},
    {"name":"rock","x":"0","y":"219","width":"70","height":"70"},
    {"name":"snowhill","x":"288","y":"216","width":"70","height":"70"},
    {"name":"spikes","x":"347","y":"0","width":"70","height":"70"},
    {"name":"springboardDown","x":"432","y":"288","width":"70","height":"70"},
    {"name":"springboardUp","x":"432","y":"216","width":"70","height":"70"},
    {"name":"star","x":"504","y":"288","width":"70","height":"70"},
    {"name":"switchLeft","x":"504","y":"216","width":"70","height":"70"},
    {"name":"switchMid","x":"491","y":"72","width":"70","height":"70"},
    {"name":"switchRight","x":"491","y":"0","width":"70","height":"70"},
    {"name":"weight","x":"490","y":"144","width":"70","height":"70"},
    {"name":"weightChained","x":"432","y":"504","width":"70","height":"70"}]

}