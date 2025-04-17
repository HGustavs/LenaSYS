In this file the connection between javascript and PHP is docummented.

# Name of file/service 

 accessed.js
 Function addUserToCourse().

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
| :UID | :string | :Identifier username | 
 

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
Function removeUserFromCourse.

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

---------------------------------------------------------------------------------------------------------------------------

# Name of file/service

accessed.js
Function loadUsersToDropdown()

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
Function updateCourse()

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

courseed.js
Function FetchGitHubRepo

## Description
*Description of what the service do and its function in the system.*

Used to fetch and validate data from GitHub repository. If successful it return true, otherwise false.

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |

| :githubURL | :string | :GitHub URL |
| :action | :string | :Type of fetch |

## Calling Methods
- POST

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |

| :Success | :bool | :success/failure bool |
| :Message | :string | :Erro rmessage passed back from PHP |

## Examples of Use

`//Send valid GitHub-URL to PHP-script which fetches the contents of the repo
function fetchGitHubRepo(gitHubURL) {
	//Remove .git, if it exists
	regexURL = gitHubURL.replace(/.git$/, "");
	//Used to return success(true) or error(false) to the calling function
	var dataCheck;
	$.ajax({
		async: false,
		url: "gitfetchService.php",
		type: "POST",
		data: { 'githubURL': regexURL, 'action': 'getNewCourseGitHub' },
		success: function () {
			//Returns true if the data and JSON is correct
			dataCheck = true;
		},
		error: function (data) {
			//Check FetchGithubRepo for the meaning of the error code.
			switch (data.status) {
				case 422:
					toast("error", data.responseJSON.message + "\nDid not create/update course", 7);
					break;
				case 503:
					toast("error", data.responseJSON.message + "\nDid not create/update course", 7);
					break;
				default:
					toast("error", "Something went wrong...", 7);
			}
			dataCheck = false;
		}
	});
	return dataCheck;
}`

### Microservices Used
*Includes and microservices used*

gitfetchService.php
Uses: action- getNewCourseGitHub

---------------------------------------------------------------------
# Name of file/service

courseed.js
Function fetchLatestCommit

## Description
*Description of what the service do and its function in the system.*

This function sends a GitHub repository URL of the latest commit from the GitHub repository.
The latest commit is then stored in the database.

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |

| :gitHubURL | :string | :URL of the GitHub repository to fetch commits from|
| :action | :string | :getCourseID identifies type of action |

## Calling Methods
- POST

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |

| :status code | :int | :HTTP status,determine the result |
| :message | :string | :Error message |
| :success | :bool | :success=true, Error=false |

## Examples of Use
`//Send valid GitHub-URL to PHP-script which gets and saves the latest commit in the sqllite db
function fetchLatestCommit(gitHubURL) {
	//Used to return success(true) or error(false) to the calling function
	var dataCheck;
	$.ajax({
		async: false,
		url: "../DuggaSys/gitcommitService.php",
		type: "POST",
		data: { 'githubURL': gitHubURL, 'action': 'getCourseID' },
		success: function () {
			//Returns true if the data and JSON is correct
			dataCheck = true;
		},
		error: function (data) {
			//Check FetchGithubRepo for the meaning of the error code.
			switch (data.status) {
				case 422:
					toast("error", data.responseJSON.message + "\nDid not create/update course", 7);
					break;
				case 503:
					toast("error", data.responseJSON.message + "\nDid not create/update course", 7);
					break;
				default:
					toast("error", "Something went wrong...", 7);
			}
			dataCheck = false;
		}
	});
	return dataCheck;
}`

### Microservices Used
*Includes and microservices used*

gitcommitService.php
action- getCourseID

----------------------------------------------------------------------------------------
# Name of file/service

courseed.js
Function updateGithubRepo

## Description
*Description of what the service do and its function in the system.*

This function is used to update the GitHub repository and its associated course ID. 
 It sends a POST request to gitcommitService.php fetches and stores the latest commit in the database. 
