// CREATE AND SHOW/HIDE LOGINBOX FUNCTIONS START //
function createDeleteLogin() {
	if($('#overlay').length > 0) {
		$("#overlay").remove();
		$("#loginBox").remove();
		console.log("removeLogin");
	}
	else {
		$("body").prepend("<div id='loginBox'></div>");
		$("body").prepend("<div id='overlay' onclick='createDeleteLogin()'></div>");
		$("#loginBox").load(getScriptPath("login.js")+"/content/login.php");	
		console.log("printLogin");
	}		
}
function showLogin() {
	$(".btn.btn-login").removeClass("active");
	$("#login .btn.btn-login").addClass("active");

	$("#login").removeClass("hide");
	$("#forgotPwAnswer").addClass("hide");
	$("#forgotPw").addClass("hide");
	$("#newPassword").addClass("hide");

	$('#loginBox input.form-control').val('');
}
function showForgontPw() {
	$(".btn.btn-login").removeClass("active");
	$("#forgotPw .btn.btn-login").addClass("active");

	$("#forgotPw").removeClass("hide");
	$("#login").addClass("hide");
	$("#forgotPwAnswer").addClass("hide");
	$("#newPassword").addClass("hide");

	$('#loginBox input.form-control').val('');
}
function showForgotPwAnswer() {
	$(".btn.btn-login").removeClass("active");
	$("#forgotPwAnswer .btn.btn-login").addClass("active");

	$("#forgotPwAnswer").removeClass("hide");
	$("#forgotPw").addClass("hide");
	$("#login").addClass("hide");
	$("#newPassword").addClass("hide");

	$('#loginBox input.form-control').val('');
}
function showCreatePassword() {
	$(".btn.btn-login").removeClass("active");
	$("#createPassword .btn.btn-login").addClass("active");

	$("#createPassword").removeClass("hide");
	$("#forgotPwAnswer").addClass("hide");
	$("#forgotPw").addClass("hide");
	$("#login").addClass("hide");

	$('#loginBox input.form-control').val('');
}
// CREATE AND SHOW/HIDE LOGINBOX FUNCTIONS END //
// TRIGGER BUTTONFUNCTION WHEN KEY IS PRESSED START //
if (document.layers) {
	document.captureEvents(Event.KEYDOWN);
}
// TRIGGER BUTTONFUNCTION WHEN KEY IS PRESSED END //
// MAKE BUTTON CLICKED IF ENTER OR CLOSE LOGINBOX IF ESC FUNCTION START //
document.onkeydown = function (evt) {
	var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
	if (keyCode == 13) {
		$(".active").click();
	}
	if (keyCode == 27) {
		createDeleteLogin();
	} 
	else {
		return true;
	}
};
// MAKE BUTTON CLICKED IF ENTER OR CLOSE LOGINBOX IF ESC FUNCTION END //
// VALIDATE INPUT FUNCTIONS START //
	function validate(idElement) {
		var countElem = 0;
		var countValidElem = 0;
		$('#'+idElement).find('input').each(function(index,data) {
			var className = $(this).attr('class');
			if(className != undefined) {
				if(className.search("form-control") > -1) {
					if(className.search("isValid") > -1) {
						countValidElem++;
					}
					countElem++;
				}
			}
		});
		if(countElem == countValidElem && countElem != 0) {
			console.log("Valid");
			return(true);
		}
		else {
			console.log("notValid");
			return(false);
		}
	}
