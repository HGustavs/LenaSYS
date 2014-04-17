function imagerecorder(imgCanvas, img1)
{	/*
	 * Declaring an array that will act as a picture library(for the time being), and adding pictures to the array.
	 */
	var imageCanvas = imgCanvas;
	var picArray = new Array();
	var pathArray = new Array();
	var currentImage = 0;
	var arrayImage = 0;
	var dd = new Date();
	var lastEvent = dd.getTime();
	var yCan = 0;
	var imgIndex = 0;
	var pathIndex = 0;
	var clicked = 0;

	var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', getImages, false);
	var canvas = document.getElementById('ImageCanvas');
	var ctx = canvas.getContext('2d');
	
	var tCanvas = document.getElementById('canvasTemp');
	var tCtx = tCanvas.getContext('2d');
	
	function getImages(e){
		var reader = new FileReader();
		reader.onload = function(event){
			var img = new Image();
			img.onload = function(){
				picArray[arrayImage] = img;
				tCtx.drawImage(picArray[arrayImage],34,yCan, width = 130, height = 130);
				arrayImage++;
				yCan += 150;
				pathArray[imgIndex] = document.getElementById('imageLoader').value;
				imgIndex++;
			}
			img.src = event.target.result;
		}
			
			reader.readAsDataURL(e.target.files[0]);
			
	}
	/*
	 *	Logging mouse-clicks. Writes the XML to the console.log in firebug.
	 */
	function getEvents(str){
		var dd = new Date();
		var currentTime = dd.getTime();
		var delay = currentTime - lastEvent;
		lastEvent = currentTime;
		var delayStr = "<timestep delay=" + delay + "/>";
		var imgPath = "<picture src="+pathArray[pathIndex].split("\\").pop()+"/>";		
		var logTest;
		var chrome = window.chrome, vendorName = window.navigator.vendor;
			if (chrome !== null && vendorName === "Google Inc.") {
				var imgPathChrome = "<picture src="+pathArray[pathIndex].split("\\").pop() + "/>";
				console.log(imgPathChrome);
				document.getElementById("XMLfile").value += imgPathChrome;
			}else{

				console.log(imgPath);
				document.getElementById("XMLfile").value += imgPath;
			}
			
 			
		console.log(delayStr);
		console.log(str);
		//console.log(logTest);
		
		document.getElementById("XMLfile").value += delayStr;
		document.getElementById("XMLfile").value += str;
		pathIndex++;
	}
	
	/*
	 *	jquery function that records mouse clicks to get the coordinates of the mouse pointer, 
	 *	and change the picture if the canvas is clicked.
	 */
	$(document).ready(function(){
	$("#" + imageCanvas).click(function(event){
		clicked = 1;
		var xMouse = event.clientX - ImageCanvas.offsetLeft; 
		var yMouse = event.clientY - ImageCanvas.offsetTop;
	
		document.getElementById('xCord').innerHTML=xMouse;
		document.getElementById('yCord').innerHTML=yMouse;

		ctx.drawImage(picArray[currentImage],0,0, width = 1280, height = 720);
		document.getElementById(imageCanvas).appendChild(picArray[currentImage]);
		if(currentImage > 0){
			document.getElementById(imageCanvas).removeChild(picArray[currentImage-1]);
		}
		getEvents("<mouseclick x=" + xMouse + " y=" + yMouse+ "/>");
		currentImage++;
		});
	/*
	 *checks the mouse-position in realtime.
	 */
		$("#" + imageCanvas).mousemove(function(event){	
		var xMouseReal = event.clientX - ImageCanvas.offsetLeft;
		var yMouseReal = event.clientY - ImageCanvas.offsetTop;
		document.getElementById('xCordReal').innerHTML=xMouseReal;
		document.getElementById('yCordReal').innerHTML=yMouseReal;
		
				appendEvString(xMouseReal,yMouseReal);
			
		});
	});
	function appendEvString(x, y){
		var mouseMovement = "<Mousemove x="+x+" y="+y+"/>";
		if(clicked == 1){
			log(mouseMovement);
			console.log(mouseMovement);
		}
	}

	function log(str){
	
		document.getElementById("XMLfile").value += str;
	
	}
}