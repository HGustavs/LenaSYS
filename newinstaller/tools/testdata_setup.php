<?php
class TestdataSetup {
	private $callback;
	
	public function __construct($callback = null) {
		$this->callback = $callback;
	}

    /**
     * Copies all non-dot files from one directory to another.
     * Parameter: $fromDirectory Source directory path.
     * Parameter: $toDirectory Destination directory path.
     * return array Returns an array with a success status and a message.
     */
	public function copy_test_files(string $fromDirectory, string $toDirectory): array {
		try {
			if (!is_readable($fromDirectory)) {
                return $this->handle_exception("Source directory is not readable or does not exist.");
            }

            if (!is_dir($toDirectory) && !mkdir($toDirectory, 0777, true)) {
                return $this->handle_exception("Failed to create destination directory.");
            }

			$dirIterator = new DirectoryIterator($fromDirectory);

            foreach ($dirIterator as $fileinfo) {
                if (!$fileinfo->isDot()) {
                    $srcFilePath = $fileinfo->getRealPath();
                    $destFilePath = $toDirectory . '/' . $fileinfo->getFilename();

                    if (!copy($srcFilePath, $destFilePath)) {
                        return $this->handle_exception("Failed to copy {$fileinfo->getFilename()}.");
                    }
                }
            }
			return $this->handle_success("Successfully filled {$toDirectory} with files from {$fromDirectory}.");
		} catch (Exception $e) {
			return $this->handle_exception($e->getMessage());
		}
	}

	/**
     * Handles exceptions and returns a standardized array format.
     * Parameter: $e Exception object or string error message.
     * Parameter: $action Custom action message prefix.
     * Parameter: callable|null $callback Optional callback function.
     * return array
     */
    private function handle_exception($e, string $action = "Error: ", $callback = null): array {
        $message = $action . (is_string($e) ? $e : $e->getMessage());
        if ($callback && is_callable($callback)) {
            $callback($message, false);
        }
        return [
            "success"=> false,
            "message"=> $message
        ];
    }

	/**
     * Handles successful operations and returns a standardized array format.
     * Parameter: $action Custom action message.
     * Parameter: callable|null $callback Optional callback function.
     * return array
     */
    private function handle_success(string $action = "Success", $callback = null): array {
        $callback = $callback ?? $this->callback;
        if (isset($callback) && is_callable($callback)) {
            $callback($action, true);
        }
        return [
            "success"=> true,
            "message"=> $action
        ];
    }
}