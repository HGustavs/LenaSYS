<?php
    session_start();
    include_once "../../coursesyspw.php";
    include_once "../Shared/sessions.php";
	include_once "../Shared/basic.php";
    pdoConnect();
	#general vars regarding current dugga.
	$cid=getOPG('courseid');
	$vers=getOPG('coursevers');
	$quizid=21;
    #vars for handling fetching of diagram variant file name
	$variantParams = "UNK";
	$fileContent="UNK";
	$splicedFileName = "UNK";

	#vars for handling fetching of diagram instruction file name and type
	$json = "UNK";
	$fileName = "UNK";
	$gFileName = "UNK";
	$instructions = "UNK";
	$information = "UNK";
	$finalArray = array();
	
	#create request to database and execute it
	$response = $pdo->prepare("SELECT param as jparam FROM variant LEFT JOIN quiz ON quiz.id = variant.quizID WHERE quizID = $quizid AND quiz.cid = $cid AND disabled = 0;");
	$response->execute();
	$i=0;

	#loop through responses, fetch param column in variant table, splice string to extract file name, then close request.
	#this should probably be re-worked as this foreach loops through all rows, but over-writes variables meaning it's only the latest variant version that's shown to the user.
	#another alternvative could be to add each result in an array and loop through the array in diagram.js to properly filter out wrong variant results.
	foreach($response->fetchAll(PDO::FETCH_ASSOC) as $row)
	{
		$variantParams=$row['jparam'];
		$variantParams = str_replace('&quot;','"',$variantParams);
		$parameterArray = json_decode($variantParams,true);

		//if parameter exists in current variant json param string, assign value. Otherwise, set it to "UNK". Error checking should check if string is "UNK" and "".
		if(!empty($parameterArray))
		{
			if(isset($parameterArray['diagram_File'])){
				$splicedFileName=$parameterArray["diagram_File"];}
			else{
				$splicedFileName = "UNK";}
			if(isset($parameterArray['filelink'])){
				$fileName=$parameterArray["filelink"];}
			else{
				$fileName = "UNK";}
			if(isset($parameterArray['type'])){
				$fileType=$parameterArray["type"];}
			else{
				$fileType = "UNK";}
			if(isset($parameterArray['gFilelink'])){
				$gFileName=$parameterArray["gFilelink"];}
			else{
				$gFileName = "UNK";}
			if(isset($parameterArray['gType'])){
				$gFileType=$parameterArray["gType"];}
			else{
				$gFileType = "UNK";}

			//for fetching file content. If file exists in directory path, fetch. Otherwise, go to the next directory and check.
			if(isset($fileName) && $fileName != "." && $fileName != ".." && $fileName != "UNK" && $fileName != "")
			{
				if(file_exists("../courses/global/"."$fileName")){
					$instructions = file_get_contents("../courses/global/"."$fileName");}
				else if(file_exists("../courses/".$cid."/"."$fileName")){
					$instructions = file_get_contents("../courses/".$cid."/"."$fileName");}
				else if(file_exists("../courses/".$cid."/"."$vers"."/"."$fileName")){
					$instructions = file_get_contents("../courses/".$cid."/"."$vers"."/"."$fileName");}
			}

			if(isset($gFileName) && $gFileName != "." && $gFileName != ".." && $gFileName != "UNK" && $gFileName != "")
			{
				if(file_exists("../courses/global/"."$gFileName")){
					$information = file_get_contents("../courses/global/"."$gFileName");}
				else if(file_exists("../courses/".$cid."/"."$gFileName")){
					$information = file_get_contents("../courses/".$cid."/"."$gFileName");}
				else if(file_exists("../courses/".$cid."/"."$vers"."/"."$gFileName")){
					$information = file_get_contents("../courses/".$cid."/"."$vers"."/"."$gFileName");}
			}

			#Think this removes certain escape string characters.
			$pattern = '/\s*/m';
			$replace = '';
			$instructions = preg_replace( $pattern, $replace,$instructions);
			$information = preg_replace( $pattern, $replace,$information);

			$finalArray[$i]=([$splicedFileName,$fileType,$fileName,$instructions, $gFileType, $gFileName, $information]);
			$i++;
		}
	}
	#closes pdo connection to database. Causes error if not used as query results are stockpiled and prevents next query usage.
	$response->closeCursor();

	#after itterating through query results, finally load the json file content into $fileContent variable.
	if($splicedFileName != "UNK" && isset($splicedFileName) && $splicedFileName != "." && $splicedFileName != ".." && $splicedFileName != "")
	{
		if(file_exists("../courses/global/"."$splicedFileName")){
			$fileContent = file_get_contents("../courses/global/"."$splicedFileName");}
		else if(file_exists("../courses/".$cid."/"."$splicedFileName")){
			$fileContent = file_get_contents("../courses/".$cid."/"."$splicedFileName");}
		else if(file_exists("../courses/".$cid."/"."$vers"."/"."$splicedFileName")){
			$fileContent = file_get_contents("../courses/".$cid."/"."$vers"."/"."$splicedFileName");}
	}

	if($fileContent === "UNK" || $fileContent === "")
		$fileContent = "NO_FILE_FETCHED";

