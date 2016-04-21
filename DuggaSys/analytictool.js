$(function() {
	loadAnalytics("generalStats");
});

function loadAnalytics(q) {
	$.ajax({
		url: 'analytictoolservice.php',
		type: 'POST',
		dataType: 'json',
		data: {query: q},
		success: function(data) {
			$('#analytic-data').empty();
			$('#analytic-data').append('<pre>' + JSON.stringify(data, null, 4));
		}
	});
}