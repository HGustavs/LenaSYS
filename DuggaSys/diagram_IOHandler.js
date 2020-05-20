/************************************************************************

    THIS FILE HANDLES THE SAVE, DOWNLOAD AND EXPORT FUNCTIONALITY

************************************************************************/

const propertyKeyMap  = generatePropertyKeysMap(2, [new Symbol(1), new Symbol(2), new Symbol(3), new Symbol(4), new Symbol(5), new Symbol(6), new Symbol(7), new Path(), {diagram:null, points:null, diagramNames:null, diagramID:null, text: null, isSelected: null}]);
let diagramChanges = [];

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

//------------------------------------------------------------------------------------------------------------------------
// SaveState: Builds the diagram from previous changes and compares the built diagram with the current diagram.
//            Found changes are pushed to diagramChanges. Current diagramChanges and settings are pushed to local storage.
//------------------------------------------------------------------------------------------------------------------------

function SaveState() {
    const builtDiagram = buildDiagramFromChanges();

    const objectChanges = {
        diagram: getObjectChanges(builtDiagram.diagram, diagram),
        points: getObjectChanges(builtDiagram.points, points)
    };

    if(Object.keys(objectChanges.diagram).length > 0 && Object.keys(objectChanges.points).length > 0) {
        diagramChanges.push({
            "diagram": objectChanges.diagram,
            "points": objectChanges.points
        });
    } else if(Object.keys(objectChanges.diagram).length > 0 && Object.keys(objectChanges.points).length === 0) {
        diagramChanges.push({"diagram": objectChanges.diagram});
    } else if(Object.keys(objectChanges.diagram).length === 0 && Object.keys(objectChanges.points).length > 0) {
        diagramChanges.push({"points": objectChanges.points});
    }

    localStorage.setItem("diagramChanges", JSON.stringify(diagramChanges));
    localStorage.setItem("Settings", JSON.stringify(settings));
    console.log("State is saved");
}

//---------------------------------------------
// SaveFile: used to export diagram as JSON
//---------------------------------------------

function SaveFile(el) {
    SaveState();
    const data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(diagramChanges));
    el.setAttribute("class", 'icon-download');
    el.setAttribute("href", "data:" + data);
    el.setAttribute("download", "diagram.txt");
    updateGraphics();
}

//---------------------------------------------
// LoadImport: used when importing diagram(JSON) from computer
//---------------------------------------------

function LoadImport(fileContent) {
    localStorage.setItem("diagramChanges", fileContent)
    diagramChanges = JSON.parse(fileContent);
    Load();
    fixExampleLayer()
}

function saveKeyBinds(){
    localStorage.setItem("Keybinds", JSON.stringify(keyMap));
}

function loadKeyBinds(){
    //if keybinds have been saved get them from local storage and set the keymap as thier value
    if(JSON.parse(localStorage.getItem("Keybinds"))){
        keyMap = JSON.parse(localStorage.getItem("Keybinds"));
        drawKeyMap(keyMap, $("#shortcuts-wrap").get(0));
    }
}
//----------------------------------------------------------------------------------------------
// loadDiagram: Builds diagram from object containing changes and overwrites diagram and points.
//              Only does this if the local hash is not equal to current diagram hash.
//----------------------------------------------------------------------------------------------

function loadDiagram() {
    // Only retrieve settings if there are any saved
    if(JSON.parse(localStorage.getItem("Settings"))){
        settings = JSON.parse(localStorage.getItem("Settings"));
    }

    const localHexHash = localStorage.getItem("localhash");
    const hexHash = getDiagramHash(getStringifiedDiagram());

    if (localHexHash !== hexHash) {
        const localStorageDiagramChanges = localStorage.getItem("diagramChanges");

        if(localStorageDiagramChanges !== null) {
            diagramChanges = JSON.parse(localStorageDiagramChanges);
            const built = buildDiagramFromChanges(diagramChanges);
    
            overwriteDiagram(built.diagram);
            overwritePoints(built.points);
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
    const hexHash = getDiagramHash(getStringifiedDiagram());
    if (currentHash !== hexHash) {
        localStorage.setItem("localhash", hexHash);
        return hexHash;
    }
}

//--------------------------------------------------------------------------------
// hashCurrent: This function is used to hash the current diagram, but not storing it locally,
//              so we can compare the current hash with the hash after we have made some changes
//              to see if it need to be saved.
//--------------------------------------------------------------------------------

function hashCurrent() {
    currentHash = getDiagramHash(getStringifiedDiagram());
}

//-------------------------------------------------------------------------------
// getStringifiedDiagram: Stringifies all diagram objects and puts them together.
//-------------------------------------------------------------------------------

function getStringifiedDiagram() {
    let str = "";
    for(let i = 0; i < diagram.length; i++) {
        str += JSON.stringify(diagram[i]);
    }
    return str;
}

//-------------------------------------------------------
// getDiagramHash: Creates a hash based on passed string.
//-------------------------------------------------------

function getDiagramHash(stringifiedDiagram) {
    let hash = 0;
    for(let i = 0; i < stringifiedDiagram.length; i++) {
        const char = stringifiedDiagram.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16); // Convert to 32-bit integer
}

//----------------------------------------------------------------------
// removeLocalStorage: this function is running when you click the button clear diagram
//----------------------------------------------------------------------

function removeLocalStorage() {

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
            //  = evt.currentTarget.result;
        }
    }
}

