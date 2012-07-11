var drawService;
var cohesionRule;
var boidHandler;

function init() {
    var gl = document.getElementById("canvas").getContext("experimental-webgl");
    var shaderService = new ShaderService(gl);          
    shaderService.initialise();
    drawService = new DrawService(gl, shaderService, mat4);        
    drawService.initialise();    
    cohesionRule = new CohesionRule(0,0);
    boidFactory = new BoidFactory(gl, drawService, cohesionRule);   
    boidHandler = new BoidHandler(boidFactory, 500);
    tick();
}    

function tick() {
        drawService.setView();                    
        requestAnimFrame(tick);                            
        boidHandler.updateBoids();
}

function BoidHandler(boidFactory, count){
    this.boidFactory = boidFactory;
    this.boidCollection = new Array();
    this.count = count;

    for(i = 0; i<this.count; i++) {
            this.boidCollection.push(this.boidFactory.createBoid());
    }

    this.updateBoids = function() {
        for(i = 0; i<this.count; i++) {
            this.boidCollection[i].update();
        }
    }
}

function BoidFactory(gl,  drawService, cohesionRule) {
    this.gl = gl;
    this.drawService = drawService;
    this.cohesionRule = cohesionRule;

    this.createBoid = function() {
        var drawData = new DrawData();    

        drawData.x = Math.floor((Math.random()*100)-10) / 10;
        drawData.y = Math.floor((Math.random()*100)-10) / 10;
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

        var drawable = new Drawable(this.gl, this.drawService, drawData);

        return new Boid(drawable, this.cohesionRule);
    }
}    