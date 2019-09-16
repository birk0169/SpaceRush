//Import
// import Component from "/js/Component";

////Variables
//GameTime
var gameTime = 0;

//SCORE
var score = 0;
var timeBonus = 0;

//GamePiece
var myGamePiece;

var myPieceWidth = 80;
var myPieceHeight = 70;
var myPieceColor = "red";
var myPieceImgSrc = "img/quad-fighter-cut.png";
var myPieceX = 10;
var myPieceY = 210;

//Invincibility
var invincibilityOn = false;
var invincibilityTimer = 100;
var invincilityFrame = 1;

// var moving = true;

//Projectiles
var myBullets = [];
var firerate = 20;
var nextBullet = 0;

var ultimaBulletOn = true;
var ultraBulletOn = false;
var superBulletOn = false;
var wideBulletOn = false;

//Obstacles
var astroidsOn = false;
var smallAstroidsOn = false;
var extraAstroidsOn = false;
var probeShipsOn = false;
var heavyProbesOn = false;
var advancedProbesOn = false;
var patrolShipsOn = false;
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
    if ((type == "image" || type == "obstacle") || (type == "background" || type == "message")) {
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

    //Is ship?
    this.isShip = false;

    //Is obstacle?
    this.isObstacle = false;

    //health
    this.health = 0;

    //Point value
    this.pointsValue = 0;

    //Bullet
    this.bulletDamage = 1;

    //Position
    this.x = x;
    this.y = y; 
    this.update = function() {
        if(type == "background"){ctx = myBackgroundArea.context;}
        else if(type == "message"){ctx = myMessageArea.context;} 
        else{ctx = myGameArea.context;}
    

    //If Text
    if ((type == "image" || type == "obstacle") || (type == "background" || type == "message")) {
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

    this.onDestruction = function(){
        console.log("it works so far");
    }

    this.abilityList = [];
    this.abilityInterval = 0;
    this.obstacleFunctions = function(){
        if(this.abilityList.length != 0){
            if(gameTime % this.abilityInterval == 0){
                for(a = 0; a < this.abilityList.length; a += 1){
                    triggerEnemyAbility(this.abilityList[a], this.x, this.y + this.height /2);
                }

                // spawnEnemyBullet(this.x, this.y + this.width /2);
                
            }
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
    myGamePiece.health = 3;
    
    myScore = new Component("30px", "Consolas", "white", 280, 40, "text");

    myHeart = new Component(29, 29, "img/icons/blue-heart.png", 20, 20, "image");
    
    myHealth = new Component("26px", "Consolas", "white", 55, 43, "text");

    //Game Background layer
    myBackground = new Component(880, 480, "img/starry-sky.png", 0, 0, "background");

    myMessageArea.start();
    myGameArea.start();
    myBackgroundArea.start();

    
    
}



//Update
function updateGameArea(){
    
    //Check for player crashes
    if(checkForCrashes(myObstacles, myGamePiece)[0]){
        
        if(!invincibilityOn){
            //Play game over sound
            playSound("sine", 300, 1.2, 150, 0.5,1,0.9);

            //Lowe player Health
            myGamePiece.health -= 1;

            if(myGamePiece.health <= 0){
                //Game over
                myGameArea.stop();
                return;
            } else{
                //Start invincibility
                invincibilityOn = true;
                invincibilityTimer = 0;
            }
        }
    }

    if(invincibilityOn && invincibilityTimer != 100){
        invincibilityTimer++;
    } else{
        invincibilityOn = false;
    }
    
    
    myMessageArea.clear();

    myGameArea.clear();
    myGameArea.frameNo += 1;

    gameTime = myGameArea.frameNo;
    
    spawnObstacles();

    if(myGameArea.frameNo > 300){
        timeBonus += 1;
    }

    myScore.text = "SCORE: " + (score + timeBonus);
    myScore.update();

    myHealth.text = "x" + (myGamePiece.health - 1);
    myHealth.update();
    myHeart.update();
    

    

    clearMove(); 
    // slowDown();

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
    // var x, y, height, gap, minHeight, maxHeight, minGap, maxGap;
    
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

        
        //Control Obstacles
        if(probeShipsOn){
            spawnProbe();
        }
        if(heavyProbesOn){
            spawnHeavyProbe(40);
        }
        if(advancedProbesOn){
            spawnAdvancedProbe();
        }
        if(patrolShipsOn){
            spawnPatrolShip();
        }
        if(astroidsOn){
            //Astroids
            spawnAstroid();
        }
        if(extraAstroidsOn){
            spawnAstroid(60);
        }
        if(smallAstroidsOn){
            spawnSmallAstroid();
        }
        if(cometsOn){
            spawnComet();
        }
        

    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].newPos();
        myObstacles[i].update();
        myObstacles[i].obstacleFunctions();
        // myObstacles[i].newPos();
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        if(myObstacles[i].x < -100){
            myObstacles.splice(i, 1);
        }
    }
}

function spawnAstroid(xOffset = 0){
    //Astroids
    let randomNumber = Math.floor(Math.random()*6+1);
    let astroidHealth, astroidImg, astroidHeight, astroidWidth;

    let y = myGameArea.canvas.height;
    let x = myGameArea.canvas.width;

    if(randomNumber == 1){
        astroidImg = "img/astroids/astroid-large.png";
        astroidHeight = 100;
        astroidWidth = 100;
        astroidHealth = 5;
    } else if(randomNumber <= 3 ){
        astroidImg = "img/astroids/astroid-medium.png";
        astroidHeight = 80;
        astroidWidth = 80;
        astroidHealth = 3;
    } else{
        astroidImg = "img/astroids/astroid-small.png";
        astroidHeight = 50;
        astroidWidth = 50;
        astroidHealth = 2;
    }

    let ranY = Math.floor(Math.random()*(y-astroidHeight - 0));

    let newAstroid = new Component(astroidHeight, astroidWidth, astroidImg, x + xOffset, ranY, "image");
    newAstroid.speedX = -1;
    newAstroid.health = astroidHealth;

    //Push astroid
    myObstacles.push(newAstroid);
}

function spawnSmallAstroid(xOffset = 0){
    //Astroids
    let randomNumber = Math.floor(Math.random()*6+1);
    let astroidHealth, astroidImg, astroidHeight, astroidWidth;

    let y = myGameArea.canvas.height;
    let x = myGameArea.canvas.width;

    if(randomNumber == 1){
        astroidImg = "img/astroids/astroid-medium.png";
        astroidHeight = 80;
        astroidWidth = 80;
        astroidHealth = 3;
    } else if(randomNumber <= 3 ){
        astroidImg = "img/astroids/astroid-medium-small.png";
        astroidHeight = 60;
        astroidWidth = 60;
        astroidHealth = 3;
    } else{
        astroidImg = "img/astroids/astroid-small.png";
        astroidHeight = 50;
        astroidWidth = 50;
        astroidHealth = 2;
    }

    let ranY = Math.floor(Math.random()*(y-astroidHeight - 0));

    let newAstroid = new Component(astroidHeight, astroidWidth, astroidImg, x + xOffset, ranY, "image");
    newAstroid.speedX = -1;
    newAstroid.health = astroidHealth;

    //Push astroid
    myObstacles.push(newAstroid);
}

function spawnComet(xOffset = 0){
    let y = myGameArea.canvas.height;
    let x = myGameArea.canvas.width;

    let ranY = Math.floor(Math.random()*(y-30 - 0));

    let newComet = new Component(90, 30, "img/comet.png", x + xOffset, ranY, "image")
    newComet.speedX = -9;

    //Push probe Ship
    myObstacles.push(newComet);
}

function spawnProbe(xOffset = 0){
    let y = myGameArea.canvas.height;
    let x = myGameArea.canvas.width;

    let ranY = Math.floor(Math.random()*(y-30 - 0));

    let newObstacle = new Component(50, 30, "img/probe.gif", x + xOffset, ranY, "image")
    newObstacle.pointsValue = 50;
    newObstacle.speedX = -3;

    //Push probe Ship
    myObstacles.push(newObstacle);
}

function spawnAdvancedProbe(xOffset = 0){
    //Advanced Probe
    let y = myGameArea.canvas.height;
    let x = myGameArea.canvas.width;

    let ranY = Math.floor(Math.random()*(y-50 - 0));

    let randomNumber = Math.floor(Math.random()*2+1);

    let newObstacle = new Component(35, 50, "img/obstacles/advanced-probe.png", x + xOffset, ranY, "image");
    newObstacle.pointsValue = 150;
    newObstacle.speedX = -4;

    if(randomNumber == 1){
        newObstacle.speedY = 1;
    } else{
        newObstacle.speedY = -1;
    }


    myObstacles.push(newObstacle);
}

function spawnHeavyProbe(xOffset = 0){
    //Advanced Probe
    let y = myGameArea.canvas.height;
    let x = myGameArea.canvas.width;

    let ranY = Math.floor(Math.random()*(y-30 - 0));


    let newObstacle = new Component(55, 30, "img/obstacles/heavy-probe.png", x + xOffset, ranY, "image");
    newObstacle.pointsValue = 100;
    newObstacle.speedX = -3;
    newObstacle.health = 2;

    myObstacles.push(newObstacle);
}

function spawnPatrolShip(xOffset = 0){
    //Advanced Probe
    let y = myGameArea.canvas.height;
    let x = myGameArea.canvas.width;

    let ranY = Math.floor(Math.random()*(y-40 - 0));


    let newObstacle = new Component(65, 40, "img/obstacles/patrol-ship.png", x + xOffset, ranY, "image");
    newObstacle.pointsValue = 200;
    newObstacle.speedX = -4;
    newObstacle.health = 2;

    // newAstroid.isObstacle = true;

    newObstacle.abilityList.push(1);

    newObstacle.abilityInterval = 200;

    myObstacles.push(newObstacle);
}

//Enemy Bullets
function triggerEnemyAbility(abilityId, x, y){
    
    switch(abilityId){
        case 1:
            spawnEnemyBullet(x, y);
            break;
    }
}

function spawnEnemyBullet(x, y){
    let newObstacle = new Component(16, 9, "img/bullets/e-blue-bullet.png", x, y - 4.5, "image");
    

    newObstacle.speedX = -6

    myObstacles.push(newObstacle);
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

        //Set bullet variables
        let bulletWidth, bulletHeight, bulletImgSrc, bulletDamage;

        //Spawn Bullet type
        if(ultimaBulletOn){
            bulletWidth = 25;
            bulletHeight = 25;
            bulletImgSrc = "img/bullets/ultima-bullet.png";
            bulletDamage = 6;
        } else if(ultraBulletOn){
            bulletWidth = 14;
            bulletHeight = 14;
            bulletImgSrc = "img/bullets/ultra-bullet.png";
            bulletDamage = 4;
        } else if(superBulletOn && wideBulletOn){
            bulletWidth = 14;
            bulletHeight = 20;
            bulletImgSrc = "img/bullets/super-wide-bullet.png";
            bulletDamage = 2;
        } else if(superBulletOn){
            bulletWidth = 14;
            bulletHeight = 9;
            bulletImgSrc = "img/bullets/super-bullet.png";
            bulletDamage = 2;
        } else if(wideBulletOn){
            bulletWidth = 14;
            bulletHeight = 20;
            bulletImgSrc = "img/bullets/wide-bullet.png";
            bulletDamage = 1;
        } else{
            bulletWidth = 14;
            bulletHeight = 7;
            bulletImgSrc = "img/bullets/bullet.png";
            bulletDamage = 1;
        }

        let newBullet = new Component(bulletWidth, bulletHeight, bulletImgSrc, myGamePiece.x + myGamePiece.width, (myGamePiece.y + myGamePiece.height / 2 - bulletHeight / 2), "image");

        newBullet.speedX = 6;

        newBullet.bulletDamage = bulletDamage;

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

            
            let hitObstacle = myObstacles[crashCheck[1]];
            if(hitObstacle.health <= myBullets[i].bulletDamage){
                //Points for destroying obstacle
                score += myObstacles[crashCheck[1]].pointsValue;

                myObstacles[crashCheck[1]].onDestruction();

                //remove obstacle from array
                myObstacles.splice(crashCheck[1], 1);

                
            } else{
                hitObstacle.health -= myBullets[i].bulletDamage;
            }

            myBullets.splice(i, 1);
            
        } else if(myBullets[i].x > gameAreaWidth){
            myBullets.splice(i, 1);
        }
    }
}

