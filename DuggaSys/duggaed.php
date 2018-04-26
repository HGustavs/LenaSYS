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
	<title id="sectionedPageTitle">Dugga editor</title>

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

  <div id="quiz" style='width:100%; border: 2px solid green;'></div> <!-- A div to place the quiz-table within. -->

  <!-- Edit Dugga Dialog START -->
	<div id='editDugga' class='loginBoxContainer' style='display:none;'>
      <div class='loginBox' style='width:464px;'>
      		<div class='loginBoxheader'>
      			<h3 id="editDialogTitle">Edit Dugga</h3>
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
            <div class='inputwrapper'><span>Start Date:</span><input class='textinput datepicker' type='text' id='qstart' value='' /></div>
      			<div class='inputwrapper'><span>1st Deadline:</span><input class='textinput datepicker' type='text' id='deadline' value='' /></div>
						<div class='inputwrapper'><span>Comment:</span><input class='textinput'type='text' id='deadlinecomments1' placeholder='Deadline Comments' /></div>
						<div class='inputwrapper'><span>2nd Deadline :</span><input class='textinput datepicker' type='text' id='deadline2' value='None' /></div>
						<div class='inputwrapper'><span>Comment:</span><input class='textinput'type='text' id='deadlinecomments2' placeholder='Deadline Comments' /></div>
						<div class='inputwrapper'><span>3rd Deadline :</span><input class='textinput datepicker' type='text' id='deadline3' value='None' /></div>
						<div class='inputwrapper'><span>Comment:</span><input class='textinput'type='text' id='deadlinecomments3' placeholder='Deadline Comments' /></div>
            <div class='inputwrapper'><span>Release Date:</span><input class='textinput datepicker' type='text' id='release' value='None' /></div>
      		</div>
      		<div style='padding:5px;'>
      			<input id='closeDugga' class='submit-button' style='display:block; float:left;' type='button' value='Cancel' onclick='closeEditDugga();' />
      			<input id='submitDugga' class='submit-button' style='display:none; float:right;' type='button' value='Submit' onclick='createDugga();' />
      			<input id='saveDugga' class='submit-button' style='display:none; float:right;' type='button' value='Save' onclick='updateDugga();' />
      		</div>
      </div>
	</div>
	<!-- Edit Dugga Dialog END -->

  <!-- Confirm Section Dialog START -->
		<div id='sectionConfirmBox' class='loginBoxContainer' style='display:none; z-index: 9999;'>
	        <div class='loginBox' style='width:460px;'>
				<div class='loginBoxheader'>
				    <h3>Confirm deletion</h3>
				    <div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
				</div>
				<div style='text-align: center;'>
				    <h4>Are you sure you want to delete this item?</h4>
				</div>
				<div style='display:flex; align-items:center; justify-content: center;'>
				    <input style='margin-right: 5%;' class='submit-button' type='button' value='Yes' title='Yes' onclick='confirmBox("deleteItem");' />
				    <input style='margin-left: 5%;' class='submit-button' type='button' value='No' title='No' onclick='confirmBox("closeConfirmBox");' />
				</div>
	        </div>
		</div>
  <!-- Confirm Section Dialog START -->

	<!-- Edit Variant Dialog START -->
	<div id='editVariant' class='loginBoxContainer' style='display:none;'>
      <div class='loginBox' style="width:80%;">
      		<div class='loginBoxheader'>
      			<h3>Edit Variant</h3>
      			<div class='cursorPointer' onclick='closeWindows();'>x</div>
      		</div>
          <div class='loginBoxbody'>
           <div id="variant" style='width:100%; border: 2px solid green;'></div> <!-- A div to place the variant-table within. -->
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
          								<input id="filelink" type="text" name="filelink" style="flex:2;margin-left:5px;" onkeydown="if (event.keyCode == 13) return false;">
          							</div>
          						</fieldset>
          					</div>
                    <div>
                      <div id="duggaExtraParamForm">
                        <fieldset style="width:90%">
                          <legend>Extra parameters</legend>
                              <textarea id='extraparam' rows="5" style=""></textarea>
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
                				<div id='parameter' style='min-height:120px'>
                          <textarea id='variantparameterText' rows="5" style="min-height:100px"></textarea>
                        </div>
                    </fieldset>
                    <fieldset style="width:90%">
                        <legend>Answer</legend>
                				<div id='variantanswer' style='min-height:120px'>
                          <textarea id='variantanswerText' rows="5" style="min-height:100px"></textarea>
                        </div>
                    </fieldset>
          			</div>
          		</div>
          		<div style='padding:5px;'>
                <input id='closeVariant' class='submit-button' style='display:block; float:left' type='button' value='Cancel'
                onclick='closeWindows();'/>
          			<input id='submitVariant' class='submit-button' style='display:none; float:right' type='button' value='Submit'
                onclick='createVariant(); showVariantSaveButton();'/>
                <input id='saveVariant' class='submit-button' style='display:none; float:right' type='button' value='Save'
                onclick='updateVariant(); showVariantSubmitButton();'/>
                <input id='disableVariant' class='submit-button' style='display:none; float:right' type='button' value='Disable'
                onclick='disableVariant(); showVariantEnableButton(); '/>
                <input id='enableVariant' class='submit-button' style='display:none; float:right' type='button' value='Enable'
                onclick='enableVariant(); showVariantDisableButton();'/>
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
