function Boid(drawable, cohesionRule) {    
    this.cohesionRule = cohesionRule;    
    this.drawable = drawable;
    this.velocity = 0.1;
    this.acceleration = 0.2;
    this.turningRate = (Math.PI / 180);
    this.maxVelocity = 0.2;

    this.update = function() {
            var yawHeading = this.cohesionRule.yawHeading(this.drawable.drawData.x, this.drawable.drawData.y, this.drawable.drawData.yaw)
            this.setOrientation(yawHeading);            
            this.move(yawHeading);
            this.drawable.draw();
    }

    this.setOrientation = function(yawHeading) {            
            this.drawable.drawData.yaw += (yawHeading * this.turningRate);            
    }

    this.move = function(yawHeading)    {
            var target_velocity_y = Math.sin(yawHeading) * this.maxThrust;
            var target_velocity_x = Math.cos(yawHeading) * this.maxThrust;

            this.drawable.drawData.y += Math.sin(this.drawable.drawData.yaw) * this.velocity;
            this.drawable.drawData.x += Math.cos(this.drawable.drawData.yaw) * this.velocity;
    }
}