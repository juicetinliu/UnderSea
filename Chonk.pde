boolean decthresh, incthresh;

class Chonk{
  float[][][] Gronk;
  int chonkx, chonky, chonkz;
  int offx, offy, offz;
  int cenx, ceny, cenz;
  float thresh = 0.5;
  float threshAmount = 0.01;
  float scale;
  int[][][] monkinfo;
  //PShape monk;
  boolean ready = false;
  int maxCWeeds = 2;
  ArrayList<SeaWeed> SeaWeeds = new ArrayList<SeaWeed>();
  
  Chonk(int chonkx,int chonky, int chonkz, float threshhold, int offx, int offy, int offz, float scale){
    this.offx = offx;
    this.offy = offy;
    this.offz = offz;
    this.chonkx = chonkx;
    this.chonky = chonky;
    this.chonkz = chonkz;
    this.cenx = offx + chonkx/2;
    this.ceny = offy + chonky/2;
    this.cenz = offz + chonkz/2;
    this.thresh = threshhold;
    Gronk = new float[chonkx][chonky][chonkz];
    monkinfo = new int[chonkx-1][chonky-1][chonkz-1];
    this.scale = scale;
  }
  
  void initializeSeed(int seed, float smoothness){ //larger smoothness -> more smooth gradients
    noiseSeed(seed);
    for(int x = 0; x < chonkx; x++){
      for(int y = 0; y < chonky; y++){
        for(int z = 0; z < chonkz; z++){
          Gronk[x][y][z] = noise(float(x+offx)/smoothness,float(y+offy)/smoothness,float(z+offz)/smoothness);
        }
      }
    }
  }
  
  void initialize(float smoothness, int type){ //larger smoothness -> more smooth gradients
    switch(type){
      case 1:
        for(int x = 0; x < chonkx; x++){
          for(int y = 0; y < chonky; y++){
            for(int z = 0; z < chonkz; z++){
              Gronk[x][y][z] = noise(float(x+offx)/smoothness,float(y+offy)/smoothness,float(z+offz)/smoothness);
            }
          }
        }
      break;
      
      case 2:
        for(int x = 0; x < chonkx; x++){
          for(int y = 0; y < chonky; y++){
            for(int z = 0; z < chonkz; z++){
              Gronk[x][y][z] = map(y+offy, -10, 100, 0, noise(float(x+offx)/smoothness,float(z+offz)/smoothness));
            }
          }
        }
      break;
      
      case 3:
        for(int x = 0; x < chonkx; x++){
          for(int y = 0; y < chonky; y++){
            for(int z = 0; z < chonkz; z++){
              float val = (y+offy > 0) ? noise(float(x+offx)/smoothness,float(y+offy)/smoothness,float(z+offz)/smoothness) : 0; //sets 0 to flat surface
              val = (y+offy == 0) ? noise(float(x+offx)/smoothness,float(z+offz)/smoothness) * noise(float(x+offx)/smoothness,float(y+offy)/smoothness,float(z+offz)/smoothness) : val;
              Gronk[x][y][z] = val;
              if(y+offy == 0 && val > thresh && SeaWeeds.size() <= maxCWeeds){
                if(random(1) < 0.1){
                  SeaWeeds.add(new SeaWeed((x+offx)*scale, (y+offy) * scale, (z+offz)*scale, 0.002, 0.025, 10));
                }
              }
            }
          }
        }
      break;
      default:
      break;
    }
  }
  
  void displayBounding(){
    pushMatrix();
    noFill();
    stroke(0);
    strokeWeight(1/scale);
    scale(scale);
    translate(offx+(chonkx-1)/2,offy+(chonky-1)/2,offz+(chonkz-1)/2);
    box(chonkx-1,chonky-1,chonkz-1);
    //box(chonkx/2,chonky/2,chonkz/2);
    //box(1,1,1);
    popMatrix();
  }
  
  void displayProBounding(){
    pushMatrix();
    noFill();
    stroke(255);
    strokeWeight(1);
    translate(offx+(chonkx-1)/2,offy+(chonky-1)/2,offz+(chonkz-1)/2);
    //box(chonkx-1,chonky-1,chonkz-1);
    box(chonkx/2,chonky/2,chonkz/2);
    popMatrix();
  }
  
  void displayCurrBounding(){
    pushMatrix();
    noFill();
    stroke(255,102,255);
    strokeWeight(5/scale);
    scale(scale);
    translate(offx+(chonkx-1)/2,offy+(chonky-1)/2,offz+(chonkz-1)/2);
    //box(chonkx-1,chonky-1,chonkz-1);
    box(chonkx-2.1,chonky-2.1,chonkz-2.1);
    popMatrix();
  }
  
