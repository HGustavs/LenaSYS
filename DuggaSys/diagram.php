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
    ?>
    <!-- content START -->
    <div id="contentDiagram">
        <div id="buttonDiv">
            <div class="document-settings">
                <div id="diagram-toolbar" class="application-toolbar-wrap">
                    <div class='application-toolbar'>
                        <div id="toolbar-switcher">
                            <div id="toolbarTypeText">Dev</div>
                            </div>
                            <div class="toolsContainer">
                                <div class="labelToolContainer">
                                    <h4 class="label tlabel" id="labelTools" style ="text-align: center">Tools</h4>
                                    <div class="toolbar-drawer" id="drawerCreate">
                                        <div class="tooltipdialog">
                                            <!-- ER attribute -->
                                            <button id='attributebutton' onclick='setMode("CreateERAttr");' class='buttonsStyle unpressed' data="Create Attribute (Shift + A)">
                                                <img class="toolboxButtons" src="../Shared/icons/diagram_create_attribute.svg">
                                            </button>
                                            <!-- ER entity -->
                                            <button id='entitybutton' onclick='setMode("CreateEREntity");' class='buttonsStyle unpressed' data="Create Entity (Shift + E)">
                                                <img class="toolboxButtons" src="../Shared/icons/diagram_create_entity.svg">
                                            </button>
                                            <!-- ER Relation -->
                                            <button id='relationbutton' onclick='setMode("CreateERRelation");' class='buttonsStyle unpressed' data="Create Relation (Shift + R)">
                                                <img class="toolboxButtons" src="../Shared/icons/diagram_create_relation.svg">
                                            </button>
                                            <!-- UML Create Class -->
                                            <button id='classbutton' onclick='setMode("CreateClass");' class='buttonsStyle unpressed' data="Create Class (Shift + C)">
                                                <img class="toolboxButtons" src="../Shared/icons/diagram_create_class.svg">
                                            </button>
                                            <!-- Create Line -->
                                            <button id='linebutton' onclick='setMode("CreateLine");' class='buttonsStyle unpressed' data="Create Line (Shift + L)">
                                                <img class="toolboxButtons" src="../Shared/icons/diagram_create_line.svg">
                                            </button>
                                            <!-- Draw Free -->
                                            <button id='drawfreebutton' onclick="setMode('Free');" class='buttonsStyle unpressed' data="Draw Free (Shift + F)">
                                                <img class="toolboxButtons" src="../Shared/icons/diagram_draw_free.svg">
                                            </button>
                                            <!-- Create Text -->
                                            <button id='drawtextbutton' onclick="setMode('Text');" class='buttonsStyle unpressed' data="Draw Text (Shift + T)">
                                                <img id='textButton' src="../Shared/icons/textbox.svg">
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="diagramLabelToolContainer">
                                    <h4 class="label tlabel" id="labelUndo">Undo/Redo</h4>
                                    <div class="toolbar-undo-redo-drawer" id="drawerUndo">
                                        <!-- Undo -->
                                        <button class="diagramAction" id="undoButton" onclick='undoDiagram(event)' data="Undo (Ctrl + Z)">
                                          <img src="../Shared/icons/undo.svg">
                                        </button>
                                        <!-- Redo -->
                                        <button class="diagramAction" id="redoButton" onclick='redoDiagram(event)' data="Redo (Ctrl + Y)">
                                          <img src="../Shared/icons/redo.svg">
                                        </button>
                                    </div>
                                  </div>
                            </div>
                        </div>
                    </div>

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
                            <div class="drop-down-item export-drop-down-head" tabindex="0">
                                <span class="drop-down-option" id="exportid">Export...</span>
                                <div class="export-drop-down">
                                    <div class="export-drop-down-item" tabindex="0">
                                        <a class="drop-down-option" id="fileid" onclick='SaveFile(this);'>Export JSON</a>
                                    </div>
                                    <div class="export-drop-down-item" tabindex="0">
                                        <a class="drop-down-option" id="svgid" onclick='ExportSVG(this);'>Export SVG</a>
                                    </div>
                                    <div class="export-drop-down-item" tabindex="0">
                                        <a class="drop-down-option" id="picid" onclick='ExportPicture(this);'>Export Picture</a>
                                    </div>
                                    <div class="export-drop-down-item" tabindex="0">
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
                                <i id="hotkey-clear" class="hotKeys">Ctrl + A, Delete</i>
                            </div>
                        </div>
                    </div>

                    <div class="menu-drop-down" tabindex="0">
                        <span class="drop-down-label">Edit</span>
                        <div class="drop-down">
                            <div class="drop-down-item" tabindex="0">
                                <span class="drop-down-option" onclick='undoDiagram(event)'>Undo</span>
                                <i id="hotkey-undo" class="hotKeys">Ctrl + Z</i>
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <span class="drop-down-option" onclick='redoDiagram(event)'>Redo</span>
                                <i id="hotkey-redo" class="hotKeys">Ctrl + Y</i>
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
                                    <i id="hotkey-front" class="hotKeys">Shift + 1</i>
                                </div>
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <div id="move-selected-back-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick='moveToBack(event)'>Move selected to back</span>
                                    <i id="hotkey-back" class="hotKeys">Shift + 2</i>
                                </div>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <div id="lock-selected-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick='lockSelected(event)'>Lock/Unlock selected</span>
                                    <i id="hotkey-lock" class="hotKeys">Shift + X</i>
                                </div>
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <div id="delete-object-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick='eraseSelectedObject(event);'>Delete Object</span>
                                    <i id="hotkey-delete" class="hotKeys">Delete/Backspace</i>
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
                                <i id="hotkey-resetView" class="hotKeys">Shift + O</i>
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <span class="drop-down-option" onclick="openShortcutsDialog(event);">Edit keyboard shortcuts</span>
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <span class="drop-down-option" onclick='disableShortcuts(event);'>Disable keyboard shortcuts</span>
                            </div>
                        </div>
                    </div>
                    <div class="menu-drop-down" tabindex="0">
                        <span class="drop-down-label">View</span>
                        <div class="drop-down">
                            <div class="drop-down-item" tabindex="0">
                                <span class="drop-down-option" onclick='developerMode(event);'>Developer mode</span>
                                <i id="hotkey-developerMode" class="hotKeys">Shift + D</i>
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <div id="displayAllTools" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick="switchToolbarDev(event);"><img src="../Shared/icons/Arrow_down_right.png">Display All Tools</span>
                                </div>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div id="er-item" class="drop-down-item" tabindex="0">
                                <span class="drop-down-option" onclick="switchToolbarTo('ER');">ER</span>
                                <i id="hotkey-ER" class="hotKeys">Shift + M</i>
                            </div>
                            <div id="uml-item" class="drop-down-item" tabindex="0">
                                <span class="drop-down-option" onclick="switchToolbarTo('UML');">UML</span>
                                <i id="hotkey-UML" class="hotKeys">Shift + M</i>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <span class="drop-down-option" onclick="toggleVirtualPaper(event)">Display Virtual Paper</span>
                                <i id="hotkey-displayPaper" class="hotKeys">Shift + 4</i>
                            </div>
                            <div class="drop-down-item papersize-drop-down-head" tabindex="0">
                              <span class="drop-down-option" id="paperid">Paper size...</span>
                              <div class="papersize-drop-down">
                                <div class="papersize-drop-down-item" tabindex="0">
                                  <a class="drop-down-option" id="A0" onclick='setPaperSize(event, 0);'>A0</a>
                                </div>
                                <div class="papersize-drop-down-item" tabindex="0">
                                  <a class="drop-down-option" id="A1" onclick='setPaperSize(event, 1);'>A1</a>
                                </div>
                                <div class="papersize-drop-down-item" tabindex="0">
                                  <a class="drop-down-option" id="A2" onclick='setPaperSize(event, 2);'>A2</a>
                                </div>
                                <div class="papersize-drop-down-item" tabindex="0">
                                  <a class="drop-down-option" id="A3" onclick='setPaperSize(event, 3);'>A3</a>
                                </div>
                                <div class="papersize-drop-down-item" tabindex="0">
                                  <a class="drop-down-option" id="A4" onclick='setPaperSize(event, 4);'>A4</a>
                                </div>
                                <div class="papersize-drop-down-item" tabindex="0">
                                  <a class="drop-down-option" id="A5" onclick='setPaperSize(event, 5);'>A5</a>
                                </div>
                                <div class="papersize-drop-down-item" tabindex="0">
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
                                <i id="hotkey-fullscreen" class="hotKeys">Shift + F11</i>           
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
                                    <i id="hotkey-Align-Top" class="hotKeys">Shift + ▲</i>
                                </div>
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <div id="align-right-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick="align(event, 'right');">Right</span>
                                    <i id="hotkey-Align-Right" class="hotKeys">Shift + ►</i>
                                </div>
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <div id="align-bottom-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick="align(event, 'bottom');">Bottom</span>
                                    <i id="hotkey-Align-Bottom" class="hotKeys">Shift + ▼ </i>
                                </div>
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <div id="align-left-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick="align(event, 'left');">Left</span>
                                    <i id="hotkey-Align-Left" class="hotKeys">Shift + ◄ </i>
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
                                <i id="hotkey-space" class="hotKeys">Blankspace</i>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-text-non-clickable" tabindex="0">
                                <span class="drop-down-option">Select multiple objects</span>
                                <div id="hotkey-ctrl" class="hotKeys">
                                    <i>Ctrl + leftclick</i>
                                </div>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <span class="drop-down-option" onclick="generateERExampleCode();">Generate example ER-diagram</span>
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <span class="drop-down-option" onclick="generateUMLExampleCode();">Generate example UML-diagram</span>
                            </div>
                        </div>
                    </div>
                    <div class="menu-drop-down">
                        <span class="drop-down-label" tabindex="0">Layers</span>
                        <div class="drop-down">
                            <div id="layerPlaceholder">
                                <div class="drop-down-item" tabindex="0">
                                    <span class="notActive drop-down-option" onclick="toggleBackgroundLayer(this),setlayer()" id="layers_1">Layer One</span>
                                </div>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <span class="drop-down-option" onclick="createLayer()">Create Layer</span>
                            </div>
                            <div class="drop-down-item" tabindex="0">
                                <span class="drop-down-option" onclick="deleteLayer()">Delete selected layers</span>
                            </div>
                        </div>
                    </div>
                    <div id="errorBox">
                        <span id="errorMSG"></span>
                    </div>
                </div>

                <!-- THESE OBJECTS ARE NOT IN THE TOOLBOX OR THE MENU-->
                <!-- AS THEY PROBABLY SHOULD BE IMPLEMENTED SOMEWHERE WITHIN ISSUE #3750-->

                <!--
                    Needs to be implemented in the new navbar

                   <select id='download' onchange='downloadMode(this)'>
                        <option selected='selected' disabled>State</option>
                        <option value='getImage'>getImage</option>
                        <option value='Save'>Save</option>
                        <option value='Load'>Load</option>
                    </select>

                    <input id='fileid' type='file' name='file_name' hidden multiple/>
                -->

            </div>
            <div id="diagramCanvasContainer">
               <canvas id="diagramCanvas"></canvas>
               <button id='moveButton' class='unpressed' title="Move Around">
                    <img src="../Shared/icons/diagram_move_arrows.svg">
                </button> 
                <div id="valuesCanvas">
                </div>
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
            <div id="consoleDiv">
                <!--
                    Can be used for a later date. Not needed now.
                <div id='consloe' style='position: fixed; left: 0px; right: 0px; bottom: 0px; height: 133px; background: #dfe; border: 1px solid #284; z-index: 5000; overflow: scroll; color: #4A6; font-family:lucida console; font-size: 13px; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; cursor: default;'>Application console</div>
                <input id='Hide Console' style='position: fixed; right: 0; bottom: 133px;' type='button' value='Hide Console' onclick='Consolemode(1);' />
                <input id='Show Console' style='display: none; position: fixed; right: 0; bottom: 133px;' type='button' value='Show Console' onclick='Consolemode(2);' />
                -->
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
                            <option value="First" id="First"></option>
                            <option value="Second" id="Second"></option>
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
                        <label for="cardinalityUMLFirst">UML cardinality:</label>
                        <select id="cardinalityUMLFirst" data-access="cardinality.value"><?=$cardinalitiesUML;?></select>
                        </br>
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
        <div class='loginBox'>
            <div class='loginBoxheader'>
                <h3>Import</h3>
                <div class='cursorPointer' onclick='closeImportDialog();'>
                    x
                </div>
            </div>
            <div class='table-wrap'>
                <div class="importWrap">
                    <div>
                        <input type="file" class="import-file-button" id="importFile" accept=".txt, text/plain" />
                        <label for="importFile" id="importLabel" class="submit-button custom-file-upload">Choose a file</label>
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
                <div class='cursorPointer' onclick='modeSwitchConfirmed(false)'>
                    x
                </div>
            </div>
            <div class='mode-wrap'>
                <div id="modeSwitchButton1" class="importButtonWrap">
                    <button id="modeSwitchButtonAccept" type="button" class="buttonStyleDialog" onclick="modeSwitchConfirmed(true);">Accept</button>
                </div>
                <div id="modeSwitchButton2" class="importButtonWrap">
                    <button id="modeSwitchButtonCancel" type="button" class="buttonStyleDialog" onclick="modeSwitchConfirmed(false);">Cancel</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Fullscreen toggle dialog -->
    <div id="fullscreenDialog" class='loginBoxContainer importDiagram'>
        <div class='loginBox fullscreenContainer'>
            <div class='loginBoxheader fullscreenHeader'>
                <h3 id="fullscreenHeaderText">Fullscreen mode enabled</h3>
            </div>
            <div class='fullscreen-wrap'>
                To exit, press 'Escape' or 'Shift + F11'.
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
