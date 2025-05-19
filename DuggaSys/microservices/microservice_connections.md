In this file the connection between javascript and PHP is docummented.

# Name of file/service
accessed.js
Function addUserToCourse()

## Description
This function adds a user to a course. It performs two main operations, retrieves the user’s UID by querying accessedservice.php using their username and assigns the user to a course version and term using the AJAXService.

## Input Parameters
- Parameter: opt
   - Type: String
   - Description: Operation type

- Parameter: action
   - Type: String
   - Description: Specifies the action

- Parameter: username
   - Type: String
   - Description: Login name that uniquely identifies the user you are about to add. Stored as varchar(80) in the database 

- Parameter: uid
   - Type: int
   - Description: The user’s internal ID. Stored as int(10) in the database

- Parameter: courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database
  
- Parameter: coursevers
   - Type: String
   - Description: Specific course version. Stored as varchar(8) in the database

## Calling Methods
- POST

## Output Data and Format
– Output: user  
   – Type: JSON-array  
   – Description: One-element list containing the looked-up user record

- Output: success/error
   - Type: String
   - Description: Success means the lookup is completed,
error is returned with an explanatory message field if something failed

- Output: courses/groups/teachers/classes/submissions
   - Type: JSON-object
   - Description: A bundle of fresh lists so the page can redraw

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
- accessedservice.php

---
# Name of file/service
accessed.js
Function removeUserFromCourse()

## Description
Removes a user from the current course-version, retrives UID with ajax POST, then deletes user with opt DELETE.

## Input Parameters
- Parameter: opt
   - Type: String
   - Description: Operation type

- Parameter: username
   - Type: String
   - Description: Username to translate into uid. Stored as varchar(80) in the database 

- Parameter: action
   - Type: String
   - Description: Specifies the action

- Parameter: courseid
   - Type: int
   - Description: Current course ID. Stored as int(10) in the database 

- Parameter: uid
   - Type: int
   - Description: User-ID returned from username. Stored as int(10) in the database 

## Calling Methods
- POST

## Output Data and Format
- Output: user
   - Type: array
   - Description: Contains elements such as uid, firstname, lastname, …

- Output: error
   - Type: String
   - Description: Error text if user not found

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

---
# Name of file/service
accessed.js
Function: loadUsersToDropdown

## Description
This function retrieves all users from the backend and populates a dropdown field with usernames. It is used when showing user-related popup modals such as “Add User” or “Remove User”.

## Input Parameters
- Parameter: opt
   - Type: String
   - Description: Operation type

- Parameter: action
   - Type: String
   - Description: Specifies the action

## Calling Methods
- POST

## Output Data and Format
- Output: users
   - Type: JSON-array
   - Description: List of user objects (uid, username, firstname, lastname…)

- Output: success / error
   - Type: String
   - Description: Success if the list was fetched, error otherwise.

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
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: coursename
   - Type: String
   - Description: Course name. Stored as varchar(80) in the database

- Parameter: coursecode
   - Type: varchar
   - Description: Course code. Stored as varchar(45) in the database

- Parameter: visibility
   - Type: int
   - Description: Visibility of the section. Stored as tinyint(1) in the database

- Parameter: action
   - Type: String
   - Description: Specifies the action  

- Parameter: githubURL
   - Type: varchar
   - Description: FUll repo URL

## Calling Methods
- POST

## Output Data and Format
- Output: true/false
   - Type: bool
   - Description: True if status 200

- Output: message
   - Type: String
   - Description: Returned with 422/503

- Output: status
   - Type: int
   - Description: Switch/case, 200/422/503

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
Function: FetchGitHubRepo()

## Description
Used to fetch and validate data from GitHub repository. If successful it return true, otherwise false.

## Input Parameters
- Parameter: gitHubURL
   - Type: ?
   - Description: Full repo URL, Describe parameter. Stored as *varchar(256)* in the database

- Parameter: action
   - Type: String
   - Description: Specifies the action

