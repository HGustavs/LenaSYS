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
    <div style="background-color:#614875;height: 100vh;width: 150px;position:fixed;left:0;right:0;top:50px;padding:20px;">
    <div id='buttonDiv' >

    <input type="button" name="answer" value='New Canvas' onclick='loadNew()' />
    <br>
    <br>
    <input type="button" name="answer" value="Load Canvas" onclick='loadStored()' />
        <br>
    <br>

    <input type="button" name="answer" value="Upload Canvas" onclick='loadUpload()' />
        <br>
    <br>
         <input type="button" name="answer" value="Example Canvas" onclick='loadExample()' />
    </div>
</div>
</div>


<?php
$noup = "COURSE";
include '../Shared/navheader.php';
?>
<!-- content START -->
<div id='showStored' style="display:none;position:absolute;left:190px;top:50px">
    <div id="b" style="position:fixed;height:100vh;width:100px;border-right:1px solid black;">
        <?php
        if ($handle = opendir('Save/')) {
        $blacklist = array('.', '..', 'Save', 'id.txt');
        while (false !== ($file = readdir($handle))) {
        if (!in_array($file, $blacklist)) {
            ?>
            <br>

            <button id=but name="answer" value='<?php print $file ?>' style="margin-left:15px;left:10px;width:60px;margin-top:5px;" onclick='loadStoredFolders("<?php print $file ?>")'><?php print $file ?></button>

        <?php

        }
        }
        closedir($handle);
        }
        ?>
    </div>
</div>
<?php


?>
<div id='showStoredFolders' style="display:none;position:absolute;left:300px;top:50px">
    <div id="a" style="position:fixed;height:100vh;width:100px;border-right:1px solid black;">
        <?php
        if(isset($_POST["Folder"])) {
        $newFolder = $_POST['Folder'];


            if ($handle = opendir("Save/$newFolder/")) {
                $blacklist = array('.', '..', 'Save', 'id.txt');
                while (false !== ($file = readdir($handle))) {
                    if (!in_array($file, $blacklist)) {
                        ?>
                        <br>

                        <button id=but name="answer" value='<?php print $file ?>'
                                style="margin-left:15px;left:10px;width:60px;margin-top:5px;"
                                onclick='redirect(this)'><?php print $file ?></button>

                        <?php

                    }
                }
                closedir($handle);
            }
        }
        ?>
    </div>
</div>
<div id="newFolder" style="visibility:hidden;position:absolute;left:500px;top:55px;">
    <form action="diagram_IOHandler.php" method="post">
    Folder name:<input name="folderName" type="text"  />
    <br>
    Permissions: W<input type="checkbox" name="W" value="W"> R<input type="checkbox" name="R" value="R"> X<input type="checkbox" name="X" value="X">
    <br>
    <button type="submit" >Create!</button>
    </form>
</div>
<div id='showNew' style="display:none;position:absolute;left:190px;top:50px">
   <div id="a" style="position:fixed;height:100vh;width:300px;border-right:1px solid black;">
       <button id=but name="answer"  style="margin-left:50px;width:200px;margin-top:5px;" onclick='document.getElementById("newFolder").style.visibility= "visible"'>New Folder</button>
        <hr>
       <?php
       if ($handle = opendir('Save/')) {
           $blacklist = array('.', '..', 'Save', 'id.txt');
           while (false !== ($file = readdir($handle))) {
               if (!in_array($file, $blacklist)) {
                   ?>
                   <br>

                   <button id=but name="answer" value='<?php print $file ?>' style="margin-left:90px;left:10px;width:100px;margin-top:5px;" onclick='redirect(this)'><?php print $file ?></button>

                   <?php

               }
           }
           closedir($handle);
       }

       function newMap(){

           mkdir("Save/a",0777,true);
       }
       ?>

   </div>
</div>


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
<?php
if(isset($_POST["folderName"])){
    $name = $_POST["folderName"];
    if(!is_dir("Save/$name")) {
        mkdir("Save/$name", 0777, true);
    }
}
?>

</body>
</html>