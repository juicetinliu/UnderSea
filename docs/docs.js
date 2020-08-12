//let lightShader;
let BgColor;
let playerspeed = 5; 
let playerView;
let viewDistance, nearDistance, viewAng;
let lines = [];

let ChonkSpacing = 5;
let chonkx = ChonkSpacing + 1,chonky = ChonkSpacing + 1,chonkz = ChonkSpacing + 1;
let chonksx, chonksy, chonksz;
let terraintype = 3;
let dispscale = 0.01, smoothness = 10;
let threshhold = 0.5, threshAmount = 0.001;

let lightmode = 0;

let LoadedChonks = [];
let ProcessChonks = [];
let ProcessBufChonks = [];
let UnLoadedChonks = [];

let loadReady = true, startLoad = false;
let currChonk;
let toggleDebug = false;

function preload() {
  lines = loadStrings('lines.txt');
  
  //lightShader = loadShader('assets/ogvert.vert','assets/ogfrag.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  BgColor = color(20,90,150);
  
  playerView = createVector(0,0,0);
  chonksx = ChonkSpacing;
  chonksy = ChonkSpacing;
  chonksz = ChonkSpacing;
  
  let startingx = 0;
  let startingy = -10;
  let startingz = 0;
  
  playerx = startingx + ChonkSpacing/2;
  playery = startingy + ChonkSpacing/2;
  playerz = startingz + ChonkSpacing/2;
  playerrotxz = 0;
  playerroty = 0;
  viewDistance = 4*ChonkSpacing;
  viewAng = radians(90);
  nearDistance = 1*ChonkSpacing;
  
  LoadedChonks.push(new Chonk(chonkx, chonky, chonkz, threshhold, startingx, startingy, startingz, dispscale));
  
  noiseSeed(3);
  LoadedChonks.forEach(thisChonk => {
    thisChonk.initialize(smoothness, terraintype);
    thisChonk.march();
  });
  let fov = PI/3.0;
  
  perspective(fov, float(width)/float(height), dispscale/100, 5000);
  
  
  //lightShader.setUniform("fogNear", 0.0); 
  //lightShader.setUniform("fogFar", scale*viewDistance);
  //lightShader.setUniform("fogColor",  [map(red(BgColor),0,255,0,1.0),map(green(BgColor),0,255,0,1.0),map(blue(BgColor),0,255,0,1.0)]);
  console.log("Setup Complete");
}

function draw() {
  BgColor = bgColorChange();
  background(BgColor);
    
  moveCamera(0.05);
  
  lightFalloff(0.00001,0,0);
  pointLight(40,40,80, dispscale*playerx, dispscale*playery, dispscale*playerz);
  
  if(lightmode === 1){
    lightFalloff(1.0, 0.0, 250.0);
    spotLight(150,150,140, dispscale*playerx, dispscale*playery, dispscale*playerz, dispscale*playerx + playerView.x, dispscale*playery + playerView.y, dispscale*playerz + playerView.z, radians(30), 50);
  }else if(lightmode === 2){
    lightFalloff(1.0, 0.0, 200.0);
    spotLight(150,150,140, dispscale*playerx, dispscale*playery, dispscale*playerz, dispscale*playerx + playerView.x, dispscale*playery + playerView.y, dispscale*playerz + playerView.z, radians(30), 10);
  }
  otherControls();
  
  currChonk = setCurrentChonk();
  
  if(toggleDebug){
    currChonk.displayCurrBounding();
  }
  
  LoadedChonks.forEach(thisChonk => {
    if(toggleDebug){
      thisChonk.displayBounding();
    }else{
      fill(255);
      stroke(0,0);
      specularMaterial(255);
      setAttributes('perPixelLighting', true);
      thisChonk.displayMesh();
    }
  });

  LoadChonks(currChonk, 3, nearDistance, viewAng, viewDistance);
  unLoadChonks(nearDistance, viewAng, viewDistance);
  prepChonks();
  // hud();
}

function bgColorChange(){
  return color(min(20,max(1,map(playery,0,50,20,1))), min(90,max(1,map(playery,0,50,90,1))), min(150,max(5,map(playery,0,50,150,1))));
}
