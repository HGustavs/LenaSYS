<script>
    const toastDiv = document.getElementById("toast");
    // Close the toast by clicking the X icon
    function closeToast(){
        // Get the toast div
        let toastDiv = document.getElementById("toast");
        toastDiv.className = toast.className.replace("show", "");
    }
    // Create a toast notification
    function toast(type, text, duration) {
        // Get the content of the toast div
        // toastDiv = the div containing the toasts contents
        let toastDiv = document.getElementById("toast");
        // toastText = the toast text message (Ex. Operation failed!)
        let toastText = document.getElementById("toastText");
        // typeIcon = the icon that represents the type of toast (error, warning or success)
        let typeIcon = document.getElementById("typeIcon");
        // typeText = the toast heading that describes the toast type (error, warning or success)
        let typeText = document.getElementById("typeText");

        // Changes the toast text to the input text
        toastText.innerHTML = text;

        // Decides the type of toast (changes the type icon and toast heading)
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
            // We create a default situation in case no type is given.
            // The default toast will not have an icon nor heading.
            default:
                typeIcon.innerHTML = "";
                typeText.innerHTML = "";
                break;
        }
        // Makes the toast visible ("show" is a class that makes the toast visible through css)
        toastDiv.className = "show";

        // The duration of a toast decides how long it should be visible for
        // If no duration is given, the default duration should be 3 seconds.
        if(duration == "" || duration == null){
            duration = 3;
        }
        // After x amount of seconds, remove the show class from DIV
        // Creates a fadeout animation using css classes
        setTimeout(function(){ toastDiv.className = toastDiv.className.replace("show", "fadeout"); }, duration*1000);
        setTimeout(function(){ toastDiv.className = toastDiv.className.replace("fadeout", ""); }, 1*1000);
        setTimeout(function(){ toastDiv.className = toastDiv.className.replace("show", "")}, duration*1000 + 900);
        setTimeout(function(){ toastDiv.className = toastDiv.className.replace("fadeout", "")}, duration*1000 + 900);
    } 
</script>
<!-- This link makes it possible to use Google icons (open source and permitted by Henrik) -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
<!-- The structure of a toast notication -->
<div id='toast'>
    <span class="material-symbols-outlined" id='typeIcon'>warning</span>
    <span id='typeText'></span>
    <span class="material-symbols-outlined" id='closeIcon' onclick='closeToast()'>close</span>
    <p id='toastText'></p>
</div> 
