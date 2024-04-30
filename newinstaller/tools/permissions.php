<?php
    class Permissions {

        /**
         * function has_permission
         * Check if php has access to modify a file or directory.
         */
        public static function has_permission(string $path): bool {
            return is_readable($path) && is_writable($path);
        }

        /**
         * function get_permissions
         * Get the permissions set on a file or directory.
         */
        public static function get_permissions(string $path): array {
            
        }

        /**
         * function get_owner
         * Get the owner of a file or directory.
         */
        public static function get_owner(string $path): string {
            // TODO: implement function.
        } 
    }