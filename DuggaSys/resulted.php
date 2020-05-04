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
	<div id="resultedLegendContainer">
		<div id="legendBtn" onclick="showLegend();"> ? </div>
		<ul class="legendList">
			<li class="legendListItem"><img src="../Shared/icons/FistV.png" alt="grade"> Show dugga stats</li>
			<li class="legendListItem"><img src="../Shared/icons/Uh.png" alt="grade"><img src="../Shared/icons/G.png" alt="grade"> Pass</li>
			<li class="legendListItem"><img src="../Shared/icons/U.png" alt="grade"><img src="../Shared/icons/Gc.png" alt="grade"> Fail</li>
			<li class="legendListItem"><img src="../Shared/icons/Uc.png" alt="grade"><img src="../Shared/icons/Gc.png" alt="grade"> Pending/not graded</li>
			<li class="legendListItem"><img src="../Shared/icons/warningTriangle.png" alt="grade"> Submission past deadline</li>
			<li class="legendListItem"><div> (9) </div> <div>Grading changes</div></li>
			<li class="legendListItem"><img src="../Shared/icons/not_announced_icon.svg" alt="grade"> Not announced</li>
			<li class="legendListItem"><div class="dugga-moment"></div> Dugga moment</li>
			<li class="legendListItem"><div class="dugga-pending-late-submission"></div> Dugga pending: Late submission</li>
			<li class="legendListItem"><div class="dugga-pending"></div> Dugga pending: Submission in time</li>
			<li class="legendListItem"><div class="dugga-moment"><div class="dugga-pass"></div></div> Moment passed</li>
			<li class="legendListItem"><div class="dugga-moment"><div class="dugga-fail"></div></div> Moment failed</li>
			<li class="legendListItem"><div class="dugga-moment"><div class="dugga-assigned"></div></div> Moment assigned</li>
		</ul>
	</div>
    <div id="resultedFormContainer">
	<div class="titles" style="justify-content:flex-start;">
			<h1>Edit student results</h1>
    </div>
      <div id="ladexportContainer">
      <div class="resultedFormsFlex">
        <label>Delkurs</label>
        <select id="ladselect"></select>
      </div>
      <div class="resultedFormsFlex">
        <label>Betygsskala</label>
        <!--<input id="ladgradescale" type="text" style="font-size:12px;">-->
        <select id="ladgradescale">
          <option value="U-G-VG" selected>U-G-VG</option>
          <option value="U-G">U-G</option>
       	  <!-- <option value="U-3-4-5">U-3-4-5</option> -->
        </select>
      </div>
      <div class="resultedFormsFlex">
        <label>Betygsdatum</label>
        <input id="laddate" type="date" style="font-size:12px;">
        </div>
      <button class="resultedbuttons" onclick="ladexport();">LadExport</button>
			</div>
			<div style="display: flex;">
			<!-- Email button will be disabled if user is not logged in as admin, or not logged in at all -->
			<?php if (checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))){ ?>
				<button class="resultedbuttons" onclick="mail();">Mail students</button>
			<?php }else{ ?>
				<button class="resultedbuttons" onclick="mail();" disabled>Mail students</button>
			<?php } ?>
        <div class="resultedFormsFlex">
				<label>Filtrera efter</label>
				<select id="gradeFilterScale" onchange="updateTable();">
					<option value="Filter-none" selected>none</option>
					<option value="Filter-G">G</option>
					<option value="Filter-VG">VG</option>
					<option value="Filter-U">U</option>
				</select>
				</div>
				<div class="resultedFormsFlex">
					<label>Examinator:</label>
					<select name="teacherDropdown" id="teacherDropdown" onchange="updateTable()"></select>
				</div>
			</div>
    </div>

		<!--<div id="resultTable" style='width:fit-content; white-space: nowrap; position: absolute; margin-top: 100px; margin-bottom: 30px;'>-->
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
				<img src="../Shared/icons/FistV.png" alt="grade" height="24px" width="24px">
			</button>
			<div class='cursorPointer' onclick='closeWindows();'>x</div>
		</div>

		<div id="MarkCont" style="position: absolute; left:4px; width: 99%; top:34px; bottom:4px; border:2px inset #aaa;background:#bbb;"> </div>
		<div id="toggleGrade">
		<div id='markMenuPlaceholder'></div>
		<div id="teacherFeedbackTable"></div>
		</div>
	</div>

  <!-- -------------------=============####### Preview Popover #######=============------------------- -->


	<div id='previewpopover' class='previewPopover' style='display:none;'>
		<div class='loginBoxheader'>
			<h3 style='width:100%;' id='Nameof'>Document Preview</h3><div class='cursorPointer' onclick='closeWindows();'>x</div>
		</div>
		<div style="position:absolute;left:0px;top:34px;bottom:0px;right:0px;">
			<table width="100%" height="100%">
					<tr>
							<td width="75%" height="100%" id="popPrev" style="border:2px inset #aaa;background:#bbb; overflow:scroll;">
									<embed src="" width="100%" height="100%" type='application/pdf' />
							</td>
							<td height="100%" id='markMenuPlaceholderz' style="background:#beb;">
										<table width="100%" height="100%">
											<tr height="24px">
													<td>
															<button onclick='addCanned();'>Add</button>
															<select id="cannedResponse">
																	<option>&laquo; NONE &raquo;</option>
																	<option>(Y) </option>
																	<option>(N) </option>
																	<option>:) </option>
															</select>
													</td>
											</tr>
											<tr height="100%">
													<td>
															<textarea id="responseArea" style="width: 100%;height:100%;-webkit-box-sizing: border-box; -moz-box-sizing: border-box;box-sizing: border-box;">Glomar Explorer</textarea>
													</td>
											</tr>
											<tr height="24px">
													<td>
															<button onclick='saveResponse();'>Save</button>
													</td>
											</tr>
										</table>
							</td>
					</tr>
			</table>
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


</body>
</html>
