function checkIfEmpty(textInputId){                                                                                                            
	var textInput=document.getElementById(textInputId);                                                                                         
	if(textInput.value=="") alert("Is empty");                                                                                                  
	else alert("Is not empty");                                                                                                                 
}                                                                                                                                              
                                                                                                                                                       
function checkIfNumber(textInputId){                                                                                                           
	var textInput=document.getElementById(textInputId);                                                                                         
	if(isNaN(textInput.value)) alert("Not a number");                                                                                           
	else alert("Is a number");                                                                                                                  
}                                                                                                                                              
                                                                                                                                                       
function checkIfBeginsWithCapitalLetter(textInput){                                                                                            
	if(textInput.value.length>0 && textInput.value[0]==textInput.value[0].toUpperCase()) textInput.className="isValid";                         
	else textInput.className="isNotValid";                                                                                                      
}                                                                                                                                              
                                                                                                                                                       
function checkLength(textInput, lowerLimit, upperLimit){                                                                                       
	if(textInput.value.length>=lowerLimit && textInput.value.length<=upperLimit) textInput.className="isValid";                                 
	else textInput.className="isNotValid";                                                                                                      
}                                                                                                                                              
                                                                                                                                                       
function checkIfContainsString(textInput, stringToSearchFor){                                                                                  
	if(textInput.value.toLowerCase().indexOf(stringToSearchFor.toLowerCase())!=-1){                                                             
		textInput.className="isValid";                                                                                                           
	} else {                                                                                                                                    
		textInput.className="isNotValid";                                                                                                        
	}                                                                                                                                           
}                                                                                                                                              
                                                                                                                                                       
function checkSelection(selectInput){                                                                                                          
	if(selectInput.options[selectInput.selectedIndex].value!=-1) selectInput.className="isValid";                                               
	else selectInput.className="isNotValid";                                                                                                    
}                                                                                                                                              
                                                                                                                                                       
function checkNumberOfCheckboxesSelected(caller){                                                                                              
	//Fetch all input elements with the attribute type set to "checkbox" found in the parent element of the element caller:                     
	var checkboxes=caller.parentNode.querySelectorAll("input[type='checkbox']");                                                                
	var NrOfselectedCheckBoxes=0;                                                                                                               
	//Loop through the checkboxes to count the number of selected checkboxes                                                                    
	for(var i=0;i<checkboxes.length;i++){                                                                                                       
		if(checkboxes[i].checked) NrOfselectedCheckBoxes++;                                                                                      
	}                                                                                                                                           
	if(NrOfselectedCheckBoxes>1 && NrOfselectedCheckBoxes<4)                                                                                    
		caller.parentNode.className="isValid";                                                                                                      
	else caller.parentNode.className="isNotValid";                                                                                              
}                                                                                                                                              
                                                                                                                                                       
function validateInput(){                                                                                                                      
	var textInput=document.getElementById("helloInput");                                                                                        
	var selectInput=document.getElementById("selectDemo");                                                                                      
	if(textInput.className=="isValid" && selectInput.className=="isValid")                                                                      
		document.getElementById("buttonDemo").disabled="";                                                                                          
	else document.getElementById("buttonDemo").disabled="disabled";                                                                             
}
