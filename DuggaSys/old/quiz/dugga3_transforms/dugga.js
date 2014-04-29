/********************************************************************************

   Mouse coordinate and canvas globals
   
   Handles both Touch and Mouse/Keyboard input at the same time
   
*********************************************************************************/

		// Mouse coordinate globals
		var gridx,gridy;
		var clickstate=0;

		var acanvas;
		var context;

/********************************************************************************

   Canvas Setup and Click Handling Code
   
   Handles both Touch and Mouse/Keyboard input at the same time and executes 
   handler callbacks.
   Also declares canvas globals

*********************************************************************************/
 
		function setupcanvas()
		{
				acanvas=document.getElementById('a');
				context=acanvas.getContext("2d");		
				
				setTimeout("foo();",50);
				
				setupClickHandling();		
		}
		
		function setupClickHandling()
		{
				// Mouse and Keyboard Events
				acanvas.addEventListener('mousemove', ev_mousemove, false);
				acanvas.addEventListener('mouseup', ev_mouseup, false);
				acanvas.addEventListener('mousedown', ev_mousedown, false);
				acanvas.addEventListener('mousewheel', ev_mousewheel, false);
				
				// Touch Events
				acanvas.addEventListener('touchstart', ev_touchstart, false);
				acanvas.addEventListener('touchend', ev_touchend, false);
				acanvas.addEventListener('touchmove', ev_touchmove, false);		
		}						
				
		// Keyboard/Mouse Mouse Up Handler
		function ev_mouseup(ev)
		{
				handler_mouseup();
		}
		
		// Keyboard/Mouse Mouse Down Handler
		function ev_mousedown(ev)
		{
				handler_mousedown();		
		}

		// Keyboard/Mouse Mouse Wheel Handler
		function ev_mousewheel(ev)
		{
			if (ev.wheelDelta) {
				handler_mousewheel(ev.wheelDelta);
			}
		}

		// Keyboard/Mouse Mouse Move Handler
		function ev_mousemove (ev) 
		{
			  var cx,cy=0;
			  if (ev.layerX||ev.layerX==0) { // Firefox
				    cx=ev.layerX-acanvas.offsetLeft;
				    cy=ev.layerY-acanvas.offsetTop;
			  } else if (ev.offsetX || ev.offsetX == 0) { // Opera
				    cx=ev.offsetX-acanvas.offsetLeft;
				    cy=ev.offsetY-acanvas.offsetTop;
			  }

			  coord=findPos(acanvas);
				cx=cx-coord.x;
				cy=cy-coord.y;

				handler_mousemove(cx,cy);
		}		

		// Touch start event
		function ev_touchstart(event){  
    		event.preventDefault();  
     		var numtouch = event.touches.length;  

				targetEvent =  event.touches.item(0);

				var cx = targetEvent.pageX;
				var cy = targetEvent.pageY;
 				
				gridx=cx;
				gridy=cy;

 				handler_mousedown();

		};  

		// Touch end event
		function ev_touchend(event){  
    		event.preventDefault();  
     		var numtouch = event.touches.length;  

 				handler_mouseup();
		};  
		
		// Touch move event
		function ev_touchmove(event){  
    		event.preventDefault();  
     		var numtouch = event.touches.length;  

				targetEvent =  event.touches.item(0);

				var cx = targetEvent.pageX;
				var cy = targetEvent.pageY;
				
				handler_mousemove(cx,cy);				
		};  

		// Fix scrolling on touch devices
		var ScrollFix = function(elem) {
		    // Variables to track inputs
		    var startY, startTopScroll;
		
		    elem = elem || document.querySelector(elem);
		
		    // If there is no element, then do nothing  
		    if(!elem)
		        return;
		
		    // Handle the start of interactions
		    elem.addEventListener('touchstart', function(event){
		        startY = event.touches[0].pageY;
		        startTopScroll = elem.scrollTop;
		
		        if(startTopScroll <= 0)
		            elem.scrollTop = 1;
		
		        if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
		            elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
		    }, false);
		};

