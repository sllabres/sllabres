/*const GLenum POINTS                         = 0x0000;
    const GLenum LINES                          = 0x0001;
    const GLenum LINE_LOOP                      = 0x0002;
    const GLenum LINE_STRIP                     = 0x0003;
    const GLenum TRIANGLES                      = 0x0004;
    const GLenum TRIANGLE_STRIP                 = 0x0005;
    const GLenum TRIANGLE_FAN                   = 0x0006;
*/

function DrawService(gl, shaderService, mat4) {
    this.glService = gl;
    this.shaderService = shaderService;    
    this.glMatrix = mat4;
    this.projectionMatrix = this.glMatrix.create();
    this.modelViewMatrix = this.glMatrix.create();    

    this.initialise = function() {
        this.glService.clearColor(0.0, 0.0, 0.0, 1.0);
        this.glService.enable(this.glService.DEPTH_TEST);
    }    

    this.setView = function() {
        this.glService.viewport(0,0,500,500);
        this.glService.clear(this.glService.COLOR_BUFFER_BIT | this.glService.DEPTH_BUFFER_BIT);
        this.glMatrix.perspective(45, 500 / 500, 0.1, 100.0, this.projectionMatrix);                
    }

    this.draw = function(drawData) {        
        var modelViewCopy = this.glMatrix.create();
        this.glMatrix.set(this.modelViewMatrix, modelViewCopy);
        this.drawItem(drawData, modelViewCopy);
    }

    this.drawItem = function(drawData, viewMatrix) {
        this.glMatrix.identity(viewMatrix);
        this.glMatrix.translate(viewMatrix, [drawData.x,drawData.y, drawData.z]); 
                
        mat4.rotate(viewMatrix, drawData.pitch, [1, 0, 0]);
        mat4.rotate(viewMatrix, drawData.roll, [0, 1, 0]);
        mat4.rotate(viewMatrix, drawData.yaw, [0, 0, 1]);        

        this.glService.bindBuffer(this.glService.ARRAY_BUFFER, drawData.vertexPositionBuffer);
        this.glService.vertexAttribPointer(this.shaderService.vertexPositionAttribute, drawData.itemSize, this.glService.FLOAT, false, 0, 0);       
        this.glService.uniformMatrix4fv(this.shaderService.projectionMatrixUniform, false, this.projectionMatrix);
        this.glService.uniformMatrix4fv(this.shaderService.modelViewMatrixUniform, false, viewMatrix);
        this.glService.drawArrays(drawData.mode, 0, drawData.count);
    }
}