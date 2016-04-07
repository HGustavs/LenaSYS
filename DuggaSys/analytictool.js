$(function() {
	$.ajax({
		url: 'analytictoolservice.php',
		type: 'POST',
		dataType: 'json',
		data: {query: 'generalStats'},
		success: function(data) {
			$('#content').append(data.loginFails);
		}
	});
});