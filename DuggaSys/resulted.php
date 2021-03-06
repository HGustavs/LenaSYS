<?php
/********************************************************************************
   Documentation
*********************************************************************************
This file displays the result of each student with access under this course, the teacher can grade students
in this page.
Execution: resulted.js has an ajax call that runs at start up and displays the returned data on this page.
-------------==============######## Documentation End ###########==============-------------*/
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>
<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<meta name="google" content="notranslate">
	<title>Result Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/dugga.css" rel="stylesheet">

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>

	<script src="../Shared/dugga.js"></script>
	<script src="../Shared/markdown.js"></script>
	<script src="../Shared/SortableTableLibrary/sortableTable.js"></script>
	<script src="resulted.js"></script>
</head>
<body onload="setup();">
	<?php
		$noup="SECTION";
		$resultedkind = true;
		include '../Shared/navheader.php';
		include_once "../Shared/basic.php";
		$cid=getOPG('courseid');
	?>

	<!-- <div id="content"></div> -->

	<?php
		include '../Shared/loginbox.php';
  ?>
  <!-- content START -->
	<div id="content">
	
	<!-- Legend content which includes icons that are used in the database of the resultEd. -->
	<!-- Each icon has a description. legendBtn, legendList and legendListItem was created in style.css to build -->
	<!-- design of the whole legend. The button "?" is an icon which sticks out in the right of the resultEd.php site. -->
	
	<div id="resultedLegendContainer" >
	
		<div id="legendBtn"> ? </div>
		<ul class="legendList">
			<li class="legendListItem"><img alt="pass icon" src="../Shared/icons/Uh.png"><img src="../Shared/icons/G.png"> Pass</li>
			<li class="legendListItem"><img alt="fail icon" src="../Shared/icons/U.png"><img src="../Shared/icons/Gc.png"> Fail</li>
			<li class="legendListItem"><img alt="pending icon" src="../Shared/icons/Uc.png"><img src="../Shared/icons/Gc.png"> Pending / not graded</li>
			<li class="legendListItem"><img alt="stats icon" src="../Shared/icons/FistV.png"> Dugga stats</li>
			<li class="legendListItem"><img alt="deadline passed icon" src="../Shared/icons/warningTriangle.png"> Deadline passed</li>
			<li class="legendListItem"><span> (9) </span><span> Grading changes</span></li>
			<li class="legendListItem"><img alt="not submitted icon" src="../Shared/icons/not_announced_icon.svg"> Dugga not yet submitted</li>
			<li class="legendListItem"><div class="dugga-moment"></div> Dugga moment</li>
			<li class="legendListItem"><div class="dugga-pending-late-submission"></div> Dugga pending: Late submission</li>
			<li class="legendListItem"><div class="dugga-pending"></div> Dugga pending: Submitted in time</li>
			<li class="legendListItem"><div class="dugga-pass"></div> Dugga passed</li>
			<li class="legendListItem"><div class="dugga-moment dugga-pass"></div> Moment passed</li>
			<li class="legendListItem"><div class="dugga-moment dugga-fail"></div> Moment failed</li>
			<li class="legendListItem"><div class="dugga-moment dugga-assigned"></div> Dugga assigned</li>
			<li class="legendListItem"><span>Unassigned</span><span> No moment assigned</span></li>
		</ul>
	</div>
    <div id="resultedFormContainer">
	<div class="titles" style="justify-content:flex-start;">
			<h1>Edit student results</h1>
    </div>
	
    </div>

		<!--<div id="resultTable" style='width:fit-content; white-space: nowrap; position: absolute; margin-top: 100px; margin-bottom: 30px;'>-->
		<div class="resulted-filter-container">
			<div class="search-filter-container">
				<label class="filter-label" for="">Search</label>
				<input class="searchbar-filter" type="text">
			</div>
			<div class="select-dugga-filter">
				<div class="dugga-filter-container">
					<div class="filter-btn filter-btn-duggaName" onclick="showAvaiableDuggaFilter()">Show dugga filter</div>
					<div class="show-dugga-filter-popup hidden"></div>
				</div>
			</div>
			<div class="select-date-interval">
				<div>
					<label class="filter-label" for="">Earliest Submission</label>
					<input class="date-interval-selector" type="date" id="datepicker-interval-1">
				</div>
				<div>
					<label class="filter-label" for="">Latest Submission</label>
					<input class="date-interval-selector" type="date" id="datepicker-interval-2">
				</div>
			</div>
			<div class="filter-btn" onclick="searchByFilter()">Search</div>
		</div>
		<div class="resulted-filter-container">
			<div>
				<label class="filter-label" for="">Highlight threshold (Times Accessed)</label>
				<input class="searchbar-filter" id="highlight-entry" type="text" value="20" onkeyup="updateTable()">
			</div>
			<div>
				<label class="filter-label" for="">Enabled</label>
				<input type="checkbox" id="highlight-checkbox" onclick="updateTable()">
			</div>
		</div>
		<div id="resultTable"></div>
	</div>
	<!-- content END -->

	<!-- -------------------=============####### Result Popover #######=============------------------- -->

	<div id='resultpopover' class='resultPopover' style='display: none'>
		<div class='loginBoxheader'>
			<span id="hoverRes" ></span>
			<h3 style='width:100%;' id='Nameof' onmouseover="hoverResult();"
			onmouseout="hideHover();" >Show Results</h3>
			<button id='gradeBtn' class='cursorPointer' onclick="toggleGradeBox();">
				<img alt="grade icon" src="../Shared/icons/FistV.png" height="24px" width="24px">
			</button>
			<div class='cursorPointer' onclick='closeWindows();'>x</div>
		</div>

		<div id="MarkCont" style="position: absolute; left:4px; width: 99%; top:34px; bottom:4px; border:2px inset #aaa;background:#bbb;"> </div>
		<div id="toggleGrade">
		<div id='markMenuPlaceholder'></div>
		<div id="teacherFeedbackTable"></div>
		</div>
	</div>


  <!-- -------------------=============####### Statistics Popover #######=============------------------- -->

	<div id='statisticspopover' class='previewpopover' style='display:none;'>
		<div class='loginBoxheader'>
			<h3 style='width:100%;' id='Nameof'>Collective results</h3><div class='cursorPointer' onclick='closeWindows();'>x</div>
		</div>
	</div>

	<div id='resultlistpopover' class='previewpopover' style='display:none;flex-direction:column;'>
		<div class='loginBoxheader'>
			<h3 style='width:100%;' id='resultlistheader'>Collective results</h3><div class='cursorPointer' onclick='closeWindows();'>x</div>
    </div>
    <div style='display:flex;flex-direction:column;flex:1;'>
      <textarea id='resultlistarea' style='resize:none;flex:1;overflow:scroll;padding:5px;margin:5px 0 5px 0;'></textarea>
			<span>
				<img id ='copyClipboard'  src='../Shared/icons/Copy.svg' alt='copy to clipboard' onclick='copyLadexport();' title='Copy to clipboard / Mark as exported'>
				<span style='padding-left: 15px; line-height: 28px'>Last exported:
				<span id='lastExpDate'></span>
				<span>
				<input class='cursorPointer' type='button' value='Close' onclick='closeLadexport();' style=' width:100px; float: right;'>
			</span>
		</div>
	</div>

	<!-- This popup is for alerts about LadExport -->
	<div id="gradeExportPopUp" style="display: none;">
		<div class="loginBoxheader">
			<h3>Alert</h3>
			<div class='cursorPointer' onclick="closeWindows()" title="Close window">x</div>
		</div>
		<!-- The message should go into this p tag -->
		<p id="exportPopUpMessage"></p>
		<input type="button" id="gradeExportPopUpButton" value="Ok" class="submit-button" onclick="closeWindows();">
	</div>


</body>
</html>
