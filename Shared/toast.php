<?php
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Toast TESTING</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <script>
        //let toastAmount = 0;

        function closeToast(){
            snackbar.className = snackbar.className.replace("show", "");
        }
        function myFunction() {

            // toastAmount++;
            //console.log("toastAmount: "+toastAmount);

            // Get the snackbar DIV
            let snackbar = document.getElementById("snackbar");
            let snackbarText = document.getElementById("snackbarText");
            let typeIcon = document.getElementById("typeIcon");
            let duration = document.getElementById("duration").value;
            let type = document.getElementById("type").value;
            let text = document.getElementById("text").value;
        
            // Changes the toast text to the input text
            snackbarText.innerHTML = text;

            // Decides the type of toast (changes the type icon)
            switch(type){
                case "warning":
                    typeIcon.innerHTML = "warning";
                    break;
                case "success":
                    typeIcon.innerHTML = "check_circle";
                    break;
                case "error":
                    typeIcon.innerHTML = "error";
                    break;
            }

            // Add the "show" class to DIV
            snackbar.className = "show";
        
            // Default duration
            if(duration == "" || duration == null){
                duration = 3;
            }
             // After x amount of seconds, remove the show class from DIV
            setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, duration*1000);
            /*             
            if(toastAmount > 0){
                toastAmount--;
            } 
            */
        } 
    </script>
    <style>
        #snackbar {
            visibility: hidden; 
            min-width: 200px; 
            margin-right: 10px; 
            border-radius: 10px; 
            padding: 15px;

            text-align: center; 

            position: fixed;
            right: 5%;
            top: 20px;
            z-index: 1; 

            background-color: red;
            color: #fff; 

            display: grid;
            grid-template-areas: 
            'type close'
            'text text';
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
        }

        #snackbar.show {
        visibility: visible; 
        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
        However, delay the fade out process for 2.5 seconds */
        -webkit-animation: fadein 0.5s;
        animation: fadein 0.5s;
        }

        #snackbarText{
           font-family: Arial; 
           grid-area: "text";
           overflow-y: scroll;
           width: 200%;
        }
        #typeIcon{
            grid-area: "type";
            cursor: default;
        }

        #closeIcon{
            grid-area: "close";
            cursor: pointer;
            /* margin-right: -90px; */
        }

        @-webkit-keyframes fadein {
        from {top: 0; opacity: 0;}
        to {top: 30px; opacity: 1;}
        }

        @keyframes fadein {
        from {top: 0; opacity: 0;}
        to {top: 30px; opacity: 1;}
        }

        @-webkit-keyframes fadeout {
        from {top: 30px; opacity: 1;}
        to {top: 0; opacity: 0;}
        }

        @keyframes fadeout {
        from {top: 30px; opacity: 1;}
        to {top: 0; opacity: 0;}
        } 
    </style>
</head>
<body>
    <button onclick="myFunction()">Show Snackbar</button>
    <select id='type'>
        <option value='warning'>Warning</option>
        <option value='success'>Success</option>
        <option value='error'>Error</option>
    </select>

    <div>
        <label for='text'>Text: </label>
        <input id='text' type='text'></input>
    </div>

    <div>
        <label for='duration'>Duration (s): </label>
        <input id='duration' type='number'></input>
    </div>


    <div id='toastContainer'></div>
    <div id='snackbar'>
        <span class="material-symbols-outlined" id='typeIcon'>warning</span>
        <span class="material-symbols-outlined" id='closeIcon' onclick='closeToast()'>close</span>
        <p id='snackbarText'>Hellooo HIII</p>
    </div> 
</body>
</html>
