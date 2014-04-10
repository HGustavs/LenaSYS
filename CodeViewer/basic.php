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
						echo '<span id="docudrop" class="dropdown docudrop"><div class="dropdownback">Wordlist Selector</div></span>';				
				}

				echo '<div id="buttomenu">';
				echo '<table cellspacing="2"><tr>';
						echo '<td class="butto" onclick="Up();"><img src="icons/Up.svg" /></td>';
						echo '<td class="butto" id="beforebutton" onmousedown="SkipBDown();" onmouseup="SkipBUp();" onclick="SkipB();"><img src="icons/SkipB.svg" /></td>';
						echo '<td class="butto" id="afterbutton" onmousedown="SkipFDown();" onmouseup="SkipFUp();" onclick="SkipF();""><img src="icons/SkipF.svg" /></td>';
						echo '<td class="butto" id="playbutton" onclick="Play();"><img src="icons/Play.svg" /></td>';
						echo '<td class="butto" id="numberbutton" onclick="fadelinenumbers();"><img src="icons/nrshow.svg" /></td>';
						echo '<td class="buttospacer">&nbsp;</td>';
						if($kind){
								echo '<td class="butto" onclick="Plus();"><img src="icons/Plus.svg" /></td>';
								echo '<td class="butto" onclick="Minus();"><img src="icons/Minus.svg" /></td>';
								echo '<td class="buttospacer">&nbsp;</td>';
								echo '<td class="butto" onclick="Bold();"><img src="icons/Bold.svg" /></td>';
								echo '<td class="butto" onclick="Save();"><img src="icons/Diskett.svg" /></td>';
								echo '<td class="buttospacer">&nbsp;</td>';
								echo '<td class="butto" onclick="Code();"><img src="icons/Document.svg" /></td>';
								echo '<td class="butto" onclick="Wordlist();"><img src="icons/Book.svg" /></td>';
								echo '<td class="menutext"><span id="exampleSection">Foo</span>&nbsp;:&nbsp;<span id="exampleName" contenteditable="true">Example Code Page</td>';
						}else{
								echo '<td class="menutext"><span id="exampleSection">Foo</span>&nbsp;:&nbsp;<span id="exampleName">Example Code Page</td>';						
						}
						echo '<td class="butto" onclick="location=\'loginlogout.php\';"><img src="icons/Man.svg" /></td></tr>';
				echo '</table></div>';
				echo '<div style="width:100%; position: absolute; top: 50px; bottom: 0px;" id="div2;background-color:#def">';
				echo '<div id="docucontent"';
				if($kind){
						echo ' contenteditable="true" >';				
				}else{ 
						echo '>';
				} 
				echo '<div style="left:20px" class="warning">';
						echo 'Please wait while content loads<br/>';
						echo '<img src="icons/Starspinner3.gif" /><br/>';
						echo 'Do not forget to enable Javascript<br/>';
						echo '</div>';
						echo '</div>';
						echo '<div id="codebox">';
						echo '<div id="infobox" class="codeview">';
						echo '<div style="left:300px" class="warning">';
							echo 'Please wait while content loads<br/>';
							echo '<img src="icons/Starspinner3.gif" /><br/>';
							echo 'Do not forget to enable Javascript<br/>';
					echo '</div>';
				echo '</div>';
		echo '</div>';
		echo '</div>';

		}
?>
