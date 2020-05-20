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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<title id="sectionedPageTitle">Dugga editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
  <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
  <link type="text/css" href="../Shared/css/dugga.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="duggaed.js"></script>
  <script src="../Shared/SortableTableLibrary/sortableTable.js"></script>
  <script src="timer.js"></script>
  <script src="clickcounter.js"></script>

</head>
<body onload="setup();">

	<!-- Navigation Header START -->
	<?php
		$noup="SECTION";
		include '../Shared/navheader.php';
	?>
	<!-- Navigation Header END -->

	<!-- Content START -->

	<div id="content">
      <div id="headerContent"></div> <!-- A div to place header content. -->
      <div id='searchBarMobile' style='test-align:right;margin-bottom:15px;'>
				<div id='tooltip-mobile' class="tooltip-searchbar">
					<div class="tooltip-searchbar-box">
								<b>Keywords:</b> template name, name, date <br>
								<b>Ex:</b> color-dugga
					</div>
					<span>?</span>
				</div>
				<input id='searchinputMobile' type='text' name='search' placeholder='Search..' onkeyup='searchterm=document.getElementById("searchinputMobile").value;searchKeyUp(event);duggaTable.renderTable();document.getElementById("duggaSearch").value=document.getElementById("searchinputMobile").value;'/>

				<button id='searchbuttonMobile' class='switchContent' onclick='searchterm=document.getElementById("searchinputMobile").value;searchKeyUp(event);duggaTable.renderTable();' type='button'>
					<img id='lookingGlassSVG' style='height:18px;' src='../Shared/icons/LookingGlass.svg'/>
				</button>
			</div>
		<div id="quiz" style='width:100%;'></div> <!-- A div to place the quiz-table within. -->

	  	<!-- Login Dialog START -->
	  	<?php
	  	 include '../Shared/loginbox.php';
	  	?>
	  	<!-- Login Dialog END -->
  	</div>

  	<!-- Content END -->


    <!-- Edit Dugga Dialog START -->
  	<div id='editDugga' class='loginBoxContainer' style='display:none;'>
        <div class='loginBox' style='width:464px;'>
        		<div class='loginBoxheader'>
        			<h3 id="editDuggaTitle">Edit Dugga</h3>
        			<div class='cursorPointer' onclick='closeWindows();'>x</div>
        		</div>
        		<div style='padding:5px;'>
        			<input type='hidden' id='did' value='UNK'/></td>
        			<div class='flexwrapper'>
  	      			<span>Name:</span>
  	      			<div class="tooltipDugga">
  		      			<span id="tooltipTxt" style="display: none;" class="tooltipDuggatext">Illegal characters found in the title!<br>Valid characters: A-Ö, 0-9, ()</span>
  		      		</div>
  		      		<input class='textinput' type='text' id='name' placeholder='New Dugga' onkeyup='validateDuggaName();' onchange='validateDuggaName();' />
  		      	</div>
        			<div class='flexwrapper'><span>Auto-grade:</span><select id='autograde'></select></div>
        			<div class='flexwrapper'><span>Grade System:</span><select id='gradesys'></select></div>
        			<div class='flexwrapper'><span>Template:</span><select id='template'><option selected='selected' value=""><option value=""></option></select></div>
              <div class='flexwrapper'><span>Start Date:</span><span><input class='textinput' type='date' id='qstart' value=''  /><select style='width:55px;' id='qstartt'></select><select style='width:55px;' id='qstartm'></select></span></div>
              <div class='flexwrapper'><span>Deadline 1:</span><span><input class='textinput' type='date' id='deadline' value=''  /><select style='width:55px;' id='deadlinet'></select><select style='width:55px;' id='deadlinem'></select></span></div>
  						<div class='flexwrapper'><span>Comment:</span><input class='textinput' type='text' id='deadlinecomments1' placeholder='Deadline Comments' /></div>
              <div class='flexwrapper'><span>Deadline 2:</span><span><input class='textinput' type='date' id='deadline2' value=''  /><select style='width:55px;' id='deadlinet2'></select><select style='width:55px;' id='deadlinem2'></select></span></div>
  						<div class='flexwrapper'><span>Comment:</span><input class='textinput' type='text' id='deadlinecomments2' placeholder='Deadline Comments' /></div>
              <div class='flexwrapper'><span>Deadline 3:</span><span><input class='textinput' type='date' id='deadline3' value=''  /><select style='width:55px;' id='deadlinet3'></select><select style='width:55px;' id='deadlinem3'></select></span></div>
  						<div class='flexwrapper'><span>Comment:</span><input class='textinput' type='text' id='deadlinecomments3' placeholder='Deadline Comments' /></div>
              <div class='flexwrapper'><span>Result release:</span><span><input class='textinput' type='date' id='release' value=''  /><select style='width:55px;' id='releaset'></select><select style='width:55px;' id='releasem'></select></span></div>
        		</div>
        		<div style='padding:5px;display:flex;justify-content: flex-end'>
        			<input id='saveDugga' class='submit-button' type='button' value='Save' onclick='updateDugga();' />
        		</div>
        </div>
  	</div>
  	<!-- Edit Dugga Dialog END -->

    <!-- Confirm Section Dialog START -->
  		<div id='sectionConfirmBox' class='loginBoxContainer' style='display:none; z-index: 9999;'>
  	    <div class='loginBox' style='width:460px;'>
  				<div class='loginBoxheader'>
  				    <h3>Confirm deletion</h3>
  				    <div class="cursorPointer" onclick='closeWindows();' title="Close window">x</div>
  				</div>
  				<div style='text-align: center;'>
  				    <h4>Are you sure you want to delete this item?</h4>
  				</div>
  				<div style='display:flex; align-items:center; justify-content: center;'>
  				    <input style='margin-right: 5%;' class='submit-button' type='button' value='Yes' title='Yes' onclick='confirmBox("deleteItem");' />
  				    <input style='margin-left: 5%;' class='submit-button' type='button' value='No' title='No' onclick='closeWindows();' />
  				</div>
  	    </div>
  		</div>
    <!-- Confirm Section Dialog START -->

    <!-- Result Dialog START -->
    <div id='resultpopover' class='loginBoxContainer' style='display:none; overflow:hidden; z-index: 9999;'>
      <div class='loginBox' id='resultpopoverBox' style='overflow:auto;';>
        <div class='loginBoxheader'>
          <h3 id="resultpopoverTitle">PREVIEW</h3>
          <div class='cursorPointer' onclick='closeWindows();'>x</div>
        </div>

        <div class='loginBoxbody' id='MarkCont' style='width:100%; height:100%;'>
        </div>
     </div>
    </div>
  <!-- Result Dialog END -->

  	<!-- Edit Variant Dialog START -->
  	<div id='editVariant' class='loginBoxContainer' style='display:none;'>
      <div class='loginBox' id='variantBox'>
        <div class='loginBoxheader'>
          <h3 id="editVariantTitle">Edit Variant</h3>
          <div class='cursorPointer' onclick='closeWindows();'>x</div>
        </div>

        <div class='loginBoxbody' id='variantBody' style='width:100%; height:100%;'>
            <div id="variant" style='width:100%; border-top: solid 3px #fdcb60; border-bottom: #7f7f7f solid 3px; background-color: white; overflow-y: auto; overflow-x: hidden; margin-bottom: 5px; max-height: 300px; flex-shrink: 99; min-height: 100px;' ></div> <!-- A div to place the variant-table within. -->
          <div id='editVariantDiv' style="display:flex; flex-shrink: 0;">
            <input type='hidden' id='vid' value='Toddler'/>
            <input type='hidden' id='disabled' value='0'/>
              <div id="leftDivDialog" style="width: 50%; height:100%; display: inline-block;">
                <form id="jsonForm" name="jsonForm">
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
                      <div style="display:flex;flex-wrap:wrap;flex-direction:row;">
                        <select name="type" id="type" style="flex:1" onchange="$('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()));">
                          <option value="md">Markdown</option>
                          <option value="pdf">PDF</option>
                          <option value="html">HTML</option>
                        </select>
                        <input id="filelink" type="text" name="filelink" style="flex:2;margin-left:5px;" onkeyup="$('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()));">
                      </div>
                    </fieldset>
                  </div>
                  <div>
                    <div id="duggaExtraParamForm">
                      <fieldset style="width:90%">
                        <legend>Extra parameters</legend>
                        <textarea id='extraparam' rows="5" onkeyup="$('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()));"></textarea>
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
                      <input type="button" class="submit-button" name="addfieldname" id="addfieldname" value="+" style="width:32px;" onclick="addVariantSubmissionRow();" />
                    </div>
                  </div>
                    <!-- Submissions for dugga -->
                  <!-- End of leftDivDialog -->
                </form>
              </div>
              <div id="rightDivDialog" style='width: 50%; height:100%; display: inline-block;'>
                <fieldset style="width:90%">
                  <legend>Search in the Table</legend>
                  <div style="width:100%; height: 25px; display:flex; flex-wrap:wrap; flex-direction:row;">
                    <input id="variantSearch" class="searchFiled" type="search" placeholder="Search.." style="flex-grow: 99; margin: 0px; border: 1px; border-bottom-right-radius: 0px; border-top-right-radius: 0px; height: 25px;"
                    onkeyup="searchterm=document.getElementById('variantSearch').value; searchKeyUp(event); variantTable.renderTable();"onsearch="searchterm=document.getElementById('variantSearch').value; searchKeyUp(event); variantTable.renderTable();"/>
                                        <button id="searchbutton" class="switchContent" onclick="return searchKeyUp(event);" type="button">
                      <img id="lookingGlassSVG" style="height:18px;" src="../Shared/icons/LookingGlass.svg">
                    </button>
                  </div>
                </fieldset>
                <fieldset style="width:90%">
                  <legend>Generated Param JSON</legend>
                  <div id='parameter' style='min-height:120px'>
                    <textarea id='variantparameterText' rows="5" style="min-height:100px" onchange="createJSONFormData()"></textarea>
                  </div>
                </fieldset>
                <fieldset style="width:90%">
                  <legend>Answer</legend>
                    <div id='variantanswer' style='min-height:120px;'>
                      <textarea id='variantanswerText' rows="5" style="min-height:100px"></textarea>
                    </div>
                </fieldset>
              </div>
            </div>
            <div id='buttonVariantDiv' style='display:flex;justify-content: flex-end'>
              <div style='display:flex;justify-content:flex-end'>
                  <input id='submitVariant' class='submit-button' type='button' value='Create' onclick='createVariant();'>
                  <input id='saveVariant' class='submit-button' type='button' value='Update' onclick='updateVariant("0");'>
                  <input id='disableVariant' class='submit-button disableEnable' type='button' value='Disable' onclick='updateVariant("1");'>
                  <input id='enableVariant' class='submit-button disableEnable' type='button' value='Enable' onclick='updateVariant("0");'>
                  <!--<input id='cancelVariant' class='submit-button' style='display:block; float:right;' type='button' value='Cancel' onclick='newVariant(); removeVariantTableHighlights();'>-->
              </div>
            </div>
          </div>
       </div>
    </div>
  	<!-- Edit Variant Dialog END -->

    <div class="fixed-action-button" id="fabButtonAcc">
        <a class="btn-floating fab-btn-lg noselect" id="fabBtn">+</a>
        <ol class="fab-btn-list" style="margin: 0; padding: 0; display: none;" reversed>
        </ol>
	</div>

</body>
</html>
