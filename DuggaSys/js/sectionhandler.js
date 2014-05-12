(function($) {
	var disabled = {'background-color': '#ddd'};
	var enabled = {'background-color': '#fff'};

	$("#typeselect").on("change", function() {
		var type = $(this).val();

		if(type == 0 || type == 1 || type == 2 || type == 3) {
			$("#linklabel input").prop("disabled", true).css(disabled);
		} else if(type == "4") {
			$("#linklabel input").removeAttr("disabled").css(enabled)
		}
	});
})(jQuery);

function submitNewSection() {
	var qs = getUrlVars();

	var courseid = qs.courseid;
	var sectionname = $("#create input[name=sectionname]").val();
	var link = $("#create #linklabel input").val();
	var type = $("#create #typeselect").val();
	var visibility = $("#create select[name=visib]").val();

	$.ajax({
		dataType: 'json',
		url: 'SectionedService.php',
		method: 'post',
		data: {
			'courseid': courseid,
			'opt': 'sectionNew',
			'sectname': sectionname,
			'link': link,
			'kind': type,
			'visibility': visibility ? 1 : 0
		},
		success: function() {
			alert('Yay')
			changeURL('sectioned?courseid=' + courseid);
		}
	});
}
