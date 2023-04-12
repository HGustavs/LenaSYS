<?php

	fetch("../Shared/dugga.js")
		.then(res => res.json())
		.then(json => console.log(json));
	
	//echo move_uploaded_file(
	//$_FILES["upfile"]["tmp_name"], 
	//"demo.txt"
	//) ? "OK" : "ERROR UPLOADING";

?>