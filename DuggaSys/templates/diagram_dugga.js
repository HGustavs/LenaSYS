var lastFile = null;
var diagramWindow;
var response = "";
var parameterArray = [];
/** 
 * @description Alert message appears before closing down or refreshing the dugga viewer page window.

 * @return For clarification: It will return a built-in message rather than a customised one as seen below, for safety reasons.
 */
function beforeUnloadingPage() 
{
    if (diagramWindow.contentWindow.stateMachine.historyLog.length != 0) {
        return "Are you sure you want to close the dugga viewer? Make sure your changes are saved.";
    }

}

/**
 * @description Setup the dugga, this is the first thing that happens
 * */
// This creates the predrawn diagram for diagram dugga
function setup()
{
    diagramWindow = document.getElementById("diagram-iframe");
    inParams = parseGet();
    AJAXService("GETPARAM", { }, "PDUGGA");
    
    diagramWindow.contentWindow.addEventListener('mouseup', canSaveController);
    // checking if user has an stored active diagram and loading it if they have
    if(localStorage.getItem("CurrentlyActiveDiagram") != null && localStorage.getItem("CurrentlyActiveDiagram") != ""){
        document.getElementById("diagram-iframe").contentWindow.loadDiagramFromString(JSON.parse(localStorage.getItem("CurrentlyActiveDiagram")));
    }

    
    //Adding eventlisteners to buttons inside the iframe for functions in thise file, outside the iframe
    const childFrame = document.getElementById("diagram-iframe");
    const mobileSaveButton = childFrame.contentWindow.document.getElementById("mb-saveDuggaButton"); 
    mobileSaveButton.addEventListener("click", () => {
        uploadFile();
        showReceiptPopup();
    });    
    childFrame.contentWindow.document.getElementById("mb-resetDuggaButton").addEventListener("click", reset);
    childFrame.contentWindow.document.getElementById("mb-loadDuggaButton").addEventListener("click", showLoadDuggaPopup);


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
        AJAXService("SAVDU", { }, "PDUGGA");
    });
}
/**
 * @description If the user has previus submissions to the current
 * assigment, get the last file and load it in the diagram-editor
 * @see dugga.js for the call to this function
 * */
function returnedDugga(data)
{
        duggaData = data;
    //var textBox = document.getElementById('submission-receipt');
    //$('#submission-receipt').html(`${duggaData['duggaTitle']}</br></br>Direct link (to be submitted in canvas): </br>` + `<a href='${createUrl(duggaData['hash'])}'> ${createUrl(duggaData['hash'])}` + `</a> </br></br> Hash: </br> ${duggaData['hash']}</br></br>Hash password:</br>${duggaData['hashpwd']}`);
   
    //General idea below - create one method in dugga.js rather than changing recipt box in each dugga type. Currently not working.
    //updateReceiptText(response['duggaTitle'], createUrl(response['hash']), response['hash'], response['hashpwd']);
    
    if (data.param.length!=0){
        var param = JSON.parse(data.param);
        //document.getElementById("assigment-instructions").innerHTML = param.instructions;
        //checking if the user is a teacher or if there's no variant by checking if the paramater object is empty
        if(!(Object.keys(param).length === 0) && data.isTeacher == 0){
            // getting the diagram types allowed and calling a function in diagram.js where the values are now set <-- UML functionality start
            document.getElementById("diagram-iframe").contentWindow.diagramType = param.diagram_type;
            // getting the error checker allowed or not
            document.getElementById("diagram-iframe").contentWindow.showErrorCheck(param.errorActive);
            // Getting the instructions to the side of the dugga -currently using filelink which is wrong
             if(param.filelink != undefined)
            {
                document.getElementById("diagram-iframe").contentWindow.getInstructions(param.filelink);
            }
            if(param.gFilelink != undefined)
            {
                document.getElementById("diagram-iframe").contentWindow.getInstructions(param.gFilelink);
            }
        }
        else{
            var diagramType={ER:true,UML:true,IE:true};
            document.getElementById("diagram-iframe").contentWindow.diagramType = diagramType;
            document.getElementById("diagram-iframe").contentWindow.showErrorCheck(true);
        }
        document.getElementById("diagram-iframe").contentWindow.showDiagramTypes();//<-- UML functionality end
    }

    if (data.files[inParams["moment"]] && Object.keys(data.files[inParams["moment"]]).length != 0) {
        var momentFiles = data.files[inParams["moment"]];
        var lastKeyIndex = Object.keys(momentFiles).length-1;
        var lastKey = Object.keys(momentFiles)[lastKeyIndex];
        var lastFile = momentFiles[lastKey]
        var filePath = lastFile.filepath + "/" + lastFile.filename + lastFile.seq + "." + lastFile.extension;

        
        /*$.ajax({
            method: "GET",
            url: filePath,
        }).done(function(file) {
            setLastFile(file);
            diagramWindow.contentWindow.loadDiagram(file);
        });
        */
    }
}
/**
 * @description Resets the diagram iframe to the state the user made changes,
 * this can be to the point of an import for previous submit or the initial state of the assigment.
 * */
function reset()
{
    let refreshConfirm = confirm("Are you sure you want to reset to default state? All changes made to diagram will be lost");
    if(refreshConfirm){
        localStorage.setItem("CurrentlyActiveDiagram","");
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
    var parameters = JSON.parse(param);
    parameterArray.push(parameters.diagram_type,parameters.errorActive,parameters.filelink,parameters.gFilelink);
}
