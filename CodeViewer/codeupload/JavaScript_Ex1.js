// Initializes the onclick events for paragraph 2 and paragraph 3                                                                              
function initializeEvents(){                                                                                                                   
                                                                                                                                                       
	//Set the onclick event for paragraph 2                                                                                                     
	var p2=document.getElementById("paragraph2");                                                                                               
	p2.onclick=function(ev){                                                                                                                    
	console.log(ev.target);                                                                                                                  
	changeBackground(ev.target,"#f00");                                                                                                      
	};                                                                                                                                        
                                                                                                                                                       
	//Set the onclick event for paragraph 3                                                                                                     
	var p3=document.querySelector("#paragraph3");                                                                                               
	p3.addEventListener('click', function(ev){console.log(ev.target);changeBackground(ev.target,"#00f");}, false);                              
                                                                                                                                                       
	//Set the mouseover event for all paragraphs                                                                                                
	allParagraphs=document.querySelectorAll("p");                                                                                               
	for(var i=0;i<allParagraphs.length;i++){                                                                                                    
		allParagraphs[i].addEventListener('mouseover', function(ev){changeBackground(ev.target,"#fff");}, false);                                
	}                                                                                                                                           
                                                                                                                                                       
}                                                                                                                                              
                                                                                                                                                       
// Change the background color of target element to newColor                                                                                   
function changeBackground(target, newColor)                                                                                                    
{                                                                                                                                              
	console.log("Change background color of target: "+target+" to newColor: "+newColor);                                                        
	console.log("Current color of target: "+window.getComputedStyle(target,null).getPropertyValue("background-color"));                         
	target.style.backgroundColor=newColor;                                                                                                      
} 
