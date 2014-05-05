// This JS file is only for the startpage index.php
//
// TODO: Make this page possible to include from other parts of the project as
//       well?
function setupLogin()
{
	$(document).ready(function() {
		// Handle logins via AJAX
		$("#loginform").on("submit", function(event) {
			// Prevent the default event from happening (moving over to the login.php
			// page in this case).
			event.preventDefault();
			var data = $(this).serialize();

			// Post to login.php to see if the credentials were correct or not.
			$.post("login.php", data, function(data) {
				var res = $.parseJSON(data);
				if(res.login == "success") {
					closeloginbox();
					// If this user hasn't logged in since a password reset then ask them
					// to change their password via the form each time they log in.
					// Otherwise, refresh the page to indicate that they were
					// successfully logged in.
					if(res.newpw == true) {
						shownewpw();
					} else {
						window.location.reload();
					}
				} else {
					// If login failed then display an alert and return to the form.
					// TODO: Change this to some kind of prettier notification that we
					//       failed to log in?
					alert("Failed to log in.");
				}
			})
		});

		// Hook the submit events for all our forms to make sure that we handle
		// the submit events in a pretty AJAX-y manner.
		$("#recoverform").on("submit", showQuestion);
		$("#answerform").on("submit", checkAnswer);
		$("#newpasswordform").on("submit", newPasswordAndQuestion);
	});
}
//function for closing windows with escape
$( document ).on( 'keydown', function ( e ) {
    if ( e.keyCode === 27 ) {
		$("#bg").hide();
        $("#login-box").hide();
		$("#forgot-passw-box").hide();
		$("#answer-box").hide();
    }
});


//function for showing the login-box
function loginbox(){
	$("#forgot-passw-box").hide();
	$("#bg").css({'background': 'rgba(0, 0, 0, 0.5)', 'position': 'absolute', 'top': '0'});
	$("#login-box").css({'left': (($(document).width()/2) - $("#login-box").width()/2)});

	$("#login-box").toggle();
	$("#bg").toggle();
}
function closeloginbox(){
	$("#login-box").hide();
	$("#bg").hide();
	$("#loginform").find('input').not('[type=submit]').val('');
}
function closeforgotpwbox(){
	$("#forgot-passw-box").hide();
	$("#bg").hide();
	$("#recoverform").find('input').not('[type=submit]').val('');
}
function showForgotPasswBox(){
	$("#login-box").hide();

	$("#bg").css({'background': 'rgba(0, 0, 0, 0.5)', 'position': 'absolute', 'top': '0'});
	$("#forgot-passw-box").css({'left': (($(document).width()/2) - $("#login-box").width()/2)});
	$("#forgot-passw-box").toggle();

}

function shownewpw() {
	$("#newpassword-box").css({'left': (($(document).width()/2) - $("#newpassword-box").width()/2)});
	$("#newpassword-box").toggle();
	$("#bg").toggle();
}

function closenewpwbox() {
	$("#newpassword-box").hide();
	$("#bg").hide();
}
function returnToLogin(){
	$("#login-box").show();
	$("#forgot-passw-box").hide();
	$("#answer-box").hide();
}

function showQuestion(event) {
	event.preventDefault();
	var un = $(this).find("input[type=text]").get(0);
	un = $(un).val();
	var form = $(this)
	if(un.length > 0) {
		// Fetch the question for this user from the database.
		return $.get("forgotpassword.php", {'user': un}, function(data) {
			var data = $.parseJSON(data)
			if(typeof data.error == "undefined") {
				// Close the boxes and show the answer box if we got a successful lookup.
				closeloginbox();
				closeforgotpwbox();
				showanswerbox(un, data.question)
			} else {
				// Display the error on the form.
				form.find("#forgot-error").first().text(data.error)
			}
		})
	}
}

function showanswerbox(username, question) {
	$("#bg").show();
	var form = $("#answerform");
	form.find("input[name=user]").val(username);
	form.find("#recoverquestion").text(question);
	$("#answer-box").css({'left': (($(document).width()/2) - $("#answer-box").width()/2)});
	$("#answer-box").show();
}

function closeanswerbox() {
	var form = $("#answerform");
	form.find('input').not('[type=submit]').val('');
	$("#answer-box").hide();
	$("#bg").hide();
}

function checkAnswer(event) {
	event.preventDefault();
	var data = $(this).serialize();
	var form = $(this)
	$.post("forgotpassword.php", data, function(data) {
		var res = $.parseJSON(data);
		if(typeof res.success !== "undefined" && res.success == true) {
			// If the password was successfully changed then hide the box and close
			// the answer box. Our work here is done.
			form.closest("#forgot-passw-box").hide();
			closeanswerbox();
		} else {
			// If we failed to change the user's password then notify them of the
			// reason why.
			alert("Failed to change password.\r\n" + res.error);
		}
	});
}

function newPasswordAndQuestion(event) {
	event.preventDefault();

	var data = $(this).serialize();
	$.post("newpassword.php", data, function(data) {
		var res = $.parseJSON(data);
		if(typeof res.success !== "undefined" && res.success == true) {
			// If we got a positive result on setting a new password and recover
			// question then we can close the box and reload the page.
			alert("New password set and successfully logged in");
			closenewpwbox();
			window.location.reload();
		} else {
			// Otherwise, tell the user that we couldn't update their password
			// and tell them why.
			alert("Failed to set new password. " + res.errormsg);
		}
	});
}
