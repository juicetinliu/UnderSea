let decthresh, incthresh;

class Chonk{
  constructor(chonkx, chonky, chonkz, threshhold, offx, offy, offz, dispscale){
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
    this.threshAmount = 0.01;
    this.Gronk = createArray(chonkx,chonky,chonkz);
    this.monkinfo = createArray(chonkx - 1,chonky - 1,chonkz - 1);
    this.dispscale = dispscale;
    
    this.geometry = new p5.Geometry(1);
  }

  initializeSeed(seed, smoothness){ //larger smoothness -> more smooth gradients
    noiseSeed(seed);
    for(let x = 0; x < this.chonkx; x++){
      for(let y = 0; y < this.chonky; y++){
        for(let z = 0; z < this.chonkz; z++){
          this.Gronk[x][y][z] = noise(float(x+this.offx)/smoothness,float(y+this.offy)/smoothness,float(z+this.offz)/smoothness);
        }
      }
    }
  }

  initialize(smoothness, type){ //larger smoothness -> more smooth gradients
    for(let x = 0; x < this.chonkx; x++){
      for(let y = 0; y < this.chonky; y++){
        for(let z = 0; z < this.chonkz; z++){
          let val = (y+this.offy > 0) ? noise(float(x+this.offx)/smoothness,float(y+this.offy)/smoothness,float(z+this.offz)/smoothness) : 0; //sets 0 to flat surface
          val = (y+this.offy === 0) ? noise(float(x+this.offx)/smoothness,float(z+this.offz)/smoothness) * noise(float(x+this.offx)/smoothness,float(y+this.offy)/smoothness,float(z+this.offz)/smoothness) : val;
          this.Gronk[x][y][z] = val;
        }
      }
    }
  }

  displayBounding(){
    push();
    noFill();
    stroke(0);
    strokeWeight(1);
    scale(this.dispscale);
    translate(this.offx+(this.chonkx-1)/2,this.offy+(this.chonky-1)/2,this.offz+(this.chonkz-1)/2);
    box(this.chonkx-1,this.chonky-1,this.chonkz-1);
    pop();
  }

  displayProBounding(){
    push();
    noFill();
    stroke(255);
    strokeWeight(1);
    translate(this.offx+(this.chonkx-1)/2,this.offy+(this.chonky-1)/2,this.offz+(this.chonkz-1)/2);
    box(this.chonkx/2,this.chonky/2,this.chonkz/2);
    pop();
  }

  displayCurrBounding(){
    push();
    noFill();
    stroke(255,102,255);
    strokeWeight(5);
    scale(this.dispscale);
    translate(this.offx+(this.chonkx-1)/2,this.offy+(this.chonky-1)/2,this.offz+(this.chonkz-1)/2);
    box(this.chonkx-2.1,this.chonky-2.1,this.chonkz-2.1);
    pop();
  }

  displayUnBounding(){
    push();
    noFill();
    stroke(255,0,0);
    strokeWeight(1);
    translate(this.offx+(this.chonkx-1)/2,this.offy+(this.chonky-1)/2,this.offz+(this.chonkz-1)/2);
    translate(0.05,0.05,0.05);
    box(this.chonkx/2,this.chonky/2,this.chonkz/2);
    pop();
  }

  displayGronk(dispscale, size){
    for(let x = 0; x < this.chonkx; x++){
      for(let y = 0; y < this.chonky; y++){
        for(let z = 0; z < this.chonkz; z++){
          let gronkVal = this.Gronk[x][y][z];
          if(gronkVal <= this.thresh){
            push();
            translate(x*dispscale,y*dispscale,z*dispscale);
            stroke(100);
            strokeWeight(1);
            fill(int(map(gronkVal,0,1,0,255)));
            box(size,size,size);
            pop();
          }
        }
      }
    }
  }

