<?php
if (isset($_POST['action']) && $_POST['action'] == "register") {
	file_put_contents("pushhej.txt", json_encode($_POST['subscription']));
} else if (isset($_POST['action']) && $_POST['action'] == "send") {
	// Insert send code here
	echo "Message sent<br><pre>";
	$data = json_decode(file_get_contents('pushhej.txt'));

	$arrContextOptions = array(
		"ssl" => array(
			"verify_peer" => false,
			"verify_peer_name" => false
		),
		"http" => array(
			"method" => "POST"
		)
	);
	
	$response = file_get_contents($data->endpoint, false, stream_context_create($arrContextOptions));

	print_r($response);
} else {
	?>

<p>Send a message to the registered client</p>
<form action="pushnotifications.php" method="post">
	<input type="hidden" name="action" value="send">
	Message:<br>
	<input type="text" name=""><br><br>
	<input type="submit" value="Submit">
</form>

	<?php
}
?>