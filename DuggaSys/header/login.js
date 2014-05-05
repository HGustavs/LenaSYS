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
	$("#login").removeClass("hide");
	$("#forgotPwAnswer").addClass("hide");
	$("#forgotPw").addClass("hide");
}
function showForgontPw() {
	$("#login").addClass("hide");
	$("#forgotPwAnswer").addClass("hide");
	$("#forgotPw").removeClass("hide");
}
function showForgotPwAnswer(valid) {
	if(valid) {
		$("#forgotPwAnswer").removeClass("hide");
		$("#forgotPw").addClass("hide");
		$("#login").addClass("hide");
	}
}
// CREATE AND SHOW/HIDE LOGINBOX FUNCTIONS END //

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

function makeLogin() {
	if(validate('login')) {
		console.log("Logging in...");
		$.ajax({
			url: getScriptPath("login.js")+"/ajax/login.php",
			async: false,  
			success:function(data) {
				if(data == "success") {
					createDeleteLogin()
					console.log("Loged in");
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