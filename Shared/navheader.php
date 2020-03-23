<header>
       <?php
			$requestedService = explode('?', $_SERVER['REQUEST_URI'], 2)[0];
			$requestedService = substr($requestedService,strrpos ( $requestedService , "/")+1);

			echo "<table class='navheader'><tr>";
			include_once "../Shared/basic.php";
			
			// As we always include the navheader - we can add the code that saves the current course ID to the session here.
			if(!isset($_SESSION['courseid'])) $_SESSION['courseid']="UNK";
			if(!isset($_SESSION['coursevers'])) $_SESSION['coursevers']="UNK";
	
			if(isset($_GET['courseid'])){
					$_SESSION['courseid']=$_GET['courseid'];
			}
			if(isset($_GET['coursevers'])){
					$_SESSION['coursevers']=$_GET['coursevers'];
			}
			
	
			// Always show home button which links to course homepage
			echo "<td class='navButt' id='home' title='Home'><a class='navButt' href='../DuggaSys/courseed.php'><img src='../Shared/icons/Home.svg'></a></td>";
			// Generate different back buttons depending on which page is including
			// this file navheader file. The switch case uses ternary operators to
			// determine the href attribute value. (if(this) ? dothis : elsethis)
			// If the current page is the course editor, don't display the back button
			//---------------------------------------------------------------------
	
	
	/*
	
			<div id='TopMenuStatic' style="display:none;">

			<table class='navheader' style='overflow: hidden; table-layout: fixed;'>
				<tr class='trsize nowrap'>

					<td class='hamburger hamburgerClickable'>
						<div tabindex='0' class='package'>
							<div id='hamburgerIcon' class='submit-button hamburger' onclick='hamburgerChange();bigMac();' >
								<div class='container'>
									<div class='bar1'></div>
									<div class='bar2'></div>
									<div class='bar3'></div>
								</div>
							</div>
						</div>
						<div class='hamburgerMenu'>
							<ul class='hamburgerList'>
								<li class='results'>
								    <a id='resultsBtnBurger' href='' onclick='bigMac(); navigatePage(this.id, "resulted.php");' oncontextmenu='javascript:navigatePage(this.id, "resulted.php");'><input type='button' value='Results' class='submit-button' title='Edit student results' /></a>
								</li>
								<li class='tests'>
								    <a id='testsBtnBurger' href='' onclick='bigMac(); navigatePage(this.id, "duggaed.php");' oncontextmenu='javascript:navigatePage(this.id, "duggaed.php");'><input type='button' value='Tests' class='submit-button' title='Show tests' /></a>
									</li>
								<li class='files'>
									<a id='filesBtnBurger' href='' onclick='bigMac(); navigatePage(this.id, "fileed.php");' oncontextmenu='javascript:navigatePage(this.id, "fileed.php");'><input type='button' value='Files' class='submit-button' title='Show files'/></a>
								</li>
								<li class='access'>
									<a id='accessBtnBurger' href='' onclick='bigMac(); navigatePage(this.id, "accessed.php");' oncontextmenu='javascript:navigatePage(this.id, "accessed.php");'><input type='button' value='Access' class='submit-button' title='Give students access to the selected version'/></a>
								</li>
							</ul>
						</div>
					</td>

				</tr>

			</table>

			<?php
			echo "
			<script type=\"text/javascript\">
				// This makes it possible to use the middle-mouse-button on the header alternatives
				navigatePage('resultsBTN', 'resulted.php');
				navigatePage('testsBTN', 'duggaed.php');
				navigatePage('filesBTN', 'fileed.php');
				navigatePage('accessBTN', 'accessed.php');
			</script>";
			 ?>

		</div>
		<!-- Static Top Menu END -->
	
	*/
	
			if($noup!='NONE') {
				  echo "<td class='navButt' id='back' title='Back'>";
			}
			if($noup=='COURSE'){
					echo "<a class='navButt' href='../DuggaSys/courseed.php'>";
					echo "<img src='../Shared/icons/Up.svg'></a></td>";
					// echo "<td>GREGER!</td>";	
			}else if($noup=='SECTION'){
					$cid=getOPG('cid');
					if($cid=="UNK") $cid=getOPG('courseid');
					$coursevers=getOPG('coursevers');
					if($coursevers=="UNK") $coursevers=getOPG('cvers');
					echo "<a href='";
					echo ($cid != (string)"UNK" ? "../DuggaSys/sectioned.php?courseid=".$cid."&coursevers=".$coursevers : "../DuggaSys/courseed.php");
					echo "'>";
					echo "<img src='../Shared/icons/Up.svg'></a></td>";
			}
	
			// Adding buttons for courses
			if($noup=='COURSE'){
					// Course specific navbar buttons moved from "static" to navheader
					if(checklogin() && (isSuperUser($_SESSION['uid']) || hasAccess($_SESSION['uid'], $cid, 'st'))) {				
							echo "<td style='display: inline-block;'>";
							echo "    <div class='course-dropdown-div'>";
							echo "      <select id='courseDropdownTop' class='course-dropdown' onchange='goToVersion(this)' ></select>";
							echo "    </div>";
							echo "</td>";
						
							echo "<td class='editVers' style='display: inline-block;margin-left:8px;'>";
							echo "    <div class='editVers menuButton'>";
              echo "      <img id='versionCog' class='navButt' title='Edit the selected version' onclick=showEditVersion(); src='../Shared/icons/CogwheelWhite.svg'>";
							echo "    </div>";
							echo "</td>";
							
							echo "<td class='newVers' style='display: inline-block;margin-right:2px;'>";
							echo "    <div class='newVers menuButton'>";
              echo "      <img id='versionPlus' value='New version' class='navButt' title='Create a new version of this course' onclick='showCreateVersion();' src='../Shared/icons/PlusS.svg'>";
							echo "    </div>";
							echo "</td>";						
					
							echo "<td class='results' style='display: inline-block;'>";
							echo "    <div class='results menuButton'>";
							echo "    <a id='resultsBTN' title='Edit student results' value='Results' href='resulted.php?courseid=".$_SESSION['courseid']."&coursevers=".$_SESSION['coursevers']."' >";
							echo "      <img id='versionPlus' class='navButt' src='../Shared/icons/FistW.svg'>";
							echo "    </a>";
							echo "    </div>";
							echo "</td>";
						
							echo "<td class='tests' style='display: inline-block;'>";
							echo "    <div class='tests menuButton'>";
							echo "      <a id='testsBTN' title='Show tests' value='Tests' href='duggaed.php?courseid=".$_SESSION['courseid']."&coursevers=".$_SESSION['coursevers']."' >";
							echo "        <img id='testsBTN' class='navButt' src='../Shared/icons/student_files.svg'>";
							echo "      </a>";
							echo "    </div>";
							echo "</td>";
						
							echo "<td class='files' style='display: inline-block;'>";
							echo "    <div class='files menuButton'>";
              echo "      <a id='filesBTN' title='Show files' value='Files' href='fileed.php?courseid=".$_SESSION['courseid']."&coursevers=".$_SESSION['coursevers']."' >";
              echo "        <img class='navButt' src='../Shared/icons/rounded_upload_button.svg'>";
							echo "      </a>";
							echo "    </div>";
							echo "</td>";
						
							echo "<td class='access menuButton' style='display: inline-block;'>";
							echo "    <div class='access menuButton'>";
              echo "      <a id='accessBTN' title='Give students access to the selected version' value='Access' href='accessed.php?courseid=".$_SESSION['courseid']."&coursevers=".$_SESSION['coursevers']."' >";
              echo "        <img class='navButt' src='../Shared/icons/lock_symbol.svg'>";
							echo "      </a>";
							echo "    </div>";
							echo "</td>";
					}
			}
	
			// Either generate code viewer specific nav menu or a spacer
			if(isset($codeviewer)){
					echo "<td class='navButt' id='beforebutton' title='Previous example' onmousedown='Skip(\"bd\");' onmouseup='Skip(\"bu\");' onclick='Skip(\"b\");'><img src='../Shared/icons/backward_button.svg'></td>";
					echo "<td class='navButt' id='afterbutton' title='Next example' onmousedown='Skip(\"fd\");' onmouseup='Skip(\"fu\");' onclick='Skip(\"f\");'><img src='../Shared/icons/forward_button.svg' /></td>";
					echo "<td class='navButt' id='playbutton' title='Open demo' onclick='Play(event);'><img src='../Shared/icons/play_button.svg' /></td>";
					if(checklogin() && (isSuperUser($_SESSION['uid']) || hasAccess($_SESSION['uid'], $cid, 'st'))) {
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
            echo "<td id='menuHook' class='navSpacer'>";
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
		//$("#cookiemsg").css("display", "none");
	}
	function hoverBack(){
		$(".dropdown-list-container").css("display", "none");
	}
</script>
<script type="text/javascript">
	(function(proxied) {
		window.alert = function() {
			return <?php echo checkLogin() && isSuperUser($_SESSION['uid']) ? "proxied.apply(this, arguments)" : "null" ?>;
		};
	})(window.alert);
</script>