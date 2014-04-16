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
  	$("#login-box").toggle();
}
function closeloginbox(){
	$("#login-box").hide();
}
