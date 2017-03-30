<body>

    <h1>Fill out all fields to install and create database.</h1>
    <form action="install.php" method="post">
        <table>
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
                    <-- Tick the box if you want to create a new database. <br>
                    <input type="checkbox" name="fillDB" value="Yes" />
                    <-- Tick the box if you want to fill the new database with test data. <br>
                </td>
            </tr>
        </table>
        <input type="submit" name="submitButton" value="Install!"/>
        <input type="reset" value="Clear"/>
    </form>

    <?php if (isset($_POST["submitButton"])) {
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
                echo "<span style='color: green;' />Connected successfully to " . $serverName . "</span><br>";
            } catch (PDOException $e) {
                echo "<span style='color: red;' />Connection failed: " . $e->getMessage() . "</span><br>";
            }

            # Create new database.
            try {
                $connection->query("CREATE DATABASE " . $databaseName);
                echo "<span style='color: green;' />Database with name " . $databaseName . " created successfully!</span><br>";
            } catch (PDOException $e) {
                echo "<span style='color: red;' />Database with name " . $databaseName . " could not be created. Maybe it already exists...</span><br>";
            }

            # Create new user and grant privileges to created database.
            try {
                $connection->query("FLUSH PRIVILEGES");
                $connection->query("CREATE USER '" . $username . "'@'" . $serverName . "' IDENTIFIED BY '" . $password . "'");
                $connection->query("GRANT ALL PRIVILEGES ON *.* TO '" . $username . "'@'" . $serverName . "'");
                $connection->query("FLUSH PRIVILEGES");
                echo "<span style='color: green;' />Successfully created user " . $username . "</span><br>";
            } catch (PDOException $e) {
                echo "<span style='color: red;' />Could not create user with name " . $username . ", maybe it already exists...</span><br>";
            }

            # Init database.
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
            try {
                $connection->query("USE " . $databaseName);
                # Use this var if several statements should be called at once (functions).
                $queryBlock = '';
                $blockStarted = false;
                foreach($initQueryArray AS $query) {
                    $completeQuery = $query . ";";

                    # This commented code in this block could work if delimiters are fixed/removed in sql files.
                    # TODO: Fix handling of delimiters. Now this part only removes code between them.
                    if (!$blockStarted && strpos($completeQuery, "delimiter //")){
                        $blockStarted = true;
                        #$queryBlock = $completeQuery;
                    } else if ($blockStarted && strpos($completeQuery, "delimiter ;")) {
                        $blockStarted = false;
                        #$queryBlock = $queryBlock . $completeQuery;
                        #$connection->query($queryBlock);
                    } else if ($queryBlock){
                        #$queryBlock = $queryBlock . $completeQuery;
                    } else {
                        if(trim($query) != ''){ // do not send if empty query.
                            $connection->query($completeQuery);
                        }
                    }
                }
                echo "<span style='color: green;' />Initiated database. </span><br>";

                # Fill database with test data if this was checked.
                if (isset($_POST["fillDB"]) && $_POST["fillDB"] == 'Yes') {
                    $testDataQuery = file_get_contents("Shared/SQL/testdata.sql");

                    # Split SQL file at semi-colons to send each query separated.
                    $testDataQueryArray = explode(";", $testDataQuery);
                    try {
                        foreach($testDataQueryArray AS $query) {
                            $completeQuery = $query . ";"; // Add semi-colon to each query.
                            if(trim($query) != ''){ // do not send if empty query.
                                $connection->query($completeQuery);
                            }
                        }
                        echo "<span style='color: green;' />Successfully filled database with test data.</span><br>";
                    } catch (PDOException $e) {
                        echo "<span style='color: red;' />Failed to fill database with data... </span><br>";
                    }
                } else {
                    echo "Skipped filling database with test data.<br>";
                }
            } catch (PDOException $e) {
                echo "<span style='color: red;' />Failed initialization of database... </span><br>";
            }
        } else {
            echo "Skipped creating database <br>";
        }

        echo "Installation completed! <br>";

        # All this code prints further instructions to complete installation.
        $putFileHere = dirname(getcwd(), 1);
        echo "<br><b>To make it work please make a file named 'coursesyspw.php' at " . $putFileHere . "</b><br>";
        echo "<b>After this - fill the file with the code below:</b>";

        echo "<br><pre>";
        echo htmlspecialchars("<?php") . "<br>";
        echo 'define("DB_USER","' . $username . '");<br>';
        echo 'define("DB_PASSWORD","' . $password . '");<br>';
        echo 'define("DB_HOST","' . $serverName . '");<br>';
        echo 'define("DB_NAME","' . $databaseName . '");<br>';
        echo htmlspecialchars("?>");
        echo "</pre><br>";

        echo "<b>Bash command to complete all this:</b><br>";
        echo '<pre>';
        echo 'printf "' . htmlspecialchars("<?php") . '\n';
        echo 'define(\"DB_USER\",\"' . $username . '\");\n';
        echo 'define("DB_PASSWORD","' . $password . '");\n';
        echo 'define("DB_HOST","' . $serverName . '");\n';
        echo 'define("DB_NAME","' . $databaseName . '");\n';
        echo htmlspecialchars("?>") . '" > ' . $putFileHere . '/coursesyspw.php';
        echo '</pre>';

        echo "<b> Now create a directory named 'log' at " . $putFileHere . " with permissions 777.</b><br>";
        echo "<pre>mkdir " . $putFileHere . "/log</pre>";
        echo "<pre>chmod 777 " . $putFileHere . "/log</pre>";
        echo "<b> Inside this directory create a new sqlite file (and change permissions) by running the commands: </b><br>";
        echo "<pre>sqlite3 " . $putFileHere . '/log/loglena4.db ""</pre>';
        echo "<pre>chmod 777 " . $putFileHere . "/log/loglena4.db</pre><br>";
    }
    ?>
</body>
