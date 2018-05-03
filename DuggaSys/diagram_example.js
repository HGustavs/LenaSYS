/*
----- THIS FILE IS THE EXAMPLE DATA FOR THE DIAGRAM -----
*/
var erEntityA;

function generateExampleCode() {
    // Declare three paths
    var pathA = new Path;
    var pathB = new Path;
    var pathC = new Path;
    // Add segments to paths
    pathA.addsegment(1, 0, 1);
    pathA.addsegment(1, 1, 3);
    pathA.addsegment(1, 3, 2);
    pathA.addsegment(1, 2, 0);
    pathA.addsegment(1, 6, 7);
    pathA.addsegment(1, 7, 8);
    pathA.addsegment(1, 8, 9);
    pathA.addsegment(1, 9, 6);
    pathB.addsegment(1, 18, 17);
    pathB.addsegment(1, 17, 4);
    pathB.addsegment(1, 4, 5);
    pathB.addsegment(1, 5, 18);
    pathC.addsegment(1, 10, 11);
    pathC.addsegment(1, 11, 13);
    pathC.addsegment(1, 13, 12);
    pathC.addsegment(1, 12, 10);
    // Create a UML Class and add three attributes, two operations and a name
    classA = new Symbol(1);
    classA.name = "Person";
    classA.attributes.push({text:"+ height:Integer"});
    classA.attributes.push({text:"# at:Large"});
    classA.attributes.push({text:"- megalomania:Real"});
    classA.operations.push({text:"+ hold(name:String)"});
    classA.operations.push({text:"- makemore()"});
    classA.topLeft = 14;
    classA.bottomRight = 15;
    classA.middleDivider = 16;
    erAttributeA = new Symbol(2);
    erAttributeA.name = "SSN";
    erAttributeA.topLeft = 19;
    erAttributeA.bottomRight = 20;
    erAttributeA.centerPoint = 21;
    erAttributeB = new Symbol(2);
    erAttributeB.name = "Name";
    erAttributeB.topLeft = 22;
    erAttributeB.bottomRight = 23;
    erAttributeB.centerPoint = 24;
    erAttributeC = new Symbol(2);
    erAttributeC.name = "Smell";
    erAttributeC.topLeft = 30;
    erAttributeC.bottomRight = 31;
    erAttributeC.centerPoint = 32;
    erAttributeD = new Symbol(2);
    erAttributeD.name = "Stink";
    erAttributeD.topLeft = 33;
    erAttributeD.bottomRight = 34;
    erAttributeD.centerPoint = 35;
    erAttributeE = new Symbol(2);
    erAttributeE.name = "Verisimilitude";
    erAttributeE.topLeft = 36;
    erAttributeE.bottomRight = 37;
    erAttributeE.centerPoint = 38;
    erEntityA = new Symbol(3);
    erEntityA.name = "Person";
    erEntityA.topLeft = 25;
    erEntityA.bottomRight = 26;
    erEntityA.centerPoint = 27;
    erattributeRelA = new Symbol(4);
    erattributeRelA.topLeft = 28;
    erattributeRelA.bottomRight = 24;
    erattributeRelB = new Symbol(4);
    erattributeRelB.topLeft = 29;
    erattributeRelB.bottomRight = 21;
    // We connect the connector point to the middle point of the attribute in this case
    erattributeRelC = new Symbol(4);
    erattributeRelC.topLeft = 39;
    erattributeRelC.bottomRight = 32;
    erattributeRelD = new Symbol(4);
    erattributeRelD.topLeft = 40;
    erattributeRelD.bottomRight = 35;
    erattributeRelE = new Symbol(4);
    erattributeRelE.topLeft = 41;
    erattributeRelE.bottomRight = 38;
    erEntityA.connectorRight.push({from:28, to:24});
    erEntityA.connectorRight.push({from:29, to:21});
    erEntityA.connectorLeft.push({from:40, to:35});
    erEntityA.connectorLeft.push({from:39, to:32});
    erEntityA.connectorTop.push({from:41, to:38});
    // Add all elements to diagram
    diagram.push(erattributeRelA);
    diagram.push(erattributeRelB);
    diagram.push(erattributeRelC);
    diagram.push(pathA);
    diagram.push(pathB);
    diagram.push(pathC);
    diagram.push(classA);
    diagram.push(erAttributeA);
    diagram.push(erAttributeB);
    diagram.push(erAttributeC);
    diagram.push(erAttributeD);
    diagram.push(erAttributeE);
    diagram.push(erEntityA);
    diagram.push(erattributeRelD);
    diagram.push(erattributeRelE);
}
