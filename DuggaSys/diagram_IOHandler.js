/************************************************************************

    THIS FILE HANDLES THE SAVE, DOWNLOAD AND EXPORT FUNCTIONALITY

************************************************************************/

var a;
var c;
var b;
var ac = [];

//--------------------------------------------------------------------------------------------------
// downloadmode: download/load/export canvas (not fully implemented, see row 373-378 in diagram.php)
//--------------------------------------------------------------------------------------------------

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

//---------------------------------------------
// saveToServer: saves folders/projects created in IOhandler to server
//---------------------------------------------

function saveToServer(dia) {
    $.ajax({
        url: 'diagram.php',
        type: 'POST',
        data: {StringDiagram : dia, Hash: hashFunction()}
    });
}

//---------------------------------------------
// redirect: redirects user to newly created project
//---------------------------------------------

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

//---------------------------------------------
// redirectas: redirects user to diagram chosen in IOHandler
//---------------------------------------------

function redirectas(doc,folder) {
        location.href="diagram.php?id="+doc.value+"&folder="+folder;
}

//---------------------------------------------
// newProject: toggles the content visible to create a new project/canvas in existing folder
//---------------------------------------------

function newProject() {
    document.getElementById('newProject').style.display = "block";
}

//---------------------------------------------
// loadNew: shows all existing folders and the option to create a new folder for use when creating new project/canvas
//---------------------------------------------

function loadNew() {
    document.getElementById('showStoredFolders').style.display = "none";
    document.getElementById('showStored').style.display = "none";
    document.getElementById('showNew').style.display = "block";
}

//---------------------------------------------
// loadStored: Shows all stored projects inside folder, used when loading existing canvas
//---------------------------------------------

function loadStored() {
    document.getElementById('showNew').style.display = "none";
    document.getElementById('showStored').style.display = "block";
}

//---------------------------------------------
// loadStored: Shows all stored folders, used when loading existing canvas
//---------------------------------------------

function loadStoredFolders(f) {
    document.getElementById('showStoredFolders').style.display = "block";
}

//---------------------------------------------
// Save: saves objects in canvas to JSON format in localstorage
//---------------------------------------------

function Save() {
    diagramNumber++;
    localStorage.setItem("diagramNumber", diagramNumber);
    c = [];
    d = [];
    for (var i = 0; i < diagram.length; i++) {
        c[i] = diagram[i].constructor.name;
        c[i] = c[i].replace(/"/g,"");
        d[i] = diagram[i].id;
    }
    var obj = {diagram:diagram, points:points, diagramNames:c, diagramID:d};
    a = JSON.stringify(obj, null, "\t");
    localStorage.setItem("Settings", JSON.stringify(settings));
    localStorage.setItem("diagramID", JSON.stringify(d));
    console.log("State is saved");
}

//---------------------------------------------
// SaveState: saves the current state of the canvas to localstorage
//---------------------------------------------

function SaveState() {
    Save();
    localStorage.setItem("diagram" + diagramNumber, a);
    for (var key in localStorage) {
        if (key.indexOf("diagram") != -1) {
            var tmp = key.match(/\d+$/);
            if (tmp > diagramNumber) localStorage.removeItem(key);
        }
    }
}

//---------------------------------------------
// SaveFile: used to export diagram as JSON
//---------------------------------------------

function SaveFile(el) {
    Save();
    var data = "text/json;charset=utf-8," + encodeURIComponent(a);
    el.setAttribute("class", 'icon-download');
    el.setAttribute("href", "data:" + data);
    el.setAttribute("download", "diagram.txt");
    updateGraphics();
}

//---------------------------------------------
// LoadImport: used when importing diagram(JSON) from computer
//---------------------------------------------

function LoadImport(fileContent) {
    a = fileContent;
    Load();
}

//---------------------------------------------
// loadDiagram: retrive an old diagram if it exist.
//---------------------------------------------

function loadDiagram() {
    // Only retrieve settings if there are any saved
    if(JSON.parse(localStorage.getItem("Settings"))){
        settings = JSON.parse(localStorage.getItem("Settings"));
    }
    diagramNumber = localStorage.getItem("diagramNumber");
    diagramID = localStorage.getItem("diagramID");
    var checkLocalStorage = localStorage.getItem("diagram" + diagramNumber);

    //local storage and hash
    if (checkLocalStorage != "" && checkLocalStorage != null) {
        var localDiagram = JSON.parse(localStorage.getItem("diagram" + diagramNumber));
    }
    var localHexHash = localStorage.getItem('localhash');
    var diagramToString = "";
    var hash = 0;
    for(var i = 0; i < diagram.length; i++) {
        diagramToString += JSON.stringify(diagram[i]);
    }
    if (diagram.length != 0) {
        for (var i = 0; i < diagramToString.length; i++) {
            var char = diagramToString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;         // Convert to 32bit integer
        }
        var hexHash = hash.toString(16);
    }
    if (typeof localHexHash !== "undefined" && typeof localDiagram !== "undefined") {
        if (localHexHash != hexHash) {
            b = JSON.parse(JSON.stringify(localDiagram));
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
                diagram[i].setID(JSON.parse(diagramID)[i]);
            }
            // Points fix
            for (var i = 0; i < b.points.length; i++) {
                b.points[i] = Object.assign(new Path, b.points[i]);
            }
            points.length = b.points.length;
            for (var i = 0; i < b.points.length; i++) {
                points[i] = b.points[i];
            }
        }
    }
    deselectObjects();
    updateGraphics();
    SaveState();
}

