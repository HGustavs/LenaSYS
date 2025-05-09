function validateChallenge(){
    var message = document.getElementById("challengeMessage");
    var curPassword = document.getElementById("currentPassword");
    var secQuestion = document.getElementById("securityQuestion");
    var chaAnswer = document.getElementById("challengeAnswer");
    
    var password = curPassword.value;
    var question = secQuestion.value;
    var answer = chaAnswer.value;
    var chars = "^[a-zåäöéA-ZÅÄÖÉ 0-9\-\_\']*$";
       
    if(password != "" && question != "" && answer != ""){
        if(answer.match(chars)){
            processChallenge(password, question, answer);
        } else {
             message.innerHTML="Enter valid characters (a-ö, space, 0-9, -_')";
        }
    } else {
        message.innerHTML="Fill out all the fields";
        updateField(chaAnswer);
        updateField(curPassword);
    }
}

function processChallenge(password, question, answer){
	var message = document.getElementById("challengeMessage");
    var curPassword = document.getElementById("currentPassword");
    var secQuestion = document.getElementById("securityQuestion");
    var chaAnswer = document.getElementById("challengeAnswer");

    const url = ("../DuggaSys/profileservice.php");
    const params = {
        password: password,
        question:question,
        answer: answer,
        action: "challenge"
    };
    
    fetch(url, {
		method: "POST",
		headers: {
            "Content-Type": "application/json"
        },
		body: JSON.stringify(params)
    })
	.then(response => {
        if(!response.ok){
            throw new Error("Response not OK");
        }
        return response.json();
    })
    .then(data => {
        if(!data) return;
        if (data.success) {
			message.innerHTML="Challenge has been updated!!";
			clearField(curPassword);
			clearField(secQuestion);
			clearField(chaAnswer);
		} else {
			if(data.status == "teacher") {
				message.innerHTML="Teachers are not allowed to change challenge question!";
				updateField(curPassword);
				updateField(secQuestion);
				updateField(chaAnswer);
			} else if (data.status == "wrongpassword") {
				message.innerHTML="Incorrect password!";
				clearField(secQuestion);
				clearField(chaAnswer);
				updateField(curPassword);
			} else {
				message.innerHTML="Unknown error.";
				clearField(curPassword);
				updateField(secQuestion);
				updateField(chaAnswer);
			}
		}
	})
	.catch(() => {
		message.innerHTML="Error: Could not communicate with server";		
    });
}

//A function that validates the form used for changing password
function validatePassword(){
    //Variables for form elements
    var currentField = document.getElementById("currentPassword2");
    var newField = document.getElementById("newPassword");
    var confirmField = document.getElementById("newPassword2");
    var message = document.getElementById("passwordMessage");
    
    //Fetching inputs from the password form
    var password = currentField.value;
    var newPassword = newField.value;
    var confirmedPassword = confirmField.value;
    
    //Checking for empty inputs 
    if(password === "" || newPassword === "" || confirmedPassword === ""){
        if(password === ""){
            updateField(currentField);
        }
        else{
            clearField(currentField);
        }
        
        if(newPassword === ""){
            updateField(newField);
        }
        else{
            clearField(newField);
        }
        
        if(confirmedPassword === ""){
            updateField(confirmField);
        }
        else{
            clearField(confirmField);
        }
        message.innerHTML="Missing form data, please enter all fields";
        return;
    }
    
    //Comparing new password with old one
    if(password === newPassword){
        updateField(newField);
        message.innerHTML="New password cannot be the same as the current one.";
        return;
    }
    else{
        clearField(newField);
    }
    
    //Checking password rules through regexp    
    if(newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,72}$/)){
        clearField(newField);
       }
    else{
        updateField(newField);
        message.innerHTML="New password must follow the specified rules above.";
        return;
    }
    
    //Checks the confirmed password
    if(newPassword !== confirmedPassword){
        updateField(confirmField);
        message.innerHTML="New password did not match with the confirmation.";
        return;
    }
    else{
        clearField(confirmField);
    }  
    //Validation successful, call for function that changes password
    changePassword();
}

//Changes text input fields to red if validation fails
function updateField(field){
    field.style.backgroundColor="rgba(255, 0, 6, 0.2)";
}
//Resets a field color
function clearField(field){
    field.style.backgroundColor="white";
}

//Sends data from form to profileservice.php
function changePassword(){
    //Form inputs
    var currentField = document.getElementById("currentPassword2");
    var newField = document.getElementById("newPassword");
    var confirmField = document.getElementById("newPassword2");
    var message = document.getElementById("passwordMessage");
    //Value of form inputs
    var password = currentField.value;
    var newPassword = newField.value;

    const url=("../DuggaSys/profileservice.php")
    const params = {
        password: password,
        newPassword: newPassword,
        action: "password"
    }

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Response not OK");
        }
        return response.json();
    })
    .then(data => {
        if(!data) return;
		if(data.success){
            //Resets form
            clearField(currentField);
            clearField(newField);
            clearField(confirmField);
			document.getElementById("passwordForm").reset();
			message.innerHTML="Password successfully updated!";
		} else {
			if (data.status == "teacher") {
				message.innerHTML="Teachers can't change password.";
				updateField(currentField);
				updateField(newField);
				updateField(confirmField);
			} else if (data.status == "wrongpassword") {
				message.innerHTML="Current password is not correct.";
				updateField(currentField);
			} else {
				message.innerHTML="Unknown error."
			}
		}
	})
	.catch(() => {
		message.innerHTML="Error: Could not communicate with server";
	});
}


document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("passwordForm").addEventListener("submit", function(event) {
		event.preventDefault();
		validatePassword();
	});
	document.getElementById("challengeForm").addEventListener("submit", function(event) {
		event.preventDefault();
		validateChallenge();
	});
    
	if (!checkHTTPS()){
		document.getElementById("content").innerHTML="Profile settings can only be changed on a secure HTTPS connection.";
	}
});
