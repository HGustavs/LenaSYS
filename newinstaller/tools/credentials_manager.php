<?php
	class CredentialsManager {
		private $path;
		private $db_user;
		private $db_password;
		private $db_host;
		private $db_name;
		private $db_docker;
		private $callback;

		public function __construct($path, $callback = null) {
			$this->path = $path;
			$this->callback = $callback;
		}

		/**
		 * function set_db_credentials
		 * save database credentials to file.
		 */
		public function set_db_credentials(string $user, string $password, string $host, string $name, bool $docker): array {
			$response = $this->configuration_exists();
			if(!$response['success']) {
				return $response;
			}

			// Fills file with provided data
			$fileContent =  "<?php\n";
			$fileContent .= "   define('DB_USER','{$user}');\n";
			$fileContent .= "   define('DB_PASSWORD','{$password}');\n";
			$fileContent .= "   define('DB_HOST','{$host}');\n";
			$fileContent .= "   define('DB_NAME','{$name}');\n";
			$fileContent .= "   define('DB_USING_DOCKER','" . ($docker ? "on" : "off") . "');\n";


			// Stores table of content inside the file.
			file_put_contents($this->path, $fileContent);

			// Store credentials in class properties
			$this->db_user = $user;
			$this->db_password = $password;
			$this->db_host = $host;
			$this->db_name = $name;
			$this->db_docker = $docker;
			
			$real_dest = realpath($this->path) ?: $this->path;
			return $this->handle_success("Stored user information successfully at {$real_dest}.");
		}
		
		/**
		 * function set_db_user
		 * set the db username
		 */
		public function set_db_user(string $user): array {
			if(!$this->set_parameter('DB_USER', "{$user}")['success']) {   
				return $this->handle_exception("Couldn't update database user with value of {$user} in file.");
			}
			
			// Update the db_host property in the class
			$this->db_user = $user;

			return $this->handle_success("Successfully updated database user with value of {$user} in file.");
		}

		/**
		 * function set_db_password
		 * set the db password
		 */
		public function set_db_password(string $password): array {
			if(!$this->set_parameter('DB_PASSWORD', "{$password}")['success']) {  
				return $this->handle_exception("Couldn't update database password with value of {$password} in file."); 
			}
			
			// Update the db_host property in the class
			$this->db_password = $password;

			return $this->handle_success("Successfully updated database password with value of {$password} in file.");
		}

		/**
		 * function set_hostname
		 * set the db hostname
		 */
		public function set_hostname($hostname): array {
			if(!$this->set_parameter('DB_HOST', "{$hostname}")['success']) {
				return $this->handle_exception("Couldn't update database host with value of {$hostname} in file.");
			}
			
			// Update the db_host property in the class
			$this->db_host = $hostname;

			return $this->handle_success("Successfully updated database host with value of {$hostname} in file.");
		}
	
		/**
		 * function set_db_name
		 * set the db name
		 */
		public function set_db_name(string $name): array {
			if(!$this->set_parameter('DB_NAME', "{$name}")['success']) {   
				return $this->handle_exception("Couldn't update database name with value of {$name} in file.");
			}
			
			// Update the db_host property in the class
			$this->db_name = $name;

			return $this->handle_success("Successfully updated database name with value of {$name} in file.");
		}

		/**
		 * function set_db_docker
		 * set the db docker state
		 */
		public function using_docker(string $docker): array {
			if(!$this->set_parameter('DB_USING_DOCKER', "{$docker}")['success']) {   
				return $this->handle_exception("Couldn't update docker state with value of {$docker} in file.");
			}
			
			// Update the db_host property in the class
			$this->db_docker = $docker;

			return $this->handle_success("Successfully updated docker state with value of {$docker} in file.");
		}
	
		/**
		 * function get_db_username
		 * get the db username.
		 */
		public function get_db_username(): string {
			return $this->db_user;
		}
	
		/**
		 * function get_db_password
		 * get the db password.
		 */
		public function get_db_password(): string {
			return $this->db_password;
		}
	
		/**
		 * function get_hostname
		 * get the saved hostname
		 */
		public function get_hostname(): string {
			return $this->db_host;
		}
	
		/**
		 * function get_db_name
		 * get the saved db name
		 */
		public function get_db_name(): string {
			return $this->db_name;
		}

		/**
		 * function get_db_docker
		 * get the saved db docker state
		 */
		public function get_db_docker(): string {
			return $this->db_docker;
		}

		/**
		 * function check_file_exists
		 * checks if correct filepath exist
		 * if not tries to create file in correct filepath
		 */
		private function check_file_exists(): bool {
			// Checks if file exists
			return file_exists($this->path);
		}

		/**
		 * function configuration_exists
		 * checks if relevant permissions are sat
		 * checks if file exists and has right configuration
		 * if not tries to create one with correct data inside
		 */
		private function configuration_exists(): array {
			if(!Permissions::has_permission($this->path)) {
				return $this->handle_exception("Does not have permission to open file {$this->path}");
			}

			if(!$this->check_file_exists()) {
				if (file_put_contents($this->path, "<?php\n") === false) {
					return $this->handle_exception("Failed to create the configuration file.");
				}
			}
			
			return $this->handle_success("Configuration file is ready.");
		}

		/**
		 * function set_db_parameter
		 * takes two parameter, name & value. Used to replace data
		 * name is for insert name ex: define(DB_HOST)
		 * value is for the value to be replaced with existing value.
		 */
		private function set_parameter(string $name, string $value): array {
			// Read the existing content from the file
			$fileContent = file_get_contents($this->path);

			// Define a pattern to find the existing DB_HOST definition
			// Assuming the host is defined like define('DB_HOST', 'current_value');
			$pattern = "/define\('{$name}','.*?'\);/";
			$replacement = "define('{$name}','{$value}');";

			// Check if the existing host is already defined in the file
			if (preg_match($pattern, $fileContent)) {
				// Replace the existing DB_HOST definition with the new host
				$fileContent = preg_replace($pattern, $replacement, $fileContent);
			} else {
				// If DB_HOST is not defined, append the definition
				$fileContent .= "\n{$replacement}\n";
			}

			// Write the updated content back to the file
			if (!file_put_contents($this->path, $fileContent)) {
				return $this->handle_exception("Failed to update {$name} wtih value {$value} in the configuration file.");
			}

			// Update the db_host property in the class
			return $this->handle_success("Successfully updated {$name} wtih value {$value} in the configuration file.");
		}

		/**
		 * function handle_success
		 * Universal way of handling non-exceptions.
		 * Will return array of information.
		 */
		private function handle_success(string $action = "Success", $callback = null) {
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
		private function handle_exception($e, string $action = "Error: ", $callback = null): array {
			throw new Exception($e);
		}

		/**
		 * function execute_callback
		 * Execute callback functions, and handle potential errors.
		 */
		private function execute_callback(string $callback, $message, bool $sucess = true) {
			if (is_callable($callback)) {
				$callback($message, $sucess); // Execute the callback
			} else {
				throw new Exception("The provided callback function cannot be found.");
			}
		}
	}