
var camera, scene, renderer, rendererDOMElement;
var cameraDistance = 1500, rotationStartTime = 0;
var triangleMeshObject, line;
var webglCanvas=document.getElementById("webgl_canvas");
var material, goalMaterial;
var rotateObjects=true;
var backsideCulling=false;

var startValues = JSON.parse(startString);
var goal='{"vertices":[{"x":"400","y":"400","z":"0"},{"x":"-400","y":"-400","z":"0"},{"x":"400","y":"-400","z":"0"}],"triangles":["0,1,2"]}';
var goalObject;

var vertexList;
var triangleList;

function copyGoal() {
    startString = goal;
    startValues = JSON.parse(startString);
    initiateLists()
}
function initiateLists(){
    vertexList = [];
    triangleList = [];
    for (var i=0;i<startValues.vertices.length;i++) {
        vertexList.push( new THREE.Vector3(startValues.vertices[i].x,startValues.vertices[i].y,startValues.vertices[i].z))
    }
    for (var i=0;i<startValues.triangles.length;i++) {
        triangleList.push( new THREE.Face3(startValues.triangles[i][0],startValues.triangles[i][1],startValues.triangles[i][2]))
    }
    populateVertexListElement();
    populateTrianglesList();
    updateGeometry();
}

function populateVertexListElement(){
    var vertexListElement=document.getElementById("vertexListElement");
    vertexListElement.innerHTML = "";
    for(var i=0;i<vertexList.length;i++){
        var newVertxLi=document.createElement('li');
        newVertxLi.innerHTML='<div class="x_coord">x:<input class="x_coord" type="text" value="'+vertexList[i].x+'" style="width:40px;" onchange="vertexUpdate(this.value,'+i+',0);" /></div>'+
            ' <div class="y_coord">y:<input class="y_coord" type="text" value="'+vertexList[i].y+'" style="width:40px;" onchange="vertexUpdate(this.value,'+i+',1);" /></div>'+
            ' <div class="z_coord">z:<input class="z_coord" type="text" value="'+vertexList[i].z+'" style="width:40px;" onchange="vertexUpdate(this.value,'+i+',2);" /></div>'+
            '<button onclick="moveVertexUp(this.parentNode);">&uarr;</button>'+
            '<button onclick="moveVertexDown(this.parentNode);">&darr;</button>'+
            '<button onclick="deleteVertex(this.parentNode);">X</button>';
        vertexListElement.appendChild(newVertxLi);
    }

    // Update triangle vertex selectors.
    for (i=1;i<=3;i++) {
        var selectorElement = document.getElementById("tv"+i);
        var prevSelected = selectorElement.selectedIndex;
        selectorElement.innerHTML = "";
        for(var j=0;j<vertexList.length;j++){
            var newOption=document.createElement('option');
            newOption.value=j;
            newOption.innerHTML=j;
            selectorElement.appendChild(newOption);
        }
        selectorElement.selectedIndex = Math.min(prevSelected,vertexList.length-1)
    }
}

function populateTrianglesList(){
//				console.log(triangles);
    var triangleListElement=document.getElementById("triangleListElement");
    var prevSelected = triangleListElement.selectedIndex;
    triangleListElement.innerHTML = "";
    for(var i=0;i<triangleList.length;i++){
        var triangleStr = ""+triangleList[i].a + ","+triangleList[i].b + ","+triangleList[i].c
        triangleListElement.innerHTML+="<option value='"+triangleStr+"'>"+triangleStr+"</option>";
        triangleList[i].materialIndex = i;
    }
    triangleListElement.selectedIndex = Math.min(prevSelected,triangleListElement.length-1);
}

function deleteTriangle()
{
    var elSel = document.getElementById('triangleListElement');
    triangleList.splice(elSel.selectedIndex,1);
    populateTrianglesList();
    updateGeometry();
}

function moveTriangleUp()
{
    var elSel = document.getElementById('triangleListElement');
    var ind=elSel.selectedIndex;
    if(ind>0){

        var tmp = triangleList[ind];
        triangleList[ind] = triangleList[ind-1];
        triangleList[ind-1] = tmp;

        populateTrianglesList();
        elSel.selectedIndex--;
        updateGeometry();
    }
}

function moveTriangleDown()
{
    var elSel = document.getElementById('triangleListElement');
    var ind=elSel.selectedIndex;
    if(ind<elSel.length-1){

        var tmp = triangleList[ind];
        triangleList[ind] = triangleList[ind+1];
        triangleList[ind+1] = tmp;

        populateTrianglesList();
        elSel.selectedIndex++;
        updateGeometry();
    }

}