?>

<!DOCTYPE html>
<html>
<head>
    <link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
    <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome = 1">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Diagram</title>
    <link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
    <link type="text/css" href="./diagram.css" rel="stylesheet">
    <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script src="../Shared/js/jquery-1.11.0.min.js"></script>
    <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
    <script src="../Shared/dugga.js"></script>
    <script src="../Shared/markdown.js"></script>
    <script src="diagram.js"></script>
    <script>
	/**
	 * @description get the contents of a instruction file
	 * @param fileName the name of the file t.ex. test.html
	 * */
	function getInstructions(fileName)
	{
        Array=<?php echo json_encode($finalArray);?>;
		if(Array.length > 0){
			for (let index = 0; index < Array.length; index++) {
				if(Array[index][2]==fileName){
                    if(Array[index][3] != null && Array[index][3] != "UNK"){
					    document.getElementById("assignment_discrb").innerHTML = Array[index][3];
                    }
				}
				if(Array[index][5]==fileName){
                    if(Array[index][6] != null && Array[index][6] != "UNK"){
					    document.getElementById("diagram_instructions").innerHTML =Array[index][6];
                    }
				}
			}
		}			
	}
	function getVariantParam()
	{
		var variantArray = [<?php echo "'$variantParams'"?>];
		variantArray.push(<?php echo "$cid"?>);
		variantArray.push(<?php echo "$vers"?>);
		variantArray.push(<?php echo "'$splicedFileName'"?>);
		variantArray.push(<?php echo "'$fileContent'"?>);
		return variantArray;
	} 
    </script>
