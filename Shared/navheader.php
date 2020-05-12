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
  				echo "      <a id='accessBTN' title='Visit the analytics page' value='Analytics' href='analytic.php'>";
  				echo "        <img class='navButt' src='../Shared/icons/analytic.svg'>";
				echo "      </a>";
				echo "    </div>";
				echo "</td>";
			} else if($requestedService == "analytic.php") {
				echo '<td class="navButt" id="home" title="Back"><a id="upIcon" class="navButt internal-link" href="../DuggaSys/courseed.php"><img src="../Shared/icons/Up.svg"></a></td>';
				echo '<td class="navButt" id="GeneralStats" title="General Stats"><a onclick="loadGeneralStats()"><i class="fas fa-stream faNavheader"></i></a></td>';
				// echo '<td class="navButt" id="CurrentlyOnline" title="Currently Online"><a onclick="loadCurrentlyOnline()"><i class="fas fa-users faNavheader"></i></a></td>';
				echo '<td class="navButt" id="PasswordGuessing" title="Password guessing"><a onclick="loadPasswordGuessing()"><i class="fas fa-key faNavheader"></i></a></td>';
				echo '<td class="navButt" id="OSPercentage" title="OS Percentage"><a onclick="loadOsPercentage()"><i class="fas fa-laptop faNavheader"></i></a></td>';
				echo '<td class="navButt" id="Browserpercentage" title="Browser percentage"><a onclick="loadBrowserPercentage()"><i class="fa fa-chrome faNavheader"></i></a></td>';
				echo '<td class="navButt" id="Serviceusage" title="Service usage"><a onclick="loadServiceUsage()"><i class="fas fa-chart-line faNavheader"></i></a></td>';
				echo '<td class="navButt" id="Servicespeed" title="Service speed"><a onclick="loadServiceAvgDuration()"><i class="fas fa-tachometer-alt faNavheader"></i></a></td>';
				echo '<td class="navButt" id="Servicecrashes" title="Service crashes"><a onclick="loadServiceCrashes()"><i class="fas fa-car-crash faNavheader"></i></a></td>';
				echo '<td class="navButt" id="Fileinformation" title="File information"><a onclick="loadFileInformation()"><i class="fas fa-file-pdf faNavheader"></i></a></td>';
				echo '<td class="navButt" id="Pageinformation" title="Page information"><a onclick="loadPageInformation()"><i class="fas fa-globe-europe faNavheader"></i></a></td>';
			}

			if($noup!='NONE') {
				  echo "<td class='navButt' id='announcement' title='Announcement'><img src='../Shared/icons/announcement_icon.svg'></td>";
				  echo "<td class='navButt' id='back' title='Back'>";
			}
			if($noup=='COURSE'){
					echo "<a id='upIcon' class='navButt' href='../DuggaSys/courseed.php'>";
					echo "<img src='../Shared/icons/Up.svg'></a></td>";
			}else if($noup=='SECTION'){
					echo "<a href='";
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
							
							echo "<td class='newVers' style='display: inline-block;margin-right:16px;'>";
							echo "    <div class='newVers menuButton'>";
              echo "      <img id='versionPlus' value='New version' class='navButt' title='Create a new version of this course' onclick='showCreateVersion();' src='../Shared/icons/PlusS.svg'>";
							echo "    </div>";
							echo "</td>";						
					
							echo "<td class='results' style='display: inline-block;'>";
							echo "    <div class='results menuButton'>";
							echo "    <a id='resultsBTN' title='Edit student results' value='Results' href='resulted.php?courseid=".$_SESSION['courseid']."&coursevers=".$_SESSION['coursevers']."' >";
							echo "      <img id='versionPlus' class='navButt' src='../Shared/icons/marking_icon.svg'>";
							echo "    </a>";
							echo "    </div>";
							echo "</td>";
						
							echo "<td class='tests' style='display: inline-block;'>";
							echo "    <div class='tests menuButton'>";
							echo "      <a id='testsBTN' title='Show tests' value='Tests' href='duggaed.php?courseid=".$_SESSION['courseid']."&coursevers=".$_SESSION['coursevers']."' >";
							echo "        <img id='testsBTN' class='navButt' src='../Shared/icons/test_icon.svg'>";
							echo "      </a>";
							echo "    </div>";
							echo "</td>";
						
							echo "<td class='files' style='display: inline-block;'>";
							echo "    <div class='files menuButton'>";
              echo "      <a id='filesBTN' title='Show files' value='Files' href='fileed.php?courseid=".$_SESSION['courseid']."&coursevers=".$_SESSION['coursevers']."' >";
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
						echo   "<input id='searchinput' type='text' onmouseover='hoverSearch();' onmouseleave='leaveSearch();' name='search'  placeholder='Search..' onkeyup='searchterm=this.value;myTable.reRender();sortAndFilterTogether();'/>";
					else
						echo   "<input id='searchinput' type='text' onmouseover='hoverSearch();' onmouseleave='leaveSearch();' name='search'  placeholder='Search..' onkeyup='searchterm=this.value;myTable.reRender();'/>";

					echo	"<div id='dropdownSearch' class='dropdown-list-container' style='z-index: 1; color: black;'>"; //Dropdown menu for when hovering the search bar
					echo    "<p aria-live='polite'><b>Keywords:</b> markG, markU, date <br> <b>Ex:</b> markG:färgdugga</p>";
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
				}else{
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
/*Shadow hover effect for sort button END -------------*/

</script>
<script type="text/javascript">
	(function(proxied) {
		window.alert = function() {
			return <?php echo checkLogin() && isSuperUser($_SESSION['uid']) ? "proxied.apply(this, arguments)" : "null" ?>;
		};
	})(window.alert);
</script>