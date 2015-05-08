var list=new Array(); //Stores all boxes                                                                                                     
                                                                                                                                                       
//Call to update the list of seleced boxes                                                                                                   
function updateList(){                                                                                                                       
	var storedData=getCookie("boxItems");                                                                                                     
	var listBox=document.getElementById("list");                                                                                              
	listBox.innerHTML="";                                                                                                                     
	list=new Array();                                                                                                                         
	if(storedData!="" && storedData!=null){                                                                                                   
		list=JSON.parse(storedData);                                                                                                           
		for(var i=0;i<list.length;i++){                                                                                                        
			var s="<div onclick='remove("+i+");' class='box ";                                                                                  
			if(list[i]=='blue') s+="blue'>";                                                                                                    
			else s+="red'>";                                                                                                                    
            s+="</div>";                                                                                                                        
            listBox.innerHTML+=s;                                                                                                               
        }                                                                                                                                      
    }                                                                                                                                         
}                                                                                                                                            
                                                                                                                                                       
//Add a box to the list                                                                                                                      
function add(type){                                                                                                                          
	if(type=="blue"){                                                                                                                         
		list.push("blue");                                                                                                                     
	} else {                                                                                                                                  
		list.push("red");                                                                                                                      
	}                                                                                                                                         
	setCookie("boxItems",JSON.stringify(list),365);                                                                                           
	updateList();                                                                                                                             
}                                                                                                                                            
                                                                                                                                                       
//Remove a box from the list                                                                                                                 
function remove(index){                                                                                                                      
	list.splice(index,1);                                                                                                                     
	setCookie("boxItems",JSON.stringify(list),365);                                                                                           
	updateList();                                                                                                                             
}                                                                                                                                            
                                                                                                                                                       
//Gets the value stored in the cookie of the given name, if cookie not found the empty string is returned                                    
function getCookie(c_name){                                                                                                                  
	if (document.cookie.length>0){                        //If length not larger than 0, no cookies are stored                                
		c_start=document.cookie.indexOf(c_name + "=");     //Search document.cookie for the start of c_name cookie                             
		if (c_start!=-1){                                  //Our cookie was found                                                              
			c_start=c_start + c_name.length+1;              //Find position to start extracting cookie data (data is stored after the cookie name)
			c_end=document.cookie.indexOf(";",c_start);     //Find the end of data string for this cookie                                       
			if (c_end==-1) c_end=document.cookie.length;    //If no ; found the data ends at the end of document.cookie                         
                                                                                                                                                       
            return unescape(document.cookie.substring(c_start,c_end)); //Extract and return data for this cookie                                
        }                                                                                                                                      
    }                                                                                                                                         
    return ""; //Cookie not found, return empty string                                                                                        
}                                                                                                                                            
                                                                                                                                                       
//Set a cookie with name c_name, a value and number of days until the cookie expires                                                         
function setCookie(c_name,value,expiredays){                                                                                                 
	var exdate=new Date();                                                                                                                    
	exdate.setDate(exdate.getDate()+expiredays);                                                                                              
	document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toUTCString());                                  
}                                                                                                                                            
                                                                                                                                                       
//Removes the cookie with the given name by setting its value to "" and its expiry date to -1                                                
function eraseCookie(c_name) {                                                                                                               
	setCookie(c_name,"",-1);                                                                                                                  
}                                                                                                                                            
                                                                                                                                                       
//Keeps the list in sync when changes are made in another window/tab                                                                         
function synchronizeList(){                                                                                                                  
	updateList();                                                                                                                             
	setTimeout("synchronizeList()",2000); //Check for updates in another 2 seconds time                                                       
}                                                                                                                                            
                                                                                                                                                       
//Start a timer to keep list synchronized between different windows and tabs                                                                 
setTimeout(function(){synchronizeList();},2000);