</head>
<body onload="getData();addAlertOnUnload();" style="overflow: hidden;">

    <!-- Markdown document with keybinds -->
    <div id="markdownKeybinds" style="display: none">

    </div>

     <!-- Used for calculating pixels per millimeter using offsetWidth. Note that in offsetWidth system scaling is not included
    and window.devicePixelRatio have to be included -->
    <div id="pixellength" style="width:1000mm;;padding:0px;visibility:hidden;"></div>

    <!-- Toolbar for diagram -->
    <div id="diagram-toolbar" onmousedown='mdown(event)' onmouseup='tup();'>
        <fieldset>
            <legend>Modes</legend>
                <div id="mouseMode0" class="diagramIcons toolbarMode active" onclick='setMouseMode(0);'>
                    <img src="../Shared/icons/diagram_pointer_white.svg"/>
                    <span class="toolTipText"><b>Pointer</b><br>
                        <p>Allows you to select and move different elements as well as navigate the workspace</p><br>
                        <p id="tooltip-POINTER" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
                <div id="mouseMode1" class="diagramIcons toolbarMode" onclick='setMouseMode(1);'>
                    <img src="../Shared/icons/diagram_box_selection2.svg"/>
                    <span class="toolTipText"><b>Box Selection</b><br>
                        <p>Click and drag to select multiple elements within the selected area</p><br>
                        <p id="tooltip-BOX_SELECTION" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
                <div>
                    <div id="elementPlacement0" class="diagramIcons toolbarMode" onclick='setElementPlacementType(0); setMouseMode(2);' onmouseup='holdPlacementButtonUp();'><!--<-- UML functionality -->
                        <img src="../Shared/icons/diagram_entity.svg"/>
                        <span class="toolTipText"><b>Entity</b><br>
                            <p>Add an ER entity to the diagram</p><br>
                            <p id="tooltip-PLACE_ENTITY" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton0" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg"/>
                        </div>
                    </div>    
                    <div id="togglePlacementTypeBox0" class="togglePlacementTypeBox togglePlacementTypeBoxEntity"><!--<-- UML functionality start-->
                        <div class="placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(0,0); setElementPlacementType(0); setMouseMode(2);'>
                            <img src="../Shared/icons/diagram_entity.svg"/>
                            <span class="placementTypeToolTipText"><b>ER Entity</b><br>
                                <p>Change to ER entity</p>
                            </span>
                        </div>
                        <div class="placementTypeBoxIcons" onclick='togglePlacementType(4,0); setElementPlacementType(4); setMouseMode(2);'>
                            <img src="../Shared/icons/diagram_UML_entity.svg"/>
                            <span class="placementTypeToolTipText"><b>UML class</b><br>
                                <p>Change to UML class</p>
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <div id="elementPlacement4" class="diagramIcons toolbarMode" onclick='setElementPlacementType(4); setMouseMode(2);' onmouseup='holdPlacementButtonUp();'>
                        <img src="../Shared/icons/diagram_UML_entity.svg"/>
                        <span class="toolTipText"><b>Class</b><br>
                            <p>Add an UML class to the diagram</p><br>
                            <p id="tooltip-PLACE_ENTITY" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton4" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg"/>
                        </div>
                    </div>
                    <div id="togglePlacementTypeBox4" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                        <div class="placementTypeBoxIcons" onclick='togglePlacementType(0,0); setElementPlacementType(0); setMouseMode(2);'>
                            <img src="../Shared/icons/diagram_entity.svg"/>
                            <span class="placementTypeToolTipText"><b>ER Entity</b><br>
                                <p>Change to ER entity</p>
                            </span>
                        </div>
                        <div class="placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(4,0); setElementPlacementType(4); setMouseMode(2);' >
                            <img src="../Shared/icons/diagram_UML_entity.svg"/>
                            <span class="placementTypeToolTipText"><b>UML class</b><br>
                                <p>Change to UML class</p>
                            </span>
                        </div>
                    </div>
                </div><!--<-- UML functionality end -->
                <div>
                    <div id="elementPlacement1" class="diagramIcons toolbarMode" onclick='setElementPlacementType(1); setMouseMode(2);' onmouseup='holdPlacementButtonUp();'> <!--<-- UML functionality -->
                        <img src="../Shared/icons/diagram_relation.svg"/>
                        <span class="toolTipText"><b>Relation</b><br>
                            <p>Add a ER relation to the diagram</p><br>
                            <p id="tooltip-PLACE_RELATION" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton1" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg"/>
                        </div>
                    </div>    
                    <div id="togglePlacementTypeBox1" class="togglePlacementTypeBox togglePlacementTypeBoxRI"><!--<-- UML functionality start-->
                        <div class="placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(1,1); setElementPlacementType(1); setMouseMode(2);'>
                            <img src="../Shared/icons/diagram_relation.svg"/>
                            <span class="placementTypeToolTipText"><b>ER Relation</b><br>
                                <p>Change to ER relation</p>
                            </span>
                        </div>
                        <div class="placementTypeBoxIcons" onclick='togglePlacementType(5,1); setElementPlacementType(5); setMouseMode(2);'>
                            <img src="../Shared/icons/diagram_inheritance.svg"/>
                            <span class="placementTypeToolTipText"><b>UML Inheritance</b><br>
                                <p>Change to UML inheritance</p>
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <div id="elementPlacement5" class="diagramIcons toolbarMode" onclick='setElementPlacementType(5); setMouseMode(2);'onmouseup='holdPlacementButtonUp();'>
                        <img src="../Shared/icons/diagram_inheritance.svg"/>
                        <span class="toolTipText"><b>Inheritance</b><br>
                            <p>Add an UML inheritance to the diagram</p><br>
                            <p id="tooltip-PLACE_RELATION" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton5" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg"/>
                        </div>
                    </div>    
                    <div id="togglePlacementTypeBox5" class="togglePlacementTypeBox togglePlacementTypeBoxRI">
                        <div class="placementTypeBoxIcons" onclick='togglePlacementType(1,1); setElementPlacementType(1); setMouseMode(2);'>
                            <img src="../Shared/icons/diagram_relation.svg"/>
                            <span class="placementTypeToolTipText"><b>ER Relation</b><br>
                                <p>Change to ER relation</p>
                            </span>
                        </div>
                        <div class="placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(5,1); setElementPlacementType(5); setMouseMode(2);'>
                            <img src="../Shared/icons/diagram_inheritance.svg"/>
                            <span class="placementTypeToolTipText"><b>UML Inheritance</b><br>
                                <p>Change to UML inheritance</p>
                            </span>
                        </div>
                    </div>
                </div><!--<-- UML functionality end -->
                <div id="elementPlacement2" class="diagramIcons toolbarMode" onclick='setElementPlacementType(2); setMouseMode(2);'>
                    <img src="../Shared/icons/diagram_attribute.svg"/>
                    <span class="toolTipText"><b>Attribute</b><br>
                        <p>Add an ER attribute to the diagram</p><br>
                        <p id="tooltip-PLACE_ATTRIBUTE" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
                <div id="mouseMode3" class="diagramIcons toolbarMode" onclick='clearContext(); setMouseMode(3);'>
                    <img src="../Shared/icons/diagram_line.svg"/>
                    <span class="toolTipText"><b>Line</b><br>
                        <p>Make a line between elements</p><br>
                        <p id="tooltip-EDGE_CREATION" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
        </fieldset>
        <fieldset>
            <legend>Zoom</legend>
            <div class="diagramIcons" onclick='zoomin();'>
                <img src="../Shared/icons/diagram_zoomin.svg"/>
                <span class="toolTipText"><b>Zoom IN</b><br>
                    <p>Zoom in on viewed area</p><br>
                    <p id="tooltip-ZOOM_IN" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div class="diagramIcons" onclick='zoomout();'>
                <img src="../Shared/icons/diagram_zoomout.svg"/>
                <span class="toolTipText"><b>Zoom OUT</b><br>
                    <p>Zoom out on viewed area</p><br>
                    <p id="tooltip-ZOOM_OUT" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div class="diagramIcons" onclick="zoomreset()">
                <img src="../Shared/icons/diagram_zoomratio1to1.svg"/>
                <span class="toolTipText"><b>Zoom RESET</b><br>
                    <p>Reset the zoom to 1x</p><br>
                    <p id="tooltip-ZOOM_RESET" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset>
        <!--
         <fieldset>
            <legend>Toggle</legend>
            <div id="rulerToggle" class="diagramIcons active" onclick='toggleRuler()'>
                <img src="../Shared/icons/diagram_ruler.svg"/>
                <span class="toolTipText"><b>Toggle Ruler</b><br>
                    <p>Enable/disable the ruler</p><br>
                    <p id="tooltip-TOGGLE_RULER" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div id="a4TemplateToggle" class="diagramIcons" onclick="toggleA4Template()">
                <img src="../Shared/icons/diagram_a4.svg"/>
                <span class="toolTipText"><b>Toggle A4 template</b><br>
                    <p>Enable/disable the A4 template</p><br>
                    <p id="tooltip-TOGGLE_A4" class="key_tooltip">Keybinding:</p>
                </span>
            </div>

        </fieldset>  --> 
        <fieldset>
            <legend>Camera</legend>
            <div id="camtoOrigo" class="diagramIcons" onclick="centerCamera(); centerCamera();">
                <img src="../Shared/icons/fullscreen.svg"/>
                <span class="toolTipText"><b>Reset view</b><br>
                    <p>Reset view to show all elements</p><br>
                    <p id="tooltip-CENTER_CAMERA" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset>
        <fieldset>
            <legend>History</legend>
            <div id="erTableToggle" class="diagramIcons" onclick="refreshDiagram()">
                <img src="../Shared/icons/diagram_ER_table_info.svg"/>
                <span class="toolTipText"><b>Refresh Diagram</b><br>
                    <p>Click to reset the diagram to its original look</p><br>
                </span>
            </div>
            <div id="stepForwardToggle" class="diagramIcons" onclick="toggleStepForward()">
                <img src="../Shared/icons/diagram_stepforward.svg"/>
                <span class="toolTipText"><b>Redo</b><br>
                    <p>Redo last change</p><br>
                    <p id="tooltip-HISTORY_STEPFORWARD" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div id="stepBackToggle" class="diagramIcons" onclick="toggleStepBack()">
                <img src="../Shared/icons/diagram_stepback.svg"/>
                <span class="toolTipText"><b>Undo</b><br>
                    <p>Undo last change</p><br>
                    <p id="tooltip-HISTORY_STEPBACK" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div id="replayToggle" class="diagramIcons" onclick="toggleReplay()">
                <img src="../Shared/icons/diagram_replay.svg"/>
                <span class="toolTipText"><b>Enter replay mode</b><br>
                    <p>View history of changes made</p><br>
                    <p id="tooltip-TOGGLE_REPLAY_MODE" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset>
        <fieldset>
            <legend>ER-Table</legend>
            <div id="erTableToggle" class="diagramIcons" onclick="toggleErTable()">
                <img src="../Shared/icons/diagram_ER_table_info.svg"/>
                <span class="toolTipText"><b>Toggle ER-Table</b><br>
                    <p>Click to toggle ER-Table in options</p><br>
                    <p id="tooltip-TOGGLE_ER_TABLE" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset>     
        <fieldset id = "errorCheckField">
        <legend>Check</legend>
            <div id="errorCheckToggle" class="diagramIcons" onclick="toggleErrorCheck()">
                <img src="../Shared/icons/diagram_errorCheck.svg"/>
                <span class="toolTipText"><b>Toggle error check</b><br>
                    <p>Click to toggle error checking on/off</p><br>
                    <p id="tooltip-TOGGLE_ERROR_CHECK" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset>   
        <fieldset>
            <legend>Include</legend>
            <div id="Include" class="diagramIcons" onclick="toggleErTable()">
                <img src="../Shared/icons/angelBrackets.svg"/>
                <span class="toolTipText"><b>To use less than</b><br>
                    <p>To use less than type & #60; <br><strong>"EX: <& #60;Include>>"</STRONG> </p><br>
                </span>
        </fieldset>      
    </div>

    <!-- Message prompt -->
    <div id="diagram-message"></div>
    <div id ="zoom-message-box"><img width="25%" height="25%" src="../Shared/icons/zoom-message-icon.svg"/><text id ="zoom-message">1x</text></div>

    <!-- Diagram drawing system canvas. -->
    <svg id="svgoverlay" preserveAspectRatio="none"></svg>
    <div id="container" onmousedown='mdown(event)' onmouseup='mup(event)' onmousemove='mmoving(event)' onwheel='mwheel(event)'></div> <!-- Contains all elements (items) -->
     <!-- One svg layer for background stuff and one for foreground stuff -->
    <svg id="svgbacklayer" preserveAspectRatio="none"></svg>

	<canvas id='canvasOverlay'></canvas> 
    <!-- Diagram rules -->
    <div id="rulerOverlay">
        <div id="rulerCorner"></div>
        <svg id="ruler-x-svg"></svg>
        <svg id="ruler-y-svg"></svg>
        <div id="ruler-x"></div>
        <div id="ruler-y"></div>
    </div>
    
    <!-- Diagram grid -->
    <div id="svggrid" style="z-index:-11">
        <svg id="svgbacklayer">
            <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">

                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke="0.8 0.8" stroke-width="1"/>
            </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <line id="origoX" x1="0%" y1="100" x2="100%" y2="100" style="stroke:rgb(105, 105, 105);stroke-width:8;"/>
            <line id="origoY" x1="100" y1="0%" x2="100" y2="100%" style="stroke:rgb(105, 105, 105);stroke-width:8;"/>
        </svg>  
    </div>
    <!-- A4 template -->
    <div id="a4Template" style="z-index:-11">
        <svg id="svgA4Template">
            <rect id="a4Rect" x="100" y="100" width="794" height="1122" style="stroke:rgb(50, 50, 50);stroke-width:2" stroke-dasharray="5 3" fill="#ffffee" fill-opacity="0.4"/>
            <rect id="vRect" x="100" y="100" width="1122" height="794" style=" display:none; stroke:rgb(50, 50, 50);stroke-width:2" stroke-dasharray="5 3" fill="#ffffee" fill-opacity="0.4"/>
            <text id="a4Text" x="880" y="90">A4</text>
        </svg>  
    </div>  
    <div id="options-pane" class="hide-options-pane"> <!-- Yellow menu on right side of screen -->
        <div id="options-pane-button" onclick="toggleOptionsPane();"><span id='optmarker'>&#9660;Options</span>
            <span id="tooltip-OPTIONS" class="toolTipText"><b>Show Option Panel</b><br>
                <p>Enable/disable the Option Panel</p><br>
                <p id="tooltip-OPTIONS" class="key_tooltip">Keybinding:</p>
            </span>
        </div>
        <div id ="fieldsetBox">
            <fieldset id='propertyFieldset' class='options-fieldset options-fieldset-hidden' style="position: absolute;">
            </fieldset>

            <fieldset class='options-fieldset options-section' style='position: absolute;'>
                <legend>Toggle</legend>
                <button id="gridToggle" class="saveButton" onclick="toggleGrid();">Grid</button><br><br>
                <button id="rulerSnapToGrid" class="saveButton" onclick="toggleSnapToGrid()">Snap to grid</button><br><br>
                <button id="rulerToggle" class="saveButton" style="background-color:#362049;" onclick="toggleRuler()">Ruler</button><br><br>
                <button id="a4TemplateToggle" class="saveButton" onclick="toggleA4Template()">A4 template</button><br><br>
                <div id="a4Options" style="display:flex;">
                    <button id="a4VerticalButton" style="display:none; width:76px; margin-right:45%;" onclick="toggleA4Vertical()">Vertical</button>
                    <button id="a4HorizontalButton" style="display:none;" onclick="toggleA4Horizontal()">Horizontal</button>
                </div>
            </fieldset>
            <fieldset class='options-fieldset options-section' style='position: absolute; top: 33%;'>
                <legend>Export</legend>
                <button class="saveButton" onclick="exportWithHistory();">With history</button><br><br>
                <button class="saveButton" onclick="exportWithoutHistory();">Without history</button>
            </fieldset>
            <fieldset class='options-fieldset options-section' style="position: absolute; top: 48%; margin-top: 2%;">
                <legend>Import</legend>
                <input style="width: 100%" id="importDiagramFile" type="file"><br><br>
                <button class="saveButton" onclick="loadDiagram();">Load</button>
            </fieldset>
        </div>
    </div>
    </div>
    <!-- Replay-mode -->
    <div id="diagram-replay-box">
        <div style="display: flex;">
            <fieldset style="display: flex; justify-content: space-between">
                <div id="diagram-replay-switch">
                    <div class="diagramIcons" onclick="stateMachine.replay()">
                        <img src="../Shared/icons/Play.svg">
                        <span class="toolTipText" style="top: -80px"><b>Play</b><br>
                            <p>Play history of changes made to the diagram</p><br>
                        </span>
                    </div>
                </div>
                <div class="diagramIcons" onclick="stateMachine.replay(-1)">
                    <img src="../Shared/icons/replay.svg">
                    <span class="toolTipText" style="top: -80px"><b>Replay</b><br>
                        <p>Replay history of changes made to the diagram</p><br>
                    </span>
                </div>
                <div class="diagramIcons" onclick="exitReplayMode()">
                    <img src="../Shared/icons/exit.svg">
                    <span class="toolTipText" style="top: -95px"><b>Exit</b><br>
                        <p>Exit the replay-mode</p><br>
                        <p id="tooltip-ESCAPE" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
            </fieldset>
            <div style="width: 250px">
                <label id="replay-time-label" for="replay-time">Delay (1s)</label>
                <input id="replay-time" onchange="setReplayDelay(this.value)" class="zoomSlider" type="range" min="1" max="9" value="5">
            </div>

            <div>
                <label for="replay-range">Change</label>
                <input id="replay-range" class="zoomSlider" onchange="changeReplayState(parseInt(this.value))" type="range" min="-1" max="-1">
            </div>
        </div>
    </div>
    <div id="diagram-replay-message">
        <h2>Replay mode</h2>
        <p>Press "ESCAPE" to exit the replay-mode.</p>
    </div>
    <!-- content END -->
    <?php
        include '../Shared/loginbox.php';
        if(isset($_POST['id'])) {

        }

        if(isset($_POST['StringDiagram'])) {
            $str = $_POST['StringDiagram'];
            $hash = $_POST['Hash'];
            save($str,$hash);
        }
        function save($data, $hash) {
            $getID = fopen("Save/id.txt", "r");
            $a = intval(fread($getID,filesize("Save/id.txt")));
            $myfile = fopen("Save/$a/$hash.txt", "w");
            fwrite($myfile, $data);
        }
    ?>
</body>
</html>
