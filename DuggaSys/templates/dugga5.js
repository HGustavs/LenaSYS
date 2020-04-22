
//----------------------------------------------------------------------------------
// Globals
//----------------------------------------------------------------------------------
var score = -1;
var dataV;
var DEFAULT_CAMERA_POSITION_Z = 1000;
var	DEFAULT_CAMERA_POSITION_X = 500;
var	DEFAULT_CAMERA_POSITION_Y = 500;

// Help function 
function isInteger(id) {
    return typeof(id) === 'number' &&
            isFinite(id) &&
            Math.round(id) === id;
}


function Vertex(_x, _y, _z) {
    this.x = parseInt(_x, 10);
    this.y = parseInt(_y, 10);
    this.z = parseInt(_z, 10);
}
Vertex.prototype.toString= function() {
    return '('+this.x+', '+this.y+', '+this.z+')';
};

var vertexL = [];
var triangleL = [];
var textureArray = [];

var camera, scene, renderer, rendererDOMElement;
var object, lineR, lineG, lineB;
var light, light1;
var highlightCubes = [];
var acanvas = document.getElementById("container");
var material, goalMaterial;
var rotateObjects = false;
var backsideCulling = false;
var highlightVerticies = true; // Used to highlight vertices in the geometry

// lvl 1
// {"vertice":[{"x":"200","y":"200","z":"0"},{"x":"-400","y":"-400","z":"0"},{"x":"400","y":"-400","z":"0"}],"triangles":["0,1,2"]}
// lvl 2
// {"vertice":[{"x":"200","y":"-300","z":"0"},{"x":"-100","y":"-300","z":"0"},{"x":"-200","y":"100","z":"0"},{"x":"300","y":"0","z":"0"},{"x":"100","y":"400","z":"0"}],"triangles":["0,1,2","0,2,3","3,2,4"]}
// lvl 3
// {"vertice":[{"x":"0","y":"-400","z":"0"},{"x":"-400","y":"0","z":"0"},{"x":"0","y":"400","z":"0"},{"x":"400","y":"0","z":"0"},{"x":"0","y":"0","z":"400"}],"triangles":["0,1,4","1,2,4","2,3,4","3,0,4"]}
var startString = '{"vertice":[],"triangles":[]}';
//var goal = '{"vertice":[{"x":"400","y":"0","z":"0"},{"x":"-400","y":"0","z":"0"},{"x":"400","y":"0","z":"0"},{"x":"400","y":"0","z":"-800"}],"triangles":["0,1,2","1,2,3"]}';

var goalObject;

//----------------------------------------------------------------------------------
// Setup
//----------------------------------------------------------------------------------

function setup() 
{
	$.getScript("//cdnjs.cloudflare.com/ajax/libs/three.js/r68/three.min.js")
	.done( function(script) {
		acanvas = document.getElementById('container');
		renderer = new THREE.WebGLRenderer();
		
		AJAXService("GETPARAM", { }, "PDUGGA");
		acanvas.addEventListener('click', toggleRotate, false);

	})
	.fail(function( jqxhr, settings, exception ) {
	  	console.log(jqxhr);
	  	console.log(settings);
	  	console.log(exception);	    
	});

}

//----------------------------------------------------------------------------------
// returnedDugga: callback from ajax call in setup, data is json
//----------------------------------------------------------------------------------

function returnedDugga(data) 
{
	createTextures();

	dataV = data;

	if (data['debug'] != "NONE!") {alert(data['debug']);}

	if (data['param'] == "UNK") { 
		alert("UNKNOWN DUGGA!");	
	} else {

		//	showDuggaInfoPopup();
		var studentPreviousAnswer = "";
		if (data['answer'] !== null && data['answer'] !== "UNK"){
			var previous = data['answer'].split(' ');
			var prevRaw = previous[3];
			prevRaw = prevRaw.replace(/&quot;/g, '"');
			var prev = prevRaw.split('|');
			vertexL = JSON.parse(prev[0]);
			triangleL = JSON.parse(prev[1]);
			renderVertexTable();
			renderTriangleTable();
		}

		init();
		goalObject = data['param'];
		createGoalObject(goalObject);
		updateGeometry();
		animate();

	}
  // Teacher feedback
	if (data["feedback"] == null || data["feedback"] === "" || data["feedback"] === "UNK") {
      // No feedback
  } else {
      var fb = "<table class='list feedback-list'><thead><tr><th>Date</th><th>Feedback</th></tr></thead><tbody>";
      var feedbackArr = data["feedback"].split("||");
      for (var k=feedbackArr.length-1;k>=0;k--){
        var fb_tmp = feedbackArr[k].split("%%");
        fb+="<tr><td>"+fb_tmp[0]+"</td><td>"+fb_tmp[1]+"</td></tr>";
      } 		
      fb += "</tbody></table>";
      document.getElementById('feedbackTable').innerHTML = fb;		
	  document.getElementById('feedbackBox').style.display = "block";
	  $("#showFeedbackButton").css("display","block");
  }
  displayDuggaStatus(data["answer"],data["grade"],data["submitted"],data["marked"]);
}

