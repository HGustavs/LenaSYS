<?php
	session_start();
	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";
	include_once "../Shared/toast.php";
	pdoConnect();

	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
	}else{
		$userid="00";
	}

	if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['githubInsert']) && isset($_POST['lid']) && !empty($_POST['githubDir'])) {
		global $pdo;
		$githubDir = $_POST['githubDir'];
		$lid = $_POST['lid'];
		updateGithubDir($pdo, $githubDir, $lid);
	}

	function updateGithubDir($pdo, $githubDir, $lid) {
		try {
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$query = $pdo->prepare("UPDATE listentries SET githubDir = :githubdir WHERE lid = :lid");
			$query->bindParam(':githubdir', $githubDir);
			$query->bindParam(':lid',$lid);
			if($query->execute()) {
				echo "<script>console.log('Update Successful!');</script>";
			} else {
				echo "<script>console.log('Update Failed.');</script>";
			} 
		}
		catch(PDOException $exception) {
			echo "<script>console.log('Update Failed: " . addslashes($exception->getMessage()) . "');</script>";
		}
	}
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title id="sectionedPageTitle">Section Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<style>
		/* Adds scroll mode to sectionedTble if the content is to tall */
		#Sectionlisti.scroll-mode {
			max-height: 75vh;
			overflow-y:  auto;
			border: 1px solid #ccc;
		}
		
		/* View mode: Zooms out the list */
		#Sectionlisti.overview-mode {
  			max-height: none;
  			overflow-y: visible;
  			transform: scale(0.6);           
  			transform-origin: top left;      
		}

		/* Style adjustments for items when using overview mode*/
		#Sectionlisti.overview-mode .listentry {
  			font-size: 0.7em;
 			padding: 2px;
  			margin-bottom: 1px;
		}

		/* Style for the item currently being dragged */
		.dragging {
   			opacity: 0.9;
    		transform: scale(1.05) translateY(-2px);
    		background-color: #f0f0f0;
    		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    		transition: all 0.2s ease;
   	 		z-index: 999;
    		position: relative;
  		}

	</style>

	<!-- <link type="text/css" href="../Shared/css/blackTheme.css" rel="stylesheet"> -->
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<link id="themeBlack" type="text/css" href="../Shared/css/blackTheme.css" rel="stylesheet">
	
	<script src="darkmodeToggle.js"></script>
	<script src="../Shared/loadingButton.js"></script>
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  	<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
	<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

	<script type="text/babel" src="../Shared/components/Button.js"></script>
	<script type="text/babel" src="../Shared/components/Dropdown.js"></script>

	<script src="../Shared/dugga.js"></script>

	<script>
	// Override dugga.js functions for sectioned.php
	function hideServerMessage() {
		const motdArea = document.querySelector("#motdArea");
		const motdIcon = document.querySelector("#motdNav");
		if (motdArea) motdArea.style.display = "none";
		if (motdIcon) motdIcon.style.display = "table-cell";
	}

	function showServerMessage() {
		const motdArea = document.querySelector("#motdArea");
		const motdIcon = document.querySelector("#motdNav");
		if (motdArea) motdArea.style.display = "flex";
		if (motdIcon) motdIcon.style.display = "none";
	}
</script>

	<script src="sectioned.js"></script>
	<script src="backToTop.js"></script>	
</head>

