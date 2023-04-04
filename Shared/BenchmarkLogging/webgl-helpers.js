		//----------------------------------------------------------
		// helper Globals
	  //----------------------------------------------------------		

    var shaderProgram;
    var gl;

    var fps=0;
    var fpsmax=0;
    var timecount=0;
		var fpssum=0;
		var fpscount=1;
		var benchtime=0;

		var username="";
    
		//----------------------------------------------------------
		// getShader collects shader and compiles it. Errors are printed in alert
	  //----------------------------------------------------------		

    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

		//----------------------------------------------------------
		// Matrix stack variables
	  //----------------------------------------------------------		

    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();

		//----------------------------------------------------------
		// Push Matrix
	  //----------------------------------------------------------		

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

		//----------------------------------------------------------
		// Pop Matrix
	  //----------------------------------------------------------		

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }
 
		//----------------------------------------------------------
		// Startup webGL and alert if not available
	  //----------------------------------------------------------		
    
    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }if (!gl){
            alert("Could not initialise WebGL, sorry :-(");
        }
    }

		//----------------------------------------------------------
		// Measure fps and update div if available
	  //----------------------------------------------------------		

		function updatefps(elapsed,fpsdiv)
		{
				if(!isNaN(elapsed)){
						timecount+=(elapsed/1000.0);
						fpssum+=(elapsed/10.0);											
				} 
				if(elapsed<1) elapsed=1;
				
				fpscount++;
				fps=Math.round((100.0/(fpssum/fpscount))*10.0)/10.0;
								
				if(fps>fpsmax&&timecount>5.0) fpsmax=fps;

				fpsd=document.getElementById(fpsdiv);
				if(fpsd!=null) fpsd.innerHTML=fps;

		}

		//----------------------------------------------------------
		// Sends benchmark every X seconds
	  //----------------------------------------------------------		

		function sendbenchmark(delay,app)
		{
     		// Every 8 seconds send benchmark data to server!
     		if(Math.abs(timecount-benchtime)>delay){
     			benchtime=timecount;
					Benchmark(username,app,fps,fpsmax,Math.round(timecount*10.0)/10.0);
				}                                                                                                                                                   		
		}
		
		//----------------------------------------------------------
		// Generate benchmark userID
	  //----------------------------------------------------------		
		
		function genID(app)                                                                                                                       
		{                                                                                                                                            
			username = localStorage.getItem("Benchuser"); //Try to fetch username data                                                             
			if (username==null||username==""){
    			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
					text="";
    			for( var i=0; i < 16; i++ ) text += possible.charAt(Math.floor(Math.random() * possible.length));
					username=text;
					localStorage.setItem("Benchuser",username);
			}else{
      }
     
      Benchmark(username,app,fps,fpsmax,Math.round(timecount*10.0)/10.0);                                                                                                                                    
    }                                                                                                                                            

		//----------------------------------------------------------
		// Send Benchmark using httpajax.js
	  //----------------------------------------------------------		

		function Benchmark(username,app,fps,maxfps,runtime)
		{
				var paramstr='User='+escape(username);
				paramstr+="&App="+escape(app);
				paramstr+="&Fps="+escape(fps);		
				paramstr+="&MaxFps="+escape(maxfps);		
				paramstr+="&RunTime="+escape(runtime);
				AjaxService("Benchy.php",paramstr);				
		}			
		