function showFacit(param, uanswer, danswer, userStats, files, moment, feedback)
{
	if (userStats != null){
		$("#duggaInfoBox").css("display","none");
		document.getElementById('duggaTime').innerHTML=userStats[0];
		document.getElementById('duggaTotalTime').innerHTML=userStats[1];
		document.getElementById('duggaClicks').innerHTML=userStats[2];
		document.getElementById('duggaTotalClicks').innerHTML=userStats[3];
		$("#duggaStats").css("display","block");
	}
	createTextures();

	ans = JSON.parse(danswer);
	console.log(ans.vertex);
	console.log(ans.triangle);

	// Setup code
	$.getScript("//cdnjs.cloudflare.com/ajax/libs/three.js/r68/three.min.js")
	.done( function( script, textStatus ) {
		acanvas = document.getElementById('container');
		renderer = new THREE.WebGLRenderer();
		acanvas.addEventListener('click', toggleRotate, false);

		// Parse student answer and dugga answer
		var studentPreviousAnswer = "";
		var p = jQuery.parseJSON(param);
		if (uanswer !== null && uanswer !== "UNK"){
			var previous = uanswer.split(' ');
			var prevRaw = previous[3];
			prevRaw = prevRaw.replace(/&quot;/g, '"');
			var prev = prevRaw.split('|');
			vertexL = JSON.parse(prev[0]);
			triangleL = JSON.parse(prev[1]);
			renderVertexTable();
			renderTriangleTable();
		}

    if (renderId != undefined){
        cancelAnimationFrame(renderId);
        renderId=undefined;
    }

		init();
		goalObject = param;
		createGoalObject(goalObject);
		updateGeometry();
		animate();
		toggleRotate();

		//document.getElementById("vertexPaneNumber").innerHTML=vertexL.length;
		if (vertexL.length === ans.vertex) {
			document.getElementById("vertexPaneNumber").style="display:inline-block; line-height: 11px;background-color:green;";
			document.getElementById("vertexPaneNumber").innerHTML+=" = " + ans.vertex;
		} else {
			document.getElementById("vertexPaneNumber").style="display:inline-block; line-height: 11px;background-color:red;";
			document.getElementById("vertexPaneNumber").innerHTML+=" != " + ans.vertex;
		}
		if (triangleL.length === ans.triangle) {
			document.getElementById("trianglePaneNumber").style="display:inline-block; line-height: 11px;background-color:green;";
			document.getElementById("trianglePaneNumber").innerHTML+=" = " + ans.triangle;
		} else {
			document.getElementById("trianglePaneNumber").style="display:inline-block; line-height: 11px;background-color:red;";
			document.getElementById("trianglePaneNumber").innerHTML+=" != " + ans.triangle;
		}

	})
	.fail(function( jqxhr, settings, exception ) {
	  	console.log(jqxhr);
	  	console.log(settings);
	  	console.log(exception);	    
	});

  // Teacher feedback
  var fb = "<textarea id='newFeedback'></textarea><div class='feedback-info'>* grade to save feedback.</div><table class='list feedback-list'><caption>Previous feedback</caption><thead><tr><th>Date</th><th>Feedback</th></tr></thead><tbody>";
  if (feedback !== undefined && feedback !== "UNK" && feedback !== ""){
    var feedbackArr = feedback.split("||");
    for (var k=feedbackArr.length-1;k>=0;k--){
      var fb_tmp = feedbackArr[k].split("%%");
      fb+="<tr><td>"+fb_tmp[0]+"</td><td>"+fb_tmp[1]+"</td></tr>";
    } 		
  }
  fb += "</tbody></table>";
	if (feedback !== undefined){
			document.getElementById('teacherFeedbackTable').innerHTML = fb;
	}

}

