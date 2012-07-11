describe("Drawable object", function() {
	var fakeGl;
	var fakeDrawHandler;
    var fakeDrawData;
    var drawable;
    var fakeVertexPositionBuffer;

	beforeEach(function() {
		fakeGl = {};
    	fakeDrawHandler = {};
        fakeDrawData = {};
        fakeDrawData.yaw = 0;
        
        fakeDrawData.vertices = [0.0,  1.0,  0.0,
						        -1.0, -1.0,  0.0,
						         1.0, -1.0,  0.0];

        fakeVertexPositionBuffer = "fakeVertexPositionBuffer";
        fakeGl.ARRAY_BUFFER = "ARRAY_BUFFER";
        fakeDrawHandler.draw = jasmine.createSpy("draw"); 
        fakeGl.createBuffer = jasmine.createSpy("createBuffer").andReturn(fakeVertexPositionBuffer);
        fakeGl.bindBuffer = jasmine.createSpy("bindBuffer");
        fakeGl.bufferData = jasmine.createSpy("bufferData");
        drawable = new Drawable(fakeGl, fakeDrawHandler, fakeDrawData);               
    });

    it("draws with draw handler", function() {        
        drawable.draw();
        expect(fakeDrawHandler.draw).toHaveBeenCalledWith(fakeDrawData);
    });

    it("creates vertex buffer", function() {            
    	expect(fakeGl.createBuffer).toHaveBeenCalled();
    });

    it("binds buffer", function() {    	
    	expect(fakeGl.bindBuffer).toHaveBeenCalledWith(fakeGl.ARRAY_BUFFER, fakeVertexPositionBuffer);
    });

    it("buffers data", function() {
    	floatVertices = new Float32Array(fakeDrawData.vertices);    	
    	expect(fakeGl.bufferData).toHaveBeenCalledWith(fakeGl.ARRAY_BUFFER, floatVertices, fakeGl.STATIC_DRAW);
    });
});