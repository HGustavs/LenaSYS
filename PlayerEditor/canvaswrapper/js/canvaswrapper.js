	/*
	 *
	 *  This function acts as a wrapper to a canvas object. It logs
	 *  every function call before forwarding the call to the canvas.
	 *
	 */ 
	function captureCanvas(canvas){
		// Add save button to BODY
		$("body").append("<input type='button' id='CanvasWrapper-save' value='Save log' style='position:absolute;right:5px;top:35px;'>");
		// Save log when "Save log" button is clicked
		$("#CanvasWrapper-save").click(function(){
			if(inTimestepDelay){ 
				str += "</timestep>\n";
				inTimestepDelay = false;
			}
			
			$.ajax({
				type: 'POST',
				dataType: "json",
				url: 'logfile.php',
				data: { string: str + "</script>" },
				
				success: function(data) {
					// script ran successfully
					if(typeof data.SUCCESS !== "undefined") {
						$("body").append("<div style='position:absolute;right:5px;top:65px;'><a href='../canvasrenderer/canvasrenderer.php?file=" + data.SUCCESS + "' target='_blank'>Go to playback</a></div>");
					}
					else {
						alert(data.ERROR);
					}
				},
				error: function(data) {
					alert("Error on AJAX call");
				}
			});
		});
		
		var optimize = false;

		$("body").append("<input type='button' id='XML_type' value='Make optimized XML' style='position:absolute;right:5px;top:5px'>");
		//Optimize the xml.
		$("#XML_type").click(function(){
			if(optimize == false){
				optimize = true;
				this.value = "Make normal XML";
			}
			else{
				optimize = false;
				this.value = "Make optimized XML";
			}			
		});

		var str='<?xml version="1.0" encoding="UTF-8"?>\n';
		var lastTimestep = new Date().getTime();
		
		// Add script tag
		str += '<script type="canvas">\n';
		if(canvas == undefined) alert("Error");
		this.canvas=canvas;
		
		// This is the actual canvas object
	    this.ctx = canvas.getContext('2d');
	    this.lineWidth = this.ctx.lineWidth;
		this.lineJoin = this.ctx.lineJoin;
		this.miterLimit = this.ctx.miterLimit;
		this.lineCap = this.ctx.lineCap;
		
		//Color,shadow and style.
		var fillStyle = this.ctx.fillStyle;
		var strokeStyle = this.ctx.strokeStyle;
		this.shadowColor = this.ctx.shadowColor;
		this.shadowBlur = this.ctx.shadowBlur;
		this.shadowOffsetX = this.ctx.shadowOffsetX;
		this.shadowOffsetY = this.ctx.shadowOffsetY;
		var inTimestepDelay = false;
		
		//Text property.
		this.font = this.ctx.font;
		this.textAlign = this.ctx.textAlign;
		this.textBaseline = this.ctx.textBaseline;

		//PixelManipulation property.
		this.canvas = function(){
			this.width = this.ctx.width;
			this.height = this.ctx.height;
		}
		
		
		//Compositing property.
		this.globalAlpha = this.ctx.globalAlpha;
		this.globalCompositeOperation = this.ctx.globalCompositeOperation;
		
		// Log XML line
		this.log = function(string){
			var timestep = new Date().getTime();

			// Calculate delay
			var delay = timestep - lastTimestep;
			// Update timestep
			lastTimestep = timestep;
			
			// Set string
			if(delay == 0){
				if(inTimestepDelay){
					str += string + '\n';
				}
				else{
					inTimestepDelay = true;
					str += '<timestep delay="' + delay + '">' + "\n";
					str += string + "\n";
				}
			}
			else{
				if(inTimestepDelay){
					str += '</timestep>' + '\n';
					inTimestepDelay = false;
				}
				str += '<timestep delay="' + delay + '">' + '\n';
				str += string + '\n';
				str += '</timestep>' + '\n';
				
			}
		}

		this.beginPath = function(){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<bP/>');
			}else{
				this.log('<beginPath/>');
			}
	        this.ctx.beginPath();
	    }
	    
	    this.moveTo = function(x, y){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<mT x="'+x+'" y="'+y+'"/>');
			}else{
				this.log('<moveTo x="'+x+'" y="'+y+'"/>');
			}
	        this.ctx.moveTo(x, y);
	    }
	    
	    this.lineTo = function(x, y){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<lT x="'+x+'" y="'+y+'"/>');
			}else{
				this.log('<lineTo x="'+x+'" y="'+y+'"/>');
			}
	        this.ctx.lineTo(x, y);
	    }
	    
	    this.stroke = function(){
			this.UpdateAllFunctions();
			this.log('<stroke/>');       
	        this.ctx.stroke();
	    }
		
		this.createLinearGradient = function(x, y, x1,y1){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<crtLinearGrad x="'+x+'" y="'+y+'" x1="'+x1+'" y1="'+y1+'"/>');       
	        }else{
				this.log('<createLinearGradient x="'+x+'" y="'+y+'" x1="'+x1+'" y1="'+y1+'"/>');
			}
			this.ctx.createLinearGradient(x, y, x1,y1);
		}
		this.createPattern = function(x, y,img){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<crtPat x="'+x+'" y="'+y+'" img="'+img+'"/>');
			}else{
				this.log('<createPattern x="'+x+'" y="'+y+'" img="'+img+'"/>'); 
			}
	        this.ctx.createPattern(x, y,img);
		}
		this.createRadialGradient = function(x, y,r, x1,y1,r1){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<crtRadialGrad x="'+x+'" y="'+y+'" r="'+r+'" x1="'+x1+'" y1="'+y1+'" r1="'+r1+'"/>');  
			}else{
				this.log('<createRadialGradient x="'+x+'" y="'+y+'" r="'+r+'" x1="'+x1+'" y1="'+y1+'" r1="'+r1+'"/>');
			}
	        this.ctx.createRadialGradient(x, y,r, x1,y1,r1);
		}
		
		// Rectangle functions
		this.rect = function(x, y, width, height){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<rec x="'+x+'" y="'+y+'" w="'+width+'" h="'+height+'"/>'); 
			}else{
				this.log('<rect x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'"/>');
			}
	        this.ctx.rect(x, y, width, height);
		}
		this.fillRect = function(x, y, width, height){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<fRec x="'+x+'" y="'+y+'" w="'+width+'" h="'+height+'"/>'); 
			}else{
				this.log('<fillRect x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'"/>');
			}
	        this.ctx.fillRect(x, y, width, height);
		}
		this.strokeRect = function(x, y, width, height){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<sRec x="'+x+'" y="'+y+'" w="'+width+'" h="'+height+'"/>');    
			}else{
				this.log('<strokeRect x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'"/>'); 
			}
	        this.ctx.strokeRect(x, y, width, height);
		}
		this.clearRect = function(x, y, width, height){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<cRec x="'+x+'" y="'+y+'" w="'+width+'" h="'+height+'"/>');
			}else{
				this.log('<clearRect x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'"/>');
			}
	        this.ctx.clearRect(x, y, width, height);
		}

		// Path functions
		this.fill = function(){
			this.UpdateAllFunctions();
	        this.log('<fill/>');        
	        this.ctx.fill();
	    }
		this.closePath = function(){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<cP/>');     
			}else{
				this.log('<closePath/>');
			}
	        this.ctx.closePath();
	    }
		this.clip = function(){
			this.UpdateAllFunctions();
	        this.log('<clip/>');        
	        this.ctx.clip();
	    }
		this.quadraticCurveTo = function(x, y, cpx, cpy){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<quadCrvTo x="' + x + '" y="' + y+ '" cpx="'+cpx+'" cpy="'+cpy+'"/>');     
			}else{	
				this.log('<quadraticCurveTo x="' + x + '" y="' + y+ '" cpx="'+cpx+'" cpy="'+cpy+'"/>');
			}
	        this.ctx.quadraticCurveTo(x, y, cpx, cpy);
		}
		this.bezierCurveTo = function(x, y, cpx, cpy, cpx1, cpy1){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<beziCrvTo x="' + x + '" y="' + y+ '" cpx="'+cpx+'" cpy="'+cpy+'" cpx1="'+cpx1+'  cpy1="'+cpy1+'"/>');
			}else{
				this.log('<bezierCurveTo x="' + x + '" y="' + y+ '" cpx="'+cpx+'" cpy="'+cpy+'" cpx1="'+cpx1+'  cpy1="'+cpy1+'"/>');
			}
	        this.ctx.bezierCurveTo(x, y, cpx, cpy, cpx1, cpy1);
		}
		this.arc = function(x, y,r,sAngle,eAngle,counterclockwise){
			this.UpdateAllFunctions();
	        this.log('<arc x="'+x+'" y="'+y+'" r="'+r+'" sAngle="'+sAngle+'" eAngle="'+eAngle+'" counterclockwise="'+counterclockwise+'"/>');        
	        this.ctx.arc(x, y,r,sAngle,eAngle,counterclockwise);
		}
		this.arcTo = function(x, y,r,x1,y1){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<aT x="'+x+'" y="'+y+'" r="'+r+'" x1="'+x1+'" y1="'+y1+'"/>');     
			}else{
				this.log('<arcTo x="'+x+'" y="'+y+'" r="'+r+'" x1="'+x1+'" y1="'+y1+'"/>');
			}
	        this.ctx.arcTo(x, y,r,x1,y1);
		}
		this.isPointInPath = function(x, y){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<isPinP x="'+x+'" y="'+y+'"/>');
			}else{
				this.log('<isPointInPath x="'+x+'" y="'+y+'"/>');
			}
	        return this.ctx.isPointInPath(x, y);
		}

		// Transformation functions
		this.scale = function(width, height){
			this.UpdateAllFunctions();
	        this.log('<scale width="'+width+'" height="'+height+'"/>');        
	        this.ctx.scale(width, height);
		}
		this.rotate = function(angle){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<rot a="'+angle+'"/>');
			}else{
				this.log('<rotate angle="'+angle+'"/>');        
	        }
			this.ctx.rotate(angle);
		}
		this.translate = function(x, y){
			this.UpdateAllFunctions();
	        this.log('<translate x="'+x+'" y="'+y+'"/>');        
	        this.ctx.translate(x, y);
		}
		this.transform = function(a,b,c,d,e,f){
			this.UpdateAllFunctions();
	        this.log('<transform a="' + a + '" b="' +b+ '" c="'+c+'" d="'+d+'" e="'+e+'  f="'+f+'"/>');        
	        this.ctx.transform(a,b,c,d,e,f);
		}
		this.setTransform = function(a,b,c,d,e,f){
			this.UpdateAllFunctions();
	        this.log('<setTransform a="' + a + '" b="' +b+ '" c="'+c+'" d="'+d+'" e="'+e+'  f="'+f+'"/>');        
	        this.ctx.setTransform(a,b,c,d,e,f);
		}

		// Text functions
		this.fillText = function(x, y,text,maxWidth){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<fTxt x="' + x + '" y="' + y+ '" txt="'+text+'" maxW="'+maxWidth+'"/>');   
			}else{
				this.log('<fillText x="' + x + '" y="' + y+ '" text="'+text+'" maxwidth="'+maxWidth+'"/>');
			}
	        this.ctx.fillText(x, y,text,maxWidth);
		}
		this.strokeText = function(x, y,text,maxWidth){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<sTxt x="' + x + '" y="' + y+ '" text="'+text+'" maxwidth="'+maxWidth+'"/>');        
	        }else{
				this.log('<strokeText x="' + x + '" y="' + y+ '" text="'+text+'" maxwidth="'+maxWidth+'"/>');
			}
			this.ctx.strokeText(x, y,text,maxWidth);
		}
		this.measureText = function(text){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<mTxt txt="'+text+'"/>');  
			}else{
				this.log('<measureText text="'+text+'"/>'); 
			}
	        return this.ctx.measureText(text);
		}

		// Image draw functions
		this.drawImage = function(img,sx,sy,swidth,sheight,x,y,width,height){	
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<drawImage img="'+img+'" sx="'+sx+'" sy="'+sy+'" swidth="'+swidth+'" sheight="'+sheight+'" x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'"/>'); 
			}else{
				this.log('<drawImg img="'+img+'" sx="'+sx+'" sy="'+sy+'" sw="'+swidth+'" sh="'+sheight+'" x="'+x+'" y="'+y+'" w="'+width+'" h="'+height+'"/>');
			}
	        this.ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
		}

		// Pixel manipulation functions
		this.createImageData = function(imageData, width, height){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<createImageData imagedata="'+imageData+'" width="'+width+'" height="'+height+'"/>');  
			}else{
				this.log('<crtImgData imgdata="'+imageData+'" w="'+width+'" h="'+height+'"/>'); 
			}
			this.ctx.createImageData( imageData, width, height);
			
		}
		this.getImageData = function(x, y, width, height){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<getImgData x="'+x+'" y="'+y+'" w="'+width+'" h="'+height+'"/>');  
			}else{
				this.log('<getImageData x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'"/>'); 
			}
	       		return this.ctx.getImageData(x, y, width, height);
		}
		this.putImageData = function(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight){
			this.UpdateAllFunctions();
			// We must log image data to file as we otherwise won't have the actual information
			// when we try to recreate the object in the player. 
			this.logImageData(imgData);

			if(optimize == true){
				this.log('<putImgData imgdata="'+imgData+'" x="'+x+'" y="'+y+'" dx="'+dirtyX+'" dy="'+dirtyY+'" dw="'+dirtyWidth+'" dh="'+dirtyHeight+'"/>'); 
			}else{
				this.log('<putImageData imgdata="'+imgData+'" x="'+x+'" y="'+y+'" dirtyx="'+dirtyX+'" dirtyy="'+dirtyY+'" dirtywidth="'+dirtyWidth+'" dirtyheight="'+dirtyHeight+'"/>');
			}
	        return this.ctx.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
		}
		this.putImageData = function(imgData,x,y){
			this.UpdateAllFunctions();
			this.logImageData(imgData);
			if(optimize == true){
				this.log('<putImgData imgdata="'+imgData+'" x="'+x+'" y="'+y + "\"/>"); 
			}else{
				this.log('<putImageData imgdata="'+imgData+'" x="'+x+'" y="'+y + "\"/>");
			}
	        return this.ctx.putImageData(imgData,x,y);
		}
		//Other methods.
		this.restore = function(){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<rest/>');
			}else{
				this.log('<restore/>');        
	        }
			this.ctx.restore();
	    }
		this.save = function(){
			this.UpdateAllFunctions();
	        this.log('<save/>');        
	        this.ctx.save();
	    }
		this.createEvent = function(){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<crtEvent/>');
			}else{
				this.log('<createEvent/>');
			}
	        this.ctx.createEvent();
	    }
		this.getContext = function(){
			this.UpdateAllFunctions();
			if(optimize == true){
				this.log('<gContxt/>');
			}else{
				this.log('<getContext/>');        
	        }
			this.ctx.getContext();
	    }
		this.toDataURL = function(){
			this.UpdateAllFunctions();
	        this.log('<toDataURL/>');        
	        this.ctx.toDataURL();
	    }
		
		/* Update state of the contextlines in the function for the properties and will check if any property needs updates.
		This updates are added to the xml if there are any.*/
		this.UpdateAllFunctions = function(){
			var string = "";
			string += this.updateContextLineState();
			string += this.updateContextCssState();
			string += this.updateContextTextState();
			string += this.updateContextCompositingState();

			// Check if update is necessary
			if(string.length > 0){
				var timestep = new Date().getTime();
				
				// Calculate delay
				var delay = timestep - lastTimestep;
				// Update timestep
				lastTimestep = timestep;
				
				// Keep a low amount of timesteps
				if(delay == 0){
					if(inTimestepDelay){
						str += string;
					}
					else{
						inTimestepDelay = true;
						str += '<timestep delay="' + delay + '">' + "\n";
						str += string + '\n';
						
					}
				}
				else{
					if(inTimestepDelay){
						str += '</timestep>' + '\n';
						inTimestepDelay = false;
					}
					str += '<timestep delay="' + delay + '">' + '\n';
					str += string;
					str += '</timestep>' + '\n';
				}	
			}
		}

		this.updateContextLineState = function(){
			var string = "";
			// Check for updates on propert
			if (this.ctx.lineWidth !== this.lineWidth && !(this.lineWidth === undefined)) {
				string += this.updateContextProperty('lineWidth');
			}
			if (this.ctx.lineJoin !== this.lineJoin && !(this.lineJoin === undefined)) {
				string += this.updateContextProperty('lineJoin');
			}
			if (this.ctx.miterLimit !== this.miterLimit && !(this.miterLimit === undefined)) {
				string += this.updateContextProperty('miterLimit');
			}
			if (this.ctx.lineCap !== this.lineCap && !(this.lineCap === undefined)) {
				string += this.updateContextProperty('lineCap');
			}
			return string;

		}
		
		// Update state
		this.updateContextCssState = function(){
			// Check for updates on propert
			var string = "";
			if (this.ctx.fillStyle !== this.fillStyle && !(this.fillStyle === undefined)) {
				string += this.updateContextProperty('fillStyle');
			}
			if (this.ctx.strokeStyle !== this.strokeStyle && !(this.strokeStyle === undefined)) {
				string += this.updateContextProperty('strokeStyle');
			}
			if (this.ctx.shadowColor !== this.shadowColor && !(this.shadowColor === undefined)) {
				string += this.updateContextProperty('shadowColor');
			}
			if (this.ctx.shadowBlur !== this.shadowBlur && !(this.shadowBlur === undefined)) {
				string += this.updateContextProperty('shadowBlur');
			}
			if (this.ctx.shadowOffsetX !== this.shadowOffsetX && !(this.shadowOffsetX === undefined)) {
				string += this.updateContextProperty('shadowOffsetX');
			}
			if (this.ctx.shadowOffsetY !== this.shadowOffsetY && !(this.shadowOffsetY === undefined)) {
				string += this.updateContextProperty('shadowOffsetY');
			}
			return string;
		}

		// Update state
		this.updateContextTextState = function(){
			var string = "";
			// Check for updates on propert
			if (this.ctx.font !== this.font && !(this.font === undefined)) {
				string += this.updateContextProperty('font');
			}
			if (this.ctx.textAlign !== this.textAlign && !(this.textAlign === undefined)) {
				string += this.updateContextProperty('textAlign');
			}
			if (this.ctx.textBaseline !== this.textBaseline && !(this.textBaseline === undefined)) {
				string += this.updateContextProperty('textBaseline');
			}
			return string;

		}

		// Update state
		this.updateContextCompositingState = function(){
			var string = "";
			// Check for updates on property
			if (this.ctx.globalAlpha !== this.globalAlpha && !(this.globalAlpha === undefined)) {
				string += this.updateContextProperty('globalAlpha');
			}
			if (this.ctx.globalCompositeOperation !== this.globalCompositeOperation && !(this.globalCompositeOperation === undefined)) {
				string += this.updateContextProperty('globalCompositeOperation');
			} 
			return string;
		}

		/**
		This method logs an imageData object to the log file. This method gets
		called when a method that uses imagedata gets called, for example
		putImageData. 
		**/
		this.logImageData = function(imgData){
			var imgstr = "<imageData width=\"" + imgData.width + "\"" + " height=\"" + imgData.height + "\"" + " values =\"";
			valueStr = "";
			for(i = 0; i < imgData.data.length; ++i){
				valueStr += imgData.data[i];
				if(i < imgData.data.length-1) valueStr += " ";
			}
			imgstr += valueStr + "\"" + "/>";
			this.log(imgstr);
		}	
		
		var shorterProperties ={shadowOffsetY:"shdwOffsetY",
								shadowOffsetX:"shdwOffsetX",
								fillStyle:"fs",
								strokeStyle:"ss",
								shadowColor:"shdwC",
								shadowBlur:"shdwB",
								LineCap:"lC",
								lineJoin:"lJ",
								lineWidth:"lW",
								miterLimit:"miterLimit",
								font:"font",
								textAlign:"txtAlign",
								textBaseline:"txtBaseline",
								width:"w",
								height:"h",
								data:"data",
								globalAlpha:"gA",
								globalCompositeOperation:"gCO"	
								}; 
		
		// Update a specific property with updateContextProperty.
		this.updateContextProperty = function(property) {
			// Update property and set a string.
			var attribute = "";
			this.ctx[property] = this[property];
			if(optimize == true){
				attribute += '<st';
			}else{
				attribute += '<state';
			}
			
			// Create string for state
			if(optimize){
				attribute += '_' + shorterProperties[property] + ' v="' + this[property] + '"' + '/>' + "\n";
				}else{
				attribute += '_' + property + ' value="' + this[property] + '"' + '/>' + "\n";
			}
			return (attribute);
		}
		this.log('<canvasSize width="'+canvas.width+'" height="'+canvas.height+'"/>');
	}
 	
