<!DOCTYPE html>
<html>
    <head>
        <link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
        <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome = 1">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Preview</title>
        <link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
        <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
        <script src="../Shared/js/jquery-1.11.0.min.js"></script>
        <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
        <script src="../Shared/dugga.js"></script>
        <style>
            .PreviewWindow {
                height: 900px;
                width: 600px;
                margin: 0px auto;
                border: solid rgb(200,200,200);
                background-color: rgb(240,240,240);
            }
                
        </style>
        <script>
            function onload() {
                $(".PreviewWindow").hide();
            }
            function showPreview() {
                $(".PreviewWindow").show();
            }
                                
            function saveCode() {
                
            }
            function cancelPreivew() {
                $(".PreviewWindow").hide();     
            }
            function saveMarkdown() {
                
            }
        </script>
    </head>
    <body onload="onload()">
        Hello its me, preview
        <button id="Preview" onclick="showPreview()">Preview</button>
        <div class="PreviewWindow">
            This is the preview window  
            <button id="save" onclick="saveMarkdown()">Save</button>
            <button id="save" onclick="cancelPreview()">Cancel</button>
        </div>
        <?php
		  //echo $_GET['prev'];
        //?>
        
    </body>
</html>