let isLeft, isRight, isUp, isDown, isFloat, isSink; 
let playerx, playery, playerz;
let playervx = 0, playervy = 0, playervz = 0;
let leftoverspeed;
let accel;

let playerrotxz, playerroty;
let deltx;

function moveCamera(speed){
  speed = speed * deltaTime;
  
  if(isFloat && isSink){
    accel = 0;
  }else{
    if(isFloat){
      accel = speed/100;
    }
    if(isSink){
      accel = -speed/100;
    }
  }
  playerView.setMag(1.0);

  playervx += accel*playerView.x;
  playervy += accel*playerView.y;
  playervz += accel*playerView.z;
  playervx = constrain(playervx,-speed,speed);
  playervy = constrain(playervy,-speed,speed);
  playervz = constrain(playervz,-speed,speed);
  
  accel = (abs(accel) > 0.0001)? lerp(accel,0,0.5) : 0;
  
  playervx = (abs(playervx) > 0.0001)? lerp(playervx,0,0.02) : 0;
  playervy = (abs(playervy) > 0.0001)? lerp(playervy,0,0.02) : 0;
  playervz = (abs(playervz) > 0.0001)? lerp(playervz,0,0.02) : 0;
  
  playerz += playervz;
  playerx += playervx;
  playery += playervy;
  
  playerroty = map(mouseX, 0, width, 0, 2*PI);
  playerrotxz = map(mouseY, 0, height, PI-0.0001, 0);

  camera(dispscale*playerx, dispscale*playery, dispscale*playerz, dispscale*(playerx+10*cos(playerroty)*sin(playerrotxz)), dispscale*(playery+10*cos(playerrotxz)), dispscale*(playerz+10*sin(playerroty)*sin(playerrotxz)), 0,1,0);
  
  playerView.set(50*cos(playerroty)*sin(playerrotxz), 50*cos(playerrotxz), 50*sin(playerroty)*sin(playerrotxz));
}

function otherControls(){
  if(decthresh){
    threshhold = max(threshhold-threshAmount,0);
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
    threshhold = min(threshhold+threshAmount,1.0);
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

function keyPressed(){
  setMove(keyCode, true);
  if(keyCode === 76){ //L
    lightmode = (lightmode + 1) % 3;
  }else if(keyCode === 88){ //X
    toggleDebug = !toggleDebug;
  }
}
 
function keyReleased(){
  setMove(keyCode, false);
}

function setMove(k, b){
  switch(k){
    case 38:
    return isUp = b;
    
    case 40:
    return isDown = b;
    
    case 37:
    return isLeft = b;
    
    case 39:
    return isRight = b;

    case 87:
    return isUp = b;
    
    case 83:
    return isDown = b;
    
    case 65:
    return isLeft = b;
    
    case 68:
    return isRight = b;
        
    case 32:
    return isFloat = b;
        
    case 16:
    return isSink = b;
        
    case 81: //q
    return decthresh = b;
    
    case 69: //e
    return incthresh = b;
        
    default:
    return b;
  }
}
