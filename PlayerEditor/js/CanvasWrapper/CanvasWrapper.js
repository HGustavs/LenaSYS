
	/*
	 *
	 *  This function acts as a wrapper to a canvas object. It logs
	 *  every function call before forwarding the call to the canvas.
	 *
	 */
	
	
	 
	function captureCanvas(canvas){
		var str='';

	    this.ctx = canvas;      // This is the actual canvas object
	    this.lineWidth = this.ctx.lineWidth;
		this.lineJoin = this.ctx.lineJoin;
		this.miterLimit = this.ctx.miterLimit;
		
		// Log XML line
		this.log = function(string){
			str += string + '\n';
		}

	    this.beginPath = function(){
			this.log('<beginpath/>');
	        this.ctx.beginPath();
	    }
	    
	    this.moveTo = function(x, y){
			this.log('<moveto x="'+x+'" y="'+y+'"/>');
	        this.ctx.moveTo(x, y);
	    }
	    
	     this.lineTo = function(x, y){
			this.updateContextLineState();
			
			this.log('<lineto x="'+x+'" y="'+y+'"/>');
	        this.ctx.lineTo(x, y);
	    }
	    
	    this.stroke = function(){
			this.updateContextLineState();
			this.log('<stroke/>');       
	        this.ctx.stroke();
	    }
		
		this.createLinearGradient = function(x, y, x1,y1){
			this.log('<createlineargradient x="'+x+'" y="'+y+'" x1="'+x1+'" y1="'+y1+'"/>');       
	        this.ctx.createLinearGradient(x, y, x1,y1);
		}
		this.createPattern = function(x, y,img){
			this.log('<createpattern x="'+x+'" y="'+y+'" img="'+img+'"/>');        
	        this.ctx.createPattern(x, y,img);
		}
		this.createRadialGradient = function(x, y,r, x1,y1,r1){
			this.log('<createradialgradient x="'+x+'" y="'+y+'" r="'+r+'" x1="'+x1+'" y1="'+y1+'" r1="'+r1+'"/>');       
	        this.ctx.createRadialGradient(x, y,r, x1,y1,r1);
		}
		
		// Rectangle functions
		this.rect = function(x, y, width, height){
	        this.log('<rect x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'"/>');         
	        this.ctx.rect(x, y, width, height);
		}
		this.fillRect = function(x, y, width, height){
			this.log('<fillrect x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'"/>');        
	        this.ctx.fillRect(x, y, width, height);
		}
		this.strokeRect = function(x, y, width, height){
	        this.log('<strokerect x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'"/>');        
	        this.ctx.strokeRect(x, y, width, height);
		}
		this.clearRect = function(x, y, width, height){
	        this.log('<clearrect x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'"/>');        
	        this.ctx.clearRect(x, y, width, height);
		}

		// Path functions
		this.fill = function(){
	        this.log('<fill/>');        
	        this.ctx.fill();
	    }
		this.closePath = function(){
	        this.log('<closepath/>');        
	        this.ctx.closePath();
	    }
		this.clip = function(){
	        this.log('<clip/>');        
	        this.ctx.clip();
	    }
		this.quadraticCurveTo = function(x, y, cpx, cpy){
	        this.log('<quadraticcurveto x="' + x + '" y="' + y+ '" cpx="'+cpx+'" cpy="'+cpy+'"/>');        
	        this.ctx.quadraticCurveTo(x, y, cpx, cpy);
		}
		this.bezierCurveTo = function(x, y, cpx, cpy, cpx1, cpy1){
	        this.log('<beziercurveto x="' + x + '" y="' + y+ '" cpx="'+cpx+'" cpy="'+cpy+'" cpx1="'+cpx1+'  cpy1="'+cpy1+'"/>');        
	        this.ctx.bezierCurveTo(x, y, cpx, cpy, cpx1, cpy1);
		}
		this.arc = function(x, y,r,sAngle,eAngle,counterclockwise){
	        this.log('<arc x="'+x+'" y="'+y+'" r="'+r+'" sAngle="'+sAngle+'" eAngle="'+eAngle+'" counterclockwise="'+counterclockwise+'"/>');        
	        this.ctx.arc(x, y,r,sAngle,eAngle,counterclockwise);
		}
		this.arcTo = function(x, y,r,x1,y1){
	        this.log('<arcto x="'+x+'" y="'+y+'" r="'+r+'" x1="'+x1+'" y1="'+y1+'"/>');        
	        this.ctx.arcTo(x, y,r,x1,y1);
		}
		this.isPointInPath = function(x, y){
	        this.log('<ispointinpath x="'+x+'" y="'+y+'"/>');        
	        this.ctx.isPointInPath(x, y);
		}

		// Transformation functions
		this.scale = function(width, height){
	        this.log('<scale width="'+width+'" height="'+height+'"/>');        
	        this.ctx.scale(width, height);
		}
		this.rotate = function(angle){
	        this.log('<rotate angle="'+angle+'"/>');        
	        this.ctx.rotate(angle);
		}
		this.translate = function(x, y){
	        this.log('<translate x="'+x+'" y="'+y+'"/>');        
	        this.ctx.translate(x, y);
		}
		this.transform = function(a,b,c,d,e,f){
	        this.log('<transform a="' + a + '" b="' +b+ '" c="'+c+'" d="'+d+'" e="'+e+'  f="'+f+'"/>');        
	        this.ctx.transform(a,b,c,d,e,f);
		}
		this.setTransform = function(a,b,c,d,e,f){
	        this.log('<settransform a="' + a + '" b="' +b+ '" c="'+c+'" d="'+d+'" e="'+e+'  f="'+f+'"/>');        
	        this.ctx.setTransform(a,b,c,d,e,f);
		}

		// Text functions
		this.fillText = function(x, y,text,maxWidth){
	        this.log('<filltext x="' + x + '" y="' + y+ '" text="'+text+'" maxwidth="'+maxWidth+'"/>');        
	        this.ctx.fillText(x, y,text,maxWidth);
		}
		this.strokeText = function(x, y,text,maxWidth){
	        this.log('<stroketext x="' + x + '" y="' + y+ '" text="'+text+'" maxwidth="'+maxWidth+'"/>');        
	        this.ctx.strokeText(x, y,text,maxWidth);
		}
		this.measureText = function(text){
	        this.log('<measuretext text="'+text+'"/>');        
	        this.ctx.measureText(text);
		}

		// Image draw functions
		this.drawImage = function(img,sx,sy,swidth,sheight,x,y,width,height){
	        this.log('<drawimage img="'+img+'" sx="'+sx+'" sy="'+sy+'" swidth="'+swidth+'" sheight="'+sheight+'" x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'"/>');        
	        this.ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
		}

		// Pixel manipulation functions
		this.createImageData = function( imageData, width, height){
	        this.log('<createimagedata imagedata="'+imageData+'" width="'+width+'" height="'+height+'"/>');        
	        this.ctx.createImageData( imageData, width, height);
		}
		this.getImageData = function(x, y, width, height){
	        this.log('<getimagedata x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'"/>');        
	        this.ctx.getImageData(x, y, width, height);
		}
		this.putImageData = function(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight){
	        this.log('<putimagedata imgdata="'+imgData+'" x="'+x+'" y="'+y+'" dirtyx="'+dirtyX+'" dirtyy="'+dirtyY+'" dirtywidth="'+dirtyWidth+'" dirtyheight="'+dirtyHeight+'"/>');        
	        this.ctx.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
		}
		
		// Update state
		this.updateContextLineState = function(){
			var str = '<state';

			// Check for updates
			if (this.ctx.lineWidth != this.lineWidth) {
				str += this.updateContextProperty('lineWidth');
			}
			if (this.ctx.lineJoin != this.lineJoin) {
				str += this.updateContextProperty('lineJoin');
			}
			if (this.ctx.miterLimit != this.miterLimit) {
				str += this.updateContextProperty('miterLimit');
			}

			// Add state update to XML if needed
			if (str.length > 6){
				str += '/>';
				this.log(str);
			}
		}

		// Update a specific property
		this.updateContextProperty = function(property) {
			// Update property
			this.ctx[property] = this[property];

			// Create string for state
			var attribute = ' ' + property + '="' + this[property] + '"';
			attribute.toLowerCase();

			return (attribute);
		}
		
		// Send xml-data to server
		this.sendXML = function()
		{
			$.ajax({
		        type: 'POST',
		        url: '../CanvasWrapper/logfile.php',
		        data : { 'string': this.str},
		        success: function(msg){
		        	alert(msg);
		        }
	        });
		}
	}
 	
