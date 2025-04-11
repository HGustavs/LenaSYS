<?php
include_once("permissions.php");

class DBSetup {
	private $pdo, $db_name, $db_user, $db_user_password, $hostname = null;
	private $callback = null; 

	public function __construct(PDO $pdo, string $db_name = null, string $db_user = null, string $db_user_password = null, string $hostname = '%', string $callback = null) {
		$this->pdo = $pdo;
		$this->db_name = $db_name;
		$this->db_user = $db_user;
		$this->db_user_password = $db_user_password;
		$this->hostname = $hostname;
		$this->callback = $callback;
	}

	public function set_hostname(string $hostname) {
		$this->hostname = $hostname;
	}

	public function set_callback(string $callback) {
		$this->callback = $callback;
	}

	/**
	 * function create_db
	 * Create db using class variables.
	 * Force first drops any existing database.
	 */
	public function create_db(string $db_name = null, bool $force = false): array {
		try {
			$db_name = $db_name ?? $this->db_name;
			
			if ($force) {
				$this->pdo->exec("DROP DATABASE IF EXISTS `$db_name`");
			} else {
				$this->sanitize($db_name);
			}

			$this->pdo->exec("CREATE DATABASE `$db_name`");
			$this->db_name = $db_name;

		} catch (PDOException $e) { 
			$this->handle_exception($e, "Failed to create database {$db_name}. " . 
			(!$force ? "Try using force. " : "") . $e->getMessage());
		}

		return $this->handle_success("Successfully created database {$db_name}.");
	}

	/**
	 * function create_user
	 * Creates a new sql user.
	 * Force first removes user.
	 */
	public function create_user(string $user_name = null, string $password = null, string $hostname = null, bool $force = false): array {
		try {
			$user_name = $user_name ?? $this->db_user;
			$hostname = $hostname ?? $this->hostname;
			$hostname = $hostname ?? '%';
			$password = $password ?? $this->db_user_password;

			$this->sanitize($user_name);
			$this->sanitize_hostname($hostname);

			if (empty($password)) {
				throw new PDOException("Password was not provided for user {$user_name}@{$hostname}.");
			}

			if ($force) {
				$stmt = $this->pdo->prepare("DROP USER IF EXISTS :user@:host");
				$stmt->bindParam(':user', $user_name);
				$stmt->bindParam(':host', $hostname);
				$stmt->execute();
			}

			$stmt = $this->pdo->prepare("CREATE USER :user@:host IDENTIFIED BY :password");
			$stmt->bindParam(':user', $user_name);
			$stmt->bindParam(':host', $hostname);
			$stmt->bindParam(':password', $password);
			$stmt->execute();

			$this->db_user = $user_name;
			$this->hostname = $hostname;

			return $this->handle_success("Successfully created user {$user_name}@{$hostname}.");
		} catch (PDOException $e) { 
			return $this->handle_exception($e, "Failed to create user {$user_name}@{$hostname}. " . 
			(!$force ? "Try using force." : $e->getMessage()));
		}
	}

	/**
	 * function drop_db
	 * Drops an existing database. 
	 */
	public function drop_db(string $db_name = null, bool $force = false): array { 
		try {
			$db_name = $db_name ?? $this->db_name;

			if ($force) {
				$this->pdo->exec("DROP DATABASE `$db_name`");
			} else {
				$this->sanitize($db_name);
				$this->pdo->exec("DROP DATABASE IF EXISTS `$db_name`");
			}

			return $this->handle_success("Successfully removed database {$db_name}.");
		} catch (PDOException $e) {
			return $this->handle_exception($e, "Failed to remove database {$db_name} {$e->getMessage()}");
		}
	}

