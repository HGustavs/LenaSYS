<?PHP
	//---------------------------------------------------------------------------------------------------------------
	// editsectionmenu - Displays an editable or un-editable section menu
	//---------------------------------------------------------------------------------------------------------------

		/**
		 * Generate the HTML for the section editor menu and whatnot
		 * TODO: Make this slightly more portable?
		 * @param boolean $kind Boolean representing if the user is allowed to edit
		 * or not.
		 */
				echo "<body onload='AJAXServiceSection(\"\",\"\");'>";
	
				// Course Content List - If course exists!
				echo "<table width='100%'><tr><td rowspan='2'><div id='Sectionlist'>";
				echo "<div style='left:20px' class='warning'>";
				echo "Please wait while content loads<br/>";
				echo "<img src='../CodeViewer/icons/Starspinner3.gif' /><br/>";
				echo "Do not forget to enable Javascript<br/>";
				echo "</div>";
				echo "</div></td>";

				// Login log out button

				echo "<td align='right' valign='top'>";
				echo "<table cellspacing='2'><tr>";
				if($kind){
						echo "<td class='buttos' title='New section' onclick='newSection(\"1\");'><img src='../CodeViewer/icons/Plus.svg' /></td>";
						echo "<td class='buttos' title='New bold section' onclick='newSection(\"2\");'><img src='../CodeViewer/icons/Bold.svg' /></td>";
				}
				/*
				if(checklogin()) {
					echo "<td align='right' class='butto' onclick='location=\"logout.php\"'><img src='../CodeViewer/icons/Man.svg' /></td>";
				} else {
					echo "<td align='right' class='butto' onclick='loginbox()'><img src='../CodeViewer/icons/Man.svg' /></td>";
				}
				*/
				echo "</tr></table>";

				echo "</tr><tr><td></td></tr></table>";

				echo "</body>";
				echo "</html>";		

?>