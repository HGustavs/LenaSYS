function imagerecorder(imgCanvas, img1)
{	/*
	 * Declaring an array that will act as a picture library(for the time being), and adding pictures to the array.
	 */
	
	// document.getElementById('XMLfile').value = '<?xml version="1.0" encoding="UTF-8"?><script type="canvas">';
	 

	 $("body").append("<input type='button' id='CanvasWrapper-save' value='Export XML' style='position:absolute;right:0;top:0'>");
		// Save log when "Save log" button is clicked
		$("#CanvasWrapper-save").click(function(){	
			alert("Saving");
			$.ajax({
				type: 'POST',
				url: 'logfile.php',
				data: { string: logStr + "\n</script>" }
			});
		});
	 
	 
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

	var logStr = '<?xml version="1.0" encoding="UTF-8"?>\n<script type="canvas">';
	
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
		var logTest;
		var chrome = window.chrome, vendorName = window.navigator.vendor;
		// Add image path
		if (chrome !== null && vendorName === 'Google Inc.') {
			str += '\n<picture src="'+pathArray[pathIndex].split('\\').pop() + '"/>';
		}else{
			str += '\n<picture src="'+pathArray[pathIndex].split('\\').pop()+ '"/>';
		}
			
		console.log(str);
		
		// Add as a timestep
		addTimestep(str);

		pathIndex++;
	}
	
	/*
	 *	jquery function that records mouse clicks to get the coordinates of the mouse pointer, 
	 *	and change the picture if the canvas is clicked.
	 */
	$(document).ready(function(){
	$('#' + imageCanvas).click(function(event){
		clicked = 1;
		var xMouse = event.clientX - ImageCanvas.offsetLeft; 
		var yMouse = event.clientY - ImageCanvas.offsetTop;
	
		document.getElementById('xCord').innerHTML=xMouse;
		document.getElementById('yCord').innerHTML=yMouse;

		// Check for better solution, regarding variable screen size
		width = 1280;
		height = 720;
		var ratio = 1;

		// Picture need to be scaled down
		if (picArray[currentImage].width > width || picArray[currentImage].height > height) {
			// Calculate scale ratios
			var widthRatio = width / picArray[currentImage].width;
			var heightRatio = height / picArray[currentImage].height;

			// Set scale ratio
			if (widthRatio < heightRatio) ratio = widthRatio;
			else ratio = heightRatio;
		}

		// Draw image in the correct ratio and size
		ctx.drawImage(picArray[currentImage],0,0, (picArray[currentImage].width*ratio), (picArray[currentImage].height*ratio));

		document.getElementById(imageCanvas).appendChild(picArray[currentImage]);
		if(currentImage > 0){
			document.getElementById(imageCanvas).removeChild(picArray[currentImage-1]);
		}
		getEvents('\n<mouseclick x="' + xMouse + '" y="' + yMouse+ '"/>');
		currentImage++;
		});
	/*
	 *checks the mouse-position in realtime.
	 */
	var timer = null;
	var interval = false;
	var xMouseReal;
	var yMouseReal;
		$('#' + imageCanvas).mousemove(function(event){	
	
		xMouseReal = event.clientX - ImageCanvas.offsetLeft;
		yMouseReal = event.clientY - ImageCanvas.offsetTop;
		document.getElementById('xCordReal').innerHTML=xMouseReal;
		document.getElementById('yCordReal').innerHTML=yMouseReal;
		
		if (interval) {
			return;
		}
		timer = window.setInterval(function() {
			appendEvString(xMouseReal,yMouseReal);
		}, 33,33333);
			interval = true;		
		});
	});
	
	function appendEvString(x, y){
		if(clicked == 1){
			addTimestep('\n<mousemove x="'+x+'" y="'+y+'"/>');
		}
	}
	
	function addTimestep(string){
		// Calculate delay
		var dd = new Date();
		var currentTime = dd.getTime();
		var delay = currentTime - lastEvent;
		lastEvent = currentTime;

		// Create timestep
		var timestep = '\n<timestep delay="' + delay + '">';
		timestep += string;
		timestep += '\n</timestep>'

		// Add to string
		log(timestep);
	}

	function log(str){		
		logStr += str;
	}
}