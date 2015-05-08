var index=0;

function addNewButtonsPanelBelow(clickedButton){ //Adds a new panel with buttons at the end of the body element                                
	index++;                                                                                                                                    
	var newPanel=document.createElement("div");                                                                                                 
	newPanel.className="buttonsPanel";                                                                                                          
	newPanel.innerHTML=index;                                                                                                                   
	var newAddBelowButton=document.createElement("button");                                                                                     
	newAddBelowButton.innerHTML="Add a buttons panel below";                                                                                    
	newAddBelowButton.addEventListener('click', function(ev){addNewButtonsPanelBelow(ev.target);}, false);                                      
	newPanel.appendChild(newAddBelowButton);                                                                                                    
	var newAddAboveButton=document.createElement("button");                                                                                     
	newAddAboveButton.innerHTML="Add a buttons panel above";                                                                                    
	newAddAboveButton.addEventListener('click', function(ev){addNewButtonsPanelAbove(ev.target);}, false);                                      
	newPanel.appendChild(newAddAboveButton);                                                                                                    
	var newRemoveButton=document.createElement("button");                                                                                       
	newRemoveButton.innerHTML="Remove this buttons panel";                                                                                      
	newRemoveButton.addEventListener('click', function(ev){removeButtonsPanel(ev.target);}, false);                                             
	newPanel.appendChild(newRemoveButton);                                                                                                      
	clickedButton.parentNode.parentNode.appendChild(newPanel);                                                                                  
}                                                                                                                                              
                                                                                                                                                       
function addNewButtonsPanelAbove(clickedButton){ //Adds a new panel with buttons before the panel with the clicked button                      
	index++;                                                                                                                                    
	var newPanel=document.createElement("div");                                                                                                 
	newPanel.className="buttonsPanel";                                                                                                          
	newPanel.innerHTML=index+                                                                                                                   
	"<button onclick='addNewButtonsPanelBelow(this);'>Add a buttons panel below</button>"+                                    
	"<button onclick='addNewButtonsPanelAbove(this);'>Add a buttons panel above</button>"+                                    
	"<button onclick='removeButtonsPanel(this);'>Remove this buttons panel</button>";                                         
	clickedButton.parentNode.parentNode.insertBefore(newPanel, clickedButton.parentNode);                                                       
}                                                                                                                                              
                                                                                                                                                       
function removeButtonsPanel(clickedButton){ //Removes the clicked panel                                                                        
	clickedButton.parentNode.parentNode.removeChild(clickedButton.parentNode);                                                                 
}
