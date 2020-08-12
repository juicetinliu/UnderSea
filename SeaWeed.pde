class SeaWeed{
  float x, y, z;
  float size, maxheight;
  int amount;
  ArrayList<Weed> Weeds = new ArrayList<Weed>();
  
  SeaWeed(float x, float y, float z, float size, float maxheight, int amount){
    this.x = x;
    this.y = y; 
    this.z = z;
    this.size = size;
    this.maxheight = maxheight;
    this.amount = amount;
    for(int i = 0; i < amount; i++){
      float rb = random(50,100);
      Weeds.add(new Weed(random(x-size/2,x+size/2),y,random(z-size/2,z+size/2),color(rb,map(rb,10,100,100,200),rb),10,1, random(maxheight*0.5,maxheight)));
    }
  }
  
  void run(){
    for(Weed thisweed:Weeds){
      thisweed.update(0.02,0.003);
    }
  }
}


class Weed{
  float segLen = 0.001;//length of each segment
  float flot = segLen*1.25;//flotation constant
  float baseWidth;
  float tipWidth;
  
  int noSegs;
  PVector[] pos;//position of each segment
  color[] cols;//colors array, one per segment
  //MyColor myCol = new MyColor();
  PVector rootNoise = new PVector(random(123456), random(123456));//noise water effect
  float x, y, z;
  
  Weed(float x, float y, float z, color startCol, float baseWidth, float tipWidth, float tall){
    this.noSegs = int(tall/segLen);
    pos = new PVector[noSegs];
    cols = new color[noSegs];
    this.x = x;
    this.y = y;
    this.z = z;
    this.baseWidth = baseWidth;
    this.tipWidth = tipWidth;
    for (int i = 0; i < noSegs; i++){
      pos[i] = new PVector(x, y - i * segLen, z);
      cols[i] = color(startCol, map(i,0,noSegs,255,0));
    }
  }
  
  void update(float frequency, float smoothness){
    rootNoise.add(new PVector(frequency,frequency,frequency));
    for (int i = 1; i < noSegs; i++){
      float n = noise(rootNoise.x + smoothness * pos[i].x, rootNoise.y + smoothness * pos[i].y, rootNoise.z + smoothness * pos[i].z);
      float randang = map(noise(rootNoise.x + smoothness * pos[i].x),0,1,0,2*PI);
      float noiseForce = (0.5 - n) * 4 * segLen;
      pos[i].x += noiseForce*cos(randang);
      pos[i].y -= flot;
      pos[i].z += noiseForce*sin(randang);

      PVector tmp = PVector.sub(pos[i-1], pos[i]);
      tmp.normalize();
      tmp.mult(segLen);
      pos[i] = PVector.sub(pos[i-1], tmp);
    }

    beginShape();
    for(int i = 0; i < noSegs; i++){
        //fill(cols[i]);
        stroke(cols[i]);
        strokeWeight(map(noSegs-i,noSegs,1,baseWidth,tipWidth));
        curveVertex(pos[i].x, pos[i].y,pos[i].z);
    }
    endShape();    
  }
}
