class SSEReceiver {
	constructor(callbacks) {
		this.callbacks = callbacks;
		this.source = new EventSource('installer.php?stream=true');
		this.source.onmessage = this.handleMessage.bind(this);
		this.source.onerror = this.handleError.bind(this);
	}

	/**
	 * function handleMessage
	 * Handle message / event received from SSE
	 * Executes corresponding callbacks
	 */
	handleMessage(event) {
		let data = JSON.parse(event.data);
		if (!data.success) {
			if (this.callbacks.error) {
				this.callbacks.error(data);
			}
			return;
		}

		switch (data.event) {
			case "message":
				if (this.callbacks.message) {
					this.callbacks.message(data.data);
				}
				break;
			case "updateProgress":
				if (this.callbacks.updateProgress) {
					this.callbacks.updateProgress(data.data);
				}
				break;
		}
	}

	/**
	 * Handle errors.
	 */
	handleError() {
		console.log("Failed to connect to server or connection closed.");
		let downloadbutton=document.getElementById("downloadButton");
		downloadbutton.classList.remove('disabledDownloadButton');
		downloadbutton.classList.add('downloadButton');
		downloadbutton.href="instalationLogLenaSYS.txt"
		this.source.close();
	}
}