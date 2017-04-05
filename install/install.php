<head>
    <title>Install LenaSYS!</title>
</head>
<body>
<?php
$fileIsCreated = false;
if (isset($_GET["mode"])) {
    echo "<h1>Installation</h1>";
    echo "<hr>";
    flush();
    /* Not yet implemented. TODO: Ask about how this should be done in a safe way.
    if ($_GET["mode"] == "createfile"){
        makeCoursesysFile($_POST["username"], $_POST["password"], $_POST["servername"], $_POST["database"], $_POST["putfilehere"]);
        $fileIsCreated = true;
    }
    if ($fileIsCreated) {
        exit ($_POST["putfilehere"] . "/coursesyspw.php was created and filled.");
    }
    */
}
?>
    <h1>Fill out all fields to install LenaSYS and create database.</h1>
    <form action="install.php" method="post">
        <table cellspacing="0px">
            <tr align="left">
                <th valign=top><h2>New/Existing MySQL user and DB</h2></th>
                <th valign=top bgcolor="#EEEEEE"><h2>MySQL Root Login</h2></th>
                <th valign=top><h2>Test Data</h2></th>
            </tr>
            <tr>
                <td valign=top width="20%">
                    Enter new MySQL user. <br>
                    <input type="text" name="newUser" placeholder="Username" /> <br>
                    Enter password for MySQL user. <br>
                    <input type="password" name="password" placeholder="Password" /> <br>
                    Enter new database name. <br>
                    <input type="text" name="DBName" placeholder="Database name" /> <br>
                    Enter hostname (e.g localhost). <br>
                    <input type="text" name="hostname" placeholder="Hostname" /> <br>
                </td>
                <td valign=top width="30%" bgcolor="#EEEEEE">
                    Enter root user. <br>
                    <input type="text" name="mysqlRoot" placeholder="Root" /> <br>
                    Enter password for MySQL root. <br>
                    <input type="password" name="rootPwd" placeholder="Root Password" /> <br>
                </td>
                <td valign=top width="40%">
                    <input type="checkbox" name="createDB" value="Yes" checked/>
                    Create new database. <br><hr>
                    <input type="checkbox" name="fillDB" value="Yes" checked/>
                    Include test data. <br><br>
                    <b>Language keyword highlighting support.<br></b>
                    <input type="checkbox" name="html" value="Yes" checked/> HTML <br>
                    <input type="checkbox" name="java" value="Yes" checked/> Java <br>
                    <input type="checkbox" name="php" value="Yes" checked/> PHP <br>
                    <input type="checkbox" name="plain" value="Yes" checked/> Plain Text <br>
                    <input type="checkbox" name="sql" value="Yes" checked/> SQL <br>
                    <input type="checkbox" name="sr" value="Yes" checked/> SR <br>
                </td>
            </tr>
            <tr>
                <td colspan="3" bgcolor="#FFCCCC">
                    <input type="checkbox" name="writeOverDB" value="Yes" />
                    <b><-- Check the box if you want to write over existing database and user<br>
                        <span style='color: red;'>(WARNING: THIS WILL REMOVE ALL DATA IN PREVIOUS DATABASE)</span></b><br>
                </td>
            </tr>
        </table>
        <table width="100%">
            <tr>
                <td bgcolor="#EEEEEE">
                    <input type="submit" name="submitButton" value="Install!"/>
                    <input type="reset" value="Clear"/>
                </td>
            </tr>
        </table>
    </form>

    <?php

    # Call JS to show alert about permission.
    $putFileHere = dirname(getcwd(), 1); // Path to lenasys
    echo '<script>',
        'alert("!!!!!!BEFORE YOU START!!!!!!\nMake sure you set ownership of the directory LenaSYS is located in to the group \'www-data\'.\n" +
                "\nTo do this run the command:\nsudo chown -R www-data:www-data ' . $putFileHere . '\n");',
    '</script>';

    if (isset($_POST["submitButton"])) {
        ob_end_clean(); // Remove form and start installation.

        echo "<h1>Installation</h1>";
        echo "<hr>";
        flush();

        # Test permissions on directory before starting installation.
        if(!mkdir("{$putFileHere}/testPermissionsForInstallationToStartDir", 0777)) {
            exit ("<span style='color: red;' />Permissions on {$putFileHere} not set correctly, please restart the installation.</span>");
        } else {
            if (!rmdir("{$putFileHere}/testPermissionsForInstallationToStartDir")) {
                exit ("<span style='color: red;' />Permissions on {$putFileHere} not set correctly, please restart the installation.</span>");
            } else {
                echo "<span style='color: green;' />Permissions on {$putFileHere} set correctly.</span><br>";
            }
        }

        # Check if all fields are filled.
        $fields = array("newUser", "password", "DBName", "hostname", "mysqlRoot", "rootPwd");
        foreach ($fields AS $fieldname) { //Loop trough each field
            if (!isset($_POST[$fieldname]) || empty($_POST[$fieldname])) {
                exit ("<span style='color: red;' />Please fill all fields.</span>");
            }
        }

        # Only create DB if box is ticked.
        if (isset($_POST["createDB"]) && $_POST["createDB"] == 'Yes') {

            $username = $_POST["newUser"];
            $password = $_POST["password"];
            $databaseName = $_POST["DBName"];
            $serverName = $_POST["hostname"];

            $rootUser = $_POST["mysqlRoot"];
            $rootPwd = $_POST["rootPwd"];

            # Connect to database with root access.
            try {
                $connection = new PDO("mysql:host=$serverName", $rootUser, $rootPwd);
                // set the PDO error mode to exception
                $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                echo "<span style='color: green;' />Connected successfully to {$serverName}.</span><br>";
            } catch (PDOException $e) {
                echo "<span style='color: red;' />Connection failed: " . $e->getMessage() . "</span><br>";
            }
            flush();

            # If checked, write over existing database and user
            if (isset($_POST["writeOverDB"]) && $_POST["writeOverDB"] == 'Yes') {
                # User
                try {
                    $connection->query("DELETE FROM mysql.user WHERE user='{$username}';");
                    echo "<span style='color: green;' />Successfully removed old user, {$username}.</span><br>";
                } catch (PDOException $e) {
                    echo "<span style='color: red;' />User with name {$username} 
                            does not already exist. Will only make a new one (not write over).</span><br>";
                }
                flush();
                # Database
                try {
                    $connection->query("DROP DATABASE {$databaseName}");
                    echo "<span style='color: green;' />Successfully removed old database, {$databaseName}.</span><br>";
                } catch (PDOException $e) {
                    echo "<span style='color: red;' />Database with name {$databaseName} 
                            does not already exist. Will only make a new one (not write over).</span><br>";
                }
                flush();
            }

            # Create new database
            try {
                $connection->query("CREATE DATABASE {$databaseName}");
                echo "<span style='color: green;' />Database with name {$databaseName} created successfully.</span><br>";
            } catch (PDOException $e) {
                echo "<span style='color: red;' />Database with name {$databaseName} could not be created. Maybe it already exists...</span><br>";
            }
            flush();

            # Create new user and grant privileges to created database.
            try {
                $connection->query("FLUSH PRIVILEGES");
                $connection->query("CREATE USER '{$username}'@'{$serverName}' IDENTIFIED BY '{$password}'");
                $connection->query("GRANT ALL PRIVILEGES ON *.* TO '{$username}'@'{$serverName}'");
                $connection->query("FLUSH PRIVILEGES");
                echo "<span style='color: green;' />Successfully created user {$username}.</span><br>";
            } catch (PDOException $e) {
                echo "<span style='color: red;' />Could not create user with name {$username}, maybe it already exists...</span><br>";
            }
            flush();

            /**************************** Init database. *************************************/
            $initQuery = file_get_contents("SQL/init_db.sql");

            # This loop will find comments in the sql file and remove these.
            # Comments are removed because some comments included semi-colons which wont work.
            while(true) {
                $startPos = strpos($initQuery, "/*");
                $endPos = strpos($initQuery, "*/");
                if ($startPos === false || $endPos === false) {
                    break;
                }
                $removeThisText = substr($initQuery, $startPos, ($endPos + 2) - $startPos);
                $initQuery = str_replace($removeThisText, '', $initQuery);
            }

            # Split the sql file at semi-colons to send each query separated.
            $initQueryArray = explode(";", $initQuery);
            $initSuccess = false;
            try {
                $connection->query("USE {$databaseName}");
                # Use this var if several statements should be called at once (functions).
                $queryBlock = '';
                $blockStarted = false;
                foreach ($initQueryArray AS $query) {
                    $completeQuery = $query . ";";

                    # This commented code in this block could work if delimiters are fixed/removed in sql files.
                    # TODO: Fix handling of delimiters. Now this part only removes code between them.
                    if (!$blockStarted && strpos(strtolower($completeQuery), "delimiter //")) {
                        $blockStarted = true;
                        #$queryBlock = $completeQuery;
                    } else if ($blockStarted && strpos(strtolower($completeQuery), "delimiter ;")) {
                        $blockStarted = false;
                        #$queryBlock = $queryBlock . $completeQuery;
                        #$connection->query($queryBlock);
                    } else if ($blockStarted) {
                        #$queryBlock = $queryBlock . $completeQuery;
                    } else {
                        if (trim($query) != '') { // do not send if empty query.
                            $connection->query($completeQuery);
                        }
                    }
                }
                $initSuccess = true;
                echo "<span style='color: green;' />Initialization of database complete. </span><br>";
            } catch (PDOException $e) {
                echo "<span style='color: red;' />Failed initialization of database because of query (in init_db.sql): </span><br>";
                echo "<code><textarea rows='2' cols='70' readonly style='resize:none'>{$completeQuery}</textarea></code><br><br>";
            }
            flush();

            /*************** Fill database with test data if this was checked. ****************/
            if (isset($_POST["fillDB"]) && $_POST["fillDB"] == 'Yes' && $initSuccess) {
                addTestData("testdata", $connection);
                # Add a language (for a existing file) in this array to add it to database.
                /*$languages = array("php", "sql", "sr", "java", "html", "plain");
                foreach ($languages AS $language) {
                    addTestData("keywords_{$language}", $connection);
                } */

                # Check which languages to add from checkboxes.
                $checkBoxes = array("html", "java", "php", "plain", "sql", "sr");
                foreach ($checkBoxes AS $boxName) { //Loop trough each field
                    if (!isset($_POST[$boxName]) || empty($_POST[$boxName])) {
                        echo "Skipped keywords for {$boxName}. <br>";
                    } else {
                        if ($_POST[$boxName] == 'Yes') {
                            addTestData("keywords_{$boxName}", $connection);
                        }
                    }
                }

                /************* Copy test code files to the right place *****************/
                if(@!mkdir("{$putFileHere}/courses", 0770, true)){
                    echo "Did not create courses directory, it already exists.<br>";
                } else {
                    echo "<span style='color: green;' />Created the directory '{$putFileHere}/courses'.</span><br>";
                }
                copyTestFiles("{$putFileHere}/install/courses/global/", "{$putFileHere}/courses/1/");

            } else {
                echo "Skipped filling database with test data.<br>";
            }

        } else {
            echo "Skipped creating database.<br>";
        }

        echo "<b>Installation finished.</b><br><hr>";
        flush();

        # All this code prints further instructions to complete installation.
        $putFileHere = dirname(getcwd(), 2); // Path to lenasys
        echo "<br><b><span style='color: red;' />To make installation work</span> please make a 
            file named 'coursesyspw.php' at {$putFileHere} with some code.</b><br>";

        echo "<b>Bash command to complete all this (Copy all code below and paste it into bash shell as one statement):</b><br>";
        echo "<textarea rows='6' cols='70' readonly style='resize:none'>";
        echo 'sudo printf "' . htmlspecialchars("<?php") . '\n';
        echo 'define(\"DB_USER\",\"' . $username . '\");\n';
        echo 'define(\"DB_PASSWORD\",\"' . $password . '\");\n';
        echo 'define(\"DB_HOST\",\"' . $serverName . '\");\n';
        echo 'define(\"DB_NAME\",\"' . $databaseName . '\");\n';
        echo htmlspecialchars("?>") . '" > ' . $putFileHere . '/coursesyspw.php';
        echo "</textarea><br>";

        /* Not yet implemented - TODO: Ask about how this should be done in a safe way.
        echo "<form action='install.php?mode=createfile' method='post'>";
        echo '<input type="submit" name="makeCoursesysFileButton" value="Make!"/><br>';
        echo '<input name="username" type="hidden" value="'. $username . '">';
        echo '<input name="password" type="hidden" value="'. $password . '">';
        echo '<input name="servername" type="hidden" value="'. $serverName . '">';
        echo '<input name="database" type="hidden" value="'. $databaseName . '">';
        echo '<input name="putfilehere" type="hidden" value="'. $putFileHere . '">';
        echo "</form>";
        */

        echo "<b> Now create a directory named 'log' (if you dont already have it)<br> 
                with a sqlite database inside at " . $putFileHere . " with permissions 777<br>
                (Copy all code below and paste it into bash shell as one statement to do this).</b><br>";
        echo "<textarea rows='4' cols='70' readonly style='resize:none'>";
        echo "mkdir " . $putFileHere . "/log && ";
        echo "chmod 777 " . $putFileHere . "/log && ";
        echo "sqlite3 " . $putFileHere . '/log/loglena4.db "" && ';
        echo "chmod 777 " . $putFileHere . "/log/loglena4.db";
        echo "</textarea><br>";
    }

    function makeCoursesysFile($username, $password, $serverName, $databaseName, $putFileHere){
        # Make and edit the coursesyspw.php file
        $fileContent = "<?php\ndefine(\"DB_USER\",\"{$username}\");\n" .
            "define(\"DB_PASSWORD\",\"{$password}\");\n" .
            "define(\"DB_HOST\",\"{$serverName}\");\n" .
            "define(\"DB_NAME\",\"{$databaseName}\");\n" .
            "?>";
        file_put_contents("{$putFileHere}/coursesyspw.php", $fileContent);
    }

    # Function to add testdata from specified file. Parameter file = sql file name without .sql.
    function addTestData($file, $connection){
        $testDataQuery = @file_get_contents("SQL/{$file}.sql");

        if ($testDataQuery === FALSE) {
            echo "<span style='color: red;' />Could not find SQL/{$file}.sql, skipped this test data.</span><br>";
        } else {
            # Split SQL file at semi-colons to send each query separated.
            $testDataQueryArray = explode(";", $testDataQuery);
            try {
                foreach ($testDataQueryArray AS $query) {
                    $completeQuery = $query . ";"; // Add semi-colon to each query.
                    if (trim($query) != '') { // do not send if empty query.
                        $connection->query($completeQuery);
                    }
                }
                echo "<span style='color: green;' />Successfully filled database with test data from {$file}.sql.</span><br>";
            } catch (PDOException $e) {
                echo "<span style='color: red;' />Failed to fill database with data because of query in {$file}.sql (Skipped the rest of this file):</span><br>";
                echo "<code><textarea rows='2' cols='70' readonly style='resize:none'>{$completeQuery}</textarea></code><br><br>";
            }
        }
        flush();
    }

    # Function to copy test files
    function copyTestFiles($fromDir,$destDir) {
        $dir = opendir($fromDir);
        @mkdir($destDir);
        while (false !== ($copyThis = readdir($dir))) {
            if (($copyThis != '.') && ($copyThis != '..')) {
                copy($fromDir . '/' . $copyThis, $destDir . '/' . $copyThis);
            }
        }
        closedir($dir);
        echo "<span style='color: green;' />Successfully filled {$destDir} with example files.</span><br>";
    }
    ?>
</body>