  void displayUnBounding(){
    pushMatrix();
    noFill();
    stroke(255,0,0);
    strokeWeight(1);
    translate(offx+(chonkx-1)/2,offy+(chonky-1)/2,offz+(chonkz-1)/2);
    //box(chonkx-1,chonky-1,chonkz-1);
    translate(0.05,0.05,0.05);
    box(chonkx/2,chonky/2,chonkz/2);
    popMatrix();
  }
  
  void displayGronk(float scale, float siz){
    for(int x = 0; x < chonkx; x++){
      for(int y = 0; y < chonky; y++){
        for(int z = 0; z < chonkz; z++){
          float gronkVal = Gronk[x][y][z];
          if(gronkVal <= thresh){
            pushMatrix();
            translate(x*scale,y*scale,z*scale);
            stroke(100);
            strokeWeight(1);
            //fill(int(map(gronkVal,0,thresh,0,255)));
            fill(int(map(gronkVal,0,1,0,255)));
            //fill(255);
            box(siz,siz,siz);
            popMatrix();
          }
        }
      }
    }
  }
  
  void march(){
    //monk = createShape();
    //monk.set3D(true);
    //monk.beginShape(TRIANGLES);
    for(int x = 0; x < chonkx-1; x++){
      for(int y = 0; y < chonky-1; y++){
        for(int z = 0; z < chonkz-1; z++){
          int m0 = (Gronk[x][y][z] <= thresh) ? 1 : 0;
          int m1 = (Gronk[x+1][y][z] <= thresh) ? 2 : 0;
          int m2 = (Gronk[x+1][y+1][z] <= thresh) ? 4 : 0;
          int m3 = (Gronk[x][y+1][z] <= thresh) ? 8 : 0;
          int m4 = (Gronk[x][y][z+1] <= thresh) ? 16 : 0;
          int m5 = (Gronk[x+1][y][z+1] <= thresh) ? 32 : 0;
          int m6 = (Gronk[x+1][y+1][z+1] <= thresh) ? 64 : 0;
          int m7 = (Gronk[x][y+1][z+1] <= thresh) ? 128 : 0;
          
          int mval = m0 + m1 + m2 + m3 + m4 + m5 + m6 + m7;
          monkinfo[x][y][z] = mval;
        }
      }
    }
    //monk.endShape();
    ready = true;
  }
  
  void displayMesh(){
    pushMatrix();
    scale(scale);
    beginShape(TRIANGLES);
    for(int x = 0; x < chonkx-1; x++){
      for(int y = 0; y < chonky-1; y++){
        for(int z = 0; z < chonkz-1; z++){
          //println(monkinfo[x][y][z]);
          String thisline = lines[monkinfo[x][y][z]];
          
          
          
          String[] nums = split(thisline, ", ");
          //stroke(0);
          //strokeWeight(1);
          //noFill();
          noStroke();
          fill(255);
          //fill(map(monkinfo[x][y][z],0,255,255,0),monkinfo[x][y][z],monkinfo[x][y][z]);
          for(String thisnum:nums){
            int edge = int(thisnum);
            float faralong;
            if(edge != -1){
              switch(edge){
                case 0: 
                  faralong = map(thresh,Gronk[x][y][z],Gronk[x+1][y][z],0,1);
                  vertex(offx + x + faralong, offy + y, offz + z); 
                  break; 
                
                case 1: 
                  faralong = map(thresh,Gronk[x+1][y][z],Gronk[x+1][y+1][z],0,1);
                  vertex(offx + x + 1, offy + y + faralong, offz + z); 
                break;
                
                case 2:  
                  faralong = map(thresh,Gronk[x][y+1][z],Gronk[x+1][y+1][z],0,1);
                  vertex(offx + x + faralong, offy + y + 1, offz + z); 
                break;
                
                case 3:  
                  faralong = map(thresh,Gronk[x][y][z],Gronk[x][y+1][z],0,1);
                  vertex(offx + x, offy + y + faralong, offz + z); 
                break;
                
                case 4:  
                  faralong = map(thresh,Gronk[x][y][z+1],Gronk[x+1][y][z+1],0,1);
                  vertex(offx + x + faralong, offy + y, offz + z + 1); 
                break;
                
                case 5:   
                  faralong = map(thresh,Gronk[x+1][y][z+1],Gronk[x+1][y+1][z+1],0,1);
                  vertex(offx + x + 1, offy + y + faralong, offz + z + 1); 
                break;
                
                case 6:   
                  faralong = map(thresh,Gronk[x][y+1][z+1],Gronk[x+1][y+1][z+1],0,1);
                  vertex(offx + x + faralong, offy + y + 1, offz + z + 1); 
                break;
                
                case 7:   
                  faralong = map(thresh,Gronk[x][y][z+1],Gronk[x][y+1][z+1],0,1);
                  vertex(offx + x, offy + y + faralong, offz + z + 1); 
                break;
                
                case 8:   
                  faralong = map(thresh,Gronk[x][y][z],Gronk[x][y][z+1],0,1);
                  vertex(offx + x, offy + y, offz + z + faralong); 
                break;
                
                case 9:   
                  faralong = map(thresh,Gronk[x+1][y][z],Gronk[x+1][y][z+1],0,1);
                  vertex(offx + x + 1, offy + y, offz + z + faralong); 
                break;
                
                case 10:   
                  faralong = map(thresh,Gronk[x+1][y+1][z],Gronk[x+1][y+1][z+1],0,1);
                  vertex(offx + x + 1, offy + y + 1, offz + z + faralong); 
                break;
                
                case 11:   
                  faralong = map(thresh,Gronk[x][y+1][z],Gronk[x][y+1][z+1],0,1);
                  vertex(offx + x, offy + y + 1, offz + z + faralong); 
                break;
                
                default: 
                  println("HUH?" + edge); 
                break;
              }
            }
          }
        }
      }
    }
    endShape();
    popMatrix();
  }
  