function ObstacleControl(){
    let fNo = myGameArea.frameNo + 2800;

    if(fNo == 200){
        //Enter Astroid Field
        astroidsOn = true;
    }
    if(fNo == 1000){
        myGameMessage.x = -500;
        myGameMessage.image.src = "img/messages/enter-astroid.png";

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
        patrolShipsOn = true;
        smallAstroidsOn = true;
    }
}

//Movement
function keyboardMove(){
    if(myGameArea.keys){
        if (myGameArea.keys[37]) {moveRight(); }
        if (myGameArea.keys[39]) {moveLeft(); }
        if (myGameArea.keys[38]) {moveUp(); }
        if (myGameArea.keys[40]) {moveDown(); }

        if((myGameArea.keys[37] || myGameArea.keys[38]) || (myGameArea.keys[39] || myGameArea.keys[40])){
            changeImage(true);
            // invincibilityFlicker();
        }
    }

    // if (myGameArea.keys && myGameArea.keys[37]) {moveRight(); }
    // if (myGameArea.keys && myGameArea.keys[39]) {moveLeft(); }
    // if (myGameArea.keys && myGameArea.keys[38]) {moveUp(); }
    // if (myGameArea.keys && myGameArea.keys[40]) {moveDown(); }
}

function changeImage(moving = false){
    if(invincibilityOn){
        if(moving){
            invincibilityFlicker(true);
        } else{
            invincibilityFlicker();
        }
    } else{
        if(moving){
            myGamePiece.image.src = "img/ship/quad-Fighter-moving.png";
        } else{
            myGamePiece.image.src = "img/quad-fighter-cut.png";
        }
    }
    
}

