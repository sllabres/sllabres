function Boid(drawable, cohesionRule) {    
    this.cohesionRule = cohesionRule;    
    this.drawable = drawable;
    this.force = 0.1;
    this.turningRate = (Math.PI / 180);

    this.update = function() {
            var yawDirection = this.cohesionRule.yawDirection(this.drawable.drawData.x, this.drawable.drawData.y, this.drawable.drawData.yaw)
            this.drawable.drawData.yaw += (yawDirection * this.turningRate);
        	this.drawable.drawData.y += Math.sin(this.drawable.drawData.yaw) * this.force;
        	this.drawable.drawData.x += Math.cos(this.drawable.drawData.yaw) * this.force;
            this.drawable.draw();
    }
}