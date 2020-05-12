<div id="fullAnnouncement" style="display: none;">
	<div>				
		<?php

		$announcementid = $_GET['announcementid'];
		
		if(isset($announcementid)){
			echo "<script>showAnnouncement();</script>";
			foreach ($pdo->query('SELECT * FROM announcement WHERE id LIKE "%'.$announcementid.'%"') AS $headline){
				$headlines = $headline['title'];
				$message = $headline['message'];
				$author = $headline['author'];
				echo "<p title='Author'><i class='fa fa-user'></i>".$author."</p>";
				echo "<h3 title='Title'>".ucfirst(strtolower($headlines))."</h3>";
				echo "<p title='Message'>".ucfirst(strtolower($message))."</p>";

			}    
		}

		?>

	</div>
</div>