## Calling Methods
- POST

## Output Data and Format
- Output: message
   - Type: String
   - Description: Present on 422/503, forwarded to the toast

- Output: true/false
   - Type: bool
   - Description: true if HTTP 200, otherwise false

- Output: status
   - Type: int
   - Description: Switch/case, 200/422/503

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
   - Description: Full repo URL. Describe parameter. Stored as *int(11)* in the database

- Parameter: action
   - Type: String
   - Description: Specifies the action

## Calling Methods
- POST

## Output Data and Format
- Output: message
   - Type: String
   - Description: Present on 422/503, forwarded to the toast

- Output: true/false
   - Type: bool 
   - Description: true if HTTP 200, otherwise false

- Output: status
   - Type: int
   - Description: Switch/case, 200/422/503

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
   - Type: ?
   - Description: New repository URL for the course. Stored as *varchar(256)* in the database

-- Parameter: cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: action
   - Type: String
   - Description: Specifies the action

## Calling Methods
- POST

## Output Data and Format
- Output: message
   - Type: String
   - Description: Present on 422/503, forwarded to the toast

- Output: true/false
   - Type: bool
   - Description: true if HTTP 200, otherwise false

- Output: status
   - Type: int
   - Description: Switch/case, 200/422/503

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
# Name of file/service
sectioned.js
Function refreshGithubRepo

## Description
It sends a POST request to gitcommitService.php with the course ID and user to retrieve the latest Git data. Returns true on success, false on failure.

## Input Parameters
- Parameter: cid
   - Type: int
   - Description: Course ID whose repo should be refreshed. Stored as int(10) in the database

- Parameter: user
   - Type: ?
   - Description: Logged-in user ID. Stored as *int(11)* in the database
  
- Parameter: action
   - Type: String
   - Description: Specifies the action

## Calling Methods
- POST

## Output Data and Format
- Output: message
   - Type: String
   - Description: No repo triggers a success message that is forwarded to toast

- Output: true/false
   - Type: bool
   - Description: True if status 200, else false
  
- Output: status
   - Type: int
   - Description: Switch/case, 200 success, 403/422 validation, 503 error

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
   - Type: ?
   - Description: Repo root URL. Stored as *varchar(256)* in the database

- Parameter: cid
   - Type: int
   - Description: Course-id whose repo entry should be replaced. Stored as int(10) in the database

- Parameter: token
   - Type: varchar ?
   - Description: Personal access-token to use for authenticated requests. Stored as varchar(40) in the database

- Parameter: action
   - Type: String
   - Description: Specifies the action

## Calling Methods
- POST

## Output Data and Format
- Output: status
   - Type: int
   - Description: 200 success, 403 forbidden (bad token), 422 validation, 503 GitHub failure

- Output: message
   - Type: JSON
   - Description: On error, data.responseJSON.message for the toast

- Output: True/false
   - Type: bool
   - Description: True if status 200, else false

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
# Name of file/service
sectioned.js
Function: updateSelectedDir()

## Description
The function updates the selected directory for a course.

## Input Parameters
- Parameter: selectDir
   - Type: ?
   - Description: Relative path to the directory inside the repo. Stored as *varchar(256)* in the database

- Parameter: cid
   - Type: int
   - Description: Course-id that owns the repo, stored as int(10) in the database

- Parameter: action
   - Type: String
   - Description: Specifies the action

## Calling Methods
- POST

## Output Data and Format
- Output: status
   - Type: String
   - Description: Success or error

- Output: message
   - Type: String
   - Description: Explenation status
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
- sectioned.php

---
# Name of file/service
sectioned.js
Function: retrieveCourseProfile()

## Description
This function retrives available course versions based on a selected course ID, it sends POST request to fetch course version and display dropdown with reults. 

## Input Parameters
- Parameter: cid
   - Type: int
   - Description: Course-id currently selected in the UI. Stored as int(10) in the database

## Calling Methods
- POST

