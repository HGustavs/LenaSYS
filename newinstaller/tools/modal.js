document.addEventListener('DOMContentLoaded', function() {
    let modal;
    let closeModalBtn = document.getElementById("closeModal");
    let openModalBtn = document.getElementById("openModal");
    let dataError;
    let data;

    Window.checkTypeOfError = function(newDataError, newData) {
        
		if (newDataError.data.includes("Connection to database could not be established.")) {
			modal = document.getElementById("dbConnectionError");

		} else if (newDataError.data.includes("Failed on step set_permissions")) {
			modal = document.getElementById("permissionError");

		}else if (newDataError.data.includes("Failed on step create_db")) {
			modal = document.getElementById("dbCreationError");

		}else if (newDataError.data.includes("SQL error")) {
			modal = document.getElementById("SqlError");
		}

        dataError = newDataError;
        data = newData;
        showModalButton();
    }

    function openModal() {
        modal.style.display = "block";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    function showModalButton() {
        openModalBtn.style.display = "block";
    }

    function hideModalButton() {
        openModalBtn.style.display = "none";
    }

    if (closeModalBtn != null) {
        // Close the modal when the close button is clicked
        closeModalBtn.onclick = function() {
            closeModal();
        }
    }

    if (openModalBtn != null) {
        // Open the modal when the open button is clicked
        openModalBtn.onclick = function() {
            openModal();
        }
    }

    // Close the modal if the user clicks outside of the modal content
    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    }

    // Function to show the modal with dynamic content
    Window.showModal = function(header, body, buttons) {
        document.getElementById("modalHeader").innerHTML = header;
        document.getElementById("modalBody").innerHTML = body;

        var footer = document.getElementById("modalFooter");
        footer.innerHTML = '';
        buttons.forEach(button => {
            var btn = document.createElement("button");
            btn.innerHTML = button.text;
            btn.className = button.class;
            btn.onclick = new Function(button.onclick);
            footer.appendChild(btn);
        });

        openModal();
    }

    // Example functions for modal actions
    Window.retryInstaller = function() {

        if (dataError.data.includes("Connection to database could not be established.")) {
			navigateTo('page3');

		}else if (dataError.failed_step.includes("set_permissions")) {
			navigateTo('page1');

		}else if (dataError.failed_step.includes("create_db")) {
			navigateTo('page3');

		}else if (dataError.data.includes("SQL error")) {
			navigateTo('page1');
		}
        
        closeModal();
        hideModalButton();
    }

    Window.changeDbSettings = function() {

        data.changeRootUsername = document.getElementById("changeRootUsername").value;
        data.changeRootPassword = document.getElementById("changeRootPassword").value;
        data.changeHostname = document.getElementById("changeHostname").value;
        
        data.root_username = data.changeRootUsername;
        data.root_password = data.changeRootPassword;
        data.hostname = data.changeHostname;

        start_installer(data); 
        closeModal();
        hideModalButton();
    }

    Window.forceCreateDb = function() {

        data.overwrite_db = "true";
        data.overwrite_user = "true";

        start_installer(data);
        closeModal();
        hideModalButton();
    }

    Window.restartInstaller = function() {
        
        let inputFields = document.getElementsByClassName("input-field");

        // Clear each input field
        for (let i = 0; i < inputFields.length; i++) {
            let inputs = inputFields[i].getElementsByTagName("input");

            for (let j = 0; j < inputs.length; j++) {
                inputs[j].value = ""; 
                console.log(inputs[j].value);
            }
        }

        navigateTo('page1');
        closeModal();
        hideModalButton();
    }

    // Expose the closeModal function globally
    Window.closeModal = closeModal;
});