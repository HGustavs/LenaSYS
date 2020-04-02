<!DOCTYPE html>
<html>
    <head>
        <link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
        <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome = 1">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Preview</title>
        <link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
        <link type="text/css" href="../Shared/css/markdown.css" rel="stylesheet">
        <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
        <script src="../Shared/js/jquery-1.11.0.min.js"></script>
        <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
        <script src="../Shared/dugga.js"></script>
        <script src="../Shared/markdown.js"></script>
        <style>
            .PreviewWindow {
                height: 635px;
                width: 900px;
                margin: 0px auto;
                border: solid rgb(200,200,200);
                background-color: rgb(240,240,240);
                box-shadow: 0px 5px 10px grey;
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
                word-wrap: break-word;
                overflow-y: scroll;
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
            .prevSpan {
                max-width: 100%;
            }
            #button-cancel {
                position: absolute;
                left: 235px;
            }
            #button-save {
                position: absolute;
                left: 305px;
            }
            #button-close {
                float: right;
                position: relative;
                margin: 0px 10px 0px 0px;
            }
             .PrevHead {
                height: 20px;
                background-color: #775886;
                color: #FFFFFF;
                font-size: 14px;
                padding: 0px 5px 0px 5px;
            }
            .prevNav {
                background-color: #775886;
                height: 30px;
                color: #FFF;
                padding: 0px 5px 0px 5px;
                line-height: 25px;
            }
            .markNav {
                background-color: #775886;
                height: 30px;
                color: #FFF;
                padding: 0px 5px 0px 5px;
                line-height: 25px;
            }
            #mrkdwntxt {
                border-radius: 8px;
                box-shadow: 2px 2px 4px #888 inset;
                resize: none;
                margin: 10px 4px 0px 4px;
            }
            #boldText {
                cursor: pointer;
                margin-left: 10px;
            }
            #cursiveText {
                cursor: pointer;
                margin-left: 10px;
            }
            #headerType1 {
                cursor: pointer;
                color: #000;
                font-size: 13px;
                padding: 5px 5px 5px 5px;
                background-color: #fff;
            }
            #headerType1:hover {
                background-color: rgb(200,200,200);
            }
            #headerType2 {
                cursor: pointer;
                color: #000;
                font-size: 12px;
                padding: 5px 5px 5px 9px;
                background-color: #fff;
            }
            #headerType2:hover {
                background-color: rgb(200,200,200);
            }
            #headerType3 {
                cursor: pointer;
                color: #000;
                font-size: 11px;
                padding: 8px 5px 5px 13px;
                background-color: #fff;
            }
            #headerType3:hover {
                background-color: rgb(200,200,200);
            }

            .show-dropdown-content {
                display: block;
            }
            #select-header {
                max-width: 63px;
                position: absolute;
                z-index: 2000;
                right: 75px;
                background-color: rgba(0, 0, 0, 0);
                box-shadow: 0px 10px 20px rgba(0,0,0,0.19), 0px 6px 6px rgba(0,0,0,0.3);
            }
            a {
                text-decoration: none;
                color: #000;
            }

        </style>
        <script>

            function onload() {
                $(".PreviewWindow").hide();
                $('#select-header').hide();
            }
            function showPreview() {
                $(".PreviewWindow").show();
            }
            function cancelPreview() {
                $(".PreviewWindow").hide();
            }
            function saveMarkdown() {

            }

            function loadPreview(fileUrl) {
                var fileContent = getFileContents(fileUrl);
                document.getElementById("mrkdwntxt").value = fileContent;
                updatePreview(fileContent);
                $(".PreviewWindow").show();
            }

            function updatePreview(str) {
                //This function is triggered when key is pressed down in the input field
                if(str.length == 0){
                    /*Here we check if the input field is empty (str.length == 0).
                      If it is, clear the content of the txtHint placeholder
                      and exit the function.*/
                    document.getElementById("markdown").innerHTML = " ";
                    return;
                }
                else {
                    document.getElementById("markdown").innerHTML=parseMarkdown(str);
                };
            }
            function getFileContents(fileUrl){
              var result = null;
              $.ajax({
                url: fileUrl,
                type: 'get',
                dataType: 'html',
                async: false,
                success: function(data) {
                  result = data;
                }
            });
              return result;
            }


            function boldText() {
                $('#mrkdwntxt').val($('#mrkdwntxt').val()+'****');
            }

            function cursiveText() {
                $('#mrkdwntxt').val($('#mrkdwntxt').val()+'____');
                
            }

            function showDropdown() {
                $('#select-header').show();
            }
            function selected() {
                $('#select-header').hide();
            }

            function headerVal1() {
                $('#mrkdwntxt').val($('#mrkdwntxt').val()+'# ');

            }
            function headerVal2() {
                $('#mrkdwntxt').val($('#mrkdwntxt').val()+'## ');
            }
            function headerVal3() {
                $('#mrkdwntxt').val($('#mrkdwntxt').val()+'### ');
            }


            $(document).ready(function(){
               $(".headerType").click(function(){
                    $("#select-header").toggle();
                    $("#select-header").addClass("show-dropdown-content");
                });
            });

            //Hide dropdown if click is outside the div
            $(document).mouseup(function(e) {
                var container = $("#select-header");

                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    container.hide();
                }
            });
        </script>
    </head>
    <body onload="onload()">

        <div class="Header">Markdown preview</div>
            <button id="Preview" onclick="loadPreview('../courses/2/minimikrav_m2.md')">Preview</button>

        <div class="PreviewWindow">
            <div class="PrevHead">This is the preview window
            </div>
            <div class="Markdown">
                <div class="markNav">Markdown

                    <span class="headerType" title="Header">aA&#9663;</span>

                        <div id="select-header">
                            <span id="h1" onclick="selected();headerVal1()" value="H1">Header 1</span>
                            <span id="h2" onclick="selected();headerVal2()" value="H2">Header 2</span>
                            <span id="h3" onclick="selected();headerVal3()" value="H3">Header 3</span>
                        </div>

                    <span id="cursiveText" onclick="cursiveText()" title="Italic"><i>i</i></span>
                </div>
                <div class="markText">
                    <textarea id="mrkdwntxt" oninput="updatePreview(this.value)" name="markdowntext" rows="32" cols="40"></textarea>
                </div>
            </div>
            <div class="MarkdownPrev">
                <div class="prevNav">Markdown Preview</div>
                <div class="markTextPrev">
                    <div class="prevSpan">
                        <div class="descbox">
                            <span id="markdown"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="OptionButtons">
                <button id="button-save" onclick="saveMarkdown()">Save</button>
                <button id="button-cancel" onclick="">Cancel</button>
            </div>
            <button id="button-close" onclick="cancelPreview()">Close</button>
        </div>
        <?php
		  //echo $_GET['prev'];
        //?>

    </body>
</html>
