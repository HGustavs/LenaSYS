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
        # Only create DB if box is ticked.
        if (isset($_POST["createDB"]) && $_POST["createDB"] == 'Yes') {
            $fields = array("newUser", "password", "DBName", "hostname", "mysqlRoot", "rootPwd");
            foreach ($fields AS $fieldname) { //Loop trough each field
                if (!isset($_POST[$fieldname]) || empty($_POST[$fieldname])) {
                    exit ("Please fill all fields.");
                }
            }

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
                echo "Connected successfully to " . $serverName . "<br>";
            } catch (PDOException $e) {
                echo "Connection failed: " . $e->getMessage() . "<br>";
            }

            # Create new database.
            try {
                $connection->query("CREATE DATABASE " . $databaseName);
                echo "Database with name " . $databaseName . " created successfully!<br>";
            } catch (PDOException $e) {
                echo "Database with name " . $databaseName . " could not be created. Maybe it already exists...<br>";
            }

            # Create new user and grant privileges to created database.
            try {
                $connection->query("FLUSH PRIVILEGES");
                $connection->query("CREATE USER '" . $username . "'@'" . $serverName . "' IDENTIFIED BY '" . $password . "'");
                $connection->query("GRANT ALL PRIVILEGES ON *.* TO '" . $username . "'@'" . $serverName . "'");
                $connection->query("FLUSH PRIVILEGES");
                echo "Successfully created user " . $username . "<br>";
            } catch (PDOException $e) {
                echo "Could not create user with name " . $username . ", maybe it already exists...<br>";
            }

            #TODO: INIT DATABASE.
            echo "<br> Database Successfully created with new user! <br>";

            # Fill database
            if (isset($_POST["fillDB"]) && $_POST["fillDB"] == 'Yes') {
                #TODO: FILL DATABASE.
                echo "Successfully filled database with test data.";
            }
        } else {
            echo "Skipped creating database <br>";
        }

        #TODO: Change/create file with settings. (coursesyspw.php)

        echo "Installation complete!";
    }
    ?>
</body>
