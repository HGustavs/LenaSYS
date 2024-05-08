<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Installer Progress</title>
</head>
<body>
	<h1>Installation Progress</h1>
	<div>
		Progress: <span id="progressPercentage">0%</span>
	</div>
	<progress id="progressBar" value="0" max="100"></progress>
	<div style="height: 200px; overflow: scroll;">
		<span id="progress"></span>
	</div>

	<script src="tools/sse_receiver.js"></script>
	<script>
		let progressInfo = document.getElementById("progress");
		let progressPercentage = document.getElementById("progressPercentage");
		let progressBar = document.getElementById("progressBar");
		const getCurrentValue = () => parseInt(progressBar.value);
		let progressBarLocked = false;

		fetch('installer.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: 'installation_settings=' + encodeURIComponent(JSON.stringify({ 
				verbose: 'false',
				overwrite_db: 'true', 
				overwrite_user: 'true',
				add_test_data: 'true',
				add_demo_course: 'true',
				add_test_course_data: 'true',
				language_support: ["html", "java", "php", "plain", "sql", "sr"],
				starting_step: "",
			}))
		});

		let sseReceiver = new SSEReceiver({
			message: function(data) {
				progressInfo.innerHTML = data + "<br>" + progressInfo.innerHTML;
			},
			updateProgress: function(data) {
				let targetValue = parseInt(data);
				let distance = Math.abs(targetValue - getCurrentValue());
				let speedFactor = Math.max(4, distance / 100);
				let increment = (targetValue - getCurrentValue()) / (100 * speedFactor);
				progressBarLocked = false;

				if (targetValue === 100) {
					progressBar.value = 100;
					progressPercentage.innerHTML = "100%";
				}

				function update() {
					if ((increment > 0 && getCurrentValue() < targetValue) && !(getCurrentValue() > targetValue) && !progressBarLocked) {
						progressBar.value += increment;
						progressPercentage.innerHTML = Math.round(progressBar.value) + "%";
						requestAnimationFrame(update);
					}
				}
				
				update();
			},
			error:function(data) {
				progressBarLocked = true;
			}
		});
	</script>
</body>
</html>