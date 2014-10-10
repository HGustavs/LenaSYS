
var camera, scene, renderer, rendererDOMElement;
var object, line;
var acanvas = document.getElementById("container");
var material, goalMaterial;
var rotateObjects = false;
var backsideCulling = false;

var startString = '{"vertice":[{"x":"400","y":"400","z":"0"},{"x":"-400","y":"-400","z":"0"},{"x":"400","y":"-400","z":"0"}],"triangles":["0,1,2"]}';
var goal = '{"vertice":[{"x":"400","y":"400","z":"0"},{"x":"-400","y":"-400","z":"0"},{"x":"400","y":"-400","z":"0"},{"x":"400","y":"-400","z":"-800"}],"triangles":["0,1,2","1,2,3"]}';
var goalObject;

function setup()
{
	$.getScript("//cdnjs.cloudflare.com/ajax/libs/three.js/r68/three.min.js", function(){
	

	   	acanvas = document.getElementById('container');
//			context = canvas.getContext("2d");
		//setInterval("tick();",50);
		
		AJAXService("GETPARAM",{ },"PDUGGA");
		//	showDuggaInfoPopup();

		acanvas.addEventListener('click', toggleRotate, false);

   		// Here you can use anything you defined in the loaded script
	});
	
}

function returnedDugga(data)
{
	  if(data['debug']!="NONE!") alert(data['debug']);

		if(data['param']=="UNK"){
				alert("UNKNOWN DUGGA!");
		}else{

			  var studentPreviousAnswer="";

	init();
	
	populateLists(startString);
	createGoalObject(goal);
	
	animate();

						  
		}	  
}
function submbutton() {
	var answerString = "";
	//var verticeObject=new Object;
	verticeArray = new Array();
	var verticeList = document.getElementById("verticeList");

	for (var i = 0; i < verticeList.childNodes.length; i++) {
		var vertex = new Object;
		vertex.x = verticeList.childNodes[i].childNodes[1].value;
		vertex.y = verticeList.childNodes[i].childNodes[3].value;
		vertex.z = verticeList.childNodes[i].childNodes[5].value;
		/*console.log("i"+i+":"+vertex.x);
		console.log("i"+i+":"+vertex.y);
		console.log("i"+i+":"+vertex.z);*/
		//console.log("i"+i+":"+verticeList.childNodes[i].childNodes[0]);
		verticeArray.push(vertex);
	}

	//var trianglesObject=new Object;
	var trianglesArray = new Array();
	var triangleList = document.getElementById("triangleList");
	for (var i = 0; i < triangleList.options.length; i++) {
		trianglesArray.push(triangleList.options[i].value);
	}
	var answer = new Object();
	answer.vertice = verticeArray;
	answer.triangles = trianglesArray;
	answerString = JSON.stringify(answer);
	console.log(answerString);
}

function populateLists(startString) {
	var startValues = JSON.parse(startString);
	populateVerticeList(startValues.vertice);
	populateTrianlgesList(startValues.triangles);
	updateGeometry();
}

function populateVerticeList(vertice) {
	console.log(vertice);
	var verticeList = document.getElementById("verticeList");
	for (var i = 0; i < vertice.length; i++) {
		addVertexToVerticeList(vertice[i].x, vertice[i].y, vertice[i].z);
	}
}

function populateTrianlgesList(triangles) {
	console.log(triangles);
	var triangleList = document.getElementById("triangleList");
	for (var i = 0; i < triangles.length; i++) {
		triangleList.innerHTML += "<option value='" + triangles[i] + "'>" + triangles[i] + "</option>";
	}
}

function deleteTriangle() {
	var elSel = document.getElementById('triangleList');
	var i = 0;
	for ( i = elSel.length - 1; i >= 0; i--) {
		if (elSel.options[i].selected) {
			elSel.remove(i);
		}
	}
	updateGeometry();
}

