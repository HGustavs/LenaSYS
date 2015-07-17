/********************************************************************************

   Documentation

*********************************************************************************

Markdown support javascript

	gif clip support javascript
 
-------------==============######## Documentation End ###########==============-------------

*/

function showGif(fname){
		document.getElementById("figmd").style.display="block";
		document.getElementById("bigmd").src=fname;
		document.getElementById("backmd").style.display="block";
}

function screenClick(evt)
{
		if(evt.target.className!="gifimage"){
				document.getElementById("figmd").style.display="none";
				document.getElementById("backmd").style.display="none";
		}
}

function loadedmd()
{
		document.addEventListener("click", screenClick);						
}
						