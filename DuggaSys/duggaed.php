<?php
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
	<title>Dugga editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
  <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="duggaed.js"></script>
  <script src="../Shared/SortableTableLibrary/sortableTable.js"></script> 
  <script src="timer.js"></script>
  <script src="clickcounter.js"></script>
</head>
<body>

	<!-- Navigation Header START -->
	<?php
		$noup="SECTION";
		include '../Shared/navheader.php';
	?>
	<!-- Navigation Header END -->

	<!-- Content START -->
	<div id="content"></div>
	<!-- Content END -->

	<!-- Login Dialog START -->
	<?php
		include '../Shared/loginbox.php';
	?>
	<!-- Login Dialog END -->
  <div id="quiz" onchange='leFunk()' style='width:100%; border: 2px solid green;'></div>
	<!-- Edit Dugga Dialog START -->
	<div id='editDugga' class='loginBoxContainer' style='display:none;'>
      <div class='loginBox' style='width:464px;'>
      		<div class='loginBoxheader'>
      			<h3>Edit Dugga</h3>
      			<div class='cursorPointer' onclick='closeEditDugga();'>x</div>
      		</div>
      		<div style='padding:5px;'>
      			<input type='hidden' id='did' value='Toddler' /></td>
      			<div class='inputwrapper'>
	      			<span>Name:</span>
	      			<div class="tooltipDugga">
		      			<span id="tooltipTxt" style="display: none;" class="tooltipDuggatext">Illegal characters found in the title!<br>Valid characters: A-Ö, 0-9, ()</span>
		      		</div>
		      		<input class='textinput' type='text' id='name' value='New Dugga' onkeyup="validateName();" onchange="validateName();" />
		      	</div>
      			<div class='inputwrapper'><span>Auto-grade:</span><select id='autograde'><option value='0'>Hidden</option><option value='1'>Public</option></select></div>
      			<div class='inputwrapper'><span>Grade System:</span><select id='gradesys'><option value='1'>U-G-VG</option><option value='2'>U-G</option><option value='3'>U-3-4-5</option></select></div>
      			<div class='inputwrapper'><span>Template:</span><select id='template'><option selected='selected' value=""><option value=""></option></select></div>
            <div class='inputwrapper'><span>Start Date:</span><input class='textinput datepicker' type='text' id='qstart' value='None' /></div>

      			<div class='inputwrapper'><span>First  Deadline:</span><input class='textinput datepicker' type='text' id='deadline' value='None' /></div>
						<div class='inputwrapper'><span> Comment for Deadline:</span><input class='textinput'type='text' id='deadlinecomments1' placeholder='Deadline Comments' /></div>
						<div class='inputwrapper'><span>Second Deadline :</span><input class='textinput datepicker' type='text' id='deadline2' value='None' /></div>
						<div class='inputwrapper'><span> Comment for Deadline:</span><input class='textinput'type='text' id='deadlinecomments2' placeholder='Deadline Comments' /></div>
						<div class='inputwrapper'><span> Third Deadline :</span><input class='textinput datepicker' type='text' id='deadline3' value='None' /></div>
						<div class='inputwrapper'><span> Comment for Deadline:</span><input class='textinput'type='text' id='deadlinecomments3' placeholder='Deadline Comments' /></div>


            <div class='inputwrapper'><span>Release Date:</span><input class='textinput datepicker' type='text' id='release' value='None' /></div>
      		</div>
      		<div style='padding:5px;'>
      			<input style='float:left; 'class='submit-button deleteDugga' type='button' value='Delete' onclick='deleteDugga();' />
      			<input style='display:none; float:none;' class='submit-button closeDugga' type='button' value='Cancel' onclick='closeEditDugga(); showSaveButton();' />
      			<input style='margin-left:220px; display:none; float:none;' class='submit-button submitDugga' type='button' value='Submit' onclick='createDugga();showSaveButton();' />
      			<input style='float:right; 'class='submit-button updateDugga' type='button' value='Save' onclick='updateDugga();' />

      		</div>
      </div>
	</div>
	<!-- Edit Dugga Dialog END -->

  <!-- Confirm Section Dialog START -->  
      <div id='sectionConfirmBox' class='loginBoxContainer' style='display:none;'>
            <div class='loginBox' style='width:460px;'>
                  <div class='loginBoxheader'>
                        <h3>Confirm your update</h3>
                        <div class="cursorPointer" onclick='confirmBox(5);' title="Close window">x</div>
                  </div>
                  <div style='text-align: center;'>
                        <h4>Are you sure you want to make this happen?</h4>
                  </div>
                  <div style='display:flex; align-items:center; justify-content: center;'>
                        <input style='margin-right: 5%;' class='submit-button' type='button' value='Yes' title='Yes' onclick='confirmBox(4);' />
                        <input style='margin-left: 5%;' class='submit-button' type='button' value='No' title='No' onclick='confirmBox(5);' />
                  </div>
            </div>
      </div>
  <!-- Confirm Section Dialog START -->  
	<!-- Edit Variant Dialog START -->
	<div id='editVariant' class='loginBoxContainer' style='display:none;'>
      <div class='loginBox' style="width:80%;">
      		<div class='loginBoxheader'>
      			<h3>Edit Variant</h3>
      			<div class='cursorPointer' onclick='closeWindows();closeVariant();'>x</div>
      		</div>
          <div class='loginBoxbody'>
          		<div style='padding:5px;display:flex;'>
          			<input type='hidden' id='vid' value='Toddler' />
          			<div id="leftDivDialog">
          				<form name="jsonform" id="jsonform" style="padding:0;">
          					<!-- Error message -->
          					<div id="submissionError" style="display:none;height:80px;">
          						<fieldset style="width:90%;border-color:red;">
          							<legend style="color:red"><b>Warning!</b></legend>
          							<p style="color:red">Each submission name needs to be unique.</p>
          						</fieldset>
          					</div>
          					<!-- Instruction for assignment -->
          					<div>
          						<fieldset style="width:90%">
          							<legend>Instruction file</legend>
          							<div style="display:flex;flex-wrap:nowrap;flex-direction:row;">
          								<select name="type" id="type" style="flex:1">
          									<option value="md">Markdown</option>
          									<option value="pdf">PDF</option>
          									<option value="html">HTML</option>
          								</select>
          								<input type="text" name="filelink" id="filelink" placeholder="File link" style="flex:2;margin-left:5px;" onkeydown="if (event.keyCode == 13) return false;">
          							</div>
          						</fieldset>
          					</div>
                    <div>
                      <div id="duggaExtraParamForm">
                        <fieldset style="width:90%">
                          <legend>Extra parameters</legend>
                              <textarea id='extraparam' placeholder='Extra dugga parameters in valid JSON' rows="5" style=""></textarea>
                        </fieldset>
                      </div>
                    </div>
                    <!-- Submissions for dugga -->
          					<div>
          						<div id="duggaSubmissionForm">
          							<fieldset style="width:90%">
          								<legend>Submission types</legend>
          								<div id="submissions" style="display:flex;flex-wrap:wrap;flex-direction:row;overflow:auto;"></div>
          							</fieldset>

          							<input type="button" class="submit-button" name="addfieldname" id="addfieldname" value="+" style="width:32px;"></button>
          							<input type="button" class="submit-button" name="createjson" id="createjson" value="Create JSON" style=""></button>
          						</div>
          					</div>
                  <!-- Submissions for dugga -->
          			<!-- End of leftDivDialog -->
                </div>
          			<!-- JSON and answer fields -->
          			<div id="rightDivDialog">
                    <fieldset style="width:90%">
                        <legend>Generated Param JSON</legend>
                				<div style='min-height:120px'><textarea id='parameter' placeholder='Variant Param' rows="5" style="min-height:100px"></textarea></div>
                    </fieldset>
                    <fieldset style="width:90%">
                        <legend>Answer</legend>
                				<div style='min-height:120px'><textarea id='variantanswer' placeholder='Variant Param' rows="5" style="min-height:100px"></textarea></div>
                    </fieldset>
          			</div>
          		</div>
          		<div style='padding:5px;'>
          			<input class='submit-button' type='button' value='Delete' onclick='deleteVariant();' />
          			<input id="toggleVariantButton" class='submit-button' type='button' value='Disable' onclick='toggleVariant();' />
          			<input class='submit-button' type='button' value='Save' onclick='updateVariant();' />
          		</div>
          </div>
	</div>
	<!-- Edit Variant Dialog END -->

	<!-- Result Dialog START -->
	<div id='resultpopover' class='resultPopover' style='display:none'>
		<div class='loginBoxheader'>
			<div class='cursorPointer' onclick="closePreview();">x</div>
		</div>
		<div id="MarkCont" style="position:absolute; left:4px; right:4px; top:34px; bottom:4px; border:2px inset #aaa;background:#bbb"></div>
	</div>
	<!-- Result Dialog END -->

</body>
</html>
