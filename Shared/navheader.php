<header>
       <?php
			$requestedService = explode('?', $_SERVER['REQUEST_URI'], 2)[0];
			$requestedService = substr($requestedService,strrpos ( $requestedService , "/")+1);

			echo "<table class='navheader'><tr>";
			include_once "../Shared/basic.php";
			
			// As we always include the navheader - we can add the code that saves the current course ID to the session here.
			if (isset($_GET['courseid']))
				$_SESSION['courseid'] = getOPG('courseid');
			else if (isset($_GET['cid']))
				$_SESSION['courseid'] = getOPG('cid');
			else
				$_SESSION['courseid'] = "UNK";
				//get course name
			if (isset($_GET['coursename']))
				$_SESSION['coursename'] = getOPG('coursename');
			else if (isset($_GET['coursename']))
				$_SESSION['coursename'] = getOPG('coursename');
			else 
				$_SESSION['coursename'] = "UNK";
				
			if (isset($_GET['coursevers']))
				$_SESSION['coursevers'] = getOPG('coursevers');
			else if (isset($_GET['cvers']))
				$_SESSION['coursevers'] = getOPG('cvers');
			else
				$_SESSION['coursevers'] = "UNK";
	
			// Always show home button which links to course homepage
			echo "<td class='navButt' id='home' title='Home'><a id='homeIcon' class='navButt' href='../DuggaSys/courseed.php'><img src='../Shared/icons/Home.svg'></a></td>";
			// Generate different back buttons depending on which page is including
			// this file navheader file. The switch case uses ternary operators to
			// determine the href attribute value. (if(this) ? dothis : elsethis)
			// If the current page is the course editor, don't display the back button
			//---------------------------------------------------------------------

			// Analytics button
			if($noup == 'NONE' && $requestedService != "analytic.php" && checklogin() && isSuperUser($_SESSION['uid']) ){
				echo "<td class='menuButton' style='display: inline-block;'>";
				echo "    <div class='access menuButton'>";
  				echo "      <a id='accessBTN' class='navButt' title='Visit the analytics page' value='Analytics' href='analytic.php'>";
  				echo "        <img src='../Shared/icons/analytic.svg' style='margin: 8px; height: 30px;'>";
				echo "      </a>";
				echo "    </div>";
				echo "</td>";
			} else if($requestedService == "analytic.php") {
				echo '<td class="navButt" id="home" title="Back"><a id="upIcon" class="navButt internal-link" href="../DuggaSys/courseed.php"><img src="../Shared/icons/Up.svg"></a></td>';
                echo '<td class="vl"></td>';
				echo '<td class="navButt analytic-navbutton GS" id="GeneralStats"><a onclick="loadGeneralStats()"><i class="fas fa-stream"></i></a><span class="navcomment">General Stats</span></td>';
				echo '<td class="navButt analytic-navbutton CO" id="CurrentlyOnline"><a onclick="loadCurrentlyOnline()"><i class="fas fa-users"></i></a><span class="navcomment">Currently Online</span></td>';
				echo '<td class="navButt analytic-navbutton PG" id="PasswordGuessing"><a onclick="loadPasswordGuessing()"><i class="fas fa-key"></i></a><span class="navcomment">Password Guessing</span></td>';
				echo '<td class="navButt analytic-navbutton OP" id="OSPercentage"><a onclick="loadOsPercentage()"><i class="fas fa-laptop"></i></a><span class="navcomment">OS Percentage</span></td>';
				echo '<td class="navButt analytic-navbutton BP" id="Browserpercentage"><a onclick="loadBrowserPercentage()"><i class="fa fa-chrome"></i></a><span class="navcomment">Browser percentage</span></td>';
				echo '<td class="navButt analytic-navbutton SU" id="Serviceusage"><a onclick="loadServiceUsage()"><i class="fas fa-chart-line"></i></a><span class="navcomment">Service usage</span></td>';
				echo '<td class="navButt analytic-navbutton SS" id="Servicespeed"><a onclick="loadServiceAvgDuration()"><i class="fas fa-tachometer-alt"></i></a><span class="navcomment">Service speed</span></td>';
				echo '<td class="navButt analytic-navbutton SC" id="Servicecrashes"><a onclick="loadServiceCrashes()"><i class="fas fa-car-crash"></i></a><span class="navcomment">Service crashes</span></td>';
				echo '<td class="navButt analytic-navbutton FF" id="Fileinformation"><a onclick="loadFileInformation()"><i class="fas fa-file-pdf"></i></a><span class="navcomment">File information</span></td>';
				echo '<td class="navButt analytic-navbutton PF" id="Pageinformation"><a onclick="loadPageInformation()"><i class="fas fa-globe-europe"></i></a><span class="navcomment">Page information</span></td>';
				echo '<td class="navButt analytic-navbutton UI" id="Userinformation"><a onclick="loadUserInformation()"><i class="fas fa-user"></i></a><span class="navcomment">User information</span></td>';
				echo '<td class="navButt analytic-navbutton CD" id="CourseDiskUsage"><a onclick="loadCourseDiskUsage()"><i class="fas fa-hdd"></i></a><span class="navcomment">Course disk usage</span></td>';
				
				echo '<td class="navButt analytic-navbutton" id="hamburger"><div class="hamContainer" id="ham" onclick="hamburgerToggle()"><div class="bar1"></div><div class="bar2"></div><div class="bar3"></div></div>';
				echo '<ol class="hamburgerList" id="hamburgerList">';
				echo '<li class="navButt analytic-navbutton GS2" id="GeneralStats"><a onclick="loadGeneralStats(); hamburgerToggle();" data-tooltip="General Stats"><i class="fas fa-stream"></i></a></li>';
				echo '<li class="navButt analytic-navbutton CO2" id="CurrentlyOnline"><a onclick="loadCurrentlyOnline(); hamburgerToggle();" data-tooltip="Currently Online"><i class="fas fa-users"></i></a></li>';
				echo '<li class="navButt analytic-navbutton PG2" id="PasswordGuessing"><a onclick="loadPasswordGuessing(); hamburgerToggle();" data-tooltip="Password Guessing"><i class="fas fa-key"></i></a></li>';
				echo '<li class="navButt analytic-navbutton OP2" id="OSPercentage"><a onclick="loadOsPercentage(); hamburgerToggle();" data-tooltip="OS Percentage"><i class="fas fa-laptop"></i></a></li>';
				echo '<li class="navButt analytic-navbutton BP2" id="Browserpercentage"><a onclick="loadBrowserPercentage(); hamburgerToggle();" data-tooltip="Browser percentage"><i class="fa fa-chrome"></i></a></li>';
				echo '<li class="navButt analytic-navbutton SU2" id="Serviceusage"><a onclick="loadServiceUsage(); hamburgerToggle();" data-tooltip="Service usage"><i class="fas fa-chart-line"></i></a></li>';
				echo '<li class="navButt analytic-navbutton SS2" id="Servicespeed"><a onclick="loadServiceAvgDuration(); hamburgerToggle();" data-tooltip="Service speed"><i class="fas fa-tachometer-alt"></i></a></li>';
				echo '<li class="navButt analytic-navbutton SC2" id="Servicecrashes"><a onclick="loadServiceCrashes(); hamburgerToggle();" data-tooltip="Service crashes"><i class="fas fa-car-crash"></i></a></li>';
				echo '<li class="navButt analytic-navbutton FF2" id="Fileinformation"><a onclick="loadFileInformation(); hamburgerToggle();" data-tooltip="File information"><i class="fas fa-file-pdf"></i></a></li>';
				echo '<li class="navButt analytic-navbutton PF2" id="Pageinformation"><a onclick="loadPageInformation(); hamburgerToggle();" data-tooltip="Page information"><i class="fas fa-globe-europe"></i></a></li>';
				echo '<li class="navButt analytic-navbutton UI2" id="Userinformation"><a onclick="loadUserInformation(); hamburgerToggle();" data-tooltip="User information"><i class="fas fa-user"></i></a></li>';
				echo '<li class="navButt analytic-navbutton CD2" id="CourseDiskUsage"><a onclick="loadCourseDiskUsage(); hamburgerToggle();" data-tooltip="Course disk usage"><i class="fas fa-hdd"></i></a></li>';
				echo '</ol>';
				echo '</td>';

			}

			if($noup!='NONE') {
				  echo "<td class='navButt' id='back' title='Back'>";
			}
			if($noup=='COURSE'){
					echo "<a id='upIcon' class='navButt' href='../DuggaSys/courseed.php'>";
					echo "<img src='../Shared/icons/Up.svg'></a></td>";
			}if ($noup == 'COURSE' && checkLogin()) {
					echo "<td class='navButt' id='announcement' title='Announcement'><img src='../Shared/icons/announcement_icon.svg'></td>";

			}if ($noup == 'COURSE' && checkLogin() && (isStudentUser($_SESSION['uid']))) {
					echo "<td class='navButt' id='feedback' title='Recent Feedback'><img src='../Shared/icons/feedback_icon.svg'></td>";

			}else if($noup=='SECTION'){
					echo "<a id='upIcon' href='";
					echo ($_SESSION['courseid'] != (string)"UNK" ? "../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers'] : "../DuggaSys/courseed.php");
					echo "'>";
					echo "<img src='../Shared/icons/Up.svg'></a></td>";
			}

	
			// Adding buttons for courses
			if($noup=='COURSE'){
					// Course specific navbar buttons moved from "static" to navheader
					if(checklogin() && (isSuperUser($_SESSION['uid']) || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'st') || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'w') || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'sv'))) {				
							echo "<td style='display: inline-block;' title='Choose course version'>";
							echo "    <div class='course-dropdown-div'>";
							echo "      <select id='courseDropdownTop' class='course-dropdown' onchange='goToVersion(this)' ></select>";
							echo "    </div>";
							echo "</td>";
						
							echo "<td class='editVers' style='display: inline-block;margin-left:8px;'>";
							echo "    <div class='editVers menuButton'>";
              echo "      <img id='versionCog' class='navButt' title='Edit the selected version' onclick=showEditVersion(); src='../Shared/icons/CogwheelWhite.svg'>";
							echo "    </div>";
							echo "</td>";
					if(checklogin() && (isSuperUser($_SESSION['uid']) )) {			
							echo "<td class='newVers' style='display: inline-block;margin-right:16px;'>";
							echo "    <div class='newVers menuButton'>";
              echo "      <img id='versionPlus' value='New version' class='navButt' title='Create a new version of this course' onclick='showCreateVersion();' src='../Shared/icons/PlusS.svg'>";
							echo "    </div>";
							echo "</td>";						
					}
							echo "<td class='results' style='display: inline-block;'>";
							echo "    <div class='results menuButton'>";
							echo "    <a id='resultsBTN' title='Edit student results' value='Results' href='resulted.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >";
							echo "      <img id='versionPlus' class='navButt' src='../Shared/icons/marking_icon.svg'>";
							echo "    </a>";
							echo "    </div>";
							echo "</td>";
						
							echo "<td class='tests' style='display: inline-block;'>";
							echo "    <div class='tests menuButton'>";
							echo "      <a id='testsBTN' title='Show tests' value='Tests' href='duggaed.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >";
							echo "        <img id='testsBTN' class='navButt' src='../Shared/icons/test_icon.svg'>";
							echo "      </a>";
							echo "    </div>";
							echo "</td>";
						
							echo "<td class='files' style='display: inline-block;'>";
							echo "    <div class='files menuButton'>";
              echo "      <a id='filesBTN' title='Show files' value='Files' href='fileed.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >";
              echo "        <img class='navButt' src='../Shared/icons/files_icon.svg'>";
							echo "      </a>";
							echo "    </div>";
							echo "</td>";

							include_once "../Shared/database.php";
							pdoConnect();	

							//Get version name and coursecode from the correct version of the course
							$query = $pdo->prepare("SELECT versname, coursecode FROM vers WHERE cid=:cid AND vers=:vers");
							$query->bindParam(":cid", $_SESSION["courseid"]);
							$query->bindParam(':vers', $_SESSION['coursevers']);
							$query->execute();
							$result = $query->fetch(PDO::FETCH_ASSOC);

							//Need to check if the course has a version, if it does not the button should not be created
							if(isset($result['versname'])) {
								// Changes format from 'HT20' to numbers to create the URL
								$array = explode("T", $result['versname']);
								$year = "20";
								$year .= $array[1];
								if ($array[0] === "H") {
									$term = 2;
								} else if ($array[0] === "V") {
									$term = 1;
								}else if ($array[0] === "S") {
									$term = 3;
								}
	
								echo "<td class='coursePage' style='display: inline-block;'>";
								echo "    <div class='course menuButton'>";
								echo " 		<a href='https://personal.his.se/utbildning/kurs/?semester=".$year.$term."&coursecode=".$result['coursecode']."'>";
								echo "        <img id='courseIMG' value='Course' class='navButt' title='Course page for ".$result['coursecode']."' src='../Shared/icons/coursepage_button.svg'>";
								echo "		</a>";
								echo "    </div>";
								echo "</td>";
							}
						
							echo "<td class='access menuButton' style='display: inline-block;'>";
							echo "    <div class='access menuButton'>";
              echo "      <a id='accessBTN' title='Give students access to the selected version' value='Access' href='accessed.php?courseid=".$_SESSION['courseid']."&coursevers=".$_SESSION['coursevers']."' >";
              echo "        <img class='navButt' src='../Shared/icons/lock_symbol.svg'>";
							echo "      </a>";
							echo "    </div>";
							echo "</td>";
							echo "<input type='text' id='adminLoggedin' value='yes' style='display:none;'>";
					}
			}
	
			// Sort dialog - accessed / resulted /fileed
      if($requestedService=="accessed.php" || $requestedService=="resulted.php" ||$requestedService=="fileed.php" ){
					echo "<td id='testSearchContainer' class='navButt'>";

					if ($requestedService == "fileed.php")
						echo   "<form autocomplete='off'><input id='searchinput' readonly type='text' onmouseover='hoverSearch();' onmouseleave='leaveSearch();' name='search' placeholder='Search..' onkeyup='searchterm=this.value;sortAndFilterTogether();myTable.reRender();'/></form>";
					else
						echo   "<form autocomplete='off' display:'none'><input id='searchinput' readonly onmouseover='hoverSearch();' onmouseleave='leaveSearch();' name='search'  placeholder='Search..' onkeyup='searchterm=this.value;myTable.reRender();'/></form>";

					echo	"<div id='dropdownSearch' class='dropdown-list-container' style='z-index: 1; color: black;'>"; //Dropdown menu for when hovering the search bar
					if($requestedService=="accessed.php"){
						echo    "<p aria-live='polite'><b>Keywords:</b> Username, first/lastname, date <br> <b>Ex:</b> Webug13h, 2020-02-29 13:37</p>";
					}
					if($requestedService=="resulted.php"){
						echo    "<p aria-live='polite'><b>Keywords:</b> markG, markU, date <br> <b>Ex:</b> markG:färgdugga</p>";
					}
					if($requestedService=="fileed.php"){
						echo    "<p aria-live='polite'><b>Keywords:</b> File name, File type <br> <b>Ex:</b> html, example1</p>";
					}
					echo	"</div>";
					echo   "<div class='tooltipbackground'><div class='tooltipsearchbar'>";
					echo 	"<input id='tooltipsearchinput' type='text' onmouseover='hoverSearch();' onmouseleave='leaveSearch();' name='search'  placeholder='Search..' onkeyup='searchterm=this.value;myTable.reRender()'/>";
					echo 	"</div><div>";
					echo "</td>";
					echo "<td class='navButt'>";

					if ($requestedService == "fileed.php") 
						echo   "<button id='searchbutton' class='switchContent' onclick='searchterm=document.getElementById(\"searchinput\").value;myTable.reRender(); sortAndFilterTogether();' type='button'>";
					else
						echo   "<button id='searchbutton' class='switchContent' onclick='searchterm=document.getElementById(\"searchinput\").value;myTable.reRender();' type='button'>";

					echo     "<img id='lookingGlassSVG' style='height:18px;' src='../Shared/icons/LookingGlass.svg'/>";
					echo   "</button>";
					echo "</td>";
					if ($requestedService == "fileed.php" && (hasAccess($_SESSION["uid"], $_SESSION["courseid"], "w") || $_SESSION["superuser"] == 1)) {
						//Adds the download files button to the toolbar
						echo "<td class='navButt'>";
						echo "    <div>";
						echo "      <a id='downloadBTN' title='Download all content in a zip file' target='_blank' value='Download' href='downloadzip.php?courseid=".$_SESSION['courseid']."&coursevers=".$_SESSION['coursevers']."' >";
						echo "        <img class='navButt' src='../Shared/icons/Diskett.svg'>";
						echo "      </a>";
						echo "    </div>";
						echo "</td>";
					}				
			}

      if($requestedService=="accessed.php" || $requestedService=="resulted.php" ){
					echo "<td id='select' class='navButt' onmouseover='hoverc();' onmouseleave='leavec();'>";
					echo   "<span id='filterButton'>";
					echo     "<img class='navButt' src='../Shared/icons/filter_icon.svg'>";
					echo     "<div id='dropdownc' class='dropdown-list-container' style='z-index: 1'>";
					echo       "<div id='filterOptions'></div>"; 
					echo       "<div id='columnfilter'></div>";
					echo       "<div id='customfilter'></div>";                
					echo     "</div>";
					echo   "</span>";
					echo "</td>";	
			}
	
	    if($requestedService=="resulted.php" ){
					echo "<td id='sort' class='navButt' onmouseover='hovers();' onmouseleave='leaves();'>";
					echo   "<span id='sortButton'>";
					echo     "<img class='navButt' src='../Shared/icons/sort_white.svg'>";
					echo     "<div id='dropdowns' class='dropdown-list-container' style='z-index: 1'>";
					echo     "</div>";
					echo   "</span>";
					echo "</td>";
					echo "<td id='menuHook' class='navSpacer'>";
					echo "</td>";
			}
	
	
			// Either generate code viewer specific nav menu or a spacer
			if(isset($codeviewer)){
					echo "<td class='navButt' id='beforebutton' title='Previous example' onmousedown='Skip(\"bd\");' onmouseup='Skip(\"bu\");' onclick='Skip(\"b\");'><img src='../Shared/icons/backward_button.svg'></td>";
					echo "<td class='navButt' id='afterbutton' title='Next example' onmousedown='Skip(\"fd\");' onmouseup='Skip(\"fu\");' onclick='Skip(\"f\");'><img src='../Shared/icons/forward_button.svg' /></td>";
					echo "<td class='navButt' id='playbutton' title='Open demo' onclick='Play(event);'><img src='../Shared/icons/play_button.svg' /></td>";
					if(checklogin() && (isSuperUser($_SESSION['uid']) || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'st') || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'sv'))) {
						echo "<td class='navButt' id='templatebutton' title='Choose Template' onclick='openTemplateWindow();'><img src='../Shared/icons/choose_template.svg'  /></td>";
						echo "<td class='navButt' onclick='displayEditExample();' title='Example Settings' ><img src='../Shared/icons/general_settings_button.svg' /></td>";
					  echo "<td class='navButt' id='fileedButton' onclick='' style='display:none;' title='File Download/Upload' ><img src='../Shared/icons/files_icon.svg' /></td>";
					}
					echo "<td class='navButt' id='codeBurger' onclick='showBurgerMenu();' title='Show box' ><img src='../Shared/icons/hotdog_button.svg' /></td>";
					echo "<td class='navButt showmobile' style='display:none;'><a href='courseed.php'><img src='../Shared/icons/hotdog_button.svg'></a></td>";
					echo "<td id='navHeading' class='navHeading codeheader'>";
					echo "<span id='exampleSection'>Example Section : </span>";
					echo "<span id='exampleName'> Example Name</span>";
					echo "</td>";
				}
				else{
					
					echo "<td id='select' style='display:none;' class='navButt'  onmouseover='hoverc();' onmouseleave='leavec();'>";
					echo   "<span>";
					echo     "<img class='navButt' src='../Shared/icons/tratt_white.svg'>";
					echo     "<div id='dropdownc' class='dropdown-list-container' style='z-index: 1'>";
					echo     "<div id='filterOptions'></div>";
					echo     "</div>";
					echo   "</span>";
					echo "</td>";
					echo "<td id='sort' style='display:none' class='navButt' onmouseover='hovers();' onmouseleave='leaves();'>";
					echo   "<span>";
					echo     "<img class='navButt' src='../Shared/icons/sort_white.svg'>";
					echo     "<div id='dropdowns' class='dropdown-list-container' style='z-index: 1'>";
					echo     "</div>";
					echo   "</span>";
					echo "</td>";
					echo "</td>";
					echo "<td id='menuHook' class='navSpacer' >";
			}
	
			if(checklogin()) {
				echo "<td class='navName'><a id='userName' href='profile.php' title='".$_SESSION['loginname']."&#39;s profile'>".$_SESSION['loginname']."</a></td>";
				echo "<td id='loginbutton' class='loggedin'><img id='loginbuttonIcon' src='../Shared/icons/logout_button.svg' title='Logout'/></td>";
			}else{
				echo "<td class='navName'><label id='userName' title='Login to view your profile'>Guest</label></td>";
				echo "<td id='loginbutton' class='loggedout'><img id='loginbuttonIcon' src='../Shared/icons/login_button.svg' title='Login'/></td>";
			}

			echo "</tr></table>";
			if(isset($codeviewer)){
				echo "<div id='mobileNavHeading'><span id='mobileExampleSection'></span><span id='mobileExampleName'></span></div>";
			}
			//Cookie message
			echo "<div id='cookiemsg' class='alertmsg'><p>This site uses cookies. By continuing to browse this page you accept the use of cookies.</p><input type='button' value='OK' class='submit-button' onclick='cookieMessage()'/></div>";
	    ?>
