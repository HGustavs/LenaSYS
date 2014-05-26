<?php session_start(); ?>

<script>
	window.onload = function() {
		
	}
	/*
	function toggleanswer() {
		if ($("#quizAnswerInput").attr("disabled")) {
		    $("#quizAnswerInput").removeAttr("disabled");
		    $("#quizAnswerInput").removeClass("disabledInput");

		} else {
		    $("#quizAnswerInput").attr("disabled", "disabled");
		    $("#quizAnswerInput").removeClass("disabledInput").addClass("disabledInput");
		}
	}
	
	$(function() {
		
	    var next = 1;
	    
	    $(".add-more").click(function(e){
	        e.preventDefault();
	        var addto = "#field" + next;
	        var addRemove = "#field" + (next);
	        next = next + 1;
	        var newIn = '<input autocomplete="off" class="option form-control" id="field' + next + '" name="field' + next + '" type="text">';
	        var newInput = $(newIn);
	        var removeBtn = '<button id="remove' + (next - 1) + '" class="option remove-me" >-</button></div><div id="field">';
	        var removeButton = $(removeBtn);
	        $(addto).after(newInput);
	        $(addRemove).after(removeButton);
	        $("#field" + next).attr('data-source',$(addto).attr('data-source'));
	        $("#count").val(next);  
	        
	            $('.remove-me').click(function(e){
	                e.preventDefault();
	                var fieldNum = this.id.charAt(this.id.length-1);
	                var fieldID = "#field" + fieldNum;
	                $(this).remove();
	                $(fieldID).remove();
	            });
	    });
		
	});
	function showVariant() {
		$(".variant1").css('display','block');
	}
	*/
</script>
	
	<div id='create'>
		<form id="newQuizForm" name="newQuizForm" role='form'>
			<div class='form-group'>
				<label>Dugganame *</label>
				<input type="text" class='form-control' name="quizname" />
				<!--<div class='form-group'>
					<label>Template parameters, saves as string (max 2000 characters)</label>
					<textarea class='form-control' name="parameterinput" rows='5'></textarea>
				</div>-->
				<div class='form-group'>
					<label>Answer</label>
                    <input class='option form-control' id="quizAnswerInput" name="answerinput" type="text" />
				</div>
				<div class='form-group'>		
					<label>
						<input name="autogradebox" type='checkbox' value="1" /> Autograde
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
					<input name="releasedateinput" type="text" class='form-control datetimepicker' />
				</div>
				<div class='form-group'>
					<label>Deadline</label>
					<input name="deadlineinput" type="text" class='form-control datetimepicker' />
				</div>
				<div class='form-group'>		
					<label>
						<input name="acivateonsubmitbox" type='checkbox' value="1"> Activate on submit
					</label>
				</div>
				
			</div>
			<button type="button" onclick="submitNewQuiz('courseID', 'edit')" class='default'>Submit</button>
		</form>
	</div>

<link rel="stylesheet" type="text/css" href="css/jquery.datetimepicker.css"/ >
<script src="js/ajax.js"></script>
<script type="text/javascript" src="js/verificationFunctions.js"></script>
<script type="text/javascript">page.title("Create new quiz");</script>
<script src="js/jquery.datetimepicker.js"></script>
<script type="text/javascript">
	$('.datetimepicker').datetimepicker();
	getQuizFiles();
	createDefaultQuiz("cid");
</script>

