function imagerecorder(imgCanvas)
{	/*
	 * Declaring an array that will act as a picture library(for the time being), and adding pictures to the array.
	 */
	var imageCanvas = imgCanvas;
	var picArray = new Array();	
	var img = document.createElement("IMG");
	var currentImage = 0;
	var dd = new Date();
	var lastEvent = dd.getTime();
	
	this.initImages = function(){
		img.src = "pictures/1.png";
		picArray[0] = new Image();
		picArray[0] = img;
		
		var img1 = document.createElement("IMG");
		img1.src = "pictures/2.png"
		picArray[1] = new Image();
		picArray[1] = img1;

		var img2 = document.createElement("IMG");
		img2.src = "pictures/3.png"
		picArray[2] = new Image();
		picArray[2] = img2;
		
		var img3 = document.createElement("IMG");
		img3.src = "pictures/d.png"
		picArray[3] = new Image();
		picArray[3] = img3;
	}
	/*
	 *	Logging mouse-clicks. Writes the XML to the console.log in firebug.
	 */
	function log(str){
	console.log(str);
	var dd = new Date();	
	var currentTime = dd.getTime();
	var delay = currentTime - lastEvent;
	lastEvent = currentTime;
	var delayStr = "<timestep delay=" + delay + "/>";
	
	console.log(delayStr);
		 /*	
		  *	TODO: Write to a file instead of just to the log.
		  */
	}
	
	this.initImages();
	/*
	 *	jquery function that records mouse clicks to get the coordinates of the mouse pointer, 
	 *	and change the picture if the canvas is clicked.
	 */
	$(document).ready(function(){
	$("#" + imageCanvas).click(function(event){
			var xMouse = event.clientX;
			var yMouse = event.clientY;
			log(picArray[currentImage]);
			log("<mouseclick x=" + xMouse + " y=" + yMouse+ "/>");
			document.getElementById('xCord').innerHTML=xMouse;
			document.getElementById('yCord').innerHTML=yMouse;
			var canvas = document.getElementById(imageCanvas);
			var ctx=canvas.getContext("2d");
			ctx.drawImage(picArray[currentImage],0,0, width = 1280, height = 720);
			document.getElementById(imageCanvas).appendChild(picArray[currentImage]);
			if(currentImage > 0){
				document.getElementById(imageCanvas).removeChild(picArray[currentImage-1]);
			}
			currentImage++;
		});
	/*
	 *checks the mouse-position in realtime.
	 */
			$("#" + imageCanvas).mousemove(function(event){	
			var xMouseReal = event.clientX;
			var yMouseReal = event.clientY;
			document.getElementById('xCordReal').innerHTML=xMouseReal;
			document.getElementById('yCordReal').innerHTML=yMouseReal;
			});
	});
}