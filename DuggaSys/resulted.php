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
	?>

	<!-- <div id="content"></div> -->

	<?php
		include '../Shared/loginbox.php';
  ?>
  <!-- content START -->
	<div id="content">
		<div class="titles" style="justify-content:center;">
			<h1>Result</h1>
    </div>
    <div id="ladexportContainer" style="display:flex;">
      <div style="display:flex;flex-direction:column;justify-content:space-between;margin:5px;">
        <label>Delkurs</label>
        <select id="ladselect"></select>
      </div>
      <div style="display:flex;flex-direction:column;justify-content:space-between;margin:5px;">
        <label>Betygsskala</label>
        <!--<input id="ladgradescale" type="text" style="font-size:12px;">-->
        <select id="ladgradescale">
          <option value="U-G-VG" selected>U-G-VG</option>
          <option value="U-G">U-G</option>
          <option value="U-3-4-5">U-3-4-5</option>
        </select>
      </div>
      <div style="display:flex;flex-direction:column;justify-content:space-between;margin:5px;">
        <label>Betygsdatum</label>
        <input id="laddate" type="date" style="font-size:12px;">
      </div>
			<div style="display:flex; flex-direction:column;justify-content:space-between;margin:5px;">
				<label>Filtrera efter</label>
				<select id="gradeFilterScale" onchange="updateTable();">
					<option value="Filter-none" selected>inget</option>
					<option value="Filter-G">G</option>
					<option value="Filter-VG">VG</option>
					<option value="Filter-U">U</option>
				</select>
			</div>
      <button onclick="ladexport();">LadExport</button>
    </div>
		<!--<div id='searchBar' style='position:fixed; top:129px; right: 5px;'>-->
		<div id='searchBar' style='test-align:right;margin-bottom:5px;'>
			<input id='searchinput' type='text' name='search' placeholder='Search..' onkeyup='searchterm=document.getElementById("searchinput").value;searchKeyUp(event);myTable.reRender();'/>
			<button id='searchbutton' class='switchContent' onclick='return searchKeyUp(event);' type='button'>
				<img id='lookingGlassSVG' style='height:18px;' src='../Shared/icons/LookingGlass.svg'/>
			</button>
		</div>
		<!--<div id="resultTable" style='width:fit-content; white-space: nowrap; position: absolute; margin-top: 100px; margin-bottom: 30px;'>-->
		<div id="resultTable"></div>
	</div>
	<!-- content END -->

	<!-- -------------------=============####### Result Popover #######=============------------------- -->

	<div id='resultpopover' class='resultPopover' style='display:none'>
		<div class='loginBoxheader'>
			<h3 style='width:100%;' id='Nameof'>Show Results</h3><div class='cursorPointer' onclick='closeWindows();'>x</div>
		</div>
		<div id="MarkCont" style="position:absolute; left:4px; right:204px; top:34px; bottom:4px; border:2px inset #aaa;background:#bbb; overflow:scroll;"> </div>
		<div style="position:absolute; right:2px; top:34px; background:#bbb; width:200px;"><div id='markMenuPlaceholder'></div><div id="teacherFeedbackTable"></div></div>
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
      <textarea id='resultlistarea' style='flex:1;overflow:scroll;padding:5px;margin:5px 0 5px 0;'></textarea>
      <input type='button' value='Close' onclick='closeLadexport();' style='width:100px;align-self:flex-end'>
    </div>
	</div>


</body>
</html>
