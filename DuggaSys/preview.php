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
            .Header {
                width: 100%;
                height: 50px;
                background-color: #775886;
                color: #FFFFFF;
                text-align: center;
                font-size: 24px;
                line-height: 50px;
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
            .boldText {
                cursor: pointer;
                margin-left: 10px;
            }
            .cursiveText {
                cursor: pointer;
                margin-left: 10px;
            }
            #h1 {
                font-size: 13px;
            }
            #h2 {
                font-size: 12px;
            }
            #h3 {
                font-size: 11px;
            }
            .headerType {
                cursor: pointer;
                margin-left: 150px;
            }
            .show-dropdown-content {
                display: block;
            }
            #select-header {
                max-width: 53px;
                position: absolute;
                z-index: 2000;
                right: 80px;
                background-color: #fff;
                box-shadow: 0px 10px 20px rgba(0,0,0,0.19), 0px 6px 6px rgba(0,0,0,0.3);
                padding: 5px 5px 5px 5px;
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
                                
            function saveCode() {
                
            }
            function cancelPreview() {
                $(".PreviewWindow").hide();     
            }
            function saveMarkdown() {
                
            }
            function showPreview(str) {
                $(".PreviewWindow").show();
                //This function is triggered when key is pressed down in the input field
                if(str.length == 0){
                    //Here we check if the input field is empty (str.length == 0).
                    // If it is, clear the content of the txtHint placeholder
                    // and exit the function.
                    document.getElementById("markdown").innerHTML = " ";
                    return;
                }
                else {
                    document.getElementById("markdown").innerHTML=parseMarkdown(str);
                };
            }
            function makeBold() {
                
            }
            function makeCursive() {
                
            }
            function showDropdown() {
                $('#select-header').show();
            }
            function selected() {
                var headerValue1 = document.getElementById('h1').value;
                var headerValue2 = document.getElementById('h2').value;
                var headerValue3 = document.getElementById('h3').value;
                
                if (headerValue1 == "H3") {
                    $('#mrkdwntxt').append("# "); 
                }
                else if (headerValue2 == "H2") {
                    $('#mrkdwntxt').append("## ");                 }
                else {
                    $('#mrkdwntxt').append("### "); 
                }
                $('#select-header').hide();
            }
            
            $(document).ready(function(){
               $(".headerType").click(function(){
                    $("#select-header").toggle();
                    $("#select-header").addClass("show-dropdown-content");
                });
            });
            
            // Close the dropdown if the user clicks outside of it
            window.onclick = function(event) {
                if (!event.target.matches('#select-header')) {
                    var dropdowns = document.getElementById("select-header");
                    var i;
                    for (i = 0; i < dropdowns.length; i++) {
                        var openDropdown = dropdowns[i];
                        if (openDropdown.classList.contains('showDropdown')) {
                            openDropdown.classList.remove('showDropdown');
                            var dropdowns = document.getElementById("select-header");
                            var i;
                            for (i = 0; i < dropdowns.length; i++) {
                                var openDropdown = dropdowns[i];
                                if (openDropdown.classList.contains('showDropdown')) {
                                    openDropdown.classList.remove('showDropdown');
                                }
                            }
                        }
                    }
                }
            }
        </script>
    </head>
    <body onload="onload()">
        <div class="Header">Markdown preview</div>
        <button id="Preview" onclick="showPreview()">Preview</button>
        <div class="PreviewWindow">
            <div class="PrevHead">This is the preview window
            </div>
            <div class="Markdown">
                <div class="markNav">Markdown
                    <span class="headerType">aA&#9663;</span>
                        <div id="select-header">
                            <a href="#" id="h1" onclick="selected()" value="H1">Header 1</a>
                            <a href="#" id="h2" onclick="selected()" value="H2">Header 2</a>
                            <a href="#" id="h3" onclick="selected()" value="H3">Header 3</a>
                        </div>
                    <span class="boldText" onclick="makeBold()"><b>B</b></span>
                    <span class="cursiveText" onclick="makeCursive()"><i>i</i></span>
                </div>
                <div class="markText">
                    <textarea id="mrkdwntxt" onkeyup="showPreview(this.value)" name="markdowntext" rows="32" cols="40"></textarea>
                </div>
            </div>
            <div class="MarkdownPrev">
                <div class="prevNav">Markdown Preview</div>
                <div class="markTextPrev">
                    <div class="prevSpan">
                        <span id="markdown"></span>
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