//------------------------------------------------------------------------------
// hashFunction: calculate the hash. does this by converting all objects to strings from diagram.
//               then do some sort of calculation. used to save the diagram. it also save the local diagram
//------------------------------------------------------------------------------

function hashFunction() {
    var diagramToString = "";
    var hash = 0;
    for (var i = 0; i < diagram.length; i++) {
        diagramToString += JSON.stringify(diagram[i])
    }
    if (diagram.length != 0) {
        for (var i = 0; i < diagramToString.length; i++) {
            var char = diagramToString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;         // Convert to 32bit integer
        }
        var hexHash = hash.toString(16);
        if (currentHash != hexHash) {
            localStorage.setItem('localhash', hexHash);
            for (var i = 0; i < diagram.length; i++) {
                c[i] = diagram[i].constructor.name;
                c[i] = c[i].replace(/"/g,"");
                d[i] = diagram[i].id;
            }
            a = JSON.stringify({diagram:diagram, points:points, diagramNames:c, diagramID:d});
            localStorage.setItem('localdiagram', a);
            return hexHash;
        }
    }
}

//--------------------------------------------------------------------------------
// hashCurrent: This function is used to hash the current diagram, but not storing it locally,
//              so we can compare the current hash with the hash after we have made some changes
//              to see if it need to be saved.
//--------------------------------------------------------------------------------

function hashCurrent() {
    var hash = 0;
    var diagramToString = "";
    for (var i = 0; i < diagram.length; i++) {
        diagramToString += JSON.stringify(diagram[i])
    }
    for (var i = 0; i < diagramToString.length; i++) {
        var char = diagramToString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;         // Convert to 32bit integer
    }
    currentHash = hash.toString(16);
}

//----------------------------------------------------------------------
// removeLocalStorage: this function is running when you click the button clear diagram
//----------------------------------------------------------------------

function removeLocalStorage() {
    for (var i = 0; i < localStorage.length; i++) {
        localStorage.removeItem("diagram" + i);
    }
    diagramNumber = 0;
    localStorage.setItem("diagramNumber", 0);
}

//----------------------------------------------------------------------
// LoadFile: Loads JSON file into canvas
//----------------------------------------------------------------------

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

//----------------------------------------------------------------------
// ExportSVG: export canvas to SVG file
//----------------------------------------------------------------------

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

//----------------------------------------------------------------------
// ExportSVGPaper: export canvas to SVG file in Paper format
//----------------------------------------------------------------------

function ExportSVGA4(el) { //There will probably be so only one size paper are to be downloaded?
    const pixelsPerMillimeter = 3.781;
    paperWidth = 210 * pixelsPerMillimeter;
    paperHeight = 297 * pixelsPerMillimeter;
    if(paperOrientation == "landscape"){
        temp = paperWidth;
        paperWidth = paperHeight;
        paperHeight = temp
        //downloads file with swapped height and width for landscape oriented Paper
    }
    var svgstr = "";
    var width = paperWidth, height = paperHeight;
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
function ExportPicture(el) {
    var canvasId = 'diagram-canvas';
    var filename = 'picture.png';
    el.href = document.getElementById(canvasId).toDataURL();
    el.download = filename;
}

/*Makes canvas bigger before printing */
function printDiagram(){
    heightWindow = (window.innerHeight - 95);
    canvas.setAttribute("height", heightWindow*2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(2, 2);
    updateGraphics();
    window.print();
    afterPrint();
}
 
/*Sets canvas back to normal after printing*/ 
function afterPrint(){
    canvas.setAttribute("height", heightWindow);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(1,1);
    updateGraphics();
}
