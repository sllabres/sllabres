describe("CohesionRule", function() {
	describe("target is at position (-10,0)", function() {
		it("yaws left when facing PI/2", function() {
        	var cohesionRule = new CohesionRule(-10,0);        
        	expect(cohesionRule.yawDirection(0, 0, Math.PI/2)).toEqual(1);
    	});

    	it("yaws right when facing to the left (3*PI/2)", function() {
        	var cohesionRule = new CohesionRule(-10,0);        
        	expect(cohesionRule.yawDirection(0, 0, 3*Math.PI/2)).toEqual(-1);
    	});

    	it("yaws right when facing to the left (4*PI - 1)", function() {
        	var cohesionRule = new CohesionRule(-10,0);        
        	expect(cohesionRule.yawDirection(0, 0, 4*Math.PI - 1)).toEqual(-1);
    	});
	});
});