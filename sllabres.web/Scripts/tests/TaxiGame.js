(function() {
	var Game = function(renderer) {

		renderer.initiate();

		var run = function() {	
			renderer.render();
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
				requestAnimationFrame : function() { requestAnimationFrameCalled = true },
				render : function() { }
			};
		
		var game = new Game(fakeRenderer);
		game.run();
	    equal(requestAnimationFrameCalled, true);
	});

	test("Running game calls request animation frame with run", function() {
		var returnFunction;

		var fakeRenderer = {
				initiate : function() { },
				requestAnimationFrame : function(functionToCall) { returnFunction = functionToCall },
				render : function() { }
			};

		var game = new Game(fakeRenderer);
		game.run();
		equal(returnFunction, game.run);
	});

	test("Game Initiates renderer when created", function() {
		var rendererInitiated =  false;

		var fakeRenderer = {
				initiate : function() { rendererInitiated = true },
				requestAnimationFrame : function() {},
				render : function() { }
			};

		new Game(fakeRenderer);
		
		equal(rendererInitiated, true);
	});

	test("Game Calls render while running", function() {
		var renderCalled = false;

		var fakeRenderer = {
				initiate : function() { },
				requestAnimationFrame : function() {},
				render : function() { renderCalled = true; }
			};

		new Game(fakeRenderer).run();

		equal(renderCalled, true);
	});
})();