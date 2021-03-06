var lastFile = null;
var diagramWindow;
/**
 * @description Setup the dugga, this is the first thing that happens
 * */
function setup()
{
    diagramWindow = document.getElementById("diagram-iframe");
    inParams = parseGet();
    AJAXService("GETPARAM", { }, "PDUGGA");
    document.getElementById("saveDuggaButton").onclick = function (){ uploadFile();};
    diagramWindow.contentWindow.addEventListener('mouseup', canSaveController);
}

/**
 * @description Get the iframe data to submit
 * @return An stringify json object.
 * */
function getDiagramData()
{
    // Remove the changes that is after the current change.
    diagramWindow.contentWindow.stateMachine.removeFutureStates();

    return JSON.stringify({
        historyLog: diagramWindow.contentWindow.stateMachine.historyLog,
        initialState: diagramWindow.contentWindow.stateMachine.initialState
    });
}
/**
 * @description Makes an ajax-call to filereceive_dugga.php to generate the file on the server,
 * depending on the data in the diagram-editor.
 * */
function uploadFile()
{
    $.ajax({
        method: "POST",
        url: "filereceive_dugga.php",
        data: {
            inputtext: getDiagramData(),
            field: "diagramSave",
            hash: hash,
            segment: inParams["segment"],
            did: inParams["did"],
            coursevers: inParams["coursevers"],
            cid: inParams["cid"],
            kind: 4,
            moment: inParams["moment"]
        }
    }).done(function() {
        AJAXService("GETPARAM", { }, "PDUGGA");
        saveClick();
    });
}
/**
 * @description If the user has previus submissions to the current
 * assigment, get the last file and load it in the diagram-editor
 * @see dugga.js for the call to this function
 * */
function returnedDugga(data)
{
    if (data.param.length!=0){
        var param = JSON.parse(data.param);
        document.getElementById("assigment-instructions").innerHTML = param.instructions;
    }

    if (data.files[inParams["moment"]] && Object.keys(data.files[inParams["moment"]]).length != 0) {
        var momentFiles = data.files[inParams["moment"]];
        var lastKeyIndex = Object.keys(momentFiles).length-1;
        var lastKey = Object.keys(momentFiles)[lastKeyIndex];
        var lastFile = momentFiles[lastKey]
        var filePath = lastFile.filepath + lastFile.filename + lastFile.seq + "." + lastFile.extension;

        $.ajax({
            method: "GET",
            url: filePath,
        }).done(function(file) {
            setLastFile(file);
            diagramWindow.contentWindow.loadDiagram(file);
        });
    }
}
/**
 * @description Resets the diagram iframe to the state the user made changes,
 * this can be to the point of an import for previous submit or the initial state of the assigment.
 * */
function reset()
{
    if (lastFile == null)
    {
        diagramWindow.contentWindow.stateMachine.gotoInitialState();
        diagramWindow.contentWindow.stateMachine.currentHistoryIndex = -1;
        diagramWindow.contentWindow.stateMachine.lastFlag = {};
        diagramWindow.contentWindow.stateMachine.removeFutureStates();
    }else{
        diagramWindow.contentWindow.loadDiagram(lastFile, false);
    }
}
/**
 * @description Sets the value of lastFile
 * @param {File} lf The file that lastFile should have as value
 * */
function setLastFile(lf)
{
    lastFile = lf
}
/**
 * @description Check if changes has been done to the diagram and it
 * is possible to save.
 * Keep in mind this Override this function in dugga.js
 * */
function canSaveController()
{
    // If there is any changes to the history => enable buttons and remove EventListener
    if (diagramWindow.contentWindow.stateMachine.historyLog.length != 0){

        var elems = document.querySelectorAll(".btn-disable");
        diagramWindow.contentWindow.removeEventListener('mouseup', canSaveController);

        // For every disable remove the class
        elems.forEach(e => {
            e.classList.remove("btn-disable");
        });
    }
}
/**
 * @description Shows the correct answers to the dugga when viewed in the dugga editor
 * Keep in mind that this is currently not supported in the diagram dugga
 */
function showFacit(param, uanswer, danswer, userStats, files, moment, feedback)
{
}