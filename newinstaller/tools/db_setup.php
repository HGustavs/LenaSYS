<?php
    class DBSetup {
        private $pdo;

        public function __construct(PDO $pdo) {
            $this->pdo = $pdo;
        }

        /**
         * function create_db
         * Create db using class variables.
         * Force first drops any existing database.
         */
        public function create_db(string $db_name, bool $force = false): string {
            try {
                if ($force) {
                    $this->pdo->exec("DROP DATABASE IF EXISTS `$db_name`");
                }

                $this->pdo->exec("CREATE DATABASE `$db_name`");

            } catch (PDOException $e) { 
                return "Failed to create database {$db_name}. " . 
                (!$force ? "Try using force." : $e);
            }

            return "Successfully created database {$db_name}.";
        }

        /**
         * function create_user
         * Creates a new sql user.
         * Force first removes user.
         */
        public function create_user(string $user_name, string $hostname = "%", bool $force = false) {
            try {
                if ($force) {
                    $this->pdo->exec("DROP USER IF EXISTS `$user_name`");
                }

                $this->pdo->exec("CREATE USER `$user_name`");

            } catch (PDOException $e) { 
                return "Failed to create user {$user_name}@{$hostname}. " . 
                (!$force ? "Try using force." : $e);
            }

            return "Successfully created user {$user_name}@{$hostname}.";
        }

        /**
         * function drop_db
         * Drops an existing database. 
         */
        public function drop_db(string $db_name) { 
            // TODO: implement function that drops db.
        }

        /**
         * function drop_user
         * removes an already existing user.
         */
        public function drop_user(string $user_name, string $hostname = hostname) {
            // TODO: Implement function that removes a user.
        }

        /**
         * function set_permissions
         * Set permission to access db for user.
         */
        public function set_permissions(string $user_name, string $hostname, string $db_name) {
            // TODO: implement function
        }

        /**
         * Runs an sql file using the class variable pdo.
         */
        public function run_sql_file(string $file_name): bool {
            // TODO: Implement function that runs an sql file.
        }
    }