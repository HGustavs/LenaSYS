<?php
class TestdataSetup {
	private $sourceDirectory;
	private $destinationDirectory;
	private $callback;
	
	public function __construct(string $sourceDirectory, string $destinationDirectory, $callback = null) {
		$this->sourceDirectory = $sourceDirectory;
		$this->destinationDirectory = $destinationDirectory;
		$this->callback = $callback;
	}

	/**
	 * Recursively copies all non-dot files from one directory to another.
	 * Parameter: $verbose Verbosity flag for detailed output.
	 * return array Returns an array with a success status and a message.
	 */
	public function copy_test_files(bool $verbose = false): array {
		try {
			$real_source = realpath($this->sourceDirectory) == "" ? $this->sourceDirectory : realpath($this->sourceDirectory);
			$real_destination = realpath($this->destinationDirectory) == "" ? $this->destinationDirectory : realpath($this->destinationDirectory);

			if (!is_dir($this->sourceDirectory)) {
				return $this->handle_exception("{$real_source} is not a directory.");
			}

			if (!is_readable($this->sourceDirectory)) {
				return $this->handle_exception("Source directory ({$real_source}) is not readable.");
			}

			if (!is_readable($this->destinationDirectory)) {
				return $this->handle_exception("Source directory ({$real_destination}) is not readable.");
			}

			$dirIterator = new RecursiveDirectoryIterator($this->sourceDirectory, RecursiveDirectoryIterator::SKIP_DOTS);
			$iterator = new RecursiveIteratorIterator($dirIterator, RecursiveIteratorIterator::SELF_FIRST);

			foreach ($iterator as $item) {
				$destPath = $this->destinationDirectory . DIRECTORY_SEPARATOR . $iterator->getSubPathName();
				if ($item->isDir()) {
					if (!is_dir($destPath) && !mkdir($destPath)) {
						return $this->handle_exception("Failed to create directory {$destPath}.");
					}
				} else {
					if (!copy($item->getRealPath(), $destPath)) {
						return $this->handle_exception("Failed to copy {$item->getFilename()}.");
					}
					if ($verbose) {
						$this->handle_success("Copied '{$item->getRealPath()}' to '{$destPath}'");
					}
				}
			}
			return $this->handle_success("Successfully copied files from {$real_source} to {$real_destination}.");
		} catch (Exception $e) {
			return $this->handle_exception($e->getMessage());
		}
	}

	/**
	 * Copies a specific course.
	 * Parameter: $course Name of the course directory.
	 * Parameter: $verbose Optional verbosity flag.
	 */
	public function copy_course(string $course, bool $verbose = false) {
		// Store original source & destination paths.
		$originalSourceDirectory = $this->sourceDirectory;
		$originalDestinationDirectory = $this->destinationDirectory;

		// Temporarily updates source & destination paths to copy specific course.
		$this->sourceDirectory .= '/' . $course;
		$this->destinationDirectory .= '/' . $course;

		// Store the result.
		$result = $this->copy_test_files($verbose);

		// Resets paths to original.
		$this->sourceDirectory = $originalSourceDirectory;
		$this->destinationDirectory = $originalDestinationDirectory;

		return $result;
	}

	/**
	 * Handles exceptions and returns a standardized array format.
	 * Parameter: $e Exception object or string error message.
	 * Parameter: $action Custom action message prefix.
	 * Parameter: callable|null $callback Optional callback function.
	 * return array
	 */
	private function handle_exception($e, string $action = "Error: ", $callback = null): array {
		throw new Exception($e);
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
			$callback($action, false);
		}
		return [
			"success"=> true,
			"message"=> $action
		];
	}
}