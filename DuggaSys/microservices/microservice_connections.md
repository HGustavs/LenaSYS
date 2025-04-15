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

-----------------------------------------------------------------------------------------------------------------------------------------------------
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

------------------------------------------------------------------------------------------------------------------------------------

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

----------------------------------------------------------------------------------------------------------------------------------------------------------

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