function closeFacit(){

}

function toggleControl() 
{
	if (document.getElementById('verticeControl').style.display == 'none') {
		renderVertexTable();
		document.getElementById('verticeControl').style.display = 'block';
		document.getElementById('triangleControl').style.display = 'none';
	} else {
		updateVerticeDropdown() ;
		document.getElementById('verticeControl').style.display = 'none';
		document.getElementById('triangleControl').style.display = 'block';
	}
}


function saveClick()
{
	//console.log("VertecList: " + vertexL);
	//console.log("TriangleList: " + triangleL);
	Timer.stopTimer();
	timeUsed = Timer.score;
	stepsUsed = ClickCounter.score;
	if (querystring['highscoremode'] == 1) {	
		score = Timer.score;
	} else if (querystring['highscoremode'] == 2) {
		score = ClickCounter.score;
	} else {
		score = 0;
	}

	var answerString = "";
	answerString += JSON.stringify(vertexL);
	answerString += "|"+JSON.stringify(triangleL);

	answerString+=" "+screen.width;
	answerString+=" "+screen.height;
	
	answerString+=" "+$(window).width();
	answerString+=" "+$(window).height();
	//console.log(answerString);
	saveDuggaResult(answerString);
}

function reset()
{
	alert("This will remove everything and reset timers and step counters. Giving you a new chance at the highscore.");
	Timer.stopTimer();
	Timer.score=0;
	Timer.startTimer();
	ClickCounter.initialize();

	vertexL = [];
	triangleL = [];

	renderVertexTable();
	renderTriangleTable();
	updateGeometry();
}


function updateVerticeDropdown() 
{
	var options1 = '<select id="tv1" style="width:100%;" onchange="checkTriangleInput();">';
	var options2 = '<select id="tv2" style="width:100%;" onchange="checkTriangleInput();">';
	var options3 = '<select id="tv3" style="width:100%;" onchange="checkTriangleInput();">';

	for (var i=0; i < vertexL.length; i++){
		if (i === 0){
			options1 += '<option selected value="'+ i +'">' + i + '</option>';
			options2 += '<option selected value="'+ i +'">' + i + '</option>';
			options3 += '<option selected value="'+ i +'">' + i + '</option>';
		} else {
			options1 += '<option value="'+ i +'">' + i + '</option>';
			options2 += '<option value="'+ i +'">' + i + '</option>';
			options3 += '<option value="'+ i +'">' + i + '</option>';			
		}
	}
	options1 += '</select>';
	options2 += '</select>';
	options3 += '</select>';

	document.getElementById("tv1").innerHTML = options1;
	document.getElementById("tv2").innerHTML = options2;
	document.getElementById("tv3").innerHTML = options3;
	checkTriangleInput();
}

function newTriangle() 
{
	var tv1 = document.getElementById("tv1");
	var tv2 = document.getElementById("tv2");
	var tv3 = document.getElementById("tv3");
	if (tv1.selectedIndex != -1 && tv2.selectedIndex != -1 && tv3.selectedIndex != -1) {
		triangleL.push([tv1.selectedIndex, tv2.selectedIndex, tv3.selectedIndex]);
		renderTriangleTable();
		ClickCounter.onClick();
	} else {
		console.log("tv undefined");
	}

	updateGeometry();
}

function newVertex() 
{
	var verticeList = document.getElementById('verticeList');
	var vertexX = document.getElementById('vertexX');
	var vertexY = document.getElementById('vertexY');
	var vertexZ = document.getElementById('vertexZ');
	var vertexMsg = document.getElementById('vertexMsg');

	if (checkVertexInput(vertexX.value, vertexY.value, vertexZ.value)) {
		addVertexToVerticeList(parseInt(vertexX.value, 10), parseInt(vertexY.value, 10), parseInt(vertexZ.value, 10));
		document.getElementById('vertexX').value = "";
		document.getElementById('vertexY').value = "";
		document.getElementById('vertexZ').value = "";
		ClickCounter.onClick();
	}
}

