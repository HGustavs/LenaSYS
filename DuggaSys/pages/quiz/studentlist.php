<?php session_start(); ?>
    <table id="contentlist" class="list">
        <tr>
            <th>Student ID</th>
            <th>Dugga name</th>
            <th>Start</th>
            <th>Deadline</th>
            <th>Submitted</th>
            <th>Grade</th>
            <th>Answer</th>
			<th>Correct answer</th>
            <th>Go to</th>
        </tr>
    </table>
	<div style="overflow: hidden;">
	<input type="text" id="searchbox" name="search" placeholder="Search by username" style='float:right; width: 10%;'>
	</div>
<script type="text/javascript" src="js/paginationStudentlist.js"></script>
<script type="text/javascript">page.title("Student list");</script>
<script type="test/javascript">
	var course = <?php echo ($_POST['courseid'] ? $_POST['courseid'] : 'null'); ?>;
	var quiz = <?php echo ($_POST['quizid'] ? $_POST['quizid'] : 'null'); ?>;
	pagination = new pagination();
	getResults(pagination, course, quiz);
	pagination.showContent();
	
	$("#searchbox").on("propertychange change keyup paste input", function(){
		pagination.clearRows();
		if ($("#searchbox").val().length > 0) {
			pagination.showContent($("#searchbox").val());
			pagination.renderPages($("#searchbox").val());
			pagination.calculatePages($("#searchbox").val());
		} else {
			pagination.showContent();
			pagination.renderPages();
			pagination.calculatePages();
		}
	});
</script>