function checkIfEmpty(textInput){                                                                                                                                                                                                 
    if(textInput.value=="") {
        $(textInput).removeClass("isValid");                                                                                     
    }
    else {                                                                                                                                    
        $(textInput).addClass("isValid");                                                                                                    
    }                                                                                                               
}
// VALIDATE INPUT FUNCTIONS END //
// LOGIN AJAX FUNCTIONS START //
function makeLogin() {
	if(validate('login')) {
		
		var username = $("#login #username").val();
		var saveuserlogin = $("#login #saveuserlogin").val();
		var password = $("#login #password").val();
		$.ajax({
			type:"POST",
			url: getScriptPath("login.js")+"/ajax/login.php",
			data: {
				username: username,
				saveuserlogin: saveuserlogin,
				password: password
			},
			success:function(data) {
				var result = JSON.parse(data);
				if(result['login'] == "success") {
					$("#user label").html(result['username']);
					$("#user img").addClass("loggedin");
					console.log("Loged in");
					if(result['newpw'] == true) {
						showCreatePassword();
						console.log("First login, make new password!");
					}
					else {
						createDeleteLogin();
					}
				} else {
					console.log("Failed to log in.");
				}
			},
			error:function() {
				console.log("error");
			}
		});
	}
}
function makeLogout() {
	$.ajax({
		url: getScriptPath("login.js")+"/ajax/logout.php",
		success:function(data) {
			$("#user label").html("");
			$("#user img").removeClass("loggedin");
			page.show();
			createDeleteLogin();
		},
		error:function() {
			console.log("error");
		}
	});
}
function showQuestion() {
	if(validate('forgotPw')) {

		var username = $("#forgotPw #username").val();

		$.ajax({
			type:"POST",
			url: getScriptPath("login.js")+"/ajax/forgotpassword.php", 
			data: {
				user: username,
			},
			success:function(data) {
				var res = $.parseJSON(data);
				if(!res.error) {
					showForgotPwAnswer();
					$("#forgotPwAnswer  #question").html("Question: "+res.question);
					$("#forgotPwAnswer #forgetfuluser").val(username)
				}
				else {
					$("#forgotPw #message").html("<div class='alert alert-danger'>"+res.error+"!</div>");
				}
			},
			error:function() {
				console.log("error");
			}
		});
		
	}
}
function checkAnswer() {
	var username = $("#forgotPwAnswer #forgetfuluser").val();
	var answer = $("#forgotPwAnswer  #answer").val();
	var password = $("#forgotPwAnswer  #newpassword").val();
	var password2 = $("#forgotPwAnswer  #newpassword2").val();
	$.ajax({
		type:"POST",
		url: getScriptPath("login.js")+"/ajax/forgotpassword.php",
		data: {
				user: username,
				newpassword: password,
				newpassword2: password2,
				answer: answer
			},
		success:function(data) {
			var res = $.parseJSON(data);
			if(typeof res.success !== "undefined" && res.success == true) {
				// If the password was successfully changed then hide the box and close
				// the answer box. Our work here is done.
				showLogin();
				console.log("New password set!");
			} else {
				// If we failed to change the user's password then notify them of the
				// reason why.
				$("#forgotPwAnswer #message").html("<div class='alert alert-danger'>"+res.error+"!</div>");
				console.log("Failed to change password. " + res.error);
			}
		},
		error:function() {
			console.log("error");
		}
	});
}
function newPasswordAndQuestion() {
	if(validate('createPassword')) {

		var password1 = $("#createPassword  #password1").val();
		var password2 = $("#createPassword  #password2").val();
		var question = $("#createPassword  #question").val();
		var answer = $("#createPassword  #answer").val();

		$.ajax({
			type:"POST",
			url: getScriptPath("login.js")+"/ajax/newpassword.php",
			data: {
				password: password1,
				password2: password2,
				question: question,
				answer: answer
			},
			success:function(data) {
				var res = $.parseJSON(data);
				if(typeof res.success !== "undefined" && res.success == true) {
					// If we got a positive result on setting a new password and recover
					// question then we can close the box and reload the page.
					console.log("New password set and successfully logged in");
					page.show();
					createDeleteLogin();	
				} else {
					// Otherwise, tell the user that we couldn't update their password
					// and tell them why.
					$("#createPassword #message").html("<div class='alert alert-danger'>"+res.errormsg+"!</div>")
					console.log("Failed to set new password, " + res.errormsg);
				}
			},
			error:function() {
				console.log("error");
			}
		});	
	}
}
// LOGIN AJAX FUNCTIONS END //
// SHOW OR HIDE LOAD BAR FUNCTION START //
function addRemoveLoad(show) {
	if(show && $("header .load").length ==0) {

		$("header").append("<div class='load'></div>");
	}
	else if(!show) {
		$("header .load").fadeOut(300, function() { $(this).remove(); });
	}
	else {
		return true;		
	}
}
// SHOW OR HIDE LOAD BAR FUNCTION END //
