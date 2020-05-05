<div id="fullAnnouncement" style="display: none;">
	<div>				
	<?php

		$announcementid = $_GET['announcementid'];

		if(isset($announcementid)){
			echo "<script>showAnnouncement();</script>";
			foreach ($pdo->query('SELECT * FROM announcement WHERE id LIKE "%'.$announcementid.'%"') AS $headline){
	         $headlines = $headline['title'];
	         $message = $headline['message'];
	         echo "<h3>".ucfirst(strtolower($headlines))."</h3>";
	         echo "<p>".ucfirst(strtolower($message))."</p>";

	       }    
		}


	?>

	</div>
</div>
