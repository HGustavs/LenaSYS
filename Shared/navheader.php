<?php
			if (isset($_GET['embed'])){
				echo "<header class='navheader' style='display:none;'>";
			}	else {
				echo "<header class='navheader'>";
			}		
?>
       <?php
			$requestedService = explode('?', $_SERVER['REQUEST_URI'], 2)[0];
			$requestedService = substr($requestedService,strrpos ( $requestedService , "/")+1);
			
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
				}
				if(isset($row['updated'])) {
					$updateTime = $row['updated'];
				} 
				else {
					$updateTime = "No data found for the given course ID";
				}
			} 
			else {
				$checkIfGithubURL = null;
				$updateTime = "No data found for the given course ID";
			}

			echo "<nav>";
			echo "<ul>";
			//Burger menu that Contains the home, back and darkmode icons when window is small; Only shown if not superuser.
			//Always on courseed.php ($noup is none). Contains only home and darkmode icons.
			if(checklogin() == false|| $_SESSION['uid'] == 0 || (isStudentUser($_SESSION['uid'])) || $noup=='NONE'){
				if (isset($courseed)) {
					echo "<li class='navBurgerIcon fa fa-bars' onclick='navBurgerChange()'></li>";
					echo "<li class='navBurgerIcon'> </li>";
					echo "<div id='navBurgerBox' style='display: none;'>";
					echo "	<div id='motdDiv' class='navButt' onclick='showServerMessage();' >";
					echo "		<a id='motdBurger'>";
					echo "			<img alt='motd' class='navBurgerButt' src='../Shared/icons/MOTD.svg'>";
					echo "		</a>";
					echo "	</div>";

					echo "	<div id='homeBurgerDiv'>";
					echo "		<a id='homeBurger' href='../DuggaSys/courseed.php'>";
					echo "			<img alt ='home' class='navBurgerButt' src='../Shared/icons/Home.svg'>";
					echo "		</a>";
					echo "	</div>";
				
					echo "<div id='goBackBurgerDiv'>";
					// Code to not show the "go-back" button in courseed.php.
					if($noup=='NONE'){
						echo "<a id='goBackBurger'style='display: none;'>";
					}
					if($noup=='COURSE'){
						echo "<a id='goBackBurger' href='../DuggaSys/courseed.php'>";
					}
					else if($noup=='SECTION'){
						echo "<a id='goBackBurger' href='";
						echo ($_SESSION['courseid'] != (string)"UNK" ? "../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers'] : "../DuggaSys/courseed.php");
						echo "'>";
					}
					echo "				<img alt ='home' class='navBurgerButt' src='../Shared/icons/Up.svg'>";
					echo "			</a>";
					echo "		</div>";
					echo "	<div id='darkModeBurgerDiv'>";
					echo "		<a id='darkModeBurger' onclick = 'burgerToggleDarkmode()'  >";
					echo "			<img alt ='Dark' class='navBurgerButt' title='Toggle between dark mode' src='../Shared/icons/ThemeToggle.svg'></>";
					echo "		</a>";
					echo "	</a>";
					echo "</div>";
					echo"</div>"; 
				} 
				else {
					//Display default tools/buttons of burger dropdown menu, search(ctrl + f) for "Burger dropdown menu show dugga" 
					echo "<li class='navBurgerIcon fa fa-bars' onclick='navBurgerChange()'></li>";
					echo "<li class='navBurgerIcon'> </li>";
				}
			}
			
			// Always show home button which links to course homepage			
			// Home button original code <a id='homeIcon' class='navButt'><img alt='home button icon' src='../Shared/icons/Home.svg'></a>
			echo "<li class='navButt' id='home' title='Home' onclick='navigateToUrl(\"../DuggaSys/courseed.php\")'>
					<div class='home-nav' tabindex='0'>
						<img alt='home button icon' src='../Shared/icons/Home.svg'>
					</div>
				</li>";
			// Always show toggle button. When clicked it changes between dark and light mode.
			echo "<li class='navButt' id='theme-toggle'>
					<div class='theme-toggle-nav' tabindex='0'>
						<img src='../Shared/icons/ThemeToggle.svg' title='Toggle between dark mode' alt='an icon on a moon, which indicates dark mode and light mood'>
					</div>
				</li>";
			
				
			// Generate different back buttons depending on which page is including
			// this file navheader file. The switch case uses ternary operators to
			// determine the href attribute value. (if(this) ? dothis : elsethis)
			// If the current page is the course editor, don't display the back button
			//---------------------------------------------------------------------

			if($noup!='NONE') {
				echo "<li class='navButt' id='back' title='Back'>";
			}
			if($noup=='CONTRIBUTION'){
				echo "<a id='upIcon' class='navButt' href='../DuggaSys/courseed.php'>";
				echo "<img alt='go back icon' src='../Shared/icons/Up.svg'></a></li>";
			}if($noup=='COURSE'){
				echo "<div><a id='upIcon' class='navButt' href='../DuggaSys/courseed.php'>";
				echo "<img alt='go back icon' src='../Shared/icons/Up.svg'></a></div></li>";
			}if($noup=='COURSE' && checklogin() && (isTeacher($_SESSION['uid']))){
				echo '<li class="hamburger fa fa-bars hamburgerMenu" id="hamburgerIcon" onclick=hamburgerChange()>';
			}else if($noup=='SECTION'){
				echo "<a id='upIcon' href='";
				echo ($_SESSION['courseid'] != (string)"UNK" ? "../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers'] : "../DuggaSys/courseed.php");
				echo "'>";
				echo "<img alt='go back icon' src='../Shared/icons/Up.svg'></a></li>";
			}

			echo "</ul>";
			echo "</nav>";
			echo "<ul>";

			echo "<li class='navButt' style='display:none;' id='motdNav' title='Message of the day 'onclick='showServerMessage();'>
					<div class='motd-nav' tabindex='0'>
						<img alt='motd icon' src='../Shared/icons/MOTD.svg'>
					</div>
				</li>";
			// Adding buttons for courses
			if($noup=='COURSE'){
					// Course specific navbar buttons moved from "static" to navheader
					if(checklogin() && (isSuperUser($_SESSION['uid']) || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'st') || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'w') || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'sv'))) {
						echo '<button class="hamburger fa fa-bars hamburgerMenu" id="hamburgerIcon" onclick=hamburgerChange()>';
						echo "</button>";
						echo "<li id='courseVersionDropDown' title='Choose course version'>";
							echo "    <div class='course-dropdown-div'>";
							echo "      <select id='courseDropdownTop' class='course-dropdown' onchange='goToVersion(this)' ></select>";
							echo "    </div>";
							echo "</li>";

							echo "<li class='editVers'>";
							echo "    <div class='editVers menuButton' tabindex='0'>";
             				echo "      <img alt='settings icon' id='versionCog' class='navButt' title='Edit the selected version' onclick=showEditVersion(); src='../Shared/icons/CogwheelWhite.svg'>";
							echo "    </div>";
							echo "</li>";

					if(checklogin() && (isSuperUser($_SESSION['uid']) )) {

							echo "<li class='newVers'>";
							echo "    <div class='newVers menuButton' tabindex='0'>";
              				echo "      <img alt='plus sign icon' id='versionPlus' value='New version' class='navButt' title='Create a new version of this course' onclick='showCreateVersion();' src='../Shared/icons/PlusS.svg'>";
							echo "    </div>";
							echo "</li>";
					}
							echo "<li class='results'>";
							echo "    <div class='results menuButton'>";
							echo "    <a id='resultsBTN' title='Edit student results' value='Results' href='resulted.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >";
							echo "      <img alt='edit results icon' id='versionPlus' class='navButt' src='../Shared/icons/marking_icon.svg'>";
							echo "    </a>";
							echo "    </div>";
							echo "</li>";

							echo "<li class='tests'>";
							echo "    <div class='tests menuButton'>";
							echo "      <a id='testsBTN' title='Show tests' value='Tests' href='duggaed.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >";
							echo "        <img alt='show tests icon' id='testsBTN' class='navButt' src='../Shared/icons/test_icon.svg'>";
							echo "      </a>";
							echo "    </div>";
							echo "</li>";

							echo "<li class='files'>";
							echo "    <div class='files menuButton'>";
             				echo "      <a id='filesBTN' title='Show files' value='Files' href='fileed.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."' >";
              				echo "        <img alt='files icon' id='editFiles' class='navButt' src='../Shared/icons/files_icon.svg'>";
							echo "      </a>";
							echo "    </div>";
							echo "</li>";

							include_once "../Shared/database.php";
							pdoConnect();

							//Get version name and coursecode from the correct version of the course
							global $pdo;
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

								echo "<li class='coursePage'>";
								echo "    <div class='course menuButton'>";
								echo " 		<a href='https://personal.his.se/utbildning/kurs/?semester=".$year.$term."&coursecode=".$result['coursecode']."' target='_blank'>";
								echo "        <img alt='course page icon' id='courseIMG' value='Course' class='navButt' title='Course page for ".$result['coursecode']."' src='../Shared/icons/coursepage_button.svg'>";
								echo "		</a>";
								echo "    </div>";
								echo "</li>";
							}

							echo "<li class='access'>";
							echo "    <div class='access menuButton'>";
            			    echo "      <a id='accessBTN' title='Give students access to the selected version' value='Access' href='accessed.php?courseid=".$_SESSION['courseid']."&coursevers=".$_SESSION['coursevers']."' >";
             				echo "        <img alt='give access icon' id='editCourse' class='navButt' src='../Shared/icons/lock_symbol.svg'>";
							echo "      </a>";
							echo "    </div>";
							echo "</li>";
							echo "<input type='text' id='adminLoggedin' value='yes' style='display:none;'>";

							// Refresh button for Github repo in nav
							echo "<li class='refresh'>";
							echo "<div class='refresh menuButton tooltip'>";
								echo "<span id='refreshBTN' value='Refresh' href='#'>";
									echo "<img alt='refresh icon' id='refreshIMG' title='Refresh github repo' class='navButt' onclick='refreshGithubRepo(".$_SESSION['courseid'].",".isSuperUser($_SESSION['uid']).");resetGitFetchTimer(".isSuperUser($_SESSION['uid']).")' src='../Shared/icons/gitrefresh.svg'>";
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
							echo "</li>";

							//Dropdown Menu For Teachers
							echo "<div id='hamburgerBox'>";
							
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
							echo "<img alt ='Dark' class='burgerButt' title='Toggle between dark mode' src='../Shared/icons/ThemeToggle.svg'></>";
							// not working yet
							echo "<a class = 'burgerButtText'onclick = 'burgerToggleDarkmode()'> Change Theme </a>";
							echo "</a>";
							echo "</a>";
							echo"</div>";
							echo"</div>";
					}
			}
			/*=====BURGER DROPDOWN MENU SHOWDUGGA=====*/
			if ($noup == 'SECTION') {
				if(checklogin() && (isSuperUser($_SESSION['uid']) || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'st') || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'w') || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'sv'))){
					echo "<li class='navBurgerIcon fa fa-bars' onclick='navBurgerChange()' ></li>";
					echo "<li class='navBurgerIcon'> </li>";
					echo "<li class='navBurgerIcon'> </li>";
				}
			}
			echo "<div id='navBurgerBox' class='navBurgerBox' style='display: none;'>";

				echo "<div id='homeBurgerDiv'>
						<a id='homeBurger' href='../DuggaSys/courseed.php'>
							<img alt='home' class='navBurgerButt' src='../Shared/icons/Home.svg'>
						</a>
					 </div>";

				echo "<div id='darkModeBurgerDiv'>
						<a id='darkModeBurger' onclick='burgerToggleDarkmode()'>
							 <img alt='Dark' class='navBurgerButt' title='Toggle between dark mode' src='../Shared/icons/ThemeToggle.svg'>
						</a>
					  </div>";

				if ($noup === 'COURSE') {
					echo "<div id='goBackBurgerDiv'>";
					echo "<a href='../DuggaSys/courseed.php'>";
					echo "<img src='../Shared/icons/Up.svg' alt='Go Back'>"; 
					echo "</a>";
					echo "</div>";
				} 
				else if ($noup === 'SECTION') {
					$backHref = ($_SESSION['courseid'] !== "UNK") 
						? "../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers'] 
						: "../DuggaSys/courseed.php";

					echo "<div id='goBackBurgerDiv'>";
					echo "<a href='$backHref'>";
					echo "<img src='../Shared/icons/Up.svg' alt='Go Back'>";
					echo "</a>";
					echo "</div>";
				}
			echo '</div>'; 


			// Sort dialog - accessed / resulted /fileed					
			
			//old search bar for resulted
			// Handles onhover-text-examples (searchbar) based on what type of data can be requested.
      if($requestedService=="accessed.php" /*|| $requestedService=="resulted.php"*/ || $requestedService=="fileed.php" || $requestedService=="duggaed.php" ){
					echo "<li id='testSearchContainer' class='navSearchWrapper'>";

					if ($requestedService == "fileed.php")
						echo   "<form onsubmit='event.preventDefault()' autocomplete='off'><input id='searchinput' readonly type='text' onmouseover='hoverSearch();' onmouseleave='leaveSearch();' name='search' placeholder='Search..' onkeyup='searchterm=this.value;sortAndFilterTogether();myTable.reRender();'/></form>";
					else
					echo   "<form onsubmit='event.preventDefault()' autocomplete='off' display:'none'><input class='navSearch' id='searchinput' readonly onmouseover='hoverSearch();' onmouseleave='leaveSearch();' name='search'  placeholder='Search..' onkeyup='searchterm=this.value;myTable.reRender();'/></form>";

					echo	"<div id='dropdownSearch' class='dropdown-list-container' '>"; //Dropdown menu for when hovering the search bar
					if($requestedService=="accessed.php"){
						echo    "<p aria-live='polite'><b>Keywords:</b> Username, first/lastname, date <br> <b>Ex:</b> Johan Karlson 2020-02-29 13:37</p>";
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
					echo "</li>";
					echo "<li class='navButt' id='searchNavButt'>";

					if ($requestedService == "fileed.php")
						echo   "<button id='searchbutton' class='switchContent' type='button'>";
					else
						echo   "<button id='searchbutton' class='switchContent' onclick='searchterm=document.getElementById(\"searchinput\").value;myTable.reRender();' type='button'>";

					echo     "<img alt='search icon' id='lookingGlassSVG' src='../Shared/icons/LookingGlass.svg'/>";
					echo   "</button>";
					echo "</li>";
					if ($requestedService == "fileed.php" && (hasAccess($_SESSION["uid"], $_SESSION["courseid"], "w") || $_SESSION["superuser"] == 1)) {
						//Adds the download files button to the toolbar
						echo "<li class='navButt'>";
						echo "    <div>";
						echo "      <a id='downloadBTN' title='Download all content in a zip file' target='_blank' value='Download' href='downloadzip.php?courseid=".$_SESSION['courseid']."&coursevers=".$_SESSION['coursevers']."' >";
						echo "        <img alt='download all icon' id='downloadButt' src='../Shared/icons/file_download_white.svg'>";
						echo "      </a>";
						echo "    </div>";
						echo "</li>";
					}
			}

			// Presents the filterButton and its connected dropdown menu.
      		if($requestedService=="accessed.php"){
					echo "<li id='select' class='navFilterWrapper' onclick='pressFilter();' onmouseleave='leaveFilter()'; />";
					echo   "<div id='filterButton'; ' name='filter'; >";
					echo     "<img alt='filter icon' class='navButt filterButt' src='../Shared/icons/filter_icon.svg' style='pointer-events: none' />";
					echo     "<div id='dropdownc' class='dropdown-list-container' style='z-index: 1' />";
					echo       "<div id='filterOptions'></div>";
					echo       "<div id='columnfilter'></div>";
					echo       "<div id='customfilter'></div>";
					echo     "</div>";
					echo   "</div>";
					echo "</li>";
			}

			// Either generate code viewer specific nav menu or a spacer
			if(isset($codeviewer)){
					echo "<li class='navButt' id='beforebutton' title='Previous example' onmousedown='Skip(\"bd\");' onmouseup='Skip(\"bu\");' onclick='Skip(\"b\");'ontouchstart='Skip(\"bd\");' ontouchend='Skip(\"bu\");'><img src='../Shared/icons/backward_button.svg'></li>";
					echo "<li class='navButt' id='afterbutton' title='Next example' onmousedown='Skip(\"fd\");' onmouseup='Skip(\"fu\");' onclick='Skip(\"f\");' ontouchstart='Skip(\"fd\");' ontouchend='Skip(\"fu\");'><img src='../Shared/icons/forward_button.svg' /></li>";
					echo "<li class='navButt' id='playbutton' title='Open demo' onclick='Play(event);'><img src='../Shared/icons/play_button.svg' /></li>";
					if(checklogin() && (isSuperUser($_SESSION['uid']) || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'st') || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'sv') || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'w'))) {
						echo "<li class='navButt' id='templatebutton' title='Choose Template' onclick='openTemplateWindow();'><img src='../Shared/icons/choose_template.svg'  /></li>";
						echo "<li class='navButt' id='editbutton' onclick='displayEditExample();' title='Example Settings' ><img src='../Shared/icons/general_settings_button.svg' /></li>";
					  echo "<li class='navButt' id='fileedButton' onclick='' style='display:none;' title='File Download/Upload' ><img src='../Shared/icons/files_icon.svg' /></li>";
					}
					echo "<li class='navButt' id='codeBurger' onclick='showBurgerMenu();' title='Show box' ><img src='../Shared/icons/hotdog_button.svg' /></li>";
					echo "<li class='navButt showmobile' style='display:none;'><a href='courseed.php'><img src='../Shared/icons/hotdog_button.svg'></a></li>";
					echo "<li id='navHeading' class='navHeading codeheader'>";
					echo "<span id='exampleSection'>Example Section : </span>";
					echo "<span id='exampleName'> Example Name</span>";
					echo "</li>";
				}
				
				
				else{
					echo "<li id='select' style='display:none;' class='navButt'  onmouseover='hoverc();' onmouseleave='leavec();'>";
					echo   "<span>";
					echo     "<img class='navButt' src='../Shared/icons/tratt_white.svg'>";
					echo     "<div id='dropdownc' class='dropdown-list-container' style='z-index: 1'>";
					echo     "<div id='filterOptions'></div>";
					echo     "</div>";
					echo   "</span>";
					echo "</li>";
					echo "<li id='sort' style='display:none' class='navButt' onmouseover='hovers();' onmouseleave='leaves();'>";
					echo   "<span>";
					echo     "<img class='navButt' src='../Shared/icons/sort_white.svg'>";
					echo     "<div id='dropdowns' class='dropdown-list-container' style='z-index: 1'>";
					echo     "</div>";
					echo   "</span>";
					echo "</li>";
					echo "</li>";
					echo "<li id='menuHook' class='navSpacer' >";
					
				}

			echo "</ul>";

			echo "<div class='auth-box'><ul>";

			if($noup=='CONTRIBUTION' && (checkLogin() || git_checkLogin()))
			{
				if(checkLogin())
				{
					echo "<li class='navName' id='navName'><a id='userName' href='profile.php' title='".$_SESSION['loginname']."&#39;s profile'>".$_SESSION['loginname']."</a></li>";
				}
				else if (git_checkLogin())
				{
					echo "<li class='navName' id='navName'><a id='userName' href='profile.php' title='".$_SESSION['git_loginname']."&#39;s profile'>".$_SESSION['git_loginname']."</a></li>";
				}
				echo "<li id='loginbutton' class='loggedin' onclick='git_showLogoutPopup();'><img alt='logout icon' id='loginbuttonIcon' src='../Shared/icons/logout_button.svg' title='Logout'/></li>";
			}
			else if(checklogin()) 
			{
				echo "<li class='navName' id='navName'><a id='userName' href='profile.php' title='".$_SESSION['loginname']."&#39;s profile'>".$_SESSION['loginname']."</a></li>";
			
					echo "<li id='loginbutton' class='loggedin' onclick='showLogoutPopup();'><div class='loginbutton-nav' tabindex='0'><img alt='logout icon' id='loginbuttonIcon' src='../Shared/icons/logout_button.svg' title='Logout'/></div></li>";
				
			}
			else
			{
				//---  original --- echo "<td class='navName' id='navName'><label id='userName' title='Login to view your profile'>Guest</label></td>";
				echo "<li class='navName' id='navName'><label id='userName' title='Login to view your profile'></label></li>";
				
				// --- original --- echo "<td id='loginbutton' class='loggedout' onclick='showLoginPopup();'><img alt='login icon' id='loginbuttonIcon' src='../Shared/icons/login_button.svg' title='Login'/></td>";
				echo "<li id='loginbutton' class='loggedout' onclick='showLoginPopup();'><div class='loginbutton-nav' tabindex='0'>Login</div></li>";
			}

			echo "</ul></div>";

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
				echo "<div class='diagram-hide' style='height:50px;'></div>";
			}		
