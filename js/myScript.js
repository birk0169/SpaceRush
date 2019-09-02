//Variables
var myGamePiece;
var myObstacles = [];
var myScore;

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function(){
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    }, clear : function(){
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
}

//Contructors

function Component(width, height, color, x, y, type){
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function(){
        ctx = myGameArea.context;
        if(this.type == "text"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.x);
        } else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPos = function(){
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();

    }

    this.hitBottom = function(){
        var rockbottom = myGameArea.canvas.height - this.height;
        if(this.y > rockbottom){
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }

    this.crashWidth = function(otherObj){
        //This Object
        var myLeft = this.x;
        var myRight = this.x + (this.width);
        var myTop = this.y;
        var myBottom = this.y + (this.height);

        //Other Object
        var otherLeft = otherObj.x;
        var otherRight = otherObj.x + (otherObj.width);
        var otherTop = otherObj.y;
        var otherBottom = otherObj.y + (otherObj.height);

        //Check for collision
        let crash = true;
        if((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || (myLeft > otherRight)){
            crash = false;
        }
        return crash;
    }
}

//Methods
function startGame(){
    console.log("test");

    myGamePiece = new Component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = new Component("30", "Consolas", "black", 280, 40, "text");
    myGameArea.start();

}

function updateGameArea(){
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for(i = 0; i < myObstacles.length; i += 1){
        if(myGamePiece.crashWidth(myObstacles[i])){
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if(myGameArea.frameNo == 1 || everyinterval(150)){
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1) + minHeight);

        //Gap
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);

        myObstacles.push(new Component(10, height, "green", x, 0));
        myObstacles.push(new Component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1){
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
}

function everyinterval(n){
    if((myGameArea.frameNo / n) % 1 == 0){return true;}
    return false;
}

function accelerate(n){
    myGamePiece.gravity = n;
}

startGame();