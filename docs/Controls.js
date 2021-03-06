let isLeft, isRight, isUp, isDown, isFloat, isSink; 
let playerx, playery, playerz;
let playervx = 0, playervy = 0, playervz = 0;
let leftoverspeed;
let accel;

let playerrotxz, playerroty;
let deltx, delty;

let locked = false;

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
  playervx = Math.min(Math.max(playervx,-speed),speed);
  playervy = Math.min(Math.max(playervy,-speed),speed);
  playervz = Math.min(Math.max(playervz,-speed),speed);
  
  accel = (Math.abs(accel) > 0.0001)? lerp(accel,0,0.5) : 0;
  
  playervx = (Math.abs(playervx) > 0.0001)? lerp(playervx,0,0.02) : 0;
  playervy = (Math.abs(playervy) > 0.0001)? lerp(playervy,0,0.02) : 0;
  playervz = (Math.abs(playervz) > 0.0001)? lerp(playervz,0,0.02) : 0;
  
  playerz += playervz;
  playerx += playervx;
  playery += playervy;
  
  
  if(locked){
    mousemovement();
  }
  playerroty = map(deltx, 0, width, 0, 2*PI);
  playerrotxz = map(delty, 0, height, PI-0.0001, 0);

  camera(dispscale*playerx, dispscale*playery, dispscale*playerz, dispscale*(playerx+10*Math.cos(playerroty)*Math.sin(playerrotxz)), dispscale*(playery+10*Math.cos(playerrotxz)), dispscale*(playerz+10*Math.sin(playerroty)*Math.sin(playerrotxz)), 0,1,0);
  
  playerView.set(50*Math.cos(playerroty)*Math.sin(playerrotxz), 50*Math.cos(playerrotxz), 50*Math.sin(playerroty)*Math.sin(playerrotxz));
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

function mousemovement(){
  deltx = (deltx + movedX) % width;
  deltx = (deltx > 0) ? deltx : deltx + width;
  delty = Math.min(Math.max(delty + movedY, 0), height-1);
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

function mouseClicked() {
  if (!locked) {
    locked = true;
    requestPointerLock();
  } else {
    exitPointerLock();
    locked = false;
  }
}
