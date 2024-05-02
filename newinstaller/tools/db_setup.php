<?php
    class DBSetup {
        private $pdo, $db_name, $db_user, $db_user_password, $hostname = null;

        public function __construct(PDO $pdo, string $db_name = null, string $db_user = null, string $db_user_password = null, string $hostname = '%') {
            $this->pdo = $pdo;
            $this->db_name = $db_name;
            $this->db_user = $db_user;
            $this->db_user_password = $db_user_password;
            $this->hostname = $hostname;
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

                return [
                    'success' => false,
                    'message' => "Failed to create database {$db_name}. " . 
                    (!$force ? "Try using force. " : "") . $e->getMessage()
                ];
            }

            return [
                'success' => true,
                'message' => "Successfully created database {$db_name}."
            ];
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

            } catch (PDOException $e) { 
                
                return [
                    'success' => false,
                    'message' => "Failed to create user {$user_name}@{$hostname}. " . 
                    (!$force ? "Try using force." : $e->getMessage())
                ];
            }

            return [
                'success' => true,
                'message' => "Successfully created user {$user_name}@{$hostname}."
            ];
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

                return [
                    'success' => true,
                    'message' => "Successfully removed database {$db_name}."
                ];
            } catch (PDOException $e) {
                return [
                    'success' => false,
                    'message' => "Failed to remove database {$db_name}. {$e->getMessage()}"
                ];
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

                return [
                    'success' => true,
                    'message' => "Successfully removed user {$user_name}."
                ];
            } catch (PDOException $e) {
                return [
                    'success' => false,
                    'message' => "Failed to remove user {$user_name}. " . $e->getMessage()
                ];
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
                $hostname = $hostname ?? $this->hostname;
                $hostname = $hostname ?? '%';

                $this->sanitize($db_name . $user_name);
                $this->sanitize_hostname($hostname);

                $this->pdo->exec("GRANT ALL PRIVILEGES ON `$db_name`.* TO `$user_name`@`$hostname`");

                return [
                    'success' => true,
                    'message' => "Successfully set permissions for {$user_name}@{$hostname} on {$db_name}."
                ];
            } catch (PDOException $e) {
                return [
                    'success' => false,
                    'message' => $e->getCode() == 42000 
                        ? "User does not exist. Failed to set permissions for {$user_name}@{$hostname} on {$db_name}."
                        : "Failed to set permissions for {$user_name}@{$hostname} on {$db_name}: " . $e->getMessage()
                ];
            }
        }

        /**
         * Runs an sql file using the class variable pdo.
         */
        public function run_sql_file(string $file_name): bool {
            // TODO: Implement function that runs an sql file.
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
         * Sanitize data, only allow letters, numbers and underscores.
         * Also ensure that they contain start and end of string.
         */
        private function sanitize_hostname(string $sql): string {
            if (!preg_match('/^[a-zA-Z0-9_%]+$/', $sql)) {
                throw new PDOException("Invalid hostname detected.");
            }
            return $sql;
        }
    }