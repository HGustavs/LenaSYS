// Canvas renderer
function Canvasrenderer() 
{	
	// Execute timestep nodes
	this.executeTimestep = function(nodes){
		// Step through nodes
		for(x = 0; x < nodes.length; x++) {
			console.log(nodes[x].attributes);

			if(nodes[x].attributes != null){
				console.log("attribute length " + nodes[x].attributes.length);
				// Continue if invalid node (i.e. #text)
				if(nodes[x].nodeName.substring(0,1) == "#") continue;
				console.log("nodes: "+nodes[x].nodeName);

				// Check number of arguments and call canvas function
				// TODO: Add for functions with more arguments
				if(nodes[x].attributes.length == 0){
					this[nodes[x].nodeName]();
				}
				else if(nodes[x].attributes.length == 1){
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue);
				}
				else if(nodes[x].attributes.length == 2){
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue, nodes[x].attributes.item(1).nodeValue);
				}
				else if(nodes[x].attributes.length == 3){
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue, nodes[x].attributes.item(1).nodeValue, nodes[x].attributes.item(2).nodeValue);
				}
				else if(nodes[x].attributes.length == 4){
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue, nodes[x].attributes.item(1).nodeValue, nodes[x].attributes.item(2).nodeValue, nodes[x].attributes.item(3).nodeValue);
				}
				else if(nodes[x].attributes.length == 5){
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue, nodes[x].attributes.item(1).nodeValue, nodes[x].attributes.item(2).nodeValue, nodes[x].attributes.item(3).nodeValue, nodes[x].attributes.item(4).nodeValue);
				}
				else if(nodes[x].attributes.length == 6){
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue, nodes[x].attributes.item(1).nodeValue, nodes[x].attributes.item(2).nodeValue, nodes[x].attributes.item(3).nodeValue, nodes[x].attributes.item(4).nodeValue, nodes[x].attributes.item(5).nodeValue);
				}
				else if(nodes[x].attributes.length == 7){
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue, nodes[x].attributes.item(1).nodeValue, nodes[x].attributes.item(2).nodeValue, nodes[x].attributes.item(3).nodeValue, nodes[x].attributes.item(4).nodeValue, nodes[x].attributes.item(5).nodeValue, nodes[x].attributes.item(6).nodeValue);
				}
				else if(nodes[x].attributes.length == 8){
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue, nodes[x].attributes.item(1).nodeValue, nodes[x].attributes.item(2).nodeValue, nodes[x].attributes.item(3).nodeValue, nodes[x].attributes.item(4).nodeValue, nodes[x].attributes.item(5).nodeValue, nodes[x].attributes.item(6).nodeValue, nodes[x].attributes.item(7).nodeValue);
				}
				else if(nodes[x].attributes.length == 9){
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue, nodes[x].attributes.item(1).nodeValue, nodes[x].attributes.item(2).nodeValue, nodes[x].attributes.item(3).nodeValue, nodes[x].attributes.item(4).nodeValue, nodes[x].attributes.item(5).nodeValue, nodes[x].attributes.item(6).nodeValue, nodes[x].attributes.item(7).nodeValue, nodes[x].attributes.item(8).nodeValue);
				}
			}	
		}	
	}
	
	/*
	 * Canvas functions
	 */
	this.beginpath = function() {
			ctx.lineWidth = 5;
			ctx.beginPath();
	}

	this.moveto = function(x, y) {
		ctx.moveTo(x,y);
	}

	this.lineto = function(x, y) {
		ctx.lineTo(x, y);
	}

	this.stroke = function() {
		ctx.stroke();
	}
	

	/*
	 *
	 * Start running XML
	 *
	 */
	var c = document.getElementById('Canvas');
	var ctx = c.getContext("2d");
	var delay = 0;
	
	if (window.XMLHttpRequest){   
		  // code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}else {	
		  // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	  
	// Open XML
	xmlhttp.open("GET","canvas.xml",false);
  	xmlhttp.send();
  	xmlDoc=xmlhttp.responseXML;
	
  	// Load timesteps
  	timesteps = xmlDoc.getElementsByTagName("script")[0].childNodes;
	var totalTime = 0;

	// Step through timesteps
	for(i = 0; i < timesteps.length; i++){		 
		timestepElements = xmlDoc.getElementsByTagName("timestep");

		// Check for elements
		if(timestepElements[i]){
			// Fetch delay
			delay = timestepElements[i].getAttribute("delay");
			totalTime += parseInt(delay);
			
			// Fetch timestep nodes
			nodes = timestepElements[i].childNodes;

			// Execute timestep nodes after specified delay
			setTimeout(executeTimestep, totalTime, nodes);
		}
	}	
}