## Output Data and Format
- Output: versids
   - Type: array
   - Description: Every object contains a versid string. Stored as varchar(8) in the database

- Output: error
   - Type: String
   - Description: Error description if the query failed

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
- retrievevers.php

---
# Name of file/service
sectioned.js
Function getStudents()

## Description
This function retrieves student, split into “Finished” and “Non-finished” group-lists.

## Input Parameters
- Parameter: cid
   - Type: int
   - Description: Course-ID chosen. Stored as int(10) in the database

- Parameter: remove_student
   - Type: ?
   - Description: The author’s own userid so she doesn’t appear in the list. Stored as ? in the database

- Parameter: versid
   - Type: String
   - Description: Version code. Stored as varchar(8) in the database

## Calling Methods
- POST

## Output Data and Format
- Output: finished_students
   - Type: array
   - Description: Students that have completed the version

- Output: non_finished_students
   - Type: array
   - Description: Students still active

- Output: error
   - Type: String
   - Description: Error description on failure

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
- retrieveuser_course.php

---
# Name of file/service
sectioned.js
Function: retrieveAnnouncementsCards()

## Description
This function retrives and displays announcements relevant to a user for a given course and version.

## Input Parameters
- Parameter: username
   - Type: String
   - Description: Stored as varchar(80) in the database 

- Parameter: cid
   - Type: int
   - Description: Stored as int(10) in the database

- Parameter: versid
   - Type: String
   - Description: Stored as varchar(8) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: retriveAnnouncementCard
   - Type: HTML
   - Description: Fully rendered markup

- Output: nRows
   - Type: Number
   - Description: Count of unread announcements for the user

- Parameter: error
   - Type: String
   - Description: Error message

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
- retrieveUserid.php
- retrieveAnnouncements.php

---
# Name of file/service 
sectioned.js 
Function: updateReadStatus()

## Description 
This function updates the read status of an announcement for a user. It fetches the user's ID based on username. Retrieve the user’s numeric uid with retrieveUserid.php - GET. Post announcementid, uid, cid, and versid to updateviewedAnnouncementCards.php - POST, so the read state is stored in the database

## Input Parameters 
- Parameter: announcementid
   - Type: ?
   - Description: ID of the announcement card you’re marking as read, tells the server exactly which announcement to update. Stored as ? in the database

- Parameter: cid
   - Type: int
   - Description: The course ID,	lets the service know which course the announcement belongs to. Stored as int(10) in the database

- Parameter: versid
   - Type: String
   - Description: The course-version code. Stored as varchar(8) in the database

- Parameter: username
   - Type: String
   - Description: The user’s login name, taken from the page. Stored as varchar(80) in the database 

## Calling Methods 
- GET (retrieveUserid.php) 
- POST (updateviewedAnnouncementCards.php) 

## Output Data and Format 
- 

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
- retrieveUserid.php
- updateviewedAnnouncementCards.php 

---
# Name of file/service 
sectioned.js 
Function: toggleFeedbacks()

## Description 
The function retrieves and displays recent feedback for the logged-in student. 

## Input Parameters 
- Parameter: username
   - Type: String
   - Description: Sent to retrieveUserid.php so the server can translate it into an internal uid. Stored as varchar(80) in the database 

- Parameter: studentid (uid)
   - Type: ?
   - Description: Describe parameter. Stored as *int(11)* in the database

## Calling Methods 
- GET (retrieveUserid.php)  
- POST (retrieveFeedbacks.php)

## Output Data and Format 
- Output: duggaFeedback
   - Type: HTML
   - Description: Describe the output. Stored as *tinyint(2)* in the database

- Output: unreadFeedbackNotification
   - Type: int
   - Description: Describe the output. Stored as *tinyint(2)* in the database

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
- retrieveUserid.php 
- retrieveFeedbacks.php 

---
# Name of file/service 
sectioned.js 
Function: createExamples()

