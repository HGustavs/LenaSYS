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
		$overwrite_db = $settings->overwrite_db === 'true' ? true : false;
		$overwrite_user = $settings->overwrite_user === 'true' ? true : false;
		$add_test_data = $settings->add_test_data === 'true' ? true : false;
		$add_demo_course = $settings->add_demo_course === 'true' ? true : false;
		$add_test_course_data = $settings->add_test_course_data === 'true' ? true : false;

		if ($verbose) {
			SSESender::transmit("Received settings: " . $installation_data);
		}

		try {
			$hostname = 'db';
			$username = 'root';
			$password = 'password';
			
			$dsn = "mysql:host=$hostname;charset=utf8mb4";
			$pdo = new PDO($dsn, $username, $password);
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			SSESender::transmit("Connected to database successfully.");
		} catch (PDOException $e) {
			SSESender::transmit("Connection failed". $e->getMessage(), true);
		}

		function callback($message) {
			SSESender::transmit($message);
		}

		try {
			$installer = new DBSetup(pdo: $pdo, db_name: "LenaSYStest", db_user: "LenaTest", db_user_password: "test", hostname:"%", callback: "callback");

			// Add default installer operations
			$operations = [
				"create_db" => function() use ($installer, $overwrite_db) {
					$installer->create_db(force: $overwrite_db);
				},
				"create_user" => function() use ($installer, $overwrite_user) {
					$installer->create_user(force: $overwrite_user);
				},
				"set_permissions" => function() use ($installer) {
					$installer->set_permissions();
				},
				"init_db" => function() use ($installer, $verbose) {
					$installer->execute_sql_file("../Shared/SQL/init_db.sql", verbose: $verbose);
				}
			];

			// Add selected language support
			foreach ($settings->language_support as $language) {
				if ($verbose) {
					SSESender::transmit("Adding language support for {$language}");
				}
				$operations["add_language_support_{$language}"] = InstallEngine::createLanguageOperation($installer, $language);
			}

			// Add optional modules to installer
			if ($add_test_data) {
				$operations['add_test_data'] = function() use ($installer, $verbose) {
					$installer->execute_sql_file("../install/SQL/testdata.sql", verbose: $verbose);
				};
			}
			if ($add_demo_course) {
				$operations['add_demo_course'] = function() use ($installer, $verbose) {
					$installer->execute_sql_file("../install/SQL/demoCourseData.sql", verbose: $verbose);
				};
			}
			if ($add_test_course_data) {
				$operations['add_test_course_data'] = function() use ($installer, $verbose) {
					$installer->execute_sql_file("../install/SQL/testingCourseData.sql", verbose: $verbose);
				};
			}

		} catch (Exception $e) {
			SSESender::transmit(data: "Encountered error while constructing installation queue: {$e}", is_error: true);
		}

		try {
			// Run the installer
			$totalOperations = count($operations);
			$i = 0;
			$start_flag = isset($settings->starting_step) && $settings->starting_step != ""; // when true continue without running install step
			foreach ($operations as $operationKey => $operation) {
				if ($start_flag) {	// Allow installer to start on the n:th step 
					if ($settings->starting_step == $operationKey) {
						$start_flag = false;
					} else {
						continue;
					}
				}

				// Calculate completion, adjusted by adding 1 to $i to reflect the correct number of completed operations.
				$completion = round((($i+1) / $totalOperations) * 100, 0);
				if ($completion > 99) {
					$completion = 99;
				}
				SSESender::transmit_event("updateProgress", data: $completion);
				$operation();  // Execute the operation
				$i++;
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

	private static function createLanguageOperation($installer, $language) {
		return function() use ($installer, $language) {
			$installer->execute_sql_file("../install/SQL/keywords_{$language}.sql", verbose: false);
		};
	}
}