  march(){
    for(let x = 0; x < this.chonkx-1; x++){
      for(let y = 0; y < this.chonky-1; y++){
        for(let z = 0; z < this.chonkz-1; z++){
          let m0 = (this.Gronk[x][y][z] <= this.thresh) ? 1 : 0;
          let m1 = (this.Gronk[x+1][y][z] <= this.thresh) ? 2 : 0;
          let m2 = (this.Gronk[x+1][y+1][z] <= this.thresh) ? 4 : 0;
          let m3 = (this.Gronk[x][y+1][z] <= this.thresh) ? 8 : 0;
          let m4 = (this.Gronk[x][y][z+1] <= this.thresh) ? 16 : 0;
          let m5 = (this.Gronk[x+1][y][z+1] <= this.thresh) ? 32 : 0;
          let m6 = (this.Gronk[x+1][y+1][z+1] <= this.thresh) ? 64 : 0;
          let m7 = (this.Gronk[x][y+1][z+1] <= this.thresh) ? 128 : 0;
          
          let mval = m0 + m1 + m2 + m3 + m4 + m5 + m6 + m7;
          this.monkinfo[x][y][z] = mval;
        }
      }
    }
    this.geometryInit();
  }

  displayMesh(){
    push();
    scale(this.dispscale);
    beginShape(TRIANGLES);
    for(let x = 0; x < this.chonkx-1; x++){
      for(let y = 0; y < this.chonky-1; y++){
        for(let z = 0; z < this.chonkz-1; z++){
          let thisline = lines[this.monkinfo[x][y][z]];
          
          let nums = split(thisline, ", ");
          nums.forEach(thisnum => {
            let edge = int(thisnum);
            let faralong;
            if(edge != -1){
              switch(edge){
                case 0: 
                faralong = map(this.thresh,this.Gronk[x][y][z],this.Gronk[x+1][y][z],0,1);
                vertex(this.offx + x + faralong, this.offy + y, this.offz + z); 
                break; 
                
                case 1: 
                faralong = map(this.thresh,this.Gronk[x+1][y][z],this.Gronk[x+1][y+1][z],0,1);
                vertex(this.offx + x + 1, this.offy + y + faralong, this.offz + z); 
                break;
                
                case 2:  
                faralong = map(this.thresh,this.Gronk[x][y+1][z],this.Gronk[x+1][y+1][z],0,1);
                vertex(this.offx + x + faralong, this.offy + y + 1, this.offz + z); 
                break;
                
                case 3:  
                faralong = map(this.thresh,this.Gronk[x][y][z],this.Gronk[x][y+1][z],0,1);
                vertex(this.offx + x, this.offy + y + faralong, this.offz + z); 
                break;
                
                case 4:  
                faralong = map(this.thresh,this.Gronk[x][y][z+1],this.Gronk[x+1][y][z+1],0,1);
                vertex(this.offx + x + faralong, this.offy + y, this.offz + z + 1); 
                break;
                
                case 5:   
                faralong = map(this.thresh,this.Gronk[x+1][y][z+1],this.Gronk[x+1][y+1][z+1],0,1);
                vertex(this.offx + x + 1, this.offy + y + faralong, this.offz + z + 1); 
                break;
                
                case 6:   
                faralong = map(this.thresh,this.Gronk[x][y+1][z+1],this.Gronk[x+1][y+1][z+1],0,1);
                vertex(this.offx + x + faralong, this.offy + y + 1, this.offz + z + 1); 
                break;
                
                case 7:   
                faralong = map(this.thresh,this.Gronk[x][y][z+1],this.Gronk[x][y+1][z+1],0,1);
                vertex(this.offx + x, this.offy + y + faralong, this.offz + z + 1); 
                break;
                
                case 8:   
                faralong = map(this.thresh,this.Gronk[x][y][z],this.Gronk[x][y][z+1],0,1);
                vertex(this.offx + x, this.offy + y, this.offz + z + faralong); 
                break;
                
                case 9:   
                faralong = map(this.thresh,this.Gronk[x+1][y][z],this.Gronk[x+1][y][z+1],0,1);
                vertex(this.offx + x + 1, this.offy + y, this.offz + z + faralong); 
                break;
                
                case 10:   
                faralong = map(this.thresh,this.Gronk[x+1][y+1][z],this.Gronk[x+1][y+1][z+1],0,1);
                vertex(this.offx + x + 1, this.offy + y + 1, this.offz + z + faralong); 
                break;
                
                case 11:   
                faralong = map(this.thresh,this.Gronk[x][y+1][z],this.Gronk[x][y+1][z+1],0,1);
                vertex(this.offx + x, this.offy + y + 1, this.offz + z + faralong); 
                break;
                
                default: 
                console.log("HUH?" + edge); 
                break;
              }
            }
          });
        }
      }
    }
    endShape();
    pop();
  }
  
