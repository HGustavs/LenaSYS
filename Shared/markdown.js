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

/********************************************************************************

   Markdown, the functions in the next section contains the functions used by
	the markdown parser.

*********************************************************************************/

//----------------------------------------------------------------------------------
// parseMarkdown: Translates markdown symbols to html tags. Uses the javascript
//				  function replace with regular expressions.
//                Is called by returned in codeviewer.js
//								Identical php code exists in showdoc any changes must be propagated
//----------------------------------------------------------------------------------

function parseMarkdown(inString)
{	
	inString = inString.replace(/\</g, "&lt;");
	inString = inString.replace(/\>/g, "&gt;");

	// append '@@@' to all code block indicators '~~~'
	inString = inString.replace(/^\~{3}(\r\n|\n|\r)/gm, '~~~@@@');

	// Split on code block
	codearray=inString.split('~~~');
	
	var str="";
	var kodblock=0;
	for(var i=0;i<codearray.length;i++){
			workstr=codearray[i];

			if(workstr.substr(0,3)==="@@@"){
					kodblock=!kodblock;
					workstr = workstr.substr(3);
			}			

			if(kodblock){

					workstr='<pre><code>'+workstr+'</code></pre>';
			}else{
					workstr=markdownBlock(workstr);
			}
			str+=workstr;
	}
	
	return str;
}

//----------------------------------------------------------------------------------
// markdownBlock: 
//					
//          
//----------------------------------------------------------------------------------

function markdownBlock(inString)
{	
	//Regular expressions for italics and bold formatting
	inString = inString.replace(/\*{4}(.*?\S)\*{4}/g, '<strong><em>$1</em></strong>');	
	inString = inString.replace(/\*{3}(.*?\S)\*{3}/g, '<strong>$1</strong>');
	inString = inString.replace(/\*{2}(.*?\S)\*{2}/g, '<strong>$1</strong>');
	inString = inString.replace(/\_{4}(.*?\S)\_{4}/g, '<strong><em>$1</em></strong>');
	inString = inString.replace(/\_{3}(.*?\S)\_{3}/g, '<em>$1</em>');	
	inString = inString.replace(/\_{2}(.*?\S)\_{2}/g, '<em>$1</em>');
	
	//Regular expressions for headings
	inString = inString.replace(/^\#{6}\s(.*)=*/gm, '<h6>$1</h6>');
	inString = inString.replace(/^\#{5}\s(.*)=*/gm, '<h5>$1</h5>');
	inString = inString.replace(/^\#{4}\s(.*)=*/gm, '<h4>$1</h4>');
	inString = inString.replace(/^\#{3}\s(.*)=*/gm, '<h3>$1</h3>');
	inString = inString.replace(/^\#{2}\s(.*)=*/gm, '<h2>$1</h2>');
	inString = inString.replace(/^\#{1}\s(.*)=*/gm, '<h1>$1</h1>');
	
	//Regular expressions for lists
	inString = inString.replace(/^\s*\d*\.\s(.*)/gm, '<ol><li>$1</li></ol>');
	inString = inString.replace(/^\s*[\-\*]\s(.*)/gm, '<ul><li>$1</li></ul>');

	// Fix for superflous ul tags
	inString = inString.replace(/\<\/ol\>(\r\n|\n|\r)\<ol\>/gm,"");
	inString = inString.replace(/\<\/ul\>(\r\n|\n|\r)\<ul\>/gm,"");

	//Regular expression for line
	inString = inString.replace(/^(\-{3}\n)/gm, '<hr>');
	
	// Markdown for hard new lines -- \n\n and \n\n\n (supports windows \r\n, unix \n, and mac \r styles for new lines)
	inString = inString.replace(/(\r\n|\n|\r){3}/gm,"<br><br>");
	inString = inString.replace(/(\r\n|\n|\r){2}/gm,"<br>");
	
	// Hyperlink !!!
	// !!!url,text to show!!!	
	inString = inString.replace(/\!{3}(.*?\S),(.*?\S)\!{3}/g, '<a href="$1" target="_blank">$2</a>');

	// External img src !!!
	// |||src|||	
	inString = inString.replace(/\|{3}(.*?\S)\|{3}/g, '<img src="$1" />');

	// External mp4 src !!!
	// ==[src]==	
	inString = inString.replace(/\={2}\[(.*?\S)\]\={2}/g, '<video width="80%" style="display:block; margin: 10px auto;" controls><source src="$1" type="video/mp4"></video>');

	// Image Movie Link format: <img src="pngname.png" class="gifimage" onclick="showGif('gifname.gif');"/>
	// +++image.png,image.gif+++	
	inString = inString.replace(/\+{3}(.*?\S),(.*?\S)\+{3}/g,"<div><img src='../../Shared/icons/PlayT.svg'><img class='gifimage' src='$1' onclick=\"showGif('$2');\" target='_blank' /></div>");

	// Right Arrow for discussing menu options
	inString = inString.replace(/\s[\-][\>]\s/gm, "&rarr;");

	// Strike trough text
	inString = inString.replace(/\-{4}(.*?\S)\-{4}/g, "<span style=\"text-decoration:line-through;\">$1</span>");

	// Importand Rows in code file in different window ===
	// ===filename,start row,end row, text to show===
	inString = inString.replace(/\={3}(.*?\S),(.*?\S),(.*?\S),(.*?\S)\={3}/g, '<span class="impword2" onmouseover="highlightRows(\'$1\',$2,$3)" onmouseout="dehighlightRows(\'$1\',$2,$3)">$4</span>');

	return inString;
}

