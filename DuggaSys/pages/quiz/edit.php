<?php session_start(); ?>

<script>
	var qs=getUrlVars();
	console.log(qs);
	var submitArray = new Array(qs.courseid, 'edit', qs.quizid);
	//editQuiz(qs.courseid, 'edit', qs.quizid)
</script>
	
	<div id='create'>
		<form id="newQuizForm" name="newQuizForm" role='form'>
			<div class='form-group'>
				<!--<label>Dugganame *</label>
				<input type="text" class='form-control' name="quizname" id="quizname" />
				-->
				<div id="quizParameters" class='form-group'>
				<div class='form-group'>
					<label>Template parameters, saves as string (max 2000 characters)</label>
					<textarea class='form-control' name="parameterinput" rows='5' id="parameterinput"></textarea>
				</div>
				<div class='form-group'>
					<label id="quizAnswerInputLabel">Answer, saves as string (max 2000 characters)</label>
                    <input class='option form-control' id="quizAnswerInput" name="answerinput" type="text" />
				</div>
				<div class='form-group'>		
					<label>
						<input name="autogradebox" type='checkbox' value="1" id="autogradecheck" /> Autograde
					</label>
				</div>
				<div class='form-group'>
					<label>Grade system * 
						<select name="gradesysselect" id="gradeSysSelect" class='form-control'>
							<option value="-1">Select</option>
							<option value="1">U-G</option>
							<option value="2">U-G-VG</option>
							<option value="3">3-5</option>
						</select>
					</label>
				</div>
				<div class='form-group'>
					<label>Quiz file 
						<select name="quizfile" id="quizfile" class='form-control'>
							<option value="-1">Select</option>

						</select>
					</label>
				</div>
				<div class='form-group'>
					<label>Releasedate</label>
					<input name="releasedateinput" id="releasedateinput" type="text" class='form-control datetimepicker' />
				</div>
				<div class='form-group'>
					<label>Deadline</label>
					<input name="deadlineinput" id="deadlineinput" type="text" class='form-control datetimepicker' />
				</div>
				<div class='form-group'>		
					<label>
						<input name="acivateonsubmitbox" id="acivateonsubmitbox" type='checkbox' value="1"> Activate on submit
					</label>
				</div>
				
			</div>
			<button type="button" onclick="successBox('Edit quiz', 'Are you sure you want to edit quiz', '', editQuiz, submitArray)" class='default'>Submit</button>
			
			<button type="button" onclick="historyBack()" class='default-red'>Cancel</button>
		</form>
	</div>

<link rel="stylesheet" type="text/css" href="css/jquery.datetimepicker.css"/ >
<script src="js/ajax.js"></script>
<script type="text/javascript" src="js/verificationFunctions.js"></script>
<script type="text/javascript">page.title("Edit quiz");</script>
<!--<script src="js/jquery.js"></script>-->
<script src="js/jquery.datetimepicker.js"></script>
<script type="text/javascript">
	$('.datetimepicker').datetimepicker();
	getQuizFiles();
	getQuizData(qs.quizid);
	$("#autogradecheck").change(function () {
		if ($('#autogradecheck').prop('checked')) {
			$("#quizAnswerInputLabel").html("Answer, saves as string (max 2000 characters) *");
		} else {
			$("#quizAnswerInputLabel").html("Answer, saves as string (max 2000 characters)");
		};
	})

	
</script>

