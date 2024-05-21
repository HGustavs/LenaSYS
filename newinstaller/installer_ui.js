let checkboxToggle = document.getElementById("language-support");
let currentPageIndex = 1;

document.addEventListener("DOMContentLoaded", function() {
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
	checkboxToggle.addEventListener('click', updateCheckboxState);

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

	document.addEventListener('keydown', function(event) {
		if (event.key === 'ArrowRight') {
			navigateToNextPage();
		} else if (event.key === 'ArrowLeft') {
			navigateToPreviousPage();
		}
	});

	document.addEventListener('keydown', function(event) {
        const focusedElement = document.activeElement;

        if (event.key === 'Enter') {
            if (focusedElement && (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'BUTTON')) {
                if (focusedElement.type === 'radio' || focusedElement.type === 'checkbox' || focusedElement.type === 'button') {
                    focusedElement.click();
                }
            }
        }
    });

	setProgressBarWidth(1);
});

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
		// Update currentPageIndex based on the pageId
		currentPageIndex = parseInt(pageId.replace('page', ''), 10);
	} else {    
		console.error("Page not found:", pageId);
	}
}

function navigateToNextPage() {
	const nextPageId = 'page' + (currentPageIndex + 1);
	const nextPage = document.getElementById(nextPageId);

	if (nextPage) {
        navigateTo(nextPageId);
    }
}

function navigateToPreviousPage() {
	if (currentPageIndex > 1) {
        const prevPageId = 'page' + (currentPageIndex - 1);
        navigateTo(prevPageId);
    }
}

function start_installer() {
	let error_occured = false;

	fetch('installer.php', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: 'installation_settings=' + encodeURIComponent(JSON.stringify({ 
			verbose: 'true',
			create_db: 'true',
			create_db_user: 'true',
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
			using_docker: "false",
			db_name: "LenaDB",
			root_username: "root",
			root_password: "password",
		}))
	});

	let sseReceiver = new SSEReceiver({
		message: function(data) {
			setProgressBarInfo(data);
		},
		updateProgress: function(data) {
			let targetValue = parseInt(data);
			let distance = Math.abs(targetValue - getProgressBarWidth());
			let speedFactor = Math.max(4, distance / 100);
			let increment = (targetValue - getProgressBarWidth()) / (100 * speedFactor);
			
			if (targetValue === 100) {
				setProgressBarWidth(100);
				//progressPercentage.innerHTML = "100%";
			}
	
			function update() {
				if ((increment > 0 && getProgressBarWidth() < targetValue) && !(getProgressBarWidth() > targetValue) && !error_occured) {
					incrementProgressBarWidth(increment);
					requestAnimationFrame(update);
				}
			}
			
			update();
		},
		error: function(data) {
			error_occured = true;
			alert(data);
		}
	});
}
