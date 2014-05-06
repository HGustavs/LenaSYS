function imagerecorder(canvas)
{
	var initImage = new Image();	
	initImage.src = "img/firstpic.png";	// This is the "Click here to start recording" image.
	
	var clicked = 0;
	var logStr = '<?xml version="1.0" encoding="UTF-8"?>\n<script type="canvas">';
	var imageCanvas = canvas;
	var canvas = document.getElementById('ImageCanvas');
	var ctx = canvas.getContext('2d');
	
	var lastEvent = 0;
	
	var libraryName;				// name of library (writes to librarys/libraryName/) 
		
	var imagelibrary = [];			// store all paths to uploaded images
	var imageid = 0;				// used to keep track of uploaded images id

	var activeImage=-1;				// active imageData display in main canvas
	var nextImage=0;				// id of next image
	
	var imageData;					// data of the active imageData
	
	var currentImageRatio = 1;
	
	var bodyMouseX;
	var bodyMouseY;
	
	var files;						// store files thats being uploaded
	
	
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
					// Hide dialog and show wrapper
					$("#library-name-dialog").fadeOut(350);
					$(".wrapper").fadeIn(355);
					
					// Print "click to start rec" image on canvas
					ctx.drawImage(initImage,0,0, width = 1280, height = 720);
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
			revert: 300,
			update: function() {
				rebuildImgLibrary();
			}
		});
		

		/*
		*	records clicks on canvas and pass them on to getEvents() to be logged
		*/
		$('#' + imageCanvas).click(function(event){
			if(imagelibrary.length > 0) {
				// Lock thumbs & custom context menu on the first picture shown
				if(clicked == 0) {
					$("#sortableThumbs").sortable("destroy");
					$("#uploadButton").hide();
					$(".thumbnail").hover(function() {
						$(this).css({
							"cursor": "default",
							"opacity": "0.65"
						});
					});
				}
			
				showImage(getNextImage());
			
				// Update scale ratio (for correct mouse positions)
				updateScaleRatio();

				clicked = 1;
				var xMouse = Math.round((event.clientX - ImageCanvas.offsetLeft)/currentImageRatio);
				var yMouse = Math.round((event.clientY - ImageCanvas.offsetTop)/currentImageRatio);
			
				document.getElementById('xCord').innerHTML=xMouse;
				document.getElementById('yCord').innerHTML=yMouse;

				getEvents('\n<mouseclick x="' + xMouse + '" y="' + yMouse+ '"/>');
			} else {
				alert("You need to upload at least one image before you can start recording.");
			}
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
			xMouseReal = Math.round((event.clientX - ImageCanvas.offsetLeft)*(canvas.width/mWidth));
			yMouseReal = Math.round((event.clientY - ImageCanvas.offsetTop)*(canvas.height/mHeight));
			//xMouseReal = Math.round((event.clientX - ImageCanvas.offsetLeft)/currentImageRatio);
			//yMouseReal = Math.round((event.clientY - ImageCanvas.offsetTop)/currentImageRatio);
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

		/*
		 * Update scale ratio when the window is resized
		 */
		$(window).on('resize', function(){
			// Scale ratio update (for correct mouse positions)
			updateScaleRatio();
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
		if(clicked == 0) {
			e.preventDefault();
			showThumbMenu($(this).index());
		}
	});
	
	function showThumbMenu(index) {
		// Clear old thumbMenu
		$(".thumbMenu").html("");
		// Clone thumb option
		$(".thumbMenu").append($('<a>', {
			"class":	"thumbMenuOpt",
			html:		"Clone image",
			href: 		"#",
			click:		function(e) {
				// Select li-element by index
				var selectedli = $("#sortableThumbs .tli").eq(index);
				var imgPath = $("img", selectedli).attr("src");
				imagelibrary[imageid] = imgPath;	
				
				// Add thumbnail
				var imgStr = "<li class='tli'><img src='" + imgPath + "' class='thumbnail'></li>";
				$("#sortableThumbs").append(imgStr).slideDown(250);
				imageid++;
			}
		}));
		// Delete thumb option
		$(".thumbMenu").append($('<a>', {
			"class":	"thumbMenuOpt",
			html:		"Delete image",
			href: 		"#",
			click:		function(e) {
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
						success: function(data) {
							console.log(data.SUCCESS);
						},
						error: function() {
							console.log("Error on AJAX call");
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
			activeImage = id;
			
			imageData = new Image();
			imageData.src = imagelibrary[id];
			
			// Clears screen. May need a better solution.
			canvas.width = canvas.width; 
			
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
		} else {
			alert("No more images to show");
		}
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
	
	// Rebuild imagelibrary
	function rebuildImgLibrary() {
		imagelibrary = [];
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
			
						// Add thumbnail
						var imgStr = "<li class='tli'><img src='" + imgPath + "' class='thumbnail'></li>";
						$("#sortableThumbs").append(imgStr);
						
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