  void displayWeed(){
    for(SeaWeed thisCWeed:SeaWeeds){
      thisCWeed.run();
    }
  }
  
  void decreaseThresh(){
    thresh = max(0,thresh - threshAmount);
    march();
  }
  
  void increaseThresh(){
    thresh = min(1.0,thresh + threshAmount);
    march();
  }
  
  void setThresh(float amount){
    thresh = amount;
    march();
  }
  
  void addToGronk(int x, int y, int z, float amount){
    Gronk[x][y][z] = min(1.0, Gronk[x][y][z] + amount);
    march();
  }
  
  void removeFromGronk(int x, int y, int z, float amount){
    Gronk[x][y][z] = max(0, Gronk[x][y][z] - amount);
    march();
  }
  
  void addToGronk(float x, float y, float z, float amount){
    int ix = int(x);
    int iy = int(y);
    int iz = int(z);
    Gronk[ix][iy][iz] = min(1.0, Gronk[ix][iy][iz] + amount);
    march();
  }
  
  void removeFromGronk(float x, float y, float z, float amount){
    int ix = int(x);
    int iy = int(y);
    int iz = int(z);
    Gronk[ix][iy][iz] = max(0, Gronk[ix][iy][iz] - amount);
    march();
  }
  
  boolean existsGronk(int x, int y, int z){
    if(x >= offx && x < offx + chonkx && y >= offy && y < offy + chonky && z >= offz && z < offz + chonkz){
      return Gronk[x][y][z] <= thresh;
    }else{
      return false;
    }
  }
  
  float disttochonkcenterLinXZ(float x, float z){
    return dist(x,z,offx+(chonkx-1)/2,offz+(chonkz-1)/2);
  }
  
  float disttochonkcenterLin(float x, float y, float z){
    return dist(x,y,z,offx+(chonkx-1)/2,offy+(chonky-1)/2,offz+(chonkz-1)/2);
  }
  
  float angBetweenCenter(PVector viewVec){
    //return abs(PVector.angleBetween(viewVec, new PVector(viewVec.x - offx+(chonkx-1)/2,viewVec.y - offy+(chonky-1)/2,viewVec.z - offz+(chonkz-1)/2)));
    //return abs(PVector.angleBetween(viewVec, new PVector(offx+(chonkx-1)/2 - viewVec.x,offy+(chonky-1)/2 - viewVec.y,offz+(chonkz-1)/2 - viewVec.z)));
    return abs(PVector.angleBetween(viewVec, new PVector(offx+(chonkx-1)/2 - playerx, offy+(chonky-1)/2 - playery, offz+(chonkz-1)/2  - playerz)));
  }
  
  boolean withinChonk(float x, float y, float z){
    return (x >= offx && x < offx + chonkx-1 && y >= offy && y < offy + chonky-1 && z >= offz && z < offz + chonkz-1);
  }
}

Chonk setCurrentChonk(){
  for(Chonk thisChonk:LoadedChonks){
    if(thisChonk.withinChonk(playerx,playery,playerz)){
      return thisChonk;
    }
  }
  for(Chonk thisChonk:UnLoadedChonks){
    if(thisChonk.withinChonk(playerx,playery,playerz)){
      return thisChonk;
    }
  }
  return null;
}

