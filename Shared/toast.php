<style>
    /* Toast notifications */
    #snackbar {
    visibility: hidden; 
    min-width: 200px; 
    max-width: 300px;
    max-height: 150px;
    margin-right: 10px; 
    border-radius: 10px; 
    padding: 15px;

    text-align: center; 

    position: fixed;
    right: 5%;
    top: 20px;
    z-index: 8001; 
    /* light mode */
    background-color: #fecc56;
    /*  Darkmode background color: #e9e9e9 */
    color: #000; 

    display: grid;
    grid-template-areas: 
    'icon type close'
    'text text text';
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3), 0 5px 20px 0 rgba(0, 0, 0, 0.3);
    }

    #snackbar.show {
        visibility: visible; 
        -webkit-animation: fadein 0.5s;
        animation: fadein 0.5s;
    }

    #snackbarText{
        font-family: Arial; 
        grid-area: "text";
        overflow-y: scroll;
        width: 300%;
        height: 85px;
    }
    #typeIcon{
        grid-area: "icon";
        cursor: default;
        height: 1.5rem;
    }

    #typeText{
        grid-area: "type";
        font-family: Arial; 
        font-weight: bold;
        font-size: 1.2em;
    }

    #closeIcon{
        grid-area: "close";
        cursor: pointer;
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
    /* Toast notifications END */
</style>
<script>
    // Close the toast by clicking the X icon
    function closeToast(){
        snackbar.className = snackbar.className.replace("show", "");
    }
    // Create a toast notification
    function toast(type, text, duration) {
        let snackbar = document.getElementById("snackbar");
        let snackbarText = document.getElementById("snackbarText");
        let typeIcon = document.getElementById("typeIcon");
        let typeText = document.getElementById("typeText");

        // Changes the toast text to the input text
        snackbarText.innerHTML = text;

        // Decides the type of toast (changes the type icon)
        switch(type){
            case "warning":
                typeIcon.innerHTML = "warning";
                typeText.innerHTML = "Warning";
                break;
            case "success":
                typeIcon.innerHTML = "check_circle";
                typeText.innerHTML = "Success";
                break;
            case "error":
                typeIcon.innerHTML = "error";
                typeText.innerHTML = "Error";
                break;
            default:
                typeIcon.innerHTML = "";
                typeText.innerHTML = "";
                break;
        }

        snackbar.className = "show";

        // Default duration
        if(duration == "" || duration == null){
            duration = 3;
        }
        // After x amount of seconds, remove the show class from DIV
        setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, duration*1000);
    } 
</script>
<!-- In the current version, Google icons needs to be linked in order for the icons to work -->
<!-- <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /> -->
<!-- The structure of a toast notication -->
<div id='snackbar'>
    <span class="material-symbols-outlined" id='typeIcon'>warning</span>
    <span id='typeText'></span>
    <span class="material-symbols-outlined" id='closeIcon'>close</span>
    <p id='snackbarText'></p>
</div> 
