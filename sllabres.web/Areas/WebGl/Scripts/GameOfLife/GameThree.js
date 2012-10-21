"use strict";

function Game() {
    var gridSize = 2500;
    var gridWidth = Math.sqrt(gridSize);

    var grid = new Grid(new RandomSeedGenerator(new DrawWrapper()).generateSeed(gridSize), new NeighbourhoodWatch(gridWidth));

    var camera, scene, renderer;
    var geometry, material;

    var width = window.innerWidth - 50, height = window.innerHeight - 50;

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( width, height );                
    renderer.shadowMapEnabled = true;
    camera = new THREE.PerspectiveCamera( 75, width / height, 1, 20000 );

    //camera = new THREE.PerspectiveCamera( 75, 500 / 500, 1, 10000);
    
    camera.position.x = 270;
    camera.position.y = 270;
    camera.position.z = 450;

    scene = new THREE.Scene();

    var pointLight = new THREE.PointLight(0xffffff);

    // set its position
    pointLight.position.x = 250;
    pointLight.position.y = 250;
    pointLight.position.z = 500;

    // add to the scene
    scene.add(pointLight);

    var light = new THREE.AmbientLight( 0x0000ff ); scene.add( light );

    geometry = new THREE.CubeGeometry( 10, 10, 10 );

    var lamMat = new THREE.MeshLambertMaterial(
    {
      color: 0xffffff,
    wireframe: false
    });

    material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false } );

    //renderer = new THREE.WebGLRenderer();    
    //renderer.setSize( 500, 500 );

    document.body.appendChild( renderer.domElement );    

    function animate() {                
        grid.draw();
        //grid.update();
        renderer.render( scene, camera );
        requestAnimationFrame(animate);
    }    

    function update() {
        grid.update();
        setTimeout(update,100);
    }

    setTimeout(update,100);

    return {
        animate : animate
    };

    function DrawWrapper() {
        var sceneArray = new Array();

        function draw(isAlive, index, mesh) {

            if(sceneArray[index] == undefined){
                sceneArray[index] = new THREE.Mesh( geometry, lamMat );
            }

            if(isAlive) {                
                scene.add( sceneArray[index] );
                var x = index % gridWidth;
                var y = Math.round(index / gridWidth);
                sceneArray[index].position.x = (x * 11);
                sceneArray[index].position.y = (y * 11);
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
        var cells = new Array();

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