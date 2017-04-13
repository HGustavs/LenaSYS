<head>
    <title>Install LenaSYS!</title>
    <link rel="stylesheet" type="text/css" href="CSS/install_style.css">
</head>
<body>
    <?php
    ob_start();
    /************* MODAL TO SHOW STEPS BEFORE AND AFTER ****************/
    $putFileHere = dirname(getcwd(), 1); // Path to lenasys
    echo "
                    <div id='warning' class='modal'>
                
                        <!-- Modal content -->
                        <div class='modal-content'>
                            <span class='close''>&times;</span>
                                <span id='dialogText'></span>
                        </div>
                
                    </div>";
    ?>

    <script>
        var modalRead = false; // Have the user read info?
        var modal = document.getElementById('warning'); // Get the modal
        var span = document.getElementsByClassName("close")[0]; // Get the button that opens the modal
        var filePath = "<?php echo $putFileHere; ?>";

        document.getElementById('dialogText').innerHTML="<h1 style='text-align: center;'><span style='color: red;' />" +
            "!!!!!!READ THIS BEFORE YOU START!!!!!!</span></h1><br>" +
            "<h2 style='text-align: center;'>Make sure you set ownership of LenaSYS directory to 'www-data'.<br>" +
            "<br>" +
            "To do this run the command:<br>" +
            "sudo chgrp -R www-data " + filePath + "</h2><br>" +
            "<br>" +
            "<input onclick='if(this.checked){haveRead(true)}else{haveRead(false)}' class='startCheckbox' type='checkbox' value='1'>" +
            "<i>I promise i have done this and will not complain that it's not working</i>";

        function haveRead(isTrue) {
            modalRead = isTrue;
        }

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            if (modalRead) {
                modal.style.display = "none";
            }
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal && modalRead) {
                modal.style.display = "none";
            }
        }
    </script>

    <h1>Fill out all fields to install LenaSYS and create database.</h1>
    <button id="showModalBtn">Open start-dialog again.</button> (To see what permissions to set) <br>
    <script>
        var btn = document.getElementById("showModalBtn"); // Get the button that opens the modal
        // Open modal on button click
        btn.onclick = function () {
        modal.style.display = "block";
        }
    </script>
    <form action="install.php?mode=install" method="post">
        <table cellspacing="0px">
            <tr align="left">
                <th valign=top><h2>New/Existing MySQL user and DB</h2></th>
                <th valign=top bgcolor="#EEEEEE"><h2>MySQL Root Login</h2></th>
                <th valign=top><h2>Test Data</h2></th>
            </tr>
            <tr>
 <?php
    // Prefill existing credentials, exluding password
    $dbUsername = "";
    $dbHostname = "";
    $dbName = "";

    $credentialsFile = "../../coursesyspw.php";
    if(file_exists("../../coursesyspw.php")) {
      $credentialsArray = file($credentialsFile, FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES);

      // check if the credentials exists in the file, store them if they do
      foreach($credentialsArray as $cred) {
        if(stripos(trim($cred), 'DB_') !== FALSE){
          $tArray = explode('"', trim($cred));
          if(count($tArray) == 5) {
            switch($tArray[1]) {
              case "DB_USER":
                $dbUsername = $tArray[3];
                break;
              case "DB_HOST":
                $dbHostname = $tArray[3];
                break;
              case "DB_NAME":
                $dbName = $tArray[3];
                break;
            }
          }
        }
      }
    }
    echo '<td valign=top width="20%">';
    echo 'Enter new MySQL user. <br>';
    echo '<input type="text" name="newUser" placeholder="Username" value="'.$dbUsername.'" /> <br>';
    echo 'Enter password for MySQL user. <br>';
    echo '<input type="password" name="password" placeholder="Password" /> <br>';
    echo 'Enter new database name. <br>';
    echo '<input type="text" name="DBName" placeholder="Database name" value="'.$dbName.'" /> <br>';
    echo 'Enter hostname (e.g localhost). <br>';
    echo '<input type="text" name="hostname" placeholder="Hostname" value="'.$dbHostname.'" /> <br>';
    echo '</td>';
?>
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
                    <b><-- Check the box if you want to write over an existing database and user<br>
                        <span style='color: red;'>(WARNING: THIS WILL REMOVE ALL DATA IN PREVIOUS DATABASE)</span></b><br>
                </td>
            </tr>
        </table>
        <table width="100%">
            <tr>
                <td bgcolor="#EEEEEE">
                    <input type="submit" name="submitButton" value="Install!" onclick="resetWindow()"/>
                    <input type="reset" value="Clear"/>
                </td>
            </tr>
        </table>
    </form>

    <?php if (isset($_GET["mode"]) && $_GET["mode"] == "install") {
        $putFileHere = dirname(getcwd(), 2); // Path to lenasys
        ob_end_clean(); // Remove form and start installation.

        echo "
                    <div id='warning' class='modal'>
                
                        <!-- Modal content -->
                        <div class='modal-content'>
                            <span class='close''>&times;</span>
                                <span id='dialogText'></span>
                        </div>
                
                    </div>";
        echo "
            <script>
                var modalRead = false; // Have the user read info?
                var modal = document.getElementById('warning'); // Get the modal
                var btn = document.getElementById('showModalBtn'); // Get the button that opens the modal
                var span = document.getElementsByClassName('close')[0]; // Get the button that opens the modal
                var filePath = '{$putFileHere}';
                
                document.getElementById('dialogText').innerHTML = '<h1 style=\'text-align: center;\'><span style=\'color: red;\' />!!!WARNING!!!</span></h1><br>' +
                    '<h2 style=\'text-align: center;\'>READ INSTRUCTIONS UNDER INSTALL PROGRESS.</h2>' +
                    '<p style=\'text-align: center;\'>If you don\'t follow these instructions nothing will work. Group 3 will not take any ' +
                    'responsibility for your failing system.</p>';
                
                // When the user clicks on <span> (x), close the modal
                span.onclick = function() {
                    modal.style.display = 'none';
                }

                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = 'none';
                    }
                }
            </script>
        ";
        flush();
        ob_flush();

        /***** START ******/
        $putFileHere = dirname(getcwd(), 1); // Path to lenasys
        echo "<h1>Installation</h1>";
        echo "<hr>";
        flush();
        ob_flush();

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
            ob_flush();

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
                ob_flush();
            }

            # Create new database
            try {
                $connection->query("CREATE DATABASE {$databaseName}");
                echo "<span style='color: green;' />Database with name {$databaseName} created successfully.</span><br>";
            } catch (PDOException $e) {
                echo "<span style='color: red;' />Database with name {$databaseName} could not be created. Maybe it already exists...</span><br>";
            }
            flush();
            ob_flush();

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
            ob_flush();

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
                $connection->query("SET NAMES utf8");
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
            ob_flush();

            /*************** Fill database with test data if this was checked. ****************/
            if (isset($_POST["fillDB"]) && $_POST["fillDB"] == 'Yes' && $initSuccess) {
                addTestData("testdata", $connection);

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
        ob_flush();

        # All this code prints further instructions to complete installation.
        $putFileHere = dirname(getcwd(), 2); // Path to lenasys
        echo "<h1><span style='color: red;' />!!!READ BELOW!!!</span></h1>";
        echo "<br><b>To make installation work please make a
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
        ob_flush();
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

    <script>
        // Show modal
        modal.style.display = "block";
    </script>

</body>
