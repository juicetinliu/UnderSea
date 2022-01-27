function keyPressed(){
  player.controlMovement.setKeyPresses(keyCode, true);
  if(keyCode === 76){ //L
    lightmode = (lightmode + 1) % 3;
  }else if(keyCode === 88){ //X
    toggleDebug = !toggleDebug;
  }
}
 
function keyReleased(){
  player.controlMovement.setKeyPresses(keyCode, false);
}

class Controls{
  constructor(){
    this.deltx = width/2;
    this.delty = height/2;

    this.isLocked = false;

    this.isLeft = false;
    this.isRight = false;
    this.isUp = false;
    this.isDown = false;
    this.isFloat = false;
    this.isSink = false;

  }

  draw(){}
}

class KeyBoard extends Controls{
  constructor(){
    super();
    this.state = 0;
  }

  draw(){}

  interact(){
  }

  setKeyPresses(key, isPressed){
    switch(key){
      case 38 || 87:
      return this.isUp = isPressed;
      
      case 40 || 83:
      return this.isDown = isPressed;
      
      case 37 || 65:
      return this.isLeft = isPressed;
      
      case 39 || 68:
      return this.isRight = isPressed;
          
      case 32:
      return this.isFloat = isPressed;
          
      case 16:
      return this.isSink = isPressed;
          
      case 81: //q
      return decthresh = isPressed;
      
      case 69: //e
      return incthresh = isPressed;
          
      default:
      return isPressed;
    }
  }
}

class Mouse extends Controls{
  constructor(){
    super();
    this.state = 0;
  }

  draw(){}

  interact(){
    if(this.state === 1) this.lockToggle();
    switch(this.state){
      case 0: //rest
        if(mouseIsPressed){
          this.state = 1;
        }
        break;
      case 1: //rising edge
        this.state = 2;
        break;
      case 2: //pressed
        if(!mouseIsPressed){
          this.state = 3;
        }
        break;
      case 3: //falling edge
        this.state = 0;
        break;
      default:
        this.state = 0;
    }

    this.deltx = (this.deltx + movedX) % width;
    this.deltx = (this.deltx > 0) ? this.deltx : this.deltx + width;
    this.delty = Math.min(Math.max(this.delty + movedY, 0), height-1);
  }

  lockToggle(){
    if(!document.isMobileOrTabletView){
      if (!this.isLocked) {
        this.isLocked = true;
        requestPointerLock();
      } else {
        exitPointerLock();
        this.isLocked = false;
      }
    }
  }
}

class Joystick extends Controls {
  constructor(x, y, rad, buttonrad){
      super();
      this.x = x;
      this.y = y;
      this.rad = rad;
      this.buttonrad = buttonrad;
      this.state = 0;
      this.buttonx = 0;
      this.buttony = 0;
      this.raddiff = this.rad - this.buttonrad;
      this.outX = 0;
      this.outY = 0;
      this.isLocked = true;
  }

  draw(){
      stroke(255);
      strokeWeight(2);
      ellipse(this.x, this.y, this.rad * 2, this.rad * 2);
      ellipse(this.x + this.buttonx, this.y + this.buttony, this.buttonrad * 2, this.buttonrad * 2);

      fill(255);
      textAlign(CENTER);
      if(!document.hasUsedJoystickBefore) text("Move around with the joystick", this.x, this.y - this.rad - 10);
  }

  interact(){
    this.resetStateWhenLetGo();
    switch(this.state){
      case 0:
        if(mouseIsPressed){
          if((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2 < this.rad ** 2){
            this.state = 1;
          }
        }
        break;
      case 1: //joystickMode
          if(!document.hasUsedJoystickBefore) document.hasUsedJoystickBefore = true;
          if((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2 < this.raddiff ** 2){
            this.buttonx = mouseX - this.x;
            this.buttony = mouseY - this.y;
          }else{
            let ang = atan2(mouseY - this.y, mouseX - this.x);
            this.buttonx = this.raddiff * cos(ang);
            this.buttony = this.raddiff * sin(ang);
          }
        break;
      default:
        break;
    }

    this.outX = map(this.buttonx, -this.raddiff, this.raddiff, -1, 1);
    this.outY = map(this.buttony, -this.raddiff, this.raddiff, -1, 1);

    this.deltx = (this.deltx + this.outX * width/300) % width;
    this.delty = Math.min(Math.max(this.delty + this.outY * height/300, 0), height);
  }

  resetStateWhenLetGo(){
    if(!mouseIsPressed){
      this.state = 0;
      this.buttonx = 0;
      this.buttony = 0;
    }
  }
}

function otherControls(){
  if(decthresh){
    threshhold = Math.max(threshhold-threshAmount,0);
    LoadedChonks.forEach(thisChonk => {
      thisChonk.setThresh(threshhold);
    });
    UnLoadedChonks.forEach(thisChonk => {
      thisChonk.setThresh(threshhold);
    });
    ProcessChonks.forEach(thisChonk => {
      thisChonk.setThresh(threshhold);
    });
  }
  if(incthresh){
    threshhold = Math.min(threshhold+threshAmount,1.0);
    LoadedChonks.forEach(thisChonk => {
      thisChonk.setThresh(threshhold);
    });
    UnLoadedChonks.forEach(thisChonk => {
      thisChonk.setThresh(threshhold);
    });
    ProcessChonks.forEach(thisChonk => {
      thisChonk.setThresh(threshhold);
    });
  }
}
