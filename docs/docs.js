let lightShader, normalShader;

let renderer, gl;
let BgColor;
let viewDistance, nearDistance, viewAng;
let lines = [];

let ChonkSpacing = 10;
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

let player;

function preload() {
  lines = loadStrings('lines.txt');
  
  normalShader = loadShader('assets/normal.vert','assets/normal.frag');
  lightShader = loadShader('assets/foglight.vert','assets/foglight.frag');
}

function setup() {
  renderer = createCanvas(windowWidth, windowHeight, WEBGL);
  gl = document.getElementById('defaultCanvas0').getContext('webgl');
  
  let latofont = loadFont('assets/Lato-Regular.ttf');
  textFont(latofont);
  
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

  let joystickControl = new Joystick(width-100, height-100, 50, 20);
  let mouseControl = new Mouse();
  let keyControl = new KeyBoard();

  player = new Player(playerx, playery, playerz, 0, 0, 0, 0, 0, keyControl, document.isMobileOrTabletView ? joystickControl : mouseControl);
  
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
  
  shader(lightShader);
  lightShader.setUniform("fogNear", 0.0);
  lightShader.setUniform("fogFar", dispscale*viewDistance);
  lightShader.setUniform("fogColor",  [map(red(BgColor),0,255,0,1.0),map(green(BgColor),0,255,0,1.0),map(blue(BgColor),0,255,0,1.0)]);

  frameRate(60);
  console.log("Setup Complete");
}

function draw() {
  BgColor = bgColorChange();
  background(BgColor);

  lightShader.setUniform("fogColor",  [map(red(BgColor),0,255,0,1.0),map(green(BgColor),0,255,0,1.0),map(blue(BgColor),0,255,0,1.0)]);
  
  player.move(dispscale, dispscale);
  
  lightFalloff(1.0, 0.0, 0.01);
  pointLight(40,40,80, 0, -10,0);
  let scaledPlayerPosition = player.position.copy().mult(dispscale);
  let lightDirection = scaledPlayerPosition.copy().add(player.viewDirection);
  if(lightmode === 1){
    lightFalloff(1.0, 0.0, 2.5 * dispscale);
    spotLight(150,150,140, scaledPlayerPosition.x, scaledPlayerPosition.y, scaledPlayerPosition.z, lightDirection.x, lightDirection.y, lightDirection.z, radians(30), 50);
  }else if(lightmode === 2){
    lightFalloff(1.0, 0.0, 2.0 * dispscale);
    spotLight(150,150,140, scaledPlayerPosition.x, scaledPlayerPosition.y, scaledPlayerPosition.z, lightDirection.x, lightDirection.y, lightDirection.z, radians(30), 10);
  }
  
  // otherControls();
  
  currChonk = setCurrentChonk(player);
  
  if(toggleDebug){
    currChonk.displayCurrBounding();
  }
  
  LoadedChonks.forEach(thisChonk => {
    if(toggleDebug){
      thisChonk.displayBounding();
    }else{
      fill(255);
      thisChonk.geometryDisp(renderer, dispscale);
    }
  });
  hud();
  
  loadChonks(currChonk, 3, nearDistance, viewAng, viewDistance, player);
  unLoadChonks(nearDistance, viewAng, viewDistance, player);
  prepChonks();
  
}

function bgColorChange(){
  return color(Math.min(20,Math.max(1,map(playery,0,50,20,1))), Math.min(90,Math.max(1,map(playery,0,50,90,1))), Math.min(150,Math.max(5,map(playery,0,50,150,1))));
}