</header>
<?php
	include '../Shared/logoutbox.php';
?>
<script type="text/javascript">
		if(localStorage.getItem("cookieMessage")=="off"){
			$("#cookiemsg").css("display", "none");
		}else{
			$("#cookiemsg").css("display", "flex");
		}
	setupLoginLogoutButton('<?PHP echo json_encode(checklogin()) ?>');
	function cookieMessage(){
		hideCookieMessage();
		localStorage.setItem("cookieMessage", "off");
	}
	function hoverBack(){
		$(".dropdown-list-container").css("display", "none");
	}

/*Shadow hover effect for home button START -------------*/
document.getElementById("homeIcon").addEventListener("mouseover", mouseOverHome);
document.getElementById("homeIcon").addEventListener("mouseout", mouseOutHome);

function mouseOverHome() {
	var obj = document.getElementById("homeIcon");
   if(obj != null)
   {
      var images = obj.getElementsByTagName('img');
      images[0].src = '../Shared/icons/HomeShadow.svg';
   }
}

function mouseOutHome() {
	var obj = document.getElementById("homeIcon");
   if(obj != null)
   {
      var images = obj.getElementsByTagName('img');
      images[0].src = '../Shared/icons/Home.svg';
   }
}
/*Shadow hover effect for home button END -------------*/


