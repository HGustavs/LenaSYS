
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
			this.log("<beginPath x='"+x+"' y='"+y +"' />");
	        this.ctx.beginPath();
	    }
	    
	    this.moveTo = function(x, y){
	        // TODO: Log to XML file instead of debug log
			this.log("<moveTo x='"+x+"' y='"+y+"' />");
	        this.ctx.moveTo(x, y);
	    }
	    
	     this.lineTo = function(x, y){
	        // TODO: Log to XML file instead of debug log
			this.log("<lineTo x='"+x+"' y='"+y+"' />");
	        this.ctx.lineTo(x, y);
	    }
	    
	    this.stroke = function(){
	        // TODO: Log to XML file instead of debug log
			this.log("<stroke x='"+x+"' y='"+y+"' />");       
	        this.ctx.stroke();
	    }
		
		this.createLinearGradient = function(x, y, x1,y1){
			// TODO: Log to XML file instead of debug log
			this.log("<createLinearGradient x='"+x+"' y='"+y+"' x1='"+x1+"' y1='"+y1+"' />");       
	        this.ctx.createLinearGradient(x, y, x1,y1);
		}
		this.createPattern = function(x, y,img){
			// TODO: Log to XML file instead of debug log
			this.log("<createPattern x='"+x+"' y='"+y+"' img='"+img+"' />");        
	        this.ctx.createPattern(x, y,img);
		}
		this.createRadialGradient = function(x, y,r, x1,y1,r1){
			// TODO: Log to XML file instead of debug log
			this.log("<createRadialGradient x='"+x+"' y='"+y+"' r='"+r+"' x1='"+x1+"' y1='"+y1+"' r1='"+r1+"' />");       
	        this.ctx.createRadialGradient(x, y,r, x1,y1,r1);
		}
		
		//This functions will log the rectangel functions.
		this.rect = function(x, y, width, height){
			// TODO: Log to XML file instead of debug log
	        this.log("<rect x='"+x+"' y='"+y+"' width='"+width+"' height='"+height+"' />");         
	        this.ctx.rect(x, y, width, height);
		}
		this.fillRect = function(x, y, width, height){
			// TODO: Log to XML file instead of debug log
			this.log("<fillRect x='"+x+"' y='"+y+"' width='"+width+"' height='"+height+"' />");        
	        this.ctx.fillRect(x, y, width, height);
		}
		this.strokeRect = function(x, y, width, height){
			// TODO: Log to XML file instead of debug log
	        this.log("<strokeRect x='"+x+"' y='"+y+"' width='"+width+"' height='"+height+"' />");        
	        this.ctx.strokeRect(x, y, width, height);
		}
		this.clearRect = function(x, y, width, height){
			// TODO: Log to XML file instead of debug log
	        this.log("<clearRect x='"+x+"' y='"+y+"' width='"+width+"' height='"+height+"' />");        
	        this.ctx.clearRect(x, y, width, height);
		}
		//This functions will log the path functions.
		this.fill = function(){
	        // TODO: Log to XML file instead of debug log
	        this.log("<fill x='"+x+"' y='"+y+"' />");        
	        this.ctx.fill();
	    }
		this.closePath = function(){
	        // TODO: Log to XML file instead of debug log
	        this.log("<closePath x='"+x+"' y='"+y+"' />");        
	        this.ctx.closePath();
	    }
		this.clip = function(){
	        // TODO: Log to XML file instead of debug log
	        this.log("<clip x='"+x+"' y='"+y+"' />");        
	        this.ctx.clip();
	    }
		this.quadraticCurveTo = function(x, y, cpx, cpy){
			// TODO: Log to XML file instead of debug log
	        this.log( "<quadraticCurveTo x='" + x + "' y='" + y+ "' cpx='"+cpx+"' cpy='"+cpy+"' />");        
	        this.ctx.quadraticCurveTo(x, y, cpx, cpy);
		}
		this.bezierCurveTo = function(x, y, cpx, cpy, cpx1, cpy1){
			// TODO: Log to XML file instead of debug log
	        this.log("<bezierCurveTo x='" + x + "' y='" + y+ "' cpx='"+cpx+"' cpy='"+cpy+"' cpx1='"+cpx1+"  cpy1='"+cpy1+"'/>");        
	        this.ctx.bezierCurveTo(x, y, cpx, cpy, cpx1, cpy1);
		}
		this.arc = function(x, y,r,sAngle,eAngle,counterclockwise){
			// TODO: Log to XML file instead of debug log
	        this.log("<arc x='"+x+"' y='"+y+"' r='"+r+"' sAngle='"+sAngle+"' eAngle='"+eAngle+"' counterclockwise='"+counterclockwise+"' />");        
	        this.ctx.arc(x, y,r,sAngle,eAngle,counterclockwise);
		}
		this.arcTo = function(x, y,r,x1,y1){
			// TODO: Log to XML file instead of debug log
	        this.log("<arcTo x='"+x+"' y='"+y+"' r='"+r+"' x1='"+x1+"' y1='"+y1+"' />");        
	        this.ctx.arcTo(x, y,r,x1,y1);
		}
		this.isPointInPath = function(x, y){
			// TODO: Log to XML file instead of debug log
	        this.log("<isPointInPath x='"+x+"' y='"+y+"' />");        
	        this.ctx.isPointInPath(x, y);
		}
		//This functions will log transformation functions.
		this.scale = function(width, height){
			// TODO: Log to XML file instead of debug log
	        this.log("<scale width='"+width+"' height='"+height+"' />");        
	        this.ctx.scale(width, height);
		}
		this.rotate = function(angle){
			// TODO: Log to XML file instead of debug log
	        this.log("<rotate angle='"+angle+"' />");        
	        this.ctx.rotate(angle);
		}
		this.translate = function(x, y){
			// TODO: Log to XML file instead of debug log
	        this.log("<translate x='"+x+"' y='"+y+"' />");        
	        this.ctx.translate(x, y);
		}
		this.transform = function(a,b,c,d,e,f){
			// TODO: Log to XML file instead of debug log
	        this.log("<transform a='" + a + "' b='" +b+ "' c='"+c+"' d='"+d+"' e='"+e+"  f='"+f+"'/>");        
	        this.ctx.transform(a,b,c,d,e,f);
		}
		this.setTransform = function(a,b,c,d,e,f){
			// TODO: Log to XML file instead of debug log
	        this.log("<setTransform a='" + a + "' b='" +b+ "' c='"+c+"' d='"+d+"' e='"+e+"  f='"+f+"'/>");        
	        this.ctx.setTransform(a,b,c,d,e,f);
		}
		//This functions will log text functions.
		this.fillText = function(x, y,text,maxWidth){
			// TODO: Log to XML file instead of debug log
	        this.log("<fillText x='" + x + "' y='" + y+ "' text='"+text+"' maxWidth='"+maxWidth+"' />");        
	        this.ctx.fillText(x, y,text,maxWidth);
		}
		this.strokeText = function(x, y,text,maxWidth){
			// TODO: Log to XML file instead of debug log
	        this.log("<strokeText x='" + x + "' y='" + y+ "' text='"+text+"' maxWidth='"+maxWidth+"' />");        
	        this.ctx.strokeText(x, y,text,maxWidth);
		}
		this.measureText = function(text){
			// TODO: Log to XML file instead of debug log
	        this.log("<measureText text='"+text+"' />");        
	        this.ctx.measureText(text);
		}
		//This functions will log image draw functions.
		this.drawImage = function(img,sx,sy,swidth,sheight,x,y,width,height){
			// TODO: Log to XML file instead of debug log
	        this.log("<drawImage img='"+img+"' sx='"+sx+"' sy='"+sy+"' swidth='"+swidth+"' sheight='"+sheight+"' x='"+x+"' y='"+y+"' width='"+width+"' height='"+height+"' />");        
	        this.ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
		}
		//This functions will log pixel manipulation functions.
		this.createImageData = function( imageData, width, height){
			// TODO: Log to XML file instead of debug log
	        this.log("<createImageData imageData='"+imageData+"' width='"+width+"' height='"+height+"' />");        
	        this.ctx.createImageData( imageData, width, height);
		}
		this.getImageData = function(x, y, width, height){
			// TODO: Log to XML file instead of debug log
	        this.log("<getImageData x='"+x+"' y='"+y+"' width='"+width+"' height='"+height+"' />");        
	        this.ctx.getImageData(x, y, width, height);
		}
		this.putImageData = function(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight){
			// TODO: Log to XML file instead of debug log
	        this.log("<putImageData imgData='"+imgData+"' x='"+x+"' y='"+y+"' dirtyX='"+dirtyX+"' dirtyY='"+dirtyY+"' dirtyWidth='"+dirtyWidth+"' dirtyHeight='"+dirtyHeight+"'/>");        
	        this.ctx.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
		}
		
		this.klart = function()
		{

		$.ajax({
           type: "POST",
           url: '../CanvasWrapper/logfile.php',
           data : { 'string': this.str},
           success: function(msg){
           alert(msg);
           }
         });


		}
	}
 	