/********************************************************************************

   Canvas Diagram Drawing Code

*********************************************************************************/

		

		// Draws a perfect round circle
		
		function drawcircle(radius,color)
		{
				context.lineWidth   = 1.5;
				context.strokeStyle = color;
				context.arc(0, 0, radius, 0 , 2 * Math.PI, false);
		}

		// Draws 90 degree arc
		
		function drawellipse(x1,y1,x2,y2)
		{

					var rx=(x2-x1)/2.0;
					var ry=(y2-y1)/2.0;

					var x3=x1+rx;
					var y3=y1+ry;

					context.beginPath();					

					context.moveTo(x1,y1+ry);
					context.quadraticCurveTo(x1,y1,x1+rx,y1);
					context.quadraticCurveTo(x2,y1,x2,y1+ry);
					context.quadraticCurveTo(x2,y2,x2-rx,y2);
					context.quadraticCurveTo(x1,y2,x1,y1+ry);

					context.stroke();
		}	
		
		// Draw a point		
		
		function point(x,y,col)
		{
				context.strokeStyle="#000";
				context.lineWidth = 1;
			
				context.fillStyle=col;
				context.fillRect(x-4,y-4,8,8);		
				context.strokeRect(x-4,y-4,8,8);						
		}
		
		// Draw a box around a point to indicate highlight
		
		function highlight(px,py)
		{
				context.strokeStyle="#aaa";
				context.lineWidth = 1;
			
				context.strokeRect(px-8,py-8,16,16);						
				
		}
		
		// Draw a line using current context
		
		function drawline(x1,y1,x2,y2,strokestyle,linewidth)
		{
						context.strokeStyle = strokestyle;
						context.lineWidth   = linewidth;
						context.beginPath();
						context.moveTo(x1,y1);
						context.lineTo(x2,y2);
						context.stroke();							
		}
		
		function fourpoints(x1,y1,x2,y2,x3,y3,x4,y4,col)
		{
				point(x1,y1,col);
				point(x2,y2,col);
				point(x3,y3,col);
				point(x4,y4,col);				
		}
		
		function drawdiamond(x1,y1,rx,ry,expand)
		{
				context.beginPath();					
				context.moveTo(x1-expand,y1+ry);
				context.lineTo(x1+rx,y2+expand);
				context.lineTo(x2+expand,y1+ry);
				context.lineTo(x1+rx,y1-expand);
				context.lineTo(x1-expand,y1+ry);			
				context.stroke();											
		}
		
		// Dashed Line in Segments of given size
		
		function dashedline(sx,sy,ex,ey,dashlen,linewidth,col)
		{
						
			var dx=ex-sx;
			var dy=ey-sy;
							
			len=Math.sqrt((dx*dx)+(dy*dy));
			notimes=Math.round(len/dashlen);
			
			dx=dx/notimes;
			dy=dy/notimes;
			
			context.lineWidth = linewidth;
			context.strokeStyle=col;

			context.beginPath();

			var xk,yk;
			xk=sx;
			yk=sy;
			xh=dx/2.0;
			yh=dy/2.0;
			for(var i=0;i<notimes;i++){

					context.moveTo(xk,yk);				
					context.lineTo(xk+xh,yk+yh);
				
					xk+=dx;
					yk+=dy;
			}
							
			context.stroke();
				
		}
								
		// Arcto only works if both x1 and y2 are on circle border
		
		function arcto(x0,y0,x1,y1,x2,y2)
		{

				var r = Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0));
				var x = x0-r;
				var y = y0-r;
				var startAngle = (180/Math.PI*Math.atan2(y1-y0, x1-x0));
				var endAngle = (180/Math.PI*Math.atan2(y2-y0, x2-x0));
				
				context.arc(x0, y0, r, 0, Math.PI*2.0, 1.0);

		}

		// Draws 90 degree arc
		
		function arcdeg(x1,y1,x2,y2,x3,y3)
		{
					

					// First quadrant positive positive			
					dashedline(x1,y1,x2,y2,8,1.0,"#999");
					dashedline(x3,y3,x2,y2,8,1.0,"#999");					

					point(x1,y1,"#ff5");
					point(x2,y2,"#f55");
					point(x3,y3,"#f55");
												
					k=(y3-y1)/(x3-x1);					
										
					yk=y1+((x2-x1)*k);
					
					rx=x3-x1;
					ry=y3-y1;

					point(x2,yk,"#f5f");

					context.strokeStyle = '#49f';
					context.lineWidth   = 1.0;					
					context.beginPath();					
					context.moveTo(x1,y1);
					for(i=0;i<48;i++){
							if(y3>=y1){
									if(yk>=y2){
											context.lineTo(x1+(Math.sin(((Math.PI/96.0)*-i)+(Math.PI*1.0))*rx),y3+(Math.cos(((Math.PI/96.0)*-i)+(Math.PI*1.0))*ry));
									}else{
											context.lineTo(x3+(Math.sin(((Math.PI/96.0)*i)+(Math.PI*1.5))*rx),y1+(Math.cos(((Math.PI/96.0)*i)+(Math.PI*1.5))*ry));
									}
							}else{
									if(yk<=y2){
											context.lineTo(x1+(Math.sin(((Math.PI/96.0)*-i)+(Math.PI*1.0))*rx),y3+(Math.cos(((Math.PI/96.0)*-i)+(Math.PI*1.0))*ry));
									}else{
											context.lineTo(x3+(Math.sin(((Math.PI/96.0)*i)+(Math.PI*1.5))*rx),y1+(Math.cos(((Math.PI/96.0)*i)+(Math.PI*1.5))*ry));
									}							
							}
					}
					context.stroke();

		}		
	
		// function that draws one part of the sun	
		
		function sundial(radius,angle,scale)
		{
				
					cosv=Math.cos(angle);
					sinv=Math.sin(angle);
										
					yaddx=scale*cosv;
					yaddy=scale*sinv;
					
					xaddx=-scale*sinv;
					xaddy=scale*cosv;

					xk=cosv*radius;
					yk=sinv*radius;

					context.bezierCurveTo((-1.5*xaddx)+(yaddx*1.5)+xk,(-1.5*xaddy)+(yaddy*1.5)+yk,xaddx+(yaddx*2.0)+xk,xaddy+(yaddy*2.0)+yk,xaddx+(yaddx*3.0)+xk,xaddy+(yaddy*3.0)+yk);
					context.bezierCurveTo(xaddx+yaddx+xk,xaddy+yaddy+yk,(1.5*xaddx)+yaddx+xk,(1.5*xaddy)+yaddy+yk,(3.0*xaddx)+xk,(3.0*xaddy)+yk);
		}

		// function that daws the sun
		
		function drawsun()
		{
				context.fillStyle = "#fe9";
				context.strokeStyle = "#d82";
				context.lineWidth   = 1.5;
								 
				context.beginPath();
				context.moveTo(30,0);
				for(i=0.0;i<360.0;i+=22.5){
						angle=(i/360.0)*2*Math.PI;
						sundial(30,angle,3);
				}
				context.stroke();
				context.fill();															
		}
		
		// Draws the ball (used in various examples)
		
		function drawball(cx,cy,radie,innerradie,ballradie,col1,inangle,inangleadd)
		{
					
					angleadd=(inangleadd/360.0)*2*Math.PI;
									
					context.fillStyle = col1;					
					
					for(i=0;i<360;i+=inangle){
														
							angle=(i/360.0)*2*Math.PI;
							angle2=angle+angleadd;
							angle3=angle+(angleadd*2.0);
							angle4=angle-angleadd;

							cosv=Math.cos(angle);
							sinv=Math.sin(angle);

							cosv2=Math.cos(angle2);
							sinv2=Math.sin(angle2);

							cosv4=Math.cos(angle4);
							sinv4=Math.sin(angle4);
							
							context.beginPath();

							context.moveTo(cx,cy);
							context.quadraticCurveTo(cx+(cosv*innerradie),cy+(sinv*innerradie),cx+(cosv2*radie),cy+(sinv2*radie));							
							context.arc(cx,cy,radie,angle2,angle,1.0);
							context.quadraticCurveTo(cx+(cosv4*innerradie),cy+(sinv4*innerradie),cx,cy);							
														
							context.fill();															
							
					}	
					

					context.beginPath();
					context.lineWidth   = 1.5;
					context.fillStyle = "#fff";
					context.arc(0, 0, ballradie, 0 , 2 * Math.PI, false);
					context.fill();															
													
					context.beginPath();
					context.arc(cx,cy,radie,0,Math.PI*2.0,1.0);												
					context.stroke();															
		
		}
		
		
