function Game() {
    var gridSize = 2500;
    var gridWidth = Math.sqrt(gridSize);

    var grid = new Grid(new RandomSeedGenerator(new DrawWrapper()).generateSeed(gridSize), new NeighbourhoodWatch(gridWidth));

    var camera, scene, renderer;
    var geometry, material;

    camera = new THREE.PerspectiveCamera( 75, 500 / 500, 1, 10000);
    
    camera.position.x = 250;
    camera.position.y = 250;
    camera.position.z = 350;

    scene = new THREE.Scene();

    geometry = new THREE.CubeGeometry( 10, 10, 0 );
    material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false } );

    renderer = new THREE.CanvasRenderer();    
    renderer.setSize( 500, 500 );
    renderer.setClearColor(new THREE.Color(0x000000))

    document.body.appendChild( renderer.domElement );    

    function animate() {                
        grid.draw();
        grid.update();
        renderer.render( scene, camera );                
        requestAnimationFrame(animate);
    }    

    return {
        animate : animate
    };

    function DrawWrapper() {
        var sceneArray = new Array();

        function draw(isAlive, index, mesh) {

            if(sceneArray[index] == undefined){
                sceneArray[index] = new THREE.Mesh( geometry, material );
            }

            if(isAlive) {                
                scene.add( sceneArray[index] );
                var x = index % gridWidth;
                var y = Math.round(index / gridWidth);
                sceneArray[index].position.x = (x * 10);
                sceneArray[index].position.y = (y * 10);
            }
            else {
                scene.remove( sceneArray[index] );
            }

    }

    return {
        draw : draw
    };
}

}


function RandomSeedGenerator(drawService) {
    this.generateSeed = function(gridSize) {
        var cellFactory = new CellFactory(new LiveCellRule(), new DeadCellRule(), drawService); 
        cells = new Array();

        for(var i = 0; i<gridSize; i++) {               
            var liveCell = Math.floor((Math.random()*100)+1);   

            if(liveCell > 50) {         
                cells.push(cellFactory.createLiveCell());
            }   
            else {          
                cells.push(cellFactory.createDeadCell());
            }
        } 

        return cells;   
    }
}