## Description 
This function fetches code examples for a specific lecture identified by momentID. 

## Input Parameters
- Parameter: opt
   - Type: String
   - Description: Operation type

- Parameter: lid
   - Type: int
   - Description: Listentry ID - momentIS. Stored as int(10) in the database

- Parameter: isManual
   - Type: bool
   - Description: True if the call was triggered by the user, false when executed by the automatic timer.  Only used for a console log line. Stored as int(10) in the database

## Calling Methods 
- POST 

## Output Data and Format 
- Output: response
   - Type: JSON
   - Description: Sends back one JSON object that says whether the update worked, how many code-example files were refreshed, their basic info, and (if something went wrong) an error message.
 
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
- sectionedservice.php 

---
# Name of file/service 
sectioned.js 
Function: storeCodeExamples()

## Description 
This function is responsible for storing code examples from GitHub repository into both a directory and database, then sends the data as a JSON object to PHP service (sectionedservice.php) 

## Input Parameters
- Parameter: cid
   - Type: int
   - Description: Stored as int(10) in the database

- Parameter: codeExamplesContent
   - Type: Array
   - Description: Array returned by the GitHub API, each element contains fields such as, sha, path, size.. Stored as *int(11)* in the database

- Parameter: githubURL
   - Type: ?
   - Description: Root URL of the repo. Stored as ? in the database

- Parameter: fileName
   - Type: String
   - Description: File name. Stored as varchar(256) in the database

## Calling Methods 
- POST 

## Output Data and Format 
- Output: response
   - Type: String
   - Description: Logs whatever sectionedservice.php echoes back. Reply is a plain-text string 

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
- sectionedservice.php 

---
# Name of file/service 
codeviewer.js 
Function: showIframe()

## Description 
The function loads and displays a preview window for file editing. It replaces the existing preview window on the page with the one fetched from fileed.php.
## Input Parameters 
- Parameter: path
   - Type: String
   - Description: Relative/absolute path to the file that should be edited. Stored as ? in the database

- Parameter: name
   - Type: ?
   - Description: File name shown in the editor header. Stored as ? in the database

- Parameter: kind
   - Type: int
   - Description: Code that tells the PHP service what sort of file is being handled. Stored as int(10) in the database

## Calling Methods 
- GET

## Output Data and Format 
- 

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
- fileed.php 

---
# Name of file/service 
Diagram_IOHandler.js 
Function: saveToServer()

## Description 
This function sends a diagram from diagram editor to the backend for saving. It uses an AJAX POST request to submit the diagram data along with a generated hash value. 

## Input Parameters 
- Parameter: dia
   - Type: ?
   - Description: Data to save. Stored as ? in the database

## Calling Methods 
- POST 

## Output Data and Format 
-

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
- diagramservice.php 

---
# Name of file/service 
Diagram_IOHandler.js 
Function: Redirect()

## Description 
Creates (or registers) a new *folder* on the server, then navigates the browser to that
folder’s fresh project page.

## Input Parameters 
- Parameter: doc
   - Type: HTMLElement
   - Description: A control whose value contains the folder name the user chose.

- Parameter: getID
   - Type: ?
   - Description: Describe parameter. Stored as *int(11)* in the database

## Calling Methods 
- POST 

## Output Data and Format 
- 

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
diagram_IOHandler.php 
diagramservice.php 

---
# Name of file/service 
Fileed.js 
Function: loadFile()

## Description 
This function is used to load and display a specific file (Markdown, plain text, or other content types) within the preview window. It updates the UI and sends a POST request to showdoc.php to fetch the file contents for preview. 

## Input Parameters 
- Parameter: fileUrl
   - Type: ?
   - Description: Full/relative path to the file. Stored as *varchar(256)* in the database

- Parameter: fileName
   - Type: String
   - Description: Filename. Stored as varchar(256) in the database

- Parameter: fileKind
   - Type: Tinyint ?
   - Description: Storage class, 1 = Link, 2 = Global, 3 = Course local, 4 = Local. Stored as ? in the database

