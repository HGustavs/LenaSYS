<?php session_start(); ?>
    <table id="contentlist" class="list">
        <tr>
            <th>Course name</th>
			<th>Course code</th>
            <th>Quiz name</th>
            <th>Submitted</th>
			<th>Deadline</th>
            <th>Grade</th>
        </tr>
    </table> 
	<script type="text/javascript" src="js/pagination.js"></script>
	<script type="text/javascript">page.title("My results");</script>
	<script type="test/javascript">
		pagination = new pagination();
		getResults(pagination);
		pagination.showContent();
	</script>