Returns true on success or false on failure. 

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |

| :githubURL | :string | :GitHub repository URL |
| :cid | :string | :Course ID that is linked to the repository |
| :action | :string | :updateGithubRepo, type of task |

## Calling Methods
- POST

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |

| :status | :int | :HTTP status for error handling |
| :message | :string | :Error description |
| :sucess | :bool | :Success=true, Fail=false |

## Examples of Use
`//Send new Github URL and course id to PHP-script which gets and saves the latest commit in the sqllite db
function updateGithubRepo(githubURL, cid) {
	//Used to return success(true) or error(false) to the calling function
	var dataCheck;
	$.ajax({
		async: false,
		url: "../DuggaSys/gitcommitService.php",
		type: "POST",
		data: { 'githubURL': githubURL, 'cid': cid, 'action': 'updateGithubRepo' },
		success: function () {
			//Returns true if the data and JSON is correct
			dataCheck = true;
		},
		error: function (data) {
			//Check FetchGithubRepo for the meaning of the error code.
			switch (data.status) {
				case 422:
					toast("error", data.responseJSON.message + "\nDid not create/update course", 7);
					break;
				case 503:
					toast("error", data.responseJSON.message + "\nDid not create/update course", 7);
					break;
				default:
					toast("error", "Something went wrong...", 7);
			}
			dataCheck = false;
		}
	});
	return dataCheck;
}`

### Microservices Used
*Includes and microservices used*

gitcommitService.php
action- updateGithubRepo

-----------------------------------------------------------------------------------------------------------------------------------
# Name of file/service

sectioned.js
Function refreshGithubRepo

## Description
*Description of what the service do and its function in the system.*

 It sends a POST request to gitcommitService.php with the course ID and user to retrieve the latest Git data. 
 Returns true on success, false on failure.

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |

| :courseid | :string | :ID of the course whose GitHub data is refreshed |
| :user | :string | :The current user triggering refresh |

## Calling Methods
- POST

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |

| :data | :string | :"No repo" triggers popup |
| :status | :int | :Used for error handling |
| :success | :bool | :Returns true or false via dataCheck |

## Examples of Use
`function refreshGithubRepo(courseid, user) {
  //Used to return success(true) or error(false) to the calling function
  var dataCheck;
  $.ajax({
    async: false,
    url: "../DuggaSys/gitcommitService.php",
    type: "POST",
    data: { 'cid': courseid, 'user': user, 'action': 'refreshGithubRepo' },
    success: function (data) {
      if (data == "No repo") {
        $("#githubPopupWindow").css("display", "flex");
      }
      else {
        toast("",data,7);
      }
      dataCheck = true;
    },
    error: function (data) {
      //Check gitfetchService for the meaning of the error code.
      switch (data.status) {
        case 403:
        case 422:
          toast("error",data.responseJSON.message + "\nDid not update course",7);
          break;
        case 503:
          toast("error",data.responseJSON.message + "\nDid not update course",7);
          break;
        default:
          toast("error","Something went wrong...",7);
      }
      dataCheck = false;
    }
  });
  return dataCheck;
}`

### Microservices Used
*Includes and microservices used*

gitcommitService.php
action- refreshGithubRepo

-------------------------------------------------------------------------------

# Name of file/service

sectioned.js
Function updateGithubRepo

## Description
*Description of what the service do and its function in the system.*

Sends an updated GitHub repository URL and course ID to database in order to save it. returns true if successful or false if an error occurs. 

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |

| :githubURL | :string | :GitHub repository URL |
| :cid | :string | :Course ID of the repository |
| :githubKey | :string | :GitHub token used for authentication |

## Calling Methods
- POST

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |

| :status code | :int | :Used for error handling |
| :message | :string | :Error message shown |
| :success | :bool | :True= successful, False= otherwise |