function invincibilityFlicker(moving = false){
    let moveString = "";
    if(moving){
        moveString = "-moving"
    }



    if(invincilityFrame == 1){
        myGamePiece.image.src = "img/ship/quad-fighter" + moveString +".png";
    } else if(invincilityFrame == 2 || invincilityFrame == 8){
        myGamePiece.image.src = "img/ship/quad-fighter" + moveString +"-90%.png";
    } else if(invincilityFrame == 3 || invincilityFrame == 7){
        myGamePiece.image.src = "img/ship/quad-fighter" + moveString +"-80%.png";
    } else if(invincilityFrame == 4 || invincilityFrame == 6){
        myGamePiece.image.src = "img/ship/quad-fighter" + moveString +"-60%.png";
    } else if(invincilityFrame == 5){
        myGamePiece.image.src = "img/ship/quad-fighter" + moveString +"-50%.png";
    }

    if(invincilityFrame != 8){
        invincilityFrame ++;
    } else{
        invincilityFrame = 1;
    }
}

function moveUp(){
    myGamePiece.speedY = -6;
    // changeImage();
    // invincibilityFlicker();
}

function moveDown(){
    myGamePiece.speedY = 6;
    // changeImage();
}

function moveLeft(){
    myGamePiece.speedX = 4;
    // changeImage();
}

function moveRight(){
    myGamePiece.speedX = -4;
    // changeImage();
}

function clearMove(){
    changeImage();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;

}

function slowDown(){
    myGamePiece.image.src = myPieceImgSrc;
    //Slow down

    //Y axis
    if(myGamePiece.speedY > 0){
    	myGamePiece.speedY -= 0.5;
    } else if (myGamePiece.speedY < 0){
    	myGamePiece.speedY += 0.5;
    }
    else{
        myGamePiece.speedY = 0;
    }

    //X axis
    if(myGamePiece.speedX > 0){
    	myGamePiece.speedX -= 0.5;
    } else if (myGamePiece.speedX < 0){
    	myGamePiece.speedX += 0.5;
    }
    else{
        myGamePiece.speedX = 0;
    }
}



//Start game
startGame();