//---------------------------------------------------------------------------------------
// Load: Builds the diagram from diagram changes objects and replaces diagram and points.
//       Used when importing files. No interaction with local storage or hashing.
//---------------------------------------------------------------------------------------

function Load() {
    const built = buildDiagramFromChanges(diagramChanges);
    overwriteDiagram(built.diagram);
    overwritePoints(built.points);
    console.log("State is loaded");
    updateGraphics();
}

//-----------------------------------------------------------------------------
// overwriteDiagram: Overwrites used diagram array to passed new diagram array.
//-----------------------------------------------------------------------------

function overwriteDiagram(newDiagram) {
    for(let i = 0; i < newDiagram.length; i++) {
        const object = newDiagram[i];
        if(object.kind === kind.symbol) {
            diagram[i] = Object.assign(new Symbol(object.symbolkind), JSON.parse(JSON.stringify(object)));
        } else if(object.kind === kind.path) {
            diagram[i] = Object.assign(new Path(), JSON.parse(JSON.stringify(object)));
        }
    }
}

//--------------------------------------------------------------------------
// overwritePoints: Overwrites used points array to passed new points array.
//--------------------------------------------------------------------------

function overwritePoints(newPoints) {
    for(let i = 0; i < newPoints.length; i++) {
        points[i] = JSON.parse(JSON.stringify(newPoints[i]));
    }
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

//------------------------------------------------
// Local storage compressing functions start
//------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------------------------------------
// getObjectChanges: Returns an object with all changes, comparing passed base object with passed new object.
//                   The property key will be the path to the changed property.
//                   - Char (u) as type means property value has been updated compared to same property in base object (data property with additions exists).
//                   - Char (+) as value means the property the key points to was added (data property with additions exists).
//                   - Char (-) as value means the property the key points to was deleted (no data property).
//-----------------------------------------------------------------------------------------------------------------------------------------------------------

function getObjectChanges(base, object) {
    const changes = {};

    const compareObjects = (base, object, path = "") => {
        for(const key of Object.keys(base)) {
            const currentPath = path === "" ? key : `${path}.${key}`;
            if(object[key] === undefined) {
                changes[currentPath] = {"type": "-"};
            }
        }

        for(const [key, value] of Object.entries(object)) {
            if(!isFunction(value)) {
                const currentPath = path === "" ? key : `${path}.${key}`;
                if(base[key] === undefined) {
                    changes[currentPath] = {
                        "type": "+",
                        "data": JSON.parse(JSON.stringify(value))
                    };
                } else if(value !== base[key]) {
                    if((isObject(value) || Array.isArray(value)) && (isObject(base[key]) || Array.isArray(base[key]))) {
                        compareObjects(base[key], value, currentPath);
                    } else {
                        changes[currentPath] = {
                            "type": "u",
                            "data": JSON.parse(JSON.stringify(value))
                        };
                    }
                }
            }
        }
    };

    compareObjects(base, object);

    return changes;
}

function buildDiagramFromChanges() {
    const built = {
        diagram: [],
        points: []
    }

    if(diagramChanges === null || typeof diagramChanges === "undefined") return built;

    let deleteQueue = [];

    const iterateChange = (change, type = "diagram") => {
        for(const [key, value] of Object.entries(change[type])) {
            if(value.type === '+' || value.type === 'u') {
                setNestedPropertyValue(built[type], key, value.data);
            } else if(value.type === '-') {
                deleteQueue.push({
                    "object": built[type],
                    "key": key
                });
            }
        }
    };

    for(const change of diagramChanges) {
        if(typeof change["diagram"] !== "undefined") {
            iterateChange(change, "diagram");
        }
        if(typeof change["points"] !== "undefined") {
            iterateChange(change, "points");
        }

        deleteQueue.sort((a, b) => a.key < b.key ? 1 : -1).forEach(position => {
            deleteNestedProperty(position.object, position.key);
        });
        deleteQueue = [];
    }

    return built;
}

function setNestedPropertyValue(object, property, value) {
    if(property.indexOf(".") === -1) {
        object[property] = value;
    } else {
        const properties = property.split(".");
        const topLevelProperty = properties.shift();
        const remainingProperties = properties.join(".");
        if(object[topLevelProperty] === null || object[topLevelProperty] === undefined) {
            object[topLevelProperty] = {};
        }
        setNestedPropertyValue(object[topLevelProperty], remainingProperties, value);
    }
}

function deleteNestedProperty(object, property) {
    if(property.indexOf(".") === -1) {
        if(Array.isArray(object)) {
            object.splice(property, 1);
        } else if(isObject(object)) {
            delete object[property];
        }
    } else {
        const properties = property.split(".");
        const topLevelProperty = properties.shift();
        const remainingProperties = properties.join(".");
        deleteNestedProperty(object[topLevelProperty], remainingProperties);
    }
}

//--------------------------------------------------------
// isFunction: Returns true if passed value is a function.
//--------------------------------------------------------

function isFunction(f) {
    return f && {}.toString.call(f) === "[object Function]";
}

//------------------------------------------------------------
// isObject: Returns true if passed value is a regular object.
//------------------------------------------------------------

function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]'
}

