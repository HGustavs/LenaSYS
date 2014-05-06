<?php session_start(); ?>

<?php if($_SESSION['user']['permission'] == 2) { ?>
	<div id='create'>
		<form role='form'>
			<div class='form-group'>
				<label>Dugganame</label>
				<input type="text" name="coursename" class="form-control" />
			</div>
			<div style='' class='form-group'>
				<label>Open if accessible to the public. Closed if only accessible by course-registered users</label>
				<select class='form-control'>
					<option>Open</option>
					<option>Closed</option>
				</select>
			</div>
			<div class="variant1" style="">
				<div class='form-group'>
					<label>Open if accessible to the public. Closed if only accessible by course-registered users</label>
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