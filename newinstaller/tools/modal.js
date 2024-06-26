document.addEventListener('DOMContentLoaded', function() {
    let modal = document.getElementById("genericModal");
    let closeModalBtn = document.getElementById("closeModal");
    let openModalBtn = document.getElementById("openModal");

    function openModal() {
        modal.style.display = "block";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    // Close the modal when the close button is clicked
    closeModalBtn.onclick = function() {
        closeModal();
    }

    // Open the modal when the open button is clicked
    openModalBtn.onclick = function() {
        openModal();
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
        // Logic for retying the installer will be implemented here.
        closeModal();
    }

    Window.changeDbSettings = function() {
        console.log("Changing DB settings...");
        // Logic for changing DB settings will be implemented here.
        closeModal();
    }

    Window.forceCreateDb = function() {
        console.log("Forcing database creation...");
        // Logic to force create database will be implemented here.
        closeModal();
    }

    Window.restartInstaller = function() {
        console.log("Restarting installer...");
        // Logic to restart the installer will be implemented here.
        closeModal();
    }

    // Expose the closeModal function globally
    Window.closeModal = closeModal;
});