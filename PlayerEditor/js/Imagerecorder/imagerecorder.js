function imagerecorder(imgCanvas)
{	/*
	 * Declaring an array that will act as a picutre library(for the time being), and adding pictures to the array.
	 */
	var imageCanvas = imgCanvas;
	var picArray = new Array();	
	var img = document.createElement("IMG");
	
	
	
	var currentImage = 0;
	
	this.initImages = function(){
		img.src = "pictures/a.png";
		picArray[0] = new Image();
		picArray[0] = img;
		
		var img1 = document.createElement("IMG");
		img1.src = "pictures/b.png"
		picArray[1] = new Image();
		picArray[1] = img1;

		var img2 = document.createElement("IMG");
		img2.src = "pictures/c.png"
		picArray[2] = new Image();
		picArray[2] = img2;
		
		var img3 = document.createElement("IMG");
		img3.src = "pictures/d.png"
		picArray[3] = new Image();
		picArray[3] = img3;
	}
	function log(){
	
		// todo: implement logging 
	
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
			log();
			document.getElementById('xCord').innerHTML=xMouse;
			document.getElementById('yCord').innerHTML=yMouse;
			var canvas = document.getElementById(imageCanvas);
			var ctx=canvas.getContext("2d");
			ctx.drawImage(picArray[currentImage],0,0);
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