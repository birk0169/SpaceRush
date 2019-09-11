function Component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    } else if(type == "gif"){
        this.image = GIF();
        this.image.load(color);
    }

    //Size
    this.width = width;
    this.height = height;

    //Hit Box: to be added

    //Speed
    this.speedX = 0;
    this.speedY = 0;

    //health
    this.health = 0;

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
    } else if(type == "gif"){
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
