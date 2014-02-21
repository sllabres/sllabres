/// <reference path="EventBus.js" />

function Location(x, y, z) {
    return {
        x: x,
        y: y,
        z: z
    }
}

function Boid(world, yaw) {
    var location = new Location(0, 0, 0);
    var alignmentRule = new AlignmentRule();
    var neighbourCount = 0;
    var totalYaw = 0;
    var yaw = yaw;
    world = world;

    function notifyYaw(yaw) {
        neighbourCount++;
        totalYaw += yaw;
    }

    function notifyNeighbours(neighbours) {
        neighbours.forEach(function (neighbour) {
            neighbour.notifyYaw(yaw);
        });

        yaw = alignmentRule.yaw(totalYaw, neighbourCount);
        world.notify(yaw, location);

        return new Boid(world, yaw);
    }

    return {
        notifyYaw: notifyYaw,
        notifyNeighbours: notifyNeighbours
    };
}

function AlignmentRule() {
    function yaw(orientation, neighbours) {
        var averageOrientation = orientation / neighbours;
        return isNaN(averageOrientation) ? 0 : averageOrientation;
    }

    return { yaw: yaw };
}

function World(eventBus) {
    var boids = new Array();
    var eventBus = eventBus;

    function addBoid(boid) {        
        boids.push(boid);
    }

    function notify(yaw, location) {        
        eventBus.notify(Boids.EventType.DrawBoid, yaw);        
    }

    function update() {
        var notifiedBoids = new Array();
        boids.forEach(function (boid, index) {
            notifiedBoids.push(boid.notifyNeighbours(boids));
        });

        boids = notifiedBoids;
    }

    return {
        addBoid: addBoid,
        update: update,
        notify: notify
    };
}

function RendererProxy() {
    function draw() {

    }


    return { draw: draw };
}