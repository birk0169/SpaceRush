////Variables
//GamePiece
var myGamePiece;

var myPieceWidth = 80;
var myPieceHeight = 70;
var myPieceColor = "red";
var myPieceImgSrc = "img/quad-fighter-cut.png";
var myPieceX = 10;
var myPieceY = 210;

//Projectiles
var myBullets = [];
var firerate = 20;
var nextBullet = 0;

//Obstacles
var myObstacles = [];

//Score
var myScore;

//Background
var myBackground;

//Game Area
var gameAreaWidth = 880;
var gameAreaHeight = 480;

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        //Canvas style
        this.canvas.width = gameAreaWidth;
        this.canvas.height = gameAreaHeight;
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

//Background Area
var myBackgroundArea = {
    canvas : document.createElement("canvas"),
    start : function(){
        this.canvas.width = gameAreaWidth;
        this.canvas.height = gameAreaHeight;

        this.context = this.canvas.getContext("2d");

        //Add Canvas
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        //FrameNo : Obstacles
        this.frameNo = 0;

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
    if (type == "image" || type == "background") {
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
        if(type == "background"){ctx = myBackgroundArea.context;} 
        else{ctx = myGameArea.context;}
    

    //If Text
    if (type == "image" || type == "background") {
        ctx.drawImage(this.image, 
            this.x, 
            this.y,
            this.width, this.height);
        if(type == "background"){
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
        
    } else if(this.type == "text"){
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
    } else{
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
    //New Position
    this.newPos = function() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.type == "background") {
        if (this.x == -(this.width)) {
          this.x = 0;
        }
      } else{
          this.hitBottom();
          this.hitTop();
          this.hitLeft();
      }

    }

    this.hitTop = function(){
        let top = 0;
        if(this.y < 0){
            this.y = top;
        }
    }

    this.hitBottom = function(){
        let rockbottom = myGameArea.canvas.height - this.height;
        if(this.y > rockbottom){
            this.y = rockbottom;
        }
    }

    this.hitLeft = function(){
        let maxLeft = 0;
        if(this.x < maxLeft){
            this.x = maxLeft;
        }
    }

    this.hitRight = function(){
        let maxRight = myGameArea.width - this.width;
        if(this.x > maxRight){
            this.x = maxRight;
        }
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
//START GAME
function startGame(){
    
    myGamePiece = new Component(myPieceWidth, myPieceHeight, myPieceImgSrc, myPieceX, myPieceY, "image");
    
    myScore = new Component("30px", "Consolas", "white", 280, 40, "text");

    myBackground = new Component(880, 480, "img/starry-sky.png", 0, 0, "background");

    myGameArea.start();
    myBackgroundArea.start();
    
}

//Update
function updateGameArea(){
    
    //Check for crashes
    if(checkForCrashes(myObstacles, myGamePiece)[0]){
        myGameArea.stop();
          return;
    }
    

    myGameArea.clear();
    myGameArea.frameNo += 1;
    
    spawnObstacles();

    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();

    clearMove(); 

    // //Movement mouse control
    // if(myGameArea.x && myGameArea.y){
    //     myGamePiece.x = myGameArea.x;
    //     myGamePiece.y = myGameArea.y;
    // }

    //Firing Logic
    shootBullet();

    //Movement Keyboard control
    keyboardMove();
    
    //Background
    myBackground.speedX =- 4; 
    myBackground.newPos();
    myBackground.update();

    //Game Piece
    
    myGamePiece.newPos();
    myGamePiece.update();

    

    
    
}

function everyInterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
  }

function spawnObstacles(){
    var x, y, height, gap, minHeight, maxHeight, minGap, maxGap;
    
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
    for (i = 0; i < myObstacles.length; i += 1) {
        if(myObstacles[i].x < 0){
            myObstacles.splice(i, 1);
        } else if(true){

        }
    }
}

//Check for crashes
function checkForCrashes(arrayOne, obj){
    for(j = 0; j < arrayOne.length; j += 1){
        if(obj.crashWith(arrayOne[j])){
            return [true, j];
        }
    }
    return [false];
}

//Firing Logic
function shootBullet(){
    if(nextBullet != 0){
        nextBullet -= 1;
    }

    if((myGameArea.keys && myGameArea.keys[32]) && nextBullet == 0){
        //Spawn Bullet
        myBullets.push(new Component(10, 5, "white", myGamePiece.x + myGamePiece.width, (myGamePiece.y + (myGamePiece.height / 2))));
        
        nextBullet = firerate;
    }

    for(i = 0; i < myBullets.length; i += 1){
        myBullets[i].x += 6;
        myBullets[i].update();

        // checkBullet(myBullets[i]);
        let crashCheck = checkForCrashes(myObstacles, myBullets[i]);
        if(crashCheck[0]){
            myBullets.splice(i, 1);
            myObstacles.splice(crashCheck[1], 1);
        } else if(myBullets[i].x > gameAreaWidth){
            myBullets.splice(i, 1);
        }
    }
}

//Movement
function keyboardMove(){
    if (myGameArea.keys && myGameArea.keys[37]) {moveRight(); }
    if (myGameArea.keys && myGameArea.keys[39]) {moveLeft(); }
    if (myGameArea.keys && myGameArea.keys[38]) {moveUp(); }
    if (myGameArea.keys && myGameArea.keys[40]) {moveDown(); }
}

function changeImage(){
    myGamePiece.image.src = "img/quad-fighter-cut-moving.png";
}

function moveUp(){
    myGamePiece.speedY = -4;
    changeImage();
}

function moveDown(){
    myGamePiece.speedY = 4;
    changeImage();
}

function moveLeft(){
    myGamePiece.speedX = 4;
    changeImage();
}

function moveRight(){
    myGamePiece.speedX = -4;
    changeImage();
}

function clearMove(){
    myGamePiece.image.src = "img/quad-fighter-cut.png";
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;

    //Slow down
    // if(myGamePiece.speed > 0){
    // 	myGamePiece.speed -= 0.1;
    // } else if (myGamePiece.speed < 0){
    // 	myGamePiece.speed += 0.1;
    // }
}



//Start game
startGame();

