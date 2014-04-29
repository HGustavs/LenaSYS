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
	// Array of all delayed timesteps
	this.runningTimesteps = new Array();
	// The number of valid timesteps
	this.numValidTimesteps = 0;
	// Wind to position (-1, do not wind)
	this.windto = -1;
	// Mouse cursor image, background and position
	this.mouseCursor;
	this.mouseCursorBackground;
	this.mouseCursorX = 1;
	this.mouseCursorY = 1;
	// Image ration, for downscaling
	this.scaleRatio = 1;
	this.startTime;
	
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
								'mousemove', 'mouseclick', 'picture'];
	

	/*
	 * Playback functions
	 *
	 */
	// Play/pause switch
	this.switch = function()
	{
		if(this.paused == 1){
			this.play();
		}
		else{
			this.pause();
		}
	}

	// Play canvas
	this.play = function()
	{
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
			document.getElementById("play").innerHTML="<img src='Images/pause.svg'/>";
		}
	}
	
	// Pause canvas
	this.pause = function()
	{
		this.paused = 1;

		// Pause all timesteps
		this.pauseTimesteps();

		// Set icon
		document.getElementById("play").innerHTML="<img src='Images/play_button.svg'/>";
	}

	// Search canvas playback
	this.search = function(event)
	{
		// Calculating search percentage (0%-100%)
		var rect = document.getElementById("barcontainer").getBoundingClientRect();
		var percentage = (event.clientX - rect.left) / rect.right;

		// Move to new position
		this.windto(Math.floor((this.numValidTimesteps-1) * percentage));
	}

	// Reset canvas
	this.reset = function()
	{
		// Clear canvas
		ctx.clearRect(0, 0, c.width, c.height);

		// Stop and clear array of running timesteps
		this.pauseTimesteps();
		this.runningTimesteps = [];

		// Reload timesteps
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
			document.getElementById("repeat").innerHTML="<img src='Images/replay_button_activated.svg'/>";
		}else {
			// Don't repeat
			this.repeat = 0;
			document.getElementById("repeat").innerHTML="<img src='Images/replay_button.svg'/>";
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
		// Check if it should play or pause after wind
		if (this.paused) {
			this.playafterwind = 0;
		}
		else {
			this.playafterwind = 1;
		}

		// Pause all timesteps
		//this.pauseTimesteps();
		this.pauseTimesteps();

		// Do not wind to own position
		if (this.currentPosition() != pos) {
			// Rewind - will need to start from the beginning
			if (pos < this.currentPosition()) {
				// Will need to start from the beginning
				this.reset();
			}

			// Calculate usable windpos (reversed array)
			this.windpos = pos;

			// Start
			this.paused = 0;
			t = this.runningTimesteps[this.runningTimesteps.length-1].resume();
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
		// Step through timesteps
		for(i = 0; i < this.timesteps.length; i++){
			// Check for elements
			if(this.timestepElements[i]){
				// Fetch delay
				delay = this.timestepElements[i].getAttribute("delay");
				// Ignore timesteps with non numeric or negative delay
				if (!isNaN(delay) && delay >= 0){
					// Calculate total delay
					// Fetch timestep nodes
					nodes = [].slice.call(this.timestepElements[i].childNodes, 0); 
					//console.log(nodes.length);
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
	}

	// Pause/stop all timesteps
	this.pauseTimesteps = function() {
		if (this.runningTimesteps.length > 0) {
			this.runningTimesteps[this.runningTimesteps.length-1].pause();
		}
	}
	this.removeNonvalidCalls = function(nodes){
		var retnodes = [];
		//console.log(nodes.length);
		for(a = 0; a < nodes.length; ++a){
			if(validFunctions.indexOf(nodes[a].nodeName) >= 0) { retnodes.push(nodes[a]); }
		}
		return retnodes;
	}
	// Execute timestep nodes
	this.executeTimestep = function(nodes){
		// Step through nodes
		var fDelta = Date.now();
		for(x = 0; x < nodes.length; x++) {
			//console.log(nodes[x].attributes);

			if(nodes[x].attributes != null){
				
				// Check number of arguments and call canvas function
				switch(nodes[x].attributes.length){
					case 0:
					this[nodes[x].nodeName]();
					break;
					case 1:
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue);
					break;
					case 2:
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue,
											nodes[x].attributes.item(1).nodeValue);
					break;
					case 3:
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue, 
											nodes[x].attributes.item(1).nodeValue, 
											nodes[x].attributes.item(2).nodeValue);
					break;
					case 4:
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue, 
											nodes[x].attributes.item(1).nodeValue, 
											nodes[x].attributes.item(2).nodeValue,
											nodes[x].attributes.item(3).nodeValue);
					break;
					case 5:
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue, 
											nodes[x].attributes.item(1).nodeValue, 
											nodes[x].attributes.item(2).nodeValue, 
											nodes[x].attributes.item(3).nodeValue, 
											nodes[x].attributes.item(4).nodeValue);
					break;
					case 6:
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue, 
											nodes[x].attributes.item(1).nodeValue, 
											nodes[x].attributes.item(2).nodeValue, 
											nodes[x].attributes.item(3).nodeValue, 
											nodes[x].attributes.item(4).nodeValue, 
											nodes[x].attributes.item(5).nodeValue);
					break;
					case 7:
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue, 
											nodes[x].attributes.item(1).nodeValue, 
											nodes[x].attributes.item(2).nodeValue, 
											nodes[x].attributes.item(3).nodeValue, 
											nodes[x].attributes.item(4).nodeValue, 
											nodes[x].attributes.item(5).nodeValue, 
											nodes[x].attributes.item(6).nodeValue);
					break;
					case 8:
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue,
											nodes[x].attributes.item(1).nodeValue,
											nodes[x].attributes.item(2).nodeValue,
											nodes[x].attributes.item(3).nodeValue,
											nodes[x].attributes.item(4).nodeValue,
											nodes[x].attributes.item(5).nodeValue,
											nodes[x].attributes.item(6).nodeValue,
											nodes[x].attributes.item(7).nodeValue);
					break;
					case 9:
					this[nodes[x].nodeName](nodes[x].attributes.item(0).nodeValue,
											nodes[x].attributes.item(1).nodeValue, 
											nodes[x].attributes.item(2).nodeValue, 
											nodes[x].attributes.item(3).nodeValue, 
											nodes[x].attributes.item(4).nodeValue, 
											nodes[x].attributes.item(5).nodeValue, 
											nodes[x].attributes.item(6).nodeValue, 
											nodes[x].attributes.item(7).nodeValue, 
											nodes[x].attributes.item(8).nodeValue);
					break;
				}
			}	
		}
		
		fDelta = Date.now() - fDelta;
		//console.log(fDelta);
		// Remove current step from list
		this.runningTimesteps.pop();

		// Update search bar
		var fract = this.currentPosition() / this.numValidTimesteps;
		document.getElementById("bar").style.width=(Math.round(fract*392) + 'px');

		// Check if done
		if(this.runningTimesteps.length <= 0){
			if(this.repeat == 1){
				// Repeat
				this.reset();
				this.play();
			}
			else{
				// Finish
				this.pause();
				alert("Finished Script in " + (Date.now() - this.startTime) + " milliseconds");
				this.finished = 1;
			}
		} 
		else {
			// Execute next step
			if (this.windpos >= 0) {
				// Fetch delay
				var delay = (this.runningTimesteps[this.runningTimesteps.length-1].getDelay() - fDelta);

				// Check if done and not trying to stop at a zero-delay timestep
				if (this.currentPosition() >= this.windpos && delay > 0) {
					this.windpos = -1;

					// Check if we should pause or resume
					if (this.playafterwind) {
						this.play();
					}
					else {
						this.pause();
					}
				}
				else {
					// Winding
					this.runningTimesteps[this.runningTimesteps.length-1].run();
				}
			}
			else {
				// Start next
				this.runningTimesteps[this.runningTimesteps.length-1].resume();
			}

		}
	}
	
	/*
	 * Canvas functions
	 */
	this.bP = function(){
		this.beginPath();
	}
	 
	this.beginPath = function(){
		ctx.beginPath();
	}
	
	this.mT = function(x, y){
		this.moveTo(x, y);
	}

	this.moveTo = function(x, y){
		ctx.moveTo(x,y);
	}
	
	this.lT = function(x, y){
		this.lineTo(x, y);
	}

	this.lineTo = function(x, y){
		ctx.lineTo(x, y);
	}
	this.stroke = function(){
		ctx.stroke();
	}
	
	this.crtLinearGrad = function(x, y, x1, y1){
		this.createLinearGradient(x, y, x1,y1);
	}
	
	this.createLinearGradient = function(x, y, x1,y1){		      
	    ctx.createLinearGradient(x, y, x1,y1);
	}
	
	this.crtPat = function(x, y, img){
		this.createPattern(x ,y, img);
	}
	
	this.createPattern = function(x, y,img){		        
	    ctx.createPattern(x, y,img);
	}
	
	this.crtRadialGrad = function(x, y,r, x1,y1,r1){
		this.createRadialGradient(x, y,r, x1,y1,r1);
	}
	
	this.createRadialGradient = function(x, y,r, x1,y1,r1){   
	    ctx.createRadialGradient(x, y,r, x1,y1,r1);
	}	
		// Rectangle functions
	this.rec = function(x, y, w, h){
		this.rect(x, y, w, h);
	}
	this.rect = function(x, y, width, height){
	    ctx.rect(x, y, width, height);
	}
	
	this.fRec = function(x, y, w, h){
		this.fillRect(x, y, w, h);
	}
	
	this.fillRect = function(x, y, width, height){		
	    ctx.fillRect(x, y, width, height);
	}
	
	this.sRec = function(x, y, w, h){
		this.strokeRect(x, y, w, h);
	}
		
	this.strokeRect = function(x, y, width, height){        
	    ctx.strokeRect(x, y, width, height);
	}
	
	this.cRec = function(x, y, w, h){
		this.clearRect(x, y, w, h);
	}
	
	this.clearRect = function(x, y, width, height){	    
	    ctx.clearRect(x, y, width, height);
	}
	// Path functions
	this.fill = function(){	
	    ctx.fill();
	}
	
	this.cP = function(){
		this.closePath();
	}
	
	this.closePath = function(){       
		ctx.closePath();		
	}
	
	this.clip = function(){	   
	    ctx.clip();
	}
	
	this.quadCrvTo = function(x, y, cpx, cpy){
		this.quadraticCurveTo(x, y, cpx, cpy);
	}
	
	this.quadraticCurveTo = function(x, y, cpx, cpy){        
	    ctx.quadraticCurveTo(x, y, cpx, cpy);
	}
	
	this.beziCrvTo = function(x, y, cpx, cpy, cpx1, cpy1){
		this.bezierCurveTo(x, y, cpx, cpy, cpx1, cpy1);
	}
	
	this.bezierCurveTo = function(x, y, cpx, cpy, cpx1, cpy1){        
	     ctx.bezierCurveTo(x, y, cpx, cpy, cpx1, cpy1);
	}
	
	this.arc = function(x, y,r,sAngle,eAngle,counterclockwise){        
	    ctx.arc(x, y,r,sAngle,eAngle,counterclockwise);
	}
	
	this.aT = function(x, y, r, x1, y1){
		this.arcTo(x, y, r, x1, y1);
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
		this.rotate(angle);
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
		this.fillText(x, y, txt, maxW);
	}
	
	this.fillText = function(x, y,text,maxWidth){		
		ctx.fillText(x, y,text,maxWidth);
	}
	
	this.sTxt = function(x, y, txt, maxW){
		this.strokeText(x, y, txt, maxW);
	}

	this.strokeText = function(x, y,text,maxWidth){		
		ctx.strokeText(x, y,text,maxWidth);
	}
	
	this.mTxt = function(txt){
		this.measureText(txt);
	}
	
	this.measureText = function(text){		
		ctx.measureText(text);
	}
	// Image draw functions
	this.drawImg = function(img, sx, sy, sw, sh, x, y, w, h){
		this.drawImage(img, sx, sy, sw, sh, x, y, w, h);
	}
	
	this.drawImage = function(img,sx,sy,swidth,sheight,x,y,width,height){		
		ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	}
	
	// Pixel manipulation functions
	this.crtImgData = function(imgData, w, h){
		this.createImageData(imgData, w, h);
	}
	
	this.createImageData = function( imageData, width, height){		
		ctx.createImageData( imageData, width, height);
	}
	
	this.getImgData = function(x, y, w, h){
		this.getImageData(x, y, w, h);
	}
	
	this.getImageData = function(x, y, width, height){		
		ctx.getImageData(x, y, width, height);
	}
	
	this.putImgData = function(imgData, x, y, dX, dY, dW, dH){
		this.putImageData(imgData, x, y, dX, dY, dW, dH);
	}
	
	this.putImageData = function(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight){		
		ctx.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
	}
	this.putImageData = function(imgData, x, y){
		ctx.putImageData(imgData, x, y);
	}
	this.save = function(){
		ctx.save();
	}
	
	this.crtEvent = function(){
		this.createEvent();
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
		this.restore();
	}
	
	this.restore = function(){
		ctx.restore();
	}
	//canvas state functions
	this.st_fs = function(value){
		this.state_fillStyle(value);
	}
	
	this.state_fillStyle = function(value){
		ctx.fillStyle = value;
	}
	
	this.st_ss = function(value){
		this.state_strokeStyle(value);
	}
	
	this.state_strokeStyle = function(value){
		ctx.strokeStyle = value;
	}
	
	this.st_shdwC = function(value){
		this.state_shadowColor(value);
	}
	
	this.state_shadowColor = function(value){
		ctx.shadowColor = value;
	}
	
	this.st_shdwB = function(value){
		this.state_shadowBlur(value);
	}
	
	this.state_shadowBlur = function(value){
		ctx.shadowBlur = value;
	}
	
	this.st_shdwOffsetX = function(value){
		this.state_shadowOffsetX(value);
	}
	
	this.state_shadowOffsetX = function(value){
		ctx.shadowOffsetX = value;
	}
	
	this.st_shdwOffsetY = function(value){
		this.state_shadowOffsetY(value);
	}
	
	this.state_shadowOffsetY = function(value){
		ctx.shadwoOffsetY = value;
	}
	
	this.st_lC = function(value){
		this.state_lineCap(value);
	}
	
	this.state_lineCap = function(value){
		ctx.lineCap = value;
	}
	
	this.st_lJ = function(value){
		this.state_lineJoin(value);
	}
	
	this.state_lineJoin = function(value){
		ctx.lineJoin = value;
	}
	
	this.st_lW = function(value){
		this.state_lineWidth(value);
	}
	
	this.state_lineWidth = function(value){
		ctx.lineWidth = value;
	}
	
	this.st_miterLimit = function(value){
		this.state_miterLimit(value);
	}
	
	this.state_miterLimit = function(value){
		ctx.miterLimit = value;
	}
	
	this.st_font = function(value){
		this.state_font(value);
	}
	
	this.state_font = function(value){
		ctx.font = value;
	}
	
	this.st_txtAlign = function(value){
		this.state_textAlign(value);
	}
	
	this.state_textAlign = function(value){
		ctx.textAlign = value;
	}
	
	this.st_txtBaseline = function(value){
		this.state_textBaseline(value);
	}
	
	this.state_textBaseline = function(value){
		ctx.textBaseline = value;
	}
	
	this.st_w = function(value){
		this.state_width(value);
	}
	
	this.state_width = function(value){
		ctx.width = value;
	}
	
	this.st_h = function(value){
		this.state_height(value);
	}
	
	this.state_height = function(value){
		ctx.height = value;
	}
	
	this.st_data = function(value){
		this.state_data(value);
	}
	
	this.state_data = function(value){
		ctx.data = value;
	}
	
	this.st_gA = function(value){
		this.state_globalAlpha(value);
	}
	
	this.state_globalAlpha = function(value){
		ctx.globalAlpha = value;
	}
	
	this.st_gCO = function(value){
		this.globalCompositeOperation(value);
	}
	
	this.state_globalCompositeOperation = function(value){
		ctx.globalCompositeOperation = value;
	}

	this.canvasSize = function(width, height) {
		c.width = width;
		c.height = height;
	}

	/*
	 * Image drawing functions
	 */
	this.mousemove = function(x, y)
	{
		// Calculate positions using the proper scale ratio
		y *= this.scaleRatio;
		x *= this.scaleRatio;
		// Restore background
		ctx.putImageData(this.mouseCursorBackground, this.mouseCursorX, this.mouseCursorY);
		// Save background
		this.mouseCursorBackground = ctx.getImageData(x ,y ,18,24);
		// Save mouse position
		this.mouseCursorX = x;
		this.mouseCursorY = y;

		// Draw mouse pointer
		ctx.drawImage(this.mouseCursor, x, y);
	}

	this.mouseclick = function(x, y)
	{
		console.log("mouseclick");
	}

	this.picture = function(src)
	{
		// Load image
		var image = new Image();
		// Draw image when loaded
		image.onload = function() {
			if (image.width > c.width || image.height > c.height)
			{
				// Calculate scale ratios
				var widthRatio = c.width / image.width;
				var heightRatio = c.height / image.height;

				// Set scale ratio
				if (widthRatio < heightRatio) canvas.scaleRatio = widthRatio;
				else canvas.scaleRatio = heightRatio;
			}
			else {
				// Draw natural ratio
				canvas.scaleRatio = 1;
			}

			// Draw scaled image
			ctx.drawImage(image , 0, 0, image.width * canvas.scaleRatio, image.height * canvas.scaleRatio);
			// New mouse cursor background
			canvas.mouseCursorBackground = ctx.getImageData(canvas.mouseCursorX, canvas.mouseCursorY, 17, 23);
		}
		image.src = src;
	} 

	/*
	 *
	 * Start running XML
	 *
	 */
	var c = document.getElementById('Canvas');
	var ctx = c.getContext("2d");
	var delay = 0;

	// Set canvas size to fit screen size
	this.canvasSize(window.innerWidth - 20, window.innerHeight - 75);
	// Load mouse pointer image
	this.mouseCursor = new Image();
	this.mouseCursor.src = 'images/cursor.gif';
	// Set default mouse drawing values
	this.mouseCursorX = 1;
	this.mouseCursorY = 1;
	this.mouseCursorBackground = ctx.getImageData(1, 1, 1, 1);
	
	if (window.XMLHttpRequest){   
		  // code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}else {	
		  // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	  
	// Open XML
	xmlhttp.open("GET","canvas4.xml",false);
  	xmlhttp.send();
  	xmlDoc=xmlhttp.responseXML;
	
  	// Load timesteps
  	this.timesteps = xmlDoc.getElementsByTagName("script")[0].childNodes;
	var totalTime = 0;

	this.scheduleTimesteps();
	this.startTime = Date.now();
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

	// Set delay (will pause)
	this.setDelay = function(delay)
	{
		this.pause();
		remaining = delay;
	}

	// Get delay
	this.getDelay = function()
	{
		return remaining;
	}

	// Has to be initialized, and ID to be set
	// Pause right after start
	this.pause();
}
