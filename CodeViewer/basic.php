<?php
include "../Shared/basic.php";


//---------------------------------------------------------------------------------------------------------------
// editsectionmenu - Displays an editable or un-editable section menu
//---------------------------------------------------------------------------------------------------------------

function editsectionmenu($kind)
{
    echo "<body onload='AJAXServiceSection(\"\",\"\");'>";

    // Course Content List - If course exists!
    echo "<table width='100%'><tr><td rowspan='2'><div id='Sectionlist'>";
    echo "<div style='left:20px' class='warning'>";
    echo "Please wait while content loads<br/>";
    echo "<img src='icons/Starspinner3.gif' /><br/>";
    echo "Do not forget to enable Javascript<br/>";
    echo "</div>";
    echo "</div></td>";

    // Login log out button

    echo "<td align='right' valign='top'>";
    echo "<table cellspacing='2'><tr>";
    if($kind){
        echo "<td class='buttos' title='New section' onclick='newSection(\"1\");'><img src='icons/Plus.svg' /></td>";
        echo "<td class='buttos' title='New bold section' onclick='newSection(\"2\");'><img src='icons/Bold.svg' /></td>";
    }

    //To be inserted here: Put different title depending on user beging logged in or not
    echo "<td align='right' class='butto' title='Logga ut' onclick='location=\"loginlogout.php\";'><img src='icons/Man.svg' /></td>";
    echo "</tr></table>";

    echo "</tr><tr><td></td></tr></table>";

    echo "</body>";
    echo "</html>";

}

//---------------------------------------------------------------------------------------------------------------
// courselist - Displays a list of the current courses
//---------------------------------------------------------------------------------------------------------------

function courselist()
{
    echo "<span class='inv'>LenaSYS</span>";
    echo "<table width='100%'><tr><td rowspan='2'><div id='Sectionlist'>";
    echo "<span class='course'>Course Example Organization System</span>";

    $querystring="SELECT course.coursename,max(cversion) AS version FROM course LEFT OUTER JOIN section ON course.coursename=section.coursename GROUP BY course.coursename;;";
    $result=mysql_query($querystring);
    if (!$result) err("SQL Query Error: ".mysql_error(),"Database Password Check Error");
    while ($row = mysql_fetch_assoc($result)){
        echo "<span class='bigg'><a href='Sectioned.php?courseid=".$row['coursename']."&vers=".$row['version']."'>".$row['coursename']."</a></span>";
    }

    echo "</div></td>";

    //To be inserted here: Put different title depending on user beging logged in or not
    echo "<td align='right' class='butto' title='Logga in' onclick='location=\"loginlogout.php\";'><img src='icons/Man.svg' /></td>";
    echo "</tr><tr><td></td></tr></table>";
}

//---------------------------------------------------------------------------------------------------------------
// editcontentmenu - Code Viewer Menu Code
//---------------------------------------------------------------------------------------------------------------

function editcodemenu($kind)
{
    // Body if we are allowed to run code viewer
    echo '<body style="margin: 0; padding: 0;" onload="setup();">';
    echo '<span id="forwdrop" title="Test1" class="dropdown forwdrop"><div class="dropdownback">Forw</div></span>';
    echo '<span id="backwdrop" title="Test2" class="dropdown backwdrop"><div class="dropdownback">Backw</div></span>';
    if($kind){
        echo '<span id="codedrop" class="dropdown codedrop" style="overflow:scroll;"><div class="dropdownback">Code viewer Code File Selector</div></span>';
        echo '<span id="docudrop" class="dropdown docudrop"><div class="dropdownback">Wordlist Selector</div></span>';
    }

    echo '<div id="buttomenu">';
    echo '<table cellspacing="2"><tr>';
    echo '<td class="butto" title="Back to menu" onclick="Up();"><img src="icons/Up.svg" /></td>';
    echo '<td class="butto" id="beforebutton" title="Previous" onmousedown="SkipBDown();" onmouseup="SkipBUp();" onclick="SkipB();"><img src="icons/SkipB.svg" /></td>';
    echo '<td class="butto" id="afterbutton" title="Next" onmousedown="SkipFDown();" onmouseup="SkipFUp();" onclick="SkipF();""><img src="icons/SkipF.svg" /></td>';
    echo '<td class="butto" id="playbutton" title="Play demo" onclick="Play();"><img src="icons/Play.svg" /></td>';
    echo '<td class="butto" id="numberbutton" title="Show/Hide linenumbers" onclick="fadelinenumbers();"><img src="icons/nrshow.svg" /></td>';
    echo '<td class="buttospacer">&nbsp;</td>';
    if($kind){
        echo '<td class="butto" title="Plus" onclick="Plus();"><img src="icons/Plus.svg" /></td>';
        echo '<td class="butto" onclick="Minus();"><img src="icons/Minus.svg" /></td>';
        echo '<td class="buttospacer">&nbsp;</td>';
        echo '<td class="butto" onclick="Bold();"><img src="icons/Bold.svg" /></td>';
        echo '<td class="butto" onclick="Save();"><img src="icons/Diskett.svg" /></td>';
        echo '<td class="buttospacer">&nbsp;</td>';
        echo '<td class="butto" onclick="Code();"><img src="icons/Document.svg" /></td>';
        echo '<td class="butto" onclick="Wordlist();"><img src="icons/Book.svg" /></td>';
        echo '<td class="menutext"><span id="exampleSection">Foo</span>&nbsp;:&nbsp;<span id="exampleName" contenteditable="true">Example Code Page</td>';
    }else{
        echo '<td class="menutext"><span id="exampleSection">Foo</span>&nbsp;:&nbsp;<span id="exampleName">Example Code Page</td>';
    }

    //To be inserted here: Put different title depending on user beging logged in or not
    echo '<td class="butto" id="tipthis" title="Logga in" onclick="location=\'loginlogout.php\';"><img src="icons/Man.svg" /></td></tr>';
    echo '</table></div>';
    echo '<div style="width:100%; position: absolute; top: 50px; bottom: 0px;" id="div2;background-color:#def">';
    echo '<div id="docucontent"';
    if($kind){
        echo ' contenteditable="true" >';
    }else{
        echo '>';
    }
    echo '<div style="left:20px" class="warning">';
    echo 'Please wait while content loads<br/>';
    echo '<img src="icons/Starspinner3.gif" /><br/>';
    echo 'Do not forget to enable Javascript<br/>';
    echo '</div>';
    echo '</div>';
    echo '<div id="codebox">';
    echo '<div id="infobox" class="codeview">';
    echo '<div style="left:300px" class="warning">';
    echo 'Please wait while content loads<br/>';
    echo '<img src="icons/Starspinner3.gif" /><br/>';
    echo 'Do not forget to enable Javascript<br/>';
    echo '</div>';
    echo '</div>';
    echo '</div>';
    echo '</div>';

}

//---------------------------------------------------------------------------------------------------------------
// jsvarget - Code to translate get variable to javascript through PHP
//---------------------------------------------------------------------------------------------------------------

function jsvarget($getname,$varname){
    if(isset($_GET[$getname])){
        echo 'var '.$varname.'="'.$_GET[$getname].'";';
    }else{
        echo 'var '.$varname.'="NONE!";';
    }
}

//---------------------------------------------------------------------------------------------------------------
// jsvarget - Code to translate session variable to javascript through PHP
//---------------------------------------------------------------------------------------------------------------

function jsvarsession($getname,$varname){
    if(isset($_SESSION[$getname])){
        echo 'var '.$varname.'="'.$_SESSION[$getname].'";';
    }else{
        echo 'var '.$varname.'="NONE!";';
    }
}

?>





