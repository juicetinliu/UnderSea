//ArrayList<Light> Lights = new ArrayList<Light>();

//class Light{
//  int Type;
//  PVector Position = new PVector(0,0,0); // ALL - Position Vector
//  PVector Normal = new PVector(0,0,0); // SPOTLIGHT + DIRECTIONAL - Direction Vector
//  float Dir = 0.0; //SPOTLIGHT + DIRECTIONAL -> 1.0 | AMBIENT + POINT -> 0.0 
//  PVector Ambient = new PVector(0,0,0); //AMBIENT - only for ambient light source (Colour)
//  PVector Diffuse = new PVector(0,0,0); //ALL - Color OF LIGHT
//  PVector Specular = new PVector(0,0,0); //IGNORE
//  PVector Falloff = new PVector(1.0,0,0); //ALL - constant, lin, quadratic
//  float SpotLightCos = 0.0;  //SPOTLIGHT - angle
//  float SpotLightExp = 0.0;  //SPOTLIGHT - concentration
//  PMatrix3D d;
//  Light(int Type, PVector Vec, PVector Col){ // Point Light, Ambient, Directional
//    this.Type = Type; //Point - 0; Ambient - 1; Directional - 2; Spot - 3;
//    if(Type == 0 || Type == 1){
//      this.Dir = 0.0;
//      this.Position = Vec;
//    }else{
//      this.Dir = 1.0;
//      this.Normal = Vec;
//    }
//    this.Diffuse = Col;
//    d.
//  }
  
//  Light(int Type, PVector Pos, PVector Dir, PVector Col, float Rad, float Conc){ // Spot Light
//    this.Type = Type;
//    this.Position = Pos;
//    this.Normal = Dir;
//    this.Dir = 1.0;
//    this.Diffuse = Col;
//    this.SpotLightCos = cos(Rad);
//    this.SpotLightExp = Conc;
//  }
  
//  void setFallOff(PVector set){
//    Falloff.set(set);
//  }
//}

//void sendLightsToShader(){
//  int lightCount = Lights.size();
//  float[] lightDirBool = new float[lightCount];
//  ArrayList<PVector> lightPosition = new ArrayList<PVector>();
//  ArrayList<PVector> lightNormal = new ArrayList<PVector>();
//  ArrayList<PVector> lightAmbient = new ArrayList<PVector>();
//  ArrayList<PVector> lightDiffuse = new ArrayList<PVector>();
//  ArrayList<PVector> lightSpecular = new ArrayList<PVector>();
//  ArrayList<PVector> lightFalloff = new ArrayList<PVector>();
//  float[] lightSpotCos = new float[lightCount];
//  float[] lightSpotExp = new float[lightCount];
  
//  for(int l = 0; l < Lights.size(); l++){
//    Light thisLight = Lights.get(l);
//    lightDirBool[l] = thisLight.Dir;
//    lightPosition.add(thisLight.Position);
//    lightNormal.add(thisLight.Normal);
//    lightAmbient.add(thisLight.Ambient);
//    lightDiffuse.add(thisLight.Diffuse);
//    lightSpecular.add(thisLight.Specular);
//    lightFalloff.add(thisLight.Falloff);
//    lightSpotCos[l] = thisLight.SpotLightCos;
//    lightSpotExp[l] = thisLight.SpotLightExp;
//  }
//}

////uniform int lightCount;
////uniform float lightDirBool[8];
////uniform vec3 lightPosition[8];
////uniform vec3 lightNormal[8];
////uniform vec3 lightAmbient[8];
////uniform vec3 lightDiffuse[8];
////uniform vec3 lightSpecular[8];
////uniform vec3 lightFalloff[8];
////uniform float lightSpotCos[8];
////uniform float lightSpotExp[8];
