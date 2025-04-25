let checkboxToggle = document.getElementById("language_support");
let currentPageIndex = 1;

document.addEventListener("DOMContentLoaded", function() {
	const form = document.getElementById('installer_form');

    // Prevents the default behaviour of the form
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting
    });

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
	let languageSupportChecked = false;

	const form = document.getElementById('installer_form');
	const elements = Array.from(form.elements).filter(element => {
        return ['INPUT'].includes(element.tagName) &&
               ['text', 'password', 'radio', 'checkbox'].includes(element.type);
    });

	const data = {
        verbose: false,
        overwrite_db: false,
        overwrite_user: false,
        add_test_data: false,
        add_demo_course: false,
        add_test_course_data: false,
        add_test_files: false,
        language_support: [],
        starting_step: "",
        username: "",
        password: "",
        hostname: "",
        db_name: "",
    };

    // First pass to determine if language_support is checked
    elements.forEach(element => {
        const id = element.id;
        const type = element.type;

        if (id === 'language_support' && type === 'checkbox') {
            languageSupportChecked = element.checked;
        }
    });

    elements.forEach(element => {
        const name = element.name;
		const id = element.id;
        const type = element.type;
        const value = element.value;

        if (id) {
            switch (type) {
                case 'checkbox':
                    if (name === 'language_settings[]' && element.checked) {
						if (languageSupportChecked) {
							data.language_support.push(id);
						}
                    } else if (id !== 'language_support') {
                        data[id] = String(element.checked);
                    }
                    break;
                case 'radio':
                    if (element.checked) {
                        data[name] = id;
                    }
                    break;
                case 'text':
                case 'password':
                    data[id] = value;
                    break;
                default:
                    data[id] = value;
            }
        }
    });

	console.log("Form Data:", data);

	fetch('installer.php', {
		method: 'POST',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify(data)
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
				addButton(error_occured);
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
			addButton(error_occured);	
			checkTypeOfError(data);
		}
	});

	function checkTypeOfError(dataError) {
		let dataLow = dataError.toLowerCase();

		console.log(dataLow);

		if (dataLow.includes("test1")) {
			Window.addModalID("dbConnectionError");

		} else if (dataLow.includes("test2")) {
			Window.addModalID("permissionError");

		}else if (dataLow.includes("database exists error")) {
			Window.addModalID("dbCreationError");

		}else if (dataLow.includes("test3")) {
			Window.addModalID("SqlError");
		}

		Window.addData(data);
	}

	function addButton(error) {
		if (!error) {
			document.getElementById("pageButtonContainer").innerHTML = "<button class='defaultButton pageButton' onclick=location.href='../DuggaSys/courseed.php'>Finish</button>";
		}else {
			document.getElementById("pageButtonContainer").innerHTML = "<button class='defaultButton pageButton' onclick=navigateTo('page1')>Retry</button>";
		}
	}
}