PVector linesphereintersect(float px, float py, float pz, float lx, float ly, float lz, float rad){
  PVector pointer = new PVector(lx,ly,lz);
  pointer.setMag(rad);
  pointer.add(px,py,pz);
  return pointer;
}

PVector lineplaneintersect(float l1, float l2, float l3, float l01, float l02, float l03, float p1, float p2, float p3, float n1, float n2, float n3){

  float dtop = (p1-l01)*n1+(p2-l02)*n2+(p3-l03)*n3;
  float dbot = l1*n1+l2*n2+l3*n3;
  float d = dtop/dbot;
  
  float retx = d*l1 + l01;
  float rety = d*l2 + l02;
  float retz = d*l3 + l03;
  //println(retx,rety,retz);
  
  PVector returnvec = new PVector(retx,rety,retz);
  //println(returnvec);
  
  return returnvec;
}

boolean linelinesect(float x1, float y1, float x2, float y2, float x3, float y3, float x4, float y4){
  float den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (den != 0){
    float t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    float u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (u >= 0 && u <= 1 && t >= 0 && t <= 1){
      stroke(255,0,0);
      strokeWeight(4);
      line(x1,y1,x2,y2);
      line(x3,y3,x4,y4);
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}

boolean linerectsect(float segx1, float segy1, float segx2, float segy2, float rectcenterx, float rectcentery, float rectang, float rectw, float recth){
  PVector rectpoint1 = new PVector(rectw/2,recth/2);
  PVector rectpoint2 = new PVector(rectw/2,-recth/2);
  PVector rectpoint3 = new PVector(-rectw/2,recth/2);
  PVector rectpoint4 = new PVector(-rectw/2,-recth/2);
  rectpoint1.rotate(rectang).add(rectcenterx,rectcentery);
  rectpoint2.rotate(rectang).add(rectcenterx,rectcentery);
  rectpoint3.rotate(rectang).add(rectcenterx,rectcentery);
  rectpoint4.rotate(rectang).add(rectcenterx,rectcentery);
  if(linelinesect(segx1,segy1,segx2,segy2,rectpoint1.x,rectpoint1.y,rectpoint2.x,rectpoint2.y)){
      return true;
  }else if(linelinesect(segx1,segy1,segx2,segy2,rectpoint2.x,rectpoint2.y,rectpoint4.x,rectpoint4.y)){
      return true;
  }else if(linelinesect(segx1,segy1,segx2,segy2,rectpoint4.x,rectpoint4.y,rectpoint3.x,rectpoint3.y)){
      return true;
  }else if(linelinesect(segx1,segy1,segx2,segy2,rectpoint3.x,rectpoint3.y,rectpoint1.x,rectpoint1.y)){
      return true;
  }else{
    return false;
  }
}
