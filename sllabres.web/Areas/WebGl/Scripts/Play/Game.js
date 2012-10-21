var game = (function(three) {
function Game() {
	var run = function() {		
		init();
    	animate();
	}

	var camera, scene, renderer;
    var geometry, material, mesh, clock, floor, spotlight,shape;    

    function init() {

    	clock = new THREE.Clock();        	

        scene = new THREE.Scene();
        

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );        
        document.body.appendChild( renderer.domElement );
        renderer.shadowMapEnabled = true;

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20000 );
        //camera.position.z = 1000;

        camera.position.set(0,-500,1000);
		camera.lookAt(scene.position);

        var axes = new THREE.AxisHelper();
		//axes.scale.set( 1, 1, 1 );
		scene.add( axes );		

        
        
        //controls = new THREE.TrackballControls( camera );

        // spotlight #1 -- yellow, dark shadow
	spotlight = new THREE.SpotLight(0xffffff);
	spotlight.position.set(100,2000,1000);
	//spotlight.shadowCameraVisible = true;	
	//spotlight.shadowCameraFar = 20000;
	spotlight.shadowDarkness =  0.95;
	spotlight.intensity = 1;
	// must enable shadow casting ability for the light
	spotlight.castShadow = true;
	scene.add(spotlight);

	var light = new THREE.AmbientLight( 0x555555 ); scene.add( light );

        // create "light-ball" meshes
	var sphereGeometry = new THREE.SphereGeometry( 20, 32, 32 );
	var darkMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
		
	var wireframeMaterial = new THREE.MeshBasicMaterial( 
		{ color: 0xeeee00, wireframe: false, transparent: true } ); 
	shape = THREE.SceneUtils.createMultiMaterialObject( 
		sphereGeometry, [ darkMaterial, wireframeMaterial ] );
	shape.position = spotlight.position;
	scene.add( shape );

	var cubeGeometry = new THREE.CubeGeometry( 50, 50, 200 );
	var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
	cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
	cube.position.set(100,50,100);
	// Note that the mesh is flagged to cast shadows
	cube.castShadow = true;
	scene.add(cube);

	floor = new Floor(THREE, scene).addFloor();



    }

    function Floor(three, scene) {
		function addFloor() {		
			var floorTexture = new THREE.ImageUtils.loadTexture( '../../Content/ConcreteTexture.png' );
			floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
			floorTexture.wrapS = THREE.RepeatWrapping; 
			floorTexture.repeat.set( 50 , 50 );
			var floorMaterial = new THREE.MeshLambertMaterial( { map: floorTexture } );
			var floorGeometry = new THREE.PlaneGeometry(300, 300, 10, 10);
			var floor = new THREE.Mesh(floorGeometry, floorMaterial);		
			floor.position.y = -0.5;
			floor.doubleSided = false;	
			floor.receiveShadow = true;					
			scene.add(floor);

			return floor;
		}

		return {
			addFloor : addFloor
		};
	}

    function animate() {		    	
        requestAnimationFrame( animate );          

        renderer.render( scene, camera );   
        camera.position.z -= 1;
        camera.position.y += 0.5;

        //controls.update();
        }

	return {
		run : run
	};
}

return new Game();
})(THREE);