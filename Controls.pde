boolean isLeft, isRight, isUp, isDown, isFloat, isSink; 
float playerx, playery, playerz;
float playervx = 0, playervy = 0, playervz = 0;
float leftoverspeed;
float accel;

float playerrotxz, playerroty;
float deltx;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.InputEvent;
Robot robby;

void moveCamera(float speed){
  speed = speed * 60/frameRate;
  //if(isLeft){
  //  playerz = playerz + speed*sin(3*PI/2+playerroty);
  //  playerx = playerx + speed*cos(3*PI/2+playerroty);
  //}
  //if(isRight){
  //  playerz = playerz + speed*sin(PI/2+playerroty);
  //  playerx = playerx + speed*cos(PI/2+playerroty);
  //}
  //if(isDown){
  //  playerz = playerz + speed*sin(PI+playerroty);
  //  playerx = playerx + speed*cos(PI+playerroty);
  //}
  //if(isUp){
  //  playerz = playerz + speed*sin(playerroty);
  //  playerx = playerx + speed*cos(playerroty);
  //}
  //if(isFloat){
  //  playery = playery - speed;
  //}
  //if(isSink){
  //  playery = playery + speed;
  //}
  
  if(isFloat && isSink){
    accel = 0;
  }else{
    if(isFloat){
      accel = speed/100;
      //playervx = playerView.x;
      //playervy = playerView.y;
      //playervz = playerView.z;
    }
    if(isSink){
      accel = -speed/100;
      //playervx = -playerView.x;
      //playervy = -playerView.y;
      //playervz = -playerView.z;
    }
  }
  playerView.setMag(1.0);
  playervx += accel*playerView.x;
  playervy += accel*playerView.y;
  playervz += accel*playerView.z;
  playervx = constrain(playervx,-speed,speed);
  playervy = constrain(playervy,-speed,speed);
  playervz = constrain(playervz,-speed,speed);
  //if(isLeft){
  //  playervz = min(speed*sin(3*PI/2+playerroty),playervz+speed*sin(3*PI/2+playerroty));
  //  playervx = min(speed*cos(3*PI/2+playerroty),playervx+speed*cos(3*PI/2+playerroty));
  //}
  //if(isRight){
  //  playervz = min(speed*sin(PI/2+playerroty),playervz+speed*sin(PI/2+playerroty));
  //  playervx = min(speed*cos(PI/2+playerroty),playervx+speed*cos(PI/2+playerroty));
  //}
  //if(isDown){
  //  playervz = max(-speed*sin(playerroty)*sin(playerrotxz),playervz-speed*sin(playerroty)*sin(playerrotxz));
  //  playervx = max(-speed*cos(playerroty)*sin(playerrotxz),playervx-speed*cos(playerroty)*sin(playerrotxz));
  //  playervy = max(-speed*cos(playerrotxz),playervy+speed*cos(playerrotxz));
  //}
  //if(isUp){
  //  playervz = min(speed*sin(playerroty)*sin(playerrotxz),playervz+speed*sin(playerroty)*sin(playerrotxz));
  //  playervx = min(speed*cos(playerroty)*sin(playerrotxz),playervx+speed*cos(playerroty)*sin(playerrotxz));
  //  playervy = min(speed*cos(playerrotxz),playervy+speed*cos(playerrotxz));
  //}
  //if(isFloat){
  //  playervy = -speed;
  //}
  //if(isSink){
  //  playervy = speed;
  //}
  accel = (abs(accel) > 0.0001)? lerp(leftoverspeed,0,0.02) : 0;

  playervx = (abs(playervx) > 0.0001)? lerp(playervx,0,0.02) : 0;
  playervy = (abs(playervy) > 0.0001)? lerp(playervy,0,0.02) : 0;
  playervz = (abs(playervz) > 0.0001)? lerp(playervz,0,0.02) : 0;
  
  playerz += playervz;
  playerx += playervx;
  playery += playervy;
  
  mousemovement();
  playerroty = deltx;
  playerrotxz = map(mouseY,0,height,PI-0.0001,0);
  //float sinplayerrotxz  = (sin(playerrotxz) < 0.0000001)? 0 : sin(playerrotxz);
  //println(playerx + "|" + playery + "|" + playerz);
  //println((playerx+10*cos(playerroty)*sin(playerrotxz)) + " , " + (playery+10*cos(playerrotxz)) + " , " + (playerz+sin(playerroty)*sin(playerrotxz)));
  ////println(playerz+sin(playerroty)*sin(playerrotxz));
  camera(scale*playerx, scale*playery, scale*playerz, scale*(playerx+10*cos(playerroty)*sin(playerrotxz)), scale*(playery+10*cos(playerrotxz)), scale*(playerz+10*sin(playerroty)*sin(playerrotxz)), 0,1,0);
  
  playerView.set(50*cos(playerroty)*sin(playerrotxz), 50*cos(playerrotxz), 50*sin(playerroty)*sin(playerrotxz));
  //playerView.mult(-1);
  //print(playerView.x + "," + playerView.y + "," + playerView.z);
}