void LoadChonks(Chonk thisChonk, int dist, float nearDist, float viewAng, float viewDist){
  int tx = thisChonk.offx;
  int ty = thisChonk.offy;
  int tz = thisChonk.offz;
  for(int x = -dist; x <= dist; x++){
    for(int y = -dist; y <= dist; y++){
      for(int z = -dist; z <= dist; z++){
        int nx = x*chonksx;
        int ny = y*chonksy;
        int nz = z*chonksz;
        
        float disttochonkcenter = dist(tx + nx + chonksx/2, ty + ny + chonksy/2, tz + nz + chonksz/2, playerx, playery, playerz);
        //print(playerx + ":" + playery + ":" + playerz + "  |  " +(tx + nx + chonksx/2) + ":" + (ty + ny + chonksy/2) + ":" + (tz + nz + chonksz/2));
        //println(PVector.angleBetween(playerView, new PVector((tx + nx + chonksx/2) - playerx, (ty + ny + chonksy/2) - playery, (tz + nz + chonksz/2) - playerz)));
        if(disttochonkcenter <= nearDist){
          if(!existsLoadedChonk(tx + nx,ty + ny,tz + nz)){
            Chonk unChonk = existsUnloadedChonk(tx + nx,ty + ny,tz + nz);
            if(unChonk != null){
              LoadedChonks.add(unChonk);
              UnLoadedChonks.remove(unChonk);
            }else if(!existsBufChonk(tx + nx,ty + ny,tz + nz)){
              ProcessBufChonks.add(new Chonk(chonkx, chonky, chonkz, threshhold, tx + nx,ty + ny,tz + nz, scale));
            }
            
          }
        }else if(abs(PVector.angleBetween(playerView, new PVector((tx + nx + chonksx/2) - playerx, (ty + ny + chonksy/2) - playery, (tz + nz + chonksz/2) - playerz))) < viewAng){
          if(disttochonkcenter <= viewDist){
            if(!existsLoadedChonk(tx + nx,ty + ny,tz + nz)){
              Chonk unChonk = existsUnloadedChonk(tx + nx,ty + ny,tz + nz);
              if(unChonk != null){
                LoadedChonks.add(unChonk);
                UnLoadedChonks.remove(unChonk);
              }else if(!existsBufChonk(tx + nx,ty + ny,tz + nz)){
                ProcessBufChonks.add(new Chonk(chonkx, chonky, chonkz, threshhold, tx + nx,ty + ny,tz + nz, scale));
              }
              
            }
          }
        }
      }
    }
  }
  
}

Chonk existsUnloadedChonk(int x, int y, int z){
  for(Chonk thisChonk:UnLoadedChonks){
    if(thisChonk.offx == x && thisChonk.offy == y && thisChonk.offz == z){
      return thisChonk;
    }
  }
  return null;
}

boolean existsLoadedChonk(int x, int y, int z){
  for(Chonk thisChonk:LoadedChonks){
    if(thisChonk.offx == x && thisChonk.offy == y && thisChonk.offz == z){
      return true;
    }
  }
  return false;
}

boolean existsBufChonk(int x, int y, int z){
  for(Chonk thisChonk:ProcessBufChonks){
    if(thisChonk.offx == x && thisChonk.offy == y && thisChonk.offz == z){
      return true;
    }
  }
  for(Chonk thisChonk:ProcessChonks){
    if(thisChonk.offx == x && thisChonk.offy == y && thisChonk.offz == z){
      return true;
    }
  }
  return false;
}


void unLoadChonks(float nearDist, float viewAng, float viewDist){
  for(int c = LoadedChonks.size() - 1; c >= 0; c--){
    Chonk thisChonk = LoadedChonks.get(c);
    if(!thisChonk.equals(currChonk)){
      if(thisChonk.disttochonkcenterLin(playerx,playery,playerz) > nearDist){
        if(thisChonk.disttochonkcenterLin(playerx,playery,playerz) <= viewDist){
          if(thisChonk.angBetweenCenter(playerView) >= viewAng){
            LoadedChonks.remove(thisChonk);
            UnLoadedChonks.add(thisChonk);
          }
        }else if(thisChonk.disttochonkcenterLin(playerx,playery,playerz) > viewDist){
          LoadedChonks.remove(thisChonk);
        }
      }     
    }
  }
  for(int c = UnLoadedChonks.size() - 1; c >= 0; c--){
    Chonk thisChonk = UnLoadedChonks.get(c);
    if(!thisChonk.equals(currChonk)){
      if(thisChonk.disttochonkcenterLin(playerx,playery,playerz) > viewDist){
        UnLoadedChonks.remove(thisChonk);
        //println("removed");
      }
    }
  }
}

void prepChonks(){
  if(ProcessBufChonks.size() > 0 || ProcessChonks.size() > 0){
    if(startLoad){
      thread("marchProcessChonks");
      startLoad = false;
    }
    if(loadReady){
      LoadedChonks.addAll(ProcessChonks);
      ProcessChonks.clear();
      ProcessChonks.addAll(ProcessBufChonks);
      ProcessBufChonks.clear();
      loadReady = false;
      startLoad = true;
    }
  }
}

void marchProcessChonks(){
  for(Chonk lChonk:ProcessChonks){
    lChonk.initialize(smoothness, terraintype);
    lChonk.setThresh(threshhold);
    lChonk.march();
  }
  loadReady = true;
}