//---------------------------------------------------------------------------------------------------
// getObjectPropertyKeys: Returns all property keys in passed object whose values are not a function.
//                        This does not return children object properties.
//---------------------------------------------------------------------------------------------------

function getObjectPropertyKeys(object) {
    return Object.keys(object).filter(key => !isFunction(object[key]));
}

//---------------------------------------------------------------------------------------------------------
// getChildrenObjectsPropertyKeys: Returns all property keys of possible children objects in passed object.
//                                 Also looks for objects inside of arrays.
//---------------------------------------------------------------------------------------------------------

function getChildrenObjectsPropertyKeys(object) {
    const keys = Object.keys(object).reduce((result, key) => {
        if(isObject(object[key])) {
            result = [...result, ...getObjectPropertyKeys(object[key]), ...getChildrenObjectsPropertyKeys(object[key])];
        } else if(Array.isArray(object[key])) {
            result = [...result, ...getChildrenObjectsPropertyKeys(object[key])];
        }
        return result;
    }, []);

    return [...new Set(keys)]
}

//-------------------------------------------------------------------------------------------------------------------
// getAsciiCharsInRange: Returns an array containing all characters within the passed start and end ascii code range.
//-------------------------------------------------------------------------------------------------------------------

function getAsciiCharsInRange(start, end) {
    const chars = [];
    for(let i = start; i <= end; i++) {
        chars.push(String.fromCharCode(i));
    }
    return chars;
}

//-------------------------------------------------------------------------------------------------------------------
// getAsciiCharsInRange: Returns a map mapping object property keys to a short serach char + unique char string.
//                       Used to compress used space in local storage by using short representation in local storage.
//-------------------------------------------------------------------------------------------------------------------

function generatePropertyKeysMap(minLength = 2, objects = []) {
    const map = new Map();
    const delimiterChar = '~';
    const asciiChars = [
        ...getAsciiCharsInRange(65, 90),
        ...getAsciiCharsInRange(97, 122),
        ...getAsciiCharsInRange(33, 64)
    ];
    let asciiIndex = 0;
    
    objects.forEach(object => {
        const keys = [...getObjectPropertyKeys(object), ...getChildrenObjectsPropertyKeys(object)];
        keys.forEach(key => {
            if(typeof map.get(key) === "undefined" && key.length >= minLength) {
                map.set(key, delimiterChar+asciiChars[asciiIndex]);
                asciiIndex++;
            }
        });
    })
    return map;
}

//---------------------------------------------------------------------------------------------------------------------------
// compressStringifiedObject: Compresses passed stringified object properties with the help of a generated property keys map.
//---------------------------------------------------------------------------------------------------------------------------

function compressStringifiedObject(stringifiedObject) {
    let currentString = stringifiedObject;
    for(const [key, value] of propertyKeyMap.entries()) {
        currentString = replaceAll(currentString, `"${key}"`, value);
    }
    return currentString;
}

//-------------------------------------------------------------------------------------------------------------------------------
// decompressStringifiedObject: Decompresses passed stringified object properties with the help of a generated property keys map.
//-------------------------------------------------------------------------------------------------------------------------------

function decompressStringifiedObject(stringifiedObject) {
    let currentString = stringifiedObject;
    for(const [key, value] of propertyKeyMap.entries()) {
        currentString = replaceAll(currentString, value, `"${key}"`);
    }
    return currentString;
}

//------------------------------------------------------------------------------------------------------------------
// replaceAll: Replaces all parts of passed string that matches the passed find value with the passed replace value.
//------------------------------------------------------------------------------------------------------------------

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

//----------------------------------------------------------------------------------------------------------------------
// escapeRegExp: Escapes important characters in a regulear expression to prevent the replaceAll function giving errors.
//----------------------------------------------------------------------------------------------------------------------

function escapeRegExp(str) {
    return str.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
}

//------------------------------------------------
// Local storage compressing functions end
//------------------------------------------------