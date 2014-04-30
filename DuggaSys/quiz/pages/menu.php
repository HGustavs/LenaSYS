<?php session_start(); ?>

<div class='middle center'>
	<?php if($_SESSION['user']['permission'] == 2) { ?>
		<p>Admin Menu</p>
		<button class='default' onclick="changeURL('quiz');">Test</button>
		<button class='default' onclick="changeURL('edit');">Edit</button>
		<button class='default' onclick="changeURL('studentlist');">Studentlist</button>
	<?php } elseif($_SESSION['user']['permission'] == 1) {?>
		<button class='default' onclick="changeURL('quiz');">Start</button>
	<?php }else {?>
		<script type="text/javascript">
			changeURL('noid');
		</script>
	<?php } ?>
</div>