function saveChallenge(){
    var password = $("#currentPassword").val();
    var question= $("#securityQuestion").val();
    var answer= $("#challengeAnswer").val();
    
    if(password != "" && question != "" && answer != ""){
        processChallenge(password, question, answer);
    } else {
        $("#challengeMessage").html("Fill out all the fields");
        $("#challengeAnswer").css("background-color", "rgba(255, 0, 6, 0.2)");
        $("#currentPassword").css("background-color", "rgba(255, 0, 6, 0.2)");
    }
}

function processChallenge(password, question, answer){
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
                    $("#challengeMessage").html("Challenge has been updated!!");
                    $("#currentPassword").css("background-color", "white");
                    $("#challengeAnswer").css("background-color", "white");
                }
                else{
                    $("#challengeMessage").html("Incorrect password!");
                    $("#challengeAnswer").css("background-color", "white");
                    $("#currentPassword").css("background-color", "rgba(255, 0, 6, 0.2)");
                }
			},
			error:function() {
				console.log("error");
                $("#challengeMessage").html("Error");
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
        console.log("hej");
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
            console.log("error");
            alert("Something went wrong");
        }
    });
}
