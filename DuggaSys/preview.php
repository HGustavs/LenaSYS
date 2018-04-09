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
                height: 700px;
                width: 900px;
                margin: 0px auto;
                border: solid rgb(200,200,200);
                background-color: rgb(240,240,240);
                box-shadow: 0px 5px 10px grey;
            }
            .Header {
                width: 100%;
                height: 50px;
                background-color: #775886;
                color: #FFFFFF;
                text-align: center;
                font-size: 24px;
                line-height: 50px;
            }
            #button-cancel {
                position: absolute;
                left: 235px;
            }
            #button-save {
                position: absolute;
                left: 305px;
            }
            .Markdown {
                border: solid rgb(200,200,200);
                background-color: #FFFFFF;
                width: 350px;
                height: 550px;
                position: relative;
                margin: 20px 10px 10px 10px;
                float: left;
            }
            .MarkdownPrev {
                border: solid rgb(200,200,200);
                background-color: #FFFFFF;
                width: 490px;
                height: 550px;
                position: relative;
                margin: 20px 10px 10px 10px;
                float: right;
            }
            .OptionButtons {
                top: 585px;
                position: relative;
                margin: 0px 10px 0px 10px;
                height: 40px;
                width: 355px;
            }
             .PrevHead {
                height: 30px
                position: relative;
                background-color: #775886;
                color: #FFFFFF;
                font-size: 14px;
                line-height: 
            }
            .prevNav {
                background-color: #775886;
                height: 30px;
                color: #FFF;
            }
            .markNav {
                background-color: #775886;
                height: 30px;
                color: #FFF;
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
            function cancelPreview() {
                $(".PreviewWindow").hide();     
            }
            function saveMarkdown() {
                
            }
        </script>
    </head>
    <body onload="onload()">
        <div class="Header">Hello its me, preview</div>
        <button id="Preview" onclick="showPreview()">Preview</button>
        <div class="PreviewWindow">
            <div class="PrevHead">This is the preview window
            </div>
            <div class="Markdown">
                <div class="markNav">Markdown</div>
            </div>
            <div class="MarkdownPrev">
                <div class="prevNav">Markdown Preview</div>
            </div>
            <div class="OptionButtons">
                <button id="button-save" onclick="saveMarkdown()">Save</button>
                <button id="button-cancel" onclick="cancelPreview()">Cancel</button>
            </div>
        </div>
        <?php
		  //echo $_GET['prev'];
        //?>
        
    </body>
</html>