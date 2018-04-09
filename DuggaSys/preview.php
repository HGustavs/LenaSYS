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
    <script src='../Shared/markdown.js'></script>

    <style>
        .PreviewWindow {
            height: 700px;
            width: 900px;
            margin: 0px auto;
            border: solid rgb(200,200,200);
            background-color: rgb(240,240,240);
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
            position: relative;
            bottom: 23px;
            right: 160px;
        }
        #button-save {
            position: relative;
            right: 90px;
        }
        .Markdown {
            border: solid rgb(200,200,200);
            background-color: #FFFFFF;
            width: 350px;
            height: 550px;
            position: relative;
            margin: 50px 10px 10px 10px;
            float: left;
        }
        .MarkdownPrev {
            border: solid rgb(200,200,200);
            background-color: #FFFFFF;
            width: 400px;
            height: 550px;
            position: relative;
            margin: 50px 10px 10px 10px;
            float: right;
        }
        .OptionButtons {
            top: 610px;
            position: relative;
            margin: 0px 10px 0px 10px;
        }
        .PrevHead {
            height: 30px
            position: relative;
            background-color: #775886;
            color: #FFFFFF;
            font-size: 14px;
            line-height:
        }
    </style>

    <script>
        function onload() {
            $(".PreviewWindow").hide();
        }
        function showPreview(test) {
            $(".PreviewWindow").show();
            var x= document.getElementById("test").value;
            //This function is triggered when key is pressed down in the input field
            if(str.length == 0){
                //Here we check if the input field is empty (str.length == 0).
                // If it is, clear the content of the txtHint placeholder
                // and exit the function.
                document.getElementById("markdown").innerHTML = " ";
                return;
            }else {
                var xmlhttp =new XMLHttpRequest();  //Create an XMLHttpRequest object
                //Create the function to be executed when the server response is ready
                xmlhttp.onreadystatechange = function() { //Triggered every time the ready state changes.
                    if(this.readyState == 4 && this.status == 200){
                    }
                        document.getElementById("markdown").innerHTML = //replace markdown with responseText
                             parseLineByLine(x); //this.responseText; //get the response data as a string
                    };

                //Return data from the file
                //Specifies the type of request
                xmlhttp.open("POST", "../Shared/markdown.js", true);

                //Sends the request to the server
                xmlhttp.send(str);
            }
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
    <div class="PrevHead">This is the preview window</div>
    <div class="Markdown">
        <form>
            <input type="text"
                   id="test"
                   onkeyup="showPreview(test)">
        </form>
    </div>

    <div class="MarkdownPrev">
        <span id="markdown"> </span>

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
