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
			//console.log(windpos);
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

	/*
	 * Check if function name is valid
	 * A valid function name will return 1, invalid 0.
	 *
	 */
	 this.validFunction = function(name)
	 {
	 	// List of all valid canvas functions
		// No other operation in the XML should be possible to run
		var validFunctions = 	['beginPath', 'moveTo', 'lineTo', 'stroke', 'createLinearGradient', 'createPattern', 'createRadialGradient', 
								'rect', 'fillRect', 'strokeRect', 'clearRect', 'fill', 'closePath', 'clip', 'quadraticCurveTo', 'beizerCurveTo', 
								'arc', 'arcTo', 'isPointInPath', 'scale', 'rotate', 'translate', 'transform', 'measureText', 'drawImage', 
								'createImageData', 'getImageData', 'putImageData', 'save', 'createEvent', 'getContext', 'toDataURL', 'restore', 
								'state_fillStyle', 'state_strokeStyle', 'state_shadowColor', 'state_shadowBlur', 'state_shadowOffsetX', 
								'state_shadowOffsetY', 'state_lineCap', 'state_lineJoin', 'state_lineWidth', 'state_miterLimit', 'state_font', 
								'state_textAlign', 'state_textBaseline', 'state_width', 'state_height', 'state_data', 'state_globalAlpha', 
								'state_globalCompositeOperation'];

	 	// Compare to list of valid functions
	 	for(i=0; i<validFunctions.length; ++i){
	 		if(validFunctions[i]==name){
	 			// Function is valid
	 			return 1;
	 		}
	 	}
	 	// Function is invalid
	 	return 0;
	}

	// Schedule timesteps
	this.scheduleTimesteps = function()
	{
		// Reset total time
		var totalTime = 0;

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
					totalTime += parseInt(delay);
					// Fetch timestep nodes
					nodes = this.timestepElements[i].childNodes;

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

	// Execute timestep nodes
	this.executeTimestep = function(nodes){
		// Step through nodes
		for(x = 0; x < nodes.length; x++) {
			//console.log(nodes[x].attributes);

			if(nodes[x].attributes != null){
				//console.log("attribute length " + nodes[x].attributes.length);
				// Continue if invalid node (i.e. not in list of valid functions)
				if(!this.validFunction(nodes[x].nodeName)){ //console.log("ERROR: " + nodes[x].nodeName + " is not in valid functions-list"); 
				continue; }
				//console.log("nodes: "+nodes[x].nodeName);

				// Check number of arguments and call canvas function
				// TODO: Add for functions with more arguments
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
		
		// Remove current step from list
		this.runningTimesteps.pop();

		// Update search bar
		//var fract = this.currentPosition() / this.numValidTimesteps;
		//document.getElementById("bar").style.width=Math.round(fract*392);
		////console.log("Bar length: " + document.getElementById("bar").style.width);

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
				alert("Finished Script!");
				this.finished = 1;
			}
		} 
		else {
			// Execute next step
			if (this.windpos >= 0) {
				// Fetch delay
				var delay = this.runningTimesteps[this.runningTimesteps.length-1].getDelay();

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
	this.beginPath = function() {
		ctx.beginPath();
	}

	this.moveTo = function(x, y) {
		ctx.moveTo(x,y);
	}

	this.lineTo = function(x, y) {
		ctx.lineTo(x, y);
	}

	this.stroke = function() {
		ctx.stroke();
	}
	
	this.createLinearGradient = function(x, y, x1,y1){		      
	    ctx.createLinearGradient(x, y, x1,y1);
	}
	
	this.createPattern = function(x, y,img){		        
	    ctx.createPattern(x, y,img);
	}
	this.createRadialGradient = function(x, y,r, x1,y1,r1){   
	    ctx.createRadialGradient(x, y,r, x1,y1,r1);
	}
		
		// Rectangle functions
	this.rect = function(x, y, width, height){
	    ctx.rect(x, y, width, height);
	}
	
	this.fillRect = function(x, y, width, height){		
	    ctx.fillRect(x, y, width, height);
	}
		
	this.strokeRect = function(x, y, width, height){        
	    ctx.strokeRect(x, y, width, height);
	}
	
	this.clearRect = function(x, y, width, height){	    
	    ctx.clearRect(x, y, width, height);
	}
	// Path functions
	this.fill = function(){	
	    ctx.fill();
	}
	
	this.closePath = function(){       
		ctx.closePath();		
	}
	
	this.clip = function(){	   
	    ctx.clip();
	}
	this.quadraticCurveTo = function(x, y, cpx, cpy){        
	    ctx.quadraticCurveTo(x, y, cpx, cpy);
	}
	
	this.bezierCurveTo = function(x, y, cpx, cpy, cpx1, cpy1){        
	     ctx.bezierCurveTo(x, y, cpx, cpy, cpx1, cpy1);
	}
	
	this.arc = function(x, y,r,sAngle,eAngle,counterclockwise){        
	    ctx.arc(x, y,r,sAngle,eAngle,counterclockwise);
	}
	
	this.arcTo = function(x, y,r,x1,y1){
	    ctx.arcTo(x, y,r,x1,y1);
	}
	
	this.isPointInPath = function(x, y){	      
	    ctx.isPointInPath(x, y);
	}
	// Transformation functions
	this.scale = function(width, height){   
	    ctx.scale(width, height);
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
	this.fillText = function(x, y,text,maxWidth){		
		ctx.fillText(x, y,text,maxWidth);
	}
	this.stroketext = function(x, y,text,maxWidth){		
		ctx.strokeText(x, y,text,maxWidth);
	}
	this.measureText = function(text){		
		ctx.measureText(text);
	}
	// Image draw functions
	this.drawImage = function(img,sx,sy,swidth,sheight,x,y,width,height){		
		ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	}
	// Pixel manipulation functions
	this.createImageData = function( imageData, width, height){		
		ctx.createImageData( imageData, width, height);
	}
	this.getImageData = function(x, y, width, height){		
		ctx.getImageData(x, y, width, height);
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
	this.createEvent = function(){
		ctx.createEvent();
	}
	this.getContext = function(){
		ctx.getContext();
	}
	this.toDataURL = function(){
		ctx.getContext();
	}
	this.restore = function(){
		ctx.restore();
	}
	//canvas state functions
	this.state_fillStyle = function(value){
		ctx.fillStyle = value;
	}
	
	this.state_strokeStyle = function(value){
		ctx.strokeStyle = value;
	}
	
	this.state_shadowColor = function(value){
		ctx.shadowColor = value;
	}
	
	this.state_shadowBlur = function(value){
		ctx.shadowBlur = value;
	}
	
	this.state_shadowOffsetX = function(value){
		ctx.shadowOffsetX = value;
	}
	
	this.state_shadowOffsetY = function(value){
		ctx.shadwoOffsetY = value;
	}
	
	this.state_lineCap = function(value){
		ctx.lineCap = value;
	}
	
	this.state_lineJoin = function(value){
		ctx.lineJoin = value;
	}
	
	this.state_lineWidth = function(value){
		ctx.lineWidth = value;
	}
	
	this.state_miterLimit = function(value){
		ctx.miterLimit = value;
	}
	
	this.state_font = function(value){
		ctx.font = value;
	}
	
	this.state_textAlign = function(value){
		ctx.textAlign = value;
	}
	
	this.state_textBaseline = function(value){
		ctx.textBaseline = value;
	}
	
	this.state_width = function(value){
		ctx.width = value;
	}
	
	this.state_height = function(value){
		ctx.height = value;
	}
	
	this.state_data = function(value){
		ctx.data = value;
	}
	
	this.state_globalAlpha = function(value){
		ctx.globalAlpha = value;
	}
	
	this.state_globalCompositeOperation = function(value){
		ctx.globalCompositeOperation = value;
	}

	/*
	 *
	 * Start running XML
	 *
	 */
	var c = document.getElementById('Canvas');
	var ctx = c.getContext("2d");
	var delay = 0;
	
	if (window.XMLHttpRequest){   
		  // code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}else {	
		  // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	  
	// Open XML
	xmlhttp.open("GET","canvas.xml",false);
  	xmlhttp.send();
  	xmlDoc=xmlhttp.responseXML;
	
  	// Load timesteps
  	this.timesteps = xmlDoc.getElementsByTagName("script")[0].childNodes;
	var totalTime = 0;

	this.scheduleTimesteps();
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
