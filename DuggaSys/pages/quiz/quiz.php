<?php session_start(); ?>
<script>
	page.title();
	window.onbeforeunload = function() {
		localStorage.setItem("quizLoad", $("#output").html());
	    return 'You have unsaved changes!';
	}
	if(localStorage.quizLoad) {
		$("#output").html(localStorage.quizLoad);
		delete localStorage.quizLoad;
	}
</script>
<!-- Put ontent here -->
<div id="output"></div>
