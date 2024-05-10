let progressInfo = document.getElementById("progress");
let progressPercentage = document.getElementById("progressPercentage");
let progressBar = document.getElementById("progressBar");
const getCurrentValue = () => parseInt(progressBar.value);

document.addEventListener("DOMContentLoaded", function() {
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

    //start_installer(JSON.stringify({ verbose: 'false', overwrite_db: 'true', overwrite_user: 'true'}));

    function start_installer(settings) {
        fetch('installer.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'installation_settings=' + encodeURIComponent(settings)
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