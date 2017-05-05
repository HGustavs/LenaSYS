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