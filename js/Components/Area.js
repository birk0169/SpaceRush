class Area{
    constructor(width, height){
        this.canvas = document.createElement("canvas"),
        this.canvas.width = width;
        this.canvas.height = height;

        this.context = this.canvas.getContext("2d");

        this.interval = null;

        this.frameNo = 0;
    }

    start(){
        this.frameNo = 0;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }

    clear(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    stop(){
        clearInterval(this.interval);
    }
}

class GameArea extends Area{
    constructor(width, height, updateFunc){
        super(width, height);
        this.updateFunc = updateFunc;
    }

    start(){
        this.frameNo = 0;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.interval = setInterval(this.updateFunc, 100);
    }
}