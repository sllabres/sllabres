
var boidA;
var boidB;
var follow;
var drawService;
var cohesionRule;

function init() {
    var gl = document.getElementById("canvas").getContext("experimental-webgl");
    var shaderService = new ShaderService(gl);          
    shaderService.initialise();
    drawService = new DrawService(gl, shaderService, mat4);        
    drawService.initialise();    
    cohesionRule = new CohesionRule();

    var drawData = new DrawData();    

    drawData.x = 0.0;
    drawData.y = 0.0;
    drawData.z = -50.0;    
    drawData.yaw = 3*Math.PI/2;
    
    drawData.vertices = [
             0.0,  -1.0,  0.0,
            2.0, 0.0,  0.0,
             0.0, 1.0,  0.0
        ];

    drawData.mode = 4;
    drawData.count = 3;
    drawData.itemSize = 3;

    var drawable = new Drawable(gl, drawService, drawData);

    boidA = new Boid(drawable, cohesionRule);    

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    var drawData = new DrawData();    

    drawData.x = 0.0;
    drawData.y = 10.0;    
    drawData.z = -50.0;
    
    drawData.vertices = [
             0.0,  -1.0,  0.0,
            2.0, 0.0,  0.0,
             0.0, 1.0,  0.0
        ];

    drawData.mode = 4;
    drawData.count = 3;
    drawData.itemSize = 3;
    
    follow = new Drawable(gl, drawService, drawData);

    follow.drawData.yaw = Math.PI/2;

    tick();
}    

function tick() { 
        cohesionRule.yTarget = follow.drawData.y;      
        cohesionRule.xTarget = follow.drawData.x; 
        cohesionRule.zTarget = follow.drawData.z; 
        drawService.setView();                    
        requestAnimFrame(tick);                    
        //boidB.update();      
        boidA.update();
        follow.draw();
        
        
        handleKeys();    

        //document.getElementById("currentAngle").innerText = boidA.drawable.drawData.yaw;


        //var angle = Math.atan2(boidB.drawable.drawData.y - boidA.drawable.drawData.y, boidB.drawable.drawData.x - boidA.drawable.drawData.x);        
        
}

var currentlyPressedKeys = {};

    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;

        if (String.fromCharCode(event.keyCode) == "F") {
            filter += 1;
            if (filter == 3) {
                filter = 0;
            }
        }
    }


    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }


    function handleKeys() { 
        if (currentlyPressedKeys[37]) {         
            // Left cursor key         
            follow.drawData.x-=0.5;                          
        }

        if (currentlyPressedKeys[39]) {
            // Right cursor key       
            follow.drawData.x+=0.5;     
        }

        if (currentlyPressedKeys[38]) { 
            // Up cursor key         
            follow.drawData.y+=0.5;       
        }

        if (currentlyPressedKeys[40]) {
            // Down cursor key         
            follow.drawData.y-=0.5;
        }

        if (currentlyPressedKeys[87]) { 
            // Up cursor key         
            follow.drawData.z-=0.5;       
        }

        if (currentlyPressedKeys[83]) {
            // Down cursor key         
            follow.drawData.z+=0.5;
        }
             
    }

    
    