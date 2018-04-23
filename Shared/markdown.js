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

function thumbnailImg(x,size) {
    if (size == 0){
        x.style.width = x.naturalWidth + "px";
    } else {
        x.style.width = size + "px";
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
    // append '&&&' to all console block indicators '=|='
    inString = inString.replace(/^\=\|\=(\r\n|\n|\r)/gm, '=|=&&&');

    //One line break
     inString=inString.replace(/(\r\n|\n|\r){3}/gm,"<br>");

    // Split on code or console block
    var codearray=inString.split(/\~{3}|\=\|\=/);
    var str="";
    var specialBlockStart=true;

    for(var i=0;i<codearray.length;i++){

        workstr=codearray[i];
        if(workstr.substr(0,3)==="@@@" && specialBlockStart===true){
            specialBlockStart=false;
            workstr='<pre><code>'+workstr.substr(3)+'</code></pre>';
        } else if(workstr.substr(0,3)==="&&&" && specialBlockStart===true) {
            specialBlockStart=false;
            workstr='<div class="console"><pre>'+workstr.substr(3)+'</pre></div>';
        } else if(workstr !== "") {
            workstr=parseLineByLine(workstr.replace(/^\&{3}|^\@{3}/gm, ''));
            specialBlockStart=true;
        }
        str+=workstr;
    }

    return "<div id='markdown'>"+str+"</div>";
}

//----------------------------------------------------------------------------------
// parseLineByLine: Parses file line by line
//
//
//----------------------------------------------------------------------------------

// This function will parse the text line by line
function parseLineByLine(inString) {
    var str = inString;
    var markdown = "";

    var currentLineFeed = str.indexOf("\n");
    /*if no \n is present, the first line will never
    be written as currentlinefeed will be -1. The
    while-loop will never run and markdown will remain = ""*/
    if(currentLineFeed == -1)
    {
        currentLineFeed = str.length;
    }
    var currentLine = "";
    var prevLine = "";
    var remainingLines = "";
    var nextLine = "";

    while(currentLineFeed != -1){ /* EOF */
        prevLine = currentLine;
        currentLine = str.substr(0, currentLineFeed);
        remainingLines = str.substr(currentLineFeed + 1, str.length);
        nextLine= remainingLines.substr(0,remainingLines.indexOf("\n"));

        markdown = identifier(prevLine, currentLine, markdown, nextLine);

        // line done parsing. change start position to next line
        str = remainingLines;
        currentLineFeed = str.indexOf("\n");
    }
    markdown = identifier(prevLine, remainingLines, markdown, nextLine);
    return markdown;
}
// This function detect the text type
function identifier(prevLine, currentLine, markdown, nextLine){
    if(isUnorderdList(currentLine) || isOrderdList(currentLine)) {
        // handle lists
        markdown += handleLists(currentLine, prevLine, nextLine);
    }else if(isTable(currentLine)) {
        // handle tables
        markdown += handleTable(currentLine, prevLine, nextLine);
    }else{
        // If its ordinary text then show it directly
        markdown += markdownBlock(currentLine);
    }
    // close table
    if(!isTable(currentLine) && !isTable(nextLine)){
        markdown += "</tbody></table>";
    }
    return markdown;
}
// Check if its an unordered list
function isUnorderdList(item) {
    // return true if space followed by a dash or astersik
    return /^\s*(?:\-|\*)\s.*$/gm.test(item);
}
// Check if its an ordered list
function isOrderdList(item) {
    // return true if space followed by a digit and a dot
    return /^\s*\d\.\s.*$/gm.test(item);
}
// CHeck if its a table
function isTable(item) {
    // return true if space followed by a pipe-character and have closing pipe-character
    //return /^\s*\|\s*(.*)\|/gm.test(item);
    return false;
}
// The creation and destruction of lists
function handleLists(currentLine, prevLine, nextLine) {
    var markdown = "";
    var value = "";
    var currentLineIndentation = currentLine.match(/^\s*/)[0].length;
    var nextLineIndentation = nextLine.match(/^\s*/)[0].length;
    // decide value
    if(isOrderdList(currentLine)) value = currentLine.substr(currentLine.match(/^\s*\d*\.\s*/)[0].length, currentLine.length);
    if(isUnorderdList(currentLine)) value = currentLine.substr(currentLine.match(/^\s*[\-\*]\s*/gm)[0].length, currentLine.length);
    // Open new list
    if(!isOrderdList(prevLine) && isOrderdList(currentLine) && !isUnorderdList(prevLine)) markdown += "<ol>"; // Open a new ordered list
    if(!isUnorderdList(prevLine) && isUnorderdList(currentLine) && !isOrderdList(prevLine)) markdown += "<ul>"; //Open a new unordered list
    // Open a new sublist
    if(currentLineIndentation < nextLineIndentation) {
        markdown += "<li>";
        markdown +=  markdownBlock(value);
        // begin open sublist
        if(isOrderdList(nextLine)) {
            markdown += "<ol>";
            openedSublists.push(0);
        }else{
            markdown += "<ul>";
            openedSublists.push(1);
        }
    }
    // Stay in current list or sublist
    if(currentLineIndentation === nextLineIndentation) {
        markdown += "<li>";
        markdown +=  markdownBlock(value);
        markdown += "</li>";
    }
    // Close sublists
    if(currentLineIndentation > nextLineIndentation) {
        markdown += "<li>";
        markdown +=  markdownBlock(value);
        markdown += "</li>";
        var sublistsToClose = (currentLineIndentation - nextLineIndentation) / 2;
        for(var i = 0; i < sublistsToClose; i++) {
            var whatSublistToClose = openedSublists[openedSublists.length - 1];
            openedSublists.pop();

            if(whatSublistToClose === 0) { // close ordered list
                markdown += "</ol>";
            }else{ // close unordered list
                markdown += "</ul>";
            }
            markdown += "</li>";
        }
    }
    // Close list
    if(!isOrderdList(nextLine) && isOrderdList(currentLine) && !isUnorderdList(nextLine) && !isTable(nextLine)) markdown += "</ol>"; // Close ordered list
    if(!isUnorderdList(nextLine) && isUnorderdList(currentLine) && !isOrderdList(nextLine) && !isTable(nextLine)) markdown += "</ul>"; // Close unordered list
    return markdown;
}
function handleTable(currentLine, prevLine, nextLine) {
    var markdown = "";
    var columns = currentLine.split('|').filter(function(v){return v !== '';});
    // open table
    if(!isTable(prevLine)) {
        markdown += "<table class='markdown-table'>";
    }
    // create thead
    if(!isTable(prevLine) && nextLine.match(/^\s*\|\s*[:]?[-]*[:]?\s*\|/gm)) {
        markdown += "<thead>";
        markdown += "<tr>";
        for(var i = 0; i < columns.length; i++) {
            markdown += "<th>" + columns[i].trim() + "</th>";
        }
        markdown += "</tr>";
        markdown += "</thead>";
    }
    // create tbody
    else {
        // configure alignment
        if(currentLine.match(/^\s*\|\s*[:]?[-]*[:]?\s*\|/gm)) {
            for(var i = 0; i < columns.length; i++) {
                var column = columns[i].trim();

                // align center
                if(column.match(/[:][-]*[:]/gm)) tableAlignmentConf[i] = 1;
                // align right
                else if(column.match(/[-]*[:]/gm)) tableAlignmentConf[i] = 2;
                // align left
                else tableAlignmentConf[i] = 3;
            }
        }
        // handle table row
        else {
            markdown += "<tr style=''>";
            for(var i = 0; i < columns.length; i++) {
                var alignment = "";

                if(tableAlignmentConf[i] === 1) alignment = "center";
                else if(tableAlignmentConf[i] === 2) alignment = "right";
                else alignment = "left";
                if(columns[i].trim().match(/^[*].{1}\s*(.*)[*].{1}/gm)){
                    markdown += "<td style='text-align: " + alignment + ";font-weight:bold;'>" + columns[i].trim().replace(/[*].{1}/gm, '') + "</td>";
                }else if(columns[i].trim().match(/^[*].{0}\s*(.*)[*].{0}/gm)){
                    markdown += "<td style='text-align: " + alignment + ";font-style:italic'>" + columns[i].trim().replace(/[*].{0}/gm, '') + "</td>";
                }else if(columns[i].trim().match(/^[`].{0}\s*(.*)[`].{0}/gm)){
                    markdown += "<td style='text-align: " + alignment + ";'><code style='border-radius: 3px; display: inline-block; color: white; background: darkgray; padding: 2px;''>" + columns[i].trim().replace(/[`].{0}/gm, '') + "</code></td>";
                } else{
                    markdown += "<td style='text-align: " + alignment + ";'>" + columns[i].trim() + "</td>";
                }

            }
            markdown += "</tr>";

            // close thead and open tbody
            if(!isTable(prevLine)) {
                markdown += "</thead><tbody>";
            }
        }
    }
    return markdown;
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

    //Regular expression for line
    inString = inString.replace(/\-{3,}/g, '<hr>');

    // External img src !!!
    // |||src,thumbnail width in px,full size width in px|||
    // Markdown image zoom rollover: All images are normally shown as a thumbnail but when rollover original image size will appear
    inString = inString.replace(/\|{3}(.*?\S),(.*?\S),(.*?\S)\|{3}/g, '<img class="imgzoom" src="$1" onmouseover="originalImg(this, $3)" onmouseout="thumbnailImg(this, $2)" width="$2px" style="border: 3px solid #614875;" />');
    inString = inString.replace(/\|{3}(.*?\S)\|{3}/g, '<img class="imgzoom" src="$1" />');

    // Markdown for hard new lines -- \n\n and \n\n\n (supports windows \r\n, unix \n, and mac \r styles for new lines)
    // markdown below does not work correctly

    inString = inString.replace(/(\r\n){3}/gm,"<br><br>");
    inString = inString.replace(/(\r\n){2}/gm,"<br>");
    inString = inString.replace(/(\n){3}/gm,"<br><br>");
    inString = inString.replace(/(\n){2}/gm,"<br>");
    inString = inString.replace(/(\r){3}/gm,"<br><br>");
    inString = inString.replace(/(\r){2}/gm,"<br>");

    // Hyperlink !!!
    // !!!url,text to show!!!
    inString = inString.replace(/\!{3}(.*?\S),(.*?\S)\!{3}/g, '<a href="$1" target="_blank">$2</a>');

    // External mp4 src !!!
    // ==[src]==
    inString = inString.replace(/\={2}\[(.*?\S)\]\={2}/g, '<video width="80%" style="display:block; margin: 10px auto;" controls><source src="$1" type="video/mp4"></video>');

    // Link to gif animation with thumbnail
    // +++thumbnail.png,animation.gif+++
    inString = inString.replace(/\+{3}(.*?\S),(.*?\S)\+{3}/g,"<div class='gifwrapper'><img class='gifimage' src='$1' onclick=\"toggleGif('$2', '$1', this);\" /><img class='playbutton' src='../Shared/icons/PlayT.svg'></div>");

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
    inString = inString.replace(/\s:D(?!\S)/g, " <img class='smileyjs' src='../Shared/icons/happy.svg'/>");
    inString = inString.replace(/\s:\)(?!\S)/g, " <img class='smileyjs' src='../Shared/icons/smiling.svg'/>");
    inString = inString.replace(/\s;\)(?!\S)/g, " <img class='smileyjs' src='../Shared/icons/wink.gif'/>");
    inString = inString.replace(/\s:\((?!\S)/g, " <img class='smileyjs' src='../Shared/icons/sad.svg'/>");
    inString = inString.replace(/\s:'\((?!\S)/g, " <img class='smileyjs' src='../Shared/icons/crying.svg'/>");
    inString = inString.replace(/\s:P(?!\S)/gi, " <img class='smileyjs' src='../Shared/icons/tongue.svg'/>");
    inString = inString.replace(/\s:\/(?!\S)/g, " <img class='smileyjs' src='../Shared/icons/confused.svg'/>");
    inString = inString.replace(/\s:(O|0)(?!\S)/gi, " <img class='smileyjs' src='../Shared/icons/gasp.svg'/>");
    inString = inString.replace(/\s&lt;3(?!\S)/g, " <img class='smileyjs' src='../Shared/icons/heart.svg'/>");
    inString = inString.replace(/\s\(Y\)(?!\S)/gi, " <img class='smileyjs' src='../Shared/icons/thumbsup.svg'/>");
    inString = inString.replace(/\s\(N\)(?!\S)/gi, " <img class='smileyjs' src='../Shared/icons/thumbsdown.svg'/>");

    return inString;
}

function showPreview() {
    $(".previewWindow").css("display", "block");
}

function cancelPreview() {
    $(".previewWindow").hide();
}

function loadPreview(fileUrl) {
    var fileContent = getFIleContents(fileUrl);
    document.getElementById("mrkdwntxt").value = fileContent;
    updatePreview(fileContent);
    $(".previewWindow").show();
}

function updatePreview(str) {
    //This function is triggered when key is pressed down in the input field
    if(str.length == 0){
        /*Here we check if the input field is empty (str.length == 0).
          If it is, clear the content of the txtHint placeholder
          and exit the function.*/
        document.getElementById("markdown").innerHTML = " ";
        return;
    }
    else {
        document.getElementById("markdown").innerHTML=parseMarkdown(str);
    };
}

function getFIleContents(fileUrl){
    var result = null;
    $.ajax({
        url: fileUrl,
        type: 'get',
        dataType: 'html',
        async: false,
        success: function(data) {
            result = data;
        }
    });
    return result;
}


function boldText() {
    $('#mrkdwntxt').val($('#mrkdwntxt').val()+'****');
}

function cursiveText() {
    $('#mrkdwntxt').val($('#mrkdwntxt').val()+'____');
}

function showDropdown() {
    $('#select-header').show();
}

function selected() {
    $('#select-header').hide();
}

function headerVal1() {
    $('#mrkdwntxt').val($('#mrkdwntxt').val()+'# ');

}

function headerVal2() {
    $('#mrkdwntxt').val($('#mrkdwntxt').val()+'## ');
}
function headerVal3() {
    $('#mrkdwntxt').val($('#mrkdwntxt').val()+'### ');
}


$(document).ready(function(){
   $(".headerType").click(function(){
        $("#select-header").toggle();
        $("#select-header").addClass("show-dropdown-content");
    });
});

//Hide dropdown if click is outside the div
$(document).mouseup(function(e) {
    var container = $("#select-header");

    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
    }
});