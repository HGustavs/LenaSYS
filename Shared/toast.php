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
        setTimeout(function(){ snackbar.className = snackbar.className.replace("show", "fadeout"); }, duration*1000);
        setTimeout(function(){ snackbar.className = snackbar.className.replace("fadeout", ""); }, 1*1000);
        setTimeout(function(){ snackbar.className = snackbar.className.replace("show", "")}, duration*1000 + 900);
        setTimeout(function(){ snackbar.className = snackbar.className.replace("fadeout", "")}, duration*1000 + 900);
    } 
</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
<!-- The structure of a toast notication -->
<div id='snackbar'>
    <span class="material-symbols-outlined" id='typeIcon'>warning</span>
    <span id='typeText'></span>
    <span class="material-symbols-outlined" id='closeIcon' onclick='closeToast()'>close</span>
    <p id='snackbarText'></p>
</div> 
