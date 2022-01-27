function hud(){
    //---- HUD
    gl.disable(gl.DEPTH_TEST);
    camera();
    noLights();
    //textMode(MODEL);
    push();
    translate(-width/2, -height/2);
    stroke(255);
    strokeWeight(1);
    noFill();
    //line(width/2-5, height/2, width/2+5, height/2);
    //line(width/2, height/2-5, width/2, height/2+5);
    ellipse(width/2, height/2, 10, 10);
    //TODO: HUD FILL COLOR BUG DUE TO SHADER SHADING EVERYTHING
    player.drawControlsHUD();
    
    if(toggleDebug){
      rect(player.controlView.deltx-5, player.controlView.delty-5, 10, 10);
    }
    
    fill(255);
    textSize(12);
    textAlign(LEFT);
    let fps = frameRate();
    text("FPS: " + fps.toFixed(2), 10,10);
    
    if(!document.isMobileOrTabletView){
      text("X: " + nfc(player.position.x, 2), 10, 30);
      text("Y: " + nfc(player.position.y, 2), 10, 45);
      text("Z: " + nfc(player.position.z, 2), 10, 60);
      
      if(toggleDebug){
        text(threshhold, 40, 90);
        if(currChonk !== null){
          text(currChonk.offx + "," + currChonk.offy + "," + currChonk.offz,40,75);
        }
        text(LoadedChonks.length + ":" + ProcessChonks.length + ":" + UnLoadedChonks.length + ":" + ProcessBufChonks.length ,width/2,30);
        text(LoadedChonks.length + ProcessChonks.length + UnLoadedChonks.length + ProcessBufChonks.length,width/2,45);
      }
      
      // textSize(12);
      if(lightmode === 0){
        fill(255,0,0);
        text("OFF",width/2, 15);
      }else if(lightmode === 1){
        text("LOW",width/2, 15);
      }else if(lightmode === 2){
        text("HIGH",width/2, 15);
      }
      
      fill(255);
      // textSize(12);
      textAlign(CENTER);
      text("Space - Forward | Shift - Backward | L - Lights",width/2,height-15);

      if(toggleDebug){
        text("Q/E for Threshold",width/2,height-30);
      }

      if(!player.controlView.isLocked){
        text("Click to enter", width/2, height/2+20)
      }
      
      fill(255);
      // textSize(12);
      textAlign(RIGHT);
      
      if(toggleDebug){
        text("CHK:",40,75);
        text("THR:",40,90);
        text("Chunk Distribution(L:P:U:B): ",width/2,30);
        text("Total Chunks in Memory: ",width/2,45);
      }
      
      text("LIGHTS: ",width/2, 15);
    }

    pop();
    // prepare to return to 3D 
    gl.enable(gl.DEPTH_TEST);
  }
