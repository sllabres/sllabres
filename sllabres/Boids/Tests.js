/// <reference path="EventBus.js" />

module("Given world");
test("When updating boid Then draw event raised", function () {    
    var actualEventType;
    var eventBus = { notify: function (eventType) { actualEventType = eventType; } };    
    var world = new World(eventBus);
    var boid = new Boid(world);
    world.addBoid(boid);
    world.update();
    equal(actualEventType, Boids.EventType.DrawBoid);
});

test("When updating boid Then draw with yaw 0", function () {
    var actualYaw = 0, 
        expectedYaw = 0,
        eventBus = { notify: function (eventType, params) { actualYaw = params; } },
        world = new World(eventBus),
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