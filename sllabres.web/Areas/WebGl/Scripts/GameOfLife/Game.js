/// Disclaimer: Ashamed to say that in my haste this code was not test driven :(
var drawable;
var drawService;
var gridSize = 1600;
var gridWidth = Math.sqrt(gridSize);

function init() {
	var gl = document.getElementById("canvas").getContext("experimental-webgl");
    var shaderService = new ShaderService(gl);        	
    shaderService.initialise();
    drawService = new DrawService(gl, shaderService, mat4);        
    drawService.initialise();        

    var drawData = new DrawData();    

    drawData.x = -100.0;
    drawData.y = 0.0;
    drawData.z = -200.0;

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

    cells = new RandomSeedGenerator(new DrawWrapper(drawable)).generateSeed(gridSize);
    
    tick();
}    

var cells;

function pause(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
} 

function tick() {

        var grid = new Grid(cells, new NeighbourhoodWatch(gridWidth));
        
        requestAnimFrame(tick);        
        drawService.setView(); 
        cells = grid.update();
    }

function DrawWrapper(drawable) {
    this.draw = function(isAlive, index) {
        if(isAlive) {
            drawable.drawData.x = (((index % gridWidth)) * 2.5) - 50;
            drawable.drawData.y = (Math.round((index / gridWidth)) * 2.5) - 20;
            drawable.draw();        
        }
    }
}

function RandomSeedGenerator(drawService) {
    this.generateSeed = function(gridSize) {
        var cellFactory = new CellFactory(new LiveCellRule(), new DeadCellRule(), drawService); 
        cells = new Array();

        for(var i = 0; i<gridSize; i++) {               
            var liveCell = Math.floor((Math.random()*100)+1);   

            if(liveCell > 40) {         
                cells.push(cellFactory.createLiveCell());
            }   
            else {          
                cells.push(cellFactory.createDeadCell());
            }
        } 

        return cells;   
    }
}