/*Shadow hover effect for back button START -------------*/
var backButton = document.getElementById("upIcon");
if(backButton){
	backButton.addEventListener("mouseover", mouseOverUp);
	backButton.addEventListener("mouseout", mouseOutUp);
}

function mouseOverUp() {
	var obj = document.getElementById("upIcon");
   if(obj != null)
   {
      var images = obj.getElementsByTagName('img');
      images[0].src = '../Shared/icons/UpShadow.svg';
   }
}

function mouseOutUp() {
	var obj = document.getElementById("upIcon");
   if(obj != null)
   {
      var images = obj.getElementsByTagName('img');
      images[0].src = '../Shared/icons/Up.svg';
   }
}

/*Shadow hover effect for back button END -------------*/


/*Shadow hover effect for filter button START -------------*/
var filterButton = document.getElementById("filterButton");
if(filterButton){
	filterButton.addEventListener("mouseover", mouseOverFilter);
	filterButton.addEventListener("mouseout", mouseOutFilter);
}

function mouseOverFilter() {
	var obj = document.getElementById("filterButton");
   if(obj != null)
   {
      var images = obj.getElementsByTagName('img');
      images[0].src = '../Shared/icons/filter_iconShadow.svg';
   }
}

function mouseOutFilter() {
	var obj = document.getElementById("filterButton");
   if(obj != null)
   {
      var images = obj.getElementsByTagName('img');
      images[0].src = '../Shared/icons/filter_icon.svg';
   }
}
/*Shadow hover effect for filter button END -------------*/

