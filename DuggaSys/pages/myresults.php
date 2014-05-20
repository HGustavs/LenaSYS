<?php session_start(); ?>
    <table id="contentlist" class="list">
        <tr>
            <th>Course name</th>
			<th>Course code</th>
            <th>Quiz name</th>
            <th>Submitted</th>
            <th>Grade</th>
        </tr>
    </table>
	<div id='previous' style="display:inline-block; onClick='pagination.previous()'">Previous</div>
	<div id='next' style="display:inline-block; onClick='pagination.next()'">Next</div> 
	<script type="text/javascript" src="js/pagination.js"></script>
	<script type="text/javascript">page.title("My results");</script>
