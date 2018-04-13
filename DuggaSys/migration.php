<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

/**
 *  Generate and executes queries
 *
 * @param $migrationArray   Array of columns
 * @param $version          Version to execute
 * @return array            Message for each migration
 */
function parser($migrationArray, $version) {
    $message = array();

	foreach($migrationArray as $key => $value) {
		if ($value['version'] <= $version) {
            foreach ($value[0] as $col) {
                // Get the type of action to do
                $type = $col[0];
                $col = array_slice($col, 1);

                if ($type == 'create') {

                    $keyString = !isset($col[4]) ? "" :", " . $col[4] ;
                    $query = "CREATE TABLE IF NOT EXISTS $col[0]($col[1] $col[2] $col[3] $keyString) ENGINE=InnoDB;";
                    $message[] = queryExecute($query);
                } else if ($type == 'column') {
                    $modifier = queryExecute("SELECT ".$col[1]." FROM " . $col[0]) == "Success" ? "MODIFY COLUMN" : "ADD" ;
                    $query = "ALTER TABLE $col[0] $modifier $col[1] $col[2] $col[3];";
                    $message[] = queryExecute($query);

                    if (count($col) >= 5) {
                        $message[] = queryExecute("ALTER TABLE $col[0] ADD $col[4]");
                    }
                } else if ($type == 'insert') {
                    $keys = implode(", ", array_keys($col['values']));
                    $values = implode("', '", $col['values']);
                    $query = "INSERT INTO $col[0]($keys) VALUES ('$values')";
                    echo $query;
                    $message[] = queryExecute($query);
                }
            }
		}
	}
	return $message;
}

/**
 *  Execute a query to database
 *
 * @param $query    Query to be executed
 * @return string
 */
function queryExecute($query) {
    global $pdo;

    $stmt = $pdo->prepare($query);
    if ($stmt->execute()) {
        return "Success";
    } else {
        return $stmt->errorInfo()[2];
    }
}

$migrationArray = array(
    [

        'version' => 'v0.01',
        [

            ['create', 'user', 'uid', 'int', 'UNSIGNED NOT NULL AUTO_INCREMENT', 'PRIMARY KEY(uid)'],
			      ['column', 'user', 'username', 'varchar(80)', 'NOT NULL'],
            ['column', 'user', 'firstname', 'varchar(50)', ''],
            ['column', 'user', 'lastname', 'varchar(50)', ''],
            ['column', 'user', 'ssn', 'varchar(20)', ''],
            ['column', 'user', 'password', 'varchar(225)', 'NOT NULL'],
            ['column', 'user', 'lastupdated', 'timestamp', 'NOT NULL'],
            ['column', 'user', 'addedtime', 'datetime', ''],
            ['column', 'user', 'lastvisit', 'datetime', ''],
            ['column', 'user', 'newpassword', 'tinyint(1)', ''],
            ['column', 'user', 'creator', 'int', 'UNSIGNED'],
            ['column', 'user', 'superuser', 'tinyint(1)', ''],
            ['column', 'user', 'email', 'varchar(256)', ''],
            ['column', 'user', 'class', 'varchar(10)', ''],
            ['column', 'user', 'totalHp', 'decimal(4,1)', ''],
            ['column', 'user', 'securityquestion', 'varchar(256)', ''],
            ['column', 'user', 'securityquestionanswer', 'varchar(256)', ''],
            ['column', 'user', 'requestedpasswordchange', 'tinyint(1)', 'UNSIGNED NOT NULL'],


            ['create', 'course', 'cid', 'int', 'UNSIGNED NOT NULL AUTO_INCREMENT', 'PRIMARY KEY(cid)'],
            ['column', 'course', 'coursecode', 'varchar(45)', ''],
            ['column', 'course', 'coursename', 'varchar(80)', ''],
            ['column', 'course', 'created', 'datetime', ''],
            ['column', 'course', 'creator', 'int', 'UNSIGNED NOT NULL', 'FOREIGN KEY (creator) REFERENCES user(uid)'],
            ['column', 'course', 'visibility', 'tinyint(3)', 'UNSIGNED NOT NULL'],
            ['column', 'course', 'updated', 'timestamp', 'NOT NULL'],
            ['column', 'course', 'activeversion', 'varchar(8)', ''],
            ['column', 'course', 'activeedversion', 'varchar(8)', ''],
            ['column', 'course', 'capacity', 'int(5)', ''],
            ['column', 'course', 'hp', 'decimal(4,1)', 'NOT NULL'],
            ['column', 'course', 'courseHttpPage', 'varchar(2000)', ''],

        ],
    ],
    [

        'version' => 'v0.01',
		[
		    ['insert', 'user', 'values'=> [
                    'username' => 'Hugo',
                    'password' => '$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q',
                    'lastupdated' => '2018-04-10 15:25:46',
                    'requestedpasswordchange' => 0,
                ]
            ],
            ['insert', 'user', 'values'=> [
                    'username' => 'Rudolf',
                    'password' => '$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q',
                    'lastupdated' => '2018-04-10 15:25:46',
                    'requestedpasswordchange' => 0,
                ]
            ]
		],
    ],
);

var_dump(parser($migrationArray, "v0.01"));
