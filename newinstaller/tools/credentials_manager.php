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

            $fileContent .= "\n";
            $fileContent .= "define('DB_USER', '{$username}');\n";
            $fileContent .= "define('DB_PASSWORD', '{$password}');\n";
        

            file_put_contents($this->path, $fileContent);

            // Store credentials in class properties
            $this->dbUser = $username;
            $this->dbPassword = $password;
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

        private function check_file_exists(): bool {
            $filePath = '../../../corusesyspw.php'; // Relative path to the credentials file
            // Checks if file exists
            if (!file_exists($filePath)) {
                return false;
            }
            return true; // Return true if the file exists or was successfully created
        }

        private function configuration_exists(): bool {
            if(!Permissions::has_permission($this->path)) {
                return false;
            }

            if(!$this->check_file_exists()) {
                file_put_contents($this->path, "<?php");
            }

            // Adds php-tag if file alredy exists without one.
            $fileContent = file_get_contents($this->path);
            if (!strpos($fileContent, '<?php')) {
                $fileContent = "<?php";
            }

            return true;
        }
    }