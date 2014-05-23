<?php session_start(); ?>
<script>
	page.title();
	setTimeout(function(){
		getQuiz(getUrlVars().quizid);
	}, 10);
</script>
<!-- Put ontent here -->
<div id="output"></div>