<script>
    // Close the toast by clicking the X icon
    function closeToast(toastDiv){
        const toastContainer = document.getElementById('toastContainer');
        if (toastDiv) {
        // Delete the toast from the toast container
        toastContainer.removeChild(toastDiv);
        }
    }
    // Create a toast notification
    function toast(type, text, duration) {
        // We locate the container for all toasts
        const toastContainer = document.getElementById('toastContainer');
        // The toast div is created
        let toastDiv = document.createElement('div');

        // The icon for the toast type (error, warning or success) is created
        let typeIcon = document.createElement('span');
        typeIcon.classList.add('material-symbols-outlined', 'typeIcon');
        typeIcon.textContent = 'warning';

        // The close icon is created
        let closeIcon = document.createElement('span');
        closeIcon.classList.add('material-symbols-outlined', 'closeIcon');
        closeIcon.textContent = 'close';

        // When clicking on the toast icon, it should delete the toast
        closeIcon.onclick = function() {
            closeToast(toastDiv); 
        };

        // The type text is created
        // typeText = the toast heading that describes the toast type (error, warning or success)
        let typeText = document.createElement('span');
        typeText.classList.add('typeText');

        // The toast text is created
        // toastText = the toast text message (Ex. Operation failed!)
        let toastText = document.createElement('p');
        toastText.classList.add('toastText');

        // Add the toast contents to the toast div
        toastDiv.appendChild(typeIcon);
        toastDiv.appendChild(typeText);
        toastDiv.appendChild(closeIcon);
        toastDiv.appendChild(toastText);
         
        // Add the toast div to the toast container (containing all toasts)
        toastContainer.appendChild(toastDiv);
       
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
        toastDiv.classList.add('show', 'toast');

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

<!-- The toast container containing all toasts -->
<div id='toastContainer'>
    <!-- The following commented out code shows the structure of a toast notication
    <div class='toasterr'>
        <span class="material-symbols-outlined" class='typeIcon'>warning</span>
        <span class='typeText'></span>
        <span class="material-symbols-outlined" class='closeIcon' onclick='closeToast()'>close</span>
        <p class='toastText'></p>
    </div>  -->
</div>

