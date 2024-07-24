<?php
			if (isset($_GET['embed'])){
				echo "<header style='display:none;'>";
			}	else {
				echo "<header>";
			}		
?>
       <?php
			$requestedService = explode('?', $_SERVER['REQUEST_URI'], 2)[0];
			$requestedService = substr($requestedService,strrpos ( $requestedService , "/")+1);
			

			echo "<table class='navheader' id='navheader'><tr id='navbar'>";
			include_once "../Shared/basic.php";
			pdoConnect();

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

			//used for repository fetch cooldown
			global $pdo;
			$query = $pdo->prepare('SELECT updated, courseGitURL FROM course WHERE cid = :cid;');
			$query->bindParam(':cid', $_SESSION['courseid']);
			try{
				$query->execute();
			}
			catch(Exception $e){
				$query = $pdo->prepare('SELECT updated FROM course WHERE cid = :cid;');
				$query->bindParam(':cid', $_SESSION['courseid']);
				$query->execute();
			}
			
			// Add error handling for the execute function
			if (!$query->execute()) {
				$errorInfo = $query->errorInfo();
				echo "Database error: " . $errorInfo[2];
				exit;
			}
			
			$row = $query->fetch(PDO::FETCH_ASSOC);
			
			if ($row !== false) {
				// Now we know $row is an array and we can safely access its elements
				//$checkIfGithubURL = $row['courseGitURL'];
				if(isset($row['courseGitURL'])){
					$checkIfGithubURL = $row['courseGitURL'];
				} else {
					$checkIfGithubURL = null;
					// $row is false, which means no data was fetched
					$updateTime = "No data found for the given course ID";
				}
			}


				//Burger menu that Contains the home, back and darkmode icons when window is small; Only shown if not superuser.
				if(checklogin() == false|| $_SESSION['uid'] == 0 || (isStudentUser($_SESSION['uid']))){
					
					echo "<td class='navBurger fa fa-bars' id='navBurgerIcon' style='font-size:24px; width: 29px; vertical-align: middle; margin-top: 15px; margin-left: 15px' onclick='navBurgerChange()'</td>";
					echo "<td id='navBurgerIcon' style='display: none;'> </td>";
					echo "<div id='navBurgerBox' style='display: none;'>";
				
					echo "<div id='homeBurgerDiv'>";
					echo "<a id='homeBurger' href='../DuggaSys/courseed.php'>";
					echo "<img alt ='home' class='navBurgerButt' src='../Shared/icons/Home.svg'>";
					echo "<a/>";
					echo"</div>";
					
					echo "<div id='goBackBurgerDiv'>";
					if($noup=='COURSE'){
					echo "<a id='goBackBurger' href='../DuggaSys/courseed.php'>";
					}
					else if($noup=='SECTION'){
					echo "<a id='goBackBurger' href='";
					echo ($_SESSION['courseid'] != (string)"UNK" ? "../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers'] : "../DuggaSys/courseed.php");
					echo "'>";
					
					}
					echo "<img alt ='home' class='navBurgerButt' src='../Shared/icons/Up.svg'>";
					echo "</a>";
					echo"</div>";
					echo "<div id='darkModeBurgerDiv'>";
					echo "<a id='darkModeBurger' onclick = 'burgerToggleDarkmode()'  >";
					echo "<img alt ='Dark' class='navBurgerButt' src='../Shared/icons/ThemeToggle.svg'></>";
					echo "</a>";
					echo "</a>";
					echo"</div>";
					echo"</div>";					
				}
			
			// Always show home button which links to course homepage			
			// Home button original code <a id='homeIcon' class='navButt'><img alt='home button icon' src='../Shared/icons/Home.svg'></a>
			echo "<td class='navButt' id='home' title='Home' onclick='navigateToUrl(\"../DuggaSys/courseed.php\")'><div class='home-nav' tabindex='0'><img alt='home button icon' src='../Shared/icons/Home.svg'></div></td>";
			// Always show toggle button. When clicked it changes between dark and light mode.
			echo "<td class='navButt' id='theme-toggle'><div class='theme-toggle-nav' tabindex='0'><img src='../Shared/icons/ThemeToggle.svg' alt='an icon on a moon, which indicates dark mode and light mood'></div></td>";
			echo "<td class='navButt' style='display:none'; id='motdNav' title='Message of the day 'onclick='showServerMessage();'><div class='motd-nav' tabindex='0'><img alt='motd icon' src='../Shared/icons/MOTD.svg'></div></td>";
			// Generate different back buttons depending on which page is including
			// this file navheader file. The switch case uses ternary operators to
			// determine the href attribute value. (if(this) ? dothis : elsethis)
			// If the current page is the course editor, don't display the back button
			//---------------------------------------------------------------------

			if($noup!='NONE') {
				echo "<td class='navButt' id='back' title='Back'>";
			}
			if($noup=='CONTRIBUTION'){
				echo "<a id='upIcon' class='navButt' href='../DuggaSys/courseed.php'>";
				echo "<img alt='go back icon' src='../Shared/icons/Up.svg'></a></td>";
			}if($noup=='COURSE'){
				echo "<div><a id='upIcon' class='navButt' href='../DuggaSys/courseed.php'>";
				echo "<img alt='go back icon' src='../Shared/icons/Up.svg'></a></div></td>";
			}if($noup=='COURSE' && checklogin() && (isTeacher($_SESSION['uid']))){
				echo '<td class="hamburger fa fa-bars hamburgerMenu" id="hamburgerIcon" style="width: 29px; vertical-align: middle; margin-top: 15px;" onclick=hamburgerChange()>';
			}else if($noup=='SECTION'){
				echo "<a id='upIcon' href='";
				echo ($_SESSION['courseid'] != (string)"UNK" ? "../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers'] : "../DuggaSys/courseed.php");
				echo "'>";
				echo "<img alt='go back icon' src='../Shared/icons/Up.svg'></a></td>";
			}
			// Adding buttons for courses
			if($noup=='COURSE'){
					// Course specific navbar buttons moved from "static" to navheader
					if(checklogin() && (isSuperUser($_SESSION['uid']) || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'st') || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'w') || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'sv'))) {
						echo '<td class="hamburger fa fa-bars hamburgerMenu" id="hamburgerIcon" style="width: 29px; vertical-align: middle; margin-top: 15px;" onclick=hamburgerChange()>';
						echo "</td>";
						echo "<td id='courseVersionDropDown' title='Choose course version'>";
							echo "    <div class='course-dropdown-div'>";
							echo "      <select id='courseDropdownTop' class='course-dropdown' onchange='goToVersion(this)' ></select>";
							echo "    </div>";
							echo "</td>";

							echo "<td class='editVers' style='display: inline-block;margin-left:8px;'>";
							echo "    <div class='editVers menuButton' tabindex='0'>";
              echo "      <img alt='settings icon' id='versionCog' class='navButt' title='Edit the selected version' onclick=showEditVersion(); src='../Shared/icons/CogwheelWhite.svg'>";
							echo "    </div>";
							echo "</td>";

					if(checklogin() && (isSuperUser($_SESSION['uid']) )) {





							echo "<td class='newVers' style='display: inline-block;'>";
							echo "    <div class='newVers menuButton' tabindex='0'>";
              echo "      <img alt='plus sign icon' id='versionPlus' value='New version' class='navButt' title='Create a new version of this course' onclick='showCreateVersion();' src='../Shared/icons/PlusS.svg'>";
							echo "    </div>";
							echo "</td>";
					}
							echo "<td class='results' style='display: inline-block;'>";
							echo "    <div class='results menuButton'>";
							echo "    <a id='resultsBTN' title='Edit student results' value='Results' href='resulted.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >";
							echo "      <img alt='edit results icon' id='versionPlus' class='navButt' src='../Shared/icons/marking_icon.svg'>";
							echo "    </a>";
							echo "    </div>";
							echo "</td>";

							echo "<td class='tests' style='display: inline-block;'>";
							echo "    <div class='tests menuButton'>";
							echo "      <a id='testsBTN' title='Show tests' value='Tests' href='duggaed.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >";
							echo "        <img alt='show tests icon' id='testsBTN' class='navButt' src='../Shared/icons/test_icon.svg'>";
							echo "      </a>";
							echo "    </div>";
							echo "</td>";

							echo "<td class='files' style='display: inline-block;'>";
							echo "    <div class='files menuButton'>";
              echo "      <a id='filesBTN' title='Show files' value='Files' href='fileed.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >";
              echo "        <img alt='files icon' id='editFiles' class='navButt' src='../Shared/icons/files_icon.svg'>";
							echo "      </a>";
							echo "    </div>";
							echo "</td>";

							include_once "../Shared/database.php";
							pdoConnect();

							//Get version name and coursecode from the correct version of the course
							$query = $pdo->prepare("SELECT versname, coursecode, startdate FROM vers WHERE cid=:cid AND vers=:vers");
							$query->bindParam(":cid", $_SESSION["courseid"]);
							$query->bindParam(':vers', $_SESSION['coursevers']);
							$query->execute();
							$result = $query->fetch(PDO::FETCH_ASSOC);

							//Need to check if the course has a version, if it does not the button should not be created
							if(isset($result['versname'])) {
								// Changes format from 'HT20' to numbers to create the URL
								$array = explode('T', $result['versname'] ?? '');
								$array_1 = explode('-', $result['startdate'] ?? '');
        						$year = $array_1[0];

								if ($array[0] === "H") {
									$term = 2;
								} else if ($array[0] === "V") {
									$term = 1;
								}else if ($array[0] === "S") {
									$term = 3;
								}else {
									$term = 1;
								}

								echo "<td class='coursePage' style='display: inline-block;'>";
								echo "    <div class='course menuButton'>";
								echo " 		<a href='https://personal.his.se/utbildning/kurs/?semester=".$year.$term."&coursecode=".$result['coursecode']."' target='_blank'>";
								echo "        <img alt='course page icon' id='courseIMG' value='Course' class='navButt' title='Course page for ".$result['coursecode']."' src='../Shared/icons/coursepage_button.svg'>";
								echo "		</a>";
								echo "    </div>";
								echo "</td>";
							}

							echo "<td class='access' style='display: inline-block;'>";
							echo "    <div class='access menuButton'>";
            			    echo "      <a id='accessBTN' title='Give students access to the selected version' value='Access' href='accessed.php?courseid=".$_SESSION['courseid']."&coursevers=".$_SESSION['coursevers']."' >";
             				echo "        <img alt='give access icon' id='editCourse' class='navButt' src='../Shared/icons/lock_symbol.svg'>";
							echo "      </a>";
							echo "    </div>";
							echo "</td>";
							echo "<input type='text' id='adminLoggedin' value='yes' style='display:none;'>";

							// Refresh button for Github repo in nav
							echo "<td class='refresh' style='display: inline-block;'>";
							echo "<div class='refresh menuButton tooltip'>";
								echo "<span id='refreshBTN' value='Refresh' href='#'>";
									echo "<img alt='refresh icon' id='refreshIMG' class='navButt' onclick='refreshGithubRepo(".$_SESSION['courseid'].",".isSuperUser($_SESSION['uid']).");resetGitFetchTimer(".isSuperUser($_SESSION['uid']).")' src='../Shared/icons/gitrefresh.svg'>";
								echo "</span>";

								//Check if user is super user
								if(isSuperUser($_SESSION['uid']))
								{
									//5 min for super users
									$fetchCooldownTimmer=300;
								}
								else
								{
									//10 min for normal users
									$fetchCooldownTimmer=600;
								}
								
								$fetchCooldownS=strtotime($updateTime)+$fetchCooldownTimmer-time();
								
								echo "<span class='tooltiptext'><b>Last Fetch:</b> ".$updateTime."<br><div id='cooldownHolder' style='display:inline'><b>Cooldown: </b>";

								//set cooldown timer
								if($fetchCooldownS>0)
								{
									echo "<p id='gitFetchMin' style='display:inline'>".intval(date("i",$fetchCooldownS))."</p>min and <p id='gitFetchSec' style='display:inline'>".intval(date("s",$fetchCooldownS))."</p>s";
								}
								else
								{
									echo "<p id='gitFetchMin' style='display:inline'>0</p>min and <p id='gitFetchSec' style='display:inline'>0</p>s";
								}
								
								echo "</p></span>";

								// echo "<span class='tooltiptext'><b>Last Fetch:</b> <br><b>Cooldown:</b> </span>";
							echo "</div>";
							echo "</td>";

							//Dropdown Menu For Teachers
							echo "<div id='hamburgerBox'>";
							echo "<div id='announcementBurger'><img alt='announcement icon'  class='burgerButt' src='../Shared/icons/new_announcement_iconShadow.svg'><p class='burgerHover'>Announcements</p></div>";

							echo "<div id='versionCogBurger' onclick=showEditVersion();><img alt='settings icon'  class='burgerButt' title='Edit the selected version'  src='../Shared/icons/CogwheelWhite.svg'><p  class='burgerHover'>Edit selected version</p></div>";

							echo "<div id='versionPlusBurger' onclick='showCreateVersion();'><img alt='plus sign icon' value='New version' class='burgerButt' title='Create a new version of this course'  src='../Shared/icons/PlusS.svg'><p  class='burgerHover'>Create new courseversion</p></div>";

							echo "<div id='editStudentBurger'>";
							echo "<a id='resultsBTNBurger' class ='burgerButt' title='Edit student results' value='Results' href='resulted.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >";
							echo "<img alt='edit results icon'  class='burgerButt' src='../Shared/icons/marking_icon.svg'>";
							echo "</a>";
							echo "<a class='burgerButtText' href='resulted.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."'>Edit student results</a></div>";

							echo "<div id='testsBTNBurger'>";
							echo "<a id='testsBTNBurger' title='Show tests' class = 'burgerButt' value='Tests' href='duggaed.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >";
							echo "<img alt='show tests icon'  class='burgerButt' src='../Shared/icons/test_icon.svg'>";
							echo "</a>";
							echo "<a class='burgerButtText' href='duggaed.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >Show tests</a></div>";

							echo "<div id='editFilesBurger'>";
							echo "<a id='filesBTN' title='Show files' value='Files' href='fileed.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >";
							echo "<img alt='files icon'  class='burgerButt' src='../Shared/icons/files_icon.svg'>";
							echo "</a>";
							echo "<a class='burgerButtText' href='fileed.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >Show files</a></div>";

							////Need to check if the course has a version, if it does not the button in the hamburger menu should not be created
							if(isset($result['versname'])) {
								echo "<div id='courseIMGBurger'>";
								echo "<a href='https://personal.his.se/utbildning/kurs/?semester=".$year.$term."&coursecode=".$result['coursecode']."'>";
								echo "<img alt='course page icon'  value='Course' class='burgerButt' title='Course page for 343' src='../Shared/icons/coursepage_button.svg'>";
								echo "</a>";
								echo "<a class='burgerButtText' href='https://personal.his.se/utbildning/kurs/?semester=".$year.$term."&coursecode=".$result['coursecode']."'>Course page</a></div>";
							}
							echo "<div id='editCourseBurger'>";
            			    echo "<a id='accessBTN' title='Give students access to the selected version' value='Access' href='accessed.php?courseid=".$_SESSION['courseid']."&coursevers=".$_SESSION['coursevers']."' >";
							echo "<img alt='give access icon'  class='burgerButt' src='../Shared/icons/lock_symbol.svg'>";
							echo "</a>";
							echo "<a class='burgerButtText' href='accessed.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >Change student access</a></div>";

							// Refresh button for Github repo in hamburger menu
							echo "<div id='refreshBurger' onclick='refreshGithubRepo(".$_SESSION['courseid'].");' style ='cursor:pointer;'>";
            	echo "<span id='refreshBTN' title='Download Github Repo' value='Refresh' href='#'>";
							echo "<img alt='refresh icon'  class='burgerButt refreshBurgerIMG' src='../Shared/icons/gitrefresh.svg'>";
							echo "</span";
							echo "<a class='burgerButtText' href='#' >Download github repo</a></div>";
					
							//Adding home button to the teacher burger menu
							echo "<div id='homeBurgerTeacher'>";
							echo "<a id='homeBurgerT' href='../DuggaSys/courseed.php'>";
							echo "<img alt ='home' class='burgerButt' src='../Shared/icons/Home.svg'>";
							echo "<a class = 'burgerButtText' href='../DuggaSys/courseed.php'>Home Page </a>";
							echo"</div>";
							echo "<a/>";
							
							//Adding return button to the teacher burger menu
							echo "<div id='goBackBurgerTeacher'>";
							if($noup=='COURSE'){
								echo "<a id='goBackBurgeTr' href='../DuggaSys/courseed.php'>";
								echo "<img alt ='home' class='burgerButt' src='../Shared/icons/Up.svg'>";
								echo "<a class = 'burgerButtText' href='../DuggaSys/courseed.php'> Return </a>";
								}
							else if($noup=='SECTION'){
								echo "<a id='goBackBurgerT' href='";
								echo ($_SESSION['courseid'] != (string)"UNK" ? "../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers'] : "../DuggaSys/courseed.php");
								echo "'>";
								echo "<img alt ='home' class='burgerButt' src='../Shared/icons/Up.svg'>";
								echo "<a class = 'burgerButtText'";
								echo ($_SESSION['courseid'] != (string)"UNK" ? "../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers'] : "../DuggaSys/courseed.php");
								echo " > Return </a>";
								}
							echo "</a>";
							echo"</div>";
							
							//Adding dark mode button to the teacher burger menu
							echo "<div id='darkModeBurgerTeacher'>";
							echo "<a id='darkModeBurgerT' onclick = 'burgerToggleDarkmode()'>";
							echo "<img alt ='Dark' class='burgerButt' src='../Shared/icons/ThemeToggle.svg'></>";
							// not working yet
							echo "<a class = 'burgerButtText'onclick = 'burgerToggleDarkmode()'> Change Theme </a>";
							echo "</a>";
							echo "</a>";
							echo"</div>";
							echo"</div>";
					}
			}			
			// Sort dialog - accessed / resulted /fileed					
			//old search bar for resulted
      if($requestedService=="accessed.php" /*|| $requestedService=="resulted.php"*/ || $requestedService=="fileed.php" || $requestedService=="duggaed.php" ){
					echo "<td id='testSearchContainer' class='navButt'>";

					if ($requestedService == "fileed.php")
						echo   "<form onsubmit='event.preventDefault()' autocomplete='off'><input id='searchinput' readonly type='text' onmouseover='hoverSearch();' onmouseleave='leaveSearch();' name='search' placeholder='Search..' onkeyup='searchterm=this.value;sortAndFilterTogether();myTable.reRender();'/></form>";
					else
						echo   "<form onsubmit='event.preventDefault()' autocomplete='off' display:'none'><input id='searchinput' readonly onmouseover='hoverSearch();' onmouseleave='leaveSearch();' name='search'  placeholder='Search..' onkeyup='searchterm=this.value;myTable.reRender();'/></form>";

					echo	"<div id='dropdownSearch' class='dropdown-list-container' '>"; //Dropdown menu for when hovering the search bar
					if($requestedService=="accessed.php"){
						echo    "<p aria-live='polite'><b>Keywords:</b> Username, first/lastname, date <br> <b>Ex:</b> Webug13h, 2020-02-29 13:37</p>";
					}
					if($requestedService=="duggaed.php"){
						echo    "<p aria-live='polite'><b>Keywords:</b> template name, name, date <br> <b>Ex:</b> color-dugga</p>";
					}
					//old search bar for resulted
					/*if($requestedService=="resulted.php"){
						echo    "<p aria-live='polite'><b>Keywords:</b> markG, markU, date <br> <b>Ex:</b> markG:färgdugga</p>";
					}*/
					if($requestedService=="fileed.php"){
						echo    "<p aria-live='polite'><b>Keywords:</b> File name, File type <br> <b>Ex:</b> html, example1</p>";
					}
					echo	"</div>";
					echo   "<div class='tooltipbackground'><div class='tooltipsearchbar'>";
					echo 	"<input id='tooltipsearchinput' type='text' onmouseover='hoverSearch();' onmouseleave='leaveSearch();' name='search'  placeholder='Search..' onkeyup='searchterm=this.value;myTable.reRender()'/>";
					echo 	"</div><div>";
					echo "</td>";
					echo "<td class='navButt' id='searchNavButt'>";

					if ($requestedService == "fileed.php")
						echo   "<button id='searchbutton' class='switchContent' type='button'>";
					else
						echo   "<button id='searchbutton' class='switchContent' onclick='searchterm=document.getElementById(\"searchinput\").value;myTable.reRender();' type='button'>";

					echo     "<img alt='search icon' id='lookingGlassSVG' style='height:25px;' src='../Shared/icons/LookingGlass.svg'/>";
					echo   "</button>";
					echo "</td>";
					if ($requestedService == "fileed.php" && (hasAccess($_SESSION["uid"], $_SESSION["courseid"], "w") || $_SESSION["superuser"] == 1)) {
						//Adds the download files button to the toolbar
						echo "<td class='navButt'>";
						echo "    <div>";
						echo "      <a id='downloadBTN' title='Download all content in a zip file' target='_blank' value='Download' href='downloadzip.php?courseid=".$_SESSION['courseid']."&coursevers=".$_SESSION['coursevers']."' >";
						echo "        <img alt='download all icon' id='downloadButt' src='../Shared/icons/file_download_white.svg'>";
						echo "      </a>";
						echo "    </div>";
						echo "</td>";
					}
			}

      if($requestedService=="accessed.php"){
					echo "<td id='select' class='navButt'>";
					echo   "<span id='filterButton'>";
					echo     "<img alt='filter icon' class='navButt' src='../Shared/icons/filter_icon.svg'>";
					echo     "<div id='dropdownc' class='dropdown-list-container' style='z-index: 1'>";
					echo       "<div id='filterOptions'></div>";
					echo       "<div id='columnfilter'></div>";
					echo       "<div id='customfilter'></div>";
					echo     "</div>";
					echo   "</span>";
					echo "</td>";
			}

			// Either generate code viewer specific nav menu or a spacer
			if(isset($codeviewer)){
					echo "<td class='navButt' id='beforebutton' title='Previous example' onmousedown='Skip(\"bd\");' onmouseup='Skip(\"bu\");' onclick='Skip(\"b\");'ontouchstart='Skip(\"bd\");' ontouchend='Skip(\"bu\");'><img src='../Shared/icons/backward_button.svg'></td>";
					echo "<td class='navButt' id='afterbutton' title='Next example' onmousedown='Skip(\"fd\");' onmouseup='Skip(\"fu\");' onclick='Skip(\"f\");' ontouchstart='Skip(\"fd\");' ontouchend='Skip(\"fu\");'><img src='../Shared/icons/forward_button.svg' /></td>";
					echo "<td class='navButt' id='playbutton' title='Open demo' onclick='Play(event);'><img src='../Shared/icons/play_button.svg' /></td>";
					if(checklogin() && (isSuperUser($_SESSION['uid']) || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'st') || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'sv') || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'w'))) {
						echo "<td class='navButt' id='templatebutton' title='Choose Template' onclick='openTemplateWindow();'><img src='../Shared/icons/choose_template.svg'  /></td>";
						echo "<td class='navButt' id='editbutton' onclick='displayEditExample();' title='Example Settings' ><img src='../Shared/icons/general_settings_button.svg' /></td>";
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

			if($noup=='CONTRIBUTION' && (checkLogin() || git_checkLogin()))
			{
				if(checkLogin())
				{
					echo "<td class='navName' id='navName'><a id='userName' href='profile.php' title='".$_SESSION['loginname']."&#39;s profile'>".$_SESSION['loginname']."</a></td>";
				}
				else if (git_checkLogin())
				{
					echo "<td class='navName' id='navName'><a id='userName' href='profile.php' title='".$_SESSION['git_loginname']."&#39;s profile'>".$_SESSION['git_loginname']."</a></td>";
				}
				echo "<td id='loginbutton' class='loggedin' onclick='git_showLogoutPopup();'><img alt='logout icon' id='loginbuttonIcon' src='../Shared/icons/logout_button.svg' title='Logout'/></td>";
			}
			else if(checklogin()) 
			{
				echo "<td class='navName' id='navName'><a id='userName' href='profile.php' title='".$_SESSION['loginname']."&#39;s profile'>".$_SESSION['loginname']."</a></td>";
			
					echo "<td id='loginbutton' class='loggedin' onclick='showLogoutPopup();'><div class='loginbutton-nav' tabindex='0'><img alt='logout icon' id='loginbuttonIcon' src='../Shared/icons/logout_button.svg' title='Logout'/></div></td>";
				
			}
			else
			{
				//---  original --- echo "<td class='navName' id='navName'><label id='userName' title='Login to view your profile'>Guest</label></td>";
				echo "<td class='navName' id='navName'><label id='userName' title='Login to view your profile'></label></td>";
				
				// --- original --- echo "<td id='loginbutton' class='loggedout' onclick='showLoginPopup();'><img alt='login icon' id='loginbuttonIcon' src='../Shared/icons/login_button.svg' title='Login'/></td>";
				echo "<td id='loginbutton' class='loggedout' onclick='showLoginPopup();'><div class='loginbutton-nav' tabindex='0'>Login</div></td>";
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
			if (isset($_GET['embed'])){
				echo "<div style='display:none;'></div>";
			}	else {
				echo "<div style='height:50px;'></div>";
			}		
?>
<div id="overlay" style="display: none;"></div>
<div id='logoutBox' class="logoutBoxContainer" style="display: none">
	<div id='logout' class="logoutBox DarkModeBackgrounds DarkModeText">
		<div class='logoutBoxheader'>
			<h3>Sign out</h3>
			<div class="cursorPointer" onclick="$('#logoutBox').hide();" title="Close window">x</div>
		</div>
		<form action="" id="logoutForm" method="post">
			<div>
				<p>Are you sure you want to log out?</p>
			</div>
			<table class="logoutBoxTable">
				<tr class="logoutboxTr">
					<td>
						<input type='button' class='buttonLogoutBox' onclick='processLogout();' value='Log out' title='Log out'>
					</td>
					<td>
						<input type='button' class='buttonLogoutBox buttonLogoutCancelBox' onclick="$('#logoutBox').hide();" value='Cancel' title='CancelLogout'>
					</td>						
				</tr>
			</table>
		</form>
	</div>
</div>
<script type="text/javascript">
	// Checks if a logout request has been made on ANY other instance
	window.addEventListener('storage', function(event){
		if (event.key == 'logout-event') { 
			processLogout();
			localStorage.removeItem("logout-event");
		}
	}, {once: true});

		if(localStorage.getItem("ls-cookie-message")=="off"){
			$("#cookiemsg").css("display", "none");
		}else{
			$("#cookiemsg").css("display", "flex");
		}
	function cookieMessage(){
		hideCookieMessage();
		localStorage.setItem("ls-cookie-message", "off");
	}
	function hoverBack(){
		$(".dropdown-list-container").css("display", "none");
	}

function mouseOverHome() {
	var obj = document.getElementById("homeIcon");
   if(obj != null)
   {
      var images = obj.getElementsByTagName('img');
      images[0].src = '../Shared/icons/Home.svg';
   }
}

function navigateToUrl(url){
	window.location.assign(url);
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


/*Shadow hover effect for announcement button END -------------*/


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

//count down the fetch cooldown
let gitFetchCooldownMin, gitFetchCooldownSec, cooldownHolder;

document.addEventListener("DOMContentLoaded", function() {
	const gitFetchCooldownMin = document.getElementById("gitFetchMin");
	const gitFetchCooldownSec = document.getElementById("gitFetchSec");
	const cooldownHolder = document.getElementById("cooldownHolder");

	if (gitFetchCooldownMin && gitFetchCooldownSec) { // Check if elements exist
		setInterval(
			function() 
			{
				if(gitFetchCooldownSec.innerHTML>0 || gitFetchCooldownMin.innerHTML>0)
				{
					gitFetchCooldownSec.innerHTML-=1;
					if(gitFetchCooldownSec.innerHTML<0)
					{
						gitFetchCooldownMin.innerHTML-=1;
						gitFetchCooldownSec.innerHTML=59;
					}
					
				}
				else
				{
					cooldownHolder.style.display="none";
				}
			}, 1000);
		}
	});

function resetGitFetchTimer(superuser)
{
	if(cooldownHolder.style.display=="none"){
		cooldownHolder.style.display="block";
		if(superuser==1)
		{
			gitFetchCooldownMin.innerHTML=4;
			gitFetchCooldownSec.innerHTML=59;
		}
		else
		{
			gitFetchCooldownMin.innerHTML=9;
			gitFetchCooldownSec.innerHTML=59;
		}
	}
}

</script>
<script type="text/javascript">
	(function(proxied) {
		window.alert = function() {
			return <?php echo checkLogin() && isSuperUser($_SESSION['uid']) ? "proxied.apply(this, arguments)" : "null" ?>;
		};
	})(window.alert);



// In this part we enter the Embedded link
var canvasEmbedded = "canvas.his.se";// HOSTNAME for the Embedded Canvas
    //We call the function RemoveNavEmbedded if variable = HOSTNAME
    if (canvasEmbedded == window.location.hostname){
                RemoveNavEmbedded();
        }
        // Display none header
        function RemoveNavEmbedded() {
                $("header").css('display', 'none');
        }



</script>
