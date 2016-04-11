<?php
	require_once(dirname(__FILE__) . '/../Shared/database.php');
	global $pdo;
	
	if($pdo == null)
	{
		pdoConnect();
	}
	
	echo "<table style='width: 100%; table-layout: fixed;'>";
	$query = $pdo->prepare("SELECT distinct coursename,cid FROM course WHERE visibility=1");
	if($query->execute() && $query->rowCount() > 0)
	{
		for($i=1; $i<(($query->rowCount())+1); $i++)
		{
			$course = $query->fetch();
			if($i%2==0)
			{
				echo "<tr class='lo' style='height: 32px;'>";
					echo "<td class='example item' style='cursor:pointer;margin-left:15px;'>";
						echo "<a onclick='getThreads(".$course["cid"].");' style='cursor:pointer;margin-left:15px;'>".$course["coursename"]."</a>";
					echo "</td>";
				echo "</tr>";
			}
			else{
				echo "<tr class='hi' style='height: 32px;'>";
					echo "<td class='example item' style='cursor:pointer;margin-left:15px;'>";
						echo "<a onclick='getThreads(".$course["cid"].");' style='cursor:pointer;margin-left:15px;'>".$course["coursename"]."</a>";
					echo "</td>";
				echo "</tr>";
			}				
		}
	}
	else 
	{

	}
	echo "</table>";
	
	function loadComments($courseID)
	{
		require_once(dirname(__FILE__) . '/../Shared/database.php');
		global $pdo;
		$course=$courseID;
		if($pdo == null)
		{
			pdoConnect();
		}
		
		$array=array();
		
		$query = $pdo->prepare("SELECT threadComment.* FROM threadComment,thread WHERE threadComment.threadID=thread.threadID and thread.courseID=:course;");
		$query->bindParam(':course', $course);
		
		if($query->execute() && $query->rowCount() > 0)
		{
			$result = $query->fetchAll();
			$json=json_encode($result);
			echo $json;


		}
		else{
			echo "No results";
		}
		
		
	}
	loadComments(1);
?>