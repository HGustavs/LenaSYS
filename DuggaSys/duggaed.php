<?php
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
include_once "../Shared/toast.php";
pdoConnect();
$cid=getOPG('courseid');
$vers=getOPG('coursevers');
?>
<script>var cid = <?php echo $cid ?>,vers = <?php echo $vers ?>;</script>
<?php
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<title id="sectionedPageTitle">Dugga editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
  <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
  <link type="text/css" href="../Shared/css/dugga.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link id="themeBlack" type="text/css" href="../Shared/css/blackTheme.css" rel="stylesheet">
	
	<script src="darkmodeToggle.js"></script>
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="duggaed.js"></script>
  <script src="../Shared/SortableTableLibrary/sortableTable.js"></script>
  <script src="../Shared/markdown.js"></script>
	<script src="backToTop.js"></script>

</head>
<body onload="setup(); displayNavIcons();">
 
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
					<img alt='search icon' id='lookingGlassSVG' style='height:18px;' src='../Shared/icons/LookingGlass.svg'/>
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
        <div class='formBox' style='width:464px; overflow:hidden;'>
        		<div class='formBoxHeader'>
        			<h3 id="editDuggaTitle">Edit Dugga</h3>
        			<div class='cursorPointer' onclick='closeWindows();'>x</div>
        		</div>
        		<div style='padding:5px;'>
        			<input type='hidden' id='did' value='UNK'/></td>
        			<div class='inputwrapper'>
  	      			<span>Name:</span>
  	      			<div class="tooltipDugga">
  		      			<span id="tooltipTxt" style="display: none;" class="tooltipDuggatext">Illegal characters found in the title!<br>Valid characters: A-Ö, 0-9.</span>
  		      		</div>
  		      		<input class='textinput' type='text' id='name' placeholder='New Dugga' onkeyup='quickValidateDugga("editDugga", "saveDugga");' onchange='validateDuggaName();' />
  		      	</div>
        			<div class='inputwrapper'><span>Auto-grade:</span><select id='autograde'></select></div>
        			<div class='inputwrapper'><span>Grade System:</span><select id='gradesys'></select></div>
        			<div class='inputwrapper'><span>Template:</span><select id='template'><option selected='selected' value=""><option value=""></option></select></div>
              <div class='inputwrapper'><span>Start Date:</span><span><input class='textinput' onchange="quickValidateDugga('editDugga', 'saveDugga');" type='date' id='qstart' title='Start date input' value=''  /><select onchange="quickValidateDugga('editDugga', 'saveDugga');" style='width:55px;' id='qstartt'></select><select onchange="quickValidateDugga('editDugga', 'saveDugga');" style='width:55px;' id='qstartm'></select></span></div>
              <div class="formDialog" style="display: block; left:-10px; top:-30px;"><span id="StartDateDialog" style="display: none; left:0px;" class="formDialogText">Incorrect input.</span></div>
              <div class='inputwrapper'><span>Deadline 1:</span><span><input class='textinput' onchange="quickValidateDugga('editDugga', 'saveDugga');" type='date' id='deadline' title='Deadline 1 input' value=''  /><select onchange="quickValidateDugga('editDugga', 'saveDugga');" style='width:55px;' id='deadlinet'></select><select onchange="quickValidateDugga('editDugga', 'saveDugga');" style='width:55px;' id='deadlinem'></select></span></div>
  						<div class="formDialog" style="display: block; left:-10px; top:-30px;"><span id="Deadline1Dialog" style="display: none; left:0px;" class="formDialogText">Incorrect input.</span></div>
              <div class='inputwrapper'><span>Comment:</span><input class='textinput' onkeyup="quickValidateDugga('editDugga', 'saveDugga');" type='text' id='deadlinecomments1' placeholder='Deadline Comments' /></div>
              <div class="formDialog" style="display: block; left:50px; top:-35px;"><span id="deadlinecomments1Dialog" style="display: none; left:0px; " class="formDialogText">Prohibited symbols or above 50 character limit</span></div>
              <div class='inputwrapper'><span>Deadline 2:</span><span><input class='textinput' onchange="quickValidateDugga('editDugga', 'saveDugga');" type='date' id='deadline2' title='Deadline 2 input' value=''  /><select onchange="quickValidateDugga('editDugga', 'saveDugga');" style='width:55px;' id='deadlinet2'></select><select onchange="quickValidateDugga('editDugga', 'saveDugga');" style='width:55px;' id='deadlinem2'></select></span></div>
  						<div class="formDialog" style="display: block; left:-10px; top:-30px;"><span id="Deadline2Dialog" style="display: none; left:0px;" class="formDialogText">Incorrect input.</span></div>
              <div class='inputwrapper'><span>Comment:</span><input class='textinput' onkeyup="quickValidateDugga('editDugga', 'saveDugga');" type='text' id='deadlinecomments2' placeholder='Deadline Comments' /></div>
              <div class="formDialog" style="display: block; left:50px; top:-35px;"><span id="deadlinecomments2Dialog" style="display: none; left:0px; " class="formDialogText">Prohibited symbol or above 50 character limit</span></div>
              <div class='inputwrapper'><span>Deadline 3:</span><span><input class='textinput' onchange="quickValidateDugga('editDugga', 'saveDugga');" type='date' id='deadline3' title='Deadline 3 input' value=''  /><select onchange="quickValidateDugga('editDugga', 'saveDugga');" style='width:55px;' id='deadlinet3'></select><select onchange="quickValidateDugga('editDugga', 'saveDugga');" style='width:55px;' id='deadlinem3'></select></span></div>
  						<div class="formDialog" style="display: block; left:-10px; top:-30px;"><span id="Deadline3Dialog" style="display: none; left:0px;" class="formDialogText">Incorrect input.</span></div>
              <div class='inputwrapper'><span>Comment:</span><input class='textinput' onkeyup="quickValidateDugga('editDugga', 'saveDugga');" type='text' id='deadlinecomments3' placeholder='Deadline Comments' /></div>
              <div class="formDialog" style="display: block; left:50px; top:-35px;"><span id="deadlinecomments3Dialog" style="display: none; left:0px; " class="formDialogText">Prohibited symbols or above 50 character limit</span></div>
              <div class='inputwrapper'><span>Result release:</span><span><input class='textinput' onchange="quickValidateDugga('editDugga', 'saveDugga');" type='date' id='release' title='Result release input' value=''  /><select onchange="quickValidateDugga('editDugga', 'saveDugga');" style='width:55px;' id='releaset'></select><select onchange="quickValidateDugga('editDugga', 'saveDugga');" style='width:55px;' id='releasem'></select></span></div>
              <div class="formDialog" style="display: block; left:-10px; top:-30px;"><span id="ResultReleaseDialog" style="display: none; left:0px;" class="formDialogText">Incorrect input.</span></div>
        		</div>
        		<div style='padding:5px;display:flex;justify-content: flex-end'>
        			<input id='saveDugga' class='submit-button' type='button' value='Save' onclick='updateDugga();' />
        		</div>
        </div>
  	</div>
  	<!-- Edit Dugga Dialog END -->

    <!-- Confirm Section Dialog START -->
  		<div id='sectionConfirmBox' class='loginBoxContainer' style='display:none; z-index: 9999;'>
  	    <div class='formBox' style='width:460px;'>
  				<div class='formBoxHeader'>
  				    <h3>Confirm deletion</h3>
  				    <div class="cursorPointer" onclick='closeWindows();' title="Close window">x</div>
  				</div>
  				<div style='text-align: center;'>
  				    <h4>Are you sure you want to delete this item?</h4>
  				</div>
  				<div style='display:flex; align-items:center; justify-content: center;'>
  				    <input id="confirmDelSubmit" style='margin-right: 5%;' class='submit-button' type='button' value='Yes' title='Yes' onclick='confirmBox("deleteItem");' />
  				    <input style='margin-left: 5%;' class='submit-button' type='button' value='No' title='No' onclick='closeWindows();' />
  				</div>
  	    </div>
  		</div>
    <!-- Confirm Section Dialog START -->

    <!-- Result Dialog START -->
    <div id='resultpopover' class='loginBoxContainer' style='display:none; overflow:hidden; z-index: 9999;'>
      <div class='formBox' id='resultpopoverBox' style='overflow:auto;';>
        <div class='formBoxHeader'>
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
      <div class='formBox' id='variantBox'>
        <div class='formBoxHeader'>
          <h3 id="editVariantTitle">Edit Variant</h3>
          <div class='cursorPointer' onclick='closeWindows();'>x</div>
        </div>

        <div class='loginBoxbody' id='variantBody' style='width:100%; height:100%;'>
            <div id="variant" style='width:100%; border-top: solid 3px #fdcb60;  overflow-y: auto; overflow-x: hidden; margin-bottom: 5px; max-height: 300px; flex-shrink: 99; min-height: 220px;' ></div> <!-- A div to place the variant-table within. -->
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
                    <fieldset class="ColorForBorderInDuggaed" style="width:90%;">
                      <legend>Instruction file</legend>
                      <div style="display:flex;flex-wrap:wrap;flex-direction:row;">
                        <select name="type" id="type" style="flex:1" onchange="$('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray())), updateInstructions();">
                          <option value="md">Markdown</option>
                          <option value="pdf">PDF</option>
                          <option value="html">HTML</option>
                        </select>
                        <select id="filelink" name="filelink" style="flex:2;margin-left:5px;" onchange="$('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()));"></select>
                      </div>
                    </fieldset>
                  </div>
                  <div>
                    <fieldset class="ColorForBorderInDuggaed" style="width:90%;">
                      <legend>General information file</legend>
                      <div style="display:flex;flex-wrap:wrap;flex-direction:row;">
                        <select name="gType" id="gType" style="flex:1" onchange="$('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray())), updateInformation();">
                          <option value="md">Markdown</option>
                          <option value="pdf">PDF</option>
                          <option value="html">HTML</option>
                        </select>
                        <select id="gFilelink" name="gFilelink" style="flex:2;margin-left:5px;" onchange="$('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()));"></select>
                      </div>
                    </fieldset>
                  </div>
                  <div>
                    <div id="duggaExtraParamForm">
                      <fieldset class="ColorForBorderInDuggaed" style="width:90%">
                        <legend>Extra parameters</legend>
                        <textarea id='extraparam' rows="4" onkeyup="$('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()));"></textarea>
                      </fieldset>
                    </div>
                  </div>
                  <div>
                      <div id="duggaNotes">  <!-- CHANGE TEXT--> 
                      <fieldset class="ColorForBorderInDuggaed" style="width:90%">
                        <legend>Note</legend>
                        <textarea id="notes" value="notes" name="notes" rows="3" onkeyup="$('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()));"></textarea>  <!-- CHANGE TEXT--> 
                      </fieldset>
                    </div>
                  </div>
                  <div>
                    <div id="selectBox">
                      <fieldset style="width:90%">
                      <!-- The json files are fetched and parsed in returnedFile() in duggaed.js -->
                        <legend>Add diagram to dugga</legend>
                        <select id="file" style="flex:1" onchange="$('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()))">
                          <option>Empty canvas</option>
                        </select>
                      </fieldset>
                    </div>
                    <div id="errorCheck">
                      <fieldset style="width:90%">
                        <legend>Error check button</legend>
                        <label for="errorActive">Active</label>
                        <input type="checkbox" name="errorActive" id="errorActive" value="true" onchange="$('#variantparameterText').val(createJSONString($('#jsonForm').serializeArray()));"/>
                      </fieldset>
                    </div>
                  </div>
                    <!-- diagram types -->
                  <div id="typeCheckbox">
                    <fieldset style="width:90%">
                      <legend>Diagram types allowed</legend>
                      <div id="diagramTypesBox" style="display:flex;flex-wrap:wrap;flex-direction:row;">
                        <label for="ER">ER</label>
                        <input type="checkbox" name="ER" id="ER" value="true" checked="true" onchange="checkDiagramTypes(0);"/>
                        <label for="IE">IE</label>
                        <input type="checkbox" name="IE" id="IE" value="true" onchange="checkDiagramTypes(2);"/>  
                        <label for="UML">UML</label>
                        <input type="checkbox" name="UML" id="UML" value="true" onchange="checkDiagramTypes(1);"/>  
                      </div>
                    </fieldset>
                  </div>
                      <!-- Submissions for dugga -->
                  <div>
                    <div id="duggaSubmissionForm">
                      <fieldset  class="ColorForBorderInDuggaed" style="width:90%;">
                        <legend>Submission types</legend>
                        <div id="submissions" style="display:flex;flex-wrap:wrap;flex-direction:column;overflow:hidden;"></div>
                      </fieldset>
                      <input type="button" class="submit-button" name="addfieldname" id="addfieldname" value="+" style="width:32px;" onclick="addVariantSubmissionRow();" />
                    </div>
                  </div>
                    <!-- Submissions for dugga -->
                  <!-- End of leftDivDialog -->
                </form>
              </div>
              <div id="rightDivDialog" style='width: 50%; height:100%; display: inline-block;'>
                <fieldset class="ColorForBorderInDuggaed" style="width:90%; margin-left:5%;">
                  <legend>Search in the Table</legend>
                  <div style="width:100%; height: 25px; display:flex; flex-wrap:nowrap; flex-direction:row;">
                    <input id="variantSearch" class="searchFiled" type="search" placeholder="Search.." style="flex-grow: 99; margin: 0px; border: 1px; border-bottom-right-radius: 0px; border-top-right-radius: 0px; height: 25px;"
                    onkeyup="searchterm=document.getElementById('variantSearch').value; searchKeyUp(event); variantTable.renderTable();"onsearch="searchterm=document.getElementById('variantSearch').value; searchKeyUp(event); variantTable.renderTable();"/>
                                        <button id="searchbutton" class="switchContent" onclick="return searchKeyUp(event);" type="button">
                      <img alt="search icon" id="lookingGlassSVG" style="height:18px;" src="../Shared/icons/LookingGlass.svg">
                    </button>
                  </div>
                </fieldset>
                <fieldset class="ColorForBorderInDuggaed" style="width:90%; margin-left:5%;">
                  <legend>Generated Param JSON</legend>
                  <div id='parameter' style='min-height:75px'>
                    <textarea id='variantparameterText' rows="2" style="min-height:80px" onchange="createJSONFormData()"></textarea>
                  </div>
                </fieldset>
                <fieldset class="ColorForBorderInDuggaed" style="width:90%; margin-left:5%;">
                  <legend>Answer</legend>
                    <div id='variantanswer' style='min-height:15px;'>
                      <textarea id='variantanswerText' rows="2" style="min-height:40px; height:53px;"></textarea>
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

    <div class="fixed-action-button extra-margin" id="fabButtonAcc">
      <div class="fabBtnEditDugga" tabIndex="0">
        <a class="btn-floating fab-btn-lg noselect" id="fabBtn">+</a>
      </div>
      <ol class="fab-btn-list" style="margin: 0; padding: 0; display: none;" reversed>
      </ol>
	</div>

  
		<!-- Scroll up START -->

		<div class='fixedScroll' id='fixedScroll'>
			<span class='tooltiptextScroll'>Back to top</span>
			<i class='arrow up' id='scrollUp'></i>
		</div>
    
</body>
</html>
