<script>
    const types = Object.freeze({ 
        WARNING: "warning", 
        ERROR: "error", 
        SUCCESS: "success"
    }); 
    // Close the toast by clicking the X icon
    function closeToast(toastDiv) {
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

        // Three divs are created to structure the toast into three smaller containers (for styling purposes)
        // These divs will contain the toast content
        let toastLeft = document.createElement('div');
        let toastCenter = document.createElement('div');
        let toastRight = document.createElement('div');

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

        // Adds the smaller toast divs to the bigger toast div
        toastDiv.appendChild(toastLeft);
        toastDiv.appendChild(toastCenter);
        toastDiv.appendChild(toastRight);

        // Add the toast contents to the smaller toast divs
        toastLeft.appendChild(typeIcon);
        toastCenter.appendChild(typeText);
        toastCenter.appendChild(toastText);
        toastRight.appendChild(closeIcon);
         
        // Add the toast div to the toast container (containing all toasts)
        toastContainer.appendChild(toastDiv);
       
        // Changes the toast text to the input text
        toastText.innerHTML = text;

        // Decides the type of toast (changes the type icon and toast heading)
        switch(type) {
            case types.WARNING:
                typeIcon.innerHTML = types.WARNING;
                typeText.innerHTML = "Warning";
                toastDiv.classList.add(types.WARNING);
                break;
            case types.SUCCESS:
                typeIcon.innerHTML = "check_circle";
                typeText.innerHTML = "Success";
                toastDiv.classList.add(types.SUCCESS);
                break;
            case types.ERROR:
                typeIcon.innerHTML = types.ERROR;
                typeText.innerHTML = "Error";
                toastDiv.classList.add(types.ERROR);
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
        if(duration == "" || duration == null) {
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
<div id='toastContainer'></div>