function moveTriangleUp() {
	var elSel = document.getElementById('triangleList');
	var ind = elSel.selectedIndex;
	var val;
	var tex;

	if (elSel.selectedIndex > 0) {

		val = elSel.options[ind].value;
		tex = elSel.options[ind].text;

		elSel.options[ind].value = elSel.options[ind - 1].value;
		elSel.options[ind].text = elSel.options[ind - 1].text;

		elSel.options[ind - 1].value = val;
		tex = elSel.options[ind - 1].text = tex;

		elSel.selectedIndex--;
	}
	updateGeometry();
}

function moveTriangleDown() {
	var elSel = document.getElementById('triangleList');
	var ind = elSel.selectedIndex;
	var val;
	var tex;

	if (elSel.selectedIndex < elSel.length - 1) {

		val = elSel.options[ind].value;
		tex = elSel.options[ind].text;

		elSel.options[ind].value = elSel.options[ind + 1].value;
		elSel.options[ind].text = elSel.options[ind + 1].text;

		elSel.options[ind + 1].value = val;
		tex = elSel.options[ind + 1].text = tex;

		elSel.selectedIndex++;
	}
	updateGeometry();

}

function updateVerticeDropdown(selectList) {
	selectList.innerHTML = "";
	var verticeList = document.getElementById("verticeList");
	for (var i = 0; i < verticeList.childNodes.length; i++) {
		var newOption = document.createElement('option');
		newOption.value = i;
		newOption.innerHTML = i;
		newOption.onclick = function(ev) {
			ev.stopPropagation();
			return false;
		};
		selectList.appendChild(newOption);
	}

	/*var tv1=document.getElementById("tv1");
	var tv2=document.getElementById("tv1");
	var tv3=document.getElementById("tv1");*/
	//selectList=ev.target;
	//console.log(selectList);
}

function newTriangle() {
	var tv1 = document.getElementById("tv1");
	var tv2 = document.getElementById("tv2");
	var tv3 = document.getElementById("tv3");
	//if(tv1.options[tv1.selectedIndex].value!=undefined && tv2.options[tv2.selectedIndex].value!=undefined && tv3.options[tv3.selectedIndex].value!=undefined){
	if (tv1.selectedIndex != -1 && tv2.selectedIndex != -1 && tv3.selectedIndex != -1) {
		console.log("tv defined");
		/*
		 SPARA:
		 var vertex1=document.getElementById("verticeList").childNodes[tv1.selectedIndex].childNodes[1].value+
		 document.getElementById("verticeList").childNodes[tv1.selectedIndex].childNodes[3].value+
		 document.getElementById("verticeList").childNodes[tv1.selectedIndex].childNodes[5].value;*/

		document.getElementById("triangleList").innerHTML += "<option value='" + tv1.selectedIndex + "," + tv2.selectedIndex + "," + tv3.selectedIndex + "'>" + tv1.selectedIndex + "," + tv2.selectedIndex + "," + tv3.selectedIndex + "</option>";
	} else {
		console.log("tv undefined");
	}

	updateGeometry();
	//console.log("tv1:"+tv1.options[tv1.selectedIndex].value);
	//console.log("tv1:"+tv1.selectedIndex);
}

function newVertex() {
	var verticeList = document.getElementById('verticeList');
	var vertexX = document.getElementById('vertexX');
	var vertexY = document.getElementById('vertexY');
	var vertexZ = document.getElementById('vertexZ');
	var vertexMsg = document.getElementById('vertexMsg');

	if (checkVertexInput(vertexX.value, vertexY.value, vertexZ.value)) {
		addVertexToVerticeList(vertexX.value, vertexY.value, vertexZ.value);
	}

	/*vertexMsg.innerHTML="";
	 //console.log();
	 if((vertexX.value!='' && !isNaN(vertexX.value)) && (vertexY.value!='' && !isNaN(vertexY.value)) && (vertexZ.value!='' && !isNaN(vertexZ.value))){
	 //verticeList.innerHTML+="<option value='"+vertexX.value+","+vertexY.value+","+vertexZ.value+"'>"+vertexX.value+","+vertexY.value+","+vertexZ.value+"</option>";

	 addVertexToVerticeList(vertexX.value,vertexY.value,vertexZ.value);
	 } else {
	 vertexMsg.innerHTML="Incorrect input";
	 }*/
}