<body onload="setup();">

	<?php
		$noup="COURSE";
		include '../Shared/navheader.php';
		$_SESSION['should-validate'] = "TRUE";

		if(checklogin()){
			echo '<script type="text/javascript">',
				'IsLoggedIn(true);',
				'</script>'
			;
			
		}else if(!checklogin()){
			echo '<script type="text/javascript">',
			'IsLoggedIn(false);',
			'</script>'
		;
			
		}
	?>

	<!-- content START -->
	<!-- Div that apper as an alert when a New Item has been created -->
	<div id="createAlert"></div>
	<div id="updateAlert"></div>
	<div id="content">

		

		<!-- Scroll up START -->

		<div class='fixedScroll' id='fixedScroll'>
			<span class='tooltiptextScroll'>Back to top</span>
			<i class='arrow up' id='scrollUp'></i>
		</div>

		<!-- Scroll up END -->

		<!-- MOTD dropdown -->
		<div id="motdArea">
			<div class="motdLeftContainer">
				<div class="motdBoxheader">
					<h3>Message of the day</h3>
				</div>
				<div id="motdContent">
					<p id="motd"><?php echo htmlspecialchars($motd ?? ''); ?></p>
				</div>
			</div>
			<div class="motdRightContainer">
				<input type="button" id="MOTDbutton" value="Close" class="submit-button" onclick="hideServerMessage()" />
			</div>
		</div>

		<!-- MOTD dropdown END -->

		<!-- Announcement box -->
		<div id="announcementBoxOverlay">
			<div id="announcementBox">
				<div id="actionLogDisplay">
					<?php 		

					if (isset($_SESSION["announcementcreated"])) {
						echo '<div class="announcementcreated"><span>'.$_SESSION["announcementcreated"].'</span><span onclick="closeActionLogDisplay();" class="closeActionLogDisplay" title="Close">&times;</span></div>';
					}elseif (isset($_SESSION['announcementupdated'])) {
						echo '<div class="announcementupdated"><span>'.$_SESSION["announcementupdated"].'</span><span onclick="closeActionLogDisplay();" class="closeActionLogDisplay" title="Close">&times;</span></div>';
					}elseif(isset($_SESSION['announcementdeleted'])){
						echo '<div class="announcementdeleted"><span>'.$_SESSION["announcementdeleted"].'</span><span onclick="closeActionLogDisplay();" class="closeActionLogDisplay" title="Close">&times;</span></div>';

					}

					unset($_SESSION['announcementcreated']);
					unset($_SESSION['announcementupdated']);
					unset($_SESSION['announcementdeleted']);

					?>
				</div>
				<div id="formContainer">
				<?php 
				$_SESSION['courseid'] = $_GET['courseid'];
				$_SESSION['coursename'] = $_GET['coursename'];
				$_SESSION['coursevers'] = $_GET['coursevers'];
				//include "../Shared/announcementBox.php"; 

				?>
				</div>
				<div id="displayAnnouncements">
					<div id="announcementCards"></div>
				</div>
			</div>
		</div>

		<!-- + button --->


		<div id='Sectionlist'>

		<div id='courseHeader' class='course' >
		
			<div class='fixed-action-button3 sectioned3 display_none' id="HIDEStatic">
  				<input id='toggleElements' type='image' src='../Shared/icons/eye_icon.svg' class='submit-button-newitem' title='toggle hidden items'>
  				<input id='showElements'  type='image' src='../Shared/icons/eye_icon.svg' style="display:None"  class='submit-button-newitem' title='Show hidden items' onclick='confirmBox("openItemsConfirmBox");'>
  				<input id='hideElement'  type='image' src='../Shared/icons/ghost_icon.svg' style="display:None"  class='submit-button-newitem' title='Hide marked items' onclick='confirmBox("openHideConfirmBox");'>
  				<input id="loadDuggaButton" type="button" class="submit-button-newitem" value="Load Dugga" title="Load a dugga by hash" onclick="showLoadDuggaPopup();"style="margin‑left:8px;" >
				
				<div class="courseHeaderFabDropdown">
					<input id='addElement' type='button' value='+' class='submit-button-newitem' title='New Item' >
					<div class='fixed-action-button2 sectioned2 display_none CourseFabDropdownDiv' id="FABStatic2">
						<ol class='fab-btn-list2 ' reversed id='fabBtnList2'>
								<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' id= 'fabDropdownElement' tabindex='0' data-tooltip='Heading' onclick='createFABItem("0","New Heading","TOP");'><img alt='heading format icon' class='fab-icon' src='../Shared/icons/heading-icon.svg'></a></li>
								<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' id= 'fabDropdownElement' tabindex='0' data-tooltip='Section' onclick='createFABItem("1","New Section","TOP");'><img alt='section format icon' class='fab-icon' src='../Shared/icons/section-icon.svg'></a></li>
								<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' id= 'fabDropdownElement' tabindex='0' data-tooltip='Moment' onclick='createFABItem("4","New Moment","TOP");'><img alt='moment format icon' class='fab-icon' src='../Shared/icons/moment-icon.svg'></a></li>
								<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' tabindex='0' data-tooltip='Test' onclick='createFABItem("3","New Test","TOP");'><img alt='test document icon' class='fab-icon' src='../Shared/icons/test-icon.svg'></a></li>
								<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out noselect centered-icon' id= 'fabDropdownElement' tabindex='0' data-tooltip='Link' onclick='createFABItem("5","New Link","TOP");'><i alt='link chain icon' class='material-icons'>link</i></a></li>
								<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' id= 'fabDropdownElement' tabindex='0' data-tooltip='Code' onclick='createFABItem("2","New Code","TOP");'><img alt='code tag icon' class='fab-icon' src='../Shared/icons/code-icon.svg'></a></li>
								<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' id= 'fabDropdownElement' tabindex='0' data-tooltip='Group activity' onclick='createFABItem("6","New Group","TOP");'><img alt='multiple users icon' class='fab-icon' src='../Shared/icons/group-icon.svg'></a></li>
								<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out noselect' id= 'fabDropdownElement' tabindex='0' data-tooltip='Message' onclick='createFABItem("7","New Quote","TOP");'><i alt='quotation mark icon' class='material-icons'>format_quote</i></a></li>
						</ol>
					</div>
				</div>
			</div>
		
			<!-- end hide button -->

			<!-- Small FAB Button in top in the header of sectioned -->
		
			<div class="margin_10px">
				<img src="../Shared/icons/right_complement.svg" alt='Show List Content' id="sectionList_arrowStatisticsOpen">
				<img src="../Shared/icons/desc_complement.svg" alt='Hide List Content' id="sectionList_arrowStatisticsClosed">
			</div>

			<!-- Hide button -->
		
			<!-- <div class='fixed-action-button3 sectioned3'  id="HIDEStatic" >
				<input id='tabElement'  type='button' value="&#8633;"  class='submit-button-newitem' title='Tab items' onclick='confirmBox("openTabConfirmBox");'>
				<input id='hideElement'  type='image' src='../Shared/icons/ghost_icon.svg' margin-right: 10px;" class='submit-button-newitem' title='Hide marked items' onclick='confirmBox("openHideConfirmBox");'>
			</div> -->
		
			<!-- end hide button -->
			
			<div id="course-header-dropdown">
				<!-- View mode toggle buttons -->
				<script type="text/babel">
					ReactDOM.createRoot(document.getElementById('course-header-dropdown')).render(
						<>
							<Dropdown dropdownName="View" onClick={() => showDropdown('course-header-dropdown-content')} id="course-header-dropdown-content">
								<Button className="submit-button" title="Normal View" onClick={() => {setViewMode('normal')}}>Normal</Button>
								<Button className="submit-button" title="Scroll View" onClick={() => {setViewMode('scroll')}}>Scroll</Button>
								<Button className="submit-button" title="Overview" onClick={() => {setViewMode('overview')}}>Overview</Button>
							</Dropdown>
						</>
					);
				</script>
			</div>

			<div id='course-label'>
				<span id='course-coursename' class='nowrap ellipsis' >UNK</span>
				<span id='course-coursecode'>UNK</span>
				<span id='course-versname' class='courseVersionField'>UNK</span>
			</div>


			<div id='course-newitem'>

			</div>

			<!-- test #1 -->

			<div id='course-coursevers'>UNK</div>
			<div id='course-courseid' >UNK</div>

		</div>

		<!-- + button END -->
		
		<!-- FAB Start -->
		<!-- Big FAB Button in the bottom of the page -->
		<div class='fixed-action-button extra-margin display_none' id="FABStatic">
				<a class='btn-floating fab-btn-lg noselect' id='fabBtn' tabindex='0' onclick='incrementItemsToCreate();'>+</a>
				<ol class='fab-btn-list fab_btn_list' reversed id='fabBtnList'>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' tabindex='0' data-tooltip='Heading' onclick='createFABItem("0","New Heading","undefined");'><img alt='heading format icon' class='fab-icon' src='../Shared/icons/heading-icon.svg'></a></li>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' tabindex='0' data-tooltip='Section' onclick='createFABItem("1","New Section","undefined");'><img alt='section format icon' class='fab-icon' src='../Shared/icons/section-icon.svg'></a></li>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' tabindex='0' data-tooltip='Moment' onclick='createFABItem("4","New Moment","undefined");'><img alt='moment format icon' class='fab-icon' src='../Shared/icons/moment-icon.svg'></a></li>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' tabindex='0' data-tooltip='Test' onclick='createFABItem("3","New Test","undefined");'><img alt='test document icon' class='fab-icon' src='../Shared/icons/test-icon.svg'></a></li>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect centered-icon' tabindex='0' data-tooltip='Link' onclick='createFABItem("5","New Link","undefined");'><i alt='link chain icon' class='material-icons'>link</i></a></li>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' tabindex='0' data-tooltip='Code' onclick='createFABItem("2","New Code","undefined");'><img alt='code tag icon' class='fab-icon' src='../Shared/icons/code-icon.svg'></a></li>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' tabindex='0' data-tooltip='Group activity' onclick='createFABItem("6","New Group","undefined");'><img alt='multiple users icon' class='fab-icon' src='../Shared/icons/group-icon.svg'></a></li>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' tabindex='0' data-tooltip='Message' onclick='createFABItem("7","New Message","undefined");'><i alt='message mark icon' class='material-icons'>format_quote</i></a></li>
				</ol>
		</div>
		

		<!-- FAB END -->

		<div id='courseList'>
		
		<!-- Section List -->
		<div id='Sectionlisti'>
		
		</div>
		
	</div>
	
	<!-- <div class="course">
		<span>
			<a href="../Shared/calendar.php?courseid=<?php echo $_GET['courseid']; ?>&coursevers=<?php echo $_GET['coursevers']; ?>">Subscribe for deadlines in your personal calendar</a>
		</span>
	</div> -->
	<!-- content END -->

	<?php
		include '../Shared/loginbox.php';
	?>
		<!-- Edit Section Dialog START -->


		<div id='editSection' onmouseover=" validateDate2('setDeadlineValue','dialog8');"  class='loginBoxContainer display_none'>
			<div id='editSectionLoginBox' class='loginBox DarkModeBackgrounds DarkModeText'>


				<div class='formBoxHeader'>
					<h3 id='editSectionDialogTitle'>Edit Item</h3>
					<div class='cursorPointer' onclick='closeWindows(); closeSelect();showSaveButton();'>x</div>
				</div>
				<div class="formBody">
					<input type='hidden' id='lid' value='Toddler' />
					<input type='hidden' id='comments'  />
					<div id='inputwrapper-name' class='inputwrapper'>
						<span>Name:</span>
						<div class="dialogwrapper">
							<div class="formDialog">
								<span id="dialog10" class="formDialogText">Illegal characters found in the title!<br>Valid characters: A-Ö, 0-9.</span>
							</div>
							<input onkeyup="quickValidateForm('editSection', 'saveBtn');" onchange="validateSectName('sectionname')" placeholder='Enter section name' type='text' class='textinput' id='sectionname' value='sectionname' maxlength="64" />
						</div>
					</div>
					<div id='inputwrapper-type' class='inputwrapper'>
						<span>Type:</span>
						 <!-- If you want to change the names of the spans, make sure that they fit with the dropdown box.
							If they don't, change the width of formBox select in the CSS file -->
						<select id='type' value='type' onchange='changedType(document.getElementById("type").value);'></select>
						</div>
						<div id='inputwrapper-link' class='inputwrapper'><span>Link:</span><select id='link' ></select></div>
						<div id='inputwrapper-gradesystem' class='inputwrapper'><span>Grade system:</span><select id='gradesys' ></select></div>

						<div id='inputwrapper-deadline' class='inputwrapper'>
								<legend><h3>Deadline</h3></legend>
								<span>Absolute</span>
								<span style='float:right'>
									<input onchange="quickValidateForm('editSection', 'saveBtn');" class='textinput' style='margin:0 0 0 10px;' type='date' id='setDeadlineValue' value='' />
									<select class='selectDeadlineTime' style='width:55px;' id='deadlineminutes'></select>
									<select class='selectDeadlineTime' style='width:55px;' id='deadlinehours'></select>
									<input type='checkbox' id='absolutedeadlinecheck' onclick='checkDeadlineCheckbox(this); quickValidateForm("editSection", "saveBtn");'/>
								</span>
								<br />
								<span title="Relative deadline that relates to the start of the course instead of a set date">Relative</span>
								<span style='float:right;'>
									<select class='selectDeadlineTime' style='width:130px;' id='relativedeadlinetype'></select>
									<select class='selectDeadlineTime' style='width:55px;' id='relativedeadlineamount'></select>
									<select class='selectDeadlineTime' style='width:55px;' id='relativedeadlineminutes'></select>
									<select class='selectDeadlineTime' style='width:55px;' id='relativedeadlinehours'></select>
								</span>
								<div id="relativeFormDialog" class="formDialogWide">
  		      						<span id="dialog8" class="formDialogText">Deadline has to be between start date and end date</span>
  		      					</div>
						</div>
						<!-- <div id='inputwrapper-tabs' class='inputwrapper'><span>Tabs:</span><select id='tabs' ></select></div> -->
						<div id='inputwrapper-highscore' class='inputwrapper'><span>High score:</span><select id='highscoremode' ></select></div>
						<div id='inputwrapper-moment' class='inputwrapper'><span>Moment:</span><select id='moment'></select></div>
						<div id='inputwrapper-visibility' class='inputwrapper'><span>Visibility:</span><select class="align_right" id='visib'></select></div>
						<div id='inputwrapper-group' class='inputwrapper'><span>Group type:</span><select class="align_right" id='grptype'></select></div>
						<div id='inputwrapper-Feedback' class='inputwrapper'><span>Enable Student Feedback:</span><input type="checkbox"  class="align_center" id='fdbck' title='Student feedback checkbox' onchange='showFeedbackquestion()'></input></div>
						<div id='inputwrapper-FeedbackQuestion' class='inputwrapper display_none'><span>Student Feedback Question:</span><input type="input"  class='textinput' id='fdbckque' value='How would you grade the dugga?'></input></div>
					</div>

					<!-- Error message, no duggas present-->
					<div id= "saveBtnPlacement" class="formFooter"></div>
				</div>
			</div>
		</div>

		<script type="text/babel">
			function SubmitButtons() {
				return (
					<>
						<Button id="deleteBtn" className="submit-button deleteDugga" title="Delete" onClick={() => deleteItem()}> Delete </Button>
						<Button id="cancelBtn" className="submit-button closeDugga" title="Cancel" onClick={() => {closeWindows(); closeSelect();}}> Cancel </Button>
						<Button id="submitBtn" className="submit-button submitDugga" title="Submit" onClick={() => {newItem(); showSaveButton();}}> Submit </Button>
						<Button id="saveBtn" onMouseOver={() => quickValidateForm("editSection", "saveBtn")} className="submit-button updateDugga" title="save" onClick={() => {validateForm("editSection"); clearHideItemList();}}> Save </Button>
					</>
				);
			}
			ReactDOM.createRoot(document.getElementById('saveBtnPlacement')).render(<SubmitButtons />)
		</script>
	<!-- Edit Section Dialog END -->

	<!-- Confirm Section Dialog START -->
	<div id='sectionConfirmBox' class='loginBoxContainer display_none'>
		<div id="deleteConfirmBox" class='formBox DarkModeBackgrounds DarkModeText'>
			<div class='formBoxHeader'>
					<h3>Confirm deletion</h3>
					<div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
			</div>
			<div id="deleteConfirmText" class="formBody">
					<h4>Are you sure you want to delete selected items?</h4>
					<p>(You can always undo!)</p>
			</div>
			<div id="deleteBtnPlacement" class="formFooter" ></div>
		</div>
	</div>
	
	<!-- Handles the confirmation box popup from delete button -->
	<script type="text/babel">
		function ConfirmButtons() {
			return (
				<>
					<Button id="delete-item-button" className="submit-button" title="Yes" onClick={() => confirmBox("deleteItem")}> Yes </Button>
					<Button id="close-item-button" className="submit-button" title="No" onClick={() => confirmBox("closeConfirmBox")}> No </Button>
				</>
			);
		}
		ReactDOM.createRoot(document.getElementById('deleteBtnPlacement')).render(<ConfirmButtons />)
	</script>
	<!-- Confirm Section Dialog END -->

	<!-- Canvas Link Dialog -->
	<div id='canvasLinkBox' class='loginBoxContainer display_none'>
		<div id="formBoxCanvasLink" class='formBox DarkModeBackgrounds DarkModeText'>
			<div class='formBoxHeader'>
					<h3>Link Copied To Clipboard</h3>
					<div class="cursorPointer" onclick='showCanvasLinkBox("close",this);' title="Close window">x</div>
			</div>
			<div id="formBodyCanvasLinkText" class="formBody">
					<input type="text" id="canvasLinkText" readonly value="">
			</div>
		</div>
	</div>

	<!-- Confirm Edit Section Dialog END -->

	<!-- Confirm Section Hide Dialog START -->
	<div id='sectionHideConfirmBox' class='loginBoxContainer display_none'>
		<div id="formBoxConfirm" class='formBox DarkModeBackgrounds DarkModeText'>
			<div class='formBoxHeader'>
					<h3>Confirm hiding</h3>
					<div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
			</div>
			<div class="formBody formBodyConfirm">
					<h4>Are you sure you want to hide this item?</h4>
			</div>
			<div class="formFooter formFooterBtnplace">
				<input class='submit-button' id="hide-item-button" type='button' value='Yes' title='Yes' onclick='confirmBox("hideItem");' />
				<input class='submit-button' id="close-item-button" type='button' value='No' title='No' onclick='confirmBox("closeConfirmBox");' />
			</div>
		</div>
	</div>
	<!-- Confirm Edit Section Hide Dialog END -->

	<!-- Confirm Section Hide Dialog START -->
	<div id='sectionShowConfirmBox' class='loginBoxContainer display_none'>
		<div id="formBoxConfirm" class='formBox DarkModeBackgrounds DarkModeText'>
			<div class='formBoxHeader'>
					<h3>Confirm show items</h3>
					<div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
			</div>
			<div class="formBody formBodyConfirm">
					<h4>Are you sure you want to show this item?</h4>
			</div>
			<div class="formFooter formFooterBtnplace">
				<input class='submit-button' id="hide-item-button" type='button' value='Yes' title='Yes' onclick='confirmBox("showItems");' />
				<input class='submit-button' id="close-item-button" type='button' value='No' title='No' onclick='confirmBox("closeConfirmBox");' />
			</div>
		</div>
	</div>
	<!-- Confirm Edit Section Hide Dialog END -->

	<!-- Cofirm Section Tab Dialog START -->
	<div id='tabConfirmBox' class='loginBoxContainer display_none'>
		<div id='formBoxTabConfirm' class='formBox' >
			<div class='formBoxHeader'>
					<h3>Confirm tab</h3>
					<div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
			</div>
			<div class="formBody">
				<div class="formBodyConfirm">
					<h4>How many tabs?</h4>
				</div>
				<div id="tabDropDown">
					<div id='inputwrapper-tabs' class='inputwrapper'><span>Tabs:</span>
						<select id='tabs'>
							<option value="0">0 tabs</option>
							<option value="1">1 tabs</option>
							<option value="2">2 tabs</option>
							<option value="3">3 tabs</option>
							<option value="4">1 tabs + end</option>
							<option value="5">2 tabs + end</option>
							<option value="6">3 tabs + end</option>
						</select>
					</div>
				</div>
			</div>
			<div class="formFooter formFooterBtnplace">
				<input class='submit-button' id="hide-item-button" type='button' value='OK' title='OK' onclick='confirmBox("tabItem");' />
			</div>
		</div>
	</div>
	<!-- Cofirm Edit Section Tab Dialog END -->

	<!-- Confirm Missing Material Dialog START -->
	<div id='noMaterialConfirmBox' class='loginBoxContainer display_none'>
		<div  id='formBoxInfo' class='formBox'>
				<div class='formBoxHeader'>
					<h3>Error: Missing material</h3>
					<div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
				</div>
				<div class="formBody formBodyConfirm">
					<h4 id="noMaterialText"></h4>
				</div>
				<div class="formFooter formFooterBtnplace">
					<input id="ok-item-button" class='submit-button' type='button' value='OK' title='OK' onclick='confirmBox("closeConfirmBox");'/>
				</div>
		</div>
	</div>
	<!-- Confirm Missing Material Dialog END -->

		<!-- New Version Dialog START -->
		<div id='newCourseVersion' class='loginBoxContainer display_none'>
    	<div class='formBox DarkModeBackgrounds DarkModeText formBoxCourseVersion'>
			<div class='formBoxHeader'>
				<h3>New Course Version</h3>
				<div class="cursorPointer" onclick='closeWindows();' title="Close window">x</div>
			</div>
			<div class="formBody">
				<div class='inputwrapper'>
					<span>Version ID:</span>
					<div class="dialogwrapper">
						<div class="formDialog">
							<span id="dialog2" class="formDialogText">3 to 8 numbers required</span>
						</div>
						<input onkeyup="quickValidateForm('newCourseVersion', 'submitCourseMotd');" class='textinput' type='text' id='cversid' placeholder='Version ID' maxlength='8' />
					</div>
				</div>
				<div class='inputwrapper'>
					<span>Version Name:</span>
					<div class="dialogwrapper">
						<div class="formDialog">
							<span id="dialog" class="formDialogText">Must be in of the form HTNN, VTNN or STNN</span>
						</div>
						<input onkeyup="quickValidateForm('newCourseVersion', 'submitCourseMotd'); " class='textinput' type='text' id='versname' placeholder='Version Name' />
					</div>
				</div>
				<div class='inputwrapper'>
					<span>Start Date:</span>
					<div class="dialogwrapper">
						<div class="formDialog">
							<span id="dialog3" class="formDialogText">Start date has to be before end date</span>
						</div>
						<input onchange="quickValidateForm('newCourseVersion', 'submitCourseMotd'); " class='textinput' type='date' id='startdate' value='' />
					</div>
				</div>
				<div class='inputwrapper'>
					<span>End Date:</span>
					<input onchange="quickValidateForm('newCourseVersion', 'submitCourseMotd'); " class='textinput' type='date' id='enddate' value='' />
				</div>
				<div class='inputwrapper'>
					<span>MOTD:</span>
					<div class="dialogwrapper">
						<div class="formDialog">
							<span id="dialog4" class="formDialogText">Prohibited symbols</span>
							<span id="dialog42" class="formDialogText">Max 50 characters</span>
						</div>
						<input onkeyup="quickValidateForm('newCourseVersion', 'submitCourseMotd'); " class='textinput' type='text' id='vmotd' placeholder='MOTD' value='' />
					</div>
				</div>
				<div class='inputwrapper'><span>Change this to default version</span><input type="checkbox" name="makeactive" id="makeactive" title='default version checkbox' value="yes"></div>
				<div class='inputwrapper'><span>Copy content from:</span><select id='copyvers'></select></div>
			</div>
			<div class="formFooter">
				<input id='submitCourseMotd' class='submit-button' type='button' value='Create' disabled title='Create new version' onmouseover="quickValidateForm('newCourseVersion', 'submitCourseMotd');" onclick="validateForm('newCourseVersion')" />
			</div>
		</div>
	</div>
	<!-- New Verison Dialog END -->