/*Shadow hover effect for sort button START -------------*/
var sortButton = document.getElementById("sortButton");
if(sortButton){
	sortButton.addEventListener("mouseover", mouseOverSort);
	sortButton.addEventListener("mouseout", mouseOutSort);
}

function mouseOverSort() {
	var obj = document.getElementById("sortButton");
   if(obj != null)
   {
      var images = obj.getElementsByTagName('img');
      images[0].src = '../Shared/icons/sort_whiteShadow.svg';
   }
}

function mouseOutSort() {
	var obj = document.getElementById("sortButton");
   if(obj != null)
   {
      var images = obj.getElementsByTagName('img');
      images[0].src = '../Shared/icons/sort_white.svg';
   }
}
/*Shadow hover effect for sort button END -------------*/

/*Shadow hover effect for announcement button START -------------*/
var annButton = document.getElementById("announcement");
if(annButton){
	annButton.addEventListener("mouseover", mouseOverAnnouncement);
	annButton.addEventListener("mouseout", mouseOutAnnouncement);
}

function mouseOverAnnouncement() {
	var obj = document.getElementById("announcement");
   if(obj != null)
   {
      var images = obj.getElementsByTagName('img');
      images[0].src = '../Shared/icons/announcement_iconShadow.svg';
   }
}

