function setProgressBarWidth(width) {
	progressBar = document.querySelector('.progressBarIndicator');
	progressNumber = document.querySelector('#installationPage div.progressBarLabels label:nth-child(2)');
	progressNumber.innerHTML = parseInt(width) + "%";
	progressBar.style.width = width + "%";
}

function getProgressBarWidth() {
	progressBar = document.querySelector('.progressBarIndicator');
	let width = progressBar.style.width;
	return parseFloat(width.replace('%', '')) || 0;
}

function incrementProgressBarWidth(increment) {
	let newWidth = getProgressBarWidth() + increment;
	setProgressBarWidth(newWidth);
}

function setProgressBarInfo(text) {
	progressInfo = document.querySelector('#installationPage div.progressBarLabels label:nth-child(1)');
	progressInfo.innerHTML = text;
}