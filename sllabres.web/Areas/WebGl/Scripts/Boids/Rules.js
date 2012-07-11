/**
3 Rules which define boids
separation: steer to avoid crowding local flockmates
    When the boid is within 10 spaces of the average center of mass then move away
        (displace below)        
cohesion: steer to move toward the average position (center of mass) of local flockmates
alignment: steer towards the average heading of local flockmates
**/

function CohesionRule(xTarget, yTarget) {

    this.xTarget = xTarget;
    this.yTarget = yTarget;

    this.yawDirection = function(xLocation, yLocation, yaw) {        
        var targetAngle = Math.atan2(this.yTarget - yLocation, this.xTarget - xLocation);
        var differenceAngle = Math.sin(targetAngle - yaw);
        var yawDirection = 1;
                        
        if(differenceAngle > 0)
            yawDirection = 1;
        else if(differenceAngle < 0)
            yawDirection = -1;

        return yawDirection;
    }
}