function checkTriangleInput()
{
	var tv1 = document.getElementById("tv1");
	var tv2 = document.getElementById("tv2");
	var tv3 = document.getElementById("tv3");
	if ((tv1.selectedIndex != tv2.selectedIndex) &&
		(tv1.selectedIndex != tv3.selectedIndex) &&
		(tv2.selectedIndex != tv3.selectedIndex)) {
		document.getElementById("newTriangleButton").disabled = false;
	} else {
		document.getElementById("newTriangleButton").disabled = true;
	}

}

function checkVertexInput(vertexX, vertexY, vertexZ) 
{
	// Only integers are allowed. Hence, check for [0-9] and '-' for negative integers.
	var vertexMsg = document.getElementById('vertexMsg');
	var x,y,z;
	x = /^\-?[0-9]+$/.test(vertexX);
	y = /^\-?[0-9]+$/.test(vertexY);
	z = /^\-?[0-9]+$/.test(vertexZ);
	vertexMsg.innerHTML = "";
	if (x && y && z && isInteger(parseInt(vertexX, 10)) && isInteger(parseInt(vertexY, 10)) && isInteger(parseInt(vertexZ, 10))) {
		return true;
	} else {
		vertexMsg.innerHTML = "Endast heltal är godkända som koordinater.";
		return false;
	}
}

function vertexUpdate(index) 
{
	ClickCounter.onClick();

	var x = document.getElementById('v_'+index+'_x').value;
	var y = document.getElementById('v_'+index+'_y').value;
	var z = document.getElementById('v_'+index+'_z').value;

	if (checkVertexInput(x, y, z)){		
		vertexL[index].x = parseInt(x, 10);
		vertexL[index].y = parseInt(y, 10);
		vertexL[index].z = parseInt(z, 10);
	} else {
		document.getElementById('vertexMsg').innerHTML = "Endast heltal är godkända som koordinater.";
		document.getElementById('v_'+index+'_x').value = vertexL[index].x;
		document.getElementById('v_'+index+'_y').value = vertexL[index].y;
		document.getElementById('v_'+index+'_z').value = vertexL[index].z;
	}

	//console.log("VertixList: "+vertexL);

	updateGeometry();	
}

function addVertexToVerticeList(vertexX, vertexY, vertexZ) 
{

	var v = new Vertex(vertexX, vertexY, vertexZ);
	vertexL.push(v);
	renderVertexTable();
	updateGeometry();

}

function renderVertexTable()
{
	// Render table
	var newTableBody = "<tbody>";
	for (var i=0; i<vertexL.length;i++){
		newTableBody += "<tr id='v" + i +"'>";
		newTableBody += '<td style="font-size:11px; text-align: right;">v'+i+'</td>';
		newTableBody += '<td><input style="width:100%; padding:0; margin:0; box-sizing: border-box;" id="v_'+i+'_x" type="text" maxlength="4" size="4" value="' + vertexL[i].x + '" onchange="vertexUpdate('+i+');" /></td>';
		newTableBody += '<td><input style="width:100%; padding:0; margin:0; box-sizing: border-box;" id="v_'+i+'_y" type="text" maxlength="4" size="4" value="' + vertexL[i].y + '" onchange="vertexUpdate('+i+');" /></td>';
		newTableBody += '<td><input style="width:100%; padding:0; margin:0; box-sizing: border-box;" id="v_'+i+'_z" type="text" maxlength="4" size="4" value="' + vertexL[i].z + '" onchange="vertexUpdate('+i+');" /></td>';
		if (i === 0){
			newTableBody += '<td><button disabled onclick="moveVertexUp('+i+');">&uarr;</button></td>';
		} else {
			newTableBody += '<td><button onclick="moveVertexUp('+i+');">&uarr;</button></td>';			
		}
		if (i === vertexL.length-1){
			newTableBody += '<td><button disabled onclick="moveVertexDown('+i+');">&darr;</button></td>';
		} else {
			newTableBody += '<td><button onclick="moveVertexDown('+i+');">&darr;</button></td>';			
		}
		if(activeVertex(i)){
			newTableBody += '<td><button disabled onclick="deleteVertex('+i+');">X</button></td>';			
		} else {
			newTableBody += '<td><button onclick="deleteVertex('+i+');">X</button></td>';			
		}
		newTableBody += "</tr>";
	}
	newTableBody += "</tbody>";
	document.getElementById('verticeList').innerHTML = newTableBody;	
	document.getElementById("vertexPaneNumber").innerHTML=vertexL.length;
	if (vertexL.length > 0) {
		document.getElementById("vertexPaneNumber").style="display:inline-block; line-height: 11px;";
	} else {
		document.getElementById("vertexPaneNumber").style="display:none; line-height: 11px;";
	}

}

