<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Installer Progress</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
	<link rel="stylesheet" type="text/css" href="style.css">
	<?php include 'tools/components.php'; ?>
	<script defer src="installer_ui.js"></script>
	<script defer src="tools/components.js"></script>
	<script defer src="tools/sse_receiver.js"></script>
</head>
<body>
	<!-- <h1>Installation Progress</h1>
	<div>
		Progress: <span id="progressPercentage">0%</span>
	</div>
	<progress id="progressBar" value="0" max="100"></progress>
	<div style="height: 200px; overflow: scroll;">
		<span id="progress"></span>
	</div> -->

	<div id="page1" class="page">
		<div class="banner">
            <h1 class="header-1">Welcome to <b>LenaSYS</b> </h1>
        </div>
		<div class="wrapper">
			<?php
                breadcrumb()
            ?>
			<div class="content">
				<?php
					header2("Select your OS installer");
				?>
				<div class="inner-wrapper">
                	<?php
						echo "<div class='grid-element-span'>";
							checkBox("windows-installer","Windows installer");
							checkBox("mac-linux-installer","Linux & Mac installer");
						echo "</div>";
                	?>
            	</div>
			</div>
			<?php
				button("Back", "Continue");
			?>
		</div>
	</div>

	<div id="page2" class="page">
		<h1>hej</h1>
	</div>

	<div id="page3" class="page">

	</div>

	<div id="page4" class="page">

	</div>

	<div id="page5" class="page">

	</div>

</body>
</html>