<?php session_start(); ?>

<?php if($_SESSION['user']['permission'] < 3) { ?>
	<div>
		<h2>Vem är den bästa fotbollsspelaren?</h2>
	<form>
		<input type="checkbox" name="vehicle" value="1">Zlatan<br>
		<input type="checkbox" name="vehicle" value="2">Hysen<br>
		<input type="checkbox" name="vehicle" value="3">Aslan<br>
		<input type="checkbox" name="vehicle" value="4">Åstrand<br><br>
		<button type='submit' class='default'>Submit</button>
	</form>
	</div>
<?php }else {?>
	<script type="text/javascript">
		changeURL('noid');
	</script>
<?php } ?>