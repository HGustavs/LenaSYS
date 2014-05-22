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
            <th>Go to</th>
        </tr>
    </table>
<script type="text/javascript" src="js/paginationStudentlist.js"></script>
<script type="text/javascript">page.title("Student list");</script>
<script type="test/javascript">
	pagination = new pagination();
	getResults(pagination);
	pagination.showContent();
</script>