function updateVerticeDropdown(selectList){
    /*
     selectList.innerHTML="";
     var vertexListElement=document.getElementById("vertexListElement");
     for(var i=0;i<vertexListElement.childNodes.length;i++){
     var newOption=document.createElement('option');
     newOption.value=i;
     newOption.innerHTML=i;
     newOption.onclick=function(ev){ev.stopPropagation();return false;};
     selectList.appendChild(newOption);
     }

     */
    /*var tv1=document.getElementById("tv1");
     var tv2=document.getElementById("tv1");
     var tv3=document.getElementById("tv1");*/
    //selectList=ev.target;
    //console.log(selectList);
}

function newTriangle(){
    var tv1=document.getElementById("tv1");
    var tv2=document.getElementById("tv2");
    var tv3=document.getElementById("tv3");
    if(tv1.selectedIndex!=-1 && tv2.selectedIndex!=-1 && tv3.selectedIndex!=-1){
        console.log("tv defined");
        triangleList.push( new THREE.Face3(tv1.selectedIndex,tv2.selectedIndex,tv3.selectedIndex));
        populateTrianglesList();
        updateGeometry();
    } else {
        console.log("tv undefined");
    }
}

function newVertex(){
    var vertexListElement=document.getElementById('vertexListElement');
    var vertexX=document.getElementById('vertexX');
    var vertexY=document.getElementById('vertexY');
    var vertexZ=document.getElementById('vertexZ');

    if(checkVertexInput(vertexX.value,vertexY.value,vertexZ.value)){
        vertexList.push( new THREE.Vector3(vertexX.value,vertexY.value,vertexZ.value))
    }
    populateVertexListElement();
}

function checkVertexInput(vertexX,vertexY,vertexZ){
    var vertexMsg=document.getElementById('vertexMsg');
    vertexMsg.innerHTML="";
    if((vertexX!='' && !isNaN(vertexX)) && (vertexY!='' && !isNaN(vertexY)) && (vertexZ!='' && !isNaN(vertexZ))){
        return true;
    } else {
        vertexMsg.innerHTML="Incorrect input";
        return false;
    }
}

function vertexUpdate(newValue,vertexIndex,coordIndex){
    var vertexMsg=document.getElementById('vertexMsg');
    vertexMsg.innerHTML="";

    if ( newValue==='' || isNaN(newValue) ) {
        vertexMsg.innerHTML="Incorrect input in vertices list.<br /> Geometry update failed.";
    } else {
        vertexList[vertexIndex]["xyz"[coordIndex]] = newValue;
        updateGeometry();
    }
}

function deleteVertex(vertexLi)
{
    var vertexIndex=$(vertexLi).index() + vertexLi.parentNode.start;
    for(var i=0;i<triangleList.length;i++){
        var face = triangleList[i];
        if(face.a==vertexIndex || face.b==vertexIndex || face.c==vertexIndex){
            console.log('in use');
            document.getElementById("vertexMsg").innerHTML="Kan inte ta bort. Hörnet används.";
            return;
        }
    }
    // Vertex not in use.
    document.getElementById("vertexMsg").innerHTML="";
    vertexList.splice(vertexIndex,1);
    populateVertexListElement();
    updateGeometry();
}

function moveVertexUp(vertexLi)
{
    var ind=$(vertexLi).index() + vertexLi.parentNode.start;
    if(ind>0){

        var tmp = vertexList[ind];
        vertexList[ind] = vertexList[ind-1];
        vertexList[ind-1] = tmp;

        populateVertexListElement();
        updateGeometry();
    }
}

function moveVertexDown(vertexLi)
{
    var ind=$(vertexLi).index() + vertexLi.parentNode.start;
    if(ind<vertexList.length-1){

        var tmp = vertexList[ind];
        vertexList[ind] = vertexList[ind+1];
        vertexList[ind+1] = tmp;

        populateVertexListElement();
        updateGeometry();
    }
}

