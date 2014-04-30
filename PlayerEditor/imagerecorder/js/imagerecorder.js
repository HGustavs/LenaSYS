function imagerecorder(canvas)
{
	var clicked = 0;
	var logStr = '<?xml version="1.0" encoding="UTF-8"?>\n<script type="canvas">';
	var imageCanvas = canvas;
	var canvas = document.getElementById('ImageCanvas');
	var ctx = canvas.getContext('2d');
	
	var lastEvent = 0;
	
	var libraryName;			// name of library (writes to librarys/libraryName/) 
		
	var imagelibrary = [];		// store all paths to uploaded images
	var imageid = 0;			// used to identify ID of uploaded imageData.
	var activeImage;			// active imageData display in main canvas
	var imageData;				// data of the active imageData
	
	var currentImageRatio = 1;
	
	var files;					// store files thats being uploaded
	
	
	$(document).ready(function(){
		// Hide the wrapper until library name is entered
		$(".wrapper").hide();
		
		// Get library name when user clicks OK
		$("#library-name-button").click(function(){
			var libName = $("#library-name-input").val();
			
			if(libName == ""){
				alert("Please fill the libaryname");
			}
			// Check that name length >0
			if(libName.length > 0) { 
				// TODO: Sanitize input (can't create folders with "? \ :"-chars etc.)
				if(1 == 1) {
					libraryName = libName;
					// Hide dialog and show wrapper
					$("#library-name-dialog").fadeOut(350);
					$(".wrapper").fadeIn(355);
				} else {
					alert("Please only use A-Z 0-9");
				}
			}
		});
		
		// Bind event to file input (#imageLoader in imagerecorder.php)
		$("#imageLoader").on("change", uploadImage);
		
		
		// Show image when user clicks thumbnails
		$('body').on('click', '.thumbnail', function () {
			var id = $(this).attr('id').substr(1);
			showImage(id);
		});
		

		/*
		*	records clicks on canvas and pass them on to getEvents() to be logged
		*/
		$('#' + imageCanvas).click(function(event){
			// Update scale ratio (for correct mouse positions)
			updateScaleRatio();

			clicked = 1;
			var xMouse = Math.round((event.clientX - ImageCanvas.offsetLeft)/currentImageRatio);
			var yMouse = Math.round((event.clientY - ImageCanvas.offsetTop)/currentImageRatio);
		
			document.getElementById('xCord').innerHTML=xMouse;
			document.getElementById('yCord').innerHTML=yMouse;

			getEvents('\n<mouseclick x="' + xMouse + '" y="' + yMouse+ '"/>');
		});
		/*
		 *checks the mouse-position in realtime.
		 */
		var timer = null;
		var interval = false;
		var xMouseReal;
		var yMouseReal;
		$('#' + imageCanvas).mousemove(function(event){	
			// Update scale ratio (for correct mouse positions)
			// TODO: Should probably only be done on click and window resize
			updateScaleRatio();

			xMouseReal = Math.round((event.clientX - ImageCanvas.offsetLeft)/currentImageRatio);
			yMouseReal = Math.round((event.clientY - ImageCanvas.offsetTop)/currentImageRatio);
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
		
		// Add save button to body
		$("#controls").append("<input type='button' class='controlbutton' id='imagerecorder-save' value='Export XML' >");
		// Save log when "Save log" button is clicked
		$("#imagerecorder-save").click(function(){	
			alert("Saving");
			$.ajax({
				type: 'POST',
				url: 'logfile.php?lib=' + libraryName,
				data: { string: logStr + "\n</script>" }
			});
		});
	});
	
	// Prints image as canvas
	function showImage(id) {
		activeImage = id;
		imageData = new Image();
		imageData.src = imagelibrary[id];
		
		// Clears screen. May need a better solution.
		canvas.width = canvas.width; 

		// Ratio used for scaling and stuff
		var ratio = 1;

		// Picture need to be scaled down
		if (imageData.width > canvas.width || imageData.height > canvas.height) {
			// Calculate scale ratios
			var widthRatio = canvas.width / imageData.width;
			var heightRatio = canvas.height / imageData.height;

			// Set scale ratio
			if (widthRatio < heightRatio) ratio = widthRatio;
			else ratio = heightRatio;
		}

		ctx.drawImage(imageData,0,0, width = imageData.width*ratio, height = imageData.height*ratio);
	}

	// Calculate the image scale ratio
	function updateScaleRatio() {
		if (imageData != undefined) {
			// Calculate ratio
			var heightRatio = ImageCanvas.offsetHeight / imageData.height
			var widthRatio = ImageCanvas.offsetWidth / imageData.width;
			
			// Set correct ratio
			if (widthRatio < heightRatio) currentImageRatio = widthRatio;
			else currentImageRatio = heightRatio;
		}
	}
	
	// Uploads image
	// TODO: Check file extensions
	function uploadImage(event) {
		files = event.target.files;
		event.stopPropagation();
		event.preventDefault();
		
		var filedata = new FormData();
		$.each(files, function(key, value) {
			filedata.append(key, value);
		});
		
		var fileName = document.getElementById("imageLoader").value;
		var fileExt = fileName.split('.').pop();
		
		if(validExtension(fileExt)) {		
			// Upload the file.
			$.ajax({
				url: "upload.php?lib="+libraryName,
				type: "POST",
				data: filedata,
				cache: false,
				dataType: "json",
				processData: false,
				contentType: false,
				success: function(data) {
					if(typeof data.SUCCESS !== "undefined") {
						// data.SUCCESS contains the path to the image
						var imgPath = data.SUCCESS;
						
						// add imgpath to array
						imagelibrary[imageid] = imgPath;
			
						// Add thumbnail. ID is associated with imagelibrary (first upload will be 0). X is there because
						// HTML dont want ID:s starting with numbers. The X is later stripped.
						var imgStr = "<img src='" + imgPath + "' class='thumbnail' id='X"+imageid+"'>";
						$("#thumbnails").append(imgStr);
						
						imageid++;
					}
					else {
						alert(data.ERROR);
					}
				},
				error: function(data) {
					alert("AJAX call failed.");
				}
			
			});
		}
		// Invalid file ext
		else {
			alert("It's not possible to upload this file extension.");
		}

	}
	
	// Check if uploaded image has a valid extension
	function validExtension(extension) {
		var validExtensions =	["jpg", "jpeg", "png", "gif", "bmp"];
		for(i=0;i<validExtensions.length;++i) {
			if(validExtensions[i] == extension.toLowerCase()) {
				return true;
			}
		}
		return false;
	}

	
	/*
	 *	Logging mouse-clicks. Writes the XML to the console.log in firebug.
	 */
	function getEvents(str){	
		var logTest;
		var chrome = window.chrome, vendorName = window.navigator.vendor;
		// Add image path (substr 9 removes "librarys" from path)
		if (chrome !== null && vendorName === 'Google Inc.') {
			str += '\n<picture src="'+imagelibrary[activeImage].substr(9)+ '"/>';
		}else{
			str += '\n<picture src="'+imagelibrary[activeImage].substr(9)+ '"/>';
		}
			
		console.log(str);
		
		// Add as a timestep
		addTimestep(str);
	}
	
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