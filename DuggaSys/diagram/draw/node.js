/**
 * @description Adds nodes for resizing to an elements
 * @param {Object} element The target element to add nodes to.
 */
function addNodes(element) {
    let mrNode, mlNode, muNode, mdNode, tlNode, trNode, blNode, brNode;
    const elementDiv = document.getElementById(element.id);
    let nodes = "";
    nodes += "<span id='mr' class='node mr'></span>";
    nodes += "<span id='ml' class='node ml'></span>";
    nodes += "<span id='md' class='node md'></span>";
    nodes += "<span id='mu' class='node mu'></span>";
    nodes += "<span id='tl' class='node tl'></span>";
    nodes += "<span id='tr' class='node tr'></span>";
    nodes += "<span id='bl' class='node bl'></span>";
    nodes += "<span id='br' class='node br'></span>";

    elementDiv.innerHTML += nodes;

    const defaultNodeSize = 8;
    let nodeSize = defaultNodeSize * zoomfact;

    if ((element.kind == "sequenceActor") || (element.kind == "sequenceObject") || (element.kind == "sequenceLoopOrAlt") || (element.kind == "sequenceActivation")) {
        mdNode = document.getElementById("md");
        mdNode.style.width = nodeSize + "px";
        mdNode.style.height = nodeSize + "px";
        mdNode.style.left = "calc(50% - " + (nodeSize / 4) + "px)";
        mdNode.style.bottom = "0%";
    }

    if (element.kind == "UMLSuperState") {
        mdNode = document.getElementById("md");
        muNode = document.getElementById("mu");
        mdNode.style.width = nodeSize + "px";
        muNode.style.width = nodeSize + "px";
        mdNode.style.height = nodeSize + "px";
        muNode.style.height = nodeSize + "px";
        mdNode.style.right = "calc(50% - " + (nodeSize / 2) + "px)";
        muNode.style.right = "calc(50% - " + (nodeSize / 2) + "px)";
    }

    nodeSize = defaultNodeSize * zoomfact;
    mrNode = document.getElementById("mr");
    mlNode = document.getElementById("ml");
    muNode = document.getElementById("mu");
    mdNode = document.getElementById("md");
    tlNode = document.getElementById("tl");
    trNode = document.getElementById("tr");
    blNode = document.getElementById("bl");
    brNode = document.getElementById("br");

    mrNode.style.width = nodeSize + "px";
    mrNode.style.top = "calc(50% - " + (nodeSize / 2) + "px)";
    mrNode.style.height = nodeSize + "px";

    mlNode.style.width = nodeSize + "px";
    mlNode.style.top = "calc(50% - " + (nodeSize / 2) + "px)";
    mlNode.style.height = nodeSize + "px";

    muNode.style.width = nodeSize + "px";
    muNode.style.height = nodeSize + "px";
    muNode.style.top = "0%";
    muNode.style.left = "calc(50% - " + (nodeSize / 2) + "px)";

    mdNode.style.width = nodeSize + "px";
    mdNode.style.height = nodeSize + "px";
    mdNode.style.bottom = "0%";
    mdNode.style.left = "calc(50% - " + (nodeSize / 2) + "px)";

    let cornerNodeSize = defaultNodeSize * zoomfact;
    tlNode.style.width = cornerNodeSize + "px";
    tlNode.style.height = cornerNodeSize + "px";
    tlNode.style.top = "0%";
    tlNode.style.left = "0%";

    trNode.style.width = cornerNodeSize + "px";
    trNode.style.height = cornerNodeSize + "px";
    trNode.style.top = "0%";
    trNode.style.right = "0%";

    blNode.style.width = cornerNodeSize + "px";
    blNode.style.height = cornerNodeSize + "px";
    blNode.style.bottom = "0%";
    blNode.style.left = "0%";

    brNode.style.width = cornerNodeSize + "px";
    brNode.style.height = cornerNodeSize + "px";
    brNode.style.bottom = "0%";
    brNode.style.right = "0%";
}