function renderTriangleTable()
{
	// Render table
	var newTableBody = "<tbody>";
	for (var i=0; i<triangleL.length;i++){
		newTableBody += "<tr id='tri" + i +"'>";
		newTableBody += '<td style="font-size:11px; text-align: right;">triangel '+i+'</td>';
		newTableBody += '<td><p style="margin:0;">(v'+triangleL[i][0]+',v'+triangleL[i][1]+',v'+triangleL[i][2]+')</p></td>';
		if (i === 0){
			newTableBody += '<td><button disabled onclick="moveTriangleUp('+i+');">&uarr;</button></td>';
		} else {
			newTableBody += '<td><button onclick="moveTriangleUp('+i+');">&uarr;</button></td>';			
		}
		if (i === triangleL.length-1){
			newTableBody += '<td><button disabled onclick="moveTriangleDown('+i+');">&darr;</button></td>';
		} else {
			newTableBody += '<td><button onclick="moveTriangleDown('+i+');">&darr;</button></td>';			
		}
		newTableBody += '<td><button onclick="deleteTriangle('+i+');">X</button></td>';			
		newTableBody += "</tr>";
	}
	newTableBody += "</tbody>";
	document.getElementById('triangleList2').innerHTML = newTableBody;	

	document.getElementById("trianglePaneNumber").innerHTML=triangleL.length;
	if (triangleL.length > 0) {
		document.getElementById("trianglePaneNumber").style="display:inline-block; line-height: 11px;";
	} else {
		document.getElementById("trianglePaneNumber").style="display:none; line-height: 11px;";
	}

}


function activeVertex(index)
{
	var active = false;
	for (var i = 0; i < triangleL.length; i++) {
		if (triangleL[i][0] == index || triangleL[i][1] == index || triangleL[i][2] == index) {active = true;}
	}
	return active;
}

function deleteVertex(index) 
{
	vertexL.splice(index, 1);
	renderVertexTable();
	updateGeometry();	
	ClickCounter.onClick();
}

function moveVertexUp(index) 
{
	vertexL.move(index, index-1);
	renderVertexTable();
	updateGeometry();	
	ClickCounter.onClick();
}

function moveVertexDown(index) 
{
	vertexL.move(index, index+1);
	renderVertexTable();
	updateGeometry();	
	ClickCounter.onClick();
}

function deleteTriangle(index) 
{
	triangleL.splice(index, 1);
	renderTriangleTable();
	updateGeometry();	
	ClickCounter.onClick();
}

function moveTriangleUp(index) 
{
	triangleL.move(index, index-1);
	renderTriangleTable();
	updateGeometry();	
	ClickCounter.onClick();
}

function moveTriangleDown(index) 
{
	triangleL.move(index, index-1);
	renderTriangleTable();
	updateGeometry();	
	ClickCounter.onClick();
}


function toggleRotate() 
{
	if (rotateObjects) { rotateObjects = false; } else { rotateObjects = true; }
}

function toggleWireframeMode() 
{
	if (material.wireframe) { material.wireframe = false; }	else { material.wireframe = true; }
}

function fitToContainer() 
{
	// Make it visually fill the positioned parent
	divw = $("#content").width();
	if (divw > 500){ divw -= 248; }
	if (divw < window.innerHeight) {
		rendererDOMElement.width = divw;
		rendererDOMElement.height = divw;
	} else {
		rendererDOMElement.width = window.innerHeight - 100;
		rendererDOMElement.height = rendererDOMElement.width;
	}
	renderer.setSize(rendererDOMElement.width, rendererDOMElement.height);
}

