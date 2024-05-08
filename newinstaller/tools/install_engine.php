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
		SSESender::transmit("Received settings: " . $installation_data);

		$verbose = $settings->verbose === 'true' ? true : false;
		$overwrite_db = $settings->overwrite_db === 'true' ? true : false;
		$overwrite_user = $settings->overwrite_user === 'true' ? true : false;

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
			SSESender::transmit_event("updateProgress", data: 1);
			$installer->create_db(force: $overwrite_db);
			SSESender::transmit_event("updateProgress", data: 5);
			$installer->create_user(force: $overwrite_user);
			SSESender::transmit_event("updateProgress", data: 10);
			$installer->set_permissions();
			SSESender::transmit_event("updateProgress", data: 25);
			$installer->execute_sql_file("../Shared/SQL/init_db.sql", "callback", verbose: $verbose);
			SSESender::transmit_event("updateProgress", data: 45);
			$installer->execute_sql_file("../install/SQL/testdata.sql", "callback", verbose: $verbose);
			SSESender::transmit_event("updateProgress", data: 75);
			$installer->execute_sql_file("../install/SQL/demoCourseData.sql", "callback", verbose: $verbose);
			SSESender::transmit_event("updateProgress", data: 80);
			$installer->execute_sql_file("../install/SQL/testingCourseData.sql", "callback", verbose: $verbose);
			SSESender::transmit_event("updateProgress", data: 95);

			$languages = array("html", "java", "php", "plain", "sql", "sr");
			foreach ($languages as $language) {
				$installer->execute_sql_file("../install/SQL/keywords_{$language}.sql", "callback");
			}
			SSESender::transmit_event("updateProgress", data: 100);
			SSESender::transmit(data: "Installation completed", is_error: false);
		} catch (Exception $e) {
			SSESender::transmit(data: "Encountered error: {$e}", is_error: true);
		}

		SSESender::stop();
	}
}