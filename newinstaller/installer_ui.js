let progressInfo = document.getElementById("progress");
let progressPercentage = document.getElementById("progressPercentage");
let progressBar = document.getElementById("progressBar");

let checkboxToggle = document.getElementById("language-support");

const getCurrentValue = () => parseInt(progressBar.value);

document.addEventListener("DOMContentLoaded", function() {
    // Navigation functionality to handle SPA navigations
    function navigateTo(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });

        // Show the requested page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            console.log("showing " + pageId);
            targetPage.style.display = 'flex';
        } else {    
            console.error("Page not found:", pageId);
        }
    }

    // Attach event listeners to all navigation buttons inside pages
    document.querySelectorAll('.page-nav').forEach(button => {
        button.addEventListener('click', function() {
            const pageId = this.getAttribute('data-target');
            navigateTo("page" + pageId);
        });
    });

    // Function to toggle language support checkboxes clickable or not.
    function updateCheckboxState() {
        // Gets all checkboxes within the input-sub-grid div.
        let subCheckboxes = document.querySelectorAll("#page5 div.input-sub-grid input");
        let subCheckboxText = document.querySelectorAll("#page5 div.input-sub-grid label");

        // Checks every element with classname checkbox within input-sub-grid class.
        subCheckboxes.forEach(checkbox => {
            if (checkboxToggle.checked) {
                checkbox.disabled = false;
            } else {
                checkbox.disabled = true;
            }
        });

        subCheckboxText.forEach(checkboxText => {
            if (checkboxToggle.checked) {
                checkboxText.style.opacity = '1';
            } else {
                checkboxText.style.opacity = '0.7';
            }
        });
    }

    // Add eventlistener to the last checkbox, this is the test-data checkbox from page 5.
    checkboxToggle.addEventListener('click', updateCheckboxState());

    const traceElements = document.querySelectorAll('.trace');

    traceElements.forEach(traceElement => {
        const toggleLink = traceElement.querySelector('.toggleTrace');
        const stacktrace = traceElement.querySelector('.stacktrace');

        toggleLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior

            if (stacktrace.style.display === 'none' || stacktrace.style.display === '') {
                stacktrace.style.display = 'block';
                toggleLink.textContent = 'View less';
            } else {
                stacktrace.style.display = 'none';
                toggleLink.textContent = 'View more';
            }
        });
    });

    // start_installer(JSON.stringify({ verbose: 'false', overwrite_db: 'true', overwrite_user: 'true'}));
    function start_installer() {
        fetch('installer.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'installation_settings=' + encodeURIComponent(JSON.stringify({ 
                verbose: 'false',
                overwrite_db: 'true', 
                overwrite_user: 'true',
                add_test_data: 'true',
                add_demo_course: 'true',
                add_test_course_data: 'true',
                add_test_files: "true",
                language_support: ["html", "java", "php", "plain", "sql", "sr"],
                starting_step: "",
                username: "Lena",
                password: "Syp9393",
                hostname: "db",
                db_name: "LenaDB",
            }))
        });
        
        let sseReceiver = new SSEReceiver({
            message: function(data) {
                progressInfo.innerHTML = data + "<br>" + progressInfo.innerHTML;
            },
            updateProgress: function(data) {
                let targetValue = parseInt(data);
                let distance = Math.abs(targetValue - getCurrentValue());
                let speedFactor = Math.max(4, distance / 100);
                let increment = (targetValue - getCurrentValue()) / (100 * speedFactor);
        
                if (targetValue === 100) {
                    progressBar.value = 100;
                    progressPercentage.innerHTML = "100%";
                }
        
                function update() {
                    if ((increment > 0 && getCurrentValue() < targetValue) && !(getCurrentValue() > targetValue)) {
                        progressBar.value += increment;
                        progressPercentage.innerHTML = Math.round(progressBar.value) + "%";
                        requestAnimationFrame(update);
                    }
                }
                
                update();
            }
        });
    }
});