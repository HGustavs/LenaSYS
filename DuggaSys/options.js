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

	$('.switch').change(function(){
		$(this).toggleClass('checked');
	});

	$('.switch').click(function(e) {
		var that = $(this);
		e.preventDefault();
		setOption($(this).attr('data-label'), $(this).hasClass('checked') ? '0' : '1', function(data) {
			if (data.success) {
				that.find('input').prop('checked');
				that.find('input').change();
			}
		});
	});
});

function setOption(label, value, cb) {
	$.ajax({
		url: "optionservice.php",
		type: "POST",
		dataType: "json",
		data: {
			label: label,
			value: value
		},
		success: function(data) {
			cb(data);
			
			var value2;
			
			if(value == 1){
				value2 = "true";
			}else if(value == 0){
				value2 = "false";
			}else{
				value2 = value;
			}
			
			$("#theDiv").html("<div id='toastBar'>Successfully set the"+ label +" option to "+ value2 +"<a onclick='closeToast();'>X</a></div>");
			
		}
	});
}

function closeToast(){
	$("#theDiv").html();
}