function init() 
{	
	// Disable Triagle Pane until we have at least 3 vertices
	document.getElementById("trianglePane").disabled = true;
	document.getElementById("vertexMsg").innerHTML = "För få hörn för att skapa trianglar.";

	rendererDOMElement = renderer.domElement;
	rendererDOMElement.width = $("#content").width() - 250;
	rendererDOMElement.height = $("#content").width() - 250;
	fitToContainer();
	acanvas.appendChild(rendererDOMElement);

	camera = new THREE.PerspectiveCamera(60, rendererDOMElement.width / rendererDOMElement.height, 1, 10000);

	scene = new THREE.Scene();

	scene.add(camera);

	material = new THREE.MeshBasicMaterial({
		wireframe : false,
		wireframeLinewidth : 3,
		vertexColors : THREE.FaceColors
	});

	goalMaterial = new THREE.MeshBasicMaterial({
		wireframe : true,
		wireframeLinewidth : 3,
		vertexColors : THREE.FaceColors,
		side : THREE.DoubleSide
	});

	//Draw X Y Z Axis
	var xLineMat = new THREE.LineBasicMaterial({
		color : new THREE.Color(0xff0000),
		opacity : 1,
		linewidth : 3
	});

	var yLineMat = new THREE.LineBasicMaterial({
		color : new THREE.Color(0x00ff00),
		opacity : 1,
		linewidth : 3
	});

	var zLineMat = new THREE.LineBasicMaterial({
		color : new THREE.Color(0x0000ff),
		opacity : 1,
		linewidth : 3
	});

	var lineRGeom = new THREE.Geometry();
	var lineGGeom = new THREE.Geometry();
	var lineBGeom = new THREE.Geometry();

	//X
	lineRGeom.vertices.push(new THREE.Vector3(0, 0, 0));
	lineRGeom.vertices.push(new THREE.Vector3(200, 0, 0));
	lineRGeom.vertices.push(new THREE.Vector3(190, -10, 0));
	lineRGeom.vertices.push(new THREE.Vector3(200, 0, 0));
	lineRGeom.vertices.push(new THREE.Vector3(190, 10, 0));
	lineRGeom.vertices.push(new THREE.Vector3(200, 0, 0));

	//Y
	lineGGeom.vertices.push(new THREE.Vector3(0, 0, 0));
	lineGGeom.vertices.push(new THREE.Vector3(0, 200, 0));
	lineGGeom.vertices.push(new THREE.Vector3(-10, 190, 0));
	lineGGeom.vertices.push(new THREE.Vector3(0, 200, 0));
	lineGGeom.vertices.push(new THREE.Vector3(10, 190, 0));
	lineGGeom.vertices.push(new THREE.Vector3(0, 200, 0));

	//Z
	lineBGeom.vertices.push(new THREE.Vector3(0, 0, 0));
	lineBGeom.vertices.push(new THREE.Vector3(0, 0, 200));
	lineBGeom.vertices.push(new THREE.Vector3(-10, -10, 190));
	lineBGeom.vertices.push(new THREE.Vector3(0, 0, 200));
	lineBGeom.vertices.push(new THREE.Vector3(10, 10, 190));

	lineR = new THREE.Line(lineRGeom, xLineMat);
	lineG = new THREE.Line(lineGGeom, yLineMat);
	lineB = new THREE.Line(lineBGeom, zLineMat);

	scene.add(lineR);
	scene.add(lineG);
	scene.add(lineB);

}

function createGoalObject(goalObjectDataString) {
	var goalObjectData = JSON.parse(goalObjectDataString);
	var geom = new THREE.Geometry();
	for (var i = 0; i < goalObjectData.vertice.length; i++) {
		geom.vertices.push(new THREE.Vector3(goalObjectData.vertice[i].x, goalObjectData.vertice[i].y, goalObjectData.vertice[i].z));
	}
	for (i = 0; i < goalObjectData.triangles.length; i++) {
		var vertices = goalObjectData.triangles[i].split(',');
		geom.faces.push(new THREE.Face3(vertices[0], vertices[1], vertices[2]));
	}
	for (i = 0; i < geom.faces.length; i++) {
		var face = geom.faces[i];
		//face.color.setHex( Math.random() * 0xffffff );
		face.color.setHex(0x777777);
	}
	goalObject = new THREE.Mesh(geom, goalMaterial);
	scene.add(goalObject);
}