function mouseOutAnnouncement() {
	var obj = document.getElementById("announcement");
   if(obj != null)
   {
      var images = obj.getElementsByTagName('img');
      images[0].src = '../Shared/icons/announcement_icon.svg';
   }
}
/*Shadow hover effect for announcement button END -------------*/

/*Shadow hover effect for feedback button START ---------------*/
var feedButton = document.getElementById("feedback");
if(feedButton){
	feedButton.addEventListener("mouseover", mouseOverFeedback);
	feedButton.addEventListener("mouseout", mouseOutFeedback);
}

function mouseOverFeedback() {
	var obj = document.getElementById("feedback");
   if(obj != null)
   {
      var images = obj.getElementsByTagName('img');
      images[0].src = '../Shared/icons/feedback_iconShadow.svg';
   }
}

function mouseOutFeedback() {
	var obj = document.getElementById("feedback");
   if(obj != null)
   {
      var images = obj.getElementsByTagName('img');
      images[0].src = '../Shared/icons/feedback_icon.svg';
   }
}

/*Shadow hover effect for feedback button END ---------------*/

var searchinput = document.getElementById("searchinput");
if(searchinput){
	searchinput.addEventListener("mouseover", mouseOverSearchInput);
}

function mouseOverSearchInput() {
   var obj = document.getElementById("searchinput");
   if(obj != null)
   {
	obj.removeAttribute('readonly');
   }
}


/*Toggle the hamburger list containing the icons to appear*/
$('#hamburger').click(function(){	
	var isAnimating = $("#hamburgerList").is(':animated');
	if(isAnimating == false){
		$('#hamburgerList').slideToggle(500, function(){
		});
	}
})

/*Toggle the hamburger menu "button" into an X and then back to normal*/
function hamburgerToggle() {
	var isAnimating = $("#hamburgerList").is(':animated');
	if(isAnimating == false){
		var x= document.getElementById("ham")
		x.classList.toggle("change");
	}
}

</script>
<script type="text/javascript">
	(function(proxied) {
		window.alert = function() {
			return <?php echo checkLogin() && isSuperUser($_SESSION['uid']) ? "proxied.apply(this, arguments)" : "null" ?>;
		};
	})(window.alert);
</script>
