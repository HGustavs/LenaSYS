<?php
class ConfigurationManager {
	private $save_file; // The file path and file name where credentials are stored
	private $parameters; // Associative array containing configuration
	private $callback;
	private $verbose;
	
	/**
	 * function __construct
	 * Read a new configuration file from the specified path
	 * @param string $save_file The path in which the configuration is located
	 * @param string $callback the function to call when printing information
	 * @param bool $verbose If verbose it prints more information than normal
	 */
	public function __construct(string $save_file, ?string $callback = null, bool $verbose = false) {
		$this->save_file = $save_file;
		$this->callback = $callback;
		$this->verbose = $verbose;
		$this->parameters = [];
		$read = $this->read_config(); // Load existing config
		if($read["success"]) {
			$this->write_config(); // Write or create config
		}
	}

	/**
	 * function set_parameter
	 * writes any new kvp to the config file specified in the save_path
	 */
	public function set_parameter(string $key, $value): void {
		$this->parameters[$key] = $value;
		$this->write_config();
	}

	/**
	 * function set_parameters
	 * Replaces the current config with a new one. 
	 */
	public function set_parameters(array $parameters): void {
		$this->parameters = $parameters;
		$this->write_config();
	}

	/**
	 * function read_parameter
	 * Read one parameter by key 
	 * returns the value of the matching key
	 */
	public function read_parameter(string $key): string {
		return $this->parameters[$key] ?? '';
	}

	/**
	 * function read_parameters
	 * Read all stored parameters from config file
	 */
	public function read_parameters(): array {
		return $this->parameters;
	}

	/**
	 * function read_config
	 * Read the current configuration from the specified save_file
	 */
	private function read_config() {
		try {
			$real_path = $this->save_file ?: realpath($this->save_file);

			if (!file_exists($real_path)) {
				$this->create_config();
			}

			if (!Permissions::has_permission($real_path)) {
				Permissions::change_file_permissions($real_path, 0777);
			}
	
			$file_contents = file_get_contents($real_path);
	
			if ($file_contents === false) {
				throw new Exception("Could not open file {$real_path}");
			}

			if ($this->verbose) {
				$this->handle_success("Successfully opened config file {$real_path}");
			}
	
			preg_match_all('/define\(\s*["\'](.+?)["\']\s*,\s*["\'](.+?)["\']\s*\)\s*;/i', $file_contents, $matches, PREG_SET_ORDER);
	
			foreach ($matches as $match) {
				if ($this->verbose) {
					$this->handle_success("Read param: " . $match[1] . " as: " . $match[2]);
				}

				$this->parameters[$match[1]] = $match[2];
			}

			return $this->handle_success("Successfully read existing config file.");
		} catch (Exception $e) {
			$this->handle_exception(e: $e);
		}
	}

	/**
	 * function write_config
	 * Save the current configuration to the specified save file
	 */
	private function write_config() {
		try {
			$real_path = $this->save_file ?: realpath($this->save_file);
			$permissions = Permissions::get_permissions($real_path)['data']['permissions'];

			$dir_path = dirname($real_path);
			if (!is_dir($dir_path)) {
				throw new Exception("Directory {$dir_path} does not exist.");
			}

			if (!is_writable($dir_path)) {
				throw new Exception("Directory {$dir_path} is not writable.");
			}

			if (file_exists($real_path)) {
				if (!is_writable($real_path)) {
					throw new Exception("Missing write permission for {$real_path} Permissions: {$permissions}");
				}
			}

			$file_contents = "<?php\n";

			foreach ($this->parameters as $key => $value) {
				$file_contents .= "\tdefine(\"{$key}\", \"{$value}\");\n";
			}

			$file_contents .= "?>";

			if (file_put_contents($real_path, $file_contents) === false) {
				
				throw new Exception("Failed to write config {$real_path} Permissions: {$permissions}");
			}

			return $this->handle_success("Successfully wrote config file {$real_path}");

		} catch (Exception $e) {
			$this->handle_exception(e: $e);
		}
	}

	private function create_config() {
		try {
			$real_path = $this->save_file ?: realpath($this->save_file);
			
			# Docker enviroment
			$is_docker = getenv("DOCKER") === "1";
			
			# XAMPP directory
			$xampp_path_htdocs = realpath(__DIR__ . "/../../../");
			$htdocs_owner = Permissions::get_owner($xampp_path_htdocs);
			$htdocs_group = Permissions::get_group($xampp_path_htdocs);

			# If not in Docker and htdocs is not owned by daemon:daemon
			if (!$is_docker && ( $htdocs_owner["data"] !== "daemon" || $htdocs_group["data"] !== "daemon" ) ) {
				$xampp_setup_dir = realpath(__DIR__ . "/../../xampp/setup.sh");
				$error_message = "Permission denied: the htdocs folder is not owned by 'daemon:daemon.\n'";
				$error_message .= "Current path: $xampp_path_htdocs\n";
				$error_message .= "Owner: " . $htdocs_owner["data"] . "\n";
				$error_message .= "Group: " . $htdocs_group["data"] . "\n";
				$error_message .= "Have you run the XAMPP setup script located at: $xampp_setup_dir?\n";
				
				echo $error_message;
				exit;
			}

			$config_file = fopen($real_path, "w+");

			$text = "<?php\n";
			$text .= "\tdefine(\"DB_USER\", \"lenasys\");\n";
			$text .= "\tdefine(\"DB_PASSWORD\", \"password\");\n";
			$text .= "\tdefine(\"DB_HOST\", \"localhost\");\n";
			$text .= "\tdefine(\"DB_NAME\", \"lenasysdb\");\n";
			$text .= "\tdefine(\"DB_USING_DOCKER\", \"0\");\n";
			$text .= "?>";
			
			fwrite($config_file, $text);
			fclose($config_file);

			Permissions::change_file_permissions($real_path, 0777);
		} catch (Exception $e) {
			$this->handle_exception(e: $e);
		}
	}

	/**
	 * function execute_callback
	 * Execute callback functions, and handle potential errors.
	 */
	private function execute_callback(string $callback, string $message, bool $sucess = true): void {
		if (is_callable($callback)) {
			$callback($message, $sucess); // Execute the callback
		} else {
			throw new Exception("The provided callback function cannot be found.");
		}
	}

	/**
	 * function handle_success
	 * Universal way of handling non-exceptions.
	 * Will return array of information.
	 */
	private function handle_success(string $action = "Success", $callback = null): array {
		$callback = $callback ?? $this->callback;
		if (isset($callback)) {
			$this->execute_callback($callback, $action, true);
		}

		return [
			"success"=> true,
			"message"=> $action
		];
	}

	/**
	 * function handle_exception
	 * Universal way of handling exceptions.
	 * Will return array of information.
	 */
	private function handle_exception(string $action = "Error: ", Exception $e = null): void {
		throw new Exception($e);
	}
}