function checkVertexInput(vertexX, vertexY, vertexZ) {
	var vertexMsg = document.getElementById('vertexMsg');
	vertexMsg.innerHTML = "";
	if ((vertexX != '' && !isNaN(vertexX)) && (vertexY != '' && !isNaN(vertexY)) && (vertexZ != '' && !isNaN(vertexZ))) {
		return true;
	} else {
		vertexMsg.innerHTML = "Incorrect input";
		return false;
	}
}

function vertexUpdate() {
	var vertexMsg = document.getElementById('vertexMsg');
	vertexMsg.innerHTML = "";

	var verticeList = document.getElementById("verticeList");

	for (var i = 0; i < verticeList.childNodes.length; i++) {
		var incorrectInputFound = false;
		if ((verticeList.childNodes[i].childNodes[1].value == '' || isNaN(verticeList.childNodes[i].childNodes[1].value)) || (verticeList.childNodes[i].childNodes[3].value == '' || isNaN(verticeList.childNodes[i].childNodes[3].value)) || (verticeList.childNodes[i].childNodes[5].value == '' || isNaN(verticeList.childNodes[i].childNodes[5].value))) {
			incorrectInputFound = true;
		}
	}

	if (incorrectInputFound) {
		vertexMsg.innerHTML = "Incorrect input in vertice list.<br /> Geometry update failed.";
	} else {
		updateGeometry();
	}

}

function addVertexToVerticeList(vertexX, vertexY, vertexZ) {
	var verticeList = document.getElementById('verticeList');
	var newVertxLi = document.createElement('li');
	newVertxLi.innerHTML = 'x:<input type="text" value="' + vertexX + '" style="width:40px;" onchange="vertexUpdate();" />' + ' y:<input type="text" value="' + vertexY + '" style="width:40px;" onchange="vertexUpdate();" />' + ' z:<input type="text" value="' + vertexZ + '" style="width:40px;" onchange="vertexUpdate();" />' + '<button onclick="moveVertexUp(this.parentNode);">&uarr;</button>' + '<button onclick="moveVertexDown(this.parentNode);">&darr;</button>' + '<button onclick="deleteVertex(this.parentNode);">X</button>';
	verticeList.appendChild(newVertxLi);
}

function deleteVertex(vertexLi) {
	var vertexIndex = $(vertexLi).index() + vertexLi.parentNode.start;
	//console.log( 'Index = ' + n );
	var triangleList = document.getElementById('triangleList');
	var vertexInUse = false;
	for (var i = 0; i < triangleList.options.length; i++) {
		var vertices = triangleList.options[i].value.split(',');
		console.log(vertices[0] + " " + vertices[1] + " " + vertices[2]);
		if (vertices[0] == vertexIndex || vertices[1] == vertexIndex || vertices[2] == vertexIndex) {
			vertexInUse = true;
		}
	}
	if (!vertexInUse) {
		document.getElementById("vertexMsg").innerHTML = "";
		vertexLi.parentNode.removeChild(vertexLi);
		updateGeometry();
	} else {
		console.log('in use');
		document.getElementById("vertexMsg").innerHTML = "Kan inte ta bort. Hörnet används.";
	}

}

function moveVertexUp(vertexLi) {
	var vertexLiIndex = $(vertexLi).index() + vertexLi.parentNode.start;
	console.log(vertexLiIndex);
	console.log(vertexLiIndex + " " + vertexLi.parentNode.childNodes.length);
	if (vertexLiIndex > vertexLi.parentNode.start) {
		var vertexLiAbove = vertexLi.parentNode.childNodes[vertexLiIndex - 1];
		vertexLi.parentNode.insertBefore(vertexLi, vertexLiAbove);
	}
	vertexUpdate();
}

