<?php session_start(); ?>
<script src="js/ajax.js">


page.title("Quiz menu");

</script>
<div class='middle center'>
	<p id="admin_title"></p>
	<button class='default' onclick="changeURL('quiz/quiz?quizid='+getUrlVars().quizid);">Test</button>
	<button class='default' onclick="changeURL('quiz/edit?courseid=' + qs.courseid + '&quizid='+qs.quizid);">Edit</button>
	<button class='default' onclick="changeURL('quiz/studentlist?courseid=' + qs.courseid + '&quizid=' + qs.quizid);">Studentlist</button>
</div>
<script type="text/javascript">
	var qs = getUrlVars();
	getQuizNameForHeader(qs.quizid);
</script>