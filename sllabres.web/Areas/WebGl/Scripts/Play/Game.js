(function(window, three) {
function Game() {
	var windowSize = 600;
	var renderer = new three.WebGLRenderer({antialias:true}),
		scene = new three.Scene(),
		camera = new three.PerspectiveCamera( 75, windowSize / windowSize, 1, 20000),
		clock = new three.Clock();

    function run() {
    	setup();
    	update();    	
    }

    function setup() {
    	var axes = new three.AxisHelper();
		axes.scale.set( 1, 1, 1 );
		scene.add( axes );
    	renderer.setSize( windowSize, windowSize );
    	renderer.setClearColor(new three.Color(0x000000));
    	window.document.body.appendChild( renderer.domElement );    
    	controls = new three.FirstPersonControls( camera );
    			
    	camera.position.set(0,150,1000);
		//camera.lookAt(axes.position);	
    	new Floor(three, scene).addFloor();
    }

    function update() {
    	var delta = clock.getDelta();	
    	controls.update(delta);
    	renderer.render(scene, camera);
    	window.requestAnimationFrame(update);
    }

    return {
        run : run
    };
}

function Floor(three, scene) {
	function addFloor() {		
		var floorTexture = new three.ImageUtils.loadTexture( '../../Content/concrete-texture.jpg' );
		floorTexture.wrapS = floorTexture.wrapT = three.RepeatWrapping; 
		floorTexture.repeat.set( 1, 1 );
		var floorMaterial = new three.MeshBasicMaterial( { map: floorTexture } );
		var floorGeometry = new three.PlaneGeometry(1000, 1000, 2, 2);
		var floor = new three.Mesh(floorGeometry, floorMaterial);		
		floor.doubleSided = false;
		scene.add(floor);
	}

	return {
		addFloor : addFloor
	};
}

window.game = new Game();
})(window, window.THREE);