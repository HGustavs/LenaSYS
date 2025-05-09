
		/*--------------------------------------------------------------------------------
			 AJAX Queue
		----------------------------------------------------------------------------------*/		

		var AJAXQueue = new Array;
		var AJAXServiceRunning=false;

		var httpAjax = false;

		/*--------------------------------------------------------------------------------
				AjaxService
				
				This is the only interface to the AJAX wrapper. This makes the ajax service 
				browser agnostic and provides a single interface for all of the services.
				
				Each service uses a different url and a different parameter layout.
								
		----------------------------------------------------------------------------------*/

		function AjaxService(servicename,serviceparam){
				
				AJAXQueue.push(servicename);
				AJAXQueue.push(serviceparam);

				if(!AJAXServiceRunning){
						AJAXServiceRunning=true;
						var Aparam=AJAXQueue.pop();
						var Aservice=AJAXQueue.pop();
						AjaxServiceExec(Aservice,Aparam);
				}				
		}

		/*--------------------------------------------------------------------------------
				AjaxService
				
				This is the only interface to the AJAX wrapper. This makes the ajax service 
				browser agnostic and provides a single interface for all of the services.
				
				Each service uses a different url and a different parameter layout.
								
		----------------------------------------------------------------------------------*/

		function AjaxServiceExec(servicename,serviceparam){

			// Parameters are set, initiate AJAX engine
		  if (window.XMLHttpRequest) {
		  	httpAjax = new XMLHttpRequest();
		    if (httpAjax.overrideMimeType) {
		    	httpAjax.overrideMimeType('text/xml');
		    }
		  }else if(window.ActiveXObject){
				try{
					httpAjax = new ActiveXObject("Msxml2.XMLHTTP");
						}catch(e){
							try{
								httpAjax = new ActiveXObject("Microsoft.XMLHTTP");
			        }catch(e){
								alert("Couldn´t build an AJAX instance.");
			          return false;
							}
						}
				}
				
				// Send request to Server and initiate callback.
				
		    try{
					httpAjax.onreadystatechange = getPage;
		    }catch(e){
//					alert("onreadystatechange didn´t go well!");
					return false;
				}try{
					httpAjax.open('POST', servicename, true);
				  httpAjax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
		    }catch(e){
//					alert("Couldn´t open url.");
		      return false;
		    }try{
						httpAjax.send(serviceparam);				
		    }catch(e){
//					alert("Couldn´t send request.");
					return false;
				}
		   
			 return true;

		}

		/*--------------------------------------------------------------------------------
				getPage

				This is the AJAX callback function. It detects the invoking service and handles
				the reply from each service accordingly.				
								
		----------------------------------------------------------------------------------*/

	function getPage() {
					
		if(httpAjax.readyState == 4){

				str=httpAjax.responseText;

				if(AJAXQueue.length>0){
						var Aparam=AJAXQueue.pop();
						var Aservice=AJAXQueue.pop();
						AjaxServiceExec(Aservice,Aparam);
				}else{
						AJAXServiceRunning=false;				
				}
				
				return true;				
		}else{
	  		// If any other ready state than prepared, do nothing!
	  }
	}

