<?php
		ini_set("auto_detect_line_endings", true);
		include_once "../Shared/basic.php";
		include_once "../Shared/sessions.php";
		
		$file_extension="UNK";
        $tableAlignmentConf = [];
		function parseMarkdown($inString)
		{	
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
								$workstr="<pre><code>".substr($workstr,3)."</code></pre>";
						} else if (substr($workstr,0,3)==="&&&" && $specialBlockStart===true){
								$specialBlockStart=false;
								$workstr="<div class='console'><pre>".substr($workstr,3)."</pre></div>";
						} else if ($workstr !== "") {

								$workstr=parseLineByLine(preg_replace("/^\&{3}|^\@{3}/","",$workstr));
								$specialBlockStart=true;
						}
						
						$str.=$workstr;
						
				}

				return $str;
		}

		function parseLineByLine($inString) {
			$str = $inString;	
			$markdown = "";

			$currentLineFeed = strpos($str, PHP_EOL);
			$currentLine = "";
			$prevLine = "";
			$remainingLines = "";
			$nextLine = "";

			while($currentLineFeed !== false) { // EOF
				$prevLine = $currentLine;
				$currentLine = substr($str, 0, $currentLineFeed);
				$remainingLines = substr($str, $currentLineFeed + 1, strlen($str));

				$nextLine = substr($remainingLines, 0, strpos($remainingLines, PHP_EOL));


				$markdown = identifier($prevLine, $currentLine, $markdown, $nextLine);

				// line done parsing. change start position to next line
		        $str = $remainingLines;
		        $currentLineFeed = strpos($str, PHP_EOL);

			}

			return $markdown;
		}

		// identify what to parse and parse it
		function identifier($prevLine, $currentLine, $markdown, $nextLine) {

            // handle ordered lists <ol></ol>
            if(isOrderdList($currentLine)) {
                $markdown .= handleOrderedList($currentLine, $prevLine, $nextLine);
            }
            // handle unordered lists <ul></ul>
            else if(isUnorderdList($currentLine)) {
            	$markdown .= handleUnorderedList($currentLine, $prevLine, $nextLine);
            }
            // handle tables
            else if(isTable($currentLine)){
                $markdown .= handleTable($currentLine, $prevLine, $nextLine);
            }
            // If its ordinary text then show it directly
            else{
                $markdown .= markdownBlock($currentLine);
                if(preg_match('/\br*/', $currentLine)){
                    $markdown .= "<br>";
                }
            }
			return $markdown;
		}
        // Check if its an ordered list
		function isOrderdList($item) {
			// return 1 if ordered list
			return preg_match('/\s*\d+\.\s(.*)/', $item);
		}
		// Check if its an unordered list
		function isUnorderdList($item) {
			// return 1 if unordered list
			return preg_match('/(\-|\*)\s+[^|]/', $item); // doesn't support dash like markdown!
		}
		// CHeck if its a table
		function isTable($item) {
			// return 1 if space followed by a pipe-character and have closing pipe-character
			return preg_match('/\s*\|\s*(.*)\|/', $item);
		}
        // The creation and destruction of ordered lists
        function handleOrderedList($currentLine, $prevLine, $nextLine) {
            $markdown = "";
            $value = preg_replace('/^\s*\d*\.\s*/','',$currentLine);
            $currentLineIndentation = substr_count($currentLine, ' ');
            $nextLineIndentation = substr_count($nextLine, ' ');
            //Open a new ordered list
            if(!isOrderdList($prevLine)) {
                $markdown .= "<ol>";
            }
            // Open a new sublist
            if($currentLineIndentation < $nextLineIndentation) {
                $markdown .= "<li>";
                $markdown .=  $value;
                // open sublist
                $markdown .= "<ol>";
            }
            // Close sublists
            else if($currentLineIndentation > $nextLineIndentation) {
                $markdown .= "<li>";
                $markdown .=  $value;
                $markdown .= "</li>";
                $sublistsToClose = ($currentLineIndentation - $nextLineIndentation) / 2;
                for($i = 0; $i < $sublistsToClose; $i++) {
                    $markdown .= "</ol></li>";
                }
            }
            // Stay in current list or sublist
            else {
                $markdown .= "<li>";
                $markdown .=  $value;
                $markdown .= "</li>";
            }
            // Close the ordered list
            if(!isOrderdList($nextLine)) {
                $markdown .= "</ol>";
            }
            return $markdown;
        }
        function handleUnorderedList($currentLine, $prevLine, $nextLine) {
            $markdown = "";
            $value = preg_replace('/^\s*[\-\*]\s*/','',$currentLine);
            $currentLineIndentation = substr_count($currentLine, ' ');
            $nextLineIndentation = substr_count($nextLine, ' ');
            //Open a new unordered list
            if(!isUnorderdList($prevLine)) {
                $markdown .= "<ul>";
            }
            // Open a new sublist
            if($currentLineIndentation < $nextLineIndentation) {
                $markdown .= "<li>";
                $markdown .=  $value;
                // open sublist
                $markdown .= "<ul>";
            }
            // Close sublists
            else if($currentLineIndentation > $nextLineIndentation) {
                $markdown .= "<li>";
                $markdown .=  $value;
                $markdown .= "</li>";
                $sublistsToClose = ($currentLineIndentation - $nextLineIndentation) / 2;
                for($i = 0; $i < $sublistsToClose; $i++) {
                    $markdown .= "</ul></li>";
                }
            }
            // Stay in current list or sublist
            else {
                $markdown .= "<li>";
                $markdown .=  $value;
                $markdown .= "</li>";
            }
            // Close the unordered list
            if(!isUnorderdList($nextLine)) {
                $markdown .= "</ul>";
            }
            return $markdown;
        }
        function handleTable($currentLine, $prevLine, $nextLine) {
            global $tableAlignmentConf;
            $markdown = "";

            $columns = array_values(array_map("trim", array_filter(explode('|', $currentLine), function($k) {
                return $k !== '';
            })));

            // open table
            if(!isTable($prevLine)) {
                $markdown .= "<table class='markdown-table'>";
            }

            // create thead
            if(!isTable($prevLine) && preg_match('/^\s*\|\s*[:]?[-]*[:]?\s*\|/', $nextLine)) {
                $markdown .= "<thead>";
                $markdown .= "<tr>";
                for($i = 0; $i < count($columns); $i++) {
                    $markdown .= "<th>".$columns[$i]."</th>";
                }
                $markdown .= "</tr>";
                $markdown .= "</thead>";
            }
            // create tbody
            else {
                // configure alignment
                if(preg_match('/^\s*\|\s*[:]?[-]*[:]?\s*\|/', $currentLine)) {
                    for($i = 0; $i < count($columns); $i++) {
                        // align center
                        if(preg_match('/[:][-]*[:]/', $columns[$i])) $tableAlignmentConf[$i] = 1;
                        // align right
                        else if(preg_match('/[-]*[:]/', $columns[$i])) $tableAlignmentConf[$i] = 2;
                        // align left
                        else $tableAlignmentConf[$i] = 3;
                    }
                }
                // handle table row
                else {
                    $markdown .= "<tr style=''>";

                    for($i = 0; $i < count($columns); $i++) {
                        $alignment = "";

                        if($tableAlignmentConf[$i] === 1) $alignment = "center";
                        else if($tableAlignmentConf[$i] === 2) $alignment = "right";
                        else $alignment = "left";

                        $markdown .= "<td style='text-align: " . $alignment . ";'>" . $columns[$i] . "</td>";
                    }
                    $markdown .= "</tr>";
                }
            }

            // close table
            if(!isTable($nextLine)) {
                $markdown .= "</tbody></table>";
            }
            
            return $markdown;
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
									if($file_extension=="html" || $file_extension=="css" || $file_extension=="js" || $file_extension=="php"){
											//$bummer=file_get_contents($file);
										    header('Content-Description: File Transfer');
										    header('Content-Type: application/octet-stream');
										    header('Content-Disposition: attachment; filename="'.basename($file).'"');
										    header('Expires: 0');
										    header('Cache-Control: must-revalidate');
										    header('Pragma: public');
										    header('Content-Length: ' . filesize($file));
										    readfile($file);
										    exit;
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
												default: $ctype=mime_content_type($file); break;
											}
											header("Content-Type: ".$ctype);
											header('Content-Disposition: inline; filename="' .$filename.'"');
											header('Content-Transfer-Encoding: binary');
											header('Accept-Ranges: bytes');
											@readfile($file);
											exit;
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
                    $temp = explode('.', $filename);
                    $ext  = array_pop($temp);
                    $name = implode('.', $temp);
						echo "<html>";
						echo "<head>";
						echo "<link rel='icon' type='image/ico' href='../Shared/icons/favicon.ico'/>";
						echo "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>";
						echo "<title>Document Viewer: $name</title>";
						echo "<link type='text/css' href='../Shared/css/style.css' rel='stylesheet'>";
						echo "<link type='text/css' href='../Shared/css/markdown.css' rel='stylesheet'>";
						echo "<link type='text/css' href='../Shared/css/jquery-ui-1.10.4.min.css' rel='stylesheet'>";  
						echo "<script src='../Shared/js/jquery-1.11.0.min.js'></script>";
						echo "<script src='../Shared/js/jquery-ui-1.10.4.min.js'></script>";
						echo "<script src='../Shared/dugga.js'></script>";
						echo "<script src='../Shared/markdown.js'></script>";				
						echo "</head>";
						echo "<body>";
				}
				
				if($hdrs=="none"){
					
				}else if($readfile == false){
					$noup="SECTION";
					include '../Shared/navheader.php';
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
