

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