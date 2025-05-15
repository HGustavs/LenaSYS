In this file the connection between javascript and PHP is docummented.

# Name of file/service
accessed.js
Function addUserToCourse()

## Description
This function adds a user to a course. It performs two main operations, retrieves the user’s UID by querying accessedservice.php using their username and assigns the user to a course version and term using the AJAXService.

## Input Parameters
- Parameter: opt
   - Type: String
   - Description: 

- Parameter: action
   - Type: string
   - Description: 

- Parameter: username
   - Type: string
   - Description: 

- Parameter: uid
   - Type: string
   - Description: 

- Parameter: courseid
   - Type: string
   - Description:
  
- Parameter: coursevers
   - Type: string
   - Description:

## Calling Methods
- POST

## Output Data and Format
*Output Data will be described in lists. "Type" is either String or int, but add the specific type in "Description". The specific types can be found in the tables in the database (http://localhost/phpmyadmin/). Switch out varchar/tinyint in the example below, with the correct type.*

- Output: user
   - Type: JSON-array
   - Description: 

- Output: success/error
   - Type: String
   - Description: Describe the output. Stored as *varchar(30)* in the database

- Output: courses/groups/teachers/classes/submissions
   - Type: JSON-object
   - Description: Describe the output. Stored as *varchar(30)* in the database

## Examples of Use
``` 
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
```

### Microservices Used
- AJAXService()
- Accessedservice.php

---
# Name of file/service
accessed.js
Function removeUserFromCourse.

## Description
This function removes a user from a course. It retrieves the user's UID based on their username using accessedservice.php, then sends a DELETE request using AJAXService to remove the user from the course.

## Input Parameters
- Parameter: opt
   - Type: String
   - Description: Describe parameter. Stored as *varchar(256)* in the database

- Parameter: action
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database

- Parameter: username
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database

- Parameter: courseid
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database

- Parameter: uid
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database

## Calling Methods
- POST

## Output Data and Format
- Output: user
   - Type: JSON-array
   - Description: Describe the output. Stored as *tinyint(2)* in the database

- Output: success/error
   - Type: String
   - Description: Describe the output. Stored as *varchar(30)* in the database

## Examples of Use
``` 
function removeUserFromCourse() {
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
``` 

### Microservices Used
- accessedservice.php
- AJAXService()

---
# Name of file/service
accessed.js
Function: loadUsersToDropdown

## Description
This function retrieves all users from the backend and populates a dropdown field with usernames. It is used when showing user-related popup modals such as “Add User” or “Remove User”.

## Input Parameters
- Parameter: opt
   - Type: String
   - Description: Describe parameter. Stored as *varchar(256)* in the database

- Parameter: action
   - Type: String
   - Description: Describe parameter. Stored as *int(11)* in the database

## Calling Methods
- POST

## Output Data and Format
- Output: users
   - Type: JSON-arrayS
   - Description: Describe the output. Stored as *tinyint(2)* in the database

## Examples of Use
``` 
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
``` 

### Microservices Used
- accessedservice.php

---
# Name of file/service
courseed.js
Function updateCourse()

## Description
Updates course information in the system, such as course name, visibility, code, and GitHub URL. If a GitHub URL is provided, it attempts to validate it and save the updated state.

## Input Parameters
- Parameter: cid
   - Type: String
   - Description: Describe parameter. Stored as *varchar(256)* in the database

- Parameter: coursename
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database

- Parameter: coursecode
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database

- Parameter: courseGitURL
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database

- Parameter: visib
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database

- Parameter: token
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database   

## Calling Methods
- POST

## Output Data and Format
- 

## Examples of Use
``` 
function updateCourse() {
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
}
``` 

### Microservices Used
- gitcommitService.php

---
# Name of file/service
courseed.js
Function FetchGitHubRepo()

## Description
Used to fetch and validate data from GitHub repository. If successful it return true, otherwise false.

## Input Parameters
- Parameter: gitHubURL
   - Type: String
   - Description: Describe parameter. Stored as *varchar(256)* in the database

## Calling Methods
- POST

## Output Data and Format
- Output: boolean
   - Type: true/false
   - Description: Describe the output. Stored as *tinyint(2)* in the database

## Examples of Use
``` 
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
}
``` 

### Microservices Used
- gitfetchService.php

---
# Name of file/service
courseed.js
Function fetchLatestCommit()

## Description
This function sends a GitHub repository URL of the latest commit from the GitHub repository.
The latest commit is then stored in the database.

## Input Parameters
- Parameter: gitHubURL
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database

## Calling Methods
- POST

## Output Data and Format
- Output: boolean
   - Type: true/false
   - Description: Describe the output. Stored as *varchar(30)* in the database

## Examples of Use
``` 
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
}
``` 

### Microservices Used
- gitcommitService.php

---
# Name of file/service
courseed.js
Function updateGithubRepo()

## Description
This function is used to update the GitHub repository and its associated course ID. 
It sends a POST request to gitcommitService.php fetches and stores the latest commit in the database. 
Returns true on success or false on failure. 

## Input Parameters
- Parameter: gitHubURL
   - Type: String
   - Description: Describe parameter. Stored as *varchar(256)* in the database

- Parameter: cid
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database

- Parameter: action
   - Type: String
   - Description: Describe parameter. Stored as *int(11)* in the database

## Calling Methods
- POST

## Output Data and Format
- Output: status
   - Type: int
   - Description: Describe the output. Stored as *tinyint(2)* in the database

- Output: message
   - Type: String
   - Description: Describe the output. Stored as *varchar(30)* in the database

- Output: success
   - Type: bool
   - Description: Describe the output. Stored as *varchar(30)* in the database

## Examples of Use
``` 
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
}
``` 

### Microservices Used
- gitcommitService.php

---
Example of template for the documentation:

# Name of file/service
sectioned.js
Function refreshGithubRepo

## Description
It sends a POST request to gitcommitService.php with the course ID and user to retrieve the latest Git data. Returns true on success, false on failure.

## Input Parameters
- Parameter: courseid
   - Type: String
   - Description: Describe parameter. Stored as *varchar(256)* in the database

- Parameter: user
   - Type: String
   - Description: Describe parameter. Stored as *int(11)* in the database

## Calling Methods
- POST

## Output Data and Format
- Output: data
   - Type: string
   - Description: Describe the output. Stored as *tinyint(2)* in the database

- Output: status
   - Type: int
   - Description: Describe the output. Stored as *varchar(30)* in the database
  
- Output: success
   - Type: bool
   - Description: Describe the output. Stored as *varchar(30)* in the database

## Examples of Use
``` 
function refreshGithubRepo(courseid, user) {
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
}
``` 

### Microservices Used
- gitcommitService.php

---
# Name of file/service
sectioned.js
Function updateGithubRepo()

## Description
Sends an updated GitHub repository URL and course ID to database in order to save it. returns true if successful or false if an error occurs.

## Input Parameters
- Parameter: githubURL
   - Type: String
   - Description: Describe parameter. Stored as *varchar(256)* in the database

- Parameter: cid
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database

- Parameter: githubKey
   - Type: String
   - Description: Describe parameter. Stored as *int(11)* in the database

## Calling Methods
- POST

## Output Data and Format
- Output: status code
   - Type: int
   - Description: Describe the output. Stored as *tinyint(2)* in the database

- Output: message
   - Type: String
   - Description: Describe the output. Stored as *varchar(30)* in the database

- Output: success
   - Type: bool
   - Description: Describe the output. Stored as *varchar(30)* in the database

## Examples of Use
``` 
function updateGithubRepo(githubURL, cid, githubKey) {
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
}
``` 

### Microservices Used
- gitcommitService.php

---

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
``` 
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
}
``` 

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
``` 
function updateSelectedDir() {
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
}
``` 

### Microservices Used
*Includes and microservices used*

sectioned.php

action- updateSelectedDir

---------------------------------------------------------------------------------------------
# Name of file/service

sectioned.js

Function: retrieveCourseProfile

## Description
*Description of what the service do and its function in the system.*

This function retrives available course versions based on a selected course ID, it sends POST request to fetch course version and dropdown with reults. 

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |

| :userid | :string | :ID of the user making request |

## Calling Methods

- POST

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |

| :versids | :array | :List of course version IDs to populate drapdown |

| :error | :string | :Error message if AJAX fails |

## Examples of Use
``` 
function retrieveCourseProfile(userid) {
  $(".selectLabels label input").attr("disabled", true);
  var cid = '';
  $("#cid").change(function () {
    cid = $("#cid").val();
    if (($("#cid").val()) != '') {
      $("#versid").prop("disabled", false);
      $.ajax({
        url: "../Shared/retrievevers.php",
        data: { cid: cid },
        type: "POST",
        success: function (data) {
          var item = JSON.parse(data);
          $("#versid").find('*').not(':first').remove();
          $.each(item.versids, function (index, item) {
            $("#versid").append("<option value=" + item.versid + ">" + item.versid + "</option>");
          });

        },
        error: function () {
          console.log("*******Error*******");
        }
      });

    } else {
      $("#versid").prop("disabled", true);
    }

  });
  if (($("#versid option").length) <= 2) {
    $("#versid").click(function () {
      getStudents(cid, userid);
    });
  } else if (($("#versid option").length) > 2) {
    $("#versid").change(function () {
      getStudents(cid, userid);
    });
  }
}
``` 

### Microservices Used
*Includes and microservices used*

retrievevers.php

Returns a list of course version IDs based on the provided cid

-----------------------------------------------------------------------------------------------------
# Name of file/service

sectioned.js

Function: retreieveCourseProfile

## Description
*Description of what the service do and its function in the system.*

Fetches all course versions for a given course ID (cid)

Returns a JSON object with versids, which are appended to a dropdown

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |

| :userid | :string | :User ID used when fetching students |

## Calling Methods

- POST

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |

| :versids | :array | :Array of course version objects with a versid field |

| :error | :string | :Message if AJAX call fails |

## Examples of Use
``` 
function retrieveCourseProfile(userid) {
  $(".selectLabels label input").attr("disabled", true);
  var cid = '';
  $("#cid").change(function () {
    cid = $("#cid").val();
    if (($("#cid").val()) != '') {
      $("#versid").prop("disabled", false);
      $.ajax({
        url: "../Shared/retrievevers.php",
        data: { cid: cid },
        type: "POST",
        success: function (data) {
          var item = JSON.parse(data);
          $("#versid").find('*').not(':first').remove();
          $.each(item.versids, function (index, item) {
            $("#versid").append("<option value=" + item.versid + ">" + item.versid + "</option>");
          });

        },
        error: function () {
          console.log("*******Error*******");
        }
      });

    } else {
      $("#versid").prop("disabled", true);
    }

  });
  if (($("#versid option").length) <= 2) {
    $("#versid").click(function () {
      getStudents(cid, userid);
    });
  } else if (($("#versid option").length) > 2) {
    $("#versid").change(function () {
      getStudents(cid, userid);
    });
  }
}
``` 

### Microservices Used
*Includes and microservices used*

retrievevers.php

----------------------------------------------------------------------------------------------
# Name of file/service

sectioned.js

Function getStudents

## Description
*Description of what the service do and its function in the system.*

This function retrieves student 

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |

| :cid | :string | :Course ID used to identify the current course |

| :userid | :string | :User ID of the currently logged-in user |

## Calling Methods

- POST

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |

| :finished_students | :array | :List of studens who have completed the course |

| :non_finished_students | :array | :List of students who have not yet completed the course |

| :Error | :string | :If request fails, error is logged to the console |

## Examples of Use
``` 
function getStudents(cid, userid) {
  var versid = '';
  versid = $("#versid").val();
  if (($("#versid").val()) != '') {
    $("#recipient").prop("disabled", false);
    $.ajax({
      url: "../Shared/retrieveuser_course.php",
      data: { cid: cid, versid: versid, remove_student: userid },
      type: "POST",
      success: function (data) {
        var item = JSON.parse(data);
        $("#recipient").find('*').not(':first').remove();
        $("#recipient").append("<optgroup id='finishedStudents' label='Finished students'>" +
          "</optgroup>");
        $.each(item.finished_students, function (index, item) {
          $("#finishedStudents").append(`<option value=${item.uid}>${item.firstname}
          ${item.lastname}</option>`);
        });
        $("#recipient").append("<optgroup id='nonfinishedStudents' label='Non-finished students'>" +
          "</optgroup>");
        $.each(item.non_finished_students, function (index, item) {
          $("#nonfinishedStudents").append(`<option value=${item.uid}>${item.firstname}
          ${item.lastname}</option>`);
        });
        $(".selectLabels label input").attr("disabled", false);
        selectRecipients();
      },
      error: function () {
        console.log("*******Error user_course*******");
      }
    });
  } else {
    $("#recipient").prop("disabled", true);
  }
}
``` 

### Microservices Used
*Includes and microservices used*

retrieveuser_course.php

----------------------------------------------------------------------------------------------
# Name of file/service

sectioned.js

Function: retrieveAnnouncementsCards

## Description
*Description of what the service do and its function in the system.*

This function retrives and displays announcements relevant to a user for a given course and version.

## Input Parameters
*Parameters will be described in tables for easier readability*

| Parameter | Type | Description |

| :uname | :string | :The username retreived from the HTML element |

| :cid | :string | :Course ID from the URL |

| :versid | :string | :Course version from the URL |

## Calling Methods

- GET

## Output Data and Format
*Output Data will be described in tables for easier readability*

| Output | Type | Description |

| :retrivedAnnouncementCard | :HTML | :HTML for announcement cads |

| :nRows | :number | :Number of unread announcements |

| :uid | :string | :User ID retrieved from first request |

## Examples of Use
``` 
function retrieveAnnouncementsCards() {
  var currentLocation = $(location).attr('href');
  var url = new URL(currentLocation);
  var cid = url.searchParams.get("courseid");
  var versid = url.searchParams.get("coursevers");
  var uname = $("#userName").html();
  $.ajax({
    url: "../Shared/retrieveUserid.php",
    data: { uname: uname },
    type: "GET",
    success: function (data) {
      var parsed_data = JSON.parse(data);
      var uid = parsed_data.uid;
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var parsed_data = JSON.parse(this.response);
          document.getElementById("announcementCards").innerHTML =
            parsed_data.retrievedAnnouncementCard;
          var unread_announcements = parsed_data.nRows;
          if (unread_announcements > 0) {
            $("#announcement img").after("<span id='announcementnotificationcount'>0</span>");
            $("#announcementnotificationcount").html(parsed_data.nRows);
          }
          accessAdminAction();
          var paragraph = "announcementMsgParagraph";
          readLessOrMore(paragraph);
          showLessOrMoreAnnouncements();
          scrollToTheAnnnouncementForm();
          $(".deleteBtn").click(function () {
            sessionStorage.setItem('closeUpdateForm', true);

          });

        }
      };
      xmlhttp.open("GET", "../Shared/retrieveAnnouncements.php?cid=" + cid +
        "&versid=" + versid + "&recipient=" + uid, true);
      xmlhttp.send();
    }
  });
}
``` 

### Microservices Used
*Includes and microservices used*

retrieveUserid.php

Used to get the user ID based on a username.

retrieveAnnouncements.php

Fetches announcements for a given user in a specific course version.

--------------------------------------------------------------------------------------------------------------------------

# Name of file/service  

 accessed.js 

 Function addUserToCourse. 

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
``` 
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
``` 

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
``` 
function removeUserFromCourse() { 
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
``` 

### Microservices Used 

*Includes and microservices used* 

accessedservice.php 

opt- RETRIEVE, action- USER 

opt- DELETE, action- COURSE 

--------------------------------------------------------------------------------------------------------------------------- 

# Name of file/service 

accessed.js 

Function loadUsersToDropdown

## Description 
*Description of what the service do and its function in the system.* 

This function populates a dropdown list with users fetched from the database. 
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
``` 
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
``` 

### Microservices Used 
*Includes and microservices used* 

accessedservice.php 

opt- RETRIEVE, action- USERS 

--------------------------------------------------------------------------------------------------------- 

# Name of file/service 

courseed.js 

Function updateCourse

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
``` 
function updateCourse() { 
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
}
``` 

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
``` 
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
}
``` 
### Microservices Used 

*Includes and microservices used* 

gitfetchService.php

Uses: action- getNewCourseGitHub 

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
```
function updateSelectedDir() { 
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
}
``` 

### Microservices Used 
*Includes and microservices used* 

sectioned.php 

action- updateSelectedDir 

--------------------------------------------------------------------------------------------- 

# Name of file/service 

sectioned.js 

Function: retrieveCourseProfile 

## Description 

*Description of what the service do and its function in the system.* 

This function retrives available course versions based on a selected course ID, it sends POST request to fetch course version and dropdown with reults.  

## Input Parameters 

*Parameters will be described in tables for easier readability* 

| Parameter | Type | Description | 

| :userid | :string | :ID of the user making request | 

## Calling Methods 

- POST 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

| Output | Type | Description | 

| :versids | :array | :List of course version IDs to populate drapdown | 

| :error | :string | :Error message if AJAX fails | 

## Examples of Use 
```
function retrieveCourseProfile(userid) { 

  $(".selectLabels label input").attr("disabled", true); 

  var cid = ''; 

  $("#cid").change(function () { 
    cid = $("#cid").val(); 
    if (($("#cid").val()) != '') { 
      $("#versid").prop("disabled", false); 
      $.ajax({ 
        url: "../Shared/retrievevers.php", 
        data: { cid: cid }, 
        type: "POST", 
        success: function (data) { 
          var item = JSON.parse(data); 
          $("#versid").find('*').not(':first').remove(); 
          $.each(item.versids, function (index, item) { 
            $("#versid").append("<option value=" + item.versid + ">" + item.versid + "</option>"); 
          }); 
        }, 
        error: function () { 
          console.log("*******Error*******"); 
        } 
      }); 
    } else { 
      $("#versid").prop("disabled", true); 
    } 
  }); 

  if (($("#versid option").length) <= 2) { 
    $("#versid").click(function () { 
      getStudents(cid, userid); 
    }); 
  } else if (($("#versid option").length) > 2) { 
    $("#versid").change(function () { 
      getStudents(cid, userid); 
    }); 
  } 
}
```

### Microservices Used 

*Includes and microservices used* 

retrievevers.php 

Returns a list of course version IDs based on the provided cid 

---------------------------------------------------------------------------------------------- 

# Name of file/service 

sectioned.js 

Function getStudents 

## Description 

*Description of what the service do and its function in the system.* 

This function retrieves student  
 
## Input Parameters 

*Parameters will be described in tables for easier readability* 

| Parameter | Type | Description | 

| :cid | :string | :Course ID used to identify the current course | 

| :userid | :string | :User ID of the currently logged-in user | 

## Calling Methods 

- POST 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

| Output | Type | Description |  

| :finished_students | :array | :List of studens who have completed the course | 

| :non_finished_students | :array | :List of students who have not yet completed the course | 

| :Error | :string | :If request fails, error is logged to the console | 

## Examples of Use 
```
function getStudents(cid, userid) { 
  var versid = ''; 
  versid = $("#versid").val(); 
  if (($("#versid").val()) != '') { 
    $("#recipient").prop("disabled", false); 
    $.ajax({ 
      url: "../Shared/retrieveuser_course.php", 
      data: { cid: cid, versid: versid, remove_student: userid }, 
      type: "POST", 
      success: function (data) { 
        var item = JSON.parse(data); 
        $("#recipient").find('*').not(':first').remove(); 
        $("#recipient").append("<optgroup id='finishedStudents' label='Finished students'>" + 
          "</optgroup>"); 
        $.each(item.finished_students, function (index, item) { 
          $("#finishedStudents").append(`<option value=${item.uid}>${item.firstname} 
          ${item.lastname}</option>`); 
        }); 
        $("#recipient").append("<optgroup id='nonfinishedStudents' label='Non-finished students'>" + 
          "</optgroup>"); 
        $.each(item.non_finished_students, function (index, item) { 
          $("#nonfinishedStudents").append(`<option value=${item.uid}>${item.firstname} 
          ${item.lastname}</option>`); 
        }); 
        $(".selectLabels label input").attr("disabled", false); 
        selectRecipients(); 
      }
      error: function () { 
        console.log("*******Error user_course*******"); 
      } 
    }); 
  } else { 
    $("#recipient").prop("disabled", true); 
  } 
}
``` 

### Microservices Used 

*Includes and microservices used* 

retrieveuser_course.php 

---------------------------------------------------------------------------------------------- 

# Name of file/service 

sectioned.js 

Function: retrieveAnnouncementsCards 

## Description 

*Description of what the service do and its function in the system.* 

This function retrives and displays announcements relevant to a user for a given course and version. 

## Input Parameters 

*Parameters will be described in tables for easier readability* 

| Parameter | Type | Description | 

| :uname | :string | :The username retreived from the HTML element | 

| :cid | :string | :Course ID from the URL | 

| :versid | :string | :Course version from the URL | 

## Calling Methods 

- GET 

## Output Data and Format 

*Output Data will be described in tables for easier readability*  

| Output | Type | Description | 

| :retrivedAnnouncementCard | :HTML | :HTML for announcement cads | 

| :nRows | :number | :Number of unread announcements | 

| :uid | :string | :User ID retrieved from first request | 

## Examples of Use 
```
function retrieveAnnouncementsCards() { 
  var currentLocation = $(location).attr('href'); 
  var url = new URL(currentLocation); 
  var cid = url.searchParams.get("courseid"); 
  var versid = url.searchParams.get("coursevers"); 
  var uname = $("#userName").html(); 
  $.ajax({ 
    url: "../Shared/retrieveUserid.php", 
    data: { uname: uname }, 
    type: "GET", 
    success: function (data) { 
      var parsed_data = JSON.parse(data); 
      var uid = parsed_data.uid; 
      var xmlhttp = new XMLHttpRequest(); 
      xmlhttp.onreadystatechange = function () { 
        if (this.readyState == 4 && this.status == 200) { 
          var parsed_data = JSON.parse(this.response); 
          document.getElementById("announcementCards").innerHTML = 
            parsed_data.retrievedAnnouncementCard; 
          var unread_announcements = parsed_data.nRows; 
          if (unread_announcements > 0) { 
            $("#announcement img").after("<span id='announcementnotificationcount'>0</span>"); 
            $("#announcementnotificationcount").html(parsed_data.nRows); 
          } 
          accessAdminAction(); 
          var paragraph = "announcementMsgParagraph"; 
          readLessOrMore(paragraph); 
          showLessOrMoreAnnouncements(); 
          scrollToTheAnnnouncementForm(); 
          $(".deleteBtn").click(function () { 
            sessionStorage.setItem('closeUpdateForm', true); 
          }); 
        } 
      }; 
      xmlhttp.open("GET", "../Shared/retrieveAnnouncements.php?cid=" + cid + 
        "&versid=" + versid + "&recipient=" + uid, true); 
      xmlhttp.send(); 
    } 
  }); 
}
```

### Microservices Used 

*Includes and microservices used* 

retrieveUserid.php 

Used to get the user ID based on a username. 

retrieveAnnouncements.php 

Fetches announcements for a given user in a specific course version. 

-------------------------------------------------------------------------------------- 

# Name of file/service 

Sectioned.js 

Function: updateReadStatus 

## Description 

*Description of what the service do and its function in the system.* 

This function updates the read status of an announcement for a user. It fetches the user's ID based on username. 

## Input Parameters 

*Parameters will be described in tables for easier readability* 

| Parameter | Type | Description | 

| :announcementid | :string | :ID of announcement to be marked read | 

| :cid | :string | :Course ID | 

| :versid | :string | :Course verion ID | 
 

## Calling Methods 

- GET (retrieveUserid.php) 

- POST (updateviewedAnnouncementCards.php) 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

| Output | Type | Description | 

| :uid | :int | :Retrieved from GET request based on username | 

## Examples of Use 
```
function updateReadStatus(announcementid, cid, versid) { 

  var uname = $("#userName").html(); 

  $.ajax({ 

    url: "../Shared/retrieveUserid.php", 

    data: { uname: uname }, 

    type: "GET", 

    success: function (data) { 

      var parsed_data = JSON.parse(data); 

      var uid = parsed_data.uid; 

      $.ajax({ 

        url: "../Shared/updateviewedAnnouncementCards.php", 

        data: { announcementid: announcementid, uid: uid, cid: cid, versid: versid }, 

        type: "POST", 

        success: function (data) { 

        } 

      }); 

    } 

  }); 

}
```
 
### Microservices Used 

*Includes and microservices used* 

retrieveUserid.php

Retrieves the users ID based on their username (GET). 

updateviewedAnnouncementCards.php 

Updates the database to mark the announcement as viewed by the user (POST).  

-------------------------------------------------------------------------------------- 

# Name of file/service 

Sectioned.js 

Function: toggleFeedbacks 

## Description 

*Description of what the service do and its function in the system.* 

The function retrieves and displays recent feedback for the logged-in student. 

## Input Parameters 

*Parameters will be described in tables for easier readability* 

| Parameter | Type | Description | 

| :uname | :string | :Retrieved from inner HTML | 

| :studentid | :int | :Fetched GET request using uname | 

## Calling Methods 
 
- GET (../Shared/retrieveUserid.php)  

- POST (../Shared/retrieveFeedbacks.php) 

 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

 

| Output | Type | Description | 

| :duggaFeedback | :HTML | :Content of feedback | 

| :unreadFeedbackNotification | :int | :Number of unseen feedback notifications | 

 

## Examples of Use 

```
function toggleFeedbacks() { 

  let uname = $("#userName").html(); 

  let studentid, parsed_data, parsed_uid, duggaFeedback, feedbackComment, unseen_feedbacks; 

  $.ajax({ 

    url: "../Shared/retrieveUserid.php", 

    data: { uname: uname }, 

    type: "GET", 

    success: function (data) { 

      parsed_uid = JSON.parse(data); 

      studentid = parsed_uid.uid; 

      $.ajax({ 

        url: "../Shared/retrieveFeedbacks.php", 

        data: { studentid: studentid }, 

        type: "POST", 

        async: true, 

        dataType: 'json', 

        contentType: 'application/x-www-form-urlencoded; charset=UTF-8', 

        success: function (data) { 

          duggaFeedback = data.duggaFeedback; 

          $(".feedbackContent").html(duggaFeedback); 

          if ($(".recentFeedbacks").length == 0) { 

            $(".feedbackContent").append("<p class='noFeedbacks'><span>There are no recent feedback to view.</span>" + 

              "<span class='viewOldFeedbacks' onclick='viewOldFeedbacks();'>View old feedback</span></p>"); 

            $(".feedbackHeader").append("<span onclick='viewOldFeedbacks(); hideIconButton();' id='iconButton'>" + 

              "<img src='../Shared/icons/oldFeedback.svg' title='Old feedbacks'></span>"); 

          } 

          $(".oldFeedbacks").hide(); 

          feedbackComment = 'feedbackComment'; 

          readLessOrMore(feedbackComment); 

          unseen_feedbacks = data.unreadFeedbackNotification; 

          if (unseen_feedbacks > 0) { 

            $("#feedback img").after("<span id='feedbacknotificationcounter'>0</span>"); 

            $("#feedbacknotificationcounter").html(unseen_feedbacks); 

 

          } 

        }, 

        error: function () { 

          console.log("Couldn't return feedback data"); 

        } 

 

      }); 

 

    } 

 

  }); 

 

  if ($("#feedback").length > 0) { 

    $("header").after("<div id='feedbackOverlay'><div class='feedbackContainer'>" + 

      "<div class='feedbackHeader'><span><h2>Recent Feedback</h2></span></div>" + 

      "<div class='feedbackContent'></div></div></div>"); 

 

  } 

 

  $("#feedback").click(function () { 

    $("#feedbackOverlay").toggle(); 

    if ($("#feedbacknotificationcounter").length > 0) { 

      var viewed = "YES"; 

      $.ajax({ 

        url: "../Shared/retrieveFeedbacks.php", 

        data: { studentid: studentid, viewed: viewed }, 

        type: "POST", 

        success: function () { 

          $("#feedbacknotificationcounter").remove(); 

        } 

      }); 

    } 

  }); 

}  
```

 

### Microservices Used 

*Includes and microservices used* 

 

retrieveUserid.php 

Retrieves user ID using the provided username. 

retrieveFeedbacks.php 

Returns recent feedbacks for a student (duggaFeedback) and count of unseen items. 

 

-------------------------------------------------------------------------------------- 

# Name of file/service 

Sectioned.js 

Function: createExamples 

## Description 

*Description of what the service do and its function in the system.* 

This function fetches code examples for a specific lecture identified by momentID. 

## Input Parameters 

*Parameters will be described in tables for easier readability* 

| Parameter | Type | Description | 

| :momentID | :int | :The ID of the lecture to fetch code examples for | 

| :isManual | :boolean | :Optional flag if the call is manual | 

## Calling Methods 

- POST 

 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

 

| Output | Type | Description | 

 

| :response | :JSON | :JSON object containing code examples | 

Resolves the AJAX result as a JSON object. 

 

## Examples of Use 
``` 
function createExamples(momentID, isManual) { 

  lid = momentID; 

 

  //wrapped ajax in promise in order to return promise to the function that called it. see setInterval 

  return new Promise((resolve, reject) => { 

    $.ajax({ 

      url: "sectionedservice.php", 

      type: "POST", 

      data: { 'lid': lid, 'opt': 'CREGITEX' }, 

      dataType: "json", 

      success: function (response) { 

        console.log("AJAX request succeeded. Response:", response); 

        lastUpdatedCodeExampes = Date.now(); 

        if (isManual) { 

          console.log("Code examples have been manually updated successfully!"); 

        } 

        resolve(response); 

      }, 

      error: function (xhr, status, error) { 

        console.error("AJAX request failed. Status:", status); 

        console.error("Error:", error); 

        console.log("Failed to manually update code examples!"); 

      } 

    }); 

  }); 

}  
```

### Microservices Used 

*Includes and microservices used* 

sectionedservice.php 

This service is called to retrieve code examples associated with a lecture. 

 

-------------------------------------------------------------------------------------- 

# Name of file/service 

Sectioned.js 

Function: storeCodeExamples 

## Description 

*Description of what the service do and its function in the system.* 


This function is responsible for storing code examples from GitHub repository into both a directory and database, then sends the data as a JSON object to PHP service (sectionedservice.php) 
 

## Input Parameters 

*Parameters will be described in tables for easier readability* 

| Parameter | Type | Description | 

| :cid | :string | :Course ID used to map examples with specific course | 

| :codeExamplesContent | :array | :Array of content from GitHub API | 

| :githubURL | :string | :GitHub repository URL for reference | 

| :fileName | :string | :Name that code examples should be stored under | 
 

## Calling Methods 

- POST 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

| Output | Type | Description | 

|:response | :string | :Response string from backend (logged in console) | 

## Examples of Use 

```
function storeCodeExamples(cid, codeExamplesContent, githubURL, fileName){ 

    var templateNo = updateTemplate(); 

    var decodedContent=[], shaKeys=[], fileNames=[], fileURL=[], downloadURL=[], filePath=[], fileType=[], fileSize=[]; 

    //Push all file data into separate arrays and add them into one single array. 

    codeExamplesContent.map(function(item) { 

       decodedContent.push(atob(item.content.content)); 

       shaKeys.push(item.content.sha); 

       fileNames.push(item.filename); 

       fileURL.push(item.content.url); 

       downloadURL.push(item.content.download_url); 

       filePath.push(item.content.path); 

       fileType.push(item.content.type); 

       fileSize.push(item.content.size); 

    });
 
    var AllJsonData = { 

      codeExamplesContent: decodedContent, 

      SHA: shaKeys, 

      fileNames: fileNames, 

      filePaths: filePath, 

      fileURLS: fileURL, 

      downloadURLS: downloadURL, 

      fileTypes: fileType, 

      codeExamplesLinkParam: CeHiddenParameters, 

      templateid: templateNo, 

      fileSizes: fileSize 

    } 

    //Send data to sectioned.php through POST 

    $.ajax({ 

       url: 'sectionedservice.php', 

       type: 'POST', 

       data: { 

        courseid: cid, 

        githubURL: githubURL, 

        codeExampleName: fileName, 

        opt: 'GITCODEEXAMPLE', 

        codeExampleData: AllJsonData 

       }, 

       success: function(response) { 

          console.log(response); 

       }, 

       error: function(xhr, status, error) { 

        console.error('AJAX Error:', status, error); 

      } 

    });    

    confirmBox('closeConfirmBox'); 

    location.replace(location.href); 

}  
```

 

### Microservices Used 

*Includes and microservices used* 
 

sectionedservice.php 

Opt- GITCODEEXAMPLE 

This backend service handles storage of code example data received from GitHub. Data includes content, filenames, paths, SHA keys, download URLs, and file size/type. 

 

-------------------------------------------------------------------------------------- 
-------------------------------------------------------------------------------------- 

# Name of file/service 

Codeviewer.js 

Function: showIframe 

 

## Description 

*Description of what the service do and its function in the system.* 

 

The function loads and displays a preview window for file editing. It replaces the existing preview window on the page with the one fetched from fileed.php, it also sets up the save button to reload the page upon saving and triggers the loading of a previewed file using loadPreview() from fileed.js. 

 

## Input Parameters 

*Parameters will be described in tables for easier readability* 

 

| Parameter | Type | Description | 

 

| :path | :string | :Path to the file that should be loaded in preview | 

| :name | :string | :Filenamne to be displayed or edited | 

| :kind | :string | :Type of content being loaded (text, code, etc.) | 

 

## Calling Methods 

 

- GET (fetch() and $.getScript()) 

 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

 

| Output | Type | Description | 

 

| :previewWidow | :DOM | :The preview from fileed.php injected into the page | 

| :Errors | :warning | :Warning if fileed.php fails to load | 

 

## Examples of Use 

```
function showIframe(path, name, kind) { 


    // Fetch HTML text from fileed.php 

    fetch('fileed.php').then(function (response) { 

        // The API call was successful! 

        return response.text(); 

    }).then(function (html) { 

        // Parse HTML test to DOM 

        var parser = new DOMParser(); 

        var fileedDocument = parser.parseFromString(html, 'text/html'); 

 

        // Replace the preview window from codeviewer.php with the preview window from fileed.php in DOM 

        var previewWindow = document.querySelector(".previewWindow") 

        var fileedPreviewWindow = fileedDocument.querySelector(".previewWindow"); 

        document.querySelector(".previewWindowContainer").replaceChild(fileedPreviewWindow, previewWindow) 

         

        // Display the preview window and append hideIframe() to the close window button  

        previewWindow = document.querySelector(".previewWindow"); 

        previewWindow.classList.add("formBox"); 

        previewWindow.style.display = "block"; 

        document.querySelector(".editFilePart").style.display = "none"; 

 

        // Clicking the save button will reload the example to display the new changes 

        previewWindow.querySelector(".save-button-md").addEventListener("click", function(){ 

            location.reload(); 

        }); 

         

        // Load the right file in to the preview window 

        $.getScript("fileed.js", function(){ 

            loadPreview(path, name, kind); 

        }); 

    }).catch(function (err) { 

        // Display potential errors as a warning 

        console.warn('Something went wrong.', err); 

    }); 

} 
```

 

### Microservices Used 

*Includes and microservices used* 

 

fileed.php 

Serves the file editing interface content to be displayed. 

fileed.js 

Provides loadPreview() used to load the actual file content in the preview window. 

 

 

-------------------------------------------------------------------------------------- 

-------------------------------------------------------------------------------------- 

# Name of file/service 


Diagram_IOHandler.js 

 

## Description 

*Description of what the service do and its function in the system.* 

 

This function sends a diagram from diagram editor to the backend for saving. It uses an AJAX POST request to submit the diagram data along with a generated hash value. 

 

## Input Parameters 

*Parameters will be described in tables for easier readability* 

 

| Parameter | Type | Description | 

 

| :dia | :string | :Diagram data | 

| :Hash | :string | :A unique hash value generated | 

 

## Calling Methods 

 

- POST 

 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

 

| Output | Type | Description | 

 

No return value is handled 

 

## Examples of Use 

```
function saveToServer(dia) 

{ 

    $.ajax({ 

        url: 'diagramservice.php', 

        type: 'POST', 

        data: { StringDiagram: dia, Hash: hashFunction() } 

    }); 

}
```

 

### Microservices Used 

*Includes and microservices used* 

 

diagramservice.php 

Receives diagram data under StringDiagram, stores it on the server. 

 

-------------------------------------------------------------------------------------- 

# Name of file/service 

 

Diagram_IOHandler.js 

Function: Redirect 

 

## Description 

*Description of what the service do and its function in the system.* 

 

This function handles redirection to a newly created project folder. It first sends a POST request to diagram_IOHandler.php with a folder name (GetID) and then redirects the user to diagramservice.php, appending the folder name as a URL parameter. The purpose of the AJAX call may be to initialize or register the folder on the server. 

 

## Input Parameters 

*Parameters will be described in tables for easier readability* 

 

| Parameter | Type | Description | 

 

| :doc | :object | :HTML input element with a value used as folder name | 

| :GetID | :string | :The value from doc sent as a POST parameter | 

 

## Calling Methods 

- POST 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 


| Output | Type | Description | 

 

| :Redirect | :URL | :Navigates to diagramservice.php?id=0&folder={value} | 

 

## Examples of Use 
```
function redirect(doc) 

{ 

    var a = doc.value; 

 

    $.ajax({ 

        type: "POST", 

        url: "diagram_IOHandler.php", 

        data: { 'GetID': a }, 

 

        success: function (data) 

        { // <-- note the parameter here, not in your code 

            return false; 

        } 

    }); 

 

    location.href = "diagramservice.php?id=" + 0 + "&folder=" + a; 

}
```
 

### Microservices Used 

*Includes and microservices used* 

diagram_IOHandler.php 

Receives a folder name via POST as GetID. 

 

diagramservice.php 

The user is redirected here. 

 

-------------------------------------------------------------------------------------- 

# Name of file/service 

 

Fileed.js 

Function: loadFile 

 

## Description 

*Description of what the service do and its function in the system.* 

 

This function is used to load and display a specific file (Markdown, plain text, or other content types) within the preview window. It updates the UI and sends a POST request to showdoc.php to fetch the file contents for preview. 

 

## Input Parameters 

*Parameters will be described in tables for easier readability* 

 

| Parameter | Type | Description | 

 

| :fileUrl | :string | :Path to the file to be loaded | 

| :fileNamez | :string | :The file name to be loaded | 

| :fileKind | :string | :The type or category of the file (md, txt) | 

 

## Calling Methods 

 

- POST 

 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

 

| Output | Type | Description | 

 

| :HTML | :string | :Contents of the file rendered into the preview area | 

| :returnFile | :function | :Callback used to inject response into the UI | 

 

## Examples of Use 
```
function loadFile(fileUrl, fileNamez, fileKind) { 

    filename = fileNamez; 

    filepath = fileUrl; 

    filekind = fileKind; 

     

    $("#fileName").val(fileNamez); 

    $("#fileKind").val(fileKind); 

 

    $(".previewWindow").show(); 

    $(".previewWindowContainer").css("display", "block"); 

    $(".markdownPart").hide(); 

    $(".editFilePart").show(); 

     

    $.ajax({ 

        url: "showdoc.php?courseid=" + querystring['courseid'] + "&coursevers=" + querystring['coursevers'] + "&fname=" + fileNamez + "&read=yes", 

        type: 'post', 

        dataType: 'html', 

        success: returnFile 

    }); 

}
```

 

### Microservices Used 

*Includes and microservices used* 

 

showdoc.php 

Fetches the content of a file. 

 

--------------------------------------------------------------------------------------- 

# Name of file/service 

 

Fileed.js 

Function: load Preview 

 

## Description 

*Description of what the service do and its function in the system.* 

 

The function is responsible for previewing a file's content in a read-only format. It sets up the preview UI for the selected file, displays the preview window, and makes a POST request to showdoc.php to retrieve the file's content. This function is intended for viewing only, not editing. 

 

## Input Parameters 

*Parameters will be described in tables for easier readability* 

 

| Parameter | Type | Description | 

 

| :fileUrl | :string | :The path to the file | 

| :fileName | :string | :Name of the file to be previewed | 

| :fileKind | :string | :Type or category of the file (markdown, text) | 

 

## Calling Methods 

 

- POST 

 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

 

| Output | Type | Description | 

 

| :HTML | :string | :The file content for preview | 

| :returnedPreview | :function | :Callback function used to render the returned content | 

 

## Examples of Use 
```
function loadPreview(fileUrl, fileName, fileKind) { 

 

    filename = fileName; 

    filepath = fileUrl; 

    filekind = fileKind; 

 

    $("#fileName").val(fileName); 

    $("#fileKind").val(fileKind); 

    $(".previewWindow").show(); 

    $(".previewWindowContainer").css("display", "block"); 

    $(".markdownPart").show(); 

    $(".editFilePart").hide(); 

 

    //$.ajax({url: fileUrl, type: 'get', dataType: 'html', success: returnedPreview}); 

    $.ajax({ 

        url: "showdoc.php?courseid=" + querystring['courseid'] + "&coursevers=" + querystring['coursevers'] + "&fname=" + fileName + "&read=yes", 

        type: 'post', 

        dataType: 'html', 

        success: returnedPreview 

    }); 

}
```

 

### Microservices Used 

*Includes and microservices used* 

 

showdoc.php 

Receives file name, course ID and course version, returns the files contents for preview. 

 

-------------------------------------------------------------------------------------- 

# Name of file/service 

 

Profile.js 

Function: processChallenge 

 

## Description 

*Description of what the service do and its function in the system.* 

 

This function handles the updating of a users security challenge question and answer. It sends a POST request to profileservice.php with the users password, selected question and answer. 

 

## Input Parameters 

*Parameters will be described in tables for easier readability* 

 

| Parameter | Type | Description | 

 

| :password | :string | :The current password of the user | 

| :question | :string | :The security question selected by the user | 

| :answer | :string | :The users answer to the security question | 

 

## Calling Methods 

 

- POST 

 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

 

| Output | Type | Description | 

 

| :success | :boolean | :True if update was successful | 

| :status | :string | :Additional status info | 

 

## Examples of Use 
```
function processChallenge(password, question, answer){ 

    var message = $("#challengeMessage"); 

    var curPassword = $("#currentPassword"); 

    var secQuestion = $("#securityQuestion"); 

    var chaAnswer = $("#challengeAnswer"); 

     

    $.ajax({ 

        type: "POST", 

        url: "profileservice.php", 

        data: { 

            password: password, 

            question:question, 

            answer: answer, 

            action: "challenge" 

        }, 

        dataType: "json", 

        success:function(data) { 

            if (data.success) { 

                message.html("Challenge has been updated!!"); 

                clearField(curPassword); 

                clearField(secQuestion); 

                clearField(chaAnswer); 

            } else { 

                if(data.status == "teacher") { 

                    message.html("Teachers are not allowed to change challenge question!"); 

                    updateField(curPassword); 

                    updateField(secQuestion); 

                    updateField(chaAnswer); 

                } else if (data.status == "wrongpassword") { 

                    message.html("Incorrect password!"); 

                    clearField(secQuestion); 

                    clearField(chaAnswer); 

                    updateField(curPassword); 

                } else { 

                    message.html("Unknown error."); 

                    clearField(curPassword); 

                    updateField(secQuestion); 

                    updateField(chaAnswer); 

                } 

            } 

        }, 

        error:function() { 

            message.html("Error: Could not communicate with server"); 

        } 

    }); 

}
``` 

 

### Microservices Used 

*Includes and microservices used* 

 

profileservice.php 

Validates the users identity and updates their security challenge question. 

 

--------------------------------------------------------------------------------------- 

# Name of file/service 

 

Profile.js 

Function: changePassword 

 

## Description 

*Description of what the service do and its function in the system.* 

 

This function handles the password change process for a user. It collects the current and new password from a form and sends a POST request to profileservice.php.  

 

## Input Parameters 

*Parameters will be described in tables for easier readability* 

 

| Parameter | Type | Description | 

 

| :password | :string | :The users current password | 

| :newPassword | :string | :The new password | 

| :action | :string | :Set to “password” to indicate operation | 

 

## Calling Methods 

 

- POST 

 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

 

| Output | Type | Description | 

 

| :success | :boolean | :True if password was successfully changed | 

| :status | :string | : "teacher" if teacher accounts are restricted, "wrongpassword" if current password is incorrect | 

 

## Examples of Use 
```
function changePassword(){ 

    //Form inputs 

    var currentField = $("#currentPassword2"); 

    var newField = $("#newPassword"); 

    var confirmField = $("#newPassword2"); 

    var message = $("#passwordMessage"); 

    //Value of form inputs 

    var password = currentField.val(); 

    var newPassword = newField.val(); 

     

    $.ajax({ 

        type: "POST", 

        url: "profileservice.php", 

        data: { 

            password: password, 

            newPassword: newPassword, 

            action: "password" 

        }, 

        dataType: "json", 

        success:function(data){ 

            if(data.success){ 

                //Resets form 

                clearField(currentField); 

                clearField(newField); 

                clearField(confirmField); 

                $("#passwordForm").trigger("reset"); 

                message.html("Password successfully updated!"); 

            } else { 

                if (data.status == "teacher") { 

                    message.html("Teachers can't change password."); 

                    updateField(currentField); 

                    updateField(newField); 

                    updateField(confirmField); 

                } else if (data.status == "wrongpassword") { 

                    message.html("Current password is not correct."); 

                    updateField(currentField); 

                } else { 

                    message.html("Unknown error.") 

                } 

            } 

        }, 

        error:function() { 

            message.html("Error: Could not communicate with server"); 

        } 

    }); 

}
``` 

 

### Microservices Used 

*Includes and microservices used* 

 

profileservice.php 

Accepts password, newPassword, validates the current password and updates the users password if allowed. 

 

-------------------------------------------------------------------------------------- 

# Name of file/service 

 

Pushnotifications.js 

 

## Description 

*Description of what the service do and its function in the system.* 

 

This module manages push notification subscriptions in the browser. It registers service workers, subscribes/unsubscribes users to push notifications using the browsers Push API and communicates with the server via pushnotifications.php. 

 

## Input Parameters 

*Parameters will be described in tables for easier readability* 

 

| Parameter | Type | Description | 

 

| :--- | :--- | :--- | 

| :--- | :--- | :---  

 

 

## Calling Methods 

 

- POST 

 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

 

| Output | Type | Description | 

 

| :text | :string | :The server returns simple text responses | 

| :UI updates | :HTML | :The DOM is updated to reflect subscription state | 

 

## Examples of Use 
```
$(function() { 

 

    let sendPushRegistrationToServer = function(subscription, deregister) { 

        $.ajax({ 

            url: "pushnotifications.php", 

            type: "POST", 

            data: {action: (deregister == true ? 'deregister' : 'register'), subscription: subscription.toJSON()}, 

            dataType: "text", 

            success: function() { 

                window.setTimeout(function() { 

                    updateTextAndButton((deregister != true)); 

                }, 1000); 

            } 

        }); 

    }; 

 

.... 
```

 

### Microservices Used 

*Includes and microservices used* 

pushnotifications.php 

Receives subscription object to store or remove push subscription in server database. 

 

--------------------------------------------------------------------------------------- 

# Name of file/service 

 

pushnotificationsserviceworker.js 

 

## Description 

*Description of what the service do and its function in the system.* 

 

This service handles browser push notifications for LenaSYS. It handles push events, displays a notification with the message content and confirms delivery to the server. 

 

## Input Parameters 

*Parameters will be described in tables for easier readability* 

 

| Parameter | Type | Description | 

 

| :event.data.text() | :string | :The puch message sent from backend | 

| :subscription.endpoint | :string | :The URL endpoint identifying the users push subscription | 

 

## Calling Methods 

 

- POST 

 

## Output Data and Format 

*Output Data will be described in tables for easier readability* 

 

| Output | Type | Description | 

 

| :Notification | :object | :Browser notifications with title, icon and body text | 

| :Server POST | :text | :POST request to pushnotifications.php to log delivery success | 

 

## Examples of Use 
```
'use strict'; 

 

self.addEventListener('push', function(event) { 

    var notificationText = event.data.text(); 

    event.waitUntil( 

        self.registration.showNotification("LenaSYS Notification", { 

            body: notificationText, 

            badge: '../Shared/icons/Pen.png', 

            icon: '../Shared/icons/LenasysIcon.png' 

        }) 

    ); 

    self.registration.pushManager.getSubscription().then(function(subscription) { 

        if (subscription) { 

            fetch('pushnotifications.php', { 

                method: 'POST', 

                headers: { 

                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' 

                }, 

                body: 'action=pushsuccess&endpoint=' + encodeURIComponent(subscription.endpoint) 

            }); 

        } 

    }); 

}); 

 

self.addEventListener('notificationclick', function(event) { 

    event.notification.close(); 

 

    clients.openWindow("courseed.php"); 

});
```

 

### Microservices Used 

*Includes and microservices used* 


pushnotifications.php 

Used to log or confirm that the notification was received by the user. 

 

-------------------------------------------------------------------------------------- 