  geometryInit(){
    this.geometry.vertices = [];
    this.geometry.vertexNormals = [];
    this.geometry.uvs = [];
    
    let faces = [];
    let tricounter = 0;
    let triface = [];
    for(let x = 0; x < this.chonkx-1; x++){
      for(let y = 0; y < this.chonky-1; y++){
        for(let z = 0; z < this.chonkz-1; z++){
          let thisline = lines[this.monkinfo[x][y][z]];
          
          let nums = split(thisline, ", ");
          nums.forEach(thisnum => {
            let edge = int(thisnum);
            let faralong;
            if(edge != -1){
              let addvert;
              switch(edge){
                case 0: 
                faralong = map(this.thresh,this.Gronk[x][y][z],this.Gronk[x+1][y][z],0,1);
                addvert = new p5.Vector(this.offx + x + faralong, this.offy + y, this.offz + z); 
                break; 
                
                case 1: 
                faralong = map(this.thresh,this.Gronk[x+1][y][z],this.Gronk[x+1][y+1][z],0,1);
                addvert = new p5.Vector(this.offx + x + 1, this.offy + y + faralong, this.offz + z); 
                break;
                
                case 2:  
                faralong = map(this.thresh,this.Gronk[x][y+1][z],this.Gronk[x+1][y+1][z],0,1);
                addvert = new p5.Vector(this.offx + x + faralong, this.offy + y + 1, this.offz + z); 
                break;
                
                case 3:  
                faralong = map(this.thresh,this.Gronk[x][y][z],this.Gronk[x][y+1][z],0,1);
                addvert = new p5.Vector(this.offx + x, this.offy + y + faralong, this.offz + z); 
                break;
                
                case 4:  
                faralong = map(this.thresh,this.Gronk[x][y][z+1],this.Gronk[x+1][y][z+1],0,1);
                addvert = new p5.Vector(this.offx + x + faralong, this.offy + y, this.offz + z + 1); 
                break;
                
                case 5:   
                faralong = map(this.thresh,this.Gronk[x+1][y][z+1],this.Gronk[x+1][y+1][z+1],0,1);
                addvert = new p5.Vector(this.offx + x + 1, this.offy + y + faralong, this.offz + z + 1); 
                break;
                
                case 6:   
                faralong = map(this.thresh,this.Gronk[x][y+1][z+1],this.Gronk[x+1][y+1][z+1],0,1);
                addvert = new p5.Vector(this.offx + x + faralong, this.offy + y + 1, this.offz + z + 1); 
                break;
                
                case 7:   
                faralong = map(this.thresh,this.Gronk[x][y][z+1],this.Gronk[x][y+1][z+1],0,1);
                addvert = new p5.Vector(this.offx + x, this.offy + y + faralong, this.offz + z + 1); 
                break;
                
                case 8:   
                faralong = map(this.thresh,this.Gronk[x][y][z],this.Gronk[x][y][z+1],0,1);
                addvert = new p5.Vector(this.offx + x, this.offy + y, this.offz + z + faralong); 
                break;
                
                case 9:   
                faralong = map(this.thresh,this.Gronk[x+1][y][z],this.Gronk[x+1][y][z+1],0,1);
                addvert = new p5.Vector(this.offx + x + 1, this.offy + y, this.offz + z + faralong); 
                break;
                
                case 10:   
                faralong = map(this.thresh,this.Gronk[x+1][y+1][z],this.Gronk[x+1][y+1][z+1],0,1);
                addvert = new p5.Vector(this.offx + x + 1, this.offy + y + 1, this.offz + z + faralong); 
                break;
                
                case 11:   
                faralong = map(this.thresh,this.Gronk[x][y+1][z],this.Gronk[x][y+1][z+1],0,1);
                addvert = new p5.Vector(this.offx + x, this.offy + y + 1, this.offz + z + faralong); 
                break;
                
                default: 
                console.log("HUH?" + edge); 
                break;
              }
              this.addVertex(addvert);
              triface.push(tricounter);
              if(triface.length === 3){
                faces.push(triface);
                triface = [];
              }
              tricounter++;
            }
          });
        }
      }
    }
    this.geometry.faces = faces;
    this.geometry.computeNormals();
  }
  