<!-- Edit Version Dialog START -->

<div id='editCourseVersion' onmouseover="quickValidateForm('editCourseVersion', 'submitEditCourse');" class='loginBoxContainer display_none'>
		<div class='formBox DarkModeBackgrounds DarkModeText formBoxCourseVersion formBoxCourseVersion'>

			<div class='formBoxHeader'>
				<h3>Edit Course Version</h3>
				<div class='cursorPointer' onclick='closeWindows();'>x</div>
			</div>
			<div class="formBody">
				<input type='hidden' id='cid' value='Toddler' />
				<div class='inputwrapper'>
							<span>Version ID:</span>
							<input class="greyedout-textinput" type='text' disabled id='eversid' placeholder='Version ID' />
						</div>
						<div class='inputwrapper'>
							<span>Version Name:</span>
							<div class="dialogwrapper">
								<div class="formDialog"><span id="dialog5" class="formDialogText">Must be in of the form HTNN, VTNN or STNN</span></div>
								<input onkeyup="quickValidateForm('editCourseVersion', 'submitEditCourse'); " class='textinput' type='text' id='eversname' placeholder='Version Name' />
							</div>
						</div>
						<div class='inputwrapper'>
							<span>Start Date:</span>
							<div class="dialogwrapper">
								<div class="formDialog"><span id="dialog6" class="formDialogText">Start date has to be before end date</span></div>
								<input onchange="quickValidateForm('editCourseVersion', 'submitEditCourse');" class='textinput' type='date' id='estartdate' title='Start date input' value='' />
							</div>
						</div>
						<div class='inputwrapper'>
							<span>End Date:</span><input onchange="quickValidateForm('editCourseVersion', 'submitEditCourse');" class='textinput' type='date' id='eenddate' title='End date input' value='' />
						</div>
						<div class='inputwrapper'>
							<span>MOTD:</span>
							<div class="dialogwrapper">
								<input onkeyup="quickValidateForm('editCourseVersion', 'submitEditCourse'); " class='textinput' type='text' id='eMOTD' placeholder='MOTD' />
								<div class="formDialog"><span id="dialog9" class="formDialogText">Prohibited symbols</span></div>
								<div class="formDialog"><span id="dialog92" class="formDialogText">Max 50 characters</span></div>
							</div>
						</div>
						<div class='inputwrapper'><span>Change this to default version</span><input type="checkbox" name="emakeactive" id="emakeactive" title='Default version checkbox' value="yes"></div>
			</div>
			<div class="formFooter">
				<div id="ButtonContainerSubmitEditCourse"></div>
			</div>
		</div>
	</div>
	<!-- Edit Version Dialog END -->

