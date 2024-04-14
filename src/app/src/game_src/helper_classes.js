
export class Vector2{
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

export class Rectangle{
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    get rigth(){
        return this.x + this.width;
    }

    set rigth(value){
        this.x = value - this.width;
    }

    get left(){
        return this.x;
    }

    set left(value){
        this.x = value;
    }

    get bottom(){
        return this.y + this.height;
    }

    set bottom(value){
        this.y = value - this.height;
    }

    get top(){
        return this.y;
    }

    set top(value){
        this.y = value;
    }

    get center(){
        return new Vector2(this.x + 0.5 * this.width, this.y + 0.5 * this.height);
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
        this.x += vector.x;
        this.y += vector.y;
    }

    equals(otherRect){
        if (otherRect.x != this.x){
            return false;
        }
        if (otherRect.y != this.y){
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


export class Material {
    constructor(resistance, tileSet, name) {
        this.resistance = resistance;
        this.tileSet = tileSet;
        this.name = name;
    }
}


export class TileSet {
    constructor(image, tileSize, tilesPerRow, offset) {
        this.image = image;
        this.tilesPerRow = tilesPerRow;
        this.tileSize = tileSize;
        this.offset = offset;
    }

    getTilePos(index) {
        let x = index % this.tilesPerRow;
        let y = Math.floor(index / this.tilesPerRow);
        return [this.offset.x + x * this.tileSize.x, this.offset.y + y * this.tileSize.y];
    }
}

export class Animation {
    constructor(framesPerImage, imageIndexes, randomStart) {
        this.framesPerImage = framesPerImage;
        this.imageIndexes = imageIndexes;
        this.currentIndex = 0;
        this.randomStart = randomStart;
        this.framesTillNext = this.framesPerImage;
        this.restart();
    }

    get totalImages() {
        return this.imageIndexes.length;
    }

    restart() {
        if (this.randomStart) {
            this.currentIndex = Math.floor(Math.random() * this.imageIndexes.length);
        }
        else {
            this.currentIndex = 0;
        }
        this.framesTillNext = this.framesPerImage;
    }

    getImageIndex() {
        if (this.framesTillNext > 0) {
            this.framesTillNext -= 1;
        }
        else {
            this.framesTillNext = this.framesPerImage;
            this.currentIndex = (this.currentIndex + 1) % this.imageIndexes.length;
        }
        return this.imageIndexes[this.currentIndex];
    }
}

export class Camera {
    constructor(canvas) {
        this.center = new Vector2(0, 0);
        this.canvas = canvas;
    }

    get rect() {
        return new Rectangle(0, 0, this.canvas.width, this.canvas.height)
    }

    multiply(value) {
        this.center = this.center.multiply(value);
    }

    add(vector) {
        this.center = this.center.add(vector);
    }

    substract(vector) {
        this.center = this.center.substract(vector);
    }
}