In this file the connection between javascript and PHP is docummented.

# Name of file/service 

 accessed.js

## Description 

*Description of what the service do and its function in the system.* 

 Function - addUserToCourse
 Adds user to a user to a course. Looks up UID based on their username.

## Input Parameters 

*Parameters will be described in tables for easier readability* 

| Parameter | Type | Description | 

| :Username | :POST | :Retrieve User | 
 

## Calling Methods 

- POST 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

| Output | Type | Description | 

| :User | :Array | :Array of userdata from databas | 

| :UID | :String | :Identifier username | 
 

## Examples of Use 
function addUserToCourse() {
	let input = document.getElementById('addUsername2').value;
	let term = $("#addTerm2").val();
	if(input && term) {
		$.ajax({
			type: 'POST',
			url: 'accessedservice.php',
			data: {
				opt: 'RETRIEVE',
				action: 'USER',
				username: input
			},
			success: function(response) {
				userJson = response.substring(0, response.indexOf('{"entries":'));
				let responseData = JSON.parse(userJson);
				let uid = responseData.user[0].uid;
				AJAXService("USERTOTABLE", {
					courseid: querystring['courseid'],
					uid: uid,
					term: term,
					coursevers: querystring['coursevers'],
					action: 'COURSE'
				}, "ACCESS");
			},
			error: function(xhr, status, error) {
				console.error("Error", error);
			}
		});
		updateCourseUsers(hideAddUserPopup); // Sending function as parameter
	}
} 

### Microservices Used 

*Includes and microservices used* 

Accessedservice.php
opt- RETRIVE, action- USER

----------------------------------------------------------------------------------------------------------------------------
# Name of file/service

accessed.js

## Description
*Description of what the service do and its function in the system.*

Retrives UID with ajax POST, then deletes user with opt DELETE.

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |

| :Username | :POST | :Username of the user that should be removed |

## Calling Methods

- POST

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |

| :User | :Array | :Array of objects, UID. |

## Examples of Use
`function removeUserFromCourse() {
	let input = document.getElementById('addUsername3').value;
	if(input) {
		$.ajax({
			type: 'POST',
			url: 'accessedservice.php',
			data: {
				opt: 'RETRIEVE',
				action: 'USER',
				username: input
			},
			success: function(response) {
				userJson = response.substring(0, response.indexOf('{"entries":'));
				let responseData = JSON.parse(userJson);
				let uid = responseData.user[0].uid;
				AJAXService("DELETE", {
					courseid: querystring['courseid'],
					uid: uid,
					action: 'COURSE'
				}, "ACCESS");
			},
			error: function(xhr, status, error) {
				console.error("Error", error);
			}
		});
		updateCourseUsers(hideRemoveUserPopup); // Sending function as parameter
	}
}
`

### Microservices Used
*Includes and microservices used*

accessedservice.php
opt- RETRIEVE, action- USER
opt- DELETE, action- COURSE

-----------------------------------------------------------------------------------------------------------

# Name of file/service

accessed.js

## Description
*Description of what the service do and its function in the system.*

This function populates a dropdown list with users fetched from the databas.
It sends a POST request to accessedservice.php with the action USERS, receives user data.

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |

| :opt | :string | :Retrive users |
| :action | :string | :Return all users |

## Calling Methods

- POST

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |
| :Users | :Array | :Array with usernames |

## Examples of Use

function loadUsersToDropdown(id) {
	$.ajax({
		url: 'accessedservice.php',
		type: 'POST',
		data: { opt: 'RETRIEVE', action: 'USERS'},
		success: function(response) {
			usersJson = response.substring(0, response.indexOf('{"entries":'));
			let responseData = JSON.parse(usersJson);
			let filteredUsers = [];
			let length = responseData.users.length;
			for (let i = 0; i < length; i++) {
				let user = responseData.users[i];
				filteredUsers.push(user);
			}
			let dropdownList = document.getElementById(id);
			filteredUsers.forEach(user => {
				let option = document.createElement("option");
				option.value = user.username;
				dropdownList.appendChild(option);
			});
		},
		error: function(xhr, status, error) {
			console.error(error);
		}
	});

}

### Microservices Used
*Includes and microservices used*

accessedservice.php

opt- RETRIEVE, action- USERS

---------------------------------------------------------------------------------------------------------
# Name of file/service

courseed.js

## Description
*Description of what the service do and its function in the system.*

Updating course settings such as course name, course code and GitHub repository.

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |
| :coursename | :string | :New course name |
| :cid | :string | :Course ID |
| :coursecode | :string | :Course code |
| :courseGitURL | :string | :Git URL linked to the course |
## Calling Methods

