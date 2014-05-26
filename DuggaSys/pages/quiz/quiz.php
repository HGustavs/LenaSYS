<?php session_start(); ?>
<script>
	page.title("Quiz");
	setTimeout(function(){
		getQuiz(getUrlVars().quizid);
	}, 50);
</script>
<!-- Put ontent here -->
<div id="output"></div>