	/**
	 * function drop_user
	 * removes an already existing user.
	 */
	public function drop_user(string $user_name = null, string $hostname = null, bool $force = false): array {
		try {
			$user_name = $user_name ?? $this->db_user;
			$hostname = $hostname ?? $this->hostname;
			$hostname = $hostname ?? '%';

			if ($force) {
				$this->pdo->exec("DROP USER `$user_name`@`$hostname`");
			} else {
				$this->sanitize($user_name);
				$this->sanitize_hostname($hostname);
				$this->pdo->exec("DROP USER IF EXISTS `$user_name`@`$hostname`");
			}

			return $this->handle_success("Successfully removed user {$user_name}.");
		} catch (PDOException $e) {
			return $this->handle_exception($e, "Failed to remove user {$user_name}. ");
		}
	}

	/**
	 * function set_permissions
	 * Set permission to access db for user.
	 */
	public function set_permissions(string $db_name = null, string $user_name = null, string $hostname = null): array {
		try {
			$db_name = $db_name ?? $this->db_name;
			$user_name = $user_name ?? $this->db_user;
			$hostname = $hostname ?? $this->hostname ?? '%';

			$this->sanitize($db_name . $user_name);
			$this->sanitize_hostname($hostname);

			//GRANT ALL PRIVILEGES ON '$db_name'.* TO '$user_name'@'$hostname'
			$this->pdo->exec("GRANT ALL PRIVILEGES ON *.* TO '$user_name'@'$hostname'");

			return $this->handle_success("Successfully set permissions for {$user_name}@{$hostname} on {$db_name}.");
		} catch (PDOException $e) {
			return $this->handle_exception($e, $e->getCode() == 42000 ?
			"User does not exist. Failed to set permissions for {$user_name}@{$hostname} on {$db_name}." :
			"Failed to set permissions for {$user_name}@{$hostname} on {$db_name}: ");
		}
	}

	/**
	 * function run_sql_file
	 * Runs an sql file using the class variable pdo.
	 */
	public function execute_sql_file(string $file_name, string $callback = null, bool $verbose = false, string $db_name = null): array {
		try {
			$db_name = $db_name ?? $this->db_name;
			$callback = $callback ?? $this->callback;
			$this->sanitize($db_name);

			if (empty($db_name)) {
				throw new Exception("No database selected. ");
			}

			$queries = $this->prepare_sql_file($file_name, ";", $verbose);
			$this->handle_success("Successfully prepared SQL queries from file {$file_name}", $callback);
			$this->pdo->exec("USE `$db_name`");
			$last_printed_percentage = 0;
			$totalQueries = sizeof($queries);
			for ($i = 0; $i < $totalQueries; $i++) {
				$stmt = $this->pdo->prepare($queries[$i]);

				try {
					$stmt->execute();
				} catch (PDOException $e) {
					if ($e->getCode() == 42000) {
						throw new Exception("Query error: {$queries[$i]} generated error {$e->getMessage()}");
					} else {
						throw new PDOException($e);
					}
				}

				$progress = round(($i / $totalQueries) * 100, 0);
				$current_query = substr($queries[$i], 0, 30);
				
				if ($verbose) {
					$this->handle_success("{$file_name} > query {$i} > {$progress}% > {$current_query}...", $callback);
				} else {
					if ($progress >= $last_printed_percentage + 10 && $progress % 10 == 0) {
						$this->handle_success("{$file_name} > {$progress}%", $callback);
						$last_printed_percentage = $progress;
					}
				}
			}
			
		} catch (PDOException $e) {
			return $this->handle_exception($e, "SQL error. Failed to run SQL file. {$file_name}");
		} catch (Exception $e) {
			return $this->handle_exception($e, "File error. Failed to run SQL file. {$file_name}");
		}
	
		return $this->handle_success("{$file_name} > 100% > Executed all {$i} queries sucessfully. ");
	}

