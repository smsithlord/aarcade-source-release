function createSceneManager()
{
	// private attributes
	var clock;
	var frustum;
	var raycaster;
	var camera;
	var skyboxPlaneGeometry;
	var skyboxPlaneObject;
	var scene;
	var sceneWidth;
	var sceneHeight;
	var renderer;
	var state = -1;	// -1: uninitialized, 0: paused, 1: initialized, 2: ready
	var sceneContainer;
	var loadingManager;
	var objLoader;
	var textureLoader;
	var textures;
	var screenSaverMode = true;
	var screenSaverTargetYaw;
	var oldClientX = 0;
	var oldClientY = 0;
	var limitFrameSpeeds = {
		"max": 0,
		"30fps": 1 / 30.0,
		"60fps": 1 / 60.0,
		"120fps": 1 / 120.0,
		"144fps": 1 / 144.0
	};
	var mouse3d;
	var hoveredObject;
	var hoveredIntersection;
	var clickedObject;
	var clickedQuaternion;
	var oldMouse;
	var oldCameraPosition;
	var oldCameraRotation;

	var limitFrames = limitFrameSpeeds["max"];
	var lastFrameTime = 0;
	var screenSaverModeTimeout;
	var mouseIsDown = false;
	var hasMouseFocus;
	var initialCameraPitch;
	var gyroEnabled;
	var autoRotate;
	var target;
	var lon;
	var lat;
	var phi;
	var theta;
	var oldLon;
	var lonDirection;
	var minFov;
	var maxFov;

	// private methods
	function mergIntoObject(original, changes)
	{
		if( !!!changes )
			return;

		// combine the default options (default) with the supplied options (changes)
		for( var x in changes )
		{
			if( original.hasOwnProperty(x) )
				original[x] = changes[x];
		}
	}

	function animate()
	{
		if( state !== 2 )
		{
			requestAnimationFrame(animate);
			return;
		}

		var deltaTime;
		var elapsedTime;
		if( limitFrames > 0 )
		{
			elapsedTime = clock.getElapsedTime();
			deltaTime = elapsedTime - lastFrameTime;

			if( lastFrameTime > 0 && deltaTime < limitFrames )
				return;

			lastFrameTime = elapsedTime;//clock.elapsedTime;
		}
		else
			deltaTime = clock.getDelta();

		//var deltaTime = clock.getDelta();

		if( !!oldCameraPosition && (!oldCameraPosition.equals(camera.position) || !oldCameraRotation.equals(camera.rotation)) )
			mouseMove3d();

		oldCameraPosition = camera.position.clone();
		oldCameraRotation = camera.rotation.clone();

		// check for ENTERED / EXITED frustrum
		if( !!frustum )
		{
			frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

			for( var x in scene.children )
			{
				if( !!scene.children[x].userData.blocksLOS )
				{
					//if( frustum.containsPoint(scene.children[x].position) )
					if( frustum.intersectsObject(scene.children[x]) )
					{
						if( !!!scene.children[x].userData.isVisible )
						{
							scene.children[x].userData.isVisible = true;

							if( typeof scene.children[x].onenterfov === "function" )
								scene.children[x].onenterfov.call(scene.children[x]);
						}
					}
					else
					{
						if( !!scene.children[x].userData.isVisible )
						{
							scene.children[x].userData.isVisible = false;

							if( typeof scene.children[x].onexitfov === "function" )
								scene.children[x].onexitfov.call(scene.children[x]);
						}
					}
				}
			}
		}

		if( !gyroEnabled )
		{
			if( !!!target )
				initAutoRotate();

			if( autoRotate && !mouseIsDown)
			{
				console.log(autoRotate);
				if( camera.userData.rotVel.length() == 0 )
				{
					if(oldLon - lon > 0)
						lonDirection = -1;
					else if( oldLon - lon < 0)
						lonDirection = 1;

					lon +=  0.2 * lonDirection;
					oldLon = lon;
					lat = Math.max( - 85, Math.min( 85, lat ) );

					if( screenSaverMode )
					{
						if( screenSaverTargetYaw === undefined )
							screenSaverTargetYaw = lon + 360;
						else if( screenSaverTargetYaw < lon )
						{
							screenSaverTargetYaw = lon + 360;
							if( !!g_nextIsPreloaded )	// FIXME: These are actually defined in the site.html file itself. :S
								cycle(1);
						}
					}
				}
				else
				{
					if(camera.userData.rotVel.y > 0)
						lonDirection = -1;
					else if( camera.userData.rotVel.y < 0)
						lonDirection = 1;

					lon += Math.abs(camera.userData.rotVel.y) * lonDirection;
					lat -= camera.userData.rotVel.x;
				}
			}

			phi = THREE.Math.degToRad( 90 - lat );
			phi += initialCameraPitch;// initial pitch rotation
			theta = THREE.Math.degToRad( lon );

			target.x = Math.sin( phi ) * Math.cos( theta );
			target.y = Math.cos( phi );
			target.z = Math.sin( phi ) * Math.sin( theta );

			camera.lookAt( target );
		}
		else
		{
			camera.rotation.x = 0;//goodPitch;
			camera.rotation.y = 0;//goodYaw;
			camera.rotation.z = 0;//goodRoll;
			camera.rotateY(goodYaw);

			//headerBannerContainer.innerHTML = goodYaw;
			//camera.rotateX(goodPitch - (Math.PI / 2.0));
		}

		var testFov = camera.fov;
		if( (camera.fov > minFov && camera.userData.zoomVel > 0) || (camera.fov < maxFov && camera.userData.zoomVel < 0) )
			testFov -= camera.userData.zoomVel;

		if( testFov != camera.fov )
		{
			camera.fov = testFov;
			camera.updateProjectionMatrix();
		}

		renderer.render(scene, camera);

		for( var x in scene.children )
		{
			if( typeof scene.children[x].animate === "function" )
				scene.children[x].animate.call(scene.children[x], {deltaTime: deltaTime});
		}
		
		requestAnimationFrame(animate);
	}

	function onWindowResize()
	{
		var containerIsWindow = (sceneContainer === window);

		sceneWidth = (containerIsWindow) ? sceneContainer.innerWidth : sceneContainer.offsetWidth;
		sceneHeight = (containerIsWindow) ? sceneContainer.innerHeight : sceneContainer.offsetHeight;

		camera.aspect = sceneWidth / sceneHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(sceneWidth, sceneHeight);
	}

	function hoverObject(object, intersection)
	{
		if( !!hoveredObject )
		{
			if( hoveredObject === object )
			{
				if( typeof hoveredObject.onhover === "function" )
					hoveredObject.onhover.call(hoveredObject, hoveredIntersection);

				return;
			}

			if( typeof hoveredObject.onhoverend === "function" )
				hoveredObject.onhoverend.call(hoveredObject, hoveredIntersection);

			hoveredObject = null;
			hoveredIntersection = null;
		}
		
		if( object.userData.blocksLOS === true )
		{
			hoveredObject = object;
			hoveredIntersection = intersection;

			if( typeof hoveredObject.onhoverstart === "function" )
				hoveredObject.onhoverstart.call(hoveredObject, hoveredIntersection);
		}
	}

	function initAutoRotate()
	{
		target = new THREE.Vector3();
		lon = 90;
		lat = 0;
		phi = 0;
		theta = 0;
		oldLon = 0;
		lonDirection = 1.0;
	}

	function onMouseWheel(e)
	{
		if( (camera.fov > minFov && e.wheelDeltaY > 0) || (camera.fov < maxFov && e.wheelDeltaY < 0) )
		{
			camera.fov -= e.wheelDeltaY * 0.05;
			camera.updateProjectionMatrix();
		}

		e.preventDefault();
		return false;
	}

	function onMouseDown(e)
	{
		clickedObject = hoveredObject;
		clickedQuaternion = camera.quaternion.clone();

		screenSaverMode = false;
		clearTimeout(screenSaverModeTimeout);
		screenSaverModeTimeout = setTimeout(screenSaverModeStart, 3000);

		e.preventDefault();
		renderer.domElement.addEventListener('mousemove', onMouseMove, false );
		renderer.domElement.addEventListener('mouseup', onMouseUp, false );
		mouseIsDown = true;

		// NOTE: The code below is site.html-specific!!
		var elems = document.querySelectorAll(".uiElement");
		for( var i = 0; i < elems.length; i++ )
			elems[i].classList.add("uiElementInvisible");
	}

	function screenSaverModeStart()
	{
		screenSaverMode = true;

		// NOTE: The code below is site.html-specific!!
		var elems = document.querySelectorAll(".uiElement");
		for( var i = 0; i < elems.length; i++ )
			elems[i].classList.add("uiElementInvisible");
	}

	function onMouseMove(e)
	{
		var movementX = 0;
		var movementY = 0;
		if( !!oldClientX && !!oldClientY )
		{
			movementX = (oldClientX - e.clientX) * -1.0;
			movementY = (oldClientY - e.clientY) * -1.0;
		}

		oldClientX = e.clientX;
		oldClientY = e.clientY;
		//var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
		//var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

		lon -= movementX * 0.1;
		lat += movementY * 0.1;
	}

	function screenSaverMouseMove()
	{
		screenSaverMode = false;
		clearTimeout(screenSaverModeTimeout);
		screenSaverModeTimeout = setTimeout(screenSaverModeStart, 3000);

		if( !mouseIsDown )
		{
			// NOTE: The code below is site.html-specific!!
			var elems = document.querySelectorAll(".uiElement");
			for( var i = 0; i < elems.length; i++ )
				elems[i].classList.remove("uiElementInvisible");
		}
	}

	function onMouseUp(e)
	{
		onMouseUpLogic(e, true);
	}

	function onMouseOut(e)
	{
		onMouseUpLogic(e);
	}

	function onMouseUpLogic(e, isManual)
	{
		oldClientX = null;
		oldClientY = null;

		screenSaverMode = false;
		clearTimeout(screenSaverModeTimeout);
		screenSaverModeTimeout = setTimeout(screenSaverModeStart, 3000);

		if( mouseIsDown )
		{
			renderer.domElement.removeEventListener( 'mousemove', onMouseMove );
			renderer.domElement.removeEventListener( 'mouseup', onMouseUp );
			mouseIsDown = false;

			// NOTE: The code below is site.html-specific!!
			var elems = document.querySelectorAll(".uiElement");
			for( var i = 0; i < elems.length; i++ )
				elems[i].classList.remove("uiElementInvisible");

			if( !!clickedObject && clickedObject === hoveredObject && clickedQuaternion.equals(camera.quaternion) && typeof clickedObject.onclick === "function" )
				clickedObject.onclick.call(clickedObject, e);

			clickedObject = null;
			clickedQuaternion = null;
		}
	}

	function onTouchStart(e)
	{
		screenSaverMode = false;
		e.preventDefault();
		var touch = e.touches[ 0 ];
		touchX = touch.screenX;
		touchY = touch.screenY;
	}

	function onTouchMove(e)
	{
		e.preventDefault();
		var touch = e.touches[0];
		lon -= ( touch.screenX - touchX ) * 0.1;
		lat += ( touch.screenY - touchY ) * 0.1;
		touchX = touch.screenX;
		touchY = touch.screenY;
	}

	function resetScreenSaverModeTimeout()
	{
		screenSaverMode = false;
		clearTimeout(screenSaverModeTimeout);
		screenSaverModeTimeout = setTimeout(screenSaverModeStart, 3000);
	}

	function start()
	{
		clock.start();
		animate();
	}

	function mouseMove3d(e)
	{
		if( mouseIsDown )
			return;

		if( !!e )
		{
			oldMouse.x = e.clientX;
			oldMouse.y = e.clientY;
		}

		// Fill with 2D position for now
		mouse3d.x = (oldMouse.x / sceneWidth) * 2 - 1;
		mouse3d.y = -(oldMouse.y / sceneHeight) * 2 + 1;
		mouse3d.z = 0.5;

		// Convert the 2D position to a 3D point
		mouse3d.unproject(camera);

		// Get a look vector from the camera to g_mouse3d
		var direction = new THREE.Vector3();
		direction = mouse3d.sub(camera.position).normalize();

		var rayOrigin = camera.position;
		var rayDirection = direction;

		// check for mouse-over stuff
		raycaster.set(rayOrigin, rayDirection);

		var intersects = raycaster.intersectObjects( scene.children );
		var nearestDistance = Infinity;
		var nearestObject = null;
		var nearestIntersection;
		var testDistance;
		for( var i = 0; i < intersects.length; i++ )
		{
			testDistance = intersects[i].point.distanceTo(camera.position);

			if( testDistance < nearestDistance && !!intersects[i].object.userData && intersects[i].object.userData.blocksLOS === true )
			{
				nearestDistance = testDistance;
				nearestObject = intersects[i].object;
				nearestIntersection = intersects[i];
			}
		}

		if( !!nearestObject )
			hoverObject(nearestObject, nearestIntersection);
		else
		{
			if( !!hoveredObject )
			{
				if( typeof hoveredObject.onhoverend === "function" )
					hoveredObject.onhoverend.call(hoveredObject, hoveredIntersection);

				hoveredObject = null;
				hoveredIntersection = null;
			}
		}
	}

	return {
		// public methods
		onReady: null,
		start: start,
		getTextureLoader: function(){ return textureLoader; },
		getState: function(){ return state; },
		getScene: function(){ return scene; },
		getCamera: function(){ return camera; },
		getSceneWidth: function(){ return sceneWidth; },
		getSceneHeight: function(){ return sceneHeight; },
		getGyroEnabled: function(){ return gyroEnabled; },
		getAutoRotate: function(){ return autoRotate; },
		getRendererDOMElement: function(){ return renderer.domElement; },
		getSceneContainer: function(){ return sceneContainer; },
		getScreenSaverMode: function(){ return screenSaverMode; },
		setAutoRotate: function(val){ autoRotate = val; },
		setScreenSaverMode: function(val){ screenSaverMode = val; },
		resetScreenSaverModeTimeout: resetScreenSaverModeTimeout,
		mergIntoObject: mergIntoObject,//function(original, changes){ return mergIntoObject(original, changes); },
		unhoverAll: function()
		{
			if( !!hoveredObject )
			{
				if( typeof hoveredObject.onhoverend === "function" )
					hoveredObject.onhoverend.call(hoveredObject, hoveredIntersection);
				
				hoveredObject = null;
				hoveredIntersection = null;
			}
		},
		pause: function()
		{
			state = 0;
			clock.stop();
		},
		resume: function()
		{
			state = 2;
			clock.start();
		},
		init: function(options_in)
		{
			if( state !== -1 )
				return;

			// default options
			var options = {
				sceneContainer: window,
				fov: 75,
				minFov: 40,
				maxFov: 90,
				near: 1,
				far: 1000,
				clearColor: 0xffffff,
				clearAlpha: 1,
				antialias: true,
				autoRotate: true,
				initialCameraPitch: Math.PI/12.0,
				onDOMReady: null
			};

			mergIntoObject(options, options_in);

			textures = [];
			hasMouseFocus = false;
			mouse3d = new THREE.Vector3(0, 0, 0);
			oldMouse = {
				x: 0,
				y: 0
			};
			oldCameraPosition = new THREE.Vector3(0, 0, 0);
			oldCameraRotation = new THREE.Vector3(0, 0, 0);
			scene = new THREE.Scene();
			clock = new THREE.Clock();
			frustum = new THREE.Frustum();
			raycaster = new THREE.Raycaster();
			renderer = new THREE.WebGLRenderer({clearColor: options.clearColor, clearAlpha: options.clearAlpha, antialias: options.antialias});
			renderer.domElement.style.display = "none";
			initialCameraPitch = options.initialCameraPitch;
			minFov = options.minFov;
			maxFov = options.maxFov;
			sceneContainer = options.sceneContainer;
			
			autoRotate = options.autoRotate;
			if( autoRotate )
				initAutoRotate();

			loadingManager = new THREE.LoadingManager();
			loadingManager.onStart = function(url, itemsLoaded, itemsTotal)
			{
				//console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
			};

			loadingManager.onLoad = function()
			{
				//console.log( 'Loading complete!');
			};

			loadingManager.onProgress = function(url, itemsLoaded, itemsTotal)
			{
				//console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
			};

			loadingManager.onError = function(url)
			{
				console.log( 'There was an error loading ' + url );
			};

 			objLoader = new THREE.OBJLoader(loadingManager);
			textureLoader = new THREE.TextureLoader(loadingManager);

			state = 1;	// set state to INITIALIZED (1)

			function DOMReady()
			{
				var containerIsWindow = (sceneContainer === window);

				if( containerIsWindow )
				{
					document.getElementsByTagName("html")[0].style.height = "100%";
					document.body.style.height = "100%";
					document.body.style.margin = 0;
					document.body.style.padding = 0;
					document.body.style.overflow = "hidden";
				}

				sceneWidth = (containerIsWindow) ? options.sceneContainer.innerWidth : options.sceneContainer.offsetWidth;
				sceneHeight = (containerIsWindow) ? options.sceneContainer.innerHeight : options.sceneContainer.offsetHeight;
				camera = new THREE.PerspectiveCamera(options.fov, sceneWidth/sceneHeight, options.near, options.far);
				camera.userData.rotVel = new THREE.Vector3();
				camera.userData.zoomVel = 0.0;
				camera.rotation.x = initialCameraPitch;

				renderer.setSize(sceneWidth, sceneHeight);

				if(containerIsWindow)
					document.body.appendChild(renderer.domElement);
				else
					options.sceneContainer.appendChild(renderer.domElement);

				state = 2;	// set state to READY (2)

				if( containerIsWindow )
					window.addEventListener("resize", onWindowResize, false);

				renderer.domElement.addEventListener("mousewheel", onMouseWheel, false);
				renderer.domElement.addEventListener("mousedown", onMouseDown);
				renderer.domElement.addEventListener("mouseout", onMouseOut, false);
				renderer.domElement.addEventListener("mousemove", screenSaverMouseMove, false);
				renderer.domElement.addEventListener("mousemove", mouseMove3d, false);

				renderer.domElement.addEventListener( 'touchstart', onTouchStart, false );
				renderer.domElement.addEventListener( 'touchmove', onTouchMove, false );

				if( typeof this.onReady === "function" )
					this.onReady();
			}

			if (document.readyState === 'complete')
				DOMReady.call(this);
			else
				document.addEventListener("DOMContentLoaded", DOMReady.bind(this));
		},
		disposeTexture: function(textureURL)
		{
			for( var i = 0; i < textures.length; i++ )
			{
				if( textures[i].url === textureURL )
				{
					textures[i].texture.dispose();
					textures.splice(i, 1);
					//console.log("Disposed of texture " + textureURL);
					return;
				}
			}
			//console.log("Could not find texture " + textureURL);
		},
		loadTexture: function(url, callback)
		{
			for( var i = 0; i < textures.length; i++ )
			{
				if( textures[i].url === url )
				{
					callback(url, textures[i].texture);
					return;
				}
			}

			textureLoader.load(url, function(texture)
			{
				textures.push({url: url, texture: texture});
				callback(url, texture);
			}.bind(this),
			undefined, // ONPROGRESS NOT SUPPORTED,
			function(error)
			{
				console.log("Error loading texture.");
			}.bind(this));
		},
		getTexture: function(url)
		{
			for( var i = 0; i < textures.length; i++ )
			{
				if( textures[i].url === url )
					return textures[i].texture;
			}

			return null;
		},
		loadTextureBatch: function(batch, callback)
		{
			if( !!!batch || batch.length === 0 )
			{
				callback();
				return;
			}

			function onTextureLoaded(url, texture)
			{
				var index = -1;
				for( var i = 0; i < batch.length; i++ )
				{
					if( batch[i].url === url )
					{
						index = i;
						break;
					}
				}

				if( index < 0 )
					return;

				batch[index].texture = texture;

				// check if we are finished
				var needsMore = false;
				for( var i = 0; i < batch.length; i++ )
				{
					if( !!!batch[i].texture )
					{
						needsMore = true;
						break;
					}
				}

				if( !needsMore )
					callback();
			}

			for( var i = 0; i < batch.length; i++ )
				this.loadTexture(batch[i].url, onTextureLoaded);
		}
	};
}