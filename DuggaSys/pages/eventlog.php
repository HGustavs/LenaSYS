<?php
include_once(dirname(__FILE__). "/../../../coursesyspw.php");	
include_once(dirname(__FILE__) . "/../../Shared/basic.php");
pdoConnect();
session_start();

if(checklogin() && isSuperUser($_SESSION['uid'])) {
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<script type="text/javascript" src="js/duggasys.js"></script>
	</head>
<body>

    <table id="contentlist" class="list">
        <tr>
            <th>Type</th>
			<th>Date</th>
            <th>IP-address</th>
            <th>UserID</th>
			<th>Eventtext</th>
        </tr>
	<script type="text/javascript">page.title("Eventlog");</script>

	<?php
	              foreach($pdo->query( "SELECT type,ts,address,username,eventtext FROM eventlog LEFT JOIN user U ON U.uid = user" ) as $row){
				    echo "<tr><td>".$row['type']."</td>";
				    echo "<td>".$row['ts']."</td>";
				    echo "<td>".$row['address']."</td>";
				    echo "<td>".$row['username']."</td>";
				    echo "<td>".$row['eventtext']."</td></tr>";
				}
}
	?>
    </table> 

</body>
</html>
