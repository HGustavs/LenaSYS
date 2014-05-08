<?php session_start(); ?>

<?php if($_SESSION['user']) { ?>
	<script>
		$(function() {
			$( ".datepicker" ).datepicker({
				showButtonPanel: true
			});
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
	</script>
	<div id='create'>
		<form role='form'>
			<div class='form-group'>
				<label>Dugganame</label>
				<textarea class='form-control' rows='2'></textarea>
			</div>
			<div style='float:left' class='form-group'>
				<select class='form-control'>
					<option>Variant</option>
					<option>1</option>
					<option>2</option>
				</select>
			</div>
			<button style='float:left' onclick="showVariant()" type="button">+</button>
			<button style='float:right' type='submit' class='default'>Submit</button>

			<div class="variant1" style="display:none">
				<hr style='clear:both'>
				<div class='form-group'>
					<label>Question</label>
					<textarea class='form-control' rows='2'></textarea>
				</div>
				<div class='form-group'>
					<select class='form-control'>
						<option>Template</option>
						<option>Kryss</option>
						<option>Solsystem</option>
					</select>
				</div>
				<div class='form-group'>
					<label>Template parameters</label>
					<textarea class='form-control' rows='4'></textarea>
				</div>
				<div class='form-group'>
					<label>Answer</label>
						<div class="input-append">
		                    <div id="field"><input autocomplete="off" class='option form-control' id="field1" name="prof1" type="text" data-items="8"/><button id="b1" class="option add-more" type="button">+</button></div>
		                </div>
				</div>
				<div class='form-group'>
					<label>Releasedate</label>
					<input class='form-control datepicker'>
				</div>
				<div class='form-group'>
					<label>Deadline</label>
					<input class='form-control datepicker'>
				</div>
				<div class='form-group'>		
					<label>
						<input type='checkbox'> Activate
					</label>
				</div>
				<div class='form-group'>		
					<label>
						<input type='checkbox'> Autograde
					</label>
				</div>
			</div>
		</form>
	</div>
<?php }else {?>
	<script type="text/javascript">
		changeURL('noid');
	</script>
<?php } ?>