- Parameter: coursevers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

## Calling Methods 
- POST 

## Output Data and Format
- 

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
- showdoc.php

---
# Name of file/service 
fileed.js 
Function: loadPreview() 

## Description 
The function is responsible for previewing a file's content in a read-only format. It sets up the preview UI for the selected file, displays the preview window, and makes a POST request to showdoc.php to retrieve the file's content. This function is intended for viewing only, not editing. 

## Input Parameters 
- Parameter: fileUrl
   - Type: ?
   - Description: Full/relative path to the file. Stored as *varchar(256)* in the database

- Parameter: fileName
   - Type: String
   - Description: Filename. Stored as varchar(256) in the database

- Parameter: fileKind
   - Type: Tinyint ?
   - Description: Storage class, 1 = Link, 2 = Global, 3 = Course local, 4 = Local. Stored as ? in the database

- Parameter: coursevers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

## Calling Methods 
- POST 

## Output Data and Format 
- Output: returnedPreview
   - Type: HTML
   - Description: returnedPreview() injects rendered HTML

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
- showdoc.php
 
--- 
# Name of file/service 
profile.js 
Function: processChallenge()

## Description 
This function handles the updating of a users security challenge question and answer. It sends a POST request to profileservice.php with the users password, selected question and answer. 

 ## Input Parameters 
- Parameter: password
   - Type: String
   - Description: The current password of the user. Stored as varchar(225) in the database

- Parameter: question
   - Type: String
   - Description: Security challenge question. Stored as varchar(256) in the database

- Parameter: $answer
   - Type: String
   - Description: The answer to the security challenge question. Stored as varchar(256) in the database

- Parameter: action
   - Type: String
   - Description: Specifies the action

## Calling Methods 
- POST 

## Output Data and Format 
- Output: success
   - Type: bool
   - Description: True, the server has accepted the password, stored the new question and answer. False, the update failed for one of the reasons spelled out in status

- Output: status
   - Type: String
   - Description: Describes the error, only when success is false

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
- profileservice.php 

--- 
# Name of file/service 
Profile.js 
Function: changePassword() 

## Description 
This function handles the password change process for a user. It collects the current and new password from a form and sends a POST request to profileservice.php.  

## Input Parameters 
- Parameter: password
   - Type: String
   - Description: The current password of the user. Stored as varchar(225) in the database

- Parameter: $newPassword
   - Type: int
   - Description: The new password the user wants to change to. Stored as varchar(225) in the database

- Parameter: action
   - Type: String
   - Description: Specifies the action

## Calling Methods 
- POST 

## Output Data and Format 
- Output: success
   - Type: bool
   - Description: True, password updated. False, update refused

- Output: status
   - Type: String
   - Description: Describes the error, only when success is false

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
- profileservice.php 

---
# Name of file/service 
pushnotifications.js 

## Description 
This module manages push notification subscriptions in the browser. It registers service workers, subscribes/unsubscribes users to push notifications using the browsers Push API and communicates with the server via pushnotifications.php. 

## Input Parameters 
- Parameter: action
   - Type: String
   - Description: Specifies the action

- Parameter: subscription
   - Type: JSON
   - Description: Specifies the action

## Calling Methods 
- POST 

## Output Data and Format 
- Output: response
   - Type: String
   - Description: Describes the outcome in text

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
- pushnotifications.php 

---
# Name of file/service 
pushnotificationsserviceworker.js 

 ## Description 
This service handles browser push notifications, push events, displays a notification with confirmation message. 

 ## Input Parameters 
- Parameter: subscription.endpoint 
   - Type: String
   - Description: Describe parameter. Stored as *int(11)* in the database

- Parameter: action
   - Type: String
   - Description: Specifies the action

## Calling Methods 
- POST 

## Output Data and Format 
- Output: response
   - Type: String
   - Description: Describes the outcome in text

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
- pushnotifications.php