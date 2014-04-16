// This JS file is only for the startpage courselist.php
function setupLogin()
{
	$(document).ready(function() {
		$("#loginform").on("submit", function(event) {
			event.preventDefault();
			var data = $(this).serialize();
			$.post("login.php", data, function(data) {
				var res = $.parseJSON(data);
				if(res.login == "success") {
					alert("Successfully logged in");
					closeloginbox();
				} else {
					alert("Failed to log in ");
				}
			})
		});
	});
}

//function for showin the login-box
function loginbox(){
	$("#bg").css({'background': 'rgba(0, 0, 0, 0.5)', 'position': 'absolute', 'top': '0'});
	$("#login-box").css({'left': (($(document).width()/2) - $("#login-box").width()/2)});
  	$("#login-box").toggle();
	$("#bg").toggle();
}
function closeloginbox(){
	$("#login-box").hide();
	$("#bg").toggle();
}
