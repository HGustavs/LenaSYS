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
    <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script src="../Shared/js/jquery-1.11.0.min.js"></script>
    <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
    <script src="../Shared/dugga.js"></script>
    <script src="diagram.js"></script>
    <script src="diagram_objects.js"></script>
    <script src="diagram_IOHandler.js"></script>

    <!--this script fix so that the drop down menus close after you have clicked on something on them.-->
    <script>
        $(document).ready(function() {
            $(".menu-drop-down").hover(function() {
                $(this).find(".drop-down").show();
            }, function() {
                $(this).find(".drop-down").hide();
            });
            $(".drop-down-item").click(function() {
                $(this).closest(".drop-down").hide();
            });
        });
    </script>
</head>
<body onload="init();" style="overflow-y: hidden;">
    <?php
        $noup = "SECTION";
        include '../Shared/navheader.php';
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

    <div id="diagram-header">
        <div id=diagram-toolbar-switcher>DEV: All</div>
        <div id="diagram-toolbar-container">
            <div class="menu-drop-down" tabindex="0">
                <span class="drop-down-label">File</span>
                <div class="drop-down">
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option">Save</span>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option">Load</span>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick="openImportDialog();">Import</span>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" id="exportid">Export...</span>
                        <div class="side-drop-down">
                            <div class="drop-down-item" tabindex="0">
                                <a class="drop-down-option" id="fileid" onclick='SaveFile(this);'>Export JSON</a>
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <a class="drop-down-option" id="svgid" onclick='ExportSVG(this);'>Export SVG</a>
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <a class="drop-down-option" id="picid" onclick='ExportPicture(this);'>Export Picture</a>
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <a class="drop-down-option" id="svgidPaper" onclick='ExportSVGA4(this);'>Export as A4 size(SVG)</a>
                            </div>
                        </div>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick="printDiagram();">Print Diagram</span>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick='clearCanvas(); removeLocalStorage();'>Clear Diagram</span>
                        <i class="hot-key">Ctrl + A, Delete</i>
                    </div>
                </div>
            </div>
            <div class="menu-drop-down" tabindex="0">
                <span class="drop-down-label">Edit</span>
                <div class="drop-down">
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick='undoDiagram(event)'>Undo</span>
                        <i class="hot-key">Ctrl + Z</i>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick='redoDiagram(event)'>Redo</span>
                        <i class="hot-key">Ctrl + Y</i>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick='loadGlobalAppearanceForm();'>Global Appearance</span>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="change-appearance-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick='loadAppearanceForm();'>Change Appearance</span>
                        </div>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="move-selected-front-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick='moveToFront(event)'>Move selected to front</span>
                            <i class="hot-key">Shift + 1</i>
                        </div>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="move-selected-back-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick='moveToBack(event)'>Move selected to back</span>
                            <i class="hot-key">Shift + 2</i>
                        </div>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="lock-selected-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick='lockSelected(event)'>Lock/Unlock selected</span>
                            <i class="hot-key">Shift + X</i>
                        </div>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="delete-object-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick='eraseSelectedObject(event);'>Delete Object</span>
                            <i class="hot-key">Delete/Backspace</i>
                        </div>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="group-objects-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick='addGroupToSelected(event)'>Group objects</span>
                        </div>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="ungroup-objects-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick='removeGroupFromSelected(event)'>Ungroup objects</span>
                        </div>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick='resetViewToOrigin(event);'>Reset view to origin</span>
                        <i class="hot-key">Shift + O</i>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick="openShortcutsDialog(event);">Edit keyboard shortcuts</span>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick='disableShortcuts(event);'>Disable keyboard shortcuts</span>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick='resetShortcuts(event);'>Reset keyboard shortcuts</span>
                    </div>
                </div>
            </div>
            <div class="menu-drop-down" tabindex="0">
                <span class="drop-down-label">View</span>
                <div class="drop-down">
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick='switchMode(true);'>Developer mode</span>
                        <i class="hot-key hot-key-tick">Shift + D</i>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="displayAllTools" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick="switchToolbarDev(event);"><img src="../Shared/icons/Arrow_down_right.png">Display All Tools</span>
                        </div>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div id="er-item" class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick="switchToolbarTo('ER');">ER mode</span>
                        <i class="hot-key hot-key-tick">Shift + M</i>
                    </div>
                    <div id="uml-item" class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick="switchToolbarTo('UML');">UML mode</span>
                        <i class="hot-key hot-key-tick">Shift + M</i>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick="toggleVirtualPaper(event)">Display Virtual Paper</span>
                        <i class="hot-key hot-key-tick">Shift + 4</i>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" id="paperid">Paper size...</span>
                        <div class="side-drop-down">
                        <div class="drop-down-item" tabindex="0">
                            <a class="drop-down-option" id="A0" onclick='setPaperSize(event, 0);'>A0</a>
                        </div>
                        <div class="drop-down-item" tabindex="0">
                            <a class="drop-down-option" id="A1" onclick='setPaperSize(event, 1);'>A1</a>
                        </div>
                        <div class="drop-down-item" tabindex="0">
                            <a class="drop-down-option" id="A2" onclick='setPaperSize(event, 2);'>A2</a>
                        </div>
                        <div class="drop-down-item" tabindex="0">
                            <a class="drop-down-option" id="A3" onclick='setPaperSize(event, 3);'>A3</a>
                        </div>
                        <div class="drop-down-item" tabindex="0">
                            <a class="drop-down-option" id="A4" onclick='setPaperSize(event, 4);'>A4</a>
                        </div>
                        <div class="drop-down-item" tabindex="0">
                            <a class="drop-down-option" id="A5" onclick='setPaperSize(event, 5);'>A5</a>
                        </div>
                        <div class="drop-down-item" tabindex="0">
                            <a class="drop-down-option" id="A6" onclick='setPaperSize(event, 6);'>A6</a>
                        </div>
                        </div>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="Paper-single-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick='togglesinglePaper(event);'><img src="../Shared/icons/Arrow_down_right.png">Single Paper</span>
                        </div>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="Paper-orientation-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick='togglePaperOrientation(event);'><img src="../Shared/icons/Arrow_down_right.png">Toggle Paper Orientation</span>
                        </div>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="Paper-pagenumber-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick='togglePagenumbers(event);'><img src="../Shared/icons/Arrow_down_right.png">Toggle Pagenumbers</span>
                        </div>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="Paper-holes-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick='toggleVirtualPaperHoles(event);'><img src="../Shared/icons/Arrow_down_right.png">Toggle Paper Holes</span>
                        </div>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="Paper-holes-item-right" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick='toggleVirtualPaperHolesRight(event);'><img src="../Shared/icons/Arrow_down_right.png">Paper Holes Right</span>
                        </div>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick='toggleComments(event);'>Hide Comments</span>                       
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick="toggleFullscreen();">Fullscreen</span>
                        <i class="hot-key hot-key-tick">Shift + F11</i>           
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick="toggleRulers();">Rulers</span>        
                    </div>
                </div>
            </div>
            <div class="menu-drop-down" tabindex="0">
                <span class="drop-down-label">Align</span>
                <div class="drop-down">
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick="toggleGrid(event);">Snap to grid</span>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="align-top-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick="align(event, 'top');">Top</span>
                            <i class="hot-key">Shift + ▲</i>
                        </div>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="align-right-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick="align(event, 'right');">Right</span>
                            <i class="hot-key">Shift + ►</i>
                        </div>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="align-bottom-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick="align(event, 'bottom');">Bottom</span>
                            <i class="hot-key">Shift + ▼ </i>
                        </div>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="align-left-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick="align(event, 'left');">Left</span>
                            <i class="hot-key">Shift + ◄ </i>
                        </div>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="horizontal-c-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick="align(event, 'horizontalCenter');">Horizontal center</span>
                        </div>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="vertical-c-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick="align(event, 'verticalCenter');">Vertical center</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="menu-drop-down">
                <span class="drop-down-label" tabindex="0">Distribute</span>
                <div class="drop-down">
                    <div class="drop-down-item" tabindex="0">
                        <div id="distribute-horizontal-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick="distribute(event, 'horizontally');">Horizontal</span>
                        </div>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <div id="distribute-vertical-item" class="drop-down-item-disabled">
                            <span class="drop-down-option" onclick="distribute(event, 'vertically');">Vertical</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="menu-drop-down">
                <span class="drop-down-label" tabindex="0">Help</span>
                <div class="drop-down">
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick="toggleCameraView(event);">Move camera</span>
                        <i class="hot-key">Blankspace</i>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-text-non-clickable" tabindex="0">
                        <span class="drop-down-option">Select multiple objects</span>
                        <i class="hot-key">Ctrl + leftclick</i>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option">Generate example diagrams</span>
                        <div class="side-drop-down">
                            <?php foreach($exampleDiagramFilePaths as $filePath): ?>
                                <div class="drop-down-item" tabindex="0">
                                    <span class="drop-down-option" onclick="generateExampleCode('<?=$filePath;?>');">Generate <?=basename($filePath);?></span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>
            <div class="menu-drop-down">
                <span class="drop-down-label" tabindex="0">View layer</span>
                <div class="drop-down">
                    <div id="viewLayer">
                        <div class="drop-down-item" tabindex="0">
                            <span class="isActive drop-down-option" onclick="toggleBackgroundLayer(this)" id="Layer_1">Layer One</span>
                        </div>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick="createLayer()">Create Layer</span>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick="deleteLayerView()">Delete selected layers</span>
                    </div>
                </div>
            </div>
            <div class="menu-drop-down">
                <span class="drop-down-label" tabindex="0">Write to layer</span>
                <div class="drop-down">
                    <div id="layerActive">
                        <div class="drop-down-item" tabindex="0">
                            <span class="isActive drop-down-option" onclick="toggleBackgroundLayer(this)" id="Layer_1_Active">Layer One</span>
                        </div>
                    </div>
                    <div class="drop-down-divider">
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick="createLayer()">Create Layer</span>
                    </div>
                    <div class="drop-down-item" tabindex="0">
                        <span class="drop-down-option" onclick="deleteLayerActive()">Delete selected layers</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="errorBox">
            <span id="errorMSG"></span>
        </div>
    </div>
    <div id="diagram-container">
        <div id="diagram-sidebar-container">
            <div id="diagram-tools-container">
                <div class="diagram-sidebar-section">
                    <div class="diagram-sidebar-label">Tools</div>
                    <button id='attributebutton' onclick='setMode("CreateERAttr");' class='diagram-tools-button diagram-tools-button-big unpressed' data="Create Attribute (Shift + A)">
                        <img src="../Shared/icons/diagram_create_attribute.svg">
                    </button>
                    <button id='entitybutton' onclick='setMode("CreateEREntity");' class='diagram-tools-button diagram-tools-button-big unpressed' data="Create Entity (Shift + E)">
                        <img src="../Shared/icons/diagram_create_entity.svg">
                    </button>
                    <button id='relationbutton' onclick='setMode("CreateERRelation");' class='diagram-tools-button diagram-tools-button-big unpressed' data="Create Relation (Shift + R)">
                        <img src="../Shared/icons/diagram_create_relation.svg">
                    </button>
                    <button id='classbutton' onclick='setMode("CreateClass");' class='diagram-tools-button diagram-tools-button-big unpressed' data="Create Class (Shift + C)">
                        <img src="../Shared/icons/diagram_create_class.svg">
                    </button>
                    <button id='linebutton' onclick='setMode("CreateLine");' class='diagram-tools-button diagram-tools-button-big unpressed' data="Create Line (Shift + L)">
                        <img src="../Shared/icons/diagram_create_line.svg">
                    </button>
                    <button id='drawfreebutton' onclick="setMode('Free');" class='diagram-tools-button diagram-tools-button-big unpressed' data="Draw Free (Shift + F)">
                        <img src="../Shared/icons/diagram_draw_free.svg">
                    </button>
                    <button id='drawtextbutton' onclick="setMode('Text');" class='diagram-tools-button diagram-tools-button-big unpressed' data="Draw Text (Shift + T)">
                        <img class="invert-color" src="../Shared/icons/textbox.svg">
                    </button>
                </div>
                <div class="diagram-sidebar-section">
                    <div class="diagram-sidebar-label">Undo/Redo</div>
                    <div id="diagram-undo-redo-container">
                        <button id="undoButton" onclick="undoDiagram(event)" class="diagram-tools-button diagram-tools-button-small" data="Undo (Ctrl + Z)">
                            <img class="invert-color" src="../Shared/icons/undo.svg">
                        </button>
                        <button id="redoButton" onclick="redoDiagram(event)" class="diagram-tools-button diagram-tools-button-small" data="Redo (Ctrl + Y)">
                            <img class="invert-color" src="../Shared/icons/redo.svg">
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div id="ruler-y" class="ruler hidden">
            <div class="ruler-lines"></div>
            <div class="ruler-extra-lines">
                <div class="mouse-line"></div>
            </div>
        </div>
        <div id="diagram-content">
            <div id="ruler-x" class="ruler hidden">
                <div class="ruler-lines"></div>
                <div class="ruler-extra-lines">
                    <div class="mouse-line"></div>
                </div>
            </div>
            <div id="diagram-canvas-container">
                <canvas id="diagram-canvas"></canvas>
                <button id='moveButton' class='unpressed' title="Move Around">
                    <img src="../Shared/icons/diagram_move_arrows.svg">
                </button> 
                <div id="valuesCanvas"></div>
                <div id="selectDiv">
                    <span class="tooltipDecrease">
                        <button name="Zoom" id="zoomDecrease" class="zoomButtonStyle" type="button" onclick="changeZoom(-0.1, event);">-</button>
                        <span class="tooltiptextDec">Zoom Out</span>
                    </span>
                    <span id="range">
                        <input name="Zoom" id="ZoomSelect" type="range" oninput="zoomInMode(event);" onchange="zoomInMode(event);" min="0.1" max="2" value="1" step="0.01" class="zoomSlider">
                    </span>
                    <span class="tooltipIncrease">
                        <button name="Zoom" id="zoomIncrease" class="zoomButtonStyle" type="button" onclick="changeZoom(0.1, event);">+</button>
                        <span class="tooltiptextInc" style="right: 68px">Zoom In</span>
                    </span>
                    <span id="zoomV"></span>
                </div>
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
                        <label for="typeLine">Line placement:</label>
                        <label for="typeLine" id="lineObject1">Object 1:</label>
                        <select id="linePlacementObject1" data-access="properties.key_type">
                            <option value="Automatic" selected>Automatic</option>
                            <option value="Top">Top</option>
                            <option value="Right">Right</option>
                            <option value="Bottom">Bottom</option>
                            <option value="Left">Left</option>
                        </select>
                        <label for="typeLine" id="lineObject2">Object 2:</label>
                        <select id="linePlacementObject2" data-access="properties.key_type">
                            <option value="Automatic" selected>Automatic</option>
                            <option value="Top">Top</option>
                            <option value="Right">Right</option>
                            <option value="Bottom">Bottom</option>
                            <option value="Left">Left</option>
                        </select>
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
                    <div class="form-group" data-types="2,3,5">
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
                    <div class="form-group" data-types="2,3,5,6">
                        <label for="fontFamily">Font family:</label>
                        <select id="fontFamily" data-access="properties.font"><?=$fonts?></select>
                    </div>
                    <div class="form-group" data-types="2,3,5,6">
                        <label for="fontColor">Font color:</label>
                        <select id="fontColor" data-access="properties.fontColor"><?=$colors;?></select>
                    </div>
                    <div class="form-group" data-types="2,3,5,6">
                        <label for="textSize">Text size:</label>
                        <select id="textSize" data-access="properties.sizeOftext"><?=$textSizes;?></select>
                    </div>
                    <div class="form-group" data-types="2,3,5,0">
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
                    <div class="form-group" data-types="-1">
                        <label for="backgroundColorGlobal">Background color:</label>
                        <select id="backgroundColorGlobal" data-access="properties.fillColor"><?=$colors;?></select>
                    </div>
                    <div class="form-group" data-types="-1">
                        <label for="fontFamilyGlobal">Font family:</label>
                        <select id="fontFamilyGlobal" data-access="properties.font"><?=$fonts?></select>
                    </div>
                    <div class="form-group" data-types="-1">
                        <label for="fontColorGlobal">Font color:</label>
                        <select id="fontColorGlobal" data-access="properties.fontColor"><?=$colors;?></select>
                    </div>
                    <div class="form-group" data-types="-1">
                    <label for="textSizeGlobal">Text size:</label>
                    <select id="textSizeGlobal" data-access="properties.sizeOftext"><?=$textSizes;?></select>
                    </div>
                    <div class="form-group" data-types="-1">
                        <label for="lineColorGlobal">Line color:</label>
                        <select id="lineColorGlobal" data-access="properties.strokeColor"><?=$colors;?></select>
                    </div>
                    <div class="form-group" data-types="-1">
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