## Examples of Use
`function updateGithubRepo(githubURL, cid, githubKey) {
  //Used to return success(true) or error(false) to the calling function
  regexURL = githubURL.replace(/.git$/, "");
  var dataCheck;
  console.log("updateGithubRepo");
  $.ajax({
    async: false,
    url: "../DuggaSys/gitcommitService.php",
    type: "POST",
    data: { 'githubURL': regexURL, 'cid': cid,'token': githubKey , 'action': 'directInsert'},
    success: function () {
      //Returns true if the data and JSON is correct
      dataCheck = true;
    },
    error: function (data) {
      //Check FetchGithubRepo for the meaning of the error code.
      switch (data.status) {
        case 403:
        case 422:
        case 503:
          toast("error",data.responseJSON.message + "\nFailed to update github repo",7);
          break;
        default:
          toast("error","Something went wrong...",7);
      }
      dataCheck = false;
    }
  });
  return dataCheck;
}`

### Microservices Used
*Includes and microservices used*

gitcommitService.php
action- directInsert

---------------------------------------------------------------------------------------------

# Name of file/service

sectioned.js
Function: fetchGitHubRepo

## Description
*Description of what the service do and its function in the system.*

Fetch contents of the GitHub repo by using action getNewCourseGitHub, returns true if request successful, false if otherwise. Used to fetch the content of a GitHub repo and validate it before attaching it to a course.

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |

| :githubURL | :string | :GitHub repository URL to be validated |

## Calling Methods
- POST

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |

| :status code | :int | :HTTP response status, error handling |
| :message | :string | :Error message |
| :success | :bool | :true if GitHub repo is valid, false if error occurs |

## Examples of Use
`function fetchGitHubRepo(gitHubURL) {
  //Remove .git, if it exists
  regexURL = gitHubURL.replace(/.git$/, "");
  //Used to return success(true) or error(false) to the calling function
  var dataCheck;
  $.ajax({
    async: false,
    url: "gitfetchService.php",
    type: "POST",
    data: { 'githubURL': regexURL, 'action': 'getNewCourseGitHub' },
    success: function () {
      //Returns true if the data and JSON is correct
      dataCheck = true;
    },
    error: function (data) {
      //Check FetchGithubRepo for the meaning of the error code.
      switch (data.status) {
        case 422:
        case 503:
          toast("error",data.responseJSON.message + "\nDid not update course, double check github link?",7);
          break;
        default:
          toast("error","Something went wrong...",7);
      }
      dataCheck = false;
    }
  });
  return dataCheck;
}`

### Microservices Used
*Includes and microservices used*

gitfetchService.php
action- getNewCourseGitHub

-----------------------------------------------------------------------------------------------
# Name of file/service

sectioned.js
Function: updateSelectDir

## Description
*Description of what the service do and its function in the system.*

The function updates the selected directory for a course. 

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |

| :selectedDir | :string | :The directory selected by the user |
| :cid | :string | :The course ID provided from server |

## Calling Methods
- POST

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |

| :status | :string | :success if update went well, else, error message |
| :message | :string | :optional error message |


## Examples of Use
`function updateSelectedDir() {
  var selectedDir = $('#selectDir').val();
  $.ajax({
    url: "./sectioned.php",
    type: "POST",
    data: {
      action: "updateSelectedDir",
      selectedDir: selectedDir,
      cid: cidFromServer
    },
    success: function (data) {
      console.log('POST-request call successful');
      console.log("Response: ", data);
      toast("success",'Directory has been updated succesfully',5)

      // Parse the JSON response
      var response;
      try {
        response = JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        return;
      }

      // Handle the response
      //TODO:: Server is sending html response instead of JSON
      if (response.status === "success") {
        console.log('Update successful');
      } else {
        console.error('Update failed:', response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error('Update failed:', error);
      console.log("Status: ", status);
      console.log("Error: ", error);
      toast("error",'Directory update failed',7)
    }
  });
}`

### Microservices Used
*Includes and microservices used*

sectioned.php
action- updateSelectedDir

---------------------------------------------------------------------------------------------
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