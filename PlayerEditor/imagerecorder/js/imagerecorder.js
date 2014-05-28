function imagerecorder(canvas)
{
	var initImage = new Image();
	initImage.src = "img/firstpic.jpg";	// This is the "Click here to start recording" image.
	
	var clicked = 0;					// Check if the user has clicked to the next picture
	var logStr = '<?xml version="1.0" encoding="UTF-8"?>\n<script type="canvas">';
	var imageCanvas = canvas;
	var canvas = document.getElementById('ImageCanvas');
	var ctx = canvas.getContext('2d');
	
	var lastEvent = Date.now();
	
	var libraryName;				// name of library (writes to librarys/libraryName/) 
		
	var imagelibrary = [];			// store all paths to uploaded images
	var imageid = 0;				// used to keep track of uploaded images id
	
	var libEntered = 0;				// Check if "Ok" - Button has been pressed in the library screen

	var activeImage=-1;				// active imageData display in main canvas
	var nextImage=0;				// id of next image
	
	var imageData;					// data of the active imageData
	
	var currentImageRatio = 1;
	
	var bodyMouseX;
	var bodyMouseY;
	this.scrollAmountY = 0;
	this.currentImageWidth;
	this.currentImageHeight;
	var mouseFPS = 30;				// The amount of times a second the mousemovement will be recorded
	
	var files;						// store files thats being uploaded
	var rect = canvas.getBoundingClientRect();

	// List of log string points where an undo action is possible
	// (Used for splitting the log string where an undo is made)
	var undoPoints = [];

	mHeight = (rect.bottom - rect.top);
	mWidth = (rect.right-rect.left);

	this.maxCanvasWidth = mWidth;
	this.maxCanvasHeight = mHeight;

	addTimestep('\n<recordedCanvasSize x="' + mWidth + '" y="' + mHeight + '"/>');
	addTimestep('\n<recordedMouseFPS value="' + mouseFPS + '"/>');
	canvas.width = mWidth;
	canvas.height = mHeight;

	// Set default undo point (for resetting log to its original value)
	undoPoints.push(new UndoPoint(logStr.length, null));	

	$(document).ready(function(){
		// Hide the wrapper until library name is entered
		$(".wrapper").hide();
		
		// Get library name when user clicks OK
		$("#library-name-button").click(function(){
			var libName = $("#library-name-input").val();
			
			// Check that name length >0 && <=32
			if(libName.length > 0 && libName.length <= 32) { 
				// Only allow A-Z & 0-9 in libname
				var regExp = /[^a-z0-9]/i;
				if(!regExp.test(libName)) {
					libraryName = libName;
					
					// Check so library dont already exist in DB
					$.ajax({
						url: "check_duplicate.php",
						type: "POST",
						data: {
							lib: libraryName
						},
						cache: false,
						dataType: "json",
						success: function(data) {
							// Duplicate found, load the old library
							if(data.DUPLICATE == "true") {
								alert("Library '"+libraryName+"' already exists. Program will load pictures so you can keep working.");
								loadLibrary(data.PATH);
							}
							// Hide dialog and show wrapper
							$("#library-name-dialog").fadeOut(350);
							$(".wrapper").fadeIn(355);
							libEntered = 1; //Says that the lib-screen has been closed

							
							// Print "click to start rec" image on canvas
							showInitImage();
							updateScaleRatio();
						},
						error: function() {
							alert("Error on AJAX call (No JSON respond)");
						}
					});
					
				
					
					
					
				}
				else {
					alert("The library name can only contain characters A-Z and 0-9.");
				}
			}
			else {
				alert("The library name needs to be 1-32 characters long.");
			}
			


		});
		
		// Bind event to file input (#imageLoader in imagerecorder.php)
		$("#imageLoader").on("change", uploadImage);
				
		// Make thumbnails sortable
		$("#sortableThumbs").sortable({
			update: function() {
				rebuildImgLibrary();
			}
		});
		

		/*
		*	records clicks on canvas and pass them on to logMouseEvents() to be logged
		*/
		$('#' + imageCanvas).click(function(event){
			if(imagelibrary.length > 0) {
				// Lock thumbs & custom context menu on the first picture shown
				if(clicked == 0) {
					// Set lastEvent to now so playback doesnt start with a big delay
					lastEvent = Date.now();
					// Disable sorting thumbs
					$("#sortableThumbs").sortable("destroy");
					$("#instructbutton").hide();
					// Change upload button to 'reset'
					$("#uploadButton").attr('value', 'Reset');
					$("#uploadButton").attr('onclick', 'imgrecorder.reset();');

					// Show undo button
					$("#imagerecorder-undo").show();

					$(".thumbnail").mouseover(function() {
						$(this).css({
							"cursor": "default",
							"opacity": "0.65"
						});
					});

					// Show and log first image
					showImage(getNextImage());
					logMouseEvents();
					clicked = 1;
					// Save undo point
					createUndoPoint();
				}
				else {
					// Show next image
					// If image doesn't change, do not log the mouse click
					if (showImage(getNextImage())) {
						// Update scale ratio (for correct mouse positions)
						updateScaleRatio();

						var rect = canvas.getBoundingClientRect();

						mHeight = (rect.bottom - rect.top);
						mWidth = (rect.right-rect.left);

						logMouseEvents('\n<mouseclick x="' + xMouseReal + '" y="' + yMouseReal + '"/>');

						// Add undo point
						createUndoPoint();	
					}
				}
				
			} else {
				alert("You need to upload at least one image before you can start recording.");
			}
		});
		
		// keyboard controls
		$("body").keydown(function(event) {	
			switch(event.which) {
				// Enter
				case 13:
					// When user press enter make click on "OK" button if "Select library name" hasnt been closed yet.
					if(libEntered == 0) {
						$("#library-name-button").click();
					}
				break;
				
				// Escape
				case 27:
					if(clicked == 1) {
						reset();
					}
				break;
				
				// Arrow right
				case 39:
					if(clicked == 1) {
						showImage(getNextImage());
						logMouseEvents();
						createUndoPoint();
					}
				break;
				
				// Arrow left
				case 37:
					if(clicked == 1) {
						showImage(getPrevImage());
						logMouseEvents();
						createUndoPoint();
					}
				break;
				
				// CHAR "e" (export)
				case 69:
					exportLibrary();
				break;
				
				// CHAR "u" (upload)
				case 85:
					if(clicked == 0) {
						document.getElementById('imageLoader').click();
					}
				break;
			}
		});
		
		$(window).scroll(function(){
			imgrecorder.scrollAmountY = parseInt($(window).scrollTop());
		});	
		/*
		 *checks the mouse-position in realtime.
		 */
		var timer = null;
		var interval = false;
		var xMouseReal;
		var yMouseReal;
		$('#' + imageCanvas).mousemove(function(event){	
			var rect = canvas.getBoundingClientRect();
			mHeight = (rect.bottom - rect.top);
			mWidth = (rect.right-rect.left);
			offsetTop = ImageCanvas.offsetTop;
		
			xMouseReal = Math.round((event.clientX - ImageCanvas.offsetLeft)*(canvas.width/mWidth));
			yMouseReal = Math.round((event.clientY + imgrecorder.scrollAmountY - ImageCanvas.offsetTop)*(canvas.height/mHeight));
			
			if (interval) {
				return;
			}
			timer = window.setInterval(function() {
				appendEvString(xMouseReal,yMouseReal);
			}, parseFloat(1000/mouseFPS));
				interval = true;		
		});

		/*
		 * Update scale ratio when the window is resized
		 */
		$(window).on('resize', function(){
			if(clicked == 1) { //Checks if any clicks has been made and if the pictures been clicked it will show the right pic
				showImage(activeImage);
			}
			else{
				showInitImage();
			}

			if(libEntered == 1){ // checks if lib-name has been choosen
				resizeCanvas();
				updateScaleRatio();
			}
		});
		
		// Add save button to body
		$("#controls").append("<input type='button' class='controlbutton' id='imagerecorder-save' value='Export XML' >");
		
		// Save log when "Save log" button is clicked
		$("#imagerecorder-save").click(function(){	
			exportLibrary();
		});

		// Add undo button to body
		// Mapped to undo function, hidden by default
		$("#controls").append("<input type='button' class='controlbutton' id='imagerecorder-undo' value='Undo' >");
		$("#imagerecorder-undo").click(undo);
		$("#imagerecorder-undo").hide();
	});
	
	// Fetch mouse movement over body to use when spawning thumbnail men
	$(document).mousemove(function(e) {
		bodyMouseX = e.pageX;
		bodyMouseY = e.pageY;
	});
	
	// Hide context menu when user clicks somewhere
	$(document).click(function(e) {
		$(".thumbMenu").slideUp(100);
	});
	
	// Add menu options to images
	$(document).on("contextmenu", ".tli", function(e) {
		// Prevent default right click menu
		e.preventDefault();
		if(clicked == 0) {
			// Show thumbnail menu
			showThumbMenu($(this).index());
		}
	});
	
	function exportLibrary() {
		if(clicked == 1) {
			$.ajax({
				type: 'POST',
				url: 'logfile.php',
				data: { 
					string: logStr + "\n</script>",
					lib: libraryName,
					files: imagelibrary
				},
				success: function() {
				
					$("#export-feedback").html("<h3><strong>Successfully exported!</strong></h3><p>View your library <a target='_blank' href='../canvasrenderer/canvasrenderer.php?lib="+libraryName+"'>here</a></p>");
					$("#export-feedback").append($('<div>', {
						"class":	"closebutton",
						html:		"",
						click:		function(e) {
							$("#export-feedback").hide();
						}
					}));
				
					$("#export-feedback").fadeIn("fast");	
				}
			});
		} else {
			alert("You must start recording before you can export.");
		}
	}
	
	// Load old library
	function loadLibrary(path) {	
		if (window.XMLHttpRequest){   
		  // code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}else {	
			  // code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		// Open XML
		xmlhttp.open("GET","../canvasrenderer/"+path,false);
		xmlhttp.send();
		xmlDoc=xmlhttp.responseXML;
		
		var tmpImgSrcs = xmlDoc.getElementsByTagName("picture");
		
		for(i=0;i<tmpImgSrcs.length;i++) {
			var tmpSrc = tmpImgSrcs[i].getAttribute("src");
			imagelibrary.push(tmpSrc);
			
			addThumb("../canvasrenderer/"+tmpSrc);
		}
		
		rebuildImgLibrary()
		
	}
	
	function showThumbMenu(index) {
		// Clear old thumbMenu
		$(".thumbMenu").html("");
		// Clone thumb option
		$(".thumbMenu").append($('<a>', {
			"class":	"thumbMenuOpt",
			html:		"Clone image",
			href: 		"#",
			click:		function(e) {
				// Make the browser not go to the top of the page.
				e.preventDefault();
				
				// Select li-element by index
				var selectedli = $("#sortableThumbs .tli").eq(index);
				var imgPath = $("img", selectedli).attr("src");
				imagelibrary[imageid] = imgPath;	
				
				addThumb(imgPath);
			}
		}));
		// Delete thumb option
		$(".thumbMenu").append($('<a>', {
			"class":	"thumbMenuOpt",
			html:		"Delete image",
			href: 		"#",
			click:		function(e) {
				// Make the browser not go to the top of the page.
				e.preventDefault();
			
				var selectedli = $("#sortableThumbs .tli").eq(index);
				var imgPath = $("img", selectedli).attr("src");
				
				// Remove the thumbnail from the list
				$(selectedli).remove();
				
				// Rebuild imagelibrary arr
				rebuildImgLibrary();
				
				// Remove image source if there's no other copies of it.
				if (imagelibrary.indexOf(imgPath) == -1) {
					$.ajax({
						url: "delete.php",
						type: "POST",
						data: {
							filepath: imgPath
						},
						cache: false,
						dataType: "json",
						error: function() {
							alert("Error on AJAX call");
						}
					});
				} 
			}
		}));
		
		// Move menu to current mouse position.
		$(".thumbMenu").css({
			"display": "none",
			"left": bodyMouseX,
			"top": bodyMouseY
		});
		
		$(".thumbMenu").slideDown(250);
		
	}
	
	// Prints image as canvas
	function showImage(id) {
		if(id >= 0) {
			// Set image
			activeImage = id;
			
			// Create image
			imageData = new Image();		
			imageData.src = imagelibrary[id];
			// Show image in canvas
			showImageData();

			// Successful image change
			return true;
		} else {
			// Make a click on the "Export XML" to make the library automatically export once all images has been shown
			exportLibrary();

			// Didn't change image
			return false;
		}
	}

	// Prints the default/init image to canvas
	function showInitImage() {
		// Set init image
		imageData = new Image();
		imageData.src = "img/firstpic.jpg";
		showImageData();
		updateScaleRatio();
	}

	// Show image from the variable imageData in canvas
	function showImageData() {
		imageData.onload = function() {
			// When image has been loaded print it on the canvas. Should fix issue with Chrome not printing the image.
			imgrecorder.currentImageWidth = imageData.width;
			imgrecorder.currentImageHeight = imageData.height;
			resizeCanvas();	
			// Clears screen. May need a better solution.
			canvas.width = canvas.width; 
			var ratio = 1;
			// When image has been loaded calculate ratios and print it on the canvas
			// Picture need to be scaled down
			if (imageData.width > canvas.width || imageData.height > canvas.height) {
				// Calculate scale ratios
				var widthRatio = canvas.width / imageData.width;
				var heightRatio = canvas.height / imageData.height;

				// Set scale ratio
				if (widthRatio < heightRatio) ratio = widthRatio;
				else ratio = heightRatio;
			}
			// Daw to canvas
			ctx.drawImage(imageData,0,0, width = imageData.width*ratio, height = imageData.height*ratio);
		}
	}
	
	/*
		This function scales the canvas to the same size as the image. 
		If the image is larger than the maximum canvas size, the canvas
		is set to maxCanvasWidth (which is updated everytime the window
		is resized) and the height is set to the maxCanvasHeight*(maxCanvasWidth/currentImageWidth)
		which means that the canvas gets the same aspect ratio as the image.
	*/
	function resizeCanvas(){
		// Reset canvas size
		setCanvasWidth("100%");
		setCanvasHeight("100%");
		// Correct scale
		var rect = canvas.getBoundingClientRect();
		mHeight = (rect.bottom - rect.top);
		mWidth = (rect.right-rect.left);
		canvas.width = mWidth;
		canvas.height = mHeight; 
		imgrecorder.maxCanvasWidth = mWidth;
		imgrecorder.maxCanvasHeight = mHeight;


		var scale = imgrecorder.maxCanvasWidth/imgrecorder.currentImageWidth;
		setCanvasWidth(imgrecorder.maxCanvasWidth);
			
		setCanvasHeight((imgrecorder.currentImageHeight*scale));

		if(imgrecorder.currentImageWidth <= getCanvasWidth()) {
			setCanvasWidth(imgrecorder.currentImageWidth);
		}else {
			setCanvasWidth("100%");
		}
		
		if(imgrecorder.currentImageHeight <= getCanvasHeight()) {
			setCanvasHeight(imgrecorder.currentImageHeight);
		}else{
			setCanvasHeight("100%");
		}
		addTimestep('\n<recordedCanvasSize x="' + getCanvasWidth() + '" y="' + getCanvasHeight() + '"/>');

		
	}
	function setCanvasWidth(width) {
		$("#" + imageCanvas).width(width);
		canvas.width = getCanvasWidth();	
	}
	
	function getCanvasWidth() {
		return $("#" + imageCanvas).width();
	}

	function setCanvasHeight(height) {
		$("#" + imageCanvas).height(height);
		canvas.height = getCanvasHeight();
	}
	function getCanvasHeight() {
		return $("#" + imageCanvas).height();
	}
	
	// calculate what the next image will be
	function getNextImage() {
		// check so we dont try to fetch fields that doesnt exist
		if(activeImage < imagelibrary.length-1) {
			// If no image has been shown yet return 0
			if(activeImage == -1) {
				return 0;
			} else {
				return activeImage + 1;
			}
		} else {
			return -1;
		}
	}
	
	function getPrevImage() {
		if((activeImage - 1) >= 0) {
			return activeImage - 1;
		}
		else {
			return -1;
		}
	}
	
	// Rebuild imagelibrary
	function rebuildImgLibrary() {
		imagelibrary = [];
		activeImage = -1;
		// Loop through all li in the ul
		$("li", "#sortableThumbs").each(function(index) {
			var src = $("img", this).attr("src");
			// Rebuild arr
			imagelibrary[index] = src;
		});
	}
	
	// Calculate the image scale ratio
	function updateScaleRatio() {
		if (imageData != undefined) {
			var rect = canvas.getBoundingClientRect();
			mHeight = (rect.bottom - rect.top);
			mWidth = (rect.right-rect.left);
			// Calculate ratio
			var heightRatio = mHeight / imageData.height
			var widthRatio = mWidth / imageData.width;
			
			// Set correct ratio
			if (widthRatio < heightRatio) currentImageRatio = widthRatio;
			else currentImageRatio = heightRatio;
		}
	}
	
	// Add thumbnail 
	function addThumb(imgPath) {
		var imgStr = "<li class='tli'><img src='" + imgPath + "' class='thumbnail' title='Right click to duplicate and/or remove image'></li>";
		$("#sortableThumbs").append(imgStr);					
		imageid++;
	}
	
	// Uploads image
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
			// Show loading dialog
			$("#loading-dialog").fadeIn(250);
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
					
						for(var i = 0; i < data.SUCCESS.length; i++) {
							// data.SUCCESS contains the path to the image
							var imgPath = data.SUCCESS[i];

							// add imgpath to array
							imagelibrary.push(imgPath);
				
							addThumb(imgPath);
						}
					}
					else {
						alert(data.ERROR);
					}
				},
				error: function(data) {
					alert("AJAX call failed.");
				}
			
			});
			
			$("#loading-dialog").fadeOut(250);
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
	 *	Logging mouse-clicks.
	 */
	function logMouseEvents(str){
		// Set default string value
		if (str == undefined || str == null) {
			str = "";
		}

		var logTest;
		var chrome = window.chrome, vendorName = window.navigator.vendor;
		// Add image path (substr 9 removes "../canvasrenderer/" from path)
		if (chrome !== null && vendorName === 'Google Inc.') {
			str += '\n<picture src="'+imagelibrary[activeImage].substr(18)+ '"/>';
		}else{
			str += '\n<picture src="'+imagelibrary[activeImage].substr(18)+ '"/>';
		}

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

	// Create an undo point, making it possible to step back in recording
	function createUndoPoint(){
		// Add undo point with current log string position an image
		undoPoints.push(new UndoPoint(logStr.length, activeImage));
	}

	// Will undo the last click
	function undo(){
		// Check if an undo is possible
		if (clicked > 0) {
			// Show previous image
			var prevImage = getPrevImage();
			// Are there any possible undo points?
			if (undoPoints.length > 2) {
				// Remove last point
				undoPoints.pop();
				// Fetch point
				var point = undoPoints[undoPoints.length - 1];

				// Show previous image
				showImage(point.imageid);
				// Undo log string
				logStr = logStr.substr(0, point.stringPosition);
			}
			else {
				// No previous, should reset
				reset();
			}
		}
	}

	// Reset recording session
	function reset(){
		// Reset variables
		clicked = 0;
		lastEvent = Date.now();
		activeImage = -1;

		nextImage = 0;
		currentImageRatio = 1;

		// Clear all undo points but the first
		while (undoPoints.length > 1) {
			undoPoints.pop();
		}
		// Clear log string (keeping header and script tag)
		logStr = logStr.substr(0, undoPoints[0].stringPosition);

		// Remove undo button
		$("#imagerecorder-undo").hide();

		// Make thumbnails sortable
		$("#sortableThumbs").sortable({
			update: function() {
				rebuildImgLibrary();
			}
		});
		
		// Readd hover effect to thumbnails
		$(".thumbnail").mouseover(function() {
			$(this).css({
				"cursor": "move",
				"opacity": "1"
			});
		});
		$(".thumbnail").mouseleave(function() {
			$(this).css({
				"cursor": "move",
				"opacity": "0.65"
			});
		});

		// Show instruction button
		$("#instructbutton").show();
		
		// Hide export dialog
		$("#export-feedback").hide();

		// Clear canvas
		canvas.width = canvas.width;

		// Set init image
		showInitImage();
		updateScaleRatio();

		// Change button name and action
		$("#uploadButton").attr('value', 'Upload image');
		$("#uploadButton").attr('onclick', 'document.getElementById("imageLoader").click();');
		$("#instructbutton").show();
	}

	/*
	 * Public function for resetting the recorder
	 * Will reset the recording
	 *
	 */
	this.reset = function() {
		reset();
	}


	/*
	 * Object for storing undo positions
	 *
	 *
	 */
	 function UndoPoint(strPosition, imgID)
	 {
	 	this.stringPosition = strPosition;
	 	this.imageid = imgID;
	 }
	 
}
function showinstruction(){
 $("#instructionopacity").fadeIn("fast");
 $("#instructionwindow").fadeIn("fast");
 
}

function hideinstruction(){
$("#instructionopacity").fadeOut("fast");
 $("#instructionwindow").fadeOut("fast");
}
