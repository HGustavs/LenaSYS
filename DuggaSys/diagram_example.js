/**
 * Created by mataddas on 2017-03-30.
 * lbl
 */
points=[
						// Path A -- Segment 1 (0,1,2,3)
						{x:20,y:200,selected:0},{x:60,y:200,selected:0},{x:100,y:40,selected:0},{x:140,y:40,selected:0},
						// Path B -- Segment 1 (4,5 and 17,18)
						{x:180,y:200,selected:0},{x:220,y:200,selected:0},
						// Path A -- Segment 2 (6,7,8,9)
						{x:300,y:250,selected:0},{x:320,y:250,selected:0},{x:320,y:270,selected:0},{x:300,y:270,selected:0},
            // Path C -- Segment 1 (10,11,12,13)
            {x:70,y:130,selected:0},{x:70,y:145,selected:0},{x:170,y:130,selected:0},{x:170,y:145,selected:0},
            // Class A -- TopLeft BottomRight MiddleDivider 14,15,16
            {x:310,y:60,selected:0},{x:400,y:160,selected:0},{x:355,y:115,selected:0},
						// Path B -- Segment 1 (4,5 and 17,18)
            {x:100,y:40,selected:0},{x:140,y:40,selected:0},
						// ER Attribute A -- TopLeft BottomRight MiddlePointConnector 19,20,21
            {x:300,y:200,selected:0},{x:400,y:250,selected:0},{x:350,y:225,selected:0},
						// ER Attribute B -- TopLeft BottomRight MiddlePointConnector 22,23,24
            {x:300,y:275,selected:0},{x:400,y:325,selected:0},{x:350,y:300,selected:0},
						// ER Entity A -- TopLeft BottomRight MiddlePointConnector 25,26,27
            {x:150,y:275,selected:0},{x:250,y:325,selected:0},{x:200,y:300,selected:0},
						// ER Entity Connector Right Points -- 28,29
            {x:225,y:290,selected:1},
            {x:225,y:310,selected:1},

						// ER Attribute C -- TopLeft BottomRight MiddlePointConnector 30,31,32
					  {x:15,y:275,selected:0},{x:115,y:325,selected:0},{x:65,y:300,selected:0},
						// ER Attribute D -- TopLeft BottomRight MiddlePointConnector 33,34,35
						{x:15,y:350,selected:0},{x:115,y:400,selected:0},{x:65,y:375,selected:0},
						// ER Attribute E -- TopLeft BottomRight MiddlePointConnector 36,37,38
            {x:15,y:200,selected:0},{x:115,y:250,selected:0},{x:65,y:225,selected:0},

						// ER Entity Connector Left Points -- 39,40,41
					  {x:150,y:225,selected:0},
					  {x:150,y:235,selected:0},
					  {x:150,y:245,selected:0},

           ];

// Demo data for testing purposes.

 function makegfx()
 {
 		// Declare three paths
 		var pathA=new Path;
 		var pathB=new Path;
 		var pathC=new Path;

 		// Add segments to paths
 	/*	pathA.addsegment(1,0,1);
 		pathA.addsegment(1,1,3);
 		pathA.addsegment(1,3,2);
 		pathA.addsegment(1,2,0);

 		pathA.addsegment(1,6,7);
 		pathA.addsegment(1,7,8);
 		pathA.addsegment(1,8,9);
 		pathA.addsegment(1,9,6);

 		pathB.addsegment(1,18,17);
 		pathB.addsegment(1,17,4);
 		pathB.addsegment(1,4,5);
 		pathB.addsegment(1,5,18);
*/
 		pathC.addsegment(1,10,11);
 		pathC.addsegment(1,11,13);
 		pathC.addsegment(1,13,12);
 		pathC.addsegment(1,12,10);

 		// Create a UML Class and add three attributes, two operations and a name
 		classA = new Symbol(1);

 		classA.name="Person";

 		classA.operations.push({visibility:"+",text:"hold(name:String)"});
 		classA.operations.push({visibility:"-",text:"makemore()"});

 		classA.attributes.push({visibility:"+",text:"height:Integer"});
 		classA.attributes.push({visibility:"#",text:"at:Large"});
 		classA.attributes.push({visibility:"-",text:"megalomania:Real"});

 		classA.topLeft=14;
 		classA.bottomRight=15;
 		classA.middleDivider=16;

 		erAttributeA = new Symbol(2);
 		erAttributeA.name="SSN";
 		erAttributeA.topLeft=19;
 		erAttributeA.bottomRight=20;
 		erAttributeA.centerpoint=21;

 		erAttributeB = new Symbol(2);
 		erAttributeB.name="Name";
 		erAttributeB.topLeft=22;
 		erAttributeB.bottomRight=23;
 		erAttributeB.centerpoint=24;

 		erAttributeC = new Symbol(2);
 		erAttributeC.name="Smell";
 		erAttributeC.topLeft=30;
 		erAttributeC.bottomRight=31;
 		erAttributeC.centerpoint=32;

 		erAttributeD = new Symbol(2);
 		erAttributeD.name="Stink";
 		erAttributeD.topLeft=33;
 		erAttributeD.bottomRight=34;
 		erAttributeD.centerpoint=35;

 		erAttributeE = new Symbol(2);
 		erAttributeE.name="Verisimilitude";
 		erAttributeE.topLeft=36;
 		erAttributeE.bottomRight=37;
 		erAttributeE.centerpoint=38;

 		erEntityA = new Symbol(3);
 		erEntityA.name="Person";
 		erEntityA.topLeft=25;
 		erEntityA.bottomRight=26;
 		erEntityA.centerpoint=27;

 		erattributeRelA = new Symbol(4);
 		erattributeRelA.topLeft=28;
 		erattributeRelA.bottomRight=24;

 		erattributeRelB = new Symbol(4);
 		erattributeRelB.topLeft=29;
 		erattributeRelB.bottomRight=21;

 		// We connect the connector point to the middle point of the attribute in this case
 		erattributeRelC = new Symbol(4);
 		erattributeRelC.topLeft=39;
 		erattributeRelC.bottomRight=32;

 		erattributeRelD = new Symbol(4);
 		erattributeRelD.topLeft=40;
 		erattributeRelD.bottomRight=35;

 		erattributeRelE = new Symbol(4);
 		erattributeRelE.topLeft=41;
 		erattributeRelE.bottomRight=38;

 		erEntityA.connectorRight.push({from:28,to:24});
 		erEntityA.connectorRight.push({from:29,to:21});

 		erEntityA.connectorLeft.push({from:40,to:35});
 		erEntityA.connectorLeft.push({from:39,to:32});

 		erEntityA.connectorTop.push({from:41,to:38});

 		// Add all elements to diagram
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
 		diagram.push(erattributeRelA);
 		diagram.push(erattributeRelB);
 		diagram.push(erattributeRelC);
 		diagram.push(erattributeRelD);
 		diagram.push(erattributeRelE);

 }
