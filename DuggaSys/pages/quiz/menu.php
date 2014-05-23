<?php session_start(); ?>
<script>
var qs = getUrlVars();
</script>
<div class='middle center'>
	<p>Admin Menu</p>
	<button class='default' onclick="changeURL('quiz/quiz?quizid='+getUrlVars().quizid);">Test</button>
	<button class='default' onclick="changeURL('quiz/edit?courseid=' + qs.courseid + '&quizid='+qs.quizid);">Edit</button>
	<button class='default' onclick="changeURL('quiz/studentlist?courseid=' + qs.courseid);">Studentlist</button>
</div>
