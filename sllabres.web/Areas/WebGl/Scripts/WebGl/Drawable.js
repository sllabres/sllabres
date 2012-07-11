function DrawData() {
        /* contains all data required to draw an object*/
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;    
        this.roll = 0.0;
        this.pitch = 0.0;
        this.yaw = 0.0;
        this.vertices;
        this.mode;
        this.count;        
        this.itemSize;
        this.vertexPositionBuffer;
}

function Drawable(gl, drawHandler, drawData) {
    this.gl = gl;
    this.drawHandler = drawHandler;
    this.drawData = drawData;
    this.vertexPositionBuffer;

    this.drawData.vertexPositionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.drawData.vertexPositionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.drawData.vertices), this.gl.STATIC_DRAW);
    
    this.draw = function() {        
        this.drawHandler.draw(this.drawData);
    }
}