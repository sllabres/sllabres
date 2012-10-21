(function() {
	var Game = function(requestAnimationFrame) {
		var run = function() {
			requestAnimationFrame(run);
		}

		return {
			run : run
		};
	}

	module("Game Tests");
	test("Running game calls request animation frame", function() {  
		var requestAnimationFrameCalled = false;		
		var requestAnimationFrame = function() {
			requestAnimationFrameCalled = true;
		};
		
		var game = new Game(requestAnimationFrame);
		game.run();
	    equal(requestAnimationFrameCalled, true);
	});

	test("Running game calls request animation frame with run", function() {
		var methodPassed;
		var requestAnimationFrame = function(method) {
			methodPassed = method;
		};

		var game = new Game(requestAnimationFrame);
		game.run();
		equal(methodPassed, game.run);
	});
})();