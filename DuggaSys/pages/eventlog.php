<?php
include_once(dirname(__FILE__) . "/../../Shared/constants.php");
include_once(dirname(__FILE__) . "/../../../coursesyspw.php");
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
	<label>Minimum severity level:
		<select id="severityfilter">
			<option value="notice">Notice</option>
			<option value="warning">Warning</option>
			<option value="loginerr">Login error</option>
			<option value="fatal">Fatal</option>
		</select>
	</label>
	<table id="contentlist" class="list">
		<tr>
			<th>Type</th>
			<th>Date</th>
			<th>IP Address</th>
			<th>User</th>
			<th>Event Description</th>
		</tr>

<?php

	$querystring = "SELECT type,ts,address,username,eventtext FROM eventlog LEFT JOIN user ON user.uid = eventlog.user";
	if(array_key_exists('severity', $_POST)) {
		$severity = $_POST['severity'];
		if($severity == "loginerr") {
			$index = EVENT_LOGINERR;
		} else if($severity == "notice") {
			$index = EVENT_NOTICE;
		} else if($severity == "warning") {
			$index = EVENT_WARNING;
		} else if($severity == "fatal") {
			$index = EVENT_FATAL;
		}

		$querystring .= " WHERE type >= :severity ORDER BY ts DESC LIMIT 100";

		$logquery = $pdo->prepare($querystring);
		$logquery->bindParam(':severity', $index, PDO::PARAM_INT);
	} else {
		$logquery = $pdo->prepare("SELECT type,ts,address,username,eventtext FROM eventlog LEFT JOIN user ON user.uid = eventlog.user ORDER BY ts DESC LIMIT 100");
	}

	$logquery->execute();
	$count = $logquery->rowCount();

	if($count > 0) {
	foreach($logquery->fetchAll(PDO::FETCH_ASSOC) as $row){
		echo "<tr><td>". loglevelToString($row['type']) ."</td>";
		echo "<td>".$row['ts']."</td>";
		echo "<td>".$row['address']."</td>";
		echo "<td>".$row['username']."</td>";
		echo "<td>".$row['eventtext']."</td></tr>";
	}
	} else {
		echo '<tr><td>No data available</td></tr>';
	}
}
?>
	</table> 
	<script type="text/javascript">
	page.title("Event log");
	var qs = getUrlVars();
	if(qs.severity) {
		$("#severityfilter").val(qs.severity);
	}
	$("#severityfilter").on('change', function() {
		if(qs.severity != $(this).val()) {
			changeURL('eventlog?severity=' + $(this).val());
		}
	});
	</script>

</body>
</html>