function addMouseHandlers() {
    var mouseIsDown = false;
    var mouseDrag = false;
    var dragStartX = 0;
    var dragStartRotation = 0;
    webglCanvas.addEventListener('mouseup', function (event) {
        mouseIsDown = false;
        if ( !mouseDrag ) {
            toggleRotate();
        }
        mouseDrag = false;
    }, false);
    webglCanvas.addEventListener('mousedown', function (event) {
        mouseIsDown = true;
        dragStartX = event.clientX;
        dragStartRotation = cameraRotation;
    }, false);
    webglCanvas.addEventListener('mousemove', function (event) {
        if ( mouseIsDown ) {
            mouseDrag = true;
            var dragX = event.clientX - dragStartX;
            cameraRotation = dragStartRotation - 0.012 * dragX;
        }
    }, false);
}


function createAxisArrow(color,arrowLength,rotation) {

    var arrowMaterial = new THREE.MeshLambertMaterial({"color": color});

    var arrowObject = new THREE.Object3D();

    var cylGeometry = new THREE.CylinderGeometry(arrowLength*0.01,arrowLength*0.01,arrowLength*0.9)
    var cylMesh = new THREE.Mesh(cylGeometry,arrowMaterial);
    cylMesh.position.y=arrowLength*0.45;
    arrowObject.add(cylMesh);

    var headGeometry = new THREE.CylinderGeometry(0,arrowLength*0.02,arrowLength*0.1)
    var headMesh = new THREE.Mesh(headGeometry,arrowMaterial);
    headMesh.position.y=arrowLength*0.95;
    arrowObject.add(headMesh);
    if ( rotation instanceof THREE.Quaternion ) {
        arrowObject.quaternion = rotation;
    }

    scene.add(arrowObject);
}

function createGoalObject(goalObjectDataString){
    var goalObjectData = JSON.parse(goalObjectDataString);
    var geom = new THREE.Geometry();
    for(var i=0;i<goalObjectData.vertices.length;i++){
        geom.vertices.push(new THREE.Vector3(goalObjectData.vertices[i].x,goalObjectData.vertices[i].y,goalObjectData.vertices[i].z));
    }
    for(var i=0;i<goalObjectData.triangles.length;i++){
        var vertices=goalObjectData.triangles[i];
        geom.faces.push( new THREE.Face3( vertices[0], vertices[1], vertices[2]) );
    }
    addColorsToGeometryFaces(geom);
    goalObject = new THREE.Mesh( geom, goalMaterial );
    scene.add(goalObject);
    //populateVertexListElement(goalObjectData.vertices);
    //populateTrianglesList(goalObjectData.triangles);
    //var vertice=goalObjectData.
}

function updateGeometry(){
    if(vertexList.length>2 && triangleList.length>0){
        document.getElementById("vertexMsg").innerHTML="";

//                    addColorsToTriangleFaces();

        var triangleMeshGeometry = new THREE.Geometry();

        triangleMeshGeometry.vertices = vertexList;
        triangleMeshGeometry.faces = triangleList;
        triangleMeshGeometry.computeFaceNormals();

//                    var material = new THREE.MeshLambertMaterial({"color": 0xff0000,side: THREE.DoubleSide});
        material = new THREE.MeshFaceMaterial( createMaterialsForTriangleFaces() );
        if (triangleMeshObject instanceof THREE.Mesh ) {
            scene.remove(triangleMeshObject);
        }
        triangleMeshObject = new THREE.Mesh( triangleMeshGeometry, material );
        triangleMeshObject.geometry.__dirtyVertices=true;
        scene.add(triangleMeshObject);
    } else {
        document.getElementById("vertexMsg").innerHTML="För få hörn/trianglar";
    }
    resetCameraRotation();
}

function createMaterialsForTriangleFaces(){
    var colors=[ 0x777777,0xcc0000,0x00cc00,0x0000cc, 0x00cccc, 0xcc00cc, 0xcccc00];
    var faceMaterials = [];
    var colorIndex=0;
    for (var i=0;i<triangleList.length;i++) {
        faceMaterials.push( new THREE.MeshBasicMaterial({"color":colors[colorIndex],side: THREE.DoubleSide}));
        colorIndex++;
        if(colorIndex>=colors.length) colorIndex=0;
    }
    return faceMaterials;
}

function addColorsToGeometryFaces(geom){
    var colors=[0x777777, 0xcc0000,0x00cc00,0x0000cc, 0x00cccc, 0xcc00cc, 0xcccc00];
    var colorIndex=0;
    for (var i=0;i<geom.faces.length;i++) {
        var face = geom.faces[ i ];
        //face.color.setHex( Math.random() * 0xffffff );
        face.color.setHex(colors[colorIndex]);
        colorIndex++;
        if(colorIndex>=colors.length) colorIndex=0;
    }
}

