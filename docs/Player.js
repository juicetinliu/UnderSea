let MIN_MOVEMENT_MAG_TOLERANCE = 1e-4;

class Player{
    constructor(x, y, z, rotxz, roty, viewx, viewy, viewz, controlMovement, controlView){
        this.controlMovement = controlMovement;
        this.controlView = controlView;

        this.position = createVector(x, y, z);
        this.velocity = createVector(0, 0, 0);

        this.viewDirection = createVector(viewx, viewy, viewz);

        this.playerrotxz = rotxz;
        this.playerroty = roty;

        this.thrustMagnitude = 0
    }

    drawControlsHUD(){
        this.controlMovement.draw();
        this.controlView.draw();
    }

    move(speed, dispscale){
        this.controlMovement.interact();
        this.controlView.interact();

        speed = speed * deltaTime;
  
        if(!this.controlMovement.isFloat && !this.controlMovement.isSink){
            this.thrustMagnitude = 0;
        }else{
            if(this.controlMovement.isFloat){
                this.thrustMagnitude = speed/100;
            }
            if(this.controlMovement.isSink){
                this.thrustMagnitude = -speed/100;
            }
        }
        
        this.viewDirection.setMag(1.0); //normalize view direction

        this.velocity.add(this.viewDirection.copy().mult(this.thrustMagnitude))
        this.velocity.limit(speed);

        this.thrustMagnitude = abs(this.thrustMagnitude) > MIN_MOVEMENT_MAG_TOLERANCE ? this.thrustMagnitude / 2 : 0;
        let minVelocityX = abs(this.velocity.x) > MIN_MOVEMENT_MAG_TOLERANCE ? this.velocity.x * 0.98 : 0;
        let minVelocityY = abs(this.velocity.y) > MIN_MOVEMENT_MAG_TOLERANCE ? this.velocity.y * 0.98 : 0;
        let minVelocityZ = abs(this.velocity.z) > MIN_MOVEMENT_MAG_TOLERANCE ? this.velocity.z * 0.98 : 0;
  
        this.velocity.set(minVelocityX, minVelocityY, minVelocityZ);
        this.position.add(this.velocity);

        if(this.controlView.isLocked){
            this.playerroty = map(this.controlView.deltx, 0, width, 0, 2*PI);
            this.playerrotxz = map(this.controlView.delty, 0, height, PI-0.0001, 0);
        }

        this.viewDirection.set(50 * cos(this.playerroty) * sin(this.playerrotxz), 50 * cos(this.playerrotxz), 50 * sin(this.playerroty) * sin(this.playerrotxz));

        let cameraViewDirection = this.position.copy().add(this.viewDirection);

        camera(dispscale * this.position.x, dispscale * this.position.y, dispscale * this.position.z, dispscale * cameraViewDirection.x, dispscale * cameraViewDirection.y, dispscale * cameraViewDirection.z, 0, 1, 0);
        
    }
}