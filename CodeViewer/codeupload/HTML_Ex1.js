var acanvas, context;                                                                                                                          
                                                                                                                                                       
/*This code is run when the onload event is triggered for the window                                                                           
object, i.e. this code is run when the page is loaded*/                                                                                      
window.onload=function(ev){                                                                                                                    
	acanvas=document.getElementById("a"); //Access the canvas element                                                                           
	context=acanvas.getContext("2d");           //Creates a drawing context for the canvas element                                              
                                                                                                                                                       
	context.save();                                                                                                                             
	//Draw a rectangle on the canvas                                                                                                            
	context.strokeStyle="#FF0000";              //Sets the strok color to red                                                                   
	context.strokeRect(150.5,100.5,300,200);    //Draws a stroke rectangle at 150.5,100.5 (x,y) with th width 300 and height 200                
                                                                                                                                                       
	//Draw filled text on the canvas                                                                                                            
	context.fillStyle="#0ff";                   //Cyan                                                                                          
	context.font="30px Arial";                  //Font size and font                                                                            
	context.fillText("Hello World",10.5,50);    //text, x, y                                                                                    
                                                                                                                                                       
	//Draw stroke text on the canvas                                                                                                            
	context.strokeStyle="#000000";              //Black                                                                                         
	context.font='bold 30px serif';             //Font weight, size and font-family                                                             
	context.lineWidth=0.5;                      //Width of stroke line                                                                          
	context.textAlign="right";                  //Align the text to the right                                                                   
	context.textBaseline="bottom"               //Use the bottom of the text as baseline                                                        
	context.strokeText('Hello world!', acanvas.width, acanvas.height); //Draw the text at the bottom right corner of the canvas                 
                                                                                                                                                       
	//Draw a filled rectangle to the canvas with a shadow                                                                                       
	context.shadowColor="rgba(0,0,0,0.5)";      //Sets the color (black) and opacity (50%) of the shadow                                        
	context.shadowOffsetX=5.0;                  //Offset of the shadow on the x axis                                                            
	context.shadowOffsetY=5.0;                  //Offset of the shadow on the y axis                                                            
	context.shadowBlur=6.5;                     //Shadow blurring                                                                               
	context.fillStyle="rgba(0,0,255,1.0)";      //Blue                                                                                          
	context.fillRect(300, 400, 150, 100);       //x, y, width, height                                                                           
                                                                                                                                                       
	//Draw a filled rectangle to the canvas with a shadow and 50% opacity                                                                       
	context.fillStyle="rgba(255,255,0,0.5)";    //Yellow, 50% opacity                                                                           
	context.fillRect(375, 450, 150, 100);       //x, y, width, height                                                                           
                                                                                                                                                       
	context.restore();                                                                                                                          
}                                                                                                                                              
                                                                                                                                                       
/*Draws a filled rectangle from form data*/                                                                                                    
function drawFillRect(){                                                                                                                       
	var parameters=document.querySelectorAll("#fillRect input[type='text']");                                                                   
	context.fillStyle=parameters[4].value;                                                                                                      
	context.fillRect(parameters[0].value,parameters[1].value,parameters[2].value,parameters[3].value);                                          
}
