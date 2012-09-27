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

    this.yawHeading = function(xLocation, yLocation, yaw) {        
        setAverageCoordinates(xLocation, yLocation);
        
        var targetAngle = Math.atan2(this.yTarget - yLocation, this.xTarget - xLocation);
        var differenceAngle = Math.sin(targetAngle - yaw);
        var yawDirection = 1;
                        
        if(differenceAngle > 0)
            yawDirection = 1;
        else if(differenceAngle < 0)
            yawDirection = -1;

        return yawDirection;
    }

    this.count = 0;
    this.xTotal = 0;
    this.yTotal = 0;

    function setAverageCoordinates(xLocation, yLocation) {
        this.count++;

        this.xTotal += xLocation;
        this.xTarget += this.xTotal / this.count;

        this.yTotal += yLocation;
        this.yTarget += this.yTotal / this.count;
    }
}