?>
<div id="overlay" style="display: none;"></div>

<div id="logoutReactRoot"></div>

<script type="text/javascript">
	// Checks if a logout request has been made on ANY other instance
	window.addEventListener('storage', function(event){
		if (event.key == 'logout-event') { 
			processLogout();
			localStorage.removeItem("logout-event");
		}
	}, {once: true});

	const cookieMsg = document.getElementById("cookiemsg");
	if (cookieMsg) {
		if (localStorage.getItem("ls-cookie-message") === "off") {
			cookieMsg.style.display = "none";
		} else {
			cookieMsg.style.display = "flex";
		}
	}
	function cookieMessage(){
		hideCookieMessage();
		localStorage.setItem("ls-cookie-message", "off");
	}
	function hoverBack() {
		const dropdowns = document.querySelectorAll(".dropdown-list-container");
		dropdowns.forEach(el => el.style.display = "none");
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

let gitFetchCooldownMin, gitFetchCooldownSec, cooldownHolder;

document.addEventListener("DOMContentLoaded", function() {
    gitFetchCooldownMin = document.getElementById("gitFetchMin");
    gitFetchCooldownSec = document.getElementById("gitFetchSec");
    cooldownHolder = document.getElementById("cooldownHolder");

    if (gitFetchCooldownMin && gitFetchCooldownSec) { // Check if elements exist
        setInterval(function() 
		{
            if (gitFetchCooldownSec.innerHTML > 0 || gitFetchCooldownMin.innerHTML > 0) {
                gitFetchCooldownSec.innerHTML -= 1;
                if (gitFetchCooldownSec.innerHTML < 0) 
				{
                    gitFetchCooldownMin.innerHTML -= 1;
                    gitFetchCooldownSec.innerHTML = 59;
                }
            } 
			else 
			{
                cooldownHolder.style.display = "none";
            }
        }, 1000);
    }
});

function resetGitFetchTimer(superuser) {
	const inputWindow = document.getElementById('githubPopupWindow');
	if(cooldownHolder.style.display == "none" && inputWindow.style.display == "none") {
		cooldownHolder.style.display = "block";
		if(superuser == 1)
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

<script type="text/babel">
function LogoutBoxWrapper() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    window.showLogoutPopup = () => setVisible(true);
  }, []);

  const handleLogout = () => {
    if (typeof processLogout === 'function') {
      processLogout();
    } else {
      alert("Logging out (simulate)");
    }
    setVisible(false);
  };

  const handleCancel = () => setVisible(false);

  if (!visible) return null;

  return (
    <div id="logoutBox" className="logoutBoxContainer">
      <div className="logoutBox DarkModeBackgrounds DarkModeText">
        <div className="logoutBoxheader">
          <h3>Sign out</h3>
          <div
            className="cursorPointer"
            title="Close window"
            onClick={handleCancel}
          >
            x
          </div>
        </div>
        <form id="logoutForm" method="post">
          <div>
            <p>Are you sure you want to log out?</p>
          </div>
          <table className="logoutBoxTable">
            <tbody>
              <tr className="logoutboxTr">
                <td>
                  <input
                    type="button"
                    className="buttonLogoutBox"
                    onClick={handleLogout}
                    value="Log out"
                    title="Log out"
                  />
                </td>
                <td>
                  <input
                    type="button"
                    className="buttonLogoutBox buttonLogoutCancelBox"
                    onClick={handleCancel}
                    value="Cancel"
                    title="CancelLogout"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}

const logoutRoot = document.getElementById("logoutReactRoot");
if (logoutRoot) {
  ReactDOM.createRoot(logoutRoot).render(<LogoutBoxWrapper />);
}
</script>
