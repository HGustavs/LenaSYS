/**
 * @description Adds nodes for resizing to an elements
 * @param {Object} element The target element to add nodes to.
 */
function addNodes(element) {
    const elementDiv = document.getElementById(element.id);
    const defaultNodeSize = 8;
    let nodeSize = defaultNodeSize * zoomfact;
    let nodes = "";


    /**
    * @description creates node using name and side
    * @param {string} name - The name of the node.
    * @param {string} side - The side the node is on.
    */
    const createNode = (name, side) => {
        nodes += `<span id='${name}' class='node ${name}' style="height: ${nodeSize}px; width: ${nodeSize}px; ${side}: calc(50% - ${nodeSize / 2}px);"></span>`;
    };


    /**
    * @description creates corner node using name, sideA and sideB
    * @param {string} name - The name of the node.
    * @param {string} sideA - The side the node is on.
    * @param {string} sideB - The side the node is on.
    */
    const createCorner = (name, sideA, sideB) => {
        nodes += `<span id='${name}' class='node ${name}' style="height: ${nodeSize}px; width: ${nodeSize}px; ${sideA}: 0%; ${sideB}: 0%;"></span>`;
    };

    createCorner("tl", "top", "left");
    createCorner("tr", "top", "right");

    if (element.kind == elementTypesNames.IERelation) { 
        // Creating special nodes for IERelation, it occurs problems when using the original nodes
        createCorner("bl1", "bottom", "left");
        createCorner("br1", "bottom", "right");
    } else {
        
        createCorner("bl", "bottom", "left");
        createCorner("br", "bottom", "right");

        if (element.kind != elementTypesNames.UMLInitialState && element.kind != elementTypesNames.UMLFinalState) {
            createNode("mr", "top");
            createNode("ml", "top");
            createNode("mu", "left");
            createNode("md", "left");
        }
    }
    
    elementDiv.innerHTML += nodes;
}


