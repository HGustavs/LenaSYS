<?php 
class SSESender {

	/**
	 * function start
	 * Starts a new output buffer and initializes an SSE stream
	 */
	public static function start(): void {
		header('Content-Type: text/event-stream');
		header('Cache-Control: no-cache');
		header('Connection: keep-alive');
		header('Content-Disposition: inline');
		ignore_user_abort(true);

		if (ob_get_level() == 0) {
			ob_start();
		}

		SSESender::transmit("Starting transmission");
	}

	/**
	 * function transmit
	 * Sends data to an SSE stream
	 * Formats array data to json. 
	 */
	public static function transmit($data = null, bool $is_error = false): void {
		if (connection_aborted()) {
			exit;
		}

		if (is_string($data)) {
			$data = [
				"success" => !$is_error,
				"event" => "message",
				"data" => $data,
			];
		}

		if (is_array($data)) {
			$data = json_encode($data);
		}

		if ($data) {
			echo "data: $data\n\n";
		}

		ob_flush();
		flush();
	}

	/**
	 * function transmit_event
	 * Sends custom events to an SSE stream
	 */
	public static function transmit_event(string $eventType, $data = null, $is_error = false): void {
		if (connection_aborted()) {
			exit;
		}

		$out = [
			"success" => !$is_error,
			"event" => $eventType,
			"data" => $data,
		];

		$out = json_encode($out);

		if ($out) {
			echo "data: $out\n\n";
		}

		ob_flush();
		flush();
	}

	/**
	 * Cleans up the buffer and ends the session.
	 */
	public static function stop(): void {
		if (ob_get_level() > 0) {
			SSESender::transmit("Stopping transmission");
			ob_end_clean();
		}
	}
}