  addVertex(p){
    this.geometry.vertices.push(p);
    this.geometry.vertexNormals.push(p);

    this.geometry.uvs.push([1,1]);
  }
  
  geometryDisp(thisrenderer, s){
    thisrenderer.createBuffers("!", this.geometry);
    thisrenderer.drawBuffersScaled("!", s, s, s);
  }

  decreaseThresh(){
    this.thresh = Math.max(0,this.thresh - this.threshAmount);
    this.march();
  }
  
  increaseThresh(){
    this.thresh = Math.min(1.0,this.thresh + this.threshAmount);
    this.march();
  }
  
  setThresh(amount){
    this.thresh = amount;
    this.march();
  }

  addToGronk(x, y, z, amount){
    let ix = int(x);
    let iy = int(y);
    let iz = int(z);
    this.Gronk[ix][iy][iz] = Math.min(1.0, this.Gronk[ix][iy][iz] + amount);
    this.march();
  }

  removeFromGronk(x, y, z, amount){
    let ix = int(x);
    let iy = int(y);
    let iz = int(z);
    this.Gronk[ix][iy][iz] = Math.max(0, this.Gronk[ix][iy][iz] - amount);
    this.march();
  }

  existsGronk(x, y, z){
    if(x >= this.offx && x < this.offx + this.chonkx && y >= this.offy && y < this.offy + this.chonky && z >= this.offz && z < this.offz + this.chonkz){
      return this.Gronk[x][y][z] <= this.thresh;
    }else{
      return false;
    }
  }
  
  disttochonkcenterLinXZ(x, z){
    return dist(x,z,this.offx+(this.chonkx-1)/2,this.offz+(this.chonkz-1)/2);
  }
  
  disttochonkcenterLin(x, y, z){
    return dist(x,y,z,this.offx+(this.chonkx-1)/2,this.offy+(this.chonky-1)/2,this.offz+(this.chonkz-1)/2);
  }
  
  angBetweenCenter(viewVec){
    let chonkvec = createVector(this.offx+(this.chonkx-1)/2 - playerx, this.offy+(this.chonky-1)/2 - playery, this.offz+(this.chonkz-1)/2  - playerz);
    return abs(viewVec.angleBetween(chonkvec));
  }

  withinChonk(x, y, z){
    return (x >= this.offx && x < this.offx + this.chonkx-1 && y >= this.offy && y < this.offy + this.chonky-1 && z >= this.offz && z < this.offz + this.chonkz-1);
  }
}

function setCurrentChonk(){
  for(let l = 0; l < LoadedChonks.length; l++){
    let thisChonk = LoadedChonks[l];
    if(thisChonk.withinChonk(playerx,playery,playerz)){
      return thisChonk;
    }
  }
  for(let l = 0; l < UnLoadedChonks.length; l++){
    let thisChonk = UnLoadedChonks[l];
    if(thisChonk.withinChonk(playerx,playery,playerz)){
      return thisChonk;
    }
  }
  return null;
}