/*function onWindowResize() {

 camera.aspect = window.innerWidth / window.innerHeight;
 camera.updateProjectionMatrix();

 renderer.setSize( window.innerWidth, window.innerHeight );

 }*/

var cameraRotation = 0;
var cameraDistance = 1500;
var cameraRotationSpeed = 0.5;

function resetCameraRotation(){
    cameraRotation = 0;
}

function animate() {
    requestAnimationFrame( animate );
    var dt = clock.getDelta();
    if(rotateObjects){
        cameraRotation += dt * cameraRotationSpeed;
    }

    camera.position = new THREE.Vector3(cameraDistance*Math.sin(cameraRotation),300,cameraDistance*Math.cos(cameraRotation))
    camera.lookAt( new THREE.Vector3(0,0,0) );

    renderer.render( scene, camera );

}

// *********** Misc UI methods ********
function submbutton(){
    var answerString="";

    var trianglesArray=new Array();
    for(var i=0;i<triangleList.length;i++){
        var t = triangleList[i];
        trianglesArray.push( [t.a, t.b, t.c] );
    }
    var answer=new Object();
    answer.vertices=vertexList;
    answer.triangles=trianglesArray;
    answerString = JSON.stringify(answer);
    console.log(answerString);

    checkAnswer(answerString);
}

function toggleRotate(){
    if(rotateObjects) rotateObjects=false;
    else rotateObjects=true;
}

function toggleWireframeMode(){
    var newState = !material.materials[0].wireframe;
    for (var i=0;i<material.materials.length;i++) {
        material.materials[i].wireframe = newState;
    }
//                if(material.wireframe) material.wireframe=false;
//                else material.wireframe=true;
}

var clock;

$(document).ready(function() {
    addMouseHandlers();

    clock = new THREE.Clock();

    init();
    initiateLists();
    fetchQuiz(); // Creates goal object from loaded data.
    animate();
});

function init() {

    renderer = new THREE.WebGLRenderer();

    //webglCanvas.appendChild(renderer.domElement);
    rendererDOMElement=renderer.domElement;
    rendererDOMElement.width=600;
    rendererDOMElement.height=600;
    renderer.setSize( rendererDOMElement.width, rendererDOMElement.height );
    //document.body.appendChild( rendererDOMElement );
    webglCanvas.appendChild(rendererDOMElement);

    camera = new THREE.PerspectiveCamera( 60, rendererDOMElement.width / rendererDOMElement.height , 1, 10000 );

    camera.position.z = 1500;

    scene = new THREE.Scene();


    // create a point light
    var pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.x = 200;
    pointLight.position.y = 200;
    pointLight.position.z = 330;
    //pointLight.castShadow = true;
    //pointLight.shadowCameraVisible = true;
    scene.add(pointLight);

    var pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.x = -100;
    pointLight.position.y = 200;
    pointLight.position.z = -230;
    //pointLight.castShadow = true;
    //pointLight.shadowCameraVisible = true;
    scene.add(pointLight);


    //var bump512 = THREE.ImageUtils.loadTexture( 'includes/bump512_2.gif' );
    //var jg = THREE.ImageUtils.loadTexture( 'includes/jg.gif' );
    /*texture.anisotropy = renderer.getMaxAnisotropy();
     texture.magFilter=THREE.LinearFilter;
     texture.minFilter=THREE.LinearMipMapLinearFilter;*/
    /*bump512.wrapT = THREE.RepeatWrapping;
     bump512.wrapS = THREE.RepeatWrapping;
     bump512.repeat.set(4,4);*/
    material = new THREE.MeshBasicMaterial( { wireframe: false, wireframeLinewidth: 10, vertexColors: THREE.FaceColors, side: THREE.DoubleSide } );
    goalMaterial = new THREE.MeshBasicMaterial( { wireframe: true, wireframeLinewidth: 10, vertexColors: THREE.FaceColors, side: THREE.DoubleSide } );
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

    //geom.doubleSided=true;
    //geom.computeFaceNormals();

    // add ambient lighting
//				var ambientLight = new THREE.AmbientLight(0x777777);
//				scene.add(ambientLight);

    createAxisArrow(0xff0000,500, // X
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),-Math.PI/2));
    createAxisArrow(0x00ff00,500); // Y
    createAxisArrow(0x0000ff,500, // Z
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),Math.PI/2));

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
