//let lightShader;

let renderer, gl;
let BgColor;
let playerspeed = 5; 
let playerView;
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

function preload() {
  lines = loadStrings('lines.txt');
  
  //lightShader = loadShader('assets/ogvert.vert','assets/ogfrag.frag');
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
  playerrotxz = 0;
  playerroty = 0;
  viewDistance = 4*ChonkSpacing;
  viewAng = radians(90);
  nearDistance = 1*ChonkSpacing;
  
  deltx = width/2;
  delty = height/2;
  
  LoadedChonks.push(new Chonk(chonkx, chonky, chonkz, threshhold, startingx, startingy, startingz, dispscale));
  
  noiseSeed(3);
  LoadedChonks.forEach(thisChonk => {
    thisChonk.initialize(smoothness, terraintype);
    thisChonk.march();
    //thisChonk.geometryInit();
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
  
  lightFalloff(1.0, 0.0, 0.01);
  pointLight(40,40,80, 0, -10,0);
  
  if(lightmode === 1){
    lightFalloff(1.0, 0.0, 2.5 * dispscale);
    spotLight(150,150,140, dispscale*playerx, dispscale*playery, dispscale*playerz, dispscale*playerx + playerView.x, dispscale*playery + playerView.y, dispscale*playerz + playerView.z, radians(30), 50);
  }else if(lightmode === 2){
    lightFalloff(1.0, 0.0, 2.5 * dispscale);
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
      //stroke(0,0);
      //setAttributes('perPixelLighting', true);
      //thisChonk.displayMesh();
      thisChonk.geometryDisp(renderer, dispscale);
    }
  });
  
  hud();
  
  LoadChonks(currChonk, 3, nearDistance, viewAng, viewDistance);
  unLoadChonks(nearDistance, viewAng, viewDistance);
  prepChonks();
  
}

function bgColorChange(){
  return color(min(20,max(1,map(playery,0,50,20,1))), min(90,max(1,map(playery,0,50,90,1))), min(150,max(5,map(playery,0,50,150,1))));
}

//var renderer;
//var geometry;
//var uniqueVertices;

//function setup() {
//  // put setup code here

//  renderer = createCanvas(windowWidth, windowHeight, WEBGL);

//  geometry = icosphere(5);
//  uniqueVertices = [...new Set(geometry.vertices)];
//}

//function draw() {
//  var tt = millis();

//  background(0);

//  //stroke(0);
//  noStroke();

//  var sunPos = p5.Vector.fromAngles(-tt / 5000, PI / 4, 1000);
//  push();
//  fill(255, 250, 136);
//  translate(sunPos);
//  sphere(60);
//  pop();

//  var moonPos = p5.Vector.fromAngles(PI - tt / 5000, PI / 4, 1000);
//  push();
//  translate(moonPos);
//  fill(255);
//  sphere(40);
//  pop();

//  for (var ii = 0; ii < 10; ii ++) {
//    var side = p5.Vector.fromAngles(random(TWO_PI), random(PI));
//    var amt = random(-1, 1) * random(-1, 1) / 15;
//    var vertices = uniqueVertices;//geometry.vertices;
//    var o = random(-1, 1);
//    for (var i = 0 ; i < vertices.length; i ++) {
//      var v = vertices[i];
//      var l = v.mag();
//      if (side.dot(v) > o) {
//        v.setMag(l + amt);
//      } else {
//        v.setMag(1 + (l - 1) * 0.991);
//      }
//    }
//  }

//  fill(255);

//  pointLight(255, 250, 136, sunPos);
//  pointLight(150, 150, 150, moonPos);
  
//  rotateX(millis()/11000);
//  rotateY(millis()/11234.123);
//  rotateX(millis()/12134.789);


//  geometry.computeNormals();
//  renderer.createBuffers("!", geometry);
  
//  var s = min(width,height)/4;
  
//  renderer.drawBuffersScaled("!", s, s, s);
//}

//function icosphere(detail) {
//  var g = new p5.Geometry(detail);

//  var addVertex = function(p) {
//    p.normalize();
//    g.vertices.push(p);
//    g.vertexNormals.push(p);

//    g.uvs.push([
//      ((Math.atan2(p.x, p.z) / Math.PI + 1) / 2) % 1,
//      Math.acos(-p.y) / Math.PI
//    ]);
//  };

//  // golden ratio FTW!
//  var phi = (1 + Math.sqrt(5)) / 2;

//  addVertex(new p5.Vector(-1, phi, 0));
//  addVertex(new p5.Vector(1, phi, 0));
//  addVertex(new p5.Vector(-1, -phi, 0));
//  addVertex(new p5.Vector(1, -phi, 0));
//  addVertex(new p5.Vector(0, -1, phi));
//  addVertex(new p5.Vector(0, 1, phi));
//  addVertex(new p5.Vector(0, -1, -phi));
//  addVertex(new p5.Vector(0, 1, -phi));
//  addVertex(new p5.Vector(phi, 0, -1));
//  addVertex(new p5.Vector(phi, 0, 1));
//  addVertex(new p5.Vector(-phi, 0, -1));
//  addVertex(new p5.Vector(-phi, 0, 1));

//  var faces = [
//    [0, 5, 11],
//    [0, 1, 5],
//    [0, 7, 1],
//    [0, 10, 7],
//    [0, 11, 10],
//    [1, 9, 5],
//    [5, 4, 11],
//    [11, 2, 10],
//    [10, 6, 7],
//    [7, 8, 1],
//    [3, 4, 9],
//    [3, 2, 4],
//    [3, 6, 2],
//    [3, 8, 6],
//    [3, 9, 8],
//    [4, 5, 9],
//    [2, 11, 4],
//    [6, 10, 2],
//    [8, 7, 6],
//    [9, 1, 8]
//  ];
  
//  for (var ff = 0; ff < faces.length; ff++) {
//    var f = faces[ff];
//    var t = f[0];
//    f[0] = f[1];
//    f[1] = t;
//  }

//  g.faces = faces;

//  return g;
//}
