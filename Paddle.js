export default class Paddle {
    constructor(padElem){
        this.pad = padElem;
    }

    get y(){
        return getComputedStyle(this.y).getPropertyValue("--y");
    }

    set y(value){
        this.pad.style.setProperty("--y",value);
    }

    rect(){
        return this.pad.getBoundingClientRect();
    }

    //for AI only
    update(ball){
        this.y = ball.y;
        if(this.rect().top < 0){
            this.y = this.rect().height/2 / innerHeight * 100;
        }
        if(this.rect().bottom > innerHeight){
            this.y = (innerHeight - this.rect().height/2) / innerHeight * 100 ;
        }
    }
}