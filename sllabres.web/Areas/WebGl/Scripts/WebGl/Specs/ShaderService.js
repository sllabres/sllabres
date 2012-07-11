describe("ShaderService", function() {
	var fakeShaderProgram;
	var fakeGl;
	var shaderService;
	var fakeVertexColorAttribute;
	var fakeVertexPositionAttribute;
	var fakeFragmentShader;		

	beforeEach(function() {
			fakeShaderProgram = "fakeShaderProgram";
			fakeGl = {};
			fakeVertexColorAttribute = "fakeVertexColorAttribute";
			fakeVertexPositionAttribute = "fakeVertexPositionAttribute";		
			fakeFragmentShader = "fakeFragmentShader";		
			fakeGl.linkProgram = jasmine.createSpy("linkProgram");
			fakeGl.attachShader = jasmine.createSpy("attachShader");
			fakeGl.useProgram = jasmine.createSpy("useProgram");
			fakeGl.createShader = jasmine.createSpy("createShader");
			fakeGl.shaderSource = jasmine.createSpy("shaderSource")
			fakeGl.compileShader = jasmine.createSpy("compileShader");
			fakeGl.getUniformLocation = jasmine.createSpy("getUniformLocation");
			fakeGl.createProgram = jasmine.createSpy("createProgram").andReturn(fakeShaderProgram);		
			fakeGl.enableVertexAttribArray = jasmine.createSpy("enableVertexAttribArray");
			fakeGl.getAttribLocation = jasmine.createSpy("getAttribLocation").andReturn(fakeVertexColorAttribute);			
			shaderService = new ShaderService(fakeGl);
		});

	describe("Initialise", function() {	

		it("calls get uniform location for projection matrix", function() {
			shaderService.initialise();
			expect(fakeGl.getUniformLocation).toHaveBeenCalledWith(fakeShaderProgram, "uPMatrix");
		});

		it("calls get uniform location for model view matrix", function() {
			shaderService.initialise();
			expect(fakeGl.getUniformLocation).toHaveBeenCalledWith(fakeShaderProgram, "uMVMatrix");
		});

		it("enables vertex color attribute array", function() {					
			shaderService.initialise();
			expect(fakeGl.enableVertexAttribArray).toHaveBeenCalledWith(fakeVertexColorAttribute);
		});

		/*it("calls get attribute location for vertex color", function() {
			shaderService.initialise();
			expect(fakeGl.getAttribLocation).toHaveBeenCalledWith(fakeShaderProgram, "aVertexColor");
		});*/

		it("enables vertex position attribute array", function(){
			fakeGl.getAttribLocation = jasmine.createSpy("getAttribLocation").andReturn(fakeVertexPositionAttribute);			
			shaderService = new ShaderService(fakeGl);
			shaderService.initialise();
			expect(fakeGl.enableVertexAttribArray).toHaveBeenCalledWith(fakeVertexPositionAttribute);
		});

		it("calls get attribute location for vertex position", function(){
			fakeGl.getAttribLocation = jasmine.createSpy("getAttribLocation").andReturn(fakeVertexPositionAttribute);			
			shaderService = new ShaderService(fakeGl);
			shaderService.initialise();
			expect(fakeGl.getAttribLocation).toHaveBeenCalledWith(fakeShaderProgram, "aVertexPosition");
		});

		it("tells gl to use created program", function() {
			shaderService.initialise();
			expect(fakeGl.useProgram).toHaveBeenCalledWith(fakeShaderProgram);
		});

		it("links program", function() {
			shaderService.initialise();
			expect(fakeGl.linkProgram).toHaveBeenCalledWith(fakeShaderProgram);
		});

		it("attaches fragment shader", function() {
			var fakeFragmentShader = "fragmentShader";
			fakeGl.createShader = jasmine.createSpy("createShader").andReturn(fakeFragmentShader);
			shaderService = new ShaderService(fakeGl);
			shaderService.initialise();
			expect(fakeGl.attachShader).toHaveBeenCalledWith(fakeShaderProgram, fakeFragmentShader);
		});

		it("attaches vertex shader", function() {
			var fakeVertexShader = "vertexShader";
			fakeGl.createShader = jasmine.createSpy("createShader").andReturn(fakeVertexShader);			
			shaderService = new ShaderService(fakeGl);			
			shaderService.initialise();
			expect(fakeGl.attachShader).toHaveBeenCalledWith(fakeShaderProgram, fakeVertexShader);			
		});
	});

	describe("Get Shader", function() {
			it("returns a shader", function() {
				var fakeShader = "fakeShader";				
				fakeGl.createShader = jasmine.createSpy("createShader").andReturn(fakeShader);				
				shaderService = new ShaderService(fakeGl);
				expect(shaderService.getShader()).toEqual(fakeShader);
			});

			it("returns a fragment shader", function() {				
				var fakeFragmentShader = "fragmentShader";
				fakeGl.createShader = jasmine.createSpy("createShader").andReturn(fakeFragmentShader);				
				shaderService = new ShaderService(fakeGl);
				expect(shaderService.getShader()).toEqual(fakeFragmentShader);
			});

			it("creates fragment shader", function() {
				var fakeFragmentShader = "fragmentShader";
				fakeGl.createShader = jasmine.createSpy("createShader").andReturn(fakeFragmentShader);				
				fakeGl.FRAGMENT_SHADER = "FRAGMENT_SHADER";
				shaderService = new ShaderService(fakeGl);
				shaderService.getShader("id", fakeGl.FRAGMENT_SHADER);
				expect(fakeGl.createShader).toHaveBeenCalledWith(fakeGl.FRAGMENT_SHADER);
			});

			it("loads shader with source", function() {
				var fakeFragmentShader = "fragmentShader";
				var source = "shader source code";
				var fakeShaderScript = {};
				fakeShaderScript.textContent = source;

				fakeGl.createShader = jasmine.createSpy("createShader").andReturn(fakeFragmentShader);					
				document.getElementById = jasmine.createSpy("getElementById").andReturn(fakeShaderScript);
				shaderService = new ShaderService(fakeGl);
				shaderService.getShader();
				expect(fakeGl.shaderSource).toHaveBeenCalledWith(fakeFragmentShader, source);
			});

			it("compiles shader", function() {
				var fakeShader = "fakeShader";	
				fakeGl.createShader = jasmine.createSpy("createShader").andReturn(fakeShader);					
				shaderService = new ShaderService(fakeGl);
				shaderService.getShader();
				expect(fakeGl.compileShader).toHaveBeenCalledWith(fakeShader);
			});


			it("creates a vertex shader", function() {
				var fakeVertexShader = "vertexShader";
				fakeGl.createShader = jasmine.createSpy("createShader").andReturn(fakeVertexShader);
				fakeGl.VERTEX_SHADER = "VERTEX_SHADER";
				shaderService = new ShaderService(fakeGl);
				shaderService.getShader("id", fakeGl.VERTEX_SHADER);
				expect(fakeGl.createShader).toHaveBeenCalledWith(fakeGl.VERTEX_SHADER);
			});
	});
});