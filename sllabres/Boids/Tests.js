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

function World(renderer) {
    var boids = new Array();

    function addBoid(boid) {
        boids.push(boid);
    }

    function notify(yaw, location) {
        renderer.draw(yaw);
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

module("Given world");
test("When updating boid Then draw called", function () {
    var drawCalled = false;
    var rendererProxy = { draw: function () { drawCalled = true; } };    
    var world = new World(rendererProxy);
    var boid = new Boid(world);
    world.addBoid(boid);
    world.update();
    ok(drawCalled);
});

test("When updating boid Then draw with yaw 0", function () {
    var actualYaw = 0, 
        expectedYaw = 0,
        rendererProxy = { draw: function (yaw) { actualYaw = yaw; } },
        world = new World(rendererProxy),
        boid = new Boid(world);

    world.addBoid(boid);
    world.update();

    equal(actualYaw, expectedYaw);
});

// take average including its own heading
//test("When updating boid with one neighbour heading 90 Then draw with yaw 45", function () {
//    var actualYaw = 0,
//        expectedYaw = 45,
//        rendererProxy = { draw: function (yaw) { actualYaw = yaw; } },
//        world = new World(rendererProxy),
//        boid = new Boid(world),
//        boidNeighbour = new Boid(world);

//    world.addBoid(boid);
//    world.addBoid(boidNeighbour);
//    world.update();

//    equal(actualYaw, expectedYaw);
//});


module("Given alignment rule");
test("When notify boid of heading 90 degrees Then boid tells world new heading 45 degrees", function () {
    var actualOrientation = 0,
        neightbourOrientation = 90,
        expectedOrientation = 45,
        world = { notify: function (orientation) { actualOrientation = orientation; } },
        boid = new Boid(world, 0),
        neighbour = new Boid(world, neightbourOrientation),
        neighbours = new Array(neighbour, boid);

    boid.notifyNeighbours(neighbours);
    neighbour.notifyNeighbours(neighbours);

    equal(actualOrientation, expectedOrientation);
});

test("When notify boid of heading 180 degrees Then boid tells world new heading 90 degrees", function () {
    var actualOrientation = 0,
        expectedOrientation = 90,
        world = { notify: function (orientation) { actualOrientation = orientation; } }
        boid = new Boid(world, 0),
        neighbour = new Boid(world, 180),
        neighbours = new Array(boid, neighbour);

    boid.notifyNeighbours(neighbours);
    neighbour.notifyNeighbours(neighbours);    

    equal(actualOrientation, expectedOrientation);
});

test("When notified of two boid headings 90 and 180 degrees Then boid tells world new heading of 90 degrees", function () {
    var actualOrientation = 0,
        expectedOrientation = 90,
        neighbours = new Array(),
        world = { notify: function (orientation) { actualOrientation = orientation; } },
        boid = new Boid(world, 0),
        neighbourA = new Boid(world, 90),
        neighbourB = new Boid(world, 180),
        neighbours = new Array(boid, neighbourA, neighbourB);

    neighbourA.notifyNeighbours(neighbours);
    neighbourB.notifyNeighbours(neighbours);
    boid.notifyNeighbours(neighbours);

    equal(actualOrientation, expectedOrientation);
});

test("When notified of two boid headings 45 and 90 degrees Then boid tells world new heading of 45 degrees", function () {
    var actualOrientation = 0,
        expectedOrientation = 45,
        world = { notify: function (orientation) { actualOrientation = orientation; } }
        boid = new Boid(world, 0),
        neighbourA = new Boid(world, 45),
        neighbourB = new Boid(world, 90),
        neighbours = new Array(boid, neighbourA, neighbourB);

    neighbourA.notifyNeighbours(neighbours);
    neighbourB.notifyNeighbours(neighbours);
    boid.notifyNeighbours(neighbours);

    equal(actualOrientation, expectedOrientation);
});

test("When updating boid Then world notified of position", function () {
    var actualPositionX = 0,
        expectedPositionX = 0,
        actualPositionY = 0,
        expectedPositionY = 0,
        world = { notify: function (orientation, location) { actualPositionX = location.x; actualPositionY = location.y; } },
        boid = new Boid(world),
        neighbours = new Array();

    boid.notifyNeighbours(neighbours);

    equal(actualPositionX, expectedPositionX);
    equal(actualPositionY, expectedPositionY);
});