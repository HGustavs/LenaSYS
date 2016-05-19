/********************************************************************************

   Documentation

*********************************************************************************

Markdown support javascript

 
-------------==============######## Documentation End ###########==============-------------

*/

//Functions for gif image
//Fetches the picture and sets its properties
function showGif(url, size){
		document.getElementById("gifpicture").src = url;
		document.getElementById("gifpicture").style.width = size;
		$(".playbutton").toggle();
}

//Toggles between thumbnail and gif animation
function toggleGif(url1, url2){
	if(document.getElementById("gifpicture").src == url1){
		showGif(url2, 150 + "px"); //Show thumbnail
	}
	else{
		showGif(url1, 100 + "%"); //Show big animation gif
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
	x.style.width = size + "px";
}

function thumbnailImg(x,size) {
	x.style.width = size + "px";
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

			if(kodblock && workstr != ""){

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
	
	//Regular expressions for ordered lists
	// (###) to start a list
	// 1. Digit dot space
	// 2. Digit dot space
	// 		(###) to start a sublist
	// 		1. Digit dot space
	// 		(/###) to close the sublist
	// (/###) to close the list
	inString = inString.replace(/[(]\#{3}[)]/gm, '<ol>');
	inString = inString.replace(/[\d]{1,}\.\s(.*)/gm, '<li>$1</li>');
	inString = inString.replace(/[(][\/]\#{3}[)]/gm, '</ol>');
	
	//Regular expressions for unordered lists
	// (***) to start a list
	// * Bullet
	// 		(***) to start a sublist
	// 		* Sub-bullet
	// 		(/***) to close the sublist
	// (/***) to close the list
	inString = inString.replace(/[(]\*{3}[)]/gm, '<ul>');
	inString = inString.replace(/[\-\*]{1}\s(.*)/gm, '<li>$1</li>');
	inString = inString.replace(/[(][\/]\*{3}[)]/gm, '</ul>');

	//Regular expression for line
	inString = inString.replace(/\-{3,}/g, '<hr>');
	
	// Markdown for hard new lines -- \n\n and \n\n\n (supports windows \r\n, unix \n, and mac \r styles for new lines)
	inString = inString.replace(/(\r\n){3}/gm,"<br><br>");
	inString = inString.replace(/(\r\n){2}/gm,"<br>");
	
	inString = inString.replace(/(\n){3}/gm,"<br><br>");
	inString = inString.replace(/(\n){2}/gm,"<br>");
	
	inString = inString.replace(/(\r){3}/gm,"<br><br>");
	inString = inString.replace(/(\r){2}/gm,"<br>");
	
	// Hyperlink !!!
	// !!!url,text to show!!!	
	inString = inString.replace(/\!{3}(.*?\S),(.*?\S)\!{3}/g, '<a href="$1" target="_blank">$2</a>');

	// External img src !!!
	// |||src,thumbnail width in px,full size width in px|||
	// Markdown image zoom rollover: All images are normally shown as a thumbnail but when rollover original image size will appear
	inString = inString.replace(/\|{3}(.*?\S),(.*?\S),(.*?\S)\|{3}/g, '<img class="imgzoom" src="$1" onmouseover="originalImg(this, $3)" onmouseout="thumbnailImg(this, $2)" width="$2px" style="border: 3px solid #614875;" />');

	// External mp4 src !!!
	// ==[src]==	
	inString = inString.replace(/\={2}\[(.*?\S)\]\={2}/g, '<video width="80%" style="display:block; margin: 10px auto;" controls><source src="$1" type="video/mp4"></video>');

	// Link to gif animation with thumbnail
	// +++thumbnail.png,animation.gif+++	
	inString = inString.replace(/\+{3}(.*?\S),(.*?\S)\+{3}/g,"<div class='gifwrapper'><img class='gifimage' id='gifpicture' src='$1' onclick=\"toggleGif('$2', '$1');\" /><div class='playbutton'><img src='../Shared/icons/PlayT.svg' onclick=\"toggleGif('$2', '$1');\"></div></div>");

	// Right Arrow for discussing menu options
	inString = inString.replace(/\s[\-][\>]\s/gm, "&rarr;");

	// Strike trough text
	inString = inString.replace(/\-{4}(.*?\S)\-{4}/g, "<span style=\"text-decoration:line-through;\">$1</span>");

	// Importand Rows in code file in different window ===
	// ===filename,start row,end row, text to show===
	inString = inString.replace(/\={3}(.*?\S),(.*?\S),(.*?\S),(.*?\S)\={3}/g, '<span class="impword2" onmouseover="highlightRows(\'$1\',$2,$3)" onmouseout="dehighlightRows(\'$1\',$2,$3)">$4</span>');

	// Three or more dots should always be converted to an ellipsis.
	inString = inString.replace(/\.{3,}/g, "&hellip;");
	
	// Iframe, website inside a inline frame - (--url,width,height--)
	inString = inString.replace(/\(\-{2}(.*?\S),(.*?\S),(.*?\S)\-{2}\)/g, '<iframe src="$1" style="width:$2px; height:$3px;"></iframe>');
	
	// Quote text, this will be displayed in an additional box
	// ^ Text you want to quote ^
	inString = inString.replace(/\^{1}\s(.*?\S)\s\^{1}/g, "<blockquote>$1</blockquote><br/>");
	
	//Markdown smileys
	//Supported: :D :) ;) :( :'( :P :/ :o <3 (Y) (N)
	inString = inString.replace(/:D/g, "<img class='smileyjs' src='../Shared/icons/happy.svg'/>");
	inString = inString.replace(/:\)/g, "<img class='smileyjs' src='../Shared/icons/smiling.svg'/>");
	inString = inString.replace(/;\)/g, "<img class='smileyjs' src='../Shared/icons/wink.gif'/>");
	inString = inString.replace(/:\(/g, "<img class='smileyjs' src='../Shared/icons/sad.svg'/>");
	inString = inString.replace(/:'\(/g, "<img class='smileyjs' src='../Shared/icons/crying.svg'/>");
	inString = inString.replace(/:p|:P/g, "<img class='smileyjs' src='../Shared/icons/tongue.svg'/>");
	inString = inString.replace(/(:\/)(?!\/|\w|\d)/gm, "<img class='smileyjs' src='../Shared/icons/confused.svg'/>");
	inString = inString.replace(/:o|:O/g, "<img class='smileyjs' src='../Shared/icons/gasp.svg'/>");
	inString = inString.replace(/&lt;3/i, "<img class='smileyjs' src='../Shared/icons/heart.svg'/>");
	inString = inString.replace(/\(Y\)|\(y\)/g, "<img class='smileyjs' src='../Shared/icons/thumbsup.svg'/>");
	inString = inString.replace(/\(N\)|\(n\)/g, "<img class='smileyjs' src='../Shared/icons/thumbsdown.svg'/>");

	return inString;
}
