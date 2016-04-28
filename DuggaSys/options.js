$(function() {
	$("#mouseLoggingON").click(function() {
		setOption("mouseMoveLogging", "1");
	});

	$("#mouseLoggingOFF").click(function() {
		setOption("mouseMoveLogging", "0");
	});

	$("#FRLoggingON").click(function() {
		setOption("fourthRound", "1");
	});

	$("#FRLoggingOFF").click(function() {
		setOption("fourthRound", "0");
	});
});

function setOption(label, value) {
	$.ajax({
		url: "optionservice.php",
		type: "POST",
		dataType: "json",
		data: {
			label: label,
			value: value
		},
		success: function(data) {
			alert("success: " + data.success);
		}
	});
}