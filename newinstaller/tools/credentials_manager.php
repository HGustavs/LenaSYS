<?php
    class CredentialsManager {
        private $path;

        public function __construct($path) {
            $this->path = $path;
        }

        /**
         * function set_db_credentials
         * save database credentials to file.
         */
        public function set_db_credentials(string $username, string $password) {
            // TODO: Implement function.
        }

        /**
         * function set_hostname
         * set the db hostname
         */
        public function set_hostname($hostname) {
            // TODO: Implement function.
        }

        /**
         * function set_db_name
         * set the db name
         */
        public function set_db_name(string $db_name) {
            // TODO: Implement function.
        }

        /**
         * function get_db_username
         * get the db username.
         */
        public function get_db_username(): string {
            // TODO: Implement function.
        }

        /**
         * function get_db_password
         * get the db password.
         */
        public function get_db_password(): string {
            // TODO: Implement function.
        }

        /**
         * function get_hostname
         * get the saved hostname
         */
        public function get_hostname(): string {
            // TODO: Implement function.
        }

        /**
         * function get_db_name
         * get the saved db name
         */
        public function get_db_name(): string {
            // TODO: Implement function.
        }
    }