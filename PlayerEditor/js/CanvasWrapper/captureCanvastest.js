
	/*
	 *  This function acts as a wrapper to a canvas object. It logs
	 *  every function call before forwarding the call to the canvas.
	 *  TODO: Implement the logging and support for all canvas function
	 *  calls.
	 */
	
	
	 
	function captureCanvas(canvas){
	 var str="";
	    this.ctx = canvas;      // This is the actual canvas object
	    this.ctx.lineWidth = 5;
		
		this.log = function(string){
			str += string + "\n";
		}
	    this.beginPath = function(){
	        // TODO: Log to XML file instead of debug log
			log("<command x='"+x+"' y='"+y"' comm='beginPath'>");
	        this.ctx.beginPath();
	    }
	    
	    this.moveTo = function(x, y){
	        // TODO: Log to XML file instead of debug log
			log("<command x='"+x+"' y='"+y"' comm='moveTo'>");
	        this.ctx.moveTo(x, y);
	    }
	    
	     this.lineTo = function(x, y){
	        // TODO: Log to XML file instead of debug log
			log("<command x='"+x+"' y='"+y"' comm='lineTo'>");
	        this.ctx.lineTo(x, y);
	    }
	    
	    this.stroke = function(){
	        // TODO: Log to XML file instead of debug log
			log("<command x='"+x+"' y='"+y"' comm='stroke'>");       
	        this.ctx.stroke();
	    }
		
		this.createLinearGradient = function(x, y, x1,y1){
			// TODO: Log to XML file instead of debug log
			str+="<command x='"+x+"' y='"+y+"' x1='"+x1+"' y1='"+y1"' comm='createLinearGradient'>";       
	        this.ctx.createLinearGradient(x, y, x1,y1);
		}
		this.createPattern = function(x, y,img){
			// TODO: Log to XML file instead of debug log
			str+="<command x='"+x+"' y='"+y+"' img='"+img"' comm='createPattern'>";        
	        this.ctx.createPattern(x, y,img);
		}
		this.createRadialGradient = function(x, y,r, x1,y1,r1){
			// TODO: Log to XML file instead of debug log
			str+="<command x='"+x+"' y='"+y+"' r='"+r+"' x1='"+x1+"' y1='"+y1+"' r1='"+r1"' comm='createRadialGradient'>";       
	        this.ctx.createRadialGradient(x, y,r, x1,y1,r1);
		}
		
		//This functions will log the rectangel functions.
		this.rect = function(x, y, width, height){
			// TODO: Log to XML file instead of debug log
	        str+="<command x='"+x+"' y='"+y+"' width='"+width+"' height='"+height"' comm='rect'>";         
	        this.ctx.rect(x, y, width, height);
		}
		this.fillRect = function(x, y, width, height){
			// TODO: Log to XML file instead of debug log
			str+="<command x='"+x+"' y='"+y+"' width='"+width+"' height='"+height"' comm='fillRect'>";        
	        this.ctx.fillRect(x, y, width, height);
		}
		this.strokeRect = function(x, y, width, height){
			// TODO: Log to XML file instead of debug log
	        str+="<command x='"+x+"' y='"+y+"' width='"+width+"' height='"+height"' comm='strokeRect'>";        
	        this.ctx.strokeRect(x, y, width, height);
		}
		this.clearRect = function(x, y, width, height){
			// TODO: Log to XML file instead of debug log
	        console.log("called clearRect. Parameters (x, y, width, height): " + x + ", " + y+ ","+width+","+height);        
	        this.ctx.clearRect(x, y, width, height);
		}
		//This functions will log the path functions.
		this.fill = function(){
	        // TODO: Log to XML file instead of debug log
	        console.log("called fill");        
	        this.ctx.fill();
	    }
		this.closePath = function(){
	        // TODO: Log to XML file instead of debug log
	        console.log("called closePath");        
	        this.ctx.closePath();
	    }
		this.clip = function(){
	        // TODO: Log to XML file instead of debug log
	        console.log("called clip");        
	        this.ctx.clip();
	    }
		this.quadraticCurveTo = function(x, y, cpx, cpy){
			// TODO: Log to XML file instead of debug log
	        console.log("called quadraticCurveTo. Parameters (x, y, cpx, cpy): " + x + ", " + y+ ","+cpx+","+cpy);        
	        this.ctx.quadraticCurveTo(x, y, cpx, cpy);
		}
		this.bezierCurveTo = function(x, y, cpx, cpy, cpx1, cpy1){
			// TODO: Log to XML file instead of debug log
	        console.log("called bezierCurveTo. Parameters (x, y, cpx, cpy, cpx1, cpy1): " + x + ", " + y+ ","+cpx+","+cpy+","+cpx1+","+cpy1);        
	        this.ctx.bezierCurveTo(x, y, cpx, cpy, cpx1, cpy1);
		}
		this.arc = function(x, y,r,sAngle,eAngle,counterclockwise){
			// TODO: Log to XML file instead of debug log
	        console.log("called arc. Parameters (x, y,r,sAngle,eAngle,counterclockwise): " + x + ", " + y+ ","+r+","+sAngle+","+eAngle+","+counterclockwise);        
	        this.ctx.arc(x, y,r,sAngle,eAngle,counterclockwise);
		}
		this.arcTo = function(x, y,r,x1,y1){
			// TODO: Log to XML file instead of debug log
	        console.log("called arcTo. Parameters (x, y,r,x1,y1): " + x + ", " + y+ ","+r+","+x1+","+y1);        
	        this.ctx.arcTo(x, y,r,x1,y1);
		}
		this.isPointInPath = function(x, y){
			// TODO: Log to XML file instead of debug log
	        console.log("called isPointInPath. Parameters (x, y): " + x + ", " + y);        
	        this.ctx.isPointInPath(x, y);
		}
		//This functions will log transformation functions.
		this.scale = function(width, height){
			// TODO: Log to XML file instead of debug log
	        console.log("called scale. Parameters (width, height): " + width + ", " + height);        
	        this.ctx.scale(width, height);
		}
		this.rotate = function(angle){
			// TODO: Log to XML file instead of debug log
	        console.log("called rotate. Parameters (angle): " + angle);        
	        this.ctx.rotate(angle);
		}
		this.translate = function(x, y){
			// TODO: Log to XML file instead of debug log
	        console.log("called translate. Parameters (x, y): " + x + ", " + y);        
	        this.ctx.translate(x, y);
		}
		this.transform = function(a,b,c,d,e,f){
			// TODO: Log to XML file instead of debug log
	        console.log("called transform. Parameters (a,b,c,d,e,f): " + a + ", " + b+ ", "+c+", "+d+", "+e+", "+f);        
	        this.ctx.transform(a,b,c,d,e,f);
		}
		this.setTransform = function(a,b,c,d,e,f){
			// TODO: Log to XML file instead of debug log
	        console.log("called setTransform. Parameters (a,b,c,d,e,f): " + a + ", " + b+ ", "+c+", "+d+", "+e+", "+f);        
	        this.ctx.setTransform(a,b,c,d,e,f);
		}
		//This functions will log text functions.
		this.fillText = function(x, y,text,maxWidth){
			// TODO: Log to XML file instead of debug log
	        console.log("called fillText. Parameters (x, y,text,maxWidth): " + x + ", " + y+ ", " + text+ ", " + maxWidth);        
	        this.ctx.fillText(x, y,text,maxWidth);
		}
		this.strokeText = function(x, y,text,maxWidth){
			// TODO: Log to XML file instead of debug log
	        console.log("called strokeText. Parameters (x, y,text,maxWidth): " + x + ", " + y+ ", " + text+ ", " + maxWidth);        
	        this.ctx.strokeText(x, y,text,maxWidth);
		}
		this.measureText = function(text){
			// TODO: Log to XML file instead of debug log
	        console.log("called measureText. Parameters (text): " + text);        
	        this.ctx.measureText(text);
		}
		//This functions will log image draw functions.
		this.drawImage = function(img,sx,sy,swidth,sheight,x,y,width,height){
			// TODO: Log to XML file instead of debug log
	        console.log("called drawImage. Parameters (img,sx,sy,swidth,sheight,x,y,width,height): " + img + ", " + sx+ ", "+sy+", "+swidth+", "+sheight+", "+x+", "+y+", "+width+", "+height);        
	        this.ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
		}
		//This functions will log pixel manipulation functions.
		this.createImageData = function( imageData, width, height){
			// TODO: Log to XML file instead of debug log
	        console.log("called createImageData. Parameters ( imageData, width, height): " + imageData+ ","+width+","+height);        
	        this.ctx.createImageData( imageData, width, height);
		}
		this.getImageData = function(x, y, width, height){
			// TODO: Log to XML file instead of debug log
	        console.log("called getImageData. Parameters (x, y, width, height): " + x + ", " + y+ ","+width+","+height);        
	        this.ctx.getImageData(x, y, width, height);
		}
		this.putImageData = function(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight){
			// TODO: Log to XML file instead of debug log
	        console.log("called putImageData. Parameters (imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight): " + imgData + ", " + dirtyX+ ", "+dirtyY+", "+dirtyWidth+", "+dirtyHeight+", "+x+", "+y);        
	        this.ctx.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
		}
	}
 	
