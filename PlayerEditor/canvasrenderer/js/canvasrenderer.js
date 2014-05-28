// Canvas renderer
function Canvasrenderer() 
{		
	/*
	 * Playback variables
	 */
	this.paused=1;
	this.finished=0;
	this.repeat=0;
	this.playafterwind=0;
	this.firsttime = 1;
	// Array of all delayed timesteps
	this.runningTimesteps = new Array();
	// The number of valid timesteps
	this.numValidTimesteps = 0;
	// Wind to position (-1, do not wind)
	this.windpos = -1;
	// Mouse cursor image, background and position
	this.mouseCursor;
	this.mouseCursorBackground;
	this.mouseCursorX = 1;
	this.mouseCursorY = 1;
	this.mousePointerSizeX = 17;
	this.mousePointerSizeY = 23;
	this.mouseCursorScale = 1;
	// Mouse click (true, false), background and position
	this.mouseClick;
	this.mouseClickBackground;
	this.mouseClickX = 1;
	this.mouseClickY = 1;
	// Image ration, for downscaling
	this.scaleRatioX = 1;
	this.scaleRatioY = 1;
	this.scaleRatio = 1;
	this.fDelta;
	this.mouseClickRadius = 20;	
	this.recordedCanvasWidth;
	this.recordedCanvasHeight;
	this.recordedScaleRatio = 1;
	this.recordedMouseFPSValue = 0;
    	this.mouseInterpolation = true; 
    	this.downscaled = false;
	this.mImageData;
	this.currentPicture = null;
	this.preloadImages = new Array();
	this.currentPictureWidth;
	this.currentPictureHeight;
	this.currentFile;
	this.playimageIsShown = false;
	this.lastSavedClickPosX = null;
	this.lastSavedClickPosY = null;


	this.init = function(file){
		this.currentFile = file;
		this.reset();
	}

	// Function for loading XML-file
	this.loadXML = function(file) {
		if (window.XMLHttpRequest){   
			  // code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}else {	
			  // code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		this.currentFile = file;  
		// Open XML
		xmlhttp.open("GET",file,false);
		xmlhttp.send();
		xmlDoc=xmlhttp.responseXML;
		this.firsttime = 1;	
		// Load timesteps
		//this.timesteps = xmlDoc.getElementsByTagName("script")[0].childNodes;

		}
	
	
	
	// List of all valid canvas functions
	// No other operation in the XML should be possible to run
	var validFunctions = 	['bP', 'beginPath', 'mT', 'moveTo', 'lT', 'lineTo', 'stroke', 'crtLinearGrad', 'createLinearGradient', 'crtPat',
								'createPattern', 'crtRadialGrad', 'createRadialGradient', 'rec', 'rect', 'fRec', 'fillRect', 'sRec', 'strokeRect', 
								'cRec', 'clearRect', 'fill', 'cP', 'closePath', 'clip', 'quadCrvTo', 'quadraticCurveTo', 'beizCrvTo', 'beizerCurveTo',
								'arc', 'aT', 'arcTo', 'isPointInPath', 'scale', 'rot', 'rotate', 'translate', 'transform', 'mTxt', 'measureText', 'drawImg', 
								'drawImage', 'crtImgData', 'createImageData', 'getImgData', 'getImageData', 'putImgData', 'putImageData', 'save', 'crtEvent', 
								'createEvent', 'getContext', 'toDataURL', 'rest', 'restore', 'st_fs', 'state_fillStyle', 'st_ss', 'state_strokeStyle', 'st_shdwC', 
								'state_shadowColor', 'st_shdwB', 'state_shadowBlur', 'st_shdwOffsetX', 'state_shadowOffsetX', 'st_shdwOffsetY', 'state_shadowOffsetY', 
								'st_lC', 'state_lineCap', 'st_lJ', 'state_lineJoin', 'st_lW', 'state_lineWidth', 'st_miterLimit', 'state_miterLimit', 'st_font', 
								'state_font', 'st_txtAlign', 'state_textAlign', 'st_txtBaseline', 'state_textBaseline', 'st_w', 'state_width', 'st_h', 'state_height', 
								'st_data', 'state_data', 'st_gA', 'state_globalAlpha', 'st_gCO', 'state_globalCompositeOperation', 'canvasSize',
								'mousemove', 'mouseclick', 'picture', 'recordedCanvasSize', 'imageData', 'recordedMouseFPS'];
	
	$(document).ready(function(){
		$(window).on('resize', function(){
			// Scale ratio update (for correct mouse positions)
			canvas.picture(canvas.currentPicture);
		});
		
		$("#Canvas").click(function() {
			canvas.switchPlayback();
		});
		
		$("#Canvas").mouseover(function() {
			$(this).css({
				"cursor": "pointer"
			});
		});


	});

	/*
	 * Playback functions
	 *
	 */
	// Play/pause switch
	this.switchPlayback = function()

	{
		if(this.paused == 1){
			this.play();
		}
		else{
			this.pause();
		}
	}
	
	this.showPlayImage = function(){
		this.playimageIsShown = true;
		this.picture("images/firstpic.png");
	}
	this.hidePlayImage = function(){
		this.playimageIsShown = false;
		ctx.clearRect(0, 0, c.width, c.height);
	}

	// Play canvas
	this.play = function()
	{
		// First time running - clear welcome image.
		if(this.firsttime == 1) {
			ctx.clearRect(0, 0, c.width, c.height);
			this.firsttime = 0;
		}
		// Only play if we have a document
		if(this.timesteps!=null){
			this.paused=0;
			// Start over if finished
			if(this.finished == 1){
				this.reset();
			}

			// Start first timestep (will be recursive)
			t = this.runningTimesteps[this.runningTimesteps.length-1].resume();

			// Set icon
			document.getElementById("play").innerHTML="<img src='images/pause.svg'/>";
		}
	}
	
	// Pause canvas
	this.pause = function()
	{
		this.paused = 1;
		// Pause all timesteps
		this.pauseTimesteps();
		// Set icon
		document.getElementById("play").innerHTML="<img src='images/play_button.svg'/>";
	}

	// Search canvas playback
	this.search = function(event)
	{
		// Calculating search percentage (0%-100%)
		var rect = document.getElementById("barcontainer").getBoundingClientRect();
		var width = document.getElementById("barcontainer").offsetWidth;
		var percentage = (event.clientX - rect.left) / width;

		// Move to new position
		this.windto(Math.floor((this.numValidTimesteps-1) * percentage));
	}

	// Reset canvas
	this.reset = function()
	{
		this.lastUpdateSearchBar = 0;
		// Clear canvas
		ctx.clearRect(0, 0, c.width, c.height);

		// Stop and clear array of running timesteps
		this.pauseTimesteps();
		this.runningTimesteps = [];

		// Reload timesteps
		this.loadXML(this.currentFile);		
		this.preloadImages();
		
		// Print "Click to play" image
		
		this.scheduleTimesteps();

		this.finished = 0;
	}

	// Toggle repeat
	this.toggleRepeat = function()
	{
		// Toggle repeat
		if (this.repeat == 0) {
			// Repeat
			this.repeat = 1;
			document.getElementById("repeat").innerHTML="<img src='images/replay_button_activated.svg'/>";
		}else {
			// Don't repeat
			this.repeat = 0;
			document.getElementById("repeat").innerHTML="<img src='images/replay_button.svg'/>";
		}
	}

	// Skip N steps forward or backward
	this.skip = function(skippos)
	{
		if(this.timesteps != null) {
			// Calculate skippos to a tenth of the playback
			skippos *= this.numValidTimesteps / 10;
			// Calculate new position
			var windpos = this.currentPosition()+skippos;
			// Prevent error
			if(windpos<0) windpos=0;
			if(windpos>this.numValidTimesteps) windpos=this.numValidTimesteps-1;
			// Wind
			this.windto(windpos);
		}
	}

	// Fast forward or rewind to specific position
	this.windto = function(pos)
	{
		if(this.playimageIsShown && this.windpos > pos){
			this.hidePlayImage();
					

		}
		// Do not allow to change an already existing winding position
		if (this.windpos < 0) {
			// Check if it should play or pause after wind
			if (this.paused) {
				this.playafterwind = 0;
			}
			else {
				this.playafterwind = 1;
			}

			// Pause all timesteps
			this.pauseTimesteps();

			// Do not wind to own position
			if (this.currentPosition() != pos) {
				// Rewind - will need to start from the beginning
				if (pos < this.currentPosition()) {
					// Will need to start from the beginning
					this.reset();
					this.firsttime = 0;
				}

				// Calculate usable windpos (reversed array)
				this.windpos = pos;

				// Start
				this.paused = 0;
				t = this.runningTimesteps[this.runningTimesteps.length-1].resume();
			}
		}
	}

	// Calculate current position
	this.currentPosition = function()
	{
		return this.numValidTimesteps - this.runningTimesteps.length;
	}
	
	// Schedule timesteps
	this.scheduleTimesteps = function()
	{
		// Fetch timestep elements
		this.timestepElements = xmlDoc.getElementsByTagName("timestep");
		Elements = [].slice.call(this.timestepElements);

		this.timesteps = Elements.length;
		// Interpolate mouse positions
		if(this.mouseInterpolation){
			Elements = this.interpolateMousePositions(Elements, 60);
		}
		// Step through timesteps
		for(i = 0; i < Elements.length; i++){
			// Check for elements
			if(Elements[i]){
				// Fetch delay
				delay = Elements[i].getAttribute("delay");
				// Ignore timesteps with non numeric or negative delay
				if (!isNaN(delay) && delay >= 0){
					// Calculate total delay
					// Fetch timestep nodes
					nodes = [].slice.call(Elements[i].childNodes, 0); 
					nodes = this.removeNonvalidCalls(nodes);
					
					// Execute timestep nodes after specified delay
					this.runningTimesteps.push(new TimestepTimeout(delay, nodes));
				}
			}
		}
		// Reverse timestep array
		this.runningTimesteps.reverse();
		// Update number of valid timesteps
		this.numValidTimesteps = this.runningTimesteps.length;
		this.timestepElements = null;
	}
	/**
	 * This method iterates through the nodelist and adds interpolated mouse positions between all 
	 * the "mousemove" tags. The number of added nodes depends of the desired frames per second.
	**/
	this.interpolateMousePositions = function(nodes, FPS){
		if(FPS < 0) return nodes;
		if(FPS < this.recordedMouseFPSValue) return nodes;
		var retnodes = [];
		var currentX = null;
		var currentY = null;
		var currentDelay = 0;
		for(j = 0; j < nodes.length; ++j){
			childNode = [].slice.call(nodes[j].childNodes, 0); 
			currentDelay = parseInt(nodes[j].getAttribute("delay"));

			if (currentDelay <= 1000.0/ FPS){	// If delay is smaller than the targeted delay we skip this timestep completely 
				retnodes.push(nodes[j]);
				continue; 
			} 

			var multiple = currentDelay / (1000/FPS);		
			var delay = currentDelay/multiple;			// The delay in milliseconds 
			var amount = Math.floor(currentDelay/ delay);		// Number of new positions that should be added 
			var rest = nodes[j].getAttribute("delay")%multiple;	 
			var hasChanged = false;
			for(a = 0; a < childNode.length; ++a){
				if(childNode[a].nodeName == "mousemove"){
					
					newX = parseFloat(childNode[a].getAttribute("x"));
					newY = parseFloat(childNode[a].getAttribute("y"));
					if(currentX != null && currentY != null){
						hasChanged = true;
						// Add as many mousemove tags as needed
						for(i = 0; i < amount; i++){
							var iNode = nodes[j].cloneNode(true);
							iNode.childNodes[a].nodeName = "mousemove";

                      					// The interpolated position is calculated and added to the new node
							iNode.childNodes[a].setAttribute("x", parseFloat(currentX - (amount-i)*((currentX - newX) / multiple)) );
							iNode.childNodes[a].setAttribute("y", parseFloat(currentY - (amount-i)*((currentY - newY) / multiple)) );
							iNode.setAttribute("delay", delay);	
							retnodes.push(iNode);	// Adding the newly created node 
						    currentX = newX;
						    currentY = newY;
						}
					}
					else{	// If currentX and currentY is null we simply assign the values of the first mousemove position.
						currentX = newX;
						currentY = newY;
					}
				}
			}
		if(hasChanged){	// If we added any extra timesteps, we need to change the delay on the original timestep as well
			nodes[j].setAttribute("delay", delay+rest)	// Add any rest value to the first timestep
		}
          	retnodes.push(nodes[j]);	
		}
		return retnodes;
	}
	// Pause/stop all timesteps
	this.pauseTimesteps = function() {
		if (this.runningTimesteps.length > 0) {
			this.runningTimesteps[this.runningTimesteps.length-1].pause();
		}
	}
	/**
	 * This function removes all function calls from the XML
	 * that are not found in the "valid functions"-list
	 **/
	this.removeNonvalidCalls = function(nodes){
		var retnodes = new Array();
		for(a = 0; a < nodes.length; ++a){
			if(validFunctions.indexOf(nodes[a].nodeName) >= 0) { retnodes.push(nodes[a]); }
		}
		return retnodes;
	}

	// Execute timestep nodes
	this.executeTimestep = function(nodes){
		// Step through nodes
		this.fDelta = Date.now();
		var node;
		for(x = 0; x < nodes.length; x++) {
			node = nodes[x];
			// We must check for inter explorer users, since IE
			// for some reason switches places of all the node values
			var ua = window.navigator.userAgent;
            		var msie = ua.indexOf("MSIE ");
		
			// If the user runs IE, we iterate through the array and switches
			// all the node values before calling the correct function
			if(msie > 0 || !!navigator.userAgent.match(/Trident.*rv[ :]*11\./)) this.switchParameters(node);
			// Check number of arguments and call canvas function
			switch(node.attributes.length){
				case 0:
				this[node.nodeName]();
				break;
				case 1:
				this[node.nodeName](node.attributes.item(0).nodeValue);
				break;
				case 2:
				this[node.nodeName](node.attributes.item(0).nodeValue,
										node.attributes.item(1).nodeValue);
				break;
				case 3:
				this[node.nodeName](node.attributes.item(0).nodeValue, 
										node.attributes.item(1).nodeValue, 
										node.attributes.item(2).nodeValue);
				break;
				case 4:
				this[node.nodeName](node.attributes.item(0).nodeValue, 
										node.attributes.item(1).nodeValue, 
										node.attributes.item(2).nodeValue,
										node.attributes.item(3).nodeValue);
				break;
				case 5:
				this[node.nodeName](node.attributes.item(0).nodeValue, 
										node.attributes.item(1).nodeValue, 
										node.attributes.item(2).nodeValue, 
										node.attributes.item(3).nodeValue, 
										node.attributes.item(4).nodeValue);
				break;
				case 6:
				this[node.nodeName](node.attributes.item(0).nodeValue, 
										node.attributes.item(1).nodeValue, 
										node.attributes.item(2).nodeValue, 
										node.attributes.item(3).nodeValue, 
										node.attributes.item(4).nodeValue, 
										node.attributes.item(5).nodeValue);
				break;
				case 7:
				this[node.nodeName](node.attributes.item(0).nodeValue, 
										node.attributes.item(1).nodeValue, 
										node.attributes.item(2).nodeValue, 
										node.attributes.item(3).nodeValue, 
										node.attributes.item(4).nodeValue, 
										node.attributes.item(5).nodeValue, 
										node.attributes.item(6).nodeValue);
				break;
				case 8:
				this[node.nodeName](node.attributes.item(0).nodeValue,
										node.attributes.item(1).nodeValue,
										node.attributes.item(2).nodeValue,
										node.attributes.item(3).nodeValue,
										node.attributes.item(4).nodeValue,
										node.attributes.item(5).nodeValue,
										node.attributes.item(6).nodeValue,
										node.attributes.item(7).nodeValue);
				break;
				case 9:
				this[node.nodeName](node.attributes.item(0).nodeValue,
										node.attributes.item(1).nodeValue, 
										node.attributes.item(2).nodeValue, 
										node.attributes.item(3).nodeValue, 
										node.attributes.item(4).nodeValue, 
										node.attributes.item(5).nodeValue, 
										node.attributes.item(6).nodeValue, 
										node.attributes.item(7).nodeValue, 
										node.attributes.item(8).nodeValue);
				break;
			}
		}
		
		this.fDelta = Date.now() - this.fDelta;
		// Remove current step from list
		this.runningTimesteps.pop();		
		if(!this.runningTimesteps.length){
			(this.repeat == 1) ? this.restart() : this.finish();
		} 
		else {
			// Execute next step
			if (this.windpos >= 0) {
				// Fetch delay
				this.runningTimesteps[this.runningTimesteps.length-1].remaining -= this.fDelta;

				// Check if done and not trying to stop at a zero-delay timestep
				if ((this.numValidTimesteps - this.runningTimesteps.length) >= this.windpos){
					this.windpos = -1;
					this.updateSearchBar();

					// Check if we should pause or resume
					(this.playafterwind) ? this.play() : this.pause();
				}
				else {
					// Winding
					this.runningTimesteps[this.runningTimesteps.length-1].run();
				}
			}
			else {
				this.updateSearchBar();
				// Start next
				this.runningTimesteps[this.runningTimesteps.length-1].resume();
				
			}

		}
	}
	
	this.switchParameters = function(node){
		for(var i = 0; i < node.attributes.length/2; ++i){
			var temp = node.attributes.item(i).nodeValue;
			node.attributes.item(i).nodeValue = node.attributes.item(node.attributes.length-(i+1)).nodeValue;
			node.attributes.item(node.attributes.length-(i+1)).nodeValue = temp;
		}
	}	

	this.restart = function() {
		this.reset();
		this.play();
	}
	
	this.finish = function(){
		this.pause();
		this.finished = 1;
	}
	
	this.lastUpdateSearchBar = 0;
	
	this.updateSearchBar = function(){
		var fract = this.currentPosition() / this.numValidTimesteps;
		if((fract - this.lastUpdateSearchBar) > 0.015){
			document.getElementById("bar").style.width=(100*fract+'%');
			this.lastUpdateSearchBar = fract;
		}
	}
	/*
	 * Canvas functions
	 */
	this.bP = function(){
		ctx.beginPath();
	}
	 
	this.beginPath = function(){
		ctx.beginPath();
	}
	
	this.mT = function(x, y){
		ctx.moveTo(x, y);
	}

	this.moveTo = function(x, y){
		ctx.moveTo(x,y);
	}
	
	this.lT = function(x, y){
		ctx.lineTo(x, y);
	}

	this.lineTo = function(x, y){
		ctx.lineTo(x, y);
	}
	this.stroke = function(){
		ctx.stroke();
	}
	
	this.crtLinearGrad = function(x, y, x1, y1){
		ctx.createLinearGradient(x, y, x1,y1);
	}
	
	this.createLinearGradient = function(x, y, x1,y1){		      
	    ctx.createLinearGradient(x, y, x1,y1);
	}
	
	this.crtPat = function(x, y, img){
		ctx.createPattern(x ,y, img);
	}
	
	this.createPattern = function(x, y,img){		        
	    ctx.createPattern(x, y,img);
	}
	
	this.crtRadialGrad = function(x, y,r, x1,y1,r1){
		ctx.createRadialGradient(x, y,r, x1,y1,r1);
	}
	
	this.createRadialGradient = function(x, y,r, x1,y1,r1){   
	    ctx.createRadialGradient(x, y,r, x1,y1,r1);
	}	
	// Rectangle functions
	this.rec = function(x, y, w, h){
		ctx.rect(x, y, w, h);
	}
	this.rect = function(x, y, width, height){
	    ctx.rect(x, y, width, height);
	}
	
	this.fRec = function(x, y, w, h){
		ctx.fillRect(x, y, w, h);
	}
	
	this.fillRect = function(x, y, width, height){		
	    ctx.fillRect(x, y, width, height);
	}
	
	this.sRec = function(x, y, w, h){
		ctx.strokeRect(x, y, w, h);
	}
		
	this.strokeRect = function(x, y, width, height){        
	    ctx.strokeRect(x, y, width, height);
	}
	
	this.cRec = function(x, y, w, h){
		ctx.clearRect(x, y, w, h);
	}
	
	this.clearRect = function(x, y, width, height){	    
	    ctx.clearRect(x, y, width, height);
	}
	// Path functions
	this.fill = function(){	
	    ctx.fill();
	}
	
	this.cP = function(){
		ctx.closePath();
	}
	
	this.closePath = function(){       
		ctx.closePath();		
	}
	
	this.clip = function(){	   
	    ctx.clip();
	}
	
	this.quadCrvTo = function(x, y, cpx, cpy){
		ctx.quadraticCurveTo(x, y, cpx, cpy);
	}
	
	this.quadraticCurveTo = function(x, y, cpx, cpy){        
	    ctx.quadraticCurveTo(x, y, cpx, cpy);
	}
	
	this.beziCrvTo = function(x, y, cpx, cpy, cpx1, cpy1){
		ctx.bezierCurveTo(x, y, cpx, cpy, cpx1, cpy1);
	}
	
	this.bezierCurveTo = function(x, y, cpx, cpy, cpx1, cpy1){        
	     ctx.bezierCurveTo(x, y, cpx, cpy, cpx1, cpy1);
	}
	
	this.arc = function(x, y,r,sAngle,eAngle,counterclockwise){        
	    ctx.arc(x, y,r,sAngle,eAngle,counterclockwise);
	}
	
	this.aT = function(x, y, r, x1, y1){
		ctx.arcTo(x, y, r, x1, y1);
	}
	
	this.arcTo = function(x, y, r, x1, y1){
	    ctx.arcTo(x, y,r,x1,y1);
	}
	
	this.isPointInPath = function(x, y){	      
	    ctx.isPointInPath(x, y);
	}
	// Transformation functions
	this.scale = function(width, height){   
	    ctx.scale(width, height);
	}
	
	this.rot = function(angle){
		ctx.rotate(angle);
	}
		
	this.rotate = function(angle){	      
	    ctx.rotate(angle);
	}
		
	this.translate = function(x, y){	      
	    ctx.translate(x, y);
	}
	this.transform = function(a,b,c,d,e,f){
		ctx.transform(a,b,c,d,e,f);
	}
		
	this.setTransform = function(a,b,c,d,e,f){	      
	    ctx.setTransform(a,b,c,d,e,f);
	}
	
	// Text functions
	this.ftxt = function(x, y, txt, maxW){
		ctx.fillText(x, y, txt, maxW);
	}
	
	this.fillText = function(x, y,text,maxWidth){		
		ctx.fillText(x, y,text,maxWidth);
	}
	
	this.sTxt = function(x, y, txt, maxW){
		ctx.strokeText(x, y, txt, maxW);
	}

	this.strokeText = function(x, y,text,maxWidth){		
		ctx.strokeText(x, y,text,maxWidth);
	}
	
	this.mTxt = function(txt){
		ctx.measureText(txt);
	}
	
	this.measureText = function(text){		
		ctx.measureText(text);
	}
	// Image draw functions
	this.drawImg = function(img, sx, sy, sw, sh, x, y, w, h){
		ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
	}
	
	this.drawImage = function(img,sx,sy,swidth,sheight,x,y,width,height){		
		ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	}
	
	// Pixel manipulation functions
	this.crtImgData = function(imgData, w, h){
		ctx.createImageData(imgData, w, h);
	}
	
	this.createImageData = function( imageData, width, height){		
		ctx.createImageData( imageData, width, height);
	}
	
	this.getImgData = function(x, y, w, h){
		ctx.getImageData(x, y, w, h);
	}
	
	this.getImageData = function(x, y, width, height){		
		ctx.getImageData(x, y, width, height);
	}
	
	this.putImgData = function(imgData, x, y, dX, dY, dW, dH){
		ctx.putImageData(imgData, x, y, dX, dY, dW, dH);
	}
	
	this.putImageData = function(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight){		
		ctx.putImageData(this.mImageData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
	}
	this.putImageData = function(imgData, x, y){
		ctx.putImageData(this.mImageData,x,y);
	}
	this.save = function(){
		ctx.save();
	}
	
	this.crtEvent = function(){
		ctx.createEvent();
	}
	
	this.createEvent = function(){
		ctx.createEvent();
	}
	this.getContext = function(){
		ctx.getContext();
	}
	this.toDataURL = function(){
		ctx.getContext();
	}
	this.rest = function(){
		ctx.restore();
	}
	
	this.restore = function(){
		ctx.restore();
	}
	//canvas state functions
	this.st_fs = function(value){
		ctx.fillStyle = value;
	}
	
	this.state_fillStyle = function(value){
		ctx.fillStyle = value;
	}
	
	this.st_ss = function(value){
		ctx.strokeStyle = value;
	}
	
	this.state_strokeStyle = function(value){
		ctx.strokeStyle = value;
	}
	
	this.st_shdwC = function(value){
		ctx.shadowColor = value;
	}
	
	this.state_shadowColor = function(value){
		ctx.shadowColor = value;
	}
	
	this.st_shdwB = function(value){
		ctx.shadowBlur = value;
	}
	
	this.state_shadowBlur = function(value){
		ctx.shadowBlur = value;
	}
	
	this.st_shdwOffsetX = function(value){
		ctx.shadowOffsetX = value;
	}
	
	this.state_shadowOffsetX = function(value){
		ctx.shadowOffsetX = value;
	}
	
	this.st_shdwOffsetY = function(value){
		ctx.shadowOffsetY = value;
	}
	
	this.state_shadowOffsetY = function(value){
		ctx.shadwoOffsetY = value;
	}
	
	this.st_lC = function(value){
		ctx.lineCap = value;
	}
	
	this.state_lineCap = function(value){
		ctx.lineCap = value;
	}
	
	this.st_lJ = function(value){
		ctx.lineJoin = value;
	}
	
	this.state_lineJoin = function(value){
		ctx.lineJoin = value;
	}
	
	this.st_lW = function(value){
		ctx.lineWidth = value;
	}
	
	this.state_lineWidth = function(value){
		ctx.lineWidth = value;
	}
	
	this.st_miterLimit = function(value){
		ctx.miterLimit = value;
	}
	
	this.state_miterLimit = function(value){
		ctx.miterLimit = value;
	}
	
	this.st_font = function(value){
		ctx.font = value;
	}
	
	this.state_font = function(value){
		ctx.font = value;
	}
	
	this.st_txtAlign = function(value){
		ctx.textAlign = value;
	}
	
	this.state_textAlign = function(value){
		ctx.textAlign = value;
	}
	
	this.st_txtBaseline = function(value){
		ctx.textBaseline = value;
	}
	
	this.state_textBaseline = function(value){
		ctx.textBaseline = value;
	}
	
	this.st_w = function(value){
		ctx.width = value;
	}
	
	this.state_width = function(value){
		ctx.width = value;
	}
	
	this.st_h = function(value){
		ctx.height = value;
	}
	
	this.state_height = function(value){
		ctx.height = value;
	}
	
	this.st_data = function(value){
		ctx.data = value;
	}
	
	this.state_data = function(value){
		ctx.data = value;
	}
	
	this.st_gA = function(value){
		ctx.globalAlpha = value;
	}
	
	this.state_globalAlpha = function(value){
		ctx.globalAlpha = value;
	}
	
	this.st_gCO = function(value){
		ctx.globalCompositeOperation = value;
	}
	
	this.state_globalCompositeOperation = function(value){
		ctx.globalCompositeOperation = value;
	}

	this.canvasSize = function(width, height) {
		c.width = width;
		c.height = height;
	}

	this.recordedMouseFPS = function(value){
		this.recordedMouseFPSValue = value;
	}

	/**
	 * This function is used for loading stored image data from the xml.  
	 * this is not part of the interface for the HTML canvas.
	 * It basically loads all the RGBA values for each pixel as integers
	 * from the XML and stores them in a newly created image data object.
	 * This image data object is then used by putImageData whenever that function
	 * is called. 
	**/
	this.imageData = function(width, height, numberStr){
		var numArray = numberStr.split(" ");
		this.mImageData = ctx.createImageData(width, height);
		if(this.mImageData.data.length != numArray.length){ alert("ERROR: Failed to create new image data. Length mismatch."); }
		for(i = 0; i < numArray.length; ++i){
			this.mImageData.data[i] = parseInt(numArray[i]);
		}	
	}	

	/*
	 * Image drawing functions
	 */
	this.mousemove = function(x, y)
	{
		// Calculate positions using the proper scale ratio
   		// If the image was downscaled when the history was recorded, we have to multiply by the 
		// recorded scale ratio, not the current scale ratio
    		if(this.downscaled){
        		y *= canvas.recordedScaleRatio;
        		x *= canvas.recordedScaleRatio;
			x *= canvas.scaleRatio;
			y *= canvas.scaleRatio;
   		}	
        
   		// If not, we just multiply by current scale ratio 
     		else{
			if(!isNaN(canvas.scaleRatio)){
				y *= canvas.scaleRatio;
	   	 		x *= canvas.scaleRatio;
			}
		}
		if(this.mouseClickBackground){
			// Restore mouse click background
			ctx.putImageData(this.mouseClickBackground, (this.lastSavedClickPosX), (this.lastSavedClickPosY));
		}
		
		if(this.mouseCursorBackground){
			// Subtracting 1 on mouse coordinates since the mouse cursor is drawn one pixel to the left of the given coords in some browsers 
			var mX = canvas.mouseCursorX-1;		
			var mY = canvas.mouseCursorY-1;
			// Check for negative coordinates
			(mX < 0) ? mX = 0 : mX;
			(mY < 0) ? mY = 0 : mY;	

			// Restore background
			ctx.putImageData(this.mouseCursorBackground, mX, mY);
		}
		var mX = x-1;		
		var mY = y-1;
		// Check for negative coordinates
		(mX < 0) ? mX = 0 : mX;
		(mY < 0) ? mY = 0 : mY;	
		// Save background so that it can be restored after the mouse is moved again.
		this.mouseCursorBackground = ctx.getImageData( mX, mY, (this.mouseCursor.width)*this.mouseCursorScale+5, (this.mouseCursor.height)*this.mouseCursorScale+5);
		// Save mouse position
		
		this.mouseCursorX = x;
		this.mouseCursorY = y;

		// Draw mouse click (if any)
		this.drawMouseClick();
		// Draw mouse pointer. The width and height is multiplied by the mouse cursor scale ratio to scale the cursor by the same amount as the image.
		ctx.drawImage(this.mouseCursor, x, y, this.mouseCursor.width*(this.mouseCursorScale), this.mouseCursor.height*(this.mouseCursorScale));
		
	}

	this.mouseclick = function(x, y)
	{
   		// If the image was downscaled when the history was recorded, we have to multiply by the 
		// recorded scale ratio, not the current scale ratio
   		if(this.downscaled){
       		y *= canvas.recordedScaleRatio;
       		x *= canvas.recordedScaleRatio;
		x *= canvas.scaleRatio;
		y *= canvas.scaleRatio;
   		}
   		// If not, we just multiply by current scale ratio 
    	else{
    		y *= canvas.scaleRatio;
    		x *= canvas.scaleRatio;
    	}
		// Calculate positions using the proper scale ratio
		this.mouseClickX = x;
		this.mouseClickY = y;

		// Make visible/active
		this.mouseClick = true;

		// Draw mouse click
		this.drawMouseClick();

		// Remove efter 1s
		setTimeout(function(){
			canvas.mouseClick = false;
		}, 1000);
	}

	/**
	 *  This method get called when a new picture is supposed to be shown.	
 	 *  It calculates what scaling ratio should be used, and then draws the 
	 *  the new picture.
	**/
	this.picture = function(src)
	{
		if(!src) return; // no point in continueing if src is null

		// Saves the source so that the current picture can be 
		// redrawn if the window is invalidated (e.g on resize)
		this.currentPicture = src;
		// Load image
		var image = new Image();
		// Draw image when loaded
		image.onload = function() {
			// Clear canvas from old picture
			ctx.clearRect(0, 0, c.width, c.height);
			canvas.currentPictureWidth = image.width;
			canvas.currentPictureHeight = image.height;
			canvas.updateScaleRatio();
			var widthRatio = 1;
			var heightRatio = 1;
			// Calculate scale ratios
			widthRatio = c.width / (image.width);
			heightRatio = c.height / (image.height);
			// Set scale ratio
			canvas.downscaled = false;
			(widthRatio < heightRatio) ? canvas.scaleRatio = widthRatio : canvas.scaleRatio = heightRatio;
			(canvas.scaleRatio) > 1 ? canvas.scaleRatio = 1 : canvas.scaleRatio; 
			// Mouse cursor downscaling (make sure cursor/click doesn't upscale)
			canvas.mouseCursorScale = canvas.scaleRatio*2;
			if(canvas.mouseCursorScale > 1) canvas.mouseCursorScale = 1;

			// If the image size is larger than the recorded canvas width or height, it means that
			// the image was downscaled when the history was recorded. This means that we have to 
			// use the recorded scale ratio instead of the one normally used.
			if (image.width > canvas.recordedCanvasWidth || image.height > canvas.recordedCanvasHeight) {
				canvas.downscaled = true;
			}
    			ctx.drawImage(image , 0, 0, (image.width*canvas.scaleRatio), (image.height*canvas.scaleRatio));
			// New mouse cursor background 
			if(canvas.mouseCursorX >= 0 && canvas.mouseCursorY >= 0){
				// Subtracting 1 on mouse coordinates since the mouse cursor is drawn one pixel to the left of the given coords in some browsers 
				var mX = canvas.mouseCursorX-1;		
				var mY = canvas.mouseCursorY-1;
				// Checks for negative coordinates
				(mX < 0) ? mX = 0 : mX;
				(mY < 0) ? mY = 0 : mY;
				canvas.mouseCursorBackground = ctx.getImageData(mX, mY, canvas.mousePointerSizeX, canvas.mousePointerSizeY);
				// New mouse click background
				var clickPosX = ((canvas.mouseClickX - canvas.mouseClickRadius) < 0)  ? 0 : (canvas.mouseClickX - canvas.mouseClickRadius);
				var clickPosY = ((canvas.mouseClickY - canvas.mouseClickRadius) < 0) ? 0 : (canvas.mouseClickY - canvas.mouseClickRadius);
				canvas.mouseClickBackground = ctx.getImageData(clickPosX, clickPosY, canvas.mouseClickRadius*2+5, canvas.mouseClickRadius*2+5);
				// Render mouse click
			}
			canvas.drawMouseClick();
		}
		image.src = src;	
	}

	this.drawMouseClick = function() 
	{
		if(this.mouseClickX && this.mouseClickY){	
			this.lastSavedClickPosX = ((canvas.mouseClickX - canvas.mouseClickRadius) < 0) ? 0 : (canvas.mouseClickX - canvas.mouseClickRadius);
			this.lastSavedClickPosY = ((canvas.mouseClickY - canvas.mouseClickRadius) < 0) ? 0 : (canvas.mouseClickY - canvas.mouseClickRadius);
			
			this.mouseClickBackground = ctx.getImageData(this.lastSavedClickPosX, this.lastSavedClickPosY, this.mouseClickRadius*2+5, this.mouseClickRadius*2+5);
		}
		// Draw mouse click (yellow circle) if active
		if (this.mouseClick) {
			// Save previous state
			ctx.save();
			// Draw mouse click
			ctx.beginPath();
			ctx.arc(this.mouseClickX, this.mouseClickY, this.mouseClickRadius*this.mouseCursorScale, 0, 2*Math.PI);
			ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
			ctx.fill();
			// Restore previous state
			ctx.restore();
		}
	}
	
	
	/**
	*	Preload images by loading them into preloadImages-array. Browser will cache these and not reload them later on.
	**/
	this.preloadImages = function()
	{
		this.pictureTags = xmlDoc.getElementsByTagName("picture");
		
		for(i=0;i<this.pictureTags.length;i++) {
			this.preloadImages[i] = new Image();
			this.preloadImages[i].src = this.pictureTags[i].getAttribute("src");
		}
	}
	
	/**
	 * This method calculates the recorded scale ratio by dividing the
	 * current canvas size by the recorded canvas size. 
	 **/
	this.updateScaleRatio = function(){
		// Gets the actual current canvas size. Here we could've used
		// c.width and c.height instead, but the width and height
		// on the canvas are not always up to date. Getting the value
		// from getBoundingClientRect guarantees that we get the actual
		// size of the canvas on screen. 	
		var rect = c.getBoundingClientRect();
		mHeight = (rect.bottom - rect.top);
		mWidth = (rect.right-rect.left);
		
		this.scaleRatioX = parseFloat(this.currentPictureWidth/this.recordedCanvasWidth);
		this.scaleRatioY = parseFloat(this.currentPictureHeight/this.recordedCanvasHeight);
		(this.scaleRatioX < this.scaleRatioY) ? this.recordedScaleRatio = this.scaleRatioX : this.recordedScaleRatio = this.scaleRatioY;
		this.recordedScaleRatio = this.scaleRatioX;

        //if (this.scaleRatioX < this.scaleRatioY) this.scaleRatioY = this.scaleRatioX;
		
	}

	this.recordedCanvasSize = function(width, height) {
		this.recordedCanvasWidth = parseFloat(width);
		this.recordedCanvasHeight = parseFloat(height);
		this.updateScaleRatio();
	}

	/*
	*
	* Start running XML
	*
	*/
	var c = document.getElementById('Canvas');
	var ctx = c.getContext("2d");
	// Set canvas size to fit screen size
	this.canvasSize(window.innerWidth - 20, window.innerHeight - 75);
	window.addEventListener('resize', canvasSize, false);
	// Load mouse pointer image
	this.mouseCursor = new Image();
	this.mouseCursor.src = 'images/cursor.gif';
	// Set default mouse drawing values
	this.mouseCursorX = 1;
	this.mouseCursorY = 1;
	this.mouseCursorBackground = ctx.getImageData(1, 1, 1, 1);
	this.updateScaleRatio();
	this.showPlayImage();
}


/*
 * Wrapper for setTimeout, enabling pause functionality
 * Will be created as a paused timeout
 */
function TimestepTimeout(delay, args)
{
	var timerID;
	var start;
	var remaining = delay;

	// Pause timeout
	this.pause = function()
	{
		// Remove timeout and save remaining time
		if (remaining != 0) {
			clearTimeout(timerID);
		}
	}

	// Resume timout
	this.resume = function()
	{
		// Run timesteps with zero delay directly, to avoid waiting 
		// for timeout rendering etc.
		if (remaining != 0) {
			timerID = setTimeout(executeTimestep, remaining, args);
		}
		else {
			window.executeTimestep(args);
		}
	}

	// Run directly, regardless of delay
	this.run = function()
	{
		// Make sure to cancel timeout
		this.pause();
		// Execute
		window.executeTimestep(args);
	}
	// Has to be initialized, and ID to be set
	// Pause right after start
	this.pause();
}
