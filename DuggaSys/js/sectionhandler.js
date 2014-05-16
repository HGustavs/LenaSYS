(function($) {
	var disabled = {'background-color': '#ddd'};
	var enabled = {'background-color': '#fff'};

	$("#typeselect").on("change", function() {
		$('#testdugga').find('option').remove();
		var selectOption = document.createElement('option');
		selectOption.value = "-1";
		selectOption.innerHTML = "New";
		$("#testdugga").append(selectOption);
		var type = $(this).val();

		if(type == 0 || type == 1 || type == 2 || type == 3) {
			$('#linklabel input').val('');
			$("#linklabel input").prop("disabled", true).css(disabled);
		} else if(type == "4") {
			$("#linklabel input").removeAttr("disabled").css(enabled);
		}
		
		if (type == 0 || type == 1 ||type == 4) {
			$("#testdugga").prop("disabled", true).css(disabled);
		} else if (type == 2 || type == 3) {
			$("#testdugga").removeAttr("disabled").css(enabled);
			var qs = getUrlVars();
			var courseid = qs.courseid;
			if (type == 2) {
				var opt = "example";
			} else {
				var opt = "test";
			}
			$.ajax({
				dataType: 'json',
				url: 'ajax/testduggaService.php',
				method: 'post',
				data: {
					'courseid': courseid,
					'opt': opt
				},
				success: function(data) {
					for (i=0; i<data['entries'].length; i++) {
						var option = document.createElement('option');
						option.value = data['entries'][i]['id'];
						option.innerHTML = data['entries'][i]['name'];
						$("#testdugga").append(option);
					}
				}
			});
		}
	});
})(jQuery);

function submitNewSection() {
	if (validateNewSectionSubmit()) {
	
		// Redirect user to new test form if test?
		var qs = getUrlVars();
		var courseid = qs.courseid;
		var sectionname = $("#create input[name=sectionname]").val();
		var link = $("#create #linklabel input").val();
		var testdugga = $("#create #testdugga").val();
		var type = $("#create #typeselect").val();
		var visibility = $("#create select[name=visib]").val();

		$.ajax({
			dataType: 'json',
			url: 'ajax/SectionedService.php',
			method: 'post',
			data: {
				'courseid': courseid,
				'opt': 'sectionNew',
				'sectname': sectionname,
				'link': link,
				'testdugga': testdugga,
				'kind': type,
				'visibility': visibility == 1 ? 1 : 0
			},
			success: function() {
				changeURL('sectioned?courseid=' + courseid);
			}
		});
	}
}
