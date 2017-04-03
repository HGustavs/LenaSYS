<body>

    <h1>Fill out all fields to install LenaSYS and create database.</h1>
    <form action="install.php" method="post">
        <table cellspacing="20px">
            <tr>
                <td>
                    Enter new MySQL user. <br>
                    <input type="text" name="newUser" placeholder="Username" /> <br>
                    Enter password for MySQL user. <br>
                    <input type="password" name="password" placeholder="Password" /> <br>
                    Enter new database name. <br>
                    <input type="text" name="DBName" placeholder="Database name" /> <br>
                    Enter hostname (e.g localhost). <br>
                    <input type="text" name="hostname" placeholder="Hostname" /> <br>
                </td>
                <td align=left valign=top>
                    Enter root user. <br>
                    <input type="text" name="mysqlRoot" placeholder="Root" /> <br>
                    Enter password for MySQL root. <br>
                    <input type="password" name="rootPwd" placeholder="Root Password" /> <br>
                    <input type="checkbox" name="createDB" value="Yes" />
                    <-- Check the box if you want to create a new database. <br>
                    <input type="checkbox" name="fillDB" value="Yes" />
                    <-- Check the box if you want to fill the new database with test data. <br><br>
                    <input type="checkbox" name="writeOverDB" value="Yes" />
                    <b><-- Check the box if you want to write over existing database and user<br>
                        <span style='color: red;'>(WARNING: THIS WILL REMOVE ALL DATA IN PREVIOUS DATABASE)</span></b><br>
                </td>
            </tr>
        </table>
        <input type="submit" name="submitButton" value="Install!"/>
        <input type="reset" value="Clear"/>
    </form>

    <?php if (isset($_POST["submitButton"])) {
        ob_end_clean(); // Remove form and start installation.
        echo "<h1>Installation</h1>";
        echo "<hr>";
        flush();

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
                echo "<span style='color: green;' />Connected successfully to " . $serverName . ".</span><br>";
            } catch (PDOException $e) {
                echo "<span style='color: red;' />Connection failed: " . $e->getMessage() . "</span><br>";
            }
            flush();

            # If checked, write over existing database and user
            if (isset($_POST["writeOverDB"]) && $_POST["writeOverDB"] == 'Yes') {
                # User
                try {
                    $connection->query("DELETE FROM mysql.user WHERE user='" . $username . "';");
                    echo "<span style='color: green;' />Successfully removed old user, " . $username . ".</span><br>";
                } catch (PDOException $e) {
                    echo "<span style='color: red;' />User with name " . $username .
                        " does not already exist. Will only make a new one (not write over).</span><br>";
                }
                flush();
                # Database
                try {
                    $connection->query("DROP DATABASE " . $databaseName);
                    echo "<span style='color: green;' />Successfully removed old database, " . $databaseName . ".</span><br>";
                } catch (PDOException $e) {
                    echo "<span style='color: red;' />Database with name " . $databaseName .
                        " does not already exist. Will only make a new one (not write over).</span><br>";
                }
                flush();
            }

            # Create new database
            try {
                $connection->query("CREATE DATABASE " . $databaseName);
                echo "<span style='color: green;' />Database with name " . $databaseName . " created successfully.</span><br>";
            } catch (PDOException $e) {
                echo "<span style='color: red;' />Database with name " . $databaseName . " could not be created. Maybe it already exists...</span><br>";
            }
            flush();

            # Create new user and grant privileges to created database.
            try {
                $connection->query("FLUSH PRIVILEGES");
                $connection->query("CREATE USER '" . $username . "'@'" . $serverName . "' IDENTIFIED BY '" . $password . "'");
                $connection->query("GRANT ALL PRIVILEGES ON *.* TO '" . $username . "'@'" . $serverName . "'");
                $connection->query("FLUSH PRIVILEGES");
                echo "<span style='color: green;' />Successfully created user " . $username . ".</span><br>";
            } catch (PDOException $e) {
                echo "<span style='color: red;' />Could not create user with name " . $username . ", maybe it already exists...</span><br>";
            }
            flush();

            /**************************** Init database. *************************************/
            $initQuery = file_get_contents("Shared/SQL/init_db.sql");

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
                $connection->query("USE " . $databaseName);
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
                echo "<code><textarea rows='2' cols='70' readonly style='resize:none'>" . $completeQuery . "</textarea></code><br><br>";
            }
            flush();

            /*************** Fill database with test data if this was checked. ****************/
            if (isset($_POST["fillDB"]) && $_POST["fillDB"] == 'Yes' && $initSuccess) {
                addTestData("testdata", $connection);
                addTestData("keywords_php", $connection);
                addTestData("keywords_sql", $connection);
                addTestData("keywords_sr", $connection);
                addTestData("keywords_java", $connection);
            } else {
                echo "Skipped filling database with test data.<br>";
            }

        } else {
            echo "Skipped creating database.<br>";
        }

        echo "<b>Installation finished.</b><br><hr>";
        flush();

        # All this code prints further instructions to complete installation.
        $putFileHere = dirname(getcwd(), 1);
        echo "<br><b>To make installation work please make a file named 'coursesyspw.php' at " . $putFileHere . " with some code.</b><br>";

        echo "<b>Bash command to complete all this (Copy all code below and paste it into bash shell as one statement):</b><br>";
        echo '<pre>';
        echo 'printf "' . htmlspecialchars("<?php") . '\n' . "<br>";
        echo 'define(\"DB_USER\",\"' . $username . '\");\n' . "<br>";
        echo 'define(\"DB_PASSWORD\",\"' . $password . '\");\n' . "<br>";
        echo 'define(\"DB_HOST\",\"' . $serverName . '\");\n' . "<br>";
        echo 'define(\"DB_NAME\",\"' . $databaseName . '\");\n' . "<br>";
        echo htmlspecialchars("?>") . '" > ' . $putFileHere . '/coursesyspw.php';
        echo '</pre>';

        echo "<b> Now create a directory named 'log' (if you dont already have it)<br> 
                with a sqlite database inside at " . $putFileHere . " with permissions 777<br>
                (Copy all code below and paste it into bash shell as one statement to do this).</b><br>";
        echo "<pre>mkdir " . $putFileHere . "/log && <br>";
        echo "chmod 777 " . $putFileHere . "/log && <br>";
        echo "sqlite3 " . $putFileHere . '/log/loglena4.db "" && <br>';
        echo "chmod 777 " . $putFileHere . "/log/loglena4.db</pre><br>";
    }

    # Function to add testdata from specified file. Parameter file = sql file name without .sql.
    function addTestData($file, $connection){
        $testDataQuery = @file_get_contents("Shared/SQL/" . $file .  ".sql");

        if ($testDataQuery === FALSE) {
            echo "<span style='color: red;' />Could not find LenaSYS/Shared/SQL/" . $file . ".sql, skipped this test data.</span><br>";
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
                echo "<span style='color: green;' />Successfully filled database with test data from " . $file . ".sql.</span><br>";
            } catch (PDOException $e) {
                echo "<span style='color: red;' />Failed to fill database with data because of query (in " . $file . ".sql):</span><br>";
                echo "<code><textarea rows='2' cols='70' readonly style='resize:none'>" . $completeQuery . "</textarea></code><br><br>";
            }
        }
        flush();
    }

    ?>
</body>
