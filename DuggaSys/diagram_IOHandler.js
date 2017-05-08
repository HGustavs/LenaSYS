var a;
var c;
var b;
var ac = [];

function downloadMode(el) {
    var canvas = document.getElementById("content");
    var selectBox = document.getElementById("download");
    download = selectBox.options[selectBox.selectedIndex].value;
    if (download.toString() == "getImage") {
        console.log("b");
        getImage();
    }
    if (download == "Save") {
        Save();
    }
    if (download == "Load") {
        Load();
    }
    if (download == "Export") {
        SaveFile(el);
    }
}

function saveToServer(dia) {

    $.ajax({
        url: 'diagram.php',
        type: 'POST', // GET or POST
        data: {StringDiagram : dia, Hash: hashfunction()}

    });

}
function createFolder(name){

}
function redirect(doc){
    var a = doc.value;
    if(a){
        location.href="diagram.php?id="+a;
    }

}
function loadNew(){
    document.getElementById('showNew').style.display = "block";
}
function loadStored(){
    document.getElementById('showStored').style.display = "block";
}
function loadStoredFolders(f){
    $.ajax({
        url: 'diagram_IOHandler.php',
        type: 'POST', // GET or POST
        data: {Folder: f},
        success: function(msg)
        {
            alert('POSTED');
        }
    });
    document.getElementById('showStoredFolders').style.display = "block";


}
function loadUpload(){

}
function loadExample(){

}
function getImage() {
    window.open(document.getElementById("myCanvas").toDataURL("image/png"), 'Image');
}

function Save() {
    for (var i = 0; i < diagram.length; i++) {
        c[i] = diagram[i].constructor.name;
        c[i] = c[i].replace(/"/g,"");
    }
    var obj = {diagram:diagram, points:points, diagram_names:c};
    a = JSON.stringify(obj);
    saveToServer(a);
    console.log("State is saved");
}

function SaveFile(el) {
    Save();
    var data = "text/json;charset=utf-8," + encodeURIComponent(a);
    el.setAttribute("class", 'icon-download');
    el.setAttribute("href", "data:" + data);
    el.setAttribute("download", "diagram.txt");
    updategfx();
}

function LoadFile() {
    var pp = JSON.parse(a);
    b = pp;
    //diagram fix
    for (var i = 0; i < b.diagram.length; i++) {
        if (b.diagram_names[i] == "Symbol") {
            b.diagram[i] = Object.assign(new Symbol, b.diagram[i]);
        } else if (b.diagram_names[i] == "Path") {
            b.diagram[i] = Object.assign(new Path, b.diagram[i]);
        }
    }
    diagram.length = b.diagram.length;
    for (var i = 0; i < b.diagram.length; i++) {
        diagram[i] = b.diagram[i];
    }
    // Points fix
    for (var i = 0; i < b.points.length; i++) {
        b.points[i] = Object.assign(new Path, b.points[i]);
    }
    points.length = b.points.length;
    for (var i = 0; i< b.points.length; i++ ) {
        points[i] = b.points[i];
    }
    console.log("State is loaded");
    //Redrawn old state.
    updategfx();
}

function Load() {
    // Implement a JSON.parse() that will unmarshall a b c, so we can add
    // them to their respecive array so it can redraw the desired canvas.
    var dia = JSON.parse(a);
    b = dia;
    for (var i = 0; i < b.diagram.length; i++) {
        if (b.diagram_names[i] == "Symbol") {
            b.diagram[i] = Object.assign(new Symbol, b.diagram[i]);
        } else if (b.diagram_names[i] == "Path") {
            b.diagram[i] = Object.assign(new Path, b.diagram[i]);
        }
    }
    diagram.length = b.diagram.length;
    for (var i = 0; i < b.diagram.length; i++) {
        diagram[i] = b.diagram[i];
    }
    // Points fix
    for (var i = 0; i < b.points.length; i++) {
        b.points[i] = Object.assign(new Path, b.points[i]);
    }
    points.length = b.points.length;
    for (var i = 0; i < b.points.length; i++) {
        points[i] = b.points[i];
    }
    console.log("State is loaded");
    //Redrawn old state.
    updategfx();
}