////Variables
//GamePiece
var myGamePiece;

var myPieceWidth = 80;
var myPieceHeight = 70;
var myPieceColor = "red";
var myPieceImgSrc = "img/quad-fighter-cut.png";
var myPieceX = 10;
var myPieceY = 210;

//Obstacles
var myObstacles = [];

//Score
var myScore;

//Game Area
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        //Canvas style
        this.canvas.width = 880;
        this.canvas.height = 480;
        // this.canvas.style.cursor = "none"; //Hide the original cursor
        this.context = this.canvas.getContext("2d");

        //Add Canvas
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        //FrameNo : Obstacles
        this.frameNo = 0;

        //Set interval
        this.interval = setInterval(updateGameArea, 20);

        // //EventListener Mouse control
        // window.addEventListener('mousemove', function(e){
        //     myGameArea.x = e.pageX;
        //     myGameArea.y = e.pageY;
        // })

        //keyboard Control
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
          })
          window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false; 
          })
    },
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function(){
        clearInterval(this.interval);
    }
}

////Contructors
function Component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }

    //Size
    this.width = width;
    this.height = height;

    //Speed
    this.speedX = 0;
    this.speedY = 0;

    //Position
    this.x = x;
    this.y = y; 
    this.update = function() {
    ctx = myGameArea.context;

    //If Text
    if(this.type == "text"){
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
    } else if (type == "image") {
        ctx.drawImage(this.image, 
          this.x, 
          this.y,
          this.width, this.height);
      } else{
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
    //New Position
    this.newPos = function() {
      this.x += this.speedX;
      this.y += this.speedY; 
    }
    //Crash check
    this.crashWith = function(otherObj){
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

////Methods
//Start game
function startGame(){
    
    myGamePiece = new Component(myPieceWidth, myPieceHeight, myPieceImgSrc, myPieceX, myPieceY, "image");
    
    myScore = new Component("30px", "Consolas", "black", 280, 40, "text");

    myGameArea.start();
    
}

//Update
function updateGameArea(){
    var x, y, height, gap, minHeight, maxHeight, minGap, maxGap;
    //Check for crashes
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
          myGameArea.stop();
          return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    //EveryInterval control the frequency of obstacles
    if (myGameArea.frameNo == 1 || everyInterval(100)) {

        //Obstacles
        x = myGameArea.canvas.width;

        //Size
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);

        //Gap
        minGap = 100;
        maxGap = 300;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);

        // y = myGameArea.canvas.height - 200
        myObstacles.push(new Component(10, height, "green", x, 0));
        myObstacles.push(new Component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -2;
        myObstacles[i].update();
    }

    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();


    // myGamePiece.image.src = "img/quad-fighter-cut-moving.png";
    clearMove(); 

    // //Movement mouse control
    // if(myGameArea.x && myGameArea.y){
    //     myGamePiece.x = myGameArea.x;
    //     myGamePiece.y = myGameArea.y;
    // }

    // move();

    // myGamePiece.image.src = "img/quad-fighter-cut-moving.png";
    //Movement Keyboard control
    if (myGameArea.keys && myGameArea.keys[37]) {moveRight(); }
    if (myGameArea.keys && myGameArea.keys[39]) {moveLeft(); }
    if (myGameArea.keys && myGameArea.keys[38]) {moveUp(); }
    if (myGameArea.keys && myGameArea.keys[40]) {moveDown(); }
    myGamePiece.newPos();
    myGamePiece.update();
    
    
}

function everyInterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
  }

//Movement
function move(){
    if(myGameArea.keys){
        myGamePiece.image.src = "img/quad-fighter-cut-moving.png";
    } else{
        myGamePiece.image.src = "img/quad-fighter-cut.png";
    }
}

function changeImage(){
    myGamePiece.image.src = "img/quad-fighter-cut-moving.png";
}

function moveUp(){
    myGamePiece.speedY -= 4;
    changeImage();
}

function moveDown(){
    myGamePiece.speedY += 4;
    changeImage();
}

function moveLeft(){
    myGamePiece.speedX += 4;
    changeImage();
}

function moveRight(){
    myGamePiece.speedX -= 4;
    changeImage();
}

function clearMove(){
    myGamePiece.image.src = "img/quad-fighter-cut.png";
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    
}

//Start game
startGame();

