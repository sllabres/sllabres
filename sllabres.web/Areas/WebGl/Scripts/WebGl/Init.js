var drawable;
var drawService;

function init() {
	var gl = document.getElementById("canvas").getContext("experimental-webgl");
    var shaderService = new ShaderService(gl);        	
    shaderService.initialise();
    drawService = new DrawService(gl, shaderService, mat4);        
    drawService.initialise();        

    var drawData = new DrawData();    

    drawData.x = -1.0;
    drawData.y = 0.0;
    drawData.z = -7.0;

    drawData.vertices = [
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0
        ];

    drawData.mode = 6;
    drawData.count = 4;
    drawData.itemSize = 3;
    drawable = new Drawable(gl, drawService, drawData);
    
    tick();
}    

function tick() {
        requestAnimFrame(tick);        
        drawService.setView(); 
        drawable.draw();           
    }