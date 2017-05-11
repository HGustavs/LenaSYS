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
    <script src="../Shared/js/jquery-1.11.0.min.js"></script>
    <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
    <script src="../Shared/dugga.js"></script>
    <script src="diagram.js"></script>
    <script src="diagram_symbol.js"></script>
    <script src="diagram_dialog.js"></script>
    <script src="diagram_mouse.js"></script>
    <script src="diagram_figure.js"></script>
    <script src="diagram_example.js"></script>
    <script src="diagram_IOHandler.js"></script>
</head>
<!-- Reads the content from the js-files -->
<!-- updategfx() must be last -->
<body onload="initcanvas(); Symbol(); canvassize(); updategfx(); loadDiagram(); debugMode();">
    <?php
        $noup = "COURSE";
        include '../Shared/navheader.php';
    ?>
    <!-- content START -->
    <div id="content">
        <div id="buttonDiv">
            <button onclick='attrmode();'>Create Attribute</button>
            <button onclick='linemode();'>Create Line</button>
            <button onclick='entitymode();'>Create Entity</button>
            <button onclick='relationmode();'>Create Relation</button>
            <select id='selectFigure' onchange='figuremode()'>
                <option selected='selected' disabled>Create Figure</option>
                <option value='Square'>Square</option>
                <option value='Free'>Free-Draw</option>
            </select>
            <button onclick='openAppearanceDialogMenu();'>Change Appearance</button>
            <button onclick='globalAppearanceMenu();'>Global Appearance</button>
            <button onclick='debugMode();'>Debug</button>
            <button onclick='clearCanvas(); removeLocal();'>Removed Hashed Diagram</button>
            <button onclick='eraseSelectedObject();'>Delete Object</button>
            <button onclick='clearCanvas(); removeLocal();'>Delete All</button>
            <select id='download' onchange='downloadMode(this)'>
                <option selected='selected' disabled>State</option>
                <option value='getImage'>getImage</option>
                <option value='Save'>Save</option>
                <option value='Load'>Load</option>
            </select>
            <button><a onclick='SaveFile(this);' class='btn'><i class='icon-download'></i>Export</a></button>
            <input id='fileid' type='file' name='file_name' hidden multiple/>
            <input id='buttonid' type='button' value='Import' />
            Snap to grid:<input type="checkbox" onClick="enableGrid(this)" checked>
            <button id='moveButton' class='unpressed' style='right: 0; position: fixed; margin-right: 10px;'>Start Moving</button><br>
        </div>
        <div id="canvasDiv"></div>
        <div id="consoleDiv">
            <!--<div id='consloe' style='position: fixed; left: 0px; right: 0px; bottom: 0px; height: 133px; background: #dfe; border: 1px solid #284; z-index: 5000; overflow: scroll; color: #4A6; font-family:lucida console; font-size: 13px; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; cursor: default;'>Application console</div>-->
            <div id='valuesCanvas' style='position: absolute; left: 10px; bottom: 5px; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; cursor: default;'></div>
            <!--<input id='Hide Console' style='position: fixed; right: 0; bottom: 133px;' type='button' value='Hide Console' onclick='Consolemode(1);' />
            <input id='Show Console' style='display: none; position: fixed; right: 0; bottom: 133px;' type='button' value='Show Console' onclick='Consolemode(2);' />-->
            <select name="Zoom" id="ZoomSelect" style='right:10px; position: fixed; bottom: 10px' onchange="zoomInMode();"> 
                <option selected='selected' disabled>Choose zoom</option> 
                <option value="0.05">5%</option> 
                <option value="0.1">10%</option> 
                <option value="0.2">20%</option> 
                <option value="0.3">30%</option> 
                <option value="0.5">50%</option> 
                <option value="0.75">75%</option> 
                <option value="1">100%</option> 
                <option value="1.25">125%</option> 
                <option value="1.5">150%</option> 
                <option value="2">200%</option> 
                <option value="4">400%</option> 
                <option value="6">600%</option> 
                <option value="8">800%</option> 
                <option value="10">1000%</option> 
                <option value="12">1200%</option> 
                <option value="14">1400%</option> 
                <option value="16">1600%</option> 
            </select> 
        </div>
    </div>
    <!-- The Appearance menu. Default state is display: none; -->
    <div id="appearance" class='loginBox' style='display: none;'>
        <div class='loginBoxheader'>
            <h3>Appearance</h3>
            <div class='cursorPointer' onclick='closeAppearanceDialogMenu()'>x</div>
        </div>
        <div class='table-wrap'>
            <div id="f01"></div>
        </div>
    </div>
    <!-- content END -->
    <?php
        include '../Shared/loginbox.php';
    ?>
    <?php
        if(isset($_POST['StringDiagram'])) {
            $str = $_POST['StringDiagram'];
            $hash = $_POST['Hash'];
            save($str,$hash);
        }
        function save($data, $hash) {
            mkdir("Saves/b", 0777, true);
            $myfile = fopen("Saves/b/$hash.txt", "w");
            fwrite($myfile, $data);
        }
    ?>
</body>
</html>
