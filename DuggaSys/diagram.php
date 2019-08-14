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
    <br/>
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

            window.addEventListener('keypress', clickEnterOnDialogMenu);
        });
    </script>
</head>
<!-- Reads the content from the js-files -->
<!-- updateGraphics() must be last -->
<body onload="initializeCanvas(); canvasSize(); loadDiagram(); setModeOnRefresh(); initToolbox(); updateGraphics(); loadWorkaround();" style="overflow-y: hidden;">
    <?php
        $noup = "SECTION";
        include '../Shared/navheader.php';
    ?>
    <!-- content START -->
    <div id="contentDiagram" style="padding-top: 0px; padding-bottom: 0px; padding-right: 0px; padding-left: 0px;">
        <div id="buttonDiv">
            <div class="document-settings">
                <div id="diagram-toolbar" class="application-toolbar-wrap" onmousedown="">
                    <div class='application-toolbar'>
                        <div id="toolbar-switcher">
                            <div id="toolbarTypeText" style ="text-align: center">Dev</div>
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
                    <div class="menu-drop-down">
                        <span class="drop-down-label">File</span>
                        <div class="drop-down">
                            <div class="drop-down-item">
                                <span class="drop-down-option">Save</span>
                            </div>
                            <div class="drop-down-item">
                                <span class="drop-down-option">Load</span>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-item">
                                <span class="drop-down-option" onclick="openImportDialog();">Import</span>
                            </div>
                            <div class="drop-down-item export-drop-down-head">
                                <span class="drop-down-option" id="exportid">Export...</span>
                                <div class="export-drop-down">
                                    <div class="export-drop-down-item">
                                        <a class="drop-down-option" id="fileid" onclick='SaveFile(this);'>Export JSON</a>
                                    </div>
                                    <div class="export-drop-down-item">
                                        <a class="drop-down-option" id="svgid" onclick='ExportSVG(this);'>Export SVG</a>
                                    </div>
                                    <div class="export-drop-down-item">
                                        <a class="drop-down-option" id="picid">Export Picture</a>
                                    </div>
                                </div>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-item">
                                <span class="drop-down-option" onclick='clearCanvas(); removeLocalStorage();'>Clear Diagram</span>
                                <i id="hotkey-clear" class="hotKeys">Ctrl + A, Delete</i>
                            </div>
                        </div>
                    </div>
                    <div class="menu-drop-down">
                        <span class="drop-down-label">Edit</span>
                        <div class="drop-down">
                            <div class="drop-down-item">
                                <span class="drop-down-option" onclick='undoDiagram(event)'>Undo</span>
                                <i id="hotkey-undo" class="hotKeys">Ctrl + Z</i>
                            </div>
                            <div class="drop-down-item">
                                <span class="drop-down-option" onclick='redoDiagram(event)'>Redo</span>
                                <i id="hotkey-redo" class="hotKeys">Ctrl + Y</i>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-item">
                                <span class="drop-down-option" onclick='globalAppearanceMenu(event);'>Global Appearance</span>
                            </div>
                            <div class="drop-down-item">
                                <div id="change-appearance-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick='openAppearanceDialogMenu(event);'>Change Appearance</span>
                                </div>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-item">
                                <div id="move-selected-front-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick='moveToFront(event)'>Move selected to front</span>
                                    <i id="hotkey-front" class="hotKeys">Shift + 1</i>
                                </div>
                            </div>
                            <div class="drop-down-item">
                                <div id="move-selected-back-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick='moveToBack(event)'>Move selected to back</span>
                                    <i id="hotkey-back" class="hotKeys">Shift + 2</i>
                                </div>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-item">
                                <div id="lock-selected-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick='lockSelected(event)'>Lock/Unlock selected</span>
                                    <i id="hotkey-lock" class="hotKeys">Shift + X</i>
                                </div>
                            </div>
                            <div class="drop-down-item">
                                <div id="delete-object-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick='eraseSelectedObject(event);'>Delete Object</span>
                                    <i id="hotkey-delete" class="hotKeys">Delete/Backspace</i>
                                </div>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-item">
                                <div id="group-objects-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick='addGroupToSelected(event)'>Group objects</span>
                                </div>
                            </div>
                            <div class="drop-down-item">
                                <div id="ungroup-objects-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick='removeGroupFromSelected(event)'>Ungroup objects</span>
                                </div>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-item">
                                <span class="drop-down-option" onclick='resetViewToOrigin(event);'>Reset view to origin</span>
                                <i id="hotkey-resetView" class="hotKeys">Shift + O</i>
                            </div>
                        </div>
                    </div>
                    <div class="menu-drop-down">
                        <span class="drop-down-label">View</span>
                        <div class="drop-down">
                            <div class="drop-down-item">
                                <span class="drop-down-option" onclick='developerMode(event);'>Developer mode</span>
                                <i id="hotkey-developerMode" class="hotKeys">Shift + D</i>
                            </div>
                            <div class="drop-down-item">
                                <div id="displayAllTools" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick="switchToolbarDev(event);"><img src="../Shared/icons/Arrow_down_right.png">Display All Tools</span>
                                </div>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div id="er-item" class="drop-down-item">
                                <span class="drop-down-option" onclick="switchToolbarTo('ER');">ER</span>
                                <i id="hotkey-ER" class="hotKeys">Shift + M</i>
                            </div>
                            <div id="uml-item" class="drop-down-item">
                                <span class="drop-down-option" onclick="switchToolbarTo('UML');">UML</span>
                                <i id="hotkey-UML" class="hotKeys">Shift + M</i>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-item">
                                <span class="drop-down-option" onclick="toggleVirtualA4(event)">Display Virtual A4</span>
                                <i id="hotkey-displayA4" class="hotKeys">Shift + 4</i>
                            </div>
                            <div class="drop-down-item">
                                <div id="a4-orientation-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick='toggleA4Orientation(event);'><img src="../Shared/icons/Arrow_down_right.png">Toggle A4 Orientation</span>
                                </div>
                            </div>
                            <div class="drop-down-item">
                                <div id="a4-holes-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick='toggleVirtualA4Holes(event);'><img src="../Shared/icons/Arrow_down_right.png">Toggle A4 Holes</span>
                                </div>
                            </div>
                            <div class="drop-down-item">
                                <div id="a4-holes-item-right" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick='toggleVirtualA4HolesRight(event);'><img src="../Shared/icons/Arrow_down_right.png">A4 Holes Right</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="menu-drop-down">
                        <span class="drop-down-label">Align</span>
                        <div class="drop-down">
                            <div class="drop-down-item">
                                <span class="drop-down-option" onclick="toggleGrid(event)">Snap to grid</span>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-item">
                                <div id="align-top-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick="align(event, 'top');">Top</span>
                                    <i id="hotkey-Align-Top" class="hotKeys">Shift + ▲</i>
                                </div>
                            </div>
                            <div class="drop-down-item">
                                <div id="align-right-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick="align(event, 'right');">Right</span>
                                    <i id="hotkey-Align-Right" class="hotKeys">Shift + ►</i>
                                </div>
                            </div>
                            <div class="drop-down-item">
                                <div id="align-bottom-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick="align(event, 'bottom');">Bottom</span>
                                    <i id="hotkey-Align-Bottom" class="hotKeys">Shift + ▼ </i>
                                </div>
                            </div>
                            <div class="drop-down-item">
                                <div id="align-left-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick="align(event, 'left');">Left</span>
                                    <i id="hotkey-Align-Left" class="hotKeys">Shift + ◄ </i>
                                </div>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-item">
                                <div id="horizontal-c-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick="align(event, 'horizontalCenter');">Horizontal center</span>
                                </div>
                            </div>
                            <div class="drop-down-item">
                                <div id="vertical-c-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick="align(event, 'verticalCenter');">Vertical center</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="menu-drop-down">
                        <span class="drop-down-label">Distribute</span>
                        <div class="drop-down">
                            <div class="drop-down-item">
                                <div id="distribute-horizontal-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick="distribute(event, 'horizontally');">Horizontal</span>
                                </div>
                            </div>
                            <div class="drop-down-item">
                                <div id="distribute-vertical-item" class="drop-down-item-disabled">
                                    <span class="drop-down-option" onclick="distribute(event, 'vertically');">Vertical</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="menu-drop-down">
                        <span class="drop-down-label">Help</span>
                        <div class="drop-down">
                            <div class="drop-down-text-non-clickable">
                                <span class="drop-down-option">Move camera</span>
                                <div id="hotkey-space" class="hotKeys">
                                    <i>Blankspace</i>
                                </div>
                            </div>
                            <div class="drop-down-divider">
                            </div>
                            <div class="drop-down-text-non-clickable">
                                <span class="drop-down-option">Select multiple objects</span>
                                <div id="hotkey-ctrl" class="hotKeys">
                                    <i>Ctrl + leftclick</i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </br>
                </br>

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

            <!-- THESE OBJECTS ARE NOT IN THE TOOLBOX OR THE MENU-->
            <!-- AS THEY PROBABLY SHOULD BE IMPLEMENTED SOMEWHERE WITHIN ISSUE #3750-->
            <div class="tooltipdialog">
                <button id='moveButton' class='unpressed' title="Move Around" style="visibility:hidden">
                    <img src="../Shared/icons/diagram_move_arrows.svg">
                </button>
            </div>
            <div id="canvasDiv" style = "margin-left: 52px" oncontextmenu="return false;">
            </div>
            <div id="consoleDiv">
                <!--
                    Can be used for a later date. Not needed now.
                <div id='consloe' style='position: fixed; left: 0px; right: 0px; bottom: 0px; height: 133px; background: #dfe; border: 1px solid #284; z-index: 5000; overflow: scroll; color: #4A6; font-family:lucida console; font-size: 13px; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; cursor: default;'>Application console</div>
                <input id='Hide Console' style='position: fixed; right: 0; bottom: 133px;' type='button' value='Hide Console' onclick='Consolemode(1);' />
                <input id='Show Console' style='display: none; position: fixed; right: 0; bottom: 133px;' type='button' value='Show Console' onclick='Consolemode(2);' />
                -->
                <div id='valuesCanvas'>
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
        </div>
    </div>
    <!-- The Appearance menu. Default state is display: none; -->
    <div id="appearance" class='loginBoxContainer' style='display: none; background-color: rgba(0,0,0,0)'>
        <div class='loginBox'>
            <div class='loginBoxheader'>
                <h3 id='loginBoxTitle'>Appearance</h3>
                <div class='cursorPointer' onclick='closeAppearanceDialogMenu();changeLoginBoxTitleAppearance();'>
                    x
                </div>
            </div>
            <div class='table-wrap'>
                <div id="f01">
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
                        <label for="importFile" class="import-submit-button">Browse...</label>
                        <span id="importFileText">No file selected.</span>
                        <input type="file" id="importFile" accept=".txt, text/plain" style="display: none"/>
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
