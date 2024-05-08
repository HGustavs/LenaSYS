<?php
    class TestdataSetup {
        private $pdo;
        
        public function __construct(PDO $pdo) {
            $this-> pdo = $pdo;
        }

        /**
         * function add_language_support
         * Add language support for code viewer.
         */
        public function add_language_support(string $language) {
            // TODO: Implement function that adds support for syntax highlightning.
        }

        /**
         * function add_test_course
         * Adds test course.
         */
        public function add_test_course() {
            // TODO: Implement function that adds test course.
        }

        /**
         * function add_demo_course
         * Adds demo course.
         */
        public function add_demo_course() {
            // TODO: Implement function that adds demo course.
        }

        /**
         * function add_testdata
         * Adds testdata to given course.
         */
        public function add_testdata() {
            // TODO: Implement function that adds testdata.
        }
    }