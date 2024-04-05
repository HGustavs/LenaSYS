/********************************************************************************

   Documentation

*********************************************************************************

Markdown support javascript

 
-------------==============######## Documentation End ###########==============-------------

*/
// GLOBALS
var tableAlignmentConf = [];
var openedSublists = [];

//Functions for gif image
//Fetches the picture and sets its properties
function showGif(url, size, handle){
		handle.src = url;
		handle.style.width = size;
		$(".playbutton").toggle();
}

//Toggles between thumbnail and gif animation
function toggleGif(url1, url2,handle){
	var currentSrc = handle.src;
	var n = currentSrc.lastIndexOf("/");
	currentSrc = currentSrc.substr(n+1);
	//alert();
	if(currentSrc == url1){
		$(handle).removeClass("gifimage-fullsize");
		document.getElementById("overlay").style.display="none";
		showGif(url2, 150 + "px",handle); //Show thumbnail
	}
	else{
		showGif(url1, 80 + "%",handle); //Show big animation gif
		document.getElementById("overlay").style.display="block";		
		$(handle).addClass("gifimage-fullsize");
	}
}

function highlightRows(filename,startRow,endRow){
	if (startRow<=endRow){
		for (var i=0;i<=endRow-startRow;i++) {
			document.getElementById(filename+"-line"+(startRow+i)).className="impo";
		}
	} 	
}

function dehighlightRows(filename,startRow,endRow){
	if (startRow<=endRow){
		for (var i=0;i<=endRow-startRow;i++) {
			document.getElementById(filename+"-line"+(startRow+i)).className="normtext";
		}
	}
}

//Functions for markdown image zoom rollover
function originalImg(x,size) {
	if (size == 0){
			x.style.width = x.naturalWidth + "px";
	} else {
			x.style.width = size + "px";
	}
	
}
