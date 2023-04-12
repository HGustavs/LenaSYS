<?php
	
	async function logJSONData() {
	  const response = await fetch("../Shared/dugga.js");
	  const jsonData = await response.json();
	  console.log(jsonData);
	}


	fetch("../Shared/dugga.js")
		.then(res => res.json())
		.then(json => console.log(json));
	
	//echo move_uploaded_file(
	//$_FILES["upfile"]["tmp_name"], 
	//"demo.txt"
	//) ? "OK" : "ERROR UPLOADING";

?>