<?php
		ini_set("auto_detect_line_endings", true);
		include_once "../Shared/basic.php";
		include_once "../Shared/sessions.php";
		
		$file_extension="UNK";

		function parseMarkdown($inString)
		{	
				$str="";
				$inString=preg_replace("/\</", "&lt;",$inString);
				$inString=preg_replace("/\>/", "&gt;",$inString);

				$inString=preg_replace("/^\~{3}(\r\n|\n|\r)/m", "~~~@@@",$inString);
				$inString=preg_replace("/^\=\|\=(\r\n|\n|\r)/m", "=|=&&&",$inString);
				
				$str="";

				//$codearray=explode('~~~', $inString);
				$codearray=preg_split("/\~{3}|\=\|\=/", $inString);
				
				$specialBlockStart=true;
				foreach ($codearray as $workstr) {
						if(substr($workstr,0,3)==="@@@" && $specialBlockStart===true){
								$specialBlockStart=false;
								$str.="<pre><code>".substr($workstr,3)."</code></pre>";
						} else if (substr($workstr,0,3)==="&&&" && $specialBlockStart===true){
								$specialBlockStart=false;
								$str.="<div class='console'><pre>".substr($workstr,3)."</pre></div>";
						} else if ($workstr !== "") {
								$str.=markdownBlock(preg_replace("/^\&{3}|^\@{3}/","",$workstr));
								$specialBlockStart=true;
						} else {
								$str.=$workstr;
						}
				}
		
				return $str;
		}

		function markdownBlock($instring)
		{
				//Regular expressions for italics
				$instring = preg_replace("/\*{4}(.*?\S)\*{4}/", "<strong><em>$1</em></strong>",$instring);	
				$instring = preg_replace("/\*{3}(.*?\S)\*{3}/", "<em>$1</em>",$instring);	
				$instring = preg_replace("/\*{2}(.*?\S)\*{2}/", "<em>$1</em>",$instring);	

				// Bold
				$instring = preg_replace("/\_{4}(.*?\S)\_{4}/", "<strong><em>$1</em></strong>",$instring);	
				$instring = preg_replace("/\_{3}(.*?\S)\_{3}/", "<strong>$1</strong>",$instring);	
				$instring = preg_replace("/\_{2}(.*?\S)\_{2}/", "<strong>$1</strong>",$instring);	

				// Headings -- 6 levels
				$instring = preg_replace("/^\#{6}\s(.*)=*/m", "<h6>$1</h6>",$instring);	
				$instring = preg_replace("/^\#{5}\s(.*)=*/m", "<h5>$1</h5>",$instring);	
				$instring = preg_replace("/^\#{4}\s(.*)=*/m", "<h4>$1</h4>",$instring);	
				$instring = preg_replace("/^\#{3}\s(.*)=*/m", "<h3>$1</h3>",$instring);	
				$instring = preg_replace("/^\#{2}\s(.*)=*/m", "<h2>$1</h2>",$instring);	
				$instring = preg_replace("/^\#{1}\s(.*)=*/m", "<h1>$1</h1>",$instring);	

				//Regular expressions for lists both - and * lists are supported
				$instring = preg_replace("/^\s*\d*\.\s(.*)/m", "<ol><li>$1</li></ol>",$instring);
				
				$instring = preg_replace("/^\s*\-\s(.*)/m", "<ul><li>$1</li></ul>",$instring);
				$instring = preg_replace("/^\s*\*\s(.*)/m", "<ul><li>$1</li></ul>",$instring);

				// Fix for superflous ul and ol statements
				$instring= str_replace ("</ul>\n<ul>","",$instring);
				$instring= str_replace ("</ol>\n<ol>","",$instring);

				//Regular expression for line
				$instring = preg_replace("/^(\-{3}\n)/m", "<hr>",$instring);

				// Hard line break support
				$instring= preg_replace ("/(\r\n|\n|\r){3}/","<br><br>",$instring);
				$instring= preg_replace ("/(\r\n|\n|\r){2}/","<br>",$instring);

				// Fix for swedish characters
				$instring= str_replace ("å","&aring;",$instring);				
				$instring= str_replace ("Å","&Aring;",$instring);				
				$instring= str_replace ("ä","&auml;",$instring);				
				$instring= str_replace ("Ä","&Auml;",$instring);				
				$instring= str_replace ("ö","&ouml;",$instring);				
				$instring= str_replace ("Ö","&Ouml;",$instring);				
				
				// a href Link
				// !!!url,text to show!!!
				$instring = preg_replace("/\!{3}(.*?\S),(.*?\S)\!{3}/","<a href='$1' target='_blank'>$2</a>",$instring);

				// External img src !!!
				// |||src|||	
				$instring = preg_replace("/\|{3}(.*?\S)\|{3}/","<img src='$1' />",$instring);

				// External mp4 src !!!
				// ==[src]==	
				$instring = preg_replace("/\={2}\[(.*?\S)\]\={2}/","<video width='80%' style='display:block; margin: 10px auto;' controls><source src='$1' type='video/mp4'></video>",$instring);

				// External mp4 src !!!
				// ==[src]==	
				$instring = preg_replace("/\={2}\{(.*?\S)}\={2}/","<span id='placeholder-$1'></span>",$instring);

				// Image Movie Link format: <img src="pngname.png" class="gifimage" onclick="showGif('gifname.gif');"/>
				// +++image.png,image.gif,id+++
				$instring = preg_replace("/\+{3}(.*?\S),(.*?\S)\+{3}/","<div class='gifwrapper'><img class='gifimage' src='$1' onclick=\"toggleGif('$2', '$1', this);\" target='_blank' /><img class='playbutton' src='../Shared/icons/PlayT.svg'></div>",$instring);

				// Right Arrow for discussing menu options
				$instring = preg_replace("/\s[\-][\>]\s/","&rarr;",$instring);

				// Strike trough text
				$instring = preg_replace("/\-{4}(.*?\S)\-{4}/","<span style=\"text-decoration:line-through;\">$1</span>",$instring);

				// Importand Rows in code file in different window ===
				// ===filename,start row,end row, text to show===
				$instring = preg_replace("/\={3}(.*?\S),(.*?\S),(.*?\S),(.*?\S)\={3}/", "<span class='impword' onmouseover=\"highlightRows(\'$1\',$2,$3)\" onmouseout=\"dehighlightRows(\'$1\',$2,$3)\">$4</span>", $instring);

				// Three or more dots should always be converted to an ellipsis.
				$instring = preg_replace("/\.{3,}/", "&hellip;", $instring);
				
				// Iframe, website inside a inline frame - (--url,width,height--)
				$instring = preg_replace("/\(\-{2}(.*?\S),(.*?\S),(.*?\S)\-{2}\)/", "<iframe src='$1' style='width:$2px; height:$3px;'></iframe>", $instring);
				
				// Quote text, this will be displayed in an additional box
				// ^ Text you want to quote ^
				$instring = preg_replace("/\^{1}\s(.*?\S)\s\^{1}/", "<blockquote>$1</blockquote><br/>", $instring);

				return $instring;		
		}

		ob_start();
		date_default_timezone_set("Europe/Stockholm");
		
		// Include basic application services!
		session_start();
		$readfile = false;
		// Connect to database and start session
		pdoConnect();
		$cid=getOPG('cid');
		$fid=getOPG('fid');
		$fname=getOPG('fname');
		$coursevers=getOPG('coursevers');

		$hdrs=getOPG('headers');
		
		// If no course version is given, read course version from session
		if($cid=="UNK"){
			if(isset($_SESSION['courseid'])){
					$cid=$_SESSION['courseid'];
			}
		}
		if($coursevers=="UNK"){
			if(isset($_SESSION['coursevers'])){
					$coursevers=$_SESSION['coursevers'];
			}					
		}
		
		// Read User ID from session
		if(isset($_SESSION['uid'])){
			$userid=$_SESSION['uid'];
		}else{
			$userid="UNK";		
		} 	
		
		// Get visibility from course table
		$hr=false;
		$query = $pdo->prepare("SELECT visibility FROM course WHERE cid=:cid");
		$query->bindParam(':cid', $cid);
		$result = $query->execute();
		if($row = $query->fetch(PDO::FETCH_ASSOC)){
			$hr = ((checklogin() && hasAccess($userid, $cid, 'r')) || $row['visibility'] != 0);
			if(!$hr){
				if(checklogin()){
					$hr = isSuperUser($userid);
				}
			}
		}
		
		if($hr){
			// If we have access rights, read the file securely to document
			if(is_numeric($fid)){ 
				// Check if it is a number or a filename
				$query = $pdo->prepare("SELECT filename,kind from fileLink WHERE cid=:cid and fileid=:fid;");
				$query->bindParam(':cid', $cid);
				$query->bindParam(':fid', $fid);
				$result = $query->execute();
				if($row = $query->fetch(PDO::FETCH_ASSOC)){
					if(file_exists ( $row['filename'])){
					}else{
						$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exist!</div>";
					}
				}else{
					$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
				}
			}else if($fname!="UNK"){
				$query = $pdo->prepare("SELECT filename,kind from fileLink WHERE (cid=:cid or isGlobal='1') and UPPER(filename)=UPPER(:fname) ORDER BY kind DESC LIMIT 1;");
				$query->bindParam(':cid', $cid);
				$query->bindParam(':fname', $fname);
				$result = $query->execute();
				if($row = $query->fetch(PDO::FETCH_ASSOC)){
					$filekind=$row['kind'];
					$filename = $row['filename'];
		
					if($filekind==1){
						// Link
						//--------------------------
						echo "<script>window.location.replace('".$filename."');</script>";
					}else{
		
							if($filekind==2){
								// Global
								$file = "../courses/global/".$filename;
							}else if($filekind==3){
								// Course Local
								$file = "../courses/".$cid."/".$filename;
							}else if($filekind==4){
								// Local
								$file = "../courses/".$cid."/".$coursevers."/".$filename;
							}else{
								$file = "UNK";					
							}
					
							if(file_exists ( $file)){
									$file_extension = strtolower(substr(strrchr($filename,"."),1));									
									if($file_extension=="html"){
											$bummer=file_get_contents($file);
									}else if($file_extension=="md"){
											$bummer=file_get_contents($file);
									}else{
											$readfile = true;
											switch($file_extension){
												case "pdf": $ctype="application/pdf"; break;
												case "exe": $ctype="application/octet-stream"; break;
												case "zip": $ctype="application/zip"; break;
												case "doc": $ctype="application/msword"; break;
												case "xls": $ctype="application/vnd.ms-excel"; break;
												case "ppt": $ctype="application/vnd.ms-powerpoint"; break;
												case "gif": $ctype="image/gif"; break;
												case "png": $ctype="image/png"; break;
												case "jpg": $ctype="image/jpg"; break;
											}
											header("Content-Type: ".$ctype);
											header('Content-Disposition: inline; filename="' .$filename.'"');
											header('Content-Transfer-Encoding: binary');
											header('Accept-Ranges: bytes');
											@readfile($file);
									}
								}else{
									$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> The link you asked for does not currently exist!".$file."</div>";										  
								}
					}
				}else{
					$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
				}
			}else{
					$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
			}		
		}else{
				$bummer = "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!</div>";
		}		
		
		if(!$readfile){
				if($hdrs=="none"){
				
				}else{
						echo "<html>";
						echo "<head>";
						echo "<link rel='icon' type='image/ico' href='../Shared/icons/favicon.ico'/>";
						echo "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>";
						echo "<title>Document Viewer</title>";
						echo "<link type='text/css' href='../Shared/css/style.css' rel='stylesheet'>";
						echo "<link type='text/css' href='../Shared/css/markdown.css' rel='stylesheet'>";
						echo "<link type='text/css' href='../Shared/css/jquery-ui-1.10.4.min.css' rel='stylesheet'>";  
						echo "<script src='../Shared/js/jquery-1.11.0.min.js'></script>";
						echo "<script src='../Shared/js/jquery-ui-1.10.4.min.js'></script>";
						echo "<script src='../Shared/dugga.js'></script>";
						echo "<script src='../Shared/markdown.js'></script>";				
						echo "</head>";
						echo "<body onload='loadedmd();'>";
				}
				
				if($hdrs=="none"){
					
				}else if($readfile == false){
					$noup="SECTION";
					$loginvar="LINK"; 
					include '../Shared/navheader.php';
					setcookie("loginvar", $loginvar); 
				}
								
				if($hdrs!="none") echo "<div id='content'>";

				// Only .md files are supported
				if($file_extension=="md"){
						// If markdown -- perform replacements in code
						$bummer=parseMarkdown($bummer);
						$bummer="<div class='descbox'>".$bummer."</div>";
				}
				
				echo $bummer;

				if($hdrs!="none"){
						echo "</div>";
						
						include '../Shared/loginbox.php';
		
						// Code for supporting markdown gif clips for animated tutorials				
						echo "<div id='figmd' class='figmd'><img id='bigmd' src='' class='bigmd' /></div>";
						echo "<div id='backmd' class='backmd'></div>";

						echo "</body>";
						echo "</html>";		
				}
				
		}
?>