<!-- Group Members Table START -->
<div id='grptblContainer' class='loginBoxContainer display_none'>
		<div class='formBox'>
			<div class='formBoxHeader'>
				<h3>Group Members</h3>
				<div class='cursorPointer' onclick='closeWindows();'>x</div>
			</div>
			<div class="formBody">
				<div id='grptbl'></div>
			</div>
		</div>
	</div>
	<!-- Group Members Table END -->


	<!-- HighscoreBox START -->
	<div id='HighscoreBox' class='loginBoxContainer display_none'>
		<div id="formBoxHighscore" class='formBox' >
			<div class='formBoxHeader'>
				<h3>Highscore</h3>
				<div class='cursorPointer' onclick='closeWindows();'>x</div>
			</div>
			<table id ='HighscoreTable' width='100%'>
				<tr></tr>
			</table>
		</div>
	</div>
	<!-- HighscoreBox END -->

	<!-- User Feedback Dialog START -->
    <div id='userFeedbackDialog' class='loginBoxContainer display_none'>
      <div class='formBox' id='variantBox'>
        <div class='formBoxHeader'>
          <h3 id="userFeedbackTitle">User Feedback</h3> 
          <div class='cursorPointer' onclick='closeWindows();'>x</div>
        </div>
		<h2 id="duggaFeedbackQuestion"></h2>
		<div id="statscontainer">
			<div class="statsdiv"><p id="avg-feedback"></p>Average value</div>
			<div class="statsdiv"><p id="median-feedback"></p>Highest/lowest</div>
			<div class="statsdiv"><p id="total-feedback"></p>Amount of feedbacks</div>
		</div>
		<div id="feedbacktablecontainer">
		</div>
      </div>
    </div>
    <!-- User Feedback Dialog END -->

	
	<!-- Load Dugga Popup (Enter hash to get redirected to specified dugga) -->
	<div id='loadDuggaBox' class="loginBoxContainer display_none">
	  <div class="loadDuggaBox formBox DarkModeBackgrounds DarkModeText" >
			<div class='formBoxHeader'><h3>Load dugga with hash</h3><div class='cursorPointer' onclick="hideLoadDuggaPopup()">x</div></div>
			<div id='loadDuggaInfo'></div>
    		<div id='loadDuggaPopup' class="display_block">
				<div class='inputwrapper'><span>Enter your hash:</span><input class='textinput' type='text' id='hash' placeholder='Hash' value=''/></div>
				<div class="button-row">
					<input type='button' class='submit-button' onclick="loadDugga();" value='Load Dugga'>
					<input type='button' class='submit-button' onclick="hideLoadDuggaPopup();" value='Close'>
				</div>
    		</div>
      </div>
	</div>
	<!-- Load Dugga Popup (Enter hash to get redirected to another dugga) End! -->


	<!-- github moments box  -->
	<form action="" method="POST" id="form">
		<div id='gitHubBox' class='loginBoxContainer display_none'>
			<div id="formBoxGitHub" class='formBox DarkModeBackgrounds DarkModeText'>
				<div class='formBoxHeader'>
					<h3>Github Moment</h3>
					<div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
				</div>
				<div class="formBody">
					<div class='inputwrapper'>
						<span>Github Directory:</span>
						<select name="githubDir" placeholder='Github Folder' onchange='saveLocalStorage(this)'>
							<!-- Below inputs are made that are fed into the "if-statement" in the top of the code, just before "updateGithubDir" -->
							<?php
								// Gets "cid" via getOPG.
								$cid = getOPG('courseid');
								// Traverses the github map for the respective course, only fetches directories.
								$dirs = glob("../courses/$cid/Github/*", GLOB_ONLYDIR);
								foreach ($dirs as $dir) {
									$dirname = basename($dir);
									// Creates an option for each directory containing the string "Examples". 
									echo "<option value='$dirname'>$dirname</option>";	
								}			
							?>
						</select>
					</div>
				</div>
				<div class="formFooter">
					<input type="hidden" name="lid" id="lidInput">
					<!-- Hidden input using the "lid" from "getLidFromButton" -->
					<input type="submit" class="submit-button" name="githubInsert" value="Submit">
				</div>
			</div>
		</div>
	</form>
	
	<!--error window opened when github repo not found-->
	<div id="githubPopupWindow" class="loginBoxContainer display_none" >
		<div id="formBoxGitHub" class="formBox DarkModeBackgrounds">	
			<div class= "formBoxHeader">
  					<h3>Github repo</h3>
		  			<div class='cursorPointer'	onclick='closeWindows();'>x</div>
			</div>
			<div class="formBody">
				<h3>There is currently no valid github repo. Add one?</h3>
				<input type='hidden' id='cidTrue' value='<?php echo $_GET["courseid"];?>'/>
				<form action="" method="POST" id="repoLink">
					<div class= 'inputwrapper'><span>Github repo link:</span><input onchange="checkGithubLinkClue('gitRepoURL')" oninput="checkGithubLink('gitRepoURL')" type="text" id="gitRepoURL" class="textinput" name="reponame" placeholder="https://github.com/username/repository"/></div>
				</form>
			</div>
			<div class="formFooter">
				<div id="buttonContainerSaveRepo"></div>
			</div>
		</div>
	</div>

	<!-- github template  -->
		<div id='gitHubTemplate' class="loginBoxContainer display_none">
				<div id='chooseTemplate' class='formBox DarkModeBackgrounds'>
					<div class='formBoxHeader'>
						<h3>Choose Template</h3>
						<div class='cursorPointer' onclick='confirmBox("closeConfirmBox");'>x</div>
					</div>
					<table id="templateTable" width="100%">
						<tr>
							<td id="templat1" class="tmpl"><input id="templateno" type="hidden" value="0" />
								<img class='templatethumbicon wiggle' onclick='changetemplate("1"); quickValidateForm("gitHubTemplate","saveCourse")' src='../Shared/icons/template1_butt.svg' />
							</td>
							<td id="templat2" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("2"); quickValidateForm("gitHubTemplate","saveCourse")' src='../Shared/icons/template2_butt.svg' /></td>
							<td id="templat3" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("3"); quickValidateForm("gitHubTemplate","saveCourse")' src='../Shared/icons/template3_butt.svg' /></td>
							<td id="templat4" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("4"); quickValidateForm("gitHubTemplate","saveCourse")' src='../Shared/icons/template4_butt.svg' /></td>
							<td id="templat5" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("5"); quickValidateForm("gitHubTemplate","saveCourse")' src='../Shared/icons/template5_butt.svg' /></td>
							<td id="templat6" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("6"); quickValidateForm("gitHubTemplate","saveCourse")' src='../Shared/icons/template6_butt.svg' /></td>
							<td id="templat7" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("7"); quickValidateForm("gitHubTemplate","saveCourse")' src='../Shared/icons/template7_butt.svg' /></td>
							<td id="templat8" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("8"); quickValidateForm("gitHubTemplate","saveCourse")' src='../Shared/icons/template8_butt.svg' /></td>
							<td id="templat9" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("9"); quickValidateForm("gitHubTemplate","saveCourse")' src='../Shared/icons/template9_butt.svg' /></td>
							<td id="templat10" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("10"); quickValidateForm("gitHubTemplate","saveCourse")' src='../Shared/icons/template10_butt.svg' /></td>
						</tr>
					</table>
					<table id="templateOptions" width="100%">
						</table>
						<div class="formDialogWide">
							<span id="templateTableError" class="formDialogText">Please chose a template for your code-example</span>
						</div>
					<table width="100%">
					    <tr> 
				            <td align='right'><input id="saveGitTemplate" class='submit-button' type='button' value='Save' onclick='fetchGitCodeExamples(<?php echo $_GET["courseid"]; ?>);' /></td>
						</tr>
						<div class='inputwrapper'>
							<span>Name:</span>
							<div class="dialogwrapper">
								<div class="formDialog">
									<span id="fileNameError" class="formDialogText">Please use letters and digits, only</span>
								</div>
								<input onkeyup="quickValidateForm('gitHubTemplate','saveCourse')" class='textinput validate' type='text' id='fileName' placeholder='Name.type' value='' />
							</div>
						</div>
						<div class='inputwrapper'>
							<span>GithubUrl:</span>
							<div class="dialogwrapper">
								<div class="formDialog">
									<span id="gitHubError" class="formDialogText">Enter a valid github url</span>
								</div>
								<input onkeyup="quickValidateForm('gitHubTemplate','saveCourse')" class='textinput validate' type='text' id='githubURL' placeholder='GitHubDownloadUrl' value='' />
							</div>
						</div>
						<div class='inputwrapper'>
							<span>Filepath:</span>
							<input class='textinput' type='text' id='filePath' placeholder='no' value=''/>
						</div>
                        
					</table>
				</div>

		</div>
		<!-- Set JS variable based on if logged in or not -->
		<?php
		if (checklogin()) {
			echo '<script>var isLoggedIn = true;</script>';
		} else {
			echo '<script>var isLoggedIn = false;</script>';
		}
		?>
		
		<script type="text/babel">
			window.addEventListener("load", () => {
				// Give the page time to fully load 
				setTimeout(() => {
					// Disable drag-and-drop if user is not logged in
					if (!isLoggedIn) return;

					const listElement = document.querySelector("#Sectionlisti");
					if (!listElement) return;

					// The item currently being dragged
					let dragging = null;

					// Make each list item draggable
					listElement.querySelectorAll("div.test, div.code").forEach(item => {
						item.setAttribute("draggable", "true");

						// When dragging starts
						item.addEventListener("dragstart", (e) => {
							dragging = item;
							// Visual effect for the drag
							item.classList.add("dragging");
							e.dataTransfer.effectAllowed = "move";
							e.dataTransfer.setData("text/plain", "");
						});

						// While dragging over another item in the list
						item.addEventListener("dragover", (e) => {
							e.preventDefault();
							const target = item;

							// Only allow sorting between valid items types
							if (!target.classList.contains("test") && !target.classList.contains("code")) return;

							// Decide whether to insert above or below the target
							const rect = target.getBoundingClientRect();
							const after = (e.clientY - rect.top) > rect.height / 2;

							if (dragging && target !== dragging) {
								if (after) {
									target.after(dragging);
								} else {
									target.before(dragging);
								}
							}
						});

						// When dropping the item in the list
						item.addEventListener("drop", updateOrder);

						// When the drag ends
						item.addEventListener("dragend", () => {
							if (dragging) dragging.classList.remove("dragging");
						});
					});

					// Send the updated order to the server via AJAX
					function updateOrder() {
						const items = listElement.querySelectorAll("div.test, div.code");
						let str = "";
						items.forEach((item, i) => {
							const ido = item.getAttribute("id");
							const phld = item.getAttribute("placeholder");
							if (i > 0) str += ",";
							str += i + "XX" + ido.substring(1) + "XX" + phld;
						});

						fetch("sectionedservice.php", {
							method: "POST",
							headers: { "Content-Type": "application/x-www-form-urlencoded" },
							body: new URLSearchParams({
								request: "REORDER",
								order: str
							})
						});
					}
				}, 100); // Give the page time to load. 
			});
		</script>

		</body>
		
		</html>