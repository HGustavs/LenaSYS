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
	// TODO: Write submit code for the section form
}
