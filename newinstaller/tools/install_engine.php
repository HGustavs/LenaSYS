<?php

foreach (glob("tools/*.php") as $tools) {
	include_once $tools;
}

class InstallEngine {

	/**
	 * function run
	 * Run all the necessary steps for installing the system.
	 * $installation_data json string containing installation settings. 
	 */
	public static function run(string $installation_data) {
		SSESender::start();
		$settings = json_decode($installation_data);
		$verbose = $settings->verbose === 'true' ? true : false;

		if ($verbose) {
			SSESender::transmit("Received settings: " . $installation_data);
		}

		if (!isset($settings->root_password) || !isset($settings->root_username) || !isset($settings->hostname)) {
			$message = "Root username, password or hostname not set. Will not be able to establish connection to database.";
			SSESender::transmit($message, true);
			throw new Exception($message);
		}

		// Initialize pdo
		$pdo = self::init_pdo($settings->root_username, $settings->root_password, $settings->hostname);

		function callback($message) {
			SSESender::transmit($message);
		}

		try {
			$installer = new DBSetup(pdo: $pdo, db_name: $settings->db_name, db_user: $settings->username, db_user_password: $settings->password, hostname: $settings->hostname, callback: "callback");
			$testDataSetup = new TestdataSetup("courses", "../courses", callback: "callback");
			$configuration_manager = new ConfigurationManager("../../coursesyspw.php", callback: "callback", verbose: $verbose);
			$operations = InstallEngine::construct_installation_queue($installer, $configuration_manager, $testDataSetup, $settings);

			if ($verbose) {
				$temp = "Will perform the following operations to install the system: ";
				foreach ($operations as $name => $op) {
					$temp .= $name . ", ";
				}
				SSESender::transmit($temp);
			}

		} catch (Exception $e) {
			SSESender::transmit(data: "Encountered error while constructing installation queue: {$e}", is_error: true);
		} catch (TypeError $e) {
			SSESender::transmit(data: "Encountered error while constructing installation queue perhaps not all required settings are set?: {$e}", is_error: true);
		}

		try {
			// Run the installer
			$totalOperations = count($operations);
			$i = 0;
			$start_flag = isset($settings->starting_step) && $settings->starting_step != ""; // when true continue without running install step
			foreach ($operations as $operationKey => $operation) {
				// Calculate completion, limit it from being above 99 since it tries to be ahead of actual progress
				$completion = round((($i+2) / ($totalOperations)) * 100, 0);
				$completion = $completion > 99 ? 99 : $completion;
				SSESender::transmit_event("updateProgress", data: $completion);
				$i++;

				if ($start_flag) {	// Allow installer to start on the n:th step 
					if ($settings->starting_step == $operationKey) {
						$start_flag = false;
					} else {
						continue;
					}
				}

				$operation();  // Execute the operation
			}

			SSESender::transmit_event("updateProgress", data: 100);
		} catch (Exception $e) {
			SSESender::transmit(data: [
				"event" => "message",
				"data" => "Failed on step {$operationKey}: {$e->getMessage()}",
				"failed_step" => $operationKey,
				"success" => false,
			]);
		}

		SSESender::stop();
	}

	private static function init_pdo($root_user, $root_password, $hostname): PDO {
		try {
			$db_hostname = $hostname;
			$username = $root_user;
			$password = $root_password;
			
			$dsn = "mysql:host=$db_hostname;charset=utf8mb4";
			$pdo = new PDO($dsn, $username, $password);
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			SSESender::transmit("Connected to database successfully.");
		} catch (PDOException $e) {
			SSESender::transmit("Connection to database could not be established. ". $e->getMessage(), true);
		}

		return $pdo;
	}

