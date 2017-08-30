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
	<script src="resulted.js"></script>

</head>
<body onload="setup();">
	<?php
		$noup="SECTION";
		$resultedkind = true;
		include '../Shared/navheader.php';
	?>

	<div id="content"></div>

	<?php
		include '../Shared/loginbox.php';
	?>
			
	<!---------------------=============####### Result Popover #######=============--------------------->
	
	<div id='resultpopover' class='resultPopover' style='display:none'>
		<div class='loginBoxheader'>
			<h3 style='width:100%;' id='Nameof'>Show Results</h3><div onclick='closeWindows();'>x</div>
		</div>
		<div id="MarkCont" style="position:absolute; left:4px; right:204px; top:34px; bottom:4px; border:2px inset #aaa;background:#bbb; overflow:scroll;"> </div>
		<div style="position:absolute; right:2px; top:34px; background:#bbb; width:200px;"><div id='markMenuPlaceholder'></div><div id="teacherFeedbackTable"></div></div>
	</div>

  <!---------------------=============####### Preview Popover #######=============--------------------->
	
	<div id='previewpopover' class='previewPopover' style='display:none;'>
		<div class='loginBoxheader'>
			<h3 style='width:100%;' id='Nameof'>Document Preview</h3><div onclick='closeWindows();'>x</div>
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
  <!---------------------=============####### Statistics Popover #######=============--------------------->
	
	<div id='statisticspopover' class='previewpopover' style='display:none;'>
		<div class='loginBoxheader'>
			<h3 style='width:100%;' id='Nameof'>Collective results</h3><div onclick='closeWindows();'>x</div>
		</div>
	</div>
</body>
</html>
