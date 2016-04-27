$("#mouseLoggingON").onclick({
	$.ajax({
		url: 'optionservice.php',
		type: 'POST',
		dataType: 'json',
		data: {
			option: "mousemoveLogging" ,
			value: "true"
		},
		success: function(data) {
			alert("HELLO");
		}
	});
});