document.addEventListener('DOMContentLoaded', function() {
    let modal;
    let closeModalBtn = document.getElementById("closeModal");
    let openModalBtn = document.getElementById("openModal");
    let dataError;
    let data;

    Window.checkTypeOfError = function(newDataError, newData) {
        
        let dataLowerCase = newDataError.toLowerCase();
        
		if (dataLowerCase.includes("connection to database could not be established.")) {
			modal = document.getElementById("dbConnectionError");

		} else if (dataLowerCase.includes("test2")) {
			modal = document.getElementById("permissionError");

		}else if (dataLowerCase.includes("database exists error")) {
			modal = document.getElementById("dbCreationError");

		}else if (dataLowerCase.includes("test3")) {
			modal = document.getElementById("SqlError");
		}
        dataError = dataLowerCase;
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
        console.log("Retrying the installer...");

        if (dataError.includes("connection to database could not be established.")) {
			navigateTo('page3');

		} else if (dataError.includes("test2")) {
			navigateTo('page1');

		}else if (dataError.includes("database exists error")) {
			navigateTo('page3');

		}else if (dataError.includes("test3")) {
			navigateTo('page1');
		}
        
        closeModal();
        hideModalButton();
    }

    Window.changeDbSettings = function() {
        console.log("Changing DB settings...");
        // Logic for changing DB settings will be implemented here.
        closeModal();
        hideModalButton();
    }

    Window.forceCreateDb = function() {
        console.log("Forcing database creation...");

        data["overwrite_db"] = "true";
        data["overwrite_user"] = "true";

        start_installer(data);
        closeModal();
        hideModalButton();
    }

    Window.restartInstaller = function() {
        console.log("Restarting installer...");
        // Logic to restart the installer will be implemented here.
        closeModal();
        hideModalButton();
    }

    // Expose the closeModal function globally
    Window.closeModal = closeModal;
});