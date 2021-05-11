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
<body onload="getData()" style="overflow: hidden;">

    <!-- Toolbar for diagram -->
    <div id="diagram-toolbar" onmousedown='mdown(event)'>
        <fieldset>
            <legend>Modes</legend>
                <div id="mouseMode0" class="diagramIcons toolbarMode active" onclick='setMouseMode(0);'>
                    <img src="../Shared/icons/diagram_pointer_white.svg"/>
                    <span class="toolTipText"><b>Pointer</b><br>
                        <p>Allows you to press the different entities and move around the diagram</p><br>
                        <p id="tooltip-POINTER" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
                <div id="mouseMode1" class="diagramIcons toolbarMode" onclick='setMouseMode(1);'>
                    <img src="../Shared/icons/diagram_box_select.svg"/>
                    <span class="toolTipText"><b>Box Selection</b><br>
                        <p>Select everything withing a certain area</p><br>
                        <p id="tooltip-BOX_SELECTION" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
                <div id="elementPlacement0" class="diagramIcons toolbarMode" onclick='setElementPlacementType(0); setMouseMode(2);'>
                    <img src="../Shared/icons/diagram_entity.svg"/>
                    <span class="toolTipText"><b>Entity</b><br>
                        <p>Add an entity to the diagram</p><br>
                        <p id="tooltip-PLACE_ENTITY" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
                <div id="elementPlacement1" class="diagramIcons toolbarMode" onclick='setElementPlacementType(1); setMouseMode(2);'>
                    <img src="../Shared/icons/diagram_relation.svg"/>
                    <span class="toolTipText"><b>Relation</b><br>
                        <p>Add a relation between entities</p><br>
                        <p id="tooltip-PLACE_RELATION" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
                <div id="elementPlacement2" class="diagramIcons toolbarMode" onclick='setElementPlacementType(2); setMouseMode(2);'>
                    <img src="../Shared/icons/diagram_attribute.svg"/>
                    <span class="toolTipText"><b>Attribute</b><br>
                        <p>Create an Attribute to an entity</p><br>
                        <p id="tooltip-PLACE_ATTRIBUTE" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
                <div id="mouseMode3" class="diagramIcons toolbarMode" onclick='setMouseMode(3); clearContext();'>
                    <img src="../Shared/icons/diagram_line.svg"/>
                    <span class="toolTipText"><b>Line</b><br>
                        <p>Make a line between objects</p><br>
                        <p id="tooltip-EDGE_CREATION" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
        </fieldset>
        <fieldset>
            <legend>Zoom</legend>
            <div class="diagramIcons" onclick='zoomin();'>
                <img src="../Shared/icons/diagram_zoomin.svg"/>
                <span class="toolTipText"><b>Zoom IN</b><br>
                    <p>Increase size of all elements</p><br>
                    <p id="tooltip-ZOOM_OUT" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div class="diagramIcons" onclick='zoomout();'>
                <img src="../Shared/icons/diagram_zoomout.svg"/>
                <span class="toolTipText"><b>Zoom OUT</b><br>
                    <p>Decrease size of all elements</p><br>
                    <p id="tooltip-ZOOM_IN" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset>
        <fieldset>
            <legend>Toggle</legend>
            <div id="gridToggle" class="diagramIcons" onclick='toggleGrid()'>
                <img src="../Shared/icons/diagram_grid.svg"/>
                <span class="toolTipText"><b>Toggle grid</b><br>
                    <p>Enable/disable the grid</p><br>
                    <p id="tooltip-TOGGLE_GRID" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div id="rulerToggle" class="diagramIcons active" onclick='toggleRuler()'>
                <img src="../Shared/icons/diagram_ruler.svg"/>
                <span class="toolTipText"><b>Toggle Ruler</b><br>
                    <p>Enable/disable the ruler</p><br>
                    <p id="tooltip-TOGGLE_RULER" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div id="rulerSnapToGrid" class="diagramIcons" onclick="toggleSnapToGrid()">
                <img src="../Shared/icons/diagram_gridmagnet.svg"/>
                <span class="toolTipText"><b>Toggle Snap To Grid</b><br>
                    <p>Enable/disable the Snap To Grid</p><br>
                    <p id="tooltip-TOGGLE_SNAPGRID" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div id="a4TemplateToggle" class="diagramIcons" onclick="toggleA4Template()">
                <img src="../Shared/icons/diagram_a4.svg"/>
                <span class="toolTipText"><b>Toggle A4 template</b><br>
                    <p>Enable/disable the A4 template</p><br>
                    <p id="tooltip-TOGGLE_A4" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset>
        <fieldset>
            <legend>History</legend>
            <div id="stepForwardToggle" class="diagramIcons" onclick="toggleStepForward()">
                <img src="../Shared/icons/diagram_stepforward.svg"/>
                <span class="toolTipText"><b>Toggle step forward</b><br>
                    <p>Click to step forward in history</p><br>
                    <p id="tooltip-HISTORY_STEPFORWARD" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div id="stepBackToggle" class="diagramIcons" onclick="toggleStepBack()">
                <img src="../Shared/icons/diagram_stepback.svg"/>
                <span class="toolTipText"><b>Toggle step backward</b><br>
                    <p>Click to step back in history</p><br>
                    <p id="tooltip-HISTORY_STEPBACK" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <button class="diagramIcons" onclick="toggleReplay()">Replay</button>
        </fieldset>

    </div>

    <!-- Message prompt -->
    <div id="diagram-message"></div>
    <div id ="zoom-message-box"><img width="25%" height="25%" src="../Shared/icons/zoom-message-icon.svg"/><text id ="zoom-message">1x</text></div>

    <!-- Diagram drawing system canvas. -->
    <div id="container" onmousedown='mdown(event)' onmouseup='mup(event)' onmousemove='mmoving(event)' onwheel='mwheel(event)'></div> <!-- Contains all elements (items) -->
     <!-- One svg layer for background stuff and one for foreground stuff -->
    <svg id="svgbacklayer" preserveAspectRatio="none"></svg>
    <svg id="svgoverlay" preserveAspectRatio="none"></svg>

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

                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke-dasharray="5,5" stroke-width="1"/>
            </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <line id="origoX" x1="0%" y1="100" x2="100%" y2="100" style="stroke:rgb(171, 171, 171);stroke-width:2;"/>
            <line id="origoY" x1="100" y1="0%" x2="100" y2="100%" style="stroke:rgb(171, 171, 171);stroke-width:2;"/>
        </svg>  
    </div>
    <!-- A4 template -->
    <div id="a4Template" style="z-index:-11">
        <svg id="svgA4Template">
            <rect id="a4Rect" x="100" y="100" width="794" height="1122" style="stroke:rgb(50, 50, 50);stroke-width:2" stroke-dasharray="5 3" fill="#ffffee" fill-opacity="0.4"/>
            <text id="a4Text" x="880" y="90">A4</text>
        </svg>  
    </div>  
    <div id="fab" onclick="fab_action();" onmousedown='mdown(event)'>+ <!-- Big (+) button -->
        <span class="toolTipText"><b>Show Option Panel</b><br>
            <p>Enable/disable the Option Panel</p><br>
            <p id="tooltip-OPTIONS" class="key_tooltip">Keybinding:</p>
        </span>
    </div>
    <div id="options-pane" class="hide-options-pane" onmousedown='mdown(event)'> <!-- Yellow menu on right side of screen -->
        <div id="options-pane-button" onclick="fab_action();"><span id='optmarker'>&#9660;Options</span>
            <span class="toolTipText"><b>Show Option Panel</b><br>
                <p>Enable/disable the Option Panel</p><br>
                <p id="tooltip-OPTIONS" class="key_tooltip">Keybinding:</p>
            </span>
        </div>
        <div id ="fieldsetBox">
            <fieldset id='propertyFieldset'>
                
            </fieldset>
        </div>
    </div>
    </div>
    <!-- Replay-mode -->
    <div id="diagram-replay-box">
        <div style=";display: flex;">
            <fieldset style="display: flex; justify-content: space-between">
                <div id="diagram-replay-switch">
                    <div class="diagramIcons" onclick="stateMachine.replay()">
                        <img src="../Shared/icons/Play.svg">
                    </div>
                </div>
                <div class="diagramIcons" onclick="stateMachine.replay(0)">
                    <img src="../Shared/icons/ResetButton.svg">
                </div>
            </fieldset>
            <div style="width: 250px">
                <label id="replay-time-label" for="replay-time">Delay (1s)</label>
                <input id="replay-time" onchange="setReplayDelay(this.value)" class="zoomSlider" type="range" min="1" max="9" value="5">
            </div>

            <div>
                <label for="replay-range">Change</label>
                <input id="replay-range" class="zoomSlider" onchange="stateMachine.scrubHistory(parseInt(this.value))" type="range" min="0" max="0">
            </div>
        </div>
    </div>
    <div id="diagram-replay-message">
        <h2>Replay mode</h2>
        <p>Press "Escape" to exit the replay-mode.</p>
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