	/**
	 * function construct_installation_queue
	 * Create associative array of installation steps.
	 * Each index contains a key: name of current step
	 * and a value, callback function for installation step. 
	 */
	private static function construct_installation_queue(DBSetup $installer, ConfigurationManager $cm, TestdataSetup $testdataSetup, $settings): array { 
		// Read settings
		$create_db = $settings->create_db === 'true' ? true : false;
		$create_db_user = $settings->create_db_user === 'true' ? true : false;
		$verbose = $settings->verbose === 'true' ? true : false;
		$overwrite_db = $settings->overwrite_db === 'true' ? true : false;
		$overwrite_user = $settings->overwrite_user === 'true' ? true : false;
		$add_test_data = $settings->add_test_data === 'true' ? true : false;
		$add_demo_course = $settings->add_demo_course === 'true' ? true : false;
		$add_test_course_data = $settings->add_test_course_data === 'true' ? true : false;
		$add_test_files = $settings->add_test_files === 'true' ? true : false;
		$distributed_environment = $settings->distributed_environment === 'true' ? true : false;
		
		if (!isset($settings->username) && !isset($settings->password) && !isset($settings->hostname) && !isset($settings->db_name)) {
			throw new Exception("Not all required settings were sent to the installer.");
		}

		$operations = [];

		if ($create_db) {
			$operations["create_db"] = function() use ($installer, $overwrite_db) {
				$installer->create_db(force: $overwrite_db);
			};
		}
		if ($create_db_user) {
			$operations["create_user"] = function() use ($installer, $overwrite_user, $distributed_environment) {
				if ($distributed_environment) {
					$installer->set_hostname('%');
				}
				$installer->create_user(force: $overwrite_user);
			};
		}
		
		// Add mandatory installer operations
		$operations["set_permissions"] = function() use ($installer) {
			$installer->set_permissions();
		};
		$operations["init_db"] = function() use ($installer, $verbose) {
			$installer->execute_sql_file("SQL/init_db.sql", verbose: $verbose);
		};
		$operations["setup_endpoint_directory"] = function() use ($verbose) {
			try {
				setup_endpoint_directory($verbose);
			} catch (Throwable $e) {
				SSESender::transmit("Error in setup_endpoint_directory: " . $e->getMessage(), true);
			}
		};
		$operations["save_credentials"] = function() use ($cm, $settings, $distributed_environment) {
			$parameters = [
				"DB_USER" => $settings->username,
				"DB_PASSWORD" => $settings->password,
				"DB_HOST" => $settings->hostname,
				"DB_NAME" => $settings->db_name,
				"DB_USING_DOCKER" => $distributed_environment,
			];

			$cm->set_parameters($parameters);
		};

		// Add selected language support
		foreach ($settings->language_support as $language) {
			if ($verbose) {
				SSESender::transmit("Adding language support for {$language}");
			}
			$operations["add_language_support_{$language}"] = InstallEngine::createLanguageOperation($installer, $language);
		}

		// Add optional test files
		if ($add_test_files) {
			$operations['copy_test_file_1'] = function() use ($testdataSetup, $verbose) {
				$testdataSetup->copy_course("1", $verbose);
			};
			$operations['copy_test_file_2'] = function() use ($testdataSetup, $verbose) {
				$testdataSetup->copy_course("2", $verbose);
			};
			$operations['copy_test_file_global'] = function() use ($testdataSetup, $verbose) {
				$testdataSetup->copy_course("global", $verbose);
			};
		}

		// Add optional modules to install queue
		if ($add_test_data) {
			$operations['add_test_data'] = function() use ($installer, $verbose) {
				$installer->execute_sql_file("SQL/testdata.sql", verbose: $verbose);
			};
		}
		if ($add_demo_course) {
			$operations['add_demo_course'] = function() use ($installer, $verbose) {
				$installer->execute_sql_file("SQL/demoCourseData.sql", verbose: $verbose);
			};
		}
		if ($add_test_course_data) {
			$operations['add_test_course_data'] = function() use ($installer, $verbose) {
				$installer->execute_sql_file("SQL/testingCourseData.sql", verbose: $verbose);
			};
		}

		return $operations;
	}

	private static function createLanguageOperation($installer, $language) {
		return function() use ($installer, $language) {
			$installer->execute_sql_file("SQL/keywords_{$language}.sql", verbose: false);
		};
	}
}