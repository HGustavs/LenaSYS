<?php
    class DBSetup {
        private $pdo;
        private $db_name;
        private $db_user;

        public function __construct(PDO $pdo, string $db_name, string $db_user) {
            $this->pdo = $pdo;
            $this->db_name = $db_name;
            $this->db_user = $db_user;
        }

        /**
         * function create_db
         * Create db using class variables.
         * Force first drops any existing database.
         */
        public function create_db(bool $force = false) {
            // TODO: Implement function that creates a db.
        }

        /**
         * function create_user
         * Creates a new sql user.
         * Force first removes user.
         */
        public function create_user (string $hostname = "%", bool $force = false) {
            // TODO: Implement function that creates user using class variables.
        }

        /**
         * function drop_db
         * Drops an existing database. 
         */
        public function drop_db() { 
            // TODO: implement function that drops db.
        }

        /**
         * function drop_user
         * removes an already existing user.
         */
        public function drop_user(string $hostname = hostname) {
            // TODO: Implement function that removes a user.
        }

        /**
         * function set_permissions
         * Set permission to access db for user.
         */
        public function set_permissions() {
            // TODO: implement function
        }

        /**
         * Runs an sql file using the class variable pdo.
         */
        public function run_sql_file(string $file_name): bool {
            // TODO: Implement function that runs an sql file.
        }
    }