function moveVertexDown(vertexLi) {
	var vertexLiIndex = $(vertexLi).index() + vertexLi.parentNode.start;
	console.log(vertexLiIndex + " " + vertexLi.parentNode.childNodes.length);
	if (vertexLiIndex < vertexLi.parentNode.childNodes.length - 1) {
		var vertexLiBelow = vertexLi.parentNode.childNodes[vertexLiIndex + 1];
		vertexLi.parentNode.insertBefore(vertexLiBelow, vertexLi);
	}
	vertexUpdate();
}

function toggleRotate() {
	if (rotateObjects)
		rotateObjects = false;
	else
		rotateObjects = true;
}

function toggleWireframeMode() {
	if (material.wireframe)
		material.wireframe = false;
	else
		material.wireframe = true;
}


function init() {

	renderer = new THREE.WebGLRenderer();
	
	//acanvas.appendChild(renderer.domElement);
	rendererDOMElement = renderer.domElement;
	rendererDOMElement.width = $("#content").width()-250;
	rendererDOMElement.height = $("#content").width()-250;
	console.log(rendererDOMElement.width + " " + rendererDOMElement.height);
	renderer.setSize(rendererDOMElement.width, rendererDOMElement.height);
	//document.body.appendChild( rendererDOMElement );
	acanvas.appendChild(rendererDOMElement);

	camera = new THREE.PerspectiveCamera(60, rendererDOMElement.width / rendererDOMElement.height, 1, 10000);

	camera.position.z = 1000;

	scene = new THREE.Scene();

	scene.add(camera);

	// create a point light
	/*
	var pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.x = 200;
	pointLight.position.y = 200;
	pointLight.position.z = 330;
	//pointLight.castShadow = true;
	//pointLight.shadowCameraVisible = true;
	scene.add(pointLight);*/

	//var bump512 = THREE.ImageUtils.loadTexture( 'includes/bump512_2.gif' );
	//var jg = THREE.ImageUtils.loadTexture( 'includes/jg.gif' );
	/*texture.anisotropy = renderer.getMaxAnisotropy();
	 texture.magFilter=THREE.LinearFilter;
	 texture.minFilter=THREE.LinearMipMapLinearFilter;*/
	/*bump512.wrapT = THREE.RepeatWrapping;
	 bump512.wrapS = THREE.RepeatWrapping;
	 bump512.repeat.set(4,4);*/
	material = new THREE.MeshBasicMaterial({
		wireframe : false,
		wireframeLinewidth : 10,
		vertexColors : THREE.FaceColors,
		side : THREE.DoubleSide
	});
	goalMaterial = new THREE.MeshBasicMaterial({
		wireframe : true,
		wireframeLinewidth : 10,
		vertexColors : THREE.FaceColors,
		side : THREE.DoubleSide
	});
	//material = new THREE.MeshBasicMaterial( {  color: 0x000000,
	/* ambient : 0xffffff,
	emissive : 0x000000,
	specular : 0xffffff,
	shininess : 30,
	bumpMap : bump512,
	map: bump512,
	metal: false,
	perPixel : true,*/
	//                                          wireframe: true, wireframeLinewidth: 10, side: THREE.DoubleSide } );
/*
	var geom = new THREE.Geometry();
	var v1 = new THREE.Vector3(-300,-300,0);
	var v2 = new THREE.Vector3(300,-300,0);
	var v3 = new THREE.Vector3(-300,300,0);

	var v4 = new THREE.Vector3(300,300,0);
	var v5 = new THREE.Vector3(100,500,800);
	var v6 = new THREE.Vector3(100,500,800);

	geom.vertices.push(v1);
	geom.vertices.push(v2);
	geom.vertices.push(v3);
	geom.vertices.push(v4);*/

	//geom.faces.push( new THREE.Face3( 0, 1, 2) );
	//geom.faces.push( new THREE.Face3( 1, 3, 2) );
	//geom.doubleSided=true;
	//geom.computeFaceNormals();

	//solid_material =  new THREE.MeshBasicMaterial( { color: 0xff0000 });
	//object = new THREE.Mesh( new THREE.CubeGeometry( 100, 100,100 ), [ new THREE.MeshBasicMaterial( { color: 0xff0000 } ), wireframe_material ] );
	//object = new THREE.Mesh( geom, material );
	//object = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );
	//object = new THREE.Mesh( geom, [new THREE.MeshLambertMaterial({color:0xCC0000}),wireframe_material] );
	/*object.geometry.dynamic=true;
	object.doubleSided=true;
	console.log(object.doubleSided); //=true;
	object.flipSided=true;
	console.log(object.flipSided); //=true;*/
	//object.position.z = -100;//move a bit back - size of 500 is a bit big
	//object.rotation.y = -Math.PI * .5;//triangle is pointing in depth, rotate it -90 degrees on Y

	//scene.add(object);

	// add ambient lighting
	var ambientLight = new THREE.AmbientLight(0xcccccc);
	scene.add(ambientLight);

	//Draw coords
	var lineMat = new THREE.LineBasicMaterial({
		color : new THREE.Color(0xff0000),
		opacity : 1,
		linewidth : 3
	});

	var lineGeom = new THREE.Geometry();
	//X
	lineGeom.vertices.push(new THREE.Vector3(0, 0, 0));
	lineGeom.vertices.push(new THREE.Vector3(200, 0, 0));
	lineGeom.vertices.push(new THREE.Vector3(190, -10, 0));
	lineGeom.vertices.push(new THREE.Vector3(200, 0, 0));
	lineGeom.vertices.push(new THREE.Vector3(190, 10, 0));
	lineGeom.vertices.push(new THREE.Vector3(200, 0, 0));

	//Y
	lineGeom.vertices.push(new THREE.Vector3(0, 0, 0));
	lineGeom.vertices.push(new THREE.Vector3(0, 200, 0));
	lineGeom.vertices.push(new THREE.Vector3(-10, 190, 0));
	lineGeom.vertices.push(new THREE.Vector3(0, 200, 0));
	lineGeom.vertices.push(new THREE.Vector3(10, 190, 0));
	lineGeom.vertices.push(new THREE.Vector3(0, 200, 0));

	//Z
	lineGeom.vertices.push(new THREE.Vector3(0, 0, 0));
	lineGeom.vertices.push(new THREE.Vector3(0, 0, 200));
	lineGeom.vertices.push(new THREE.Vector3(-10, -10, 190));
	lineGeom.vertices.push(new THREE.Vector3(0, 0, 200));
	lineGeom.vertices.push(new THREE.Vector3(10, 10, 190));

	line = new THREE.Line(lineGeom, lineMat);
	scene.add(line);

	/*lineGeom = new THREE.Geometry();
	 lineGeom.vertices.push( new THREE.Vector3( 200, 0, 0) );*/

	/*
	 faceMaterial = new THREE.MeshFaceMaterial();

	 textMaterialFront = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );
	 textMaterialSide = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } );
	 textGeo = new THREE.TextGeometry( "Test", {
	 size: 10,
	 height: 7,
	 curveSegments: 6,
	 font: "helvetiker",
	 weight: "normal",
	 style: "normal",
	 material:0,
	 extrudeMaterial:1,
	 bevelThickness: 0,
	 bevelSize:0,
	 bevelEnabled:false
	 });

	 textGeo.materials = [ textMaterialFront, textMaterialSide ];
	 //textGeo.materials = textMaterialFront;

	 textGeo.computeBoundingBox();
	 textGeo.computeVertexNormals();
	 textMesh1 = new THREE.Mesh( textGeo, faceMaterial );
	 //scene.add(textMesh1);
	 //window.addEventListener( 'resize', onWindowResize, false );
	 */
		
		
}

