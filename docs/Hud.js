function hud(){
    //---- HUD
    camera();
     
    hint(DISABLE_DEPTH_TEST);
    noLights();
    textMode(MODEL);
    
    stroke(255);
    strokeWeight(1);
    noFill();
    //line(width/2-5, height/2, width/2+5, height/2);
    //line(width/2, height/2-5, width/2, height/2+5);
    ellipse(width/2, height/2, 10, 10);
    
    fill(255);
    textSize(10);
    textAlign(LEFT); //left hud
    text(frameRate, 10,10);
    if(toggleDebug){
      text(playerx, 40, 30);
      text(playery, 40, 45);
      text(playerz, 40, 60);
      text(threshhold, 40, 90);
      //if(toggledisplay){
      //  text("CUBES",40,90);
      //}else{
      //  text("MESH",40,90);
      //}
      
      if(currChonk != null){
        text(currChonk.offx + "," + currChonk.offy + "," + currChonk.offz,40,75);
      }
      
      text(LoadedChonks.size() + ":" + ProcessChonks.size() + ":" + UnLoadedChonks.size() + ":" + ProcessBufChonks.size() ,width/2,30);
      text(LoadedChonks.size() + ProcessChonks.size() + UnLoadedChonks.size() + ProcessBufChonks.size(),width/2,45);
    }
    
    if(lightmode == 0){
      text("OFF",width/2, 15);
    }else if(lightmode == 1){
      text("LOW",width/2, 15);
    }else if(lightmode == 2){
      text("HIGH",width/2, 15);
    }
    //text(currChonk.disttochonkcenterLin(playerx,playery,playerz), width/2, 90);
    
    fill(255);
    textSize(12);
    textAlign(CENTER);
    text("Space for Forward/Shift for Backward/L for Lights",width/2,height-15);
    if(toggleDebug){
      text("Q/E for Threshold",width/2,height-30);
    }
    
    fill(255);
    textSize(12);
    textAlign(RIGHT);
    if(toggleDebug){
      text("X:",40,30);
      text("Y:",40,45);
      text("Z:",40,60);
      text("CHK:",40,75);
      text("THR:",40,90);
      text("Chunk Distribution(L:P:U:B): ",width/2,30);
      text("Total Chunks in Memory: ",width/2,45);
    }
    text("LIGHTS: ",width/2, 15);
    //text("DIS:",40,90);
    // prepare to return to 3D 
    hint(ENABLE_DEPTH_TEST);
  }