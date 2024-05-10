<script>
    const types = Object.freeze( { 
        WARNING: "warning", 
        ERROR: "error", 
        SUCCESS: "success",
        UNDO: "undo",
        CONFIRM: "confirm"
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
    function toast(type, text, duration, arguments = null, arguments2 = null) {
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

        // The toast confirm options are created
        // toastYes / toastNo = the toast confirm buttons (used for CONFIRM type)
        let toastYes = document.createElement('span');
        let toastNo = document.createElement('span');

        // Creates the icon-element for each option.
        let yesIcon = document.createElement('span');
        let noIcon = document.createElement('span');

        // Creates the text-element for each option (yes / no)
        let yesText = document.createElement('span');
        let noText = document.createElement('span');

        // Inserts the text into each option
        yesText.innerHTML = "Yes";
        noText.innerHTML = "No";

        // Creates an icon for each option
        yesIcon.innerHTML = "done";
        noIcon.innerHTML = "close";

        yesIcon.classList.add('material-symbols-outlined');
        noIcon.classList.add('material-symbols-outlined');

        // Adds the styling to each button
        toastYes.classList.add('toastYes');
        toastNo.classList.add('toastNo');

        // The toast buttonbox is created
        // toastButtonBox = the toast confirm button
        let toastButtonBox = document.createElement('div');
        toastButtonBox.classList.add('toastButtonBox');

        // Adds the smaller toast divs to the bigger toast div
        toastDiv.appendChild(toastLeft);
        toastDiv.appendChild(toastCenter);
        toastDiv.appendChild(toastRight);

        // Add the toast contents to the smaller toast divs
        toastLeft.appendChild(typeIcon);
        toastCenter.appendChild(typeText);
        toastCenter.appendChild(toastText);
        toastRight.appendChild(closeIcon);
         
        // Add the icon and text to the button elements
        toastYes.appendChild(yesIcon);
        toastYes.appendChild(yesText);

        toastNo.appendChild(noIcon);
        toastNo.appendChild(noText);

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
            case types.UNDO:
                typeIcon.innerHTML = types.UNDO;
                toastLeft.classList.add("clickable")
                toastLeft.setAttribute( "onClick", "javascript: "+arguments);
                typeText.innerHTML = "Notice";
                toastDiv.classList.add(types.UNDO);
                break;
            case types.CONFIRM:
                typeIcon.innerHTML = "Help";
                typeText.innerHTML = "Confirm";
                toastCenter.appendChild(toastButtonBox);
                toastButtonBox.appendChild(toastYes);
                toastButtonBox.appendChild(toastNo);
                toastYes.setAttribute( "onClick", "javascript: "+arguments);
                toastNo.setAttribute( "onClick", "javascript: "+arguments2);
                toastDiv.classList.add(types.CONFIRM);
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

        toastDiv.addEventListener('click', function(event) {
            // Check if the click target is not the close button
            if (!event.target.classList.contains('closeIcon')) {
                const toastText = this.querySelector('.toastText');
                const hasOverflow = toastText.scrollHeight > toastText.clientHeight;
                const isExpanded = this.classList.contains('expanded');

                this.classList.toggle('expanded');
                toastText.textContent = toastText.dataset.fullText || toastText.textContent;
                    
                // If the toast is expanded, set the height to auto to show full text
                if (this.classList.contains('expanded')){
                    // Reset the height to auto to show full text
                    toastText.style.height = 'auto';
                }
                // If the toast was previously expanded and is now collapsed, reset the height to 2rem
                if (isExpanded && !this.classList.contains('expanded')){
                    truncateOverflow(toastText); // Truncate overflow text
                    toastText.style.height = '2.3rem';
                }
            }
        });
        truncateOverflow(toastText); // Truncate overflow text initially

        // The duration of a toast decides how long it should be visible for
        // If no duration is given, the default duration should be 3 seconds.
        if(duration == "" || duration == null) {
            duration = 0;
        }
        // After x amount of seconds, remove the show class from DIV
        // Creates a fadeout animation using css classes
        if(duration !== 0){
            setTimeout(function(){ toastDiv.className = toastDiv.className.replace("show", "fadeout"); }, duration*1000);
            setTimeout(function(){ toastDiv.className = toastDiv.className.replace("fadeout", ""); }, 1*1000);
            setTimeout(function(){ toastDiv.className = toastDiv.className.replace("show", "")}, duration*1000 + 900);
            setTimeout(function(){ toastDiv.className = toastDiv.className.replace("fadeout", "")}, duration*1000 + 900);
        }
    } 
    function truncateOverflow(toastText) {
        const maxChars = 70; // Set the maximum number of characters before truncating
        const toastContent = toastText.textContent.trim();
        if (toastContent.length > maxChars) {
            // Truncate the content and add "..."
            toastText.textContent = toastContent.slice(0, maxChars) + '...';
            toastText.dataset.fullText = toastContent; // Store the full text in a data attribute
        }
    }
</script>
<!-- This link makes it possible to use Google icons (open source and permitted by Henrik) -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

<!-- The toast container containing all toasts -->
<div id='toastContainer'></div>