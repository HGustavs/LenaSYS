<?php

/**
 * Created by IntelliJ IDEA.
 * User: a15andau
 * Date: 2017-04-04
 * Time: 09:01
 */


session_start();

include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>
<!DOCTYPE html>
<html>
<head>
    <link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Analysis Page</title>



    <link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
    <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

    <script src="../Shared/js/jquery-1.11.0.min.js"></script>
    <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>

    <script src="../Shared/dugga.js"></script>
    <script src="stats.js"></script>

</head>
<body>

<!-- Navigation Header START -->
<?php
$noup="SECTION";
include '../Shared/navheader.php';
?>
<!-- Navigation Header END -->

<!-- Content START -->
<div id="content">
    <table class="list">
            <tbody>
                <tr>
                    <th style="width:30px"></th>
                    <th style="height:30px"></th>
                </tr>
            </tbody>
    </table>
</div>

<!-- Content END -->

<!-- Login Dialog START -->
<?php
include '../Shared/loginbox.php';
?>

</body>
</html>