	/**
	 * function sanitize
	 * Sanitize data, only allow letters, numbers and underscores.
	 * Also ensure that they contain start and end of string.
	 */
	private function sanitize(string $sql): string {
		if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $sql)) {
			throw new PDOException("Invalid name detected.");
		}
		return $sql;
	}

	/**
	 * function sanitize_hostname
	 * Sanitize data, only allow letters, numbers, underscores and %.
	 * Also ensure that they contain start and end of string.
	 */
	private function sanitize_hostname(string $sql): string {
		if (!preg_match('/^[a-zA-Z0-9_%]+$/', $sql)) {
			throw new PDOException("Invalid hostname detected.");
		}
		return $sql;
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

	/**
	 * function handle_exception
	 * Universal way of handling exceptions.
	 * Will return array of information.
	 */
	private function handle_exception($e, string $action = "Error: ", $callback = null): array {
		$myfile = fopen("instalationLogLenaSYS.txt", "a") or die("Unable to open file!");

		fwrite($myfile, $action);

		fclose($myfile);

		throw new Exception($action . " Error: " . $e->getMessage());
	}

	/**
	 * function handle_success
	 * Universal way of handling non-exceptions.
	 * Will return array of information.
	 */
	private function handle_success(string $action = "Success", $callback = null) {
		$callback = $callback ?? $this->callback;

		$myfile = fopen("instalationLogLenaSYS.txt", "a") or die("Unable to open file!");

				fwrite($myfile, $action."\n");
				
				fclose($myfile);

		if (isset($callback)) {
			$this->execute_callback($callback, $action, true);
		}

		return [
			"success"=> true,
			"message"=> $action
		];
	}

	/**
	 * Open sql file, and transform it into an array of queries.
	 * Properly handles:
	 * - Block comments.
	 * - Inline comments.
	 * - Changing delimmiters.
	 */
	private function prepare_sql_file($file, $default_delimiter = ';', $verbose = false) {
		set_time_limit(0);
		$file_name = $file;
	
		if (!is_file($file)) {
			throw new Exception("Could not open file {$file}");
		}

		if (!is_readable($file)) {
			$permissions = Permissions::get_permissions($file)['permissions'];
			throw new Exception("Missing permissions. {$permissions} set on {$file}");
		}
	
		$file = fopen($file, 'r');
	
		if (!is_resource($file)) {
			throw new Exception('Could not open file');
		}

		if ($verbose) {
			$this->handle_success("Successfully opened file {$file_name} as {$file}. ");
		}
	
		$queries = array();
		$buffer = array();
		$is_comment_block = false;
		$current_delimiter = $default_delimiter;
	
		while (!feof($file)) {
			$line = fgets($file);
			if ($line !== false) {
				// Trim whitespace
				$line = trim($line);
	
				// Remove single-line comments
				if (!$is_comment_block && strpos($line, '--') !== false) {
					$line = substr($line, 0, strpos($line, '--'));
				}
	
				// Handle block comments
				if (!$is_comment_block && strpos($line, '/*') !== false) {
					$startPos = strpos($line, '/*');
					$endPos = strpos($line, '*/', $startPos);
					if ($endPos !== false) {
						$line = substr($line, 0, $startPos) . substr($line, $endPos + 2);
					} else {
						$is_comment_block = true;
						$line = substr($line, 0, $startPos);
					}
				}
	
				if ($is_comment_block) {
					$endPos = strpos($line, '*/');
					if ($endPos !== false) {
						$line = substr($line, $endPos + 2);
						$is_comment_block = false;
					} else {
						$line = ''; // Continue to next line if block comment hasn't ended
					}
				}
	
				// Check for delimiter change
				if (preg_match('/DELIMITER\s+([^ \s]+)/i', $line, $matches)) {
					$current_delimiter = $matches[1];
					continue; // Skip the delimiter setting line
				}
	
				// Only add non-empty lines to the buffer
				if (!empty($line)) {
					$buffer[] = $line;
				}
			}
	
			// Check if the last line in buffer ends with the current delimiter
			if (!empty($buffer) && preg_match('~' . preg_quote($current_delimiter, '~') . '$~iS', end($buffer)) === 1) {
				$completeQuery = implode(" ", $buffer);
	
				// Remove the delimiter from the end of the query
				$completeQuery = substr($completeQuery, 0, strrpos($completeQuery, $current_delimiter));
	
				// Add the complete query to the queries array
				$queries[] = $completeQuery;
	
				// Reset the buffer for the next query
				$buffer = array();
			}
		}
	
		fclose($file);
	
		// Return the array of queries
		return $queries;
	}
}