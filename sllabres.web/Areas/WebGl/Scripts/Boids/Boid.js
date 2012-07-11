function Boid(drawable, cohesionRule) {    
    var cohesionRule = cohesionRule;    
    this.drawable = drawable;
    var force = 0.1;

    this.update = function() {    		    	
        	this.drawable.drawData.yaw += (cohesionRule.yawDirection(this.drawable.drawData.x, this.drawable.drawData.y, this.drawable.drawData.yaw) * (Math.PI / 180));       	
        	this.drawable.drawData.y += Math.sin(this.drawable.drawData.yaw) * force;
        	this.drawable.drawData.x += Math.cos(this.drawable.drawData.yaw) * force;
            this.drawable.draw();
    }
}