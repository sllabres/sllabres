describe("Boid", function() {
    var fakeCohesionRule = {};
    fakeDrawable = {};

    beforeEach(function() {
    	fakeDrawable.draw = jasmine.createSpy("draw");
        fakeDrawable.drawData = {};
        fakeDrawable.drawData.yaw = 0;
        fakeDrawable.drawData.x = 2;
        fakeDrawable.drawData.y = 1;
        fakeCohesionRule.yawDirection = jasmine.createSpy("yawDirection").andReturn(0);
        fakeCohesionRule.pitchDirection = jasmine.createSpy("pitchDirection").andReturn(0);
        fakeCohesionRule.updateLocation = jasmine.createSpy("updateLocation");
    });

    it("tells drawable to draw when updating", function() {
    	var boid = new Boid(fakeDrawable, fakeCohesionRule);
    	boid.update();
    	expect(fakeDrawable.draw).toHaveBeenCalled();
    });

    it("calls cohesionRule yaw", function () {        
        var boid = new Boid(fakeDrawable, fakeCohesionRule);
        boid.update();
        expect(fakeCohesionRule.yawDirection).toHaveBeenCalledWith(2, 1, 0);
    });

    it("applies a yaw of Math.PI / 180 when asking cohesion rule", function() {   
        fakeCohesionRule.yawDirection = jasmine.createSpy("yawDirection").andReturn(1);
        var boid = new Boid(fakeDrawable, fakeCohesionRule);
        boid.update();
        expect(fakeDrawable.drawData.yaw).toEqual(Math.PI / 180);
    });

    it("adds 1 to y coordinate when yaw is PI/2", function() {        
        fakeDrawable.drawData.yaw = Math.PI/2;
        fakeDrawable.drawData.y = 0;
        var boid = new Boid(fakeDrawable, fakeCohesionRule);        
        boid.update();                
        expect(fakeDrawable.drawData.y).toEqual(0.1);
    });

    it("deducts 1 from y coordinate when yaw is -PI/2", function() {        
        fakeDrawable.drawData.yaw = -Math.PI/2;
        fakeDrawable.drawData.y = 0;
        var boid = new Boid(fakeDrawable, fakeCohesionRule);
        boid.update();
        expect(fakeDrawable.drawData.y).toEqual(-0.1);
    });

    it("adds 1 to x coordinate when yaw is 2*PI", function() {        
        fakeDrawable.drawData.yaw = 2*Math.PI;
        fakeDrawable.drawData.y = 0;
        fakeDrawable.drawData.x = 0;
        var boid = new Boid(fakeDrawable, fakeCohesionRule);        
        boid.update();                
        expect(fakeDrawable.drawData.x).toEqual(0.1);
    });
});