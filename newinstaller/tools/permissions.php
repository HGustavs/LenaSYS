<?php
class Permissions {

    /**
     * function has_permission
     * Check if php has access to modify a file or directory.
     */
    public static function has_permission(string $path): array {
        try {
            if (!file_exists($path)) {
                throw new Exception("File does not exist");
            }

            return self::handle_success("Successfully retrieved file access", (is_readable($path) && is_writable($path)));
        } catch(Exception $e) {
            return self::handle_exception($e, "Could not retrieved file permission");
        }
    }

    /**
     * function has_write_permission
     * Recursively check parent directories until write access is determined.
     * Returns true or false.
     */
    public static function has_write_permission(string $path): bool {
        // Find the nearest existing parent directory
        $directory = $path;
        while (!file_exists($directory)) {
            $directory = dirname($directory);
        }

        return is_writable($directory);
    }

    /**
     * function get_permissions
     * Get the permissions set on a file or directory.
     */
    public static function get_permissions(string $path): array {
        try {
            if (!file_exists($path)) {
                throw new Exception("File does not exist");
            }

            $perms = fileperms($path);
            $info = [
                'is_readable' => is_readable($path),
                'is_writable' => is_writable($path),
                'is_executable' => is_executable($path),
                'permissions' => self::decode_permissions($perms)
            ];

            return self::handle_success("Successfully got permissions", $info);
        } catch (Exception $e) {
            return self::handle_exception($e, "Unable to get permissions");
        }
    }

    /**
     * function decode_permissions
     * Decode file permissions into a readable format.
     */
    private static function decode_permissions(int $perms): string {
        $translate = [
            ['owner' => 0x0100, 'group' => 0x0020, 'other' => 0x0004],
            ['owner' => 0x0080, 'group' => 0x0010, 'other' => 0x0002],
            ['owner' => 0x0040, 'group' => 0x0008, 'other' => 0x0001],
            ['owner' => 0x0800, 'group' => 0x0400, 'other' => 0x0200]
        ];

        $permissions = '';
        foreach (['owner', 'group', 'other'] as $key) {
            $permissions .= ($perms & $translate[0][$key] ? 'r' : '-');
            $permissions .= ($perms & $translate[1][$key] ? 'w' : '-');
            $permissions .= ($perms & $translate[2][$key] ? 
                            ($perms & $translate[3][$key] ? ($key == 'other' ? 't' : 's') : 'x') :
                            ($perms & $translate[3][$key] ? ($key == 'other' ? 'T' : 'S') : '-'));
        }

        return $permissions;
    }
            
    /**
     * function get_owner
     * Get the owner of a file or directory.
     */
    public static function get_owner(string $path): array {
        try {
            // Check if the file or directory exists
            if (!file_exists($path)) {
                throw new Exception("File or directory does not exist");
            }
        
            // Get the file owner's UID
            $uid = fileowner($path);
            $message = "";

            if (!function_exists('posix_getpwuid')) {
                return self::handle_success("Successfully retrieved owner. Could not convert id to name.", (string)$uid);
            }

            $userInfo = posix_getpwuid($uid);

            if (!$userInfo) {
                return self::handle_success("Successfully retrieved owner. Could not convert id to name.", (string)$uid);
            }

            return self::handle_success("Successfully retrieved owner. ", $userInfo['name']);
        } catch (Exception $e) {
            return self::handle_exception($e, "Failed to get owner. ");
        }   
    }

    /**
     * function get_group
     * Get the group of a file or directory.
     */
    public static function get_group(string $path): array {
        try {
            // Check if the file or directory exists
            if (!file_exists($path)) {
                throw new Exception("File or directory does not exist. ");
            }
        
            // Get the file owner's UID
            $gid = filegroup($path);

            if (!function_exists('posix_getgrgid')) {
                return self::handle_success("Successfully retrieved group. Could not convert id to name. ", (string)$gid);
            }

            $groupInfo = posix_getgrgid($gid);

            if (!$groupInfo) {
                return self::handle_success("Successfully retrieved group. Could not convert id to name. ", (string)$gid);
            }

            return self::handle_success("Successfully retrieved group. ", $groupInfo['name']);
        } catch (Exception $e) {
            return self::handle_exception($e, "Could not retrieve group: ");
        }
    }

    /**
     * function get_process_user
     * get the user currently running the php server.
     */
    public static function get_process_user(): array {
        try {
            if (!function_exists('posix_geteuid') || !function_exists('posix_getpwuid')) {
                throw new Exception("POSIX functions are not available");
            }
    
            $euid = posix_geteuid();
            $userInfo = posix_getpwuid($euid);
            $userInfo = $userInfo ? $userInfo['name'] : "User information not available";

            return self::handle_success("Successfully retrieved user information.", $userInfo);
        } catch(Exception $e) {
            return self::handle_exception($e, "Could not retrieve process user");
        }
    }

    public static function change_chmod(string $path, $mode) {
        try {
            chmod($path, $mode);
        } catch(Exception $e) {
            return self::handle_exception($e, "Could not change file permission");
        }
    }

    private static function handle_success(string $action, $data) {
        return [
            "success"=> true,
            "message"=> $action,
            "data"=> $data
        ];
    }

    private static function handle_exception($e, string $action) {
        return [
            "success"=> false,
            "message"=> "{$action}: {$e}",
            "data"=> null
        ];
    }
}