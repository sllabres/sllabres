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

    function update() {
    }

    function animate() {        
        requestAnimationFrame(animate);

        grid = new Grid(cells, new NeighbourhoodWatch(gridWidth));
        cells = grid.update();

        renderer.render( scene, camera );
        scene = new THREE.Scene();

        //setTimeout(animate, 100);
    }

    animate();

    return {
        update : update
    };

    function DrawWrapper() {
        function draw(isAlive, index, mesh) {
            if(isAlive) {
                mesh = new THREE.Mesh( geometry, material );
                scene.add( mesh );
                var x = index % gridWidth;
                var y = Math.round(index / gridWidth);
                mesh.position.x = (x * 10);
                mesh.position.y = (y * 10);
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