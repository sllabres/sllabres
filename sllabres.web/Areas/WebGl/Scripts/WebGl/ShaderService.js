function ShaderService(gl, program) {     
    this.gl = gl;
    this.program = program;
    this.projectionMatrixUniform;
    this.modelViewMatrixUniform;
    this.vertexPositionAttribute;
    this.vertexColorAttribute;

    this.initialise = function() {        
        this.program = this.gl.createProgram();

        var fragmentShader = this.getShader("shader-fs", this.gl.FRAGMENT_SHADER);
        var vertexShader = this.getShader("shader-vs", this.gl.VERTEX_SHADER);        

        this.gl.attachShader(this.program, fragmentShader);
        this.gl.attachShader(this.program, vertexShader);
        this.gl.linkProgram(this.program);
        this.gl.useProgram(this.program);

        this.vertexColorAttribute = this.gl.getAttribLocation(this.program, "aVertexColor");
        this.vertexPositionAttribute = this.gl.getAttribLocation(this.program, "aVertexPosition");
        
        this.gl.enableVertexAttribArray(this.vertexPositionAttribute);        
        //this.gl.enableVertexAttribArray(this.vertexColorAttribute);

        this.projectionMatrixUniform = this.gl.getUniformLocation(this.program, 'uPMatrix');
        this.modelViewMatrixUniform = this.gl.getUniformLocation(this.program, 'uMVMatrix');
    }

    this.getShader = function(id, type) {
        var shader = this.gl.createShader(type);
        var source = this.getShaderSource(id);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        return shader;
    }

    this.getShaderSource = function(id) {
        var shaderScript = document.getElementById(id);

        if (!shaderScript) {
            return null;
        }

        var source = shaderScript.textContent; 
        return source;
    }
}