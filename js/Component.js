class Component{
    constructor(width, height, color, x, y){
        this.width = width;
        this.height = height;

        this.color = color;

        this.x = x;
        this.y = y;

        this.speedX = 0;
        this.speedY = 0;
    }

    update = () => {
        ctx = myGameArea.context;
        ctx.save();

        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    newPos = () => {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    crashWith = otherObj =>{
        var myLeft = this.x;
        var myRight = this.x + (this.width);
        var myTop = this.y;
        var myBottom = this.y + (this.height);

        var otherLeft = otherObj.x;
        var otherRight = otherObj.x + (otherObj.width);
        var otherTop = otherObj.y;
        var otherBottom = otherObj.y + (otherObj.height);

        var crash = true;
        if((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || (myLeft > otherRight)){
            crash = false;
        }
        return crash;
    }
}

export default class ImageComponent extends Component{
    constructor(width, height, src, x, y){
        this.width = width;
        this.height = height;

        this.image = new Image();
        this.image.src = src;

        this.x = x;
        this.y = y;

        this.speedX = 0;
        this.speedY = 0;
    }

    update = () => {
        ctx = myGameArea.context;
        ctx.save();

        ctx.drawImage(this.image, 
            this.x, 
            this.y,
            this.width, this.height);
    }
}

//Export
