/**
 * @description Setup the dugga, this is the first thing that happens
 * */
function setup()
{
    inParams = parseGet();
    AJAXService("GETPARAM", { }, "PDUGGA");
    generateSubmitForm();
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
    })
        .done(function( msg ) {
            alert( "Data Saved: " + msg );
        });
}
function returnedDugga(para)
{
    console.log(para);
}