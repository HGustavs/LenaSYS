<?php
    session_start();
    include_once "../../coursesyspw.php";
    include_once "../Shared/sessions.php";
    pdoConnect();
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
    <script src="diagram.js"></script>
</head>
<body onload="getData()" style="overflow-y: hidden;">
    <?php
        $noup = "SECTION";
        $colors = '
            <option value=\'#64B5F6\'>Blue</option>
            <option value=\'#81C784\'>Green</option>
            <option value=\'#e6e6e6\'>Grey</option>
            <option value=\'#E57373\'>Red</option>
            <option value=\'#FFF176\'>Yellow</option>
            <option value=\'#FFB74D\'>Orange</option>
            <option value=\'#BA68C8\'>Purple</option>
            <option value=\'#ffffff\'>White</option>
            <option value=\'#000000\'>Black</option>
        ';

        $textSizes = '
            <option value=\'Tiny\'>Tiny</option>
            <option value=\'Small\'>Small</option>
            <option value=\'Medium\'>Medium</option>
            <option value=\'Large\'>Large</option>
        ';

        $fonts = '
            <option value=\'Arial\'>Arial</option>
            <option value=\'Courier New\'>Courier New</option>
            <option value=\'Impact\'>Impact</option>
            <option value=\'Calibri\'>Calibri</option>
        ';

        $cardinalitiesUML = '
            <option value=\'None\' selected>None</option>
            <option value=\'0..1\'>0..1</option>
            <option value=\'1..1\'>1..1</option>
            <option value=\'0..*\'>0..*</option>
            <option value=\'1..*\'>1..*</option>
        ';

        //Get all .txt files in folder templates/examplediagrams. Should be all example diagram files.
        $exampleDiagramFilePaths = glob('templates/example-diagram/*.txt');
    ?>

    <!-- Toolbar for diagram -->
    <div id="diagram-toolbar">
        <fieldset>
            <legend>Modes</legend>
            <div class="diagramIcons" onclick='setMouseMode(0);'>
                <img src="../Shared/icons/diagram_pointer.svg"/>
            </div>
            <div class="diagramIcons" onclick='setMouseMode(1);'>
                <img src="../Shared/icons/diagram_box_select.svg"/>
            </div>
            <div class="diagramIcons" onclick='setElementPlacementType(0); setMouseMode(2);'>
                <img src="../Shared/icons/diagram_entity.svg"/>
            </div>
            <div class="diagramIcons" onclick='setElementPlacementType(1); setMouseMode(2);'>
                <img src="../Shared/icons/diagram_relation.svg"/>
            </div>
            <div class="diagramIcons" onclick='setElementPlacementType(2); setMouseMode(2);'>
                <img src="../Shared/icons/diagram_attribute.svg"/>
            </div>
            <div class="diagramIcons" onclick='setMouseMode(3);'>
                <img src="../Shared/icons/diagram_line.svg"/>
            </div>
        </fieldset>
        <fieldset>
            <legend>Zoom</legend>
            <input class="zoomButtons" type="button" value="+" onclick='zoomin();' />
            <input class="zoomButtons" type="button" value="-" onclick='zoomout();' />
        </fieldset>
    </div>

    <!-- Message prompt -->
    <div id="diagram-message" onclick="this.style.display = 'none'">
        <span>This is a error. :)</span>
    </div>
    <!-- Diagram drawing system canvas. -->
    <div id="container" onmousedown='mdown(event)' onmouseup='mup(event)' onmousemove='mmoving(event)' onwheel='mwheel(event)'></div> <!-- Contains all elements (items) -->
     <!-- One svg layer for background stuff and one for foreground stuff -->
    <svg id="svgbacklayer" preserveAspectRatio="none"></svg>
    <svg id="svgoverlay" preserveAspectRatio="none"></svg>

	<canvas id='canvasOverlay'></canvas> 
    <!-- Diagram rules -->
    <div id="rulerOverlay">
        <svg id="ruler-x-svg"></svg>
        <svg id="ruler-y-svg"></svg>
        <div id="ruler-x"></div>
        <div id="ruler-y"></div>
    </div>
    <!-- Diagram grid -->
    <div id="svggrid">
        <svg id="svgbacklayer">
            <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)"/>
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke-dasharray="5,5" d="M5 20 l215 0" stroke-width="1"/>
            </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>  
    </div> 
    <div id="fab" onclick="fab_action();">+</div> <!-- Big (+) button -->
    <div id="options-pane" class="hide-options-pane"> <!-- Yellow menu on right side of screen -->
        <div id="options-pane-button" onclick="fab_action();"><span id='optmarker'>&#9660;Options</span></div>
        <div>
            <fieldset id='cursorModeFieldset'>
                <p id="text_currentlyPlacing">Now placing: NULL</p><br>
                <input class="paneButtons" id="gridButton" type="button" value="Enable Grid" onclick='enableGrid()' /><br>
            </fieldset>
            <fieldset id='propertyFieldset'>
                
            </fieldset>
        </div>
    </div>
    </div>

    <!-- The Appearance menu. Default state is display: none; -->
    <div id="appearance" class='loginBoxContainer'>
        <div id="appearanceFormContainer" class='loginBox'>
            <div class='loginBoxheader'>
                <h3 id='loginBoxTitle'>Appearance</h3>
                <div class='cursorPointer' onclick='toggleApperanceElement();'>
                    x
                </div>
            </div>
            <div class='table-wrap'>
                <div id="appearanceForm">
                    <!-- -1->Global, 0->Free draw, 1->UML, 2->Attribute, 3->Entity, 4->Line, 5->Relation, 6->Text, 7-UML-line -->
                    <div class="form-group" data-types="1,2,3,5">
                        <label for="name">Name:</label>
                        <input type="text" id="name" data-access="name">
                    </div>
                    <div class="form-group" data-types="2">
                        <label for="typeAttribute">Attribute type:</label>
                        <select id="typeAttribute" data-access="properties.key_type">
                            <option value="Normal" selected>Normal</option>
                            <option value="Primary key">Primary key</option>
                            <option value="Partial key">Partial key</option>
                            <option value="Multivalue">Multivalue</option>
                            <option value="Derive">Derive</option>
                        </select>
                    </div>
                    <div class="form-group" data-types="3,5">
                        <label for="typeEntityRelation">Entity/relation type:</label>
                        <select id="typeEntityRelation" data-access="properties.key_type">
                            <option value="Normal" selected>Strong</option>
                            <option value="Weak">Weak</option>
                        </select>
                    </div>
                    <div class="form-group" data-types="4">
                        <label for="typeLine">ER line type:</label>
                        <select id="typeLine" data-access="properties.key_type">
                            <option value="Normal" selected>Normal</option>
                            <option value="Forced">Forced</option>
                            <option value="Derived">Derived</option>
                        </select>
                        <div class="form-group" data-types="4,7">
                            <label for="LinePlacement">Line placement:</label>
                            <label for="LinePlacement1" id="lineObject1">Object 1:</label>
                            <select id="LinePlacement1" data-access="properties.line_placement1">
                                <option value="Automatic1" selected>Automatic</option>
                                <option value="Top1">Top</option>
                                <option value="Right1">Right</option>
                                <option value="Bottom1">Bottom</option>
                                <option value="Left1">Left</option>
                            </select>
                            <label for="LinePlacement2" id="lineObject2">Object 2:</label>
                            <select id="LinePlacement2" data-access="properties.line_placement2">
                                <option value="Automatic2" selected>Automatic</option>
                                <option value="Top2">Top</option>
                                <option value="Right2">Right</option>
                                <option value="Bottom2">Bottom</option>
                                <option value="Left2">Left</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group" data-types="7">
                        <label for="typeLineUML">UML line type:</label>
                        <select id="typeLineUML" data-access="properties.key_type">
                            <option value="Normal" selected>Normal</option>
                            <option value="Association">Association</option>
                            <option value="Inheritance">Inheritance</option>
                            <option value="Implementation">Implementation</option>
                            <option value="Dependency">Dependency</option>
                            <option value="Aggregation">Aggregation</option>
                            <option value="Composition">Composition</option>
                        </select>
                    </div>
                    <div class="form-group" data-types="1,2,3,5" data-advanced>
                        <label for="backgroundColor">Background color:</label>
                        <select id="backgroundColor" data-access="properties.fillColor"><?=$colors;?></select>
                    </div>
                    <div class="form-group" data-types="0">
                        <label for="fillColor">Fill color:</label>
                        <select id="fillColor" data-access="fillColor"><?=$colors;?></select>
                    </div>
                    <div class="form-group" data-types="6">
                        <label for="freeText">Text:</label>
                        <textarea id="freeText" data-access="textLines"></textarea>
                    </div>
                    <div class="form-group" data-types="1,2,3,5,6" data-advanced>
                        <label for="fontFamily">Font family:</label>
                        <select id="fontFamily" data-access="properties.font"><?=$fonts?></select>
                    </div>
                    <div class="form-group" data-types="1,2,3,5,6" data-advanced>
                        <label for="fontColor">Font color:</label>
                        <select id="fontColor" data-access="properties.fontColor"><?=$colors;?></select>
                    </div>
                    <div class="form-group" data-types="1,2,3,5,6" data-advanced>
                        <label for="textSize">Text size:</label>
                        <select id="textSize" data-access="properties.sizeOftext"><?=$textSizes;?></select>
                    </div>
                    <div class="form-group" data-types="1,2,3,4,5,7,0" data-advanced>
                        <label for="lineColor">Line color:</label>
                        <select id="lineColor" data-access="properties.strokeColor"><?=$colors;?></select>
                    </div>
                    <div class="form-group" data-types="0,1,2,3,5,6">
                        <label for="objectLayer">Write to layer:</label>
                        <select id="objectLayer" data-access="properties.setLayer"></select>
                    </div>
                    <div class="form-group" data-types="6">
                        <label for="textAlignment">Text alignment:</label>
                        <select id="textAlignment" data-access="properties.textAlign">
                            <option value="start">Left</option>
                            <option value="center" selected>Center</option>
                            <option value="end">Right</option>
                        </select>
                    </div>
                    <div class="form-group" data-types="7">
                        <label for="lineDirection">UML line direction:</label>
                        <select id="lineDirection" data-access="lineDirection">
                            <option value="First"></option>
                            <option value="Second"></option>
                        </select>
                    </div>
                    <div class="form-group" data-types="4">
                        <label for="cardinalityER">ER cardinality:</label>
                        <select id="cardinalityER" data-access="cardinality.value">
                            <option value="None" selected>None</option>
                            <option value="1">1</option>
                            <option value="N">N</option>
                            <option value="M">M</option>
                        </select>
                    </div>
                    <div class="form-group" data-types="7">
                        <label for="cardinalityUMLFirst">UML cardinality first:</label>
                        <select id="cardinalityUMLFirst" data-access="cardinality.value"><?=$cardinalitiesUML;?></select>
                    </div>
                    <div class="form-group" data-types="7">
                        <label for="cardinalityUMLSecond">UML cardinality second:</label>
                        <select id="cardinalityUMLSecond" data-access="cardinality.valueUML"><?=$cardinalitiesUML;?></select>
                    </div>
                    <div class="form-group" data-types="1">
                        <label for="umlAttributes">Attributes:</label>
                        <textarea id="umlAttributes" data-access="attributes"></textarea>
                    </div>
                    <div class="form-group" data-types="1">
                        <label for="umlOperations">Operations:</label>
                        <textarea id="umlOperations" data-access="operations"></textarea>
                    </div>
                    <div class="form-group" data-types="0">
                        <label for="figureOpacity">Opacity:</label>
                        <input type="range" id="figureOpacity" data-access="opacity">
                    </div>
                    <div class="form-group" data-types="0,1,2,3,4,5,7" data-advanced>
                        <label for="lineThickness">Line thickness:</label>
                        <input type="range" id="lineThickness" min="1" max="4" value="2" data-access="properties.lineWidth">
                    </div>	
                    <div class="form-group" data-types="-1" data-subtypes="1,2,3,5">
                        <label for="backgroundColorGlobal">Background color:</label>
                        <select id="backgroundColorGlobal" data-access="properties.fillColor"><?=$colors;?></select>
                    </div>
                    <div class="form-group" data-types="-1" data-subtypes="1,2,3,5,6">
                        <label for="fontFamilyGlobal">Font family:</label>
                        <select id="fontFamilyGlobal" data-access="properties.font"><?=$fonts?></select>
                    </div>
                    <div class="form-group" data-types="-1" data-subtypes="1,2,3,5,6">
                        <label for="fontColorGlobal">Font color:</label>
                        <select id="fontColorGlobal" data-access="properties.fontColor"><?=$colors;?></select>
                    </div>
                    <div class="form-group" data-types="-1" data-subtypes="1,2,3,5,6">
                    <label for="textSizeGlobal">Text size:</label>
                    <select id="textSizeGlobal" data-access="properties.sizeOftext"><?=$textSizes;?></select>
                    </div>
                    <div class="form-group" data-types="-1" data-subtypes="0,1,2,3,4,5,7">
                        <label for="lineColorGlobal">Line color:</label>
                        <select id="lineColorGlobal" data-access="properties.strokeColor"><?=$colors;?></select>
                    </div>
                    <div class="form-group" data-types="-1" data-subtypes="0,1,2,3,4,5,7">
                        <label for="lineThicknessGlobal">Line thickness:</label>
                        <input type="range" id="lineThicknessGlobal" min="1" max="4" value="2" data-access="properties.lineWidth">
                    </div>	
					<div class="form-group" data-types="6">
						<label for="commentCheck">Comment</label>
						<input type="checkbox" id="commentCheck" data-access="properties.isComment" />
					</div>
                    <div id="appearanceButtonContainer">
                        <input type="submit" class="submit-button" value="Ok">
                    </div>				
                </div>
            </div>
        </div>
    </div>
    <!-- The import menu. Default state is display: none; -->
    <div id="import" class='loginBoxContainer importDiagram'>
        <div class='loginBox' style="width:40%">
            <div class='loginBoxheader'>
                <h3>Import</h3>
                <div class='cursorPointer' onclick='closeImportDialog();'>
                    x
                </div>
            </div>
            <div class='table-wrap'>
                <div class="importWrap">
                    <div style="width:100%;">
                        <input type="file" class="import-file-button" id="importFile" accept=".txt, text/plain"  />
                        <label for="importFile" id="importLabel" class="submit-button custom-file-upload" style="width:100%">Choose a file</label>
                    </div>
                    <div id="importError" class="importError">
                        <span>Only .txt-files allowed</span>
                    </div>
                    <div id="importButtonWrap" class="importButtonWrap">
                        <input type="submit" id="file-submit-button" class="submit-button uploadButton" onclick="importFile();" value="Upload diagram" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- The key shortcut menu. Default state is display: none; -->
    <div id="edit-shortcuts" class='loginBoxContainer shortcutsDiagram'>
        <div class='shortcuts-box'>
            <div class='loginBoxheader'>
                <h3>Edit shortcuts</h3>
                <div class='cursorPointer' onclick='closeShortcutsDialog();'>
                    x
                </div>
            </div>
            <div class='table-wrap'>
                <div id="shortcuts-wrap" class="shortcuts-wrap">
                </div>
            </div>
        </div>
    </div>
    <!-- Confirm mode-switch dialog  -->
    <div id="modeSwitchDialog" class='loginBoxContainer importDiagram'>
        <div class='loginBox modeSwitchContainer'>
            <div class='loginBoxheader modeSwitchHeader'>
                <h3 id="modeSwitchTarget"></h3>
                <div class='cursorPointer' onclick='closeModeSwitchDialog();'>
                    x
                </div>
            </div>
            <div class='mode-wrap'>
                <div id="modeSwitchButton1" class="importButtonWrap">
                    <button id="modeSwitchButtonAccept" type="button" class="buttonStyleDialog" onclick="switchMode(false);">Accept</button>
                </div>
                <div id="modeSwitchButton2" class="importButtonWrap">
                    <button id="modeSwitchButtonCancel" type="button" class="buttonStyleDialog" onclick="closeModeSwitchDialog();">Cancel</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Fullscreen toggle dialog -->
    <div id="fullscreenDialog" class='loginBoxContainer importDiagram'>
        <div class='loginBox fullscreenContainer'>
            <div class='loginBoxheader fullscreenHeader'>
                <h3 id="fullscreenHeaderText">Fullscreen enabled</h3>
            </div>
            <div class='fullscreen-wrap'>
                To exit, press <b>Escape</b> or <b>Shift + F11</b>.
                <br>Hide/show toolbar by pressing <b>T</b>.
                <!-- <br>To show/hide toolbar, press... 
                <div class="fullscreenCheckbox">
                    <label>
                        <input type="checkbox"> Don't show this again!
                    </label>
                </div>
                *This will be implemented later*-->
                <div id="fullscreenOkButton">
                    <button id="fullscreenButtonAccept" type="button" class="buttonStyleDialog" onclick="closeFullscreenDialog();">Ok</button>
                </div>
            </div>
        </div>
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
