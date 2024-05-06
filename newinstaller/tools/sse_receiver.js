class SSEReceiver {
    constructor(callbacks) {
        this.callbacks = callbacks;
        this.source = new EventSource('installer.php?stream=true');
        this.source.onmessage = this.handleMessage.bind(this);
        this.source.onerror = this.handleError.bind(this);
    }

    handleMessage(event) {
        let data = JSON.parse(event.data);
        if (!data.success) {
            alert(data.data);
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

    handleError() {
        console.log("Failed to connect to server or connection closed.");
        this.source.close();
    }
}