<?php
include "../Shared/basic.php";

	//---------------------------------------------------------------------------------------------------------------
	// editcontentmenu - Code Viewer Menu Code
	//---------------------------------------------------------------------------------------------------------------

		function editcodemenu($kind)
		{	
				// Body if we are allowed to run code viewer
				echo '<body style="margin: 0; padding: 0;" onload="setup();">';
				echo '<span id="forwdrop" class="dropdown forwdrop"><div class="dropdownback">Forw</div></span>';
				echo '<span id="backwdrop" class="dropdown backwdrop"><div class="dropdownback">Backw</div></span>';				
				if($kind){
						echo '<span id="codedrop" class="dropdown codedrop" style="overflow:scroll;"><div class="dropdownback">Code viewer Code File Selector</div></span>';
						echo '<span id="docudrop" class="dropdown docudrop" style="overflow:scroll;"><div class="dropdownback">General settings</div></span>';				
				}

				echo '<div id="buttomenu">';
				echo '<table cellspacing="2"><tr>';
				if($kind){

								echo '<td class="buttospacer">&nbsp;</td>';
				//				echo '<td class="butto" onclick="Wordlist();"><img src="icons/Book.svg" /></td>';
								echo '<td class="menutext"><span id="exampleSection">Foo</span>&nbsp;:&nbsp;<span id="exampleName" contenteditable="true">Example Code Page</td>';
							//	echo '<td class="genSettingsSection" onclick="Code();"><img src="icons/Document.svg" /></td>';
							//	echo '<td class="genSettingsSection" onclick="Wordlist();"><img src="icons/Book.svg" /></td>';
								echo '<td class="butto" title="Settings" onclick="generalSettings();"><img src="new icons/general_settings_button.svg" /></td>';
								echo '<td class="butto" title="Select codesource" onclick="Code();"><img src="new icons/list_codefiles.svg" /></td>';
								
								
				}else{
								echo '<td class="menutext"><span id="exampleSection">Foo</span>&nbsp;:&nbsp;<span id="exampleName">Example Code Page</td>';						
				}
						echo '<td class="butto" title="Back to list" onclick="Up();"><img src="new icons/home_button.svg" /></td>';
						echo '<td class="butto" id="numberbutton" title="Show/hide linenumbers" onclick="fadelinenumbers();"><img src="new icons/numbers_button.svg" /></td>';
						echo '<td class="butto" id="beforebutton" title="Previous example" onmousedown="SkipBDown();" onmouseup="SkipBUp();" onclick="SkipB();"><img src="new icons/backward_button.svg" /></td>';
						echo '<td class="butto" id="afterbutton" title="Next example" onmousedown="SkipFDown();" onmouseup="SkipFUp();" onclick="SkipF();""><img src="new icons/forward_button.svg" /></td>';
						echo '<td class="butto" id="playbutton" title="Open demo" onclick="Play();"><img src="new icons/play_button.svg" /></td>';
						echo '<td class="buttospacer">&nbsp;</td>';

				echo '</table></div>';
				echo '<div id="div2" style="width:100%; position: absolute; top: 50px; bottom: 0px; background-color:#def">';
				echo '<div id="docucontent"';
				if($kind){
						echo ' contenteditable="true" >';				
				}else{ 
						echo '>';
				} 
				echo '<div style="left:20px" class="warning">';
						echo 'Please wait while content loads<br/>';
						echo '<img src="new icons/loadingJS.gif" /><br/>';
						echo 'Do not forget to enable Javascript<br/>';
						echo '</div>';
						echo '</div>';
						echo '<div id="codebox">';
				//		echo '<span id="playlinkErrorMsg" onclick="$(this).hide();"></span>';
						echo '<div id="infobox" class="codeview">';
						echo '<div style="left:300px" class="warning">';
							echo 'Please wait while content loads<br/>';
							echo '<img src="new icons/loadingJS.gif" /><br/>';
							echo 'Do not forget to enable Javascript<br/>';
					echo '</div>';
				echo '</div>';
		echo '</div>';
		echo '</div>';
		}
?>