function LoadChonks(thisChonk, chonkDist, nearDist, viewAng, viewDist){
  let tx = thisChonk.offx;
  let ty = thisChonk.offy;
  let tz = thisChonk.offz;
  for(let x = -chonkDist; x <= chonkDist; x++){
    for(let y = -chonkDist; y <= chonkDist; y++){
      for(let z = -chonkDist; z <= chonkDist; z++){
        let nx = x*chonksx;
        let ny = y*chonksy;
        let nz = z*chonksz;
        
        let disttochonkcenter = dist(tx + nx + chonksx/2, ty + ny + chonksy/2, tz + nz + chonksz/2, playerx, playery, playerz);
        
        if(disttochonkcenter <= nearDist){
          if(!existsLoadedChonk(tx + nx,ty + ny,tz + nz)){
            let unChonk = existsUnloadedChonk(tx + nx,ty + ny,tz + nz);
            if(unChonk !== null){
              LoadedChonks.push(unChonk);
              UnLoadedChonks.splice(UnLoadedChonks.indexOf(unChonk), 1);
            }else if(!existsBufChonk(tx + nx,ty + ny,tz + nz)){
              ProcessBufChonks.push(new Chonk(chonkx, chonky, chonkz, threshhold, tx + nx,ty + ny,tz + nz, dispscale));
            }
            
          }
        }else if(abs(playerView.angleBetween(createVector((tx + nx + chonksx/2) - playerx, (ty + ny + chonksy/2) - playery, (tz + nz + chonksz/2) - playerz))) < viewAng){
          if(disttochonkcenter <= viewDist){
            if(!existsLoadedChonk(tx + nx,ty + ny,tz + nz)){
              let unChonk = existsUnloadedChonk(tx + nx,ty + ny,tz + nz);
              if(unChonk !== null){
                LoadedChonks.push(unChonk);
                UnLoadedChonks.splice(UnLoadedChonks.indexOf(unChonk), 1);
              }else if(!existsBufChonk(tx + nx,ty + ny,tz + nz)){
                ProcessBufChonks.push(new Chonk(chonkx, chonky, chonkz, threshhold, tx + nx,ty + ny,tz + nz, dispscale));
              }
              
            }
          }
        }
      }
    }
  }
}

function existsUnloadedChonk(x, y, z){
  for(let l = 0; l < UnLoadedChonks.length; l++){
    let thisChonk = UnLoadedChonks[l];
    if(thisChonk.offx === x && thisChonk.offy === y && thisChonk.offz === z){
      return thisChonk;
    }
  }
  return null;
}

function existsLoadedChonk(x, y, z){
  for(let l = 0; l < LoadedChonks.length; l++){
    let thisChonk = LoadedChonks[l];
    if(thisChonk.offx === x && thisChonk.offy === y && thisChonk.offz === z){
      return true;
    }
  }
  return false;
}

function existsBufChonk(x, y, z){
  for(let l = 0; l < ProcessBufChonks.length; l++){
    let thisChonk = ProcessBufChonks[l];
    if(thisChonk.offx === x && thisChonk.offy === y && thisChonk.offz === z){
      return true;
    }
  }
  for(let l = 0; l < ProcessChonks.length; l++){
    let thisChonk = ProcessChonks[l];
    if(thisChonk.offx === x && thisChonk.offy === y && thisChonk.offz === z){
      return true;
    }
  }
  return false;
}


function unLoadChonks(nearDist, viewAng, viewDist){
  for(let c = LoadedChonks.length - 1; c >= 0; c--){
    let thisChonk = LoadedChonks[c];
    if(thisChonk !== currChonk){
      if(thisChonk.disttochonkcenterLin(playerx,playery,playerz) > nearDist){
        if(thisChonk.disttochonkcenterLin(playerx,playery,playerz) <= viewDist){
          if(thisChonk.angBetweenCenter(playerView) >= viewAng){
            LoadedChonks.splice(c,1);
            UnLoadedChonks.push(thisChonk);
          }
        }else if(thisChonk.disttochonkcenterLin(playerx,playery,playerz) > viewDist){
          LoadedChonks.splice(c,1);
        }
      }     
    }
  }
  for(let c = UnLoadedChonks.length - 1; c >= 0; c--){
    let thisChonk = UnLoadedChonks[c];
    if(thisChonk !== currChonk){
      if(thisChonk.disttochonkcenterLin(playerx,playery,playerz) > viewDist){
        UnLoadedChonks.splice(c,1);
      }
    }
  }
}

function prepChonks(){
  if(ProcessBufChonks.length > 0 || ProcessChonks.length > 0){
    if(startLoad){
      marchProcessChonks();
      startLoad = false;
    }
    if(loadReady){
      LoadedChonks = LoadedChonks.concat(ProcessChonks);
      ProcessChonks = [];
      ProcessChonks = ProcessChonks.concat(ProcessBufChonks);
      ProcessBufChonks = [];
      loadReady = false;
      startLoad = true;
    }
  }
}

async function marchProcessChonks(){
  ProcessChonks.forEach(lChonk => {
    lChonk.initialize(smoothness, terraintype);
    lChonk.setThresh(threshhold);
    lChonk.march();
    //lChonk.geometryInit();
  });
  loadReady = true;
}
