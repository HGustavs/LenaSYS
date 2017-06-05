    <header>
		<?php
			echo "<table class='navheader'><tr>";

			include_once "../Shared/basic.php";

			// As we always include the navheader - we can add the code that saves the current course ID to the session here.
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
			//---------------------------------------------------------------------
			echo "<td class='navButt' id='back' title='Back' onmouseover='hoverBack();' onclick='window.history.back()'>";

            echo "<img src='../Shared/icons/Up.svg'></a></td>";

			if($noup=='COURSE'){
                    $cid=getOPG('cid');
                    if($cid=="UNK") $cid=getOPG('courseid');
                    $coursevers=getOPG('coursevers');
                    if($coursevers=="UNK") $coursevers=getOPG('cvers');
					echo "<td class='navButt' id='swimlane' title='Visual representation of course moment releases and deadlines'>";
          echo "<a class ='linkSwimlane' href='#'><img src='../Shared/icons/swimlane.svg'></a></td>";

			}

			// Either generate code viewer specific nav menu or a spacer
			if(isset($codeviewer)){
					echo "<td class='navButt' id='beforebutton' title='Previous example' onmousedown='Skip(\"bd\");' onmouseup='Skip(\"bu\");' onclick='Skip(\"b\");'><img src='../Shared/icons/backward_button.svg'></td>";
					echo "<td class='navButt' id='afterbutton' title='Next example' onmousedown='Skip(\"fd\");' onmouseup='Skip(\"fu\");' onclick='Skip(\"f\");'><img src='../Shared/icons/forward_button.svg' /></td>";
					echo "<td class='navButt' id='playbutton' title='Open demo' onclick='Play(event);'><img src='../Shared/icons/play_button.svg' /></td>";
					if(checklogin()) {
						echo "<td class='navButt' id='templatebutton' title='Choose Template' onclick='openTemplateWindow();'><img src='../Shared/icons/choose_template.svg'  /></td>";
						echo "<td class='navButt' onclick='displayEditExample();' title='Example Settings' ><img src='../Shared/icons/general_settings_button.svg' /></td>";
					  echo "<td class='navButt' id='fileedButton' onclick='' style='display:none;' title='File Download/Upload' ><img src='../Shared/icons/files_icon.svg' /></td>";
					}

					echo "<td class='navButt showmobile' style='display:none;'><a href='courseed.php'><img src='../Shared/icons/hotdog_button.svg'></a></td>";
					echo "<td id='navHeading' class='navHeading codeheader'>";
					echo "<span id='exampleSection'>Example Section : </span>";
					echo "<span id='exampleName'> Example Name</span>";
					echo "</td>";
				}else{
				echo "<td id='menuHook' class='navSpacer'></td>";
			}


			if(checklogin()) {
					echo "<td class='navName'><a id='userName' href='profile.php' title='".$_SESSION['loginname']."&#39;s profile'>".$_SESSION['loginname']."</a></td>";
					echo "<td id='loginbutton' class='loggedin'><img id='loginbuttonIcon' onload='loginButtonHover(\"online\")' src='../Shared/icons/Man.svg' title='Logout'/></td>";
			}else{
					echo "<td class='navName'><label id='userName' title='Login to view your profile'>Guest</label></td>";
					echo "<td id='loginbutton' class='loggedout'><img id='loginbuttonIcon' onload='loginButtonHover(\"offline\")' src='../Shared/icons/Man.svg' title='Login'/></td>";
			}


		echo "</tr></table>";

		//Cookie message
		echo "<div id='cookiemsg'><p>This site uses cookies. By continuing to browse this page you accept the use of cookies.</p><input type='button' value='OK' class='submit-button' onclick='cookieMessage()'/></div>";

	?>
</header>
    <body>
<?php
// The below swimlane stuff should be moved to swimlane.php, and included here.
	include_once("swimlane.php");
?>
    </body>
<script type="text/javascript">
// Alt-a = accessed, Alt-h = home, 
document.onkeyup=function(e){
        var e = e || window.event;
    if(e.altKey && e.which == 72) {
         window.location.href='http://webblabb.iit.his.se:8080/grupp4/a15perbl/LenaSYS/DuggaSys/courseed.php';
         return false;
    }
    if(e.altKey && e.which == 65 ) {
         window.location.href='http://webblabb.iit.his.se:8080/grupp4/a15perbl/LenaSYS/DuggaSys/accessed.php?cid=5&coursevers=';
         return false;
    }
}
		if(localStorage.getItem("cookieMessage")=="off"){
			$("#cookiemsg").css("display", "none");
		}
		else{
			$("#cookiemsg").css("display", "flex");
		}

	setupLoginLogoutButton('<?PHP echo json_encode(checklogin()) ?>');
	function cookieMessage(){
		localStorage.setItem("cookieMessage", "off");
		$("#cookiemsg").css("display", "none");
	}
	function hoverBack(){
		$(".dropdown-list-container").css("display", "none");
	}
</script>