function createGoalObject(goalObjectDataString) {
	var goalObjectData = JSON.parse(goalObjectDataString);
	var geom = new THREE.Geometry();
	for (var i = 0; i < goalObjectData.vertice.length; i++) {
		geom.vertices.push(new THREE.Vector3(goalObjectData.vertice[i].x, goalObjectData.vertice[i].y, goalObjectData.vertice[i].z));
	}
	for (var i = 0; i < goalObjectData.triangles.length; i++) {
		var vertices = goalObjectData.triangles[i].split(',');
		geom.faces.push(new THREE.Face3(vertices[0], vertices[1], vertices[2]));
	}
	geom = addColorsToGeometry(geom);
	goalObject = new THREE.Mesh(geom, goalMaterial);
	scene.add(goalObject);
	//populateVerticeList(goalObjectData.vertice);
	//populateTrianlgesList(goalObjectData.triangles);
	//var vertice=goalObjectData.
}

function updateGeometry() {
	var verticeList = document.getElementById('verticeList');
	if (verticeList.childNodes.length > 2) {
		document.getElementById("vertexMsg").innerHTML = "";
		var triangleList = document.getElementById('triangleList');
		var geom = new THREE.Geometry();
		//var v1 = new THREE.Vector3(-300,-300,0);
		//geom.vertices.push(v1);
		//var elSel = document.getElementById('operations');

		//oplist=new Array();
		//console.log("111");
		for (var i = 0; i < verticeList.childNodes.length; i++) {
			var x = verticeList.childNodes[i].childNodes[1].value;
			var y = verticeList.childNodes[i].childNodes[3].value;
			var z = verticeList.childNodes[i].childNodes[5].value;
			//console.log(x+" "+y+" "+z);
			geom.vertices.push(new THREE.Vector3(x, y, z));
		}
		//console.log("222");
		for (var i = 0; i < triangleList.options.length; i++) {
			var vertices = triangleList.options[i].value.split(',');
			//console.log(vertices[0]+" "+vertices[1]+" "+vertices[2]);
			geom.faces.push(new THREE.Face3(vertices[0], vertices[1], vertices[2]));
			//geom.faces.push( new THREE.Face3( 1, 3, 2) );
		}
		geom = addColorsToGeometry(geom);
		scene.remove(object);
		object = new THREE.Mesh(geom, material);
		object.geometry.__dirtyVertices = true;
		scene.add(object);
	} else {
		document.getElementById("vertexMsg").innerHTML = "För få hörn";
	}
	resetRotationForAllObjects();
}

