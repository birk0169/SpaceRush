//Import
// import Component from "/js/Component";

////Variables
//SCORE
var score = 0;

//GamePiece
var myGamePiece;

var myPieceWidth = 80;
var myPieceHeight = 70;
var myPieceColor = "red";
var myPieceImgSrc = "img/quad-fighter-cut.png";
var myPieceX = 10;
var myPieceY = 210;

var moving = true;

//Projectiles
var myBullets = [];
var firerate = 20;
var nextBullet = 0;

//Obstacles
var astroidsOn = false;
var extraAstroidsOn = false;
var probeShipsOn = false;
var cometsOn = false;

var myObstacles = [];

//Messages
var myGameMessage;

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

//Message Area
var myMessageArea = {
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
    if (type == "image" || (type == "background" || type == "message")) {
        this.image = new Image();
        this.image.src = color;
    } else if(type == "gif"){
        this.image = new Konvas.Image;
    }

    //Size
    this.width = width;
    this.height = height;

    //Hit Box: to be added

    //Speed
    this.speedX = 0;
    this.speedY = 0;

    //Is ship
    this.isShip = false;

    //health
    this.health = 0;

    //Position
    this.x = x;
    this.y = y; 
    this.update = function() {
        if(type == "background"){ctx = myBackgroundArea.context;}
        else if(type == "message"){ctx = myMessageArea.context;} 
        else{ctx = myGameArea.context;}
    

    //If Text
    if (type == "image" || (type == "background" || type == "message")) {
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
    } else if(type == "gif"){
        //Draw Gif
        ctx.drawImage(this.image.image, 0,0);
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
      } else if(this.isShip){
          this.hitBottom();
          this.hitTop();
          this.hitLeft();
          this.hitRight();
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
    //Game Message
    

    myGameMessage = new Component(500, 100, "img/game-start.png", -500, 195, "message");

    myGamePiece = new Component(myPieceWidth, myPieceHeight, myPieceImgSrc, myPieceX, myPieceY, "image");
    myGamePiece.isShip = true;
    
    myScore = new Component("30px", "Consolas", "white", 280, 40, "text");

    //Game Background layer
    myBackground = new Component(880, 480, "img/starry-sky.png", 0, 0, "background");

    myMessageArea.start();
    myGameArea.start();
    myBackgroundArea.start();
    
}



//Update
function updateGameArea(){
    
    //Check for crashes
    if(checkForCrashes(myObstacles, myGamePiece)[0]){
        //Play game over sound
        playSound("sine", 300, 1.2, 150, 0.5,1,0.9);

        myGameArea.stop();
          return;
    }
    
    
    myMessageArea.clear();

    myGameArea.clear();
    myGameArea.frameNo += 1;
    
    spawnObstacles();

    myScore.text = "SCORE: " + (score + myGameArea.frameNo);
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
    
    //Event
    ObstacleControl();
    

    //Messages
    myGameMessage.speedX =+ 4;
    myGameMessage.newPos();
    myGameMessage.update();

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
        y = myGameArea.canvas.height;

        // //Size
        // minHeight = 20;
        // maxHeight = 200;
        // height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);

        // //Gap
        // minGap = 100;
        // maxGap = 300;
        // gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);

        // // y = myGameArea.canvas.height - 200
        // myObstacles.push(new Component(10, height, "green", x, 0));
        // myObstacles.push(new Component(10, x - height - gap, "green", x, height + gap));

        //Fighter
        let ranY2 = Math.floor(Math.random()*(y-80 - 0));

        let ranY;

        if(probeShipsOn){
            //Random Y Axis
            ranY = Math.floor(Math.random()*(y-30 - 0));

            newBaddie = new Component(50, 30, "img/probe.gif", x, ranY, "image")
            newBaddie.speedX = -3;

            //Push probe Ship
            myObstacles.push(newBaddie);
        }
        if(astroidsOn){
            //Astroids
            let randomNumber = Math.floor(Math.random()*6+1);
            let astroidHealth, astroidImg, astroidHeight, astroidWidth;

            if(randomNumber == 1){
                astroidImg = "img/astroid-3.png";
                astroidHeight = 100;
                astroidWidth = 100;
                astroidHealth = 5;
            } else if(randomNumber <= 3 ){
                astroidImg = "img/astroid-1.png";
                astroidHeight = 80;
                astroidWidth = 80;
                astroidHealth = 3;
            } else{
                astroidImg = "img/astroid-2.png";
                astroidHeight = 50;
                astroidWidth = 50;
                astroidHealth = 2;
            }

            ranY = Math.floor(Math.random()*(y-astroidHeight - 0));

            newAstroid = new Component(astroidHeight, astroidWidth, astroidImg, x, ranY, "image");
            newAstroid.speedX = -1;
            newAstroid.health = astroidHealth;

            //Push astroid
            myObstacles.push(newAstroid);
        }
        if(extraAstroidsOn){
            //Astroids
            let randomNumber = Math.floor(Math.random()*6+1);
            let astroidHealth, astroidImg, astroidHeight, astroidWidth;

            if(randomNumber == 1){
                astroidImg = "img/astroid-3.png";
                astroidHeight = 100;
                astroidWidth = 100;
                astroidHealth = 5;
            } else if(randomNumber <= 3 ){
                astroidImg = "img/astroid-1.png";
                astroidHeight = 80;
                astroidWidth = 80;
                astroidHealth = 3;
            } else{
                astroidImg = "img/astroid-2.png";
                astroidHeight = 50;
                astroidWidth = 50;
                astroidHealth = 2;
            }

            ranY = Math.floor(Math.random()*(y-astroidHeight - 0));

            newAstroid = new Component(astroidHeight, astroidWidth, astroidImg, x + 60, ranY, "image");
            newAstroid.speedX = -1;
            newAstroid.health = astroidHealth;

            //Push astroid
            myObstacles.push(newAstroid);
        }
        if(cometsOn){
            ranY = Math.floor(Math.random()*(y-30 - 0));

            newComet = new Component(90, 30, "img/comet.png", x, ranY, "image")
            newComet.speedX = -9;

            //Push probe Ship
            myObstacles.push(newComet);
        }
        

    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += myObstacles[i].speedX;
        myObstacles[i].update();
        // myObstacles[i].newPos();
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        if(myObstacles[i].x < -100){
            myObstacles.splice(i, 1);
        }
    }
}


//Check for crashes
///Takes in an array and a object and then returns a array with either: a false or a true and a index value
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

        //Play bullet fire sound
        playSound("triangle", 480, 0.5, 200, 0.6);

        //Spawn Bullet
        let newBullet = new Component(14, 7, "img/bullet.png", myGamePiece.x + myGamePiece.width, (myGamePiece.y + myGamePiece.height / 2), "image");
        newBullet.speedX = 6;
        myBullets.push(newBullet);
        
        nextBullet = firerate;
    }

    for(i = 0; i < myBullets.length; i += 1){
        // myBullets[i].speedX = 6;
        myBullets[i].y += myBullets[i].speedY;
        myBullets[i].update();

        myBullets[i].newPos();

        // checkBullet(myBullets[i]);
        let crashCheck = checkForCrashes(myObstacles, myBullets[i]);
        if(crashCheck[0]){
            //Play bullet hit sound
            playSound("triangle",200,0.4,333,0.1,100,0.4,80,0.45);

            myBullets.splice(i, 1);
            let hitObstacle = myObstacles[crashCheck[1]];
            if(hitObstacle.health <= 1){
                myObstacles.splice(crashCheck[1], 1);

                //Temp point for destroying obstacles
                score += 50;
            } else{
                hitObstacle.health -= 1;
            }
            
        } else if(myBullets[i].x > gameAreaWidth){
            myBullets.splice(i, 1);
        }
    }
}

function ObstacleControl(){
    let fNo = myGameArea.frameNo;

    if(fNo == 600){
        //Enter Astroid Field
        astroidsOn = true;

        myGameMessage.x = -500;
        myGameMessage.image.src = "img/messages/enter-astroid.png";
    }
    if(fNo == 1000){
        extraAstroidsOn = true;
    }
    if(fNo == 1500){
        cometsOn = true;
    }
    if(fNo == 2000){
        astroidsOn = false;
    }
    if(fNo == 2400){
        extraAstroidsOn = false;
        cometsOn = false;
    }

    if(fNo == 3000){
        //Enter Recon Zone
        myGameMessage.x = -500;
        myGameMessage.image.src = "img/messages/enter-recon.png";

        probeShipsOn = true;
        astroidsOn = true;
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
    myGamePiece.image.src = "img/Quad-Fighter-animated.gif";
    // if(moving){
        
    //     moving = false;
    // } else{

    // }
    
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

