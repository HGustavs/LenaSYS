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
    <title>Section Editor</title>
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
        $(document).ready(function(){
            $(".menu-drop-down").hover(function(){
                $(this).find(".drop-down").show();
            }, function(){
                $(this).find(".drop-down").hide();
            });
            $(".drop-down-item").click(function(){
                $(this).closest(".drop-down").hide();
            });

            window.addEventListener('keypress', clickEnterOnDialogMenu);
        });
    </script>

</head>
<!-- Reads the content from the js-files -->
<!-- updateGraphics() must be last -->
<body onload="initializeCanvas(); canvasSize(); loadDiagram(); debugMode(); initToolbox(); updateGraphics();" onmousedown="mouseDown()" onmouseup="mouseUp()">
    <?php
        $noup = "SECTION";
        include '../Shared/navheader.php';
    ?>
    <!-- content START -->
    <div id="content" style="padding-top: 40px; padding-bottom: 0px; padding-right: 0px; padding-left: 0px;">
        <div id="buttonDiv">
            <div class="document-settings">
                <div id="diagram-toolbar" class="application-toolbar-wrap" style="display:none">
                    <div class="application-header">
                        <div id="toolbar-minimize"  onclick="toggleToolbarMinimize();">
                            <img id="minimizeArrow" class="toolbarMaximized" src="../Shared/icons/arrow.svg">
                          </div>
                          <h3>Toolbar</h3>
                          <div id="toolbar-toggleLayout"  onclick="toggleToolbarLayout();">
                              <img id="layoutArrow" class="toolbarMaximized" src="../Shared/icons/rotateButton.svg">
                            </div>
                        </div>
                        <div class='application-toolbar'>
                          <div id="toolbar-switcher">
                            <div class="toolbarArrows" onclick="switchToolbar('left');">
                              <img id="toolbarLeftArrow" src="../Shared/icons/arrow.svg">
                            </div>
                            <div id="toolbarTypeText">All</div>
                            <div class="toolbarArrows" onclick="switchToolbar('right');">
                              <img id="toolbarRightArrow" src="../Shared/icons/arrow.svg">
                            </div>
                          </div>
                          <div class="toolsContainer">
                            <div class="labelToolContainer">
                              <h4 class="label tlabel" id="labelTools">Tools</h4>
                              <div class="toolbar-drawer" id="drawerTools">
                                  <div class="tooltipdialog">
                                      <button id='linebutton' onclick='setMode("CreateLine");' class='buttonsStyle unpressed' data="Create Line">
                                          <img class="toolboxButtons" src="../Shared/icons/diagram_create_line.svg">
                                      </button>
                                  </div>
                              </div>
                            </div>
                            <div class="labelToolContainer">
                              <h4 class="label tlabel" id="labelCreate">Create</h4>
                              <div class="toolbar-drawer" id="drawerCreate">
                                  <div class="tooltipdialog">
                                      <button id='attributebutton' onclick='setMode("CreateERAttr");' style="display: inline; border-radius: 5px" class='buttonsStyle unpressed' data="Create Attribute">
                                          <img class="toolboxButtons" src="../Shared/icons/diagram_create_attribute.svg">
                                      </button>
                                      <button id='entitybutton' onclick='setMode("CreateEREntity");' style="display: inline; border-radius: 5px" class='buttonsStyle unpressed' data="Create Entity">
                                          <img class="toolboxButtons" src="../Shared/icons/diagram_create_entity.svg">
                                      </button>
                                      <button id='relationbutton' onclick='setMode("CreateERRelation");' style="display: inline; border-radius: 5px" class='buttonsStyle unpressed' data="Create Relation">
                                          <img class="toolboxButtons" src="../Shared/icons/diagram_create_relation.svg">
                                      </button>
                                      <button id='classbutton' onclick='setMode("CreateClass");' style="display: inline; border-radius: 5px" class='buttonsStyle unpressed' data="Create Class">
                                          <img class="toolboxButtons" src="../Shared/icons/diagram_create_class.svg">
                                    </button>
                                      <button id='drawtextbutton' onclick="setMode('Text');" style="display: inline; border-radius: 5px" class='buttonsStyle unpressed' data="Draw Text">
                                          <img id='textButton' src="../Shared/icons/textbox.svg" style="filter: invert(100%);">
                                      </button>
                                  </div>
                              </div>
                            </div>
                          <div class="labelToolContainer">
                            <h4 class="label tlabel" id="labelDraw">Draw</h4>
                            <div class="toolbar-drawer" id="drawerDraw">
                                <button id='squarebutton' onclick="setMode('Square');" style="display: inline; border-radius: 5px" class='buttonsStyle unpressed' data="Draw Square">
                                    <img class="toolboxButtons" src="../Shared/icons/diagram_draw_square.svg">
                                </button>
                                <button id='drawfreebutton' onclick="setMode('Free');" style="display: inline; border-radius: 5px" class='buttonsStyle unpressed' data="Draw Free">
                                    <img class="toolboxButtons" src="../Shared/icons/diagram_draw_free.svg">
                                </button>
                            </div>
                          </div>
                          <div class="labelToolContainer">
                            <h4 class="label tlabel" id="labelUndo">Undo/Redo</h4>
                            <div class="toolbar-drawer" id="drawerUndo" style="text-align: center">
                                <button class="diagramAction" id="undoButton" onclick='undoDiagram()' data="Undo">
                                    <img src="../Shared/icons/undo.svg" style="filter: invert(100%);">
                                </button>
                                <button class="diagramAction" id="redoButton" onclick='redoDiagram()' data="Redo">
                                    <img src="../Shared/icons/redo.svg" style="filter: invert(100%);">
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
                            <span class="drop-down-option" id="buttonid" onclick="openImportDialog();" value='getImage'>Import</span>
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
                        </div>
                    </div>
                </div>
                <div class="menu-drop-down">
                    <span class="drop-down-label">Edit</span>
                    <div class="drop-down">
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick='undoDiagram()'>Undo</span>
                            <i id="hotkey-undo">Ctrl + Z</i>
                        </div>
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick='redoDiagram()'>Redo</span>
                            <i id="hotkey-redo">Ctrl + Y</i>
                        </div>
                        <div class="drop-down-divider">

                        </div>
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick='globalAppearanceMenu();'>Global Appearance</span>
                        </div>
                        <div class="drop-down-item">
                                <span class="drop-down-option" onclick='openAppearanceDialogMenu();'>Change Appearance</span>
                        </div>
                        <div class="drop-down-divider">
                        </div>
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick='lockSelected()'>Lock/Unlock selected</span>
                        </div>
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick='eraseSelectedObject();'>Delete Object</span>
                        </div>
                    </div>
                </div>
                <div class="menu-drop-down">
                    <span class="drop-down-label">View</span>
                    <div class="drop-down">
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick='debugMode();'>Developer mode</span>
                        </div>
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick="toggleGrid(this)">Snap to grid</span>
                        </div>
                        <div class="drop-down-divider">
                        </div>
                        <div class="drop-down-item">
                            <a href="#" onclick="toggleVirtualA4()">Display Virtual A4</a>
                        </div>
                        <div class="drop-down-item">
                                <a href="#" onclick='toggleVirtualA4Holes();'>Toggle A4 Holes</a>
                        </div>
                    </div>
                </div>
                <div class="menu-drop-down">
                    <span class="drop-down-label">Align</span>
                    <div class="drop-down">
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick="toggleGrid(this)">Snap to grid</span>
                        </div>
                        <div class="drop-down-divider">
                        </div>
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick="align('top');">Top</span>
                        </div>
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick="align('right');">Right</span>
                        </div>
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick="align('bottom');">Bottom</span>
                        </div>
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick="align('left');">Left</span>
                        </div>
                        <div class="drop-down-divider">
                        </div>
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick="align('horizontalCenter');">Horizontal center</span>
                        </div>
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick="align('verticalCenter');">Vertical center</span>
                        </div>
                    </div>
                </div>
                <div class="menu-drop-down">
                    <span class="drop-down-label">Distribute</span>
                    <div class="drop-down">
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick="distribute('horizontally');">Horizontal</span>
                        </div>
                        <div class="drop-down-item">
                            <span class="drop-down-option" onclick="distribute('vertically');">Vertical</span>
                        </div>
                    </div>
                </div>
                <div class="menu-drop-down">
                    <span class="drop-down-label">Help</span>
                    <div class="drop-down">
                        <div class="drop-down-text-non-clickable">
                            <span class="drop-down-option">Move grid</span>
                            <div id="hotkey-space"><i>Blankspace</i></div>
                        </div>
                        <div class="drop-down-divider"></div>
                        <div class="drop-down-text-non-clickable">
                            <span class="drop-down-option">Select multiple objects</span>
                            <div id="hotkey-ctrl"><i>Ctrl + leftclick</i></div>
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

            <div id="canvasDiv"></div>
            <div id="consoleDiv">
            <!--
                Can be used for a later date. Not needed now.
            <div id='consloe' style='position: fixed; left: 0px; right: 0px; bottom: 0px; height: 133px; background: #dfe; border: 1px solid #284; z-index: 5000; overflow: scroll; color: #4A6; font-family:lucida console; font-size: 13px; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; cursor: default;'>Application console</div>
            <input id='Hide Console' style='position: fixed; right: 0; bottom: 133px;' type='button' value='Hide Console' onclick='Consolemode(1);' />
            <input id='Show Console' style='display: none; position: fixed; right: 0; bottom: 133px;' type='button' value='Show Console' onclick='Consolemode(2);' />
            -->
            <div id='valuesCanvas'></div>
            <div id="selectDiv">
                <select name="Zoom" id="ZoomSelect" onchange="zoomInMode();">
                    <option selected='selected' disabled>Choose zoom</option>
                    <option value="0.3">30%</option>
                    <option value="0.5">50%</option>
                    <option value="0.75">75%</option>
                    <option value="1">100%</option>
                    <option value="1.5">150%</option>
                    <option value="2">200%</option>
                </select>
                <i class="ikonPil"></i>
            </div>
        </div>
    </div>
    <!-- The Appearance menu. Default state is display: none; -->
    <div id="appearance" class='loginBoxContainer' style='display: none; background-color: rgba(0,0,0,0)'>
        <div class='loginBox'>
            <div class='loginBoxheader'>
                <h3 id='loginBoxTitle'>Appearance</h3>
                <div class='cursorPointer' onclick='closeAppearanceDialogMenu();changeLoginBoxTitleAppearance();'>x</div>
            </div>
            <div class='table-wrap'>
                <div id="f01"></div>
            </div>
        </div>
    </div>
    <!-- The import menu. Default state is display: none; -->
    <div id="import" class='loginBoxContainer importDiagram'>
        <div class='loginBox'>
            <div class='loginBoxheader'>
                <h3>Import</h3>
                <div class='cursorPointer' onclick='closeImportDialog();'>x</div>
            </div>
            <div class='table-wrap'>
                <div class="importWrap">
                    <div>
                        <input type="file" id="importFile" accept=".txt, text/plain" />
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
    <!-- content END -->
    <?php
        include '../Shared/loginbox.php';
        if(isset($_POST['id'])){

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