PShader lightShader;
color BgColor = color(20,90,150);
float playerspeed = 5; 
PVector playerView = new PVector(0,0,0);
float viewDistance, nearDistance, viewAng;
String[] lines;

int ChonkSpacing = 10;
int chonkx = ChonkSpacing + 1,chonky = ChonkSpacing + 1,chonkz = ChonkSpacing + 1;
int chonksx, chonksy, chonksz;
int terraintype = 3;
float scale = 0.01, smoothness = 10;
float threshhold = 0.5, threshAmount = 0.001;

int lightmode = 0;

ArrayList<Chonk> LoadedChonks = new ArrayList<Chonk>();
ArrayList<Chonk> ProcessChonks = new ArrayList<Chonk>();
ArrayList<Chonk> ProcessBufChonks = new ArrayList<Chonk>();
ArrayList<Chonk> UnLoadedChonks = new ArrayList<Chonk>();

boolean loadReady = true, startLoad = false;
Chonk currChonk;
boolean toggleDebug = false;

//SeaWeed CoolWeed = new SeaWeed(0, 0, 0, 0.005, 0.025, 20);

void setup() {
  //noiseSeed(12330);
  //randomSeed(5);
  fullScreen(P3D); 
  smooth();
  //pixelDensity(displayDensity());
  //frameRate(60);
  lines = loadStrings("lines.txt");
  
  try{
    robby = new Robot();
  }catch(AWTException e){
    println("Robot class not supported by your system!");
    exit();
  }
  chonksx = ChonkSpacing;
  chonksy = ChonkSpacing;
  chonksz = ChonkSpacing;
  
  //int startingx = int(random(10,100))*chonksx;
  //int startingy = int(random(10,100))*chonksy;
  //int startingz = int(random(10,100))*chonksz;
  int startingx = 0;
  int startingy = -10;
  int startingz = 0;
  
  playerx = startingx + ChonkSpacing/2;
  playery = startingy + ChonkSpacing/2;
  playerz = startingz + ChonkSpacing/2;
  playerrotxz = 0;
  playerroty = 0;
  viewDistance = 4*ChonkSpacing;
  viewAng = radians(90);
  nearDistance = 1*ChonkSpacing;
  
  LoadedChonks.add(new Chonk(chonkx, chonky, chonkz, threshhold, startingx, startingy, startingz, scale));

  
  noiseSeed(3);
  for(Chonk thisChonk:LoadedChonks){
    thisChonk.initialize(smoothness, terraintype);
    thisChonk.march();
  }
  float fov = PI/3.0;
  perspective(fov, float(width)/float(height), scale/100, 5000);
  noCursor();
  
  lightShader = loadShader("ogfrag.glsl", "ogvert.glsl");
  lightShader.set("fogNear", 0.0); 
  lightShader.set("fogFar", scale*viewDistance);
  lightShader.set("fogColor", map(red(BgColor),0,255,0,1.0),map(green(BgColor),0,255,0,1.0),map(blue(BgColor),0,255,0,1.0));
  
  println("Setup Complete");
}

void draw(){
  //background(color(rg,rg,min(255,max(5,map(playery,-20,15,255,5))))); 
  BgColor = bgColorChange();
  background(BgColor);
  lightShader.set("fogColor", map(red(BgColor),0,255,0,1.0),map(green(BgColor),0,255,0,1.0),map(blue(BgColor),0,255,0,1.0));
  
  moveCamera(0.05);
  //CoolWeed.run();
  
  lightFalloff(1.0, 0.0, 0.01);
  pointLight(40,40,80, 0, -10,0);
  
  if(lightmode == 1){
    lightFalloff(1.0, 0.0, 250.0);
    spotLight(150,150,140, scale*playerx, scale*playery, scale*playerz, scale*playerx + playerView.x, scale*playery + playerView.y, scale*playerz + playerView.z, radians(30), 50);
  }else if(lightmode == 2){
    lightFalloff(1.0, 0.0, 200.0);
    spotLight(150,150,140, scale*playerx, scale*playery, scale*playerz, scale*playerx + playerView.x, scale*playery + playerView.y, scale*playerz + playerView.z, radians(30), 10);
  }
  otherControls();
  
  shader(lightShader); 
  currChonk = setCurrentChonk();
  
  if(toggleDebug){
    currChonk.displayCurrBounding();
  }
  
  for(Chonk thisChonk:LoadedChonks){
    //thisChonk.displayBounding();
   
    //if(thisChonk.disttochonkcenterLinXZ(playerx, playerz) < ChonkSpacing){
      //thisChonk.displayWeed();
    //}
    if(toggleDebug){
      thisChonk.displayBounding();
    }else{
      thisChonk.displayMesh();
    }
  }
  resetShader();
  
  LoadChonks(currChonk, 3, nearDistance, viewAng, viewDistance);
  unLoadChonks(nearDistance, viewAng, viewDistance);
  prepChonks();
  hud();
}

color bgColorChange(){
  return color(min(20,max(1,map(playery,0,50,20,1))), min(90,max(1,map(playery,0,50,90,1))), min(150,max(5,map(playery,0,50,150,1))));
}

//float bgColorChanger(){
//  return min(20/255,max(1/255,map(playery,0,50,20/255,1/255)));
//}

//float bgColorChangeg(){
//  return min(90/255,max(1/255,map(playery,0,50,90/255,1/255)));
//}

//float bgColorChangeb(){
//  return min(150/255,max(5/255,map(playery,0,50,150/255,1/255)));
//}