void otherControls(){
  //if(setPlayerPointer(20, 0.1)){
  //  if(mousePressed){
  //    if(mouseButton == LEFT){
  //      myChonk.addToGronk(pointCoord.x, pointCoord.y, pointCoord.z,0.01);
  //    }else if(mouseButton == RIGHT){
  //      myChonk.removeFromGronk(pointCoord.x, pointCoord.y, pointCoord.z,0.01);
  //    }
  //  }
  //}
  if(decthresh){
    threshhold = max(threshhold-threshAmount,0);
    for(Chonk thisChonk:LoadedChonks){
      thisChonk.setThresh(threshhold);
    }
    for(Chonk thisChonk:UnLoadedChonks){
      thisChonk.setThresh(threshhold);
    }
    for(Chonk thisChonk:ProcessChonks){
      thisChonk.setThresh(threshhold);
    }
  }
  if(incthresh){
    threshhold = min(threshhold+threshAmount,1.0);
    for(Chonk thisChonk:LoadedChonks){
      thisChonk.setThresh(threshhold);
    }
    for(Chonk thisChonk:UnLoadedChonks){
      thisChonk.setThresh(threshhold);
    }
    for(Chonk thisChonk:ProcessChonks){
      thisChonk.setThresh(threshhold);
    }
  }
}

//boolean setPlayerPointer(float maxLength, float incsize){
//  boolean blockFound = false;
//  float rayLength = 0;
//  while(!blockFound && rayLength < maxLength){
//    PVector sphp = linesphereintersect(playerx, playery, playerz, cos(playerroty)*sin(playerrotxz), cos(playerrotxz), sin(playerroty)*sin(playerrotxz), rayLength);
//    if(myChonk.existsGronk(int(sphp.x),int(sphp.y),int(sphp.z))){
//      if(dist(sphp.x,sphp.y,sphp.z,int(sphp.x),int(sphp.y),int(sphp.z)) < myChonk.size){
//        pointCoord.set(int(sphp.x),int(sphp.y),int(sphp.z));
//        blockFound = true;
//      }else{
//        rayLength += incsize;
//      }
//    }else{
//      rayLength += incsize;
//    }
//  }
//  if(blockFound){
//    pushMatrix();
//    translate(pointCoord.x, pointCoord.y, pointCoord.z);
//    noFill();
//    stroke(0);
//    box(1,1,1);
//    popMatrix();
//    return true;
//  }else{
//    return false;
//  }
//}

void mousemovement(){
  if(mouseX == width-1){
    robby.mouseMove(1, mouseY);
  }else if(mouseX == 0){
    robby.mouseMove(width-2, mouseY);
  }
  deltx = map(mouseX, 0, width, 0, 2*PI);
}

void keyPressed(){
  setMove(keyCode, true);
  if(keyCode == 76){ //L
    lightmode = (lightmode + 1) % 3;
  }else if(keyCode == 88){
    toggleDebug = !toggleDebug;
  }
}
 
void keyReleased(){
  setMove(keyCode, false);
}

boolean setMove(int k, boolean b){
  //print(keyCode);
  switch(k){
  case UP:
    return isUp = b;
 
  case DOWN:
    return isDown = b;
 
  case LEFT:
    return isLeft = b;
 
  case RIGHT:
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
