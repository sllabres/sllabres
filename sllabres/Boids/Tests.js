//module("Given world");
//test("When", function () {
//    var drawCalled = false;
//    var rendererProxy = { draw: function () { drawCalled = true; } };    
//    var world = new World(rendererProxy);
//    var boid = new Boid(world);
//    world.addBoid(boid);
//    world.update();

//    ok(drawCalled);
//});

//function World() {
//    return {};
//}

module("Given alignment rule");
test("When notify boid of heading 90 degrees Then boid tells world new heading 90 degrees", function () {
    var actualOrientation = 0, neightbourOrientation = 90, expectedOrientation = 90;
    var world = { notify: function (orientation) { actualOrientation = orientation; } }
    var boid = new Boid(world);
    boid.notifyYaw(neightbourOrientation);
    boid.update();

    equal(actualOrientation, expectedOrientation);
});

test("When notify boid of heading 180 degrees Then boid tells world new heading 180 degrees", function () {
    var actualOrientation = 0, neightbourOrientation = 180, expectedOrientation = 180;
    var world = { notify: function (orientation) { actualOrientation = orientation; } }
    var boid = new Boid(world);    
    boid.notifyYaw(neightbourOrientation);
    boid.update();

    equal(actualOrientation, expectedOrientation);
});

test("When notified of two boid headings 90 and 180 degrees Then boid tells world new heading of 135 degrees", function () {
    var actualOrientation = 0,
        neightbourAOrientation = 90,
        neightbourBOrientation = 180,
        expectedOrientation = 135;

    var world = { notify: function (orientation) { actualOrientation = orientation; } }
    var boid = new Boid(world);
    boid.notifyYaw(neightbourAOrientation);
    boid.notifyYaw(neightbourBOrientation);
    boid.update();

    equal(actualOrientation, expectedOrientation);
});

test("When notified of two boid headings 45 and 90 degrees Then boid tells world new heading of 67.5 degrees", function () {
    var actualOrientation = 0,
        neightbourAOrientation = 45,
        neightbourBOrientation = 90,
        expectedOrientation = 67.5;

    var world = { notify: function (orientation) { actualOrientation = orientation; } }
    var boid = new Boid(world);
    boid.notifyYaw(neightbourAOrientation);
    boid.notifyYaw(neightbourBOrientation);
    boid.update();

    equal(actualOrientation, expectedOrientation);
});

test("When updating boid Then world notified of position", function () {
    var actualPositionX = 0,
        expectedPositionX = 0,
        actualPositionY = 0,
        expectedPositionY = 0;

    var world = { notify: function (orientation, location) { actualPositionX = location.x; actualPositionY = location.y; } }
    var boid = new Boid(world);    
    boid.update();

    equal(actualPositionX, expectedPositionX);
    equal(actualPositionY, expectedPositionY);
});

function Location(x, y, z) {
    return {
        x: x,
        y: y,
        z: z
    }
}

function Boid(world) {
    var location = new Location(0, 0, 0);
    var alignmentRule = new AlignmentRule();
    var neighbourCount = 0;
    var totalHeading = 0;
    var positionX = 0;
    var yaw = 0;
    world = world;

    function notifyYaw(orientation) {
        neighbourCount++;
        totalHeading += orientation;        
    }

    function update() {
        yaw = alignmentRule.yaw(totalHeading, neighbourCount);
        world.notify(yaw, location);
        neighbourCount = 0;
        totalHeading = 0;        
    }

    return {
        notifyYaw: notifyYaw,
        update : update
    };
}

function AlignmentRule() {
    function yaw(orientation, neighbours) {
        return orientation / neighbours;
    }

    return { yaw: yaw };
}