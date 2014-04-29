<?php session_start(); ?>
<div class='alert alert-danger'>
    <strong>Oh snap!</strong>
    <p>Dead end, please go back and come back with some ID.</p>
</div>

<?php if(isset($_SESSION['user']['permission']) && ($_SESSION['user']['permission'] < 3)) {?>
	<script type="text/javascript">
		changeURL('menu');
	</script>
<?php } ?>