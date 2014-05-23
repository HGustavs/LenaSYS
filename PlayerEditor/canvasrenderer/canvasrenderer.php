<?php
	if(isset($_GET['lib'])) {
	
		$lib = $_GET['lib'];
	
		require_once("../../Shared/coursesyspw.php");
		require_once("../../Shared/database.php");
		
		pdoConnect();
		
		$stmt = $pdo->prepare("SELECT path FROM playereditor_playbacks WHERE id = :id AND type=0 LIMIT 1");
		$stmt->bindParam(":id", $lib, PDO::PARAM_STR);
		
		$stmt->execute();
		
		$result = $stmt->fetch();
		
		$xmlpath = $result["path"];
		
	}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Untitled Document</title>
<link rel="stylesheet" type="text/css" href="design.css">
<script src="js/canvasrenderer.js"></script>
<script language="javascript" src="../js/jquery-1.11.0.min.js"></script>
<script>

function executeTimestep(nodes)
{
	canvas.executeTimestep(nodes);
}

function canvasSize()
{
		canvas.canvasSize(window.innerWidth - 20, window.innerHeight - 75);
}

</script>

</head>

<body>
	<canvas id="Canvas" style="border:1px solid #000"></canvas>
 	<script>
    var c = document.getElementById('Canvas');
	var ctx = c.getContext("2d");
	var canvas = new Canvasrenderer();
<?php
	// Load XML
	if(isset($xmlpath)) {
		echo "this.canvas.loadXML('".$xmlpath."');";
	}
	else {
		echo "this.canvas.loadXML('canvas.xml');";
	}
?>
    </script>
    <div id="wrapper">
    	<div id="bardesign">
   
 
    	<table>
				<tr>
					<td onclick="canvas.switch();" id="play" class="barbutton"><img src="images/play_button.svg"/></td>
					<td width="400" height="38"><div id="barcontainer" class="barcontainer" onclick="canvas.search(event)"><span class="bar" id="bar">&nbsp;</span>&nbsp;</div></td>					
					<td onclick="canvas.skip(-1)" id="back" class="barbutton"><img src="images/backward_button.svg"/></td>					
					<td onclick="canvas.skip(1);" id="forward" class="barbutton"><img src="images/forward_button.svg"/></td>					
					<td onclick="canvas.toggleRepeat();" id="repeat" class="barbutton"><img src="images/replay_button.svg"/></td>
				</tr>
		</table>
        

</div>
</div>
</div>
    
</body>

</html>