- POST

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |
| :success | :bool | :DataCheck |

## Examples of Use
`function updateCourse() {
	var coursename = $("#coursename").val();
	var cid = $("#cid").val();
	var coursecode = $("#coursecode").val();
	var courseGitURL = $("#editcoursegit-url").val();
	var visib = $("#visib").val();
	var courseid = "C" + cid;

	var token = document.getElementById("githubToken").value;

	//Send information about the git url and possible git token for a course
	$.ajax({
		async: false,
		url: "../DuggaSys/gitcommitService.php",
		type: "POST",
		data: { 'githubURL': courseGitURL, 'cid': cid, 'token': token || undefined, 'action': 'directInsert' },
		success: function () {
			//Returns true if the data and JSON is correct
			dataCheck = true;
		},
		error: function (data) {
			//Check FetchGithubRepo for the meaning of the error code.
			switch (data.status) {
				case 403:
					toast("error", data.status + " Error \nplease insert valid git key", 7);
					break;
				case 422:
					toast("error", data.responseJSON.message + "\nDid not create/update token", 7);
					break;
				case 503:
					toast("error", data.responseJSON.message + "\nDid not create/update token", 7);
					break;
				default:
					toast("error", "Something went wrong with updating git token and git URL...", 7);
			}
			dataCheck = false;
		}
	});

	if (dataCheck) {
		// Show dialog
		$("#editCourse").css("display", "none");

		// Updates the course (except the course GitHub repo. 
		// Course GitHub repo is updated in the next block of code)
		$("#overlay").css("display", "none");
		AJAXService("UPDATE", { cid: cid, coursename: coursename, visib: visib, coursecode: coursecode, courseGitURL: courseGitURL }, "COURSE");
		localStorage.setItem('courseid', courseid);
		localStorage.setItem('updateCourseName', true);

		const cookieValue = `; ${document.cookie}`;
		const parts = cookieValue.split(`; ${"missingToken"}=`);

		if (dataCheck && parts[1] != 1) {
			//Check if courseGitURL has a value
			if (courseGitURL) {
				//Check if fetchGitHubRepo returns true
				if (fetchGitHubRepo(courseGitURL)) {
					localStorage.setItem('courseGitHubRepo', courseGitURL);
					//If courseGitURL has a value, display a message stating the update (with github-link) worked
					toast("success", "Course " + coursename + " updated with new GitHub-link!", 5);
					updateGithubRepo(courseGitURL, cid);
				}
				//Else: get error message from the fetchGitHubRepo function.

			} else {
				localStorage.setItem('courseGitHubRepo', " ");
				//If courseGitURL has no value, display an update message
				toast("success", "Course " + coursename + " updated!", 5);
			}
		}
		else {
			toast("warning", "Git token is missing/expired. Commits may not be able to be fetched", 7);
		}
	}
}`

### Microservices Used
*Includes and microservices used*

gitcommitService.php

Updates GitHub token and repository information
action- directInsert

----------------------------------------------------------------------------------------

# Name of file/service

## Description
*Description of what the service do and its function in the system.*

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |
| :--- | :--- | :--- |
| $exampleid | string | Example ID Description |

## Calling Methods

- GET
- POST
- etc.

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |
| :--- | :--- | :--- |
| exampleid | string | Example ID Description |

## Examples of Use
`CODE`

### Microservices Used
*Includes and microservices used*

Example of template for the documentation:

# Name of file/service

## Description
*Description of what the service do and its function in the system.*

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |
| :--- | :--- | :--- |
| $exampleid | string | Example ID Description |

## Calling Methods

- GET
- POST
- etc.

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |
| :--- | :--- | :--- |
| exampleid | string | Example ID Description |

## Examples of Use
`CODE`

### Microservices Used
*Includes and microservices used*

Example of template for the documentation:

# Name of file/service

## Description
*Description of what the service do and its function in the system.*

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |
| :--- | :--- | :--- |
| $exampleid | string | Example ID Description |

## Calling Methods

- GET
- POST
- etc.

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |
| :--- | :--- | :--- |
| exampleid | string | Example ID Description |

## Examples of Use
`CODE`

### Microservices Used
*Includes and microservices used*

Example of template for the documentation:

# Name of file/service

## Description
*Description of what the service do and its function in the system.*

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |
| :--- | :--- | :--- |
| $exampleid | string | Example ID Description |

## Calling Methods

- GET
- POST
- etc.

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |
| :--- | :--- | :--- |
| exampleid | string | Example ID Description |

## Examples of Use
`CODE`

### Microservices Used
*Includes and microservices used*