/**
 * @description Adds nodes for resizing to an elements
 * @param {Object} element The target element to add nodes to.
 */
function addNodes(element) {
    const elementDiv = document.getElementById(element.id);
    const defaultNodeSize = 8;
    let nodeSize = defaultNodeSize * zoomfact;
    let nodes = "";

    const createNode = (name, side) => {
        nodes += `<span id='${name}' class='node ${name}' style="height: ${nodeSize}px; width: ${nodeSize}px; ${side}: calc(50% - ${nodeSize / 2}px);"></span>`;
    };
    const createCorner = (name, sideA, sideB) => {
        nodes += `<span id='${name}' class='node ${name}' style="height: ${nodeSize}px; width: ${nodeSize}px; ${sideA}: 0%; ${sideB}: 0%;"></span>`;
    };

    if (element.kind != elementTypesNames.UMLInitialState && element.kind != elementTypesNames.UMLFinalState) {
        createNode("mr", "top");
        createNode("ml", "top");
        createNode("mu", "left");
        createNode("md", "left");
    }
    createCorner("tl", "top", "left");
    createCorner("tr", "top", "right");
    createCorner("bl", "bottom", "left");
    createCorner("br", "bottom", "right");

    elementDiv.innerHTML += nodes;
}
