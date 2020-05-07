<div id="fullAnnnouncementOverlay">
	<div id="fullAnnouncement">
		<div>
			<?php

			$announcementid = $_GET['announcementid'];

			if(isset($announcementid)){
				echo "<script>showAnnouncement();</script>";
				foreach ($pdo->query('SELECT * FROM announcement WHERE id="'.$announcementid.'"') AS $headline){
					$headlines = $headline['title'];
					$message = $headline['message'];
					echo "<h3>".ucfirst(strtolower($headlines))."</h3>";
					echo "<p>".ucfirst(strtolower($message))."</p>";
					echo "<p><b>Posted on:</b><br>".$announceTime."</p>";

				}
			}

			?>

		</div>
	</div>
</div>
