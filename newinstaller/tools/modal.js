document.addEventListener('DOMContentLoaded', function () {
    let modal;
    let closeModalBtn = document.getElementById("closeModal");
    let openModalBtn = document.getElementById("openModal");
    let dataError;
    let data;
    let changeRootUsernameInput = document.getElementById("changeRootUsername");
    let changeRootPasswordInput = document.getElementById("changeRootPassword");
    let changeHostnameInput = document.getElementById("changeHostname");

    Window.checkTypeOfError = function (newDataError, newData) {

        if (newDataError.data.includes("Connection to database could not be established.")) {
            modal = document.getElementById("dbConnectionError");

            // Set input fields values from lenaSYS installer input fields data
            changeRootUsernameInput.value = newData.root_username;
            changeRootPasswordInput.value = newData.root_password;
            changeHostnameInput.value = newData.hostname;

        } else if (newDataError.data.includes("Failed on step set_permissions")) {
            modal = document.getElementById("permissionError");

        } else if (newDataError.data.includes("Failed on step create_db")) {
            modal = document.getElementById("dbCreationError");

        } else if (newDataError.data.includes("SQL error") || newDataError.data.includes("File error.")) {
            modal = document.getElementById("SqlError");
        } else {
            modal = document.getElementById("operationError");
            document.getElementById("failedStep").innerHTML = newDataError.data;
        }

        let summaryContents = document.getElementsByClassName("summary-content");

        for (let i = 0; i < summaryContents.length; i++) {
            summaryContents[i].innerHTML = generateSummaryHTML(newData);
        };

        dataError = newDataError;
        data = newData;
        showModalButton();
    }

    function generateSummaryHTML(data) {
        return `
          <b>Step 1:</b> <br>
          Operating system: ${data.operating_system} <br><br>
          <b>Step 2:</b> <br>
          Create new database: ${data.create_db} <br>
          Create new user: ${data.create_db_user} <br><br>
          <b>Step 3:</b> <br>
          Database name: ${data.db_name} <br>
          Hostname: ${data.hostname} <br>
          User: ${data.username} <br>
          Password: ${data.password} <br>
          Use distributed environment: ${data.distributed_environment} <br>
          Verbose: ${data.Verbose} <br>
          Overwrite database: ${data.overwrite_db} <br>
          Overwrite user: ${data.overwrite_user} <br><br>
          <b>Step 4:</b> <br>
          Root username: ${data.root_username} <br>
          Root password: ${data.root_password} <br><br>
          <b>Step 5:</b> <br>
          Include test data: ${data.add_test_data} <br>
          Include demo course: ${data.add_demo_course} <br>
          Include test course data:: ${data.add_test_course_data} <br>
          Include test files: ${data.add_test_files} <br><br>
          <b>Step 6:</b> <br>
          <details>
            <summary>Include language support</summary>
            <div>
                ${data.language_support.map(lang => `${lang}`).join('<br>')} 
            </div>
          </details>
        `;
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
        closeModalBtn.onclick = function () {
            closeModal();
        }
    }

    if (openModalBtn != null) {
        // Open the modal when the open button is clicked
        openModalBtn.onclick = function () {
            openModal();
        }
    }

    // Close the modal if the user clicks outside of the modal content
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    }

    // Function to show the modal with dynamic content
    Window.showModal = function (header, body, buttons) {
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
    Window.retryInstaller = function () {

        if (dataError.data.includes("Connection to database could not be established.")) {
            navigateTo('page3');

        } else if (dataError.data.includes("Failed on step set_permissions")) {
            navigateTo('page1');

        } else if (dataError.data.includes("Failed on step create_db")) {
            navigateTo('page3');

        } else if (dataError.data.includes("SQL error") || dataError.data.includes("File error.")) {
            navigateTo('page1');
        } else {
            navigateTo('page1');
        }

        closeModal();
        hideModalButton();
        setProgressBarWidth(0);
    }

    Window.changeDbSettings = function () {

        // Set data config values from database connection failed input fields
        data.changeRootUsername = changeRootUsernameInput.value;
        data.changeRootPassword = changeRootPasswordInput.value;
        data.changeHostname = changeHostnameInput.value;

        // Set main data config values
        data.root_username = data.changeRootUsername;
        data.root_password = data.changeRootPassword;
        data.hostname = data.changeHostname;

        // Update form fields to prevent using old values on retry
        document.getElementById("root_username").value = data.changeRootUsername;
        document.getElementById("root_password").value = data.changeRootPassword;
        document.getElementById("hostname").value = data.changeHostname;

        start_installer(data);
        closeModal();
        hideModalButton();
    }

    Window.forceCreateDb = function () {

        data.overwrite_db = "true";
        data.overwrite_user = "true";

        start_installer(data);
        closeModal();
        hideModalButton();
    }

    Window.restartInstaller = function () {

        let inputFields = document.getElementsByClassName("input-field");

        // Clear each input field
        for (let i = 0; i < inputFields.length; i++) {
            let inputs = inputFields[i].getElementsByTagName("input");

            for (let j = 0; j < inputs.length; j++) {
                inputs[j].value = "";
            }
        }

        navigateTo('page1');
        closeModal();
        hideModalButton();
        setProgressBarWidth(0);
    }

    // Expose the closeModal function globally
    Window.closeModal = closeModal;
});