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
    <script src="diagram_figure.js"></script>
    <script src="diagram_example.js"></script>
    <script src="diagram_IOHandler.js"></script>
</head>
<div id="content">
    <div id="buttonDiv">
        <form action="diagram.php">
            <button type='submit'>New Canvas</button>
        </form>
        <br>
        <form action='diagram.php?id=+1'>
        <button type='submit'>Load Canvas</button>
        </form>
        <br>
            <form action="diagram.php?id=2">
        <button type='submit'>Upload Canvas</button>
            </form>
        <br>
                <form action="diagram.php?id=3">
        <button type='submit'>Example Canvas</button>
                </form>
    </div>
</div>
<?php
$noup = "COURSE";
include '../Shared/navheader.php';
?>
<!-- content START -->

<!-- The Appearance menu. Default state is display: none; -->
<div id="appearance" class='loginBox' style='display: none;'>
    <div class='loginBoxheader'>
        <h3>Apperance</h3>
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

</body>
</html>