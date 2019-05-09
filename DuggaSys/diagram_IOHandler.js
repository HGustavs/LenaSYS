/************************************************************************

    THIS FILE HANDLES THE SAVE, DOWNLOAD AND EXPORT FUNCTIONALITY

************************************************************************/

var a;
var c;
var b;
var ac = [];

function downloadMode(el) {
    var canvas = document.getElementById("content");
    var selectBox = document.getElementById("download");
    download = selectBox.options[selectBox.selectedIndex].value;

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
        data: {StringDiagram : dia, Hash: hashFunction()}
    });
}

function redirect(doc) {
    var a = doc.value;

    $.ajax({
        type: "POST",
        url: "diagram_IOHandler.php",
        data: {'GetID':a },

        success: function(data) { // <-- note the parameter here, not in your code
            return false;
        }
    });

    location.href="diagram.php?id="+0+"&folder="+a;
}

function redirectas(doc,folder) {
        location.href="diagram.php?id="+doc.value+"&folder="+folder;
}

function newProject() {
    document.getElementById('newProject').style.display = "block";
}

function loadNew() {
    document.getElementById('showStoredFolders').style.display = "none";
    document.getElementById('showStored').style.display = "none";
    document.getElementById('showNew').style.display = "block";
}

function loadStored() {
    document.getElementById('showNew').style.display = "none";
    document.getElementById('showStored').style.display = "block";
}

function loadStoredFolders(f) {
    document.getElementById('showStoredFolders').style.display = "block";
}

function Save() {
    c = [];
    for (var i = 0; i < diagram.length; i++) {
        c[i] = diagram[i].constructor.name;
        c[i] = c[i].replace(/"/g,"");
    }
    var obj = {diagram:diagram, points:points, diagramNames:c};
    a = JSON.stringify(obj, null, "\t");

    console.log("State is saved");
}

function SaveState() {
    Save();
    if (diagramNumberHistory < diagramNumber) {
        diagramNumberHistory++;
        diagramNumber = diagramNumberHistory;
    } else {
        diagramNumber++;
        diagramNumberHistory = diagramNumber;
    }
    localStorage.setItem("diagram" + diagramNumber, a);
    for (var key in localStorage) {
        if (key.indexOf("diagram") != -1) {
            var tmp = key.match(/\d+$/);
            if (tmp > diagramNumberHistory) localStorage.removeItem(key);
        }
    }
}

function SaveFile(el) {
    Save();
    var data = "text/json;charset=utf-8," + encodeURIComponent(a);
    el.setAttribute("class", 'icon-download');
    el.setAttribute("href", "data:" + data);
    el.setAttribute("download", "diagram.txt");
    updateGraphics();
}

function LoadImport(fileContent) {
    a = fileContent;
    Load();
}

function LoadFile() {
    var pp = JSON.parse(a);
    b = pp;
    //diagram fix
    for (var i = 0; i < b.diagram.length; i++) {
        if (b.diagramNames[i] == "Symbol") {
            b.diagram[i] = Object.assign(new Symbol, b.diagram[i]);
        } else if (b.diagramNames[i] == "Path") {
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
    updateGraphics();
}

//-------------------------------------------------------------------------------
// getUpload: this function adds eventlisteners to the buttons when html body is loaded
//-------------------------------------------------------------------------------

function getUpload() {
    document.getElementById('buttonids').addEventListener('click', openDialog);
    function openDialog() {
        document.getElementById('fileids').click();
    }
    document.getElementById('fileids').addEventListener('change', submitFile);
    function submitFile() {
        var reader = new FileReader();
        var file = document.getElementById('fileids').files[0];
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            a = evt.currentTarget.result;
            // LoadFile();
        }
    }
}

function Load() {
    // Implement a JSON.parse() that will unmarshall a b c, so we can add
    // them to their respecive array so it can redraw the desired canvas.
    var dia = JSON.parse(a);
    b = dia;
    for (var i = 0; i < b.diagram.length; i++) {
        if (b.diagramNames[i] == "Symbol") {
            b.diagram[i] = Object.assign(new Symbol, b.diagram[i]);
        } else if (b.diagramNames[i] == "Path") {
            b.diagram[i] = Object.assign(new Path, b.diagram[i]);
        }
    }
    diagram.length = b.diagram.length;
    for (var i = 0; i < b.diagram.length; i++) {
        diagram[i] = b.diagram[i];
    }

    points.length = b.points.length;
    for (var i = 0; i < b.points.length; i++) {
        points[i] = b.points[i];
    }
    console.log("State is loaded");
    //Redrawn old state.
    updateGraphics();
}

function ExportSVG(el) {
    var svgstr = "";
    var width = window.innerWidth, height = window.innerHeight;
    svgstr += "<svg width='"+width+"' height='"+height+"' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>";
    svgstr += gridToSVG(width, height);
    svgstr += diagramToSVG();
    svgstr += "</svg>";
    var data = "text/json;charset=utf-8," + encodeURIComponent(svgstr);
    el.setAttribute("class", 'icon-download');
    el.setAttribute("href", "data:" + data);
    el.setAttribute("download", "diagram.svg");
}

//------------------------------------------------
// used when exporting the file as a .png image.
//------------------------------------------------

$(document).ready(function() {
    function downloadCanvas(link, canvasId, filename) {
        link.href = document.getElementById(canvasId).toDataURL();
        link.download = filename;
    }

    document.getElementById('picid').addEventListener('click', function() {
        downloadCanvas(this, 'myCanvas', 'picture.png');
    }, false);
});
