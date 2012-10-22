(function() {
	var Game = function(renderer) {

		renderer.initiate();

		var run = function() {	
			renderer.requestAnimationFrame(run);	
		}

		return {
			run : run
		};
	}

	module("Game Tests");
	test("Running game calls request animation frame", function() {  
		var requestAnimationFrameCalled = false;	

		var fakeRenderer = {
				initiate : function() { },
				requestAnimationFrame : function() { requestAnimationFrameCalled = true }
			};
		
		var game = new Game(fakeRenderer);
		game.run();
	    equal(requestAnimationFrameCalled, true);
	});

	test("Running game calls request animation frame with run", function() {
		var returnFunction;

		var fakeRenderer = {
				initiate : function() { },
				requestAnimationFrame : function(functionToCall) { returnFunction = functionToCall }
			};

		var game = new Game(fakeRenderer);
		game.run();
		equal(returnFunction, game.run);
	});

	test("Game Initiates renderer when created", function() {
		var rendererInitiated =  false;

		var fakeRenderer = {
				initiate : function() { rendererInitiated = true },
				requestAnimationFrame : function() {}
			};

		new Game(fakeRenderer);
		
		equal(rendererInitiated, true);
	});
})();