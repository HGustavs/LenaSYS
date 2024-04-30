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
            // Check if the file or directory exists
            if (!file_exists($path)) {
                return ['error' => 'File or directory does not exist'];
            }
        
            // Get file permissions
            $perms = fileperms($path);
        
            $info = [
                'is_readable' => is_readable($path),
                'is_writable' => is_writable($path),
                'is_executable' => is_executable($path),
                'permissions' => ''
            ];
        
            // Owner permissions
            $info['permissions'] .= (($perms & 0x0100) ? 'r' : '-');
            $info['permissions'] .= (($perms & 0x0080) ? 'w' : '-');
            $info['permissions'] .= (($perms & 0x0040) ? 
                                    (($perms & 0x0800) ? 's' : 'x' ) :
                                    (($perms & 0x0800) ? 'S' : '-'));
        
            // Group permissions
            $info['permissions'] .= (($perms & 0x0020) ? 'r' : '-');
            $info['permissions'] .= (($perms & 0x0010) ? 'w' : '-');
            $info['permissions'] .= (($perms & 0x0008) ? 
                                    (($perms & 0x0400) ? 's' : 'x' ) :
                                    (($perms & 0x0400) ? 'S' : '-'));
        
            // Other permissions
            $info['permissions'] .= (($perms & 0x0004) ? 'r' : '-');
            $info['permissions'] .= (($perms & 0x0002) ? 'w' : '-');
            $info['permissions'] .= (($perms & 0x0001) ? 
                                    (($perms & 0x0200) ? 't' : 'x' ) :
                                    (($perms & 0x0200) ? 'T' : '-'));
        
            return $info;
        }
        

        /**
         * function get_owner
         * Get the owner of a file or directory.
         */
        public static function get_owner(string $path): string {
            // TODO: implement function.
        } 
    }