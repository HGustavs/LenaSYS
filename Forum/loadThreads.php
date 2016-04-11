<?PHP
			include '../Shared/database.php';
			
			$course=getpostAJAX("course");

			try{
				// Set up query string
				$querystring="SELECT * FROM thread,course WHERE thread.threadID=:course;";
				$stmt = $pdo->prepare($querystring);
				$stmt->bindParam(':course',$course);
				$stmt->execute();
	
				foreach($stmt as $key => $row){
						$test = "bajs";								
				}				
					$output.="</bookings>\n";
			} catch (PDOException $e) {
					err("Error!: ".$e->getMessage()."<br/>");
					die();
			}
			header ("Content-Type:text/xml; charset=utf-8"); 
			echo $test;
?>
