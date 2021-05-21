/**
 * @description Setup the dugga, this is the first thing that happens
 * */
function setup()
{
    inParams = parseGet();
    AJAXService("GETPARAM", { }, "PDUGGA");
    document.getElementById("saveDuggaButton").onclick  = function() { uploadFile(); }
}
/**
 * @description Load latest diagram from hash
 * */
function getPreviusSumbit()
{
    $.ajax({
        url: "showDuggaservice.php",
        data: { hash: "hash" }
    }).done(function(result) {
        console.log(result);
    });
}
/**
 * @description Get the iframe data to submit
 * @return An stringify json object.
 * */
function getDiagramData()
{
    var diagramWindow = document.getElementById("diagram-iframe");

    return JSON.stringify(dataToSave = {
        initialState: diagramWindow.contentWindow.stateMachine.initialState,
        historyLog: diagramWindow.contentWindow.stateMachine.historyLog
    });
}

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
        saveClick();
    });
}
function returnedDugga(para)
{
    var files = para.files
    var lastKeyIndex = Object.keys(files).length-1;
    var lastKey = Object.keys(files)[lastKeyIndex];
    var lastFile = files[lastKey]
    var lastKeyIndex2 = Object.keys(lastFile).length-1;
    var lastKey2 = Object.keys(lastFile)[lastKeyIndex2];
    var lastFile2 = lastFile[lastKey2]

    var filePath = lastFile2.filepath + lastFile2.filename + lastFile2.seq + "." + lastFile2.extension;

    $.ajax({
        method: "GET",
        url: filePath,

    }).done(function(file) {
        document.getElementById("diagram-iframe").contentWindow.loadDiagram(file);
    });

}