/********************************************************************************

   Canvas and Diagram Measuring Functions
   
	These functions allow us to measure pixels in diagram and other apps

*********************************************************************************/
		
		
		// Recursive Pos of div in document - should work in most browsers
		
		function findPos(obj) {
			var curleft = curtop = 0;
			if (obj.offsetParent) {
				curleft = obj.offsetLeft
				curtop = obj.offsetTop
				while (obj = obj.offsetParent) {
					curleft += obj.offsetLeft
					curtop += obj.offsetTop
				}
			}
			return {
						x:curleft,
						y:curtop
				}
		}
		
		// Make side coordinates for drawing Model

		function makeside(side,x1,y1,x2,y2,perc){
	
				var xk=0;
				var yk=0;
	
				if(side==1){
						xk=x1;
						yk=y1+((y2-y1)*perc);
				}else if(side==2){
						xk=x1+((x2-x1)*perc);
						yk=y2;
				}else if(side==3){
						xk=x2;
						yk=y1+((y2-y1)*perc);						
				}else if(side==4){
						xk=x1+((x2-x1)*perc)
						yk=y1;
				}
				
				return {
							x:xk,
							y:yk
					}
		
		}		
		
		// Computes side identifier for a mouse coordinate and object coordinates
		
		function computeside(x,y,x1,y1,x2,y2,sidetol){
	
				var obj_sidentifier="None";
				var obj_sideperc=0;
				var obj_centerdist=0;
	
				// Left Side
				if(x>x1-sidetol&&x<x1+sidetol&&y>y1-sidetol&&y<y2+sidetol){
						obj_sidentifier=1;
						obj_sideperc=makesideperc(y,y1,y2);
						obj_centerdist=centerdist(y,y1,y2);
				}

				// Bottom Not Including Left Side or Right Side
				if(x>x1+sidetol&&x<x2-sidetol&&y>y2-sidetol&&y<y2+sidetol){
						obj_sidentifier=2;
						obj_sideperc=makesideperc(x,x1,x2);
						obj_centerdist=centerdist(x,x1,x2);
				}

				// Right Side
				if(x>x2-sidetol&&x<x2+sidetol&&y>y1-sidetol&&y<y2+sidetol){
						obj_sidentifier=3;
						obj_sideperc=makesideperc(y,y1,y2);
						obj_centerdist=centerdist(y,y1,y2);
				}
				
				// Top Not Including Left Side or Right Side
				if(x>x1+sidetol&&x<x2-sidetol&&y>y1-sidetol&&y<y1+sidetol){
						obj_sidentifier=4;
						obj_sideperc=makesideperc(x,x1,x2);
						obj_centerdist=centerdist(x,x1,x2);
				}
				
				return {
							side:obj_sidentifier,
							perc:obj_sideperc,
							dist:obj_centerdist
					}
		
		}		
						
		// Make side perc for ER model
		
		function makesideperc(x,x1,x2){
				r=x2-x1;
				perc=(x-x1)/r;

				if(perc>1.0) perc=1.0;
				if(perc<0.0) perc=0.0;

				return perc;
		}
		
		function centerdist(x,x1,x2){
				r=x1+((x2-x1)*0.5);
				
				return (x-r);
		}
		
		// Euclidian distance - Yo!
		
		function distance(x1,y1,x2,y2){
				
				var dist=Math.sqrt(((y2-y1)*(y2-y1))+((x2-x1)*(x2-x1)));
				
				return dist;
		}

		// Are we over a line or not.

		function overline(x,y,x1,y1,x2,y2,tolerance)
		{
				var distance=10000;
				
				
				dx=x2-x1;
				dy=y2-y1;
				
				straighttolerance=2.0;
				
				// Straight X, Straight Y or Positive or Negative Incline
				if(Math.abs(dx)<straighttolerance){
						if(y1<y2){
								if(y>y1-tolerance&&y<y2+tolerance){
										distance=Math.abs(x1-x);
								}
						}else{
								if(y>y2-tolerance&&y<y1+tolerance){
										distance=Math.abs(x1-x);
								}						
						}
						
						drawline(x1,y1,x2,y2,"#ff0",2.0);

				}else if(Math.abs(dy)<straighttolerance){
						if(x1<x2){
								if(x>x1-tolerance&&x<x2+tolerance){
										distance=Math.abs(y1-y);
								}
						}else{
								if(x>x2-tolerance&&x<x1+tolerance){
										distance=Math.abs(y1-y);
								}
						}
						drawline(x1,y1,x2,y2,"#ff0",2.0);
				}else if(Math.abs(dx)>=Math.abs(dy)){
						k=dy/dx;
						
						yk=y1+((x-x1)*k);
						distance=Math.abs(yk-y);
						
						point(x,yk,"#f5f");
						point(x1,y1,"#fff");						
						point(x2,y2,"#fff");						
						
						drawline(x1,y1,x2,y2,"#f00",2.0);
				}else if(Math.abs(dx)>=Math.abs(dy)){
						k=dy/dx;
						
						yk=y1+((x-x1)*k);
						distance=Math.abs(yk-y);
						
						point(x,yk,"#f5f");
						point(x1,y1,"#fff");						
						point(x2,y2,"#fff");
						
						drawline(x1,y1,x2,y2,"#0f0",2.0);						
				
				}
								
				return distance;		
		}