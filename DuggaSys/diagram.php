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
            <input class="paneButtons" type="button" value="-" onclick='zoomin();' />
            <input class="paneButtons" type="button" value="+" onclick='zoomout();' />
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
