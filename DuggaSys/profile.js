function saveChallenge(){
    var message = $("#challengeMessage");
    var curPassword = $("#currentPassword");
    var secQuestion = $("#securityQuestion");
    var chaAnswer = $("#challengeAnswer");
    
    var password = curPassword.val();
    var question = secQuestion.val();
    var answer = chaAnswer.val();
    var chars = "^[a-zåäöéA-ZÅÄÖÈ 0-9\-\_\"\'\’\.\,\´]*$";
       
    if(password != "" && question != "" && answer != ""){
        if(answer.match(chars)){
            processChallenge(password, question, answer);
            message.html("Challenge has been updated!!");
            clearField(curPassword);
            clearField(secQuestion);
        } else {
             message.html("Enter valid characters!");
        }
    } else {
        message.html("Fill out all the fields");
        updateField(chaAnswer);
        updateField(curPassword);
    }
}

function processChallenge(password, question, answer){
	var message = $("#challengeMessage");
    var curPassword = $("#currentPassword");
    var secQuestion = $("#securityQuestion");
    var chaAnswer = $("#challengeAnswer");
    
    $.ajax({
			type:"POST",
			url: "profileservice.php",
			data: {
				password: password,
				question:question,
				answer: answer,
                action: "challenge"
			},
			success:function(data) {
				var result=data;
                if(data=="updated"){
                    message.html("Challenge has been updated!!");
                    clearField(curPassword);
                    clearField(secQuestion);
                    clearField(chaAnswer);
                }
                else if(data=="teacher"){
                    message.html("Teachers are not allowed to change password!");
                    clearField(curPassword);
                    updateField(secQuestion);
                    updateField(chaAnswer);
                }
                else{
                    message.html("Incorrect password!");
                    clearField(secQuestion);
                    clearField(chaAnswer);
                    updateField(curPassword);
                }
			},
			error:function() {
                message.html("Error");
			}
		});
}

//A function that validates the form used for changing password
function validatePassword(){
    //Variables for form elements
    var currentField = $("#currentPassword2");
    var newField = $("#newPassword");
    var confirmField = $("#newPassword2");
    var message = $("#passwordMessage");
    
    //Fetching inputs from the password form
    var password = currentField.val();
    var newPassword = newField.val();
    var confirmedPassword = confirmField.val();
    
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
        message.html("Missing form data, please enter all fields");
        return;
    }
    
    //Comparing new password with old one
    if(password === newPassword){
        updateField(newField);
        message.html("New password cannot be the same as the current one.");
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
        message.html("Password must follow the specified rules above.");
        return;
    }
    
    //Checks the confirmed password
    if(newPassword !== confirmedPassword){
        updateField(confirmField);
        message.html("New password did not match with the confirmation.");
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
    field.css("background-color", "rgba(255, 0, 6, 0.2)");
}
//Resets a field color
function clearField(field){
    field.css("background-color", "white");
}

//Handles key presses which allows return button to be used for submitting form
function formEventHandler(e){
    if(e.which == 13 || e.keyCode == 13){
        validatePassword();
        return false;
    }
    return true;
}

//Sends data from form to profileservice.php
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
        success:function(data){
            //When the query has successfully updates password
            var result = data;
            if(result == "updatedPassword"){
                //Resets form
                clearField(currentField);
                clearField(newField);
                clearField(confirmField);
                document.forms.passwordForm.reset();
                message.html("Password successfully updated!");
            }
            //If current password is not verified in the file 
            if(result == "error"){
                message.html("Current password is not correct.");
                currentField.css("background-color", "rgba(255, 0, 6, 0.2)");
                return;
            }
        },
        error:function() {
            alert("Something went wrong");
        }
    });
}


$(function() {
	if (!checkHTTPS()){
		$("#content").html("Profile settings can only be changed on a secure HTTPS connection.");
	}
});