function updateGeometry() {
	if (vertexL.length > 2) {
		//console.log("VertexList: "+ vertexL);
		document.getElementById("vertexMsg").innerHTML = "";
		var triangleList = document.getElementById('triangleList');
		document.getElementById("trianglePane").disabled = false;
		var geom = new THREE.Geometry();

		for (var i = 0; i < vertexL.length; i++) {
			geom.vertices.push(new THREE.Vector3(vertexL[i].x, vertexL[i].y, vertexL[i].z));
		}

		for (i = 0; i < triangleL.length; i++) {
			geom.faces.push(new THREE.Face3(triangleL[i][0], triangleL[i][1], triangleL[i][2]));
		}

		geom = addColorsToGeometry(geom);
		scene.remove(object);
		object = new THREE.Mesh(geom, material);
		object.geometry.__dirtyVertices = true;
		scene.add(object);			
	} else {
		document.getElementById("vertexMsg").innerHTML = "För få hörn för att skapa trianglar.";
		document.getElementById("trianglePane").disabled = true;
	}

	// Clear previous highlightCubes array and remove them from scene
	while (highlightCubes.length > 0) {scene.remove(highlightCubes.pop());}

	if (highlightVerticies){ highlightVertices(); }

	//console.log("No scene obj: "+scene.children.length);
	resetRotationForAllObjects();
}

function addColorsToGeometry(geom) {
	var colors = [0x777777, 0xcc0000, 0x00cc00, 0x0000cc, 0x00cccc, 0xcc00cc, 0xcccc00];
	var colorIndex = 0;
	for (var i = 0; i < geom.faces.length; i++) {
		var face = geom.faces[i];
		face.color.setHex(colors[colorIndex]);
		colorIndex++;
		if (colorIndex >= colors.length) { colorIndex = 0; }
	}
	return geom;
}

function rotateAllObjects() {
	// Actually, move camera
	var timer = Date.now() * 0.0005;

	camera.position.x = Math.cos( timer ) * 1000;
	camera.position.z = Math.sin( timer ) * 1000;
	//camera.position.y = Math.sin( timer ) * 800;

	camera.lookAt( scene.position );
}

function resetRotationForAllObjects() {
	camera.position.z = DEFAULT_CAMERA_POSITION_Z;
	camera.position.x = DEFAULT_CAMERA_POSITION_X;
	camera.position.y = DEFAULT_CAMERA_POSITION_Y;
	camera.lookAt( scene.position );
}

function createTextures(){
	for (var i=0;i<20;i++){
		var text = i;
		var padding = 2;
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
	    canvas.width = 32;
	    canvas.height = 32;
	    context.font = "24px Verdana";

		context.fillStyle = "#ffffff";
	    context.strokeStyle = 'black';
	    context.lineWidth = 1;
		context.fillRect(0, 0, canvas.width, canvas.height);	
		context.strokeRect(0.5,0.5,canvas.width-1,canvas.height-1);
	    context.textAlign = "center";
	    context.textBaseline = "middle";
	    context.fillStyle = "#ff0000";
	    context.fillText(text, 16 , 18);
		textureArray[i] = canvas;			
	}
}


function highlightVertices(){	
	for (var i = 0; i < vertexL.length; i++) {
				
		var cubeGeometry = new THREE.BoxGeometry(25, 25, 25);

		var xm = new THREE.MeshBasicMaterial({ map: new THREE.Texture(textureArray[i]), transparent: false });
		xm.map.needsUpdate = true;


		var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x1ec876 });
		var cube = new THREE.Mesh(cubeGeometry, xm);
		var sphere = new THREE.Mesh(new THREE.SphereGeometry(25, 25, 25), new THREE.MeshNormalMaterial());
		
		cube.position.x = vertexL[i].x;
		cube.position.y = vertexL[i].y;
		cube.position.z = vertexL[i].z;

		// Store vertex highlight for reference
		highlightCubes.push(cube);

		scene.add(cube);

	}
}

function animate() {
	fitToContainer();
	renderId=requestAnimationFrame(animate);

	if (rotateObjects) {
		rotateAllObjects();
	} else {
		resetRotationForAllObjects();
	}

	renderer.render(scene, camera);

}

//----------------------------------------------------------------------------------
// High score function, gets called from hideDuggainfoPopup function in dugga.js
// dataV = global variable with the data set in returnedDugga
//----------------------------------------------------------------------------------

function startDuggaHighScore(){
	Timer.startTimer();	
	ClickCounter.initialize();
	if(querystring['highscoremode'] == 1) {
		if(dataV['score'] > 0){
			Timer.score = dataV['score'];
		}
		Timer.showTimer();
	} else if (querystring['highscoremode'] == 2) {
		
		if(dataV['score'] > 0){
			ClickCounter.score = dataV['score'];
		}
		ClickCounter.showClicker();
	}
}

function toggleFeedback()
{
    $(".feedback-content").slideToggle("slow");
}