function addColorsToGeometry(geom) {
	var colors = [0x777777, 0xcc0000, 0x00cc00, 0x0000cc, 0x00cccc, 0xcc00cc, 0xcccc00];
	var colorIndex = 0;
	for (var i = 0; i < geom.faces.length; i++) {
		var face = geom.faces[i];
		//face.color.setHex( Math.random() * 0xffffff );
		face.color.setHex(colors[colorIndex]);
		colorIndex++;
		if (colorIndex >= colors.length)
			colorIndex = 0;
	}
	return geom;
}

/*function onWindowResize() {

 camera.aspect = window.innerWidth / window.innerHeight;
 camera.updateProjectionMatrix();

 renderer.setSize( window.innerWidth, window.innerHeight );

 }*/

function rotateAllObjects() {
	
	//console.log(scene.children.length);
	for (var i = 1; i < scene.children.length; i++) {
		scene.children[i].rotation.x += 0.0005;
		scene.children[i].rotation.y += 0.005;
		scene.children[i].rotation.z += 0.00015;
	}
}

function resetRotationForAllObjects() {
	//console.log(scene.children.length);
	for (var i = 1; i < scene.children.length; i++) {
		scene.children[i].rotation.x = 0;
		scene.children[i].rotation.y = 0;
		scene.children[i].rotation.z = 0;
	}
}

function animate() {
	requestAnimationFrame(animate);

	rotateAllObjects();
	
	if (rotateObjects) {
		rotateAllObjects();
	} else {
		resetRotationForAllObjects();
	}
	renderer.render(scene, camera);

}

