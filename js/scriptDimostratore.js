	// Variabili globali
	var scene, camera, renderer, transparentSphere, isRotating = true, sphereClicked = false, centralPoint;
	var livelli = [], nodes, scaleFactor = 1, colorCounter = 0, colorNodes = [], colorTextures = [], colorLines = [], colorLinesPoints = [];
	var initial = true;
	var stageArray = [];
	var clickCoordinates = [];
	var animationBoolean = false;
	var stage = [];
	var stageCounter = 0;
	var stagePrecedente, riga;
	var mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, depthWrite: true })
	var geometry, geometry2, geometry3, geometry4, geometryClick, material, materialClick;
	var mixers =[];
	var vel = 0.02;
	var fullRotation=false;
	var arrayID = [], arrayNodes = [], arrayFlag=[];
	var printValue = "";
	var stats = new Stats();
	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.domElement );

	var sommaFPS=0;
	var NValuesFPS=0;
	 
	// Funzione per inizializzare la scena
	function init() {
		// Creiamo una scena
		scene = new THREE.Scene();
		scene.background = new THREE.TextureLoader().load( "textures/planetgalaxybackround.jpg" );
		var lontananza = 15;
		// Creiamo una telecamera
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, lontananza+15);
		camera.position.z = lontananza;
		camera.position.y = 3;
		camera.lookAt(0,0,0);
		camera.zoom = 1.9;
		camera.updateProjectionMatrix();
		
		document.getElementById("livAtt").innerHTML="LIV. ATTUALE: <b>ROOT</b>";

		// Creiamo un renderizzatore
		renderer = new THREE.WebGLRenderer( { antialias : false} );
		renderer.setPixelRatio( window.devicePixelRatio * 0.9 );
		
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		
		centralPoint = new THREE.Object3D();
		scene.add(centralPoint);
		
		//-------------------------------------------CREAZIONE TEXTURE COLORI--------------------------------------------------
		var textureLoader = new THREE.TextureLoader();
		colorTextures[0]= textureLoader.load("textures/BlueTexture.jpg");
		colorTextures[1]= textureLoader.load("textures/LightBlueTexture.jpg");
		colorTextures[2]= textureLoader.load("textures/GreenTexture.jpg");
		colorTextures[3]= textureLoader.load("textures/YellowTexture.jpg");
		colorTextures[4]= textureLoader.load("textures/RedTexture.jpg");
		
		/*colorNodes[0] = new THREE.MeshLambertMaterial({ color: 0x2D047F });
		colorNodes[1] = new THREE.MeshLambertMaterial({ color: 0x00363E });
		colorNodes[2] = new THREE.MeshLambertMaterial({ color: 0x013F01 });
		colorNodes[3] = new THREE.MeshLambertMaterial({ color: 0x3C3302 });
		colorNodes[4] = new THREE.MeshLambertMaterial({ color: 0x621E00 });*/
		
		colorNodes[0] = 0x0000FF;
		colorNodes[1] = 0x00363E;
		colorNodes[2] = 0x013F01;
		colorNodes[3] = 0x3C3302;
		colorNodes[4] = 0x621E00;
		
		colorLines[0] = new THREE.LineBasicMaterial({ color: 0x0000FF, opacity: 0.75});
		colorLines[1] = new THREE.LineBasicMaterial({ color: 0x00363E, opacity: 0.75});
		colorLines[2] = new THREE.LineBasicMaterial({ color: 0x013F01, opacity: 0.75});
		colorLines[3] = new THREE.LineBasicMaterial({ color: 0x3C3302, opacity: 0.75});
		colorLines[4] = new THREE.LineBasicMaterial({ color: 0x621E00, opacity: 0.75});
		
		colorLinesPoints[0] = 0x0000FF;
		colorLinesPoints[1] = 0x00363E;
		colorLinesPoints[2] = 0x013F01;
		colorLinesPoints[3] = 0x3C3302;
		colorLinesPoints[4] = 0x621E00;


		//--------------------------------------------SFERA TRASPARENTE--------------------------------------------------------
		// Creiamo una sfera da posizionare al centro della scena
		geometry = new THREE.SphereGeometry(1.8, 32, 32);
		geometry2 = new THREE.SphereGeometry(1.79, 32, 32);
		geometry3 = new THREE.SphereGeometry(1.78, 32, 32);
		geometry4 = new THREE.SphereGeometry(1.81, 32, 32);
		geometryClick = new THREE.SphereGeometry(2, 8, 8);

		// Creiamo un materiale trasparente
		material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			transparent: true, // Imposta il materiale come trasparente
			opacity: 0.1, // Imposta il livello di opacità desiderato (0 = completamente trasparente, 1 = opaco)
			depthWrite: true // Impedisci che oggetti dietro la sfera siano nascosti
		});
		materialClick = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			transparent: true, // Imposta il materiale come trasparente
			opacity: 0, // Imposta il livello di opacità desiderato (0 = completamente trasparente, 1 = opaco)
			depthWrite: true // Impedisci che oggetti dietro la sfera siano nascosti
		});

		// Creiamo la mesh della sfera utilizzando il materiale
		transparentSphere = new THREE.Mesh(geometry, material);
		transparentSphere2 = new THREE.Mesh(geometry2, material);			
		transparentSphere3 = new THREE.Mesh(geometry3, material);			
		transparentSphere4 = new THREE.Mesh(geometry4, material);		
		sphereClick = new THREE.Mesh(geometryClick, materialClick);	
		
		centralPoint.add(transparentSphere);
		centralPoint.add(transparentSphere2);
		centralPoint.add(transparentSphere3);
		centralPoint.add(transparentSphere4);
		centralPoint.add(sphereClick);	
		
		
		//----------------------------------LUCI-------------------------------------------------------------------------------
		// Aggiungi una luce ambientale per illuminare la scena
		var ambientLight = new THREE.AmbientLight(0x404040);
		scene.add(ambientLight);

		// Crea una luce direzionale
		var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(5, 10, 1);
		scene.add(directionalLight);
		
		//---------------------------------GRAFO--------------------------------------------------------------------------------
		// Creazione del grafo
		var nodeGeometry = new THREE.SphereGeometry(0.025, 6, 6); // Nodo del grafo
		var nodeMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });

		// Numero di nodi da generare
		var numNodes = 1600;
		nodes = [];
		var lines = [];
		
		// Creazione dei nodi
		for (var i = 0; i < numNodes; i++) {
			var node = new THREE.Mesh(nodeGeometry, nodeMaterial);
			var position = generateRandomCoordinates(1.8);
			node.position.set(position.x, position.y, position.z);
			nodes.push(node);
		}
		
		// Aggiungi i nodi alle sfera principale
		for (var i = 0; i < numNodes; i++) {
			if(i %4 === 0) transparentSphere.add(nodes[i]);
			if(i %4 === 1) transparentSphere2.add(nodes[i]);	
			if(i %4 === 2) transparentSphere3.add(nodes[i]);	
			if(i %4 === 3) transparentSphere4.add(nodes[i]);	
		}
		
		creaArchi(nodes,0.3);
		initial=false;
		
		createLights();

		//-----------------------------------ASSEGNAZIONE IN ARRAY--------------------------------------------------------------
		var nucleo1 = generaNucleo(transparentSphere,0.8);
		//scene.add(nucleo1);
		centralPoint.add(nucleo1);
		stage[0]= [transparentSphere, transparentSphere2, transparentSphere3, transparentSphere4, sphereClick, nucleo1];
		stageArray[stageCounter] = stage;
		
		//-----------------------------------ANIMAZIONI----------------------------------------------------------------
		
		// Gestione del click sulla sfera
		window.addEventListener('mousedown', (event) => {
			const mouse = new THREE.Vector2();
			const raycaster = new THREE.Raycaster();

			// Calcola le coordinate del mouse
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

			// Imposta il raycaster
			raycaster.setFromCamera(mouse, camera);

			// Trova gli oggetti intersecati dal raycaster
			const intersects = raycaster.intersectObjects(scene.children, true);
			
			// Verifica se la sfera è stata cliccata
			for(var t=0; t < stage.length; t++){
				if (intersects.length > 0 && intersects[0].object === (stage[t])[4]) {
		
					clickCoordinates[0] = (stage[t])[4].position.x;
					clickCoordinates[1] = (stage[t])[4].position.y;
					clickCoordinates[2] = (stage[t])[4].position.z;
					sphereClicked = true;
					scaleFactor=1;
					vel = 0.02;
					fullRotation=true;
					colorCounter++;
					stage = [];
					stageCounter++;
					stagePrecedente = stageArray[stageCounter-1];				
					
					for(var i = 0; i<stagePrecedente.length;i++){			//trova sfera clicked
						if(stagePrecedente[i][4].position.x == clickCoordinates[0] && stagePrecedente[i][4].position.y == clickCoordinates[1] && stagePrecedente[i][4].position.z == clickCoordinates[2]){
							riga = i;
							break;
						}
					}
					if(stagePrecedente[i][4].userData.id!=undefined){
						document.getElementById("livAtt").innerHTML="<p>LIV. ATTUALE: <b>"+stageCounter+"</b></p>";
						document.getElementById("navDepth").innerHTML=document.getElementById("navDepth").innerHTML+"<br>"+stagePrecedente[i][4].userData.id;
					}
					else{
						document.getElementById("livAtt").innerHTML="LIV. ATTUALE: <b>"+stageCounter+"</b>";
						document.getElementById("navDepth").innerHTML=document.getElementById("navDepth").innerHTML+"ROOT";
					}
					updateScene(calculateNumberSpheres(stagePrecedente[i][4].userData.id));
					
					//Azzeramento Valori per calcolo FPS Animazione BenchMark
					NValuesFPS=0;
					sommaFPS=0;
					
					makeSphereAnimation();
					//createSphereMixer();
					setTimeout(function() {						
						sphereClicked = false;
						alert("MEDIA FPS ANIMAZIONE: " + (sommaFPS/NValuesFPS));
						mixers = [];	
					}, 13000);
					console.log("Number of Triangles :", renderer.info.render.triangles);
					
				}
			}
		});
		

		//-----------------------------------BOTTONI E FUNZIONALITà----------------------------------------------------
		// Registriamo l'evento per la pressione del tasto "Space"
		document.addEventListener('keydown', function (event) {
			if (event.keyCode === 32) {
				isRotating = !isRotating;
			}
		});
		// Ottieni il riferimento al bottone
		var zoomButtonIn = document.getElementById("zoomButtonIn");
		var zoomButtonOut = document.getElementById("zoomButtonOut");
		
		var zoomCount=0;
		// Aggiungi un gestore di eventi al bottone
		zoomButtonIn.addEventListener("click", function() {
			// Modifica la posizione Z della telecamera
			var zoomAmount = 1; // Modifica questa quantità come desideri
			camera.position.z -= zoomAmount;
			zoomCount += 1;
		});
		zoomButtonOut.addEventListener("click", function() {
			// Modifica la posizione Z della telecamera
			if(zoomCount>0){
				var zoomAmount = 1; // Modifica questa quantità come desideri
				camera.position.z += zoomAmount;
				zoomCount -= 1;
			}
			
		});

		animate();
	}
	
	function creaArchi(nodes, minDist){
		if(initial)
			var lineMaterial = new THREE.LineBasicMaterial({ color: 0x808080, opacity: 0.75});
		else			
			var lineMaterial = colorLines[colorCounter]; // Colore della linea
		// Aggiungi gli archi alla sfera principale
		for(var i=0; i<nodes.length; i++){
			nodoA = nodes[i];
			for(var j = i+1; j < nodes.length; j++){
				nodoB = nodes[j];
				var dx = nodoA.position.x - nodoB.position.x;
				var dy = nodoA.position.y - nodoB.position.y;
				var dz = nodoA.position.z - nodoB.position.z;
				var distance = dx * dx + dy * dy + dz * dz;
				
				if(nodoA.parent === nodoB.parent && distance <= minDist*minDist){		
					var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([nodoA.position, nodoB.position]), lineMaterial);
					nodoA.parent.add(line);
				}
			}

		}

	}
	
	function creaArchiPoints(sfera, points, minDist){
		var linesGeometry = new THREE.BufferGeometry();
			var vertices = [];
			console.log(points);
			// Calcola le linee tra i punti che sono più vicini della distanza di soglia
			for (var i = 0; i < points.length; i++) {
				nodoA = points[i];
				for (var j = i + 1; j < points.length; j++) {
					nodoB = points[j];
					var dx = nodoA.x - nodoB.x;
					var dy = nodoA.y - nodoB.y;
					var dz = nodoA.z - nodoB.z;
					var distance = dx * dx + dy * dy + dz * dz;
					if (distance <= minDist*minDist) {
						vertices.push(points[i].x, points[i].y, points[i].z);
						vertices.push(points[j].x, points[j].y, points[j].z);
					}
				}
			}

			// Imposta gli attributi di posizione per la geometria delle linee
			linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

			// Crea il materiale per le linee
			var lineMaterial = new THREE.LineBasicMaterial({ color: colorLinesPoints[colorCounter] });

			// Crea l'oggetto LineSegments utilizzando la geometria e il materiale
			var lines = new THREE.LineSegments(linesGeometry, lineMaterial);

			// Aggiungi le linee alla scena
			sfera.add(lines);

	}
	
	function updateScene(nSfere){			//modificare per rendere compatibile con valori input da json
		material = new THREE.MeshBasicMaterial({color: 0xffffff,transparent: true, opacity: 0.05, depthWrite: true });
		materialClick = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0, depthWrite: true });			
		
		for(var r=0;r<nSfere;r++){
			var arr=[];
			let sizeS=1+(arrayNodes[r]/1000);
			for(var c=0;c<4;c++){
				
				//arr[c] = new THREE.Mesh(new THREE.SphereGeometry((arrayNodes[r]/300)+c/50, 32, 32), material);
				arr[c] = new THREE.Mesh(new THREE.SphereGeometry(sizeS+c/50, 32, 32), material);
				//arr[c].position.set(clickCoordinates[0],clickCoordinates[1],clickCoordinates[2]-0.01);
				arr[c].position.set(0,0,0);
				addNodes(arr[c], arrayNodes[r]/4, sizeS+c/50); //sfera a cui aggiungere, quantità di nodi, raggio 

				centralPoint.add(arr[c]);
			}
			geometryClick = new THREE.SphereGeometry(sizeS+0.2, 8, 8);

			arr[4] = new THREE.Mesh(geometryClick, materialClick);
			arr[4].userData.id=arrayID[r];
			//arr[4].position.set(arr[0].position.x,arr[0].position.y,arr[0].position.z);
			arr[4].position.set(0,0,0);
			centralPoint.add(arr[4]);
			console.log(arrayFlag);
			if(arrayFlag[r]>0){
				arr[5] = generaNucleo(arr[0], sizeS-0.8);
				for(var ss=0;ss<arrayFlag[r]-1;ss++){
					var a = generaNucleo(arr[5], sizeS/3);
					let position2 = generateRandomCoordinates(sizeS-0.8);
					a.position.set(arr[5].position.x+(position2.x), arr[5].position.y+(position2.y), arr[5].position.z);
					arr[5].add(a);
					
				}
				centralPoint.add(arr[5]);
			}
			
			stage[r] = arr;
		}
		stageArray[stageCounter]=stage;
	}
	
	/*function addNodes(sfera, nNodi, raggio){
	
		var sphereNodes=[];
		var nodeGeometry = new THREE.SphereGeometry(0.025, 5, 5); // Nodo del grafo
		var nodeMaterial = colorNodes[colorCounter-1];
		for (var i = 0; i < nNodi; i++) {
			var node = new THREE.Mesh(nodeGeometry, nodeMaterial);
			var position = generateRandomCoordinates(raggio);
			node.position.set(position.x, position.y, position.z);
			sphereNodes.push(node);
			sfera.add(node);
		}
		colorCounter--;
		creaArchi(sphereNodes,0.3);
		colorCounter++;
		
	}*/
	function addNodes(sfera, nNodi, raggio) {
		var positions = [];
		for (var i = 0; i < nNodi; i++) {
			var position = generateRandomCoordinates(raggio);
			positions.push(position.x, position.y, position.z);
		}
		var nodeGeometry = new THREE.BufferGeometry();
		nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		var nodeMaterial = new THREE.PointsMaterial({ color: colorNodes[colorCounter-1], size: 0.08 });
		var points = new THREE.Points(nodeGeometry, nodeMaterial);
		sfera.add(points);
		// Estrai la geometria e le posizioni dei punti dall'oggetto Points
		var pointsGeometry = points.geometry;
		var pointsPositions = pointsGeometry.attributes.position.array;

		// Creare un array di oggetti Vector3 rappresentanti le posizioni dei punti
		var pointsArray = [];
		for (var i = 0; i < pointsPositions.length; i += 3) {
			var x = pointsPositions[i];
			var y = pointsPositions[i + 1];
			var z = pointsPositions[i + 2];
			pointsArray.push(new THREE.Vector3(x, y, z));
		}
		colorCounter--;
		creaArchiPoints(sfera ,pointsArray, raggio/8);
		colorCounter++;
	}



	function generaNucleo(sphere,dimNucleo){
		var texture = colorTextures[colorCounter];
		var materialSubSphere = new THREE.MeshPhongMaterial({ map: texture })
		
		// Crea una geometria sferica
		var geometrySubSphere = new THREE.SphereGeometry(dimNucleo, 16, 16);

		// Crea una mesh utilizzando la geometria e il materiale
		nucleo = new THREE.Mesh(geometrySubSphere, materialSubSphere);
		nucleo.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
		scene.add(nucleo);
		centralPoint.add(nucleo);
		
		var nuoviNodi=[];
		var nodeGeometry = new THREE.SphereGeometry(0.025, 6, 6); // Nodo del grafo
		var nodeMaterial = colorNodes[colorCounter];
		for (var i = 0; i < 200; i++) {
			var node = new THREE.Mesh(nodeGeometry, nodeMaterial);
			var position = generateRandomCoordinates(dimNucleo);
			node.position.set(position.x, position.y, position.z);
			nuoviNodi.push(node);
			nucleo.add(node);
		}
		
		//creaArchi(nuoviNodi,0.3);
		return nucleo;
	}



	
	// Creazione delle coordinate
	function generateRandomCoordinates(raggio) {
		var u = Math.random(); // Uniformemente distribuito tra 0 e 1
		var v = Math.random(); // Uniformemente distribuito tra 0 e 1

		var theta = 2 * Math.PI * u; // Angolo orizzontale da 0 a 2π
		var phi = Math.acos(2 * v - 1); // Angolo verticale da 0 a π 
			
		var x = Math.sin(phi) * Math.cos(theta); // Calcolo delle coordinate sferiche
		var y = Math.sin(phi) * Math.sin(theta);
		var z = Math.cos(phi);

		// Moltiplica per il raggio della sfera (1.5)
		var radius = raggio;
		x *= radius;
		y *= radius;
		z *= radius;
		return { x, y, z };
	}
	
	function makeSphereAnimation(){
		for(var row=0;row<stage.length;row++){
			for(var column=0;column<6;column++){
				centralPoint.add((stage[row])[column]);
			}
		}
	}
	
	
	function makeSphereChangePosition(){
	centralPoint.rotation.y += vel;
	if(vel>0.001){	vel *= 0.996;		}

		for(var row=0;row<stage.length;row++){
			if(row %4==0){
				for(var column=0;column<6;column++){
					if((stage[row])[column]!=undefined)
						(stage[row])[column].position.x += vel;
				}	
			}
			else if(row%4==1){
				for(var column=0;column<6;column++){
					if((stage[row])[column]!=undefined)
						(stage[row])[column].position.x -= vel;
				}	
			}
			else if(row%4 ==2){
				for(var column=0;column<6;column++){
					if((stage[row])[column]!=undefined)
						(stage[row])[column].position.z += vel;
				}
			}
			else{
				for(var column=0;column<6;column++){
					if((stage[row])[column]!=undefined)
						(stage[row])[column].position.z -= vel;
				}
			}
		}
	}

	let ogg;
	//let grafo=fetch("https://raw.githubusercontent.com/FTocci/TirocinioMagistrale/main/output.json").then(response => {console.log("FETCH COMPLETATO");return response.json()}).then(data=>{ogg=data;});
	let grafo=fetch("output.json").then(response => {console.log("FETCH COMPLETATO");return response.json()}).then(data=>{ogg=data;});
	
	function findNodeById(tree, targetId) {
	  let result = null;

	  function traverse(node) {
		if (node.Node === targetId) {
		  result = node;
		  return;
		}

		if (node.children && node.children.length > 0) {
		  for (const child of node.children) {
			traverse(child);
			if (result) {
			  return;
			}
		  }
		}
	  }

	  traverse(tree);

	  return result;
	}

	function calculateNumberSpheres(idClicked){
			let startNode;
			arrayID=[];
			arrayNodes=[];
			arrayFlag=[];
			if(idClicked===undefined)	startNode = ogg;
			else{
				startNode=findNodeById(ogg, idClicked);
				console.log("ID TROVATO"+startNode.Node);
			}
			startNode.children.forEach(function (node) {
				arrayID.push(node.Node);
				arrayNodes.push(node.NumeroNodi);
				if(node.children.length===0)
					arrayFlag.push(0);
				else
					arrayFlag.push(node.children.length);
			});
			return startNode.children.length;			
	}

	const stars = [];
	const starMaterial = new THREE.PointsMaterial({
	  color: 0xffffff,
	  size: 0.1,
	  opacity: 0.3,
	  sizeAttenuation: true,
	  transparent: true,
	  blending: THREE.AdditiveBlending, 
	});
	let starMaterial2 = new THREE.MeshBasicMaterial({color: 0xffffff,transparent: true, opacity: 0.5, depthWrite: true });

	function createLights(){
		for (let i = 0; i < 500; i++) {
		  const starGeometry = new THREE.SphereGeometry(0.020, 16, 16);
		  const star = new THREE.Mesh(starGeometry, starMaterial2);
		  star.position.x = Math.random() * 25 - 12.5; 
		  star.position.y = Math.random() * 10 - 5; // Posizione y casuale tra -5 e 5
		  star.position.z = Math.random() * 10 - 5; // Posizione z casuale tra -5 e 5
		  stars.push(star);
		  scene.add(star);
		}
	}
	
	function toggleStars() {
		stars.forEach((star) => {
			if(Math.random() > 0.5)
				star.visible = !star.visible;
			//star.material.opacity += ((Math.random() * 0.1) - 0.05);
		});
	}
	
	setInterval(() => {
		toggleStars();
	}, 1250);


	// Funzione per animare la scena
	function animate() {
		
		if (isRotating) {
			// Ruotiamo le sfere solo se isRotating è true
			/* VERSIONE CHE UTILIZZA FUNZIONE SENO E FUNZIONE MODULO
				- Abs: funzione modulo
				- Date().getTime(): fornisce timestamp
				- /2500 determina quanto l'oscillazione varia velocemente (maggiore è il numero, meno è rapida la variazione)
				- /500: [0,1] --> [0,0.002]*/
			for(var r=0;r<stage.length;r++){
				(stage[r])[0].rotation.x += (Math.abs(Math.sin(new Date().getTime() / 3750)))/500;
				(stage[r])[0].rotation.y += 0.002;

				(stage[r])[1].rotation.x += (Math.abs(Math.sin(new Date().getTime() / 4000)))/500;
				(stage[r])[1].rotation.y += 0.0025;

				(stage[r])[2].rotation.x += (Math.abs(Math.sin(new Date().getTime() / 4250)))/500;
				(stage[r])[2].rotation.y += 0.003;
					
				(stage[r])[3].rotation.x += (Math.abs(Math.sin(new Date().getTime() / 4500)))/500;
				(stage[r])[3].rotation.y += 0.0035;
				if((stage[r])[5]!=undefined){
					(stage[r])[5].rotation.x += (Math.abs(Math.sin(new Date().getTime() / 4500)))/500;
					(stage[r])[5].rotation.y += 0.0035;
				}
				
			}
			
		}
		
		if(sphereClicked){
			scaleFactor+=0.0012;
			
			for(var y=0;y<stagePrecedente.length;y++){				//rimozione sfere notClicked
				if(y!=riga){
					centralPoint.remove((stagePrecedente[y])[0]);
					centralPoint.remove((stagePrecedente[y])[1]);
					centralPoint.remove((stagePrecedente[y])[2]);
					centralPoint.remove((stagePrecedente[y])[3]);
					centralPoint.remove((stagePrecedente[y])[4]);
					centralPoint.remove((stagePrecedente[y])[5]);
				}
			}
			
			for(var k=0;k<stagePrecedente[riga].length-1;k++){					//esplosione sfera clicked
				s=stagePrecedente[riga][k];
				for(var z=0;z<s.children.length;z++){
					var child=s.children[z];
					if(child.geometry.type == "SphereGeometry"){
						child.scale.set(child.scale.x*0.98,child.scale.y*0.98,child.scale.z*0.98);								
					}
				}
				s.material.opacity -= 0.00012;
				s.scale.x += 0.1;
				s.scale.y += 0.1;
				s.scale.z += 0.1;
				if(s.material.opacity<0) scene.remove(s);						

			}
			centralPoint.remove(stagePrecedente[riga][5]);					
			
			
		}
		
		if(fullRotation)
			makeSphereChangePosition();

		renderer.render(scene, camera);	
		
		stats.update();
		NValuesFPS++;
		sommaFPS+=stats.fps;
		//console.log(stats.fps);
	
	requestAnimationFrame(animate);
		
	}

	
	// Ridimensionamento della finestra
	window.addEventListener('resize', () => {
		const newWidth = window.innerWidth;
		const newHeight = window.innerHeight;

		camera.aspect = newWidth / newHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(newWidth, newHeight);
	});
	

	// Inizializziamo la scena
	init();