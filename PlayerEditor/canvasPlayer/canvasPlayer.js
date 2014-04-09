// JavaScript Document


function canvasPlayer() 
{	
	this.parseLine = function(operation){
		for(x = 0; x < operation.length; x++) {
			
			console.log(operation[x].nodeName);
			console.log(operation[x].attributes);
			if(operation[x].attributes != null){
				console.log("attribute length " + operation[x].attributes.length);
				if(operation[x].attributes.length == 0){
					window[operation[x].nodeName]();
				}
				else if(operation[x].attributes.length == 1){
					window["canvasPlayer." + operation[x].nodeName](operation[x].attributes.item(0).nodeValue);
				}
				else if(operation[x].attributes.length == 2){
					window[operation[x].nodeName](operation[x].attributes.item(0).nodeValue,operation[x].attributes.item(1).nodeValue);
				}
			}	
		}	
	}
	
	var c = document.getElementById('Canvas');
	var ctx = c.getContext("2d");
	var delay = 0;
	
	console.log('asfsaf');
	
	//this.loadXMLDoc = function(Doc) 
//	{
	console.log('loadXML');
	if (window.XMLHttpRequest){   
		  // code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
		console.log('thisone');
	}else {	
		  // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  
	}
	  
	xmlhttp.open("GET","canvas.xml",false);
  	xmlhttp.send();
  	xmlDoc=xmlhttp.responseXML;
//	  
  	timesteps = xmlDoc.getElementsByTagName("script")[0].childNodes;
	  console.log(timesteps);
	  console.log(timesteps.length);
	  //tStep = xmlDoc.getElementsByTagName("timestep");
	  var totalTime = 0;
	for(i = 0; i < timesteps.length; i++) {		 
 		//if(i > xmlDoc.getElementsByTagName("timestep").length) break;
		operation = xmlDoc.getElementsByTagName("timestep")[i].childNodes; 
		delay = operation[i].getAttribute("delay");
		totalTime += parseInt(delay);
		
		console.log("delay " + totalTime);
		
		//operation = tStep[i].childNodes;
		//this.parseLine(operation);
		setTimeout(function(){canvasPlayer.parseLine(operation)},parseInt(totalTime));
		
		
	}
	
	
	
}