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
    <script src="diagram_mouse.js"></script>
    <script src="diagram_figure.js"></script>
    <script src="diagram_example.js"></script>
    <script src="diagram_IOHandler.js"></script>
    <script src="diagram_dialog.js"></script>
</head>
<!-- Reads the content from the js-files -->
<!-- updateGraphics() must be last -->
<body onload="initializeCanvas(); Symbol(); canvasSize(); loadDiagram(); debugMode(); updateGraphics();">
    <?php
        $noup = "COURSE";
        include '../Shared/navheader.php';
    ?>
    <!-- content START -->
    <div id="content">
        <div id="buttonDiv">
            <div class="document-settings">
                <div class="menu-drop-down">
                    <span class="label">File</span>
                    <div class="drop-down">
                        <div class="drop-down-item">
                            <a href="#" value='Save'>Save</a>

                        </div>
                        <div class="drop-down-item">
                            <a href="#">Load</a>
                        </div>
                        <div class="drop-down-divider">

                        </div>
                        <div class="drop-down-item">
                            <a href="#" id="buttonid" value='getImage'>Import</a>
                        </div>
                        <div class="drop-down-item">
                            <a href="#" id="fileid" onclick='SaveFile(this);'>Export</a>
                        </div>
                        <div class="drop-down-divider">

                        </div>
                        <div class="drop-down-item">
                            <a href="#" onclick='clearCanvas(); removeLocalStorage();'>Clear Diagram</a>
                        </div>
                    </div>
                </div>
                <div class="menu-drop-down">
                    <span class="label">Edit</span>
                </div>
                <div class="menu-drop-down">
                    <span class="label">View</span>
                    <div class="drop-down">
                        <div class="drop-down-item">
                            <a href="#" onclick='debugMode();'>Developer mode</a>
                        </div>
                        <div class="drop-down-item">
                            <a href="#" onclick="toggleGrid(this)">Snap to grid</a>
                        </div>
                    </div>
                </div>
            </div>
            </br>
            </br>

            <button onclick='attrMode();'>Create Attribute</button>
            <button onclick='lineMode();'>Create Line</button>
            <button onclick='entityMode();'>Create Entity</button>
            <button onclick='relationMode();'>Create Relation</button>
            <select id='selectFigure' onchange='figureMode()'>
                <option selected='selected' disabled>Create Figure</option>
                <option value='Square'>Square</option>
                <option value='Free'>Free-Draw</option>
            </select>
            <button onclick='openAppearanceDialogMenu();'>Change Appearance</button>
            <button onclick='globalAppearanceMenu();'>Global Appearance</button>
            <button onclick='eraseSelectedObject();'>Delete Object</button>
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
            <button id='moveButton' class='unpressed' style='right: 0; position: absolute; margin-right: 2px;'>Start Moving</button><br>
        </div>
        <div id="canvasDiv"></div>
        <div id="consoleDiv" style='position: relative;'>
            <!--<div id='consloe' style='position: fixed; left: 0px; right: 0px; bottom: 0px; height: 133px; background: #dfe; border: 1px solid #284; z-index: 5000; overflow: scroll; color: #4A6; font-family:lucida console; font-size: 13px; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; cursor: default;'>Application console</div>-->
            <div id='valuesCanvas'></div>
            <!--<input id='Hide Console' style='position: fixed; right: 0; bottom: 133px;' type='button' value='Hide Console' onclick='Consolemode(1);' />
            <input id='Show Console' style='display: none; position: fixed; right: 0; bottom: 133px;' type='button' value='Show Console' onclick='Consolemode(2);' />-->
            <div id="selectDiv">
                <select name="Zoom" id="ZoomSelect" onchange="zoomInMode();">
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
                <i class="ikonPil"></i>
            </div>
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
        if(isset($_POST['id'])){

        }
    ?>


    <?php
         //if(!isset($_POST['StringDiagram']) ){
         //   mkdir("Save", 0777,true);
         //   $getID = fopen("Save/id.txt", "r");
         //   $a = intval(fread($getID,filesize("Save/id.txt")));
         //   $a += 1;
         //   $overwriteID = fopen("Save/id.txt", "w");
         //   mkdir ("Save/$a", 0777, true);
         //   fwrite($overwriteID,$a);
//
         //}
    ?>

    <?php
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
        //<script type="text/javascript">var c_id = "<?= $a
        //?//>";</script>
        //<script type="text/javascript" src="diagram_IOHandler.js"></script>
    }
    ?>



</body>
</html>
