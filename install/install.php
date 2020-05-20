<head>
  <title>Install LenaSYS!</title>
  <link rel="stylesheet" type="text/css" href="CSS/install_style.css">
  <script src="../Shared/js/jquery-1.11.0.min.js"></script>
  <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
  <script src="install_entry.js"></script>
  <script src="install_defer.js" defer></script>
</head>
<body>
  <!-- Config Section -->
  <?php
    // Saving away old execution time setting and setting new to 120 (default is 30).
    // this is done in order to avoid a php timeout, especially on windows where Database
    // query time also affects php executiion time. This will not work when php is running
    // in safe mode.
    $timeOutSeconds = ini_get('max_execution_time');
    set_time_limit(300);
    $errors = 0;

    //---------------------------------------------------------------------------------------------------
    // cdirname: Returns dirname for <PHP7 compability, called to set variable putFileHere (used as dirname)
    //---------------------------------------------------------------------------------------------------
    function cdirname($path, $level) {
      $prefix = '';
      // Check if $path starts with a windows style 'C:\' prefix
      if (preg_match("/^.:\\\\/", $path)) {
        // Cut off the drive letter and store it in $prefix
        $prefix = substr($path, 0, 2);
        $path = substr($path, 2);
        // Replace all windows '\' with unix '/' in the path string
        $path = str_replace("\\", "/", $path);
      }

      $paths = explode("/", $path);
      $r = '';
      if(count($paths) <= $level) {
        $r = '/';
      } else {
        $r = '/';
        for($i = 0; $i < count($paths) - $level; $i++) {
        if($i > 1) {
          $r .= '/';
        }
        $r .= $paths[$i];
        }
      }
      // Re-add the drive letter if there was one ('C:' + '/.../')
      return $prefix . $r;
    };

    ob_start();

    //---------------------------------------------------------------------------------------------------
    // Function that checks if permissions (chown/chgrp) are sat.
    //---------------------------------------------------------------------------------------------------
    function isPermissionsSat($crntFilePath){
      $permissionsSat = false;
      if(!mkdir("{$crntFilePath}/testPermissionsForInstallationToStartDir", 0060)) {
        $permissionsSat = false;
      }
      else {
        if (!rmdir("{$crntFilePath}/testPermissionsForInstallationToStartDir")) {
          $permissionsSat = false;
        } else {
          $permissionsSat = true;
        }
      }
      return $permissionsSat;
    }

    //---------------------------------------------------------------------------------------------------
    // getUsername: Returns username based on value from cdirname(), called to set variable username
    //---------------------------------------------------------------------------------------------------
    function getUsername($currentPath) {
      $username = null;

      if(function_exists('posix_getpwuid')) {
        $username = posix_getpwuid(filegroup($currentPath))['name'];
      } else {
        $username = getenv(filegroup($currentPath))['name'];
      }

      return $username;
    }

    //-----------------------------------------------------------------------------------------------------------------
    // systemVariables: Sets the system variables, path, operatingSystem, username and check if permissions are sat.
    //-----------------------------------------------------------------------------------------------------------------
    $putFileHere = cdirname(getcwd(), 1); // Path to lenasys
    $operatingSystem = PHP_OS_FAMILY;
    $username = getUsername($putFileHere);
    $isPermissionsSat = isPermissionsSat($putFileHere);
  ?>

  <!-- Modal prompting the user to set folder-permissions -->
  <div id='warning' class='modal'>
    <div class='modal-content'>
      <span title='Close pop-up' class='close'>&times;</span>
        <span id='dialogText'></span>
          <script>
            var owner = <?php echo json_encode($username); ?>;
            var filePath = <?php echo json_encode($putFileHere); ?>;
            var operatingSystem = <?php echo json_encode(PHP_OS_FAMILY); ?>;
            var isPermissionsSat = <?php echo json_encode($isPermissionsSat); ?>;
            var modal = document.getElementById('warning'); // Get the modal
            var modalDialogText = document.getElementById('dialogText'); // Get the dialogText of the modal
            var postInstallModal = null;
            var postInstallModalClose = null;

            setPermissionModalText(owner, filePath, operatingSystem);

            if (operatingSystem != 'Windows' && isPermissionsSat != true){
              modal.style.display = 'block';
            } else {
              modal.style.display = 'none';
            }
          </script>
    </div>
  </div> 

  <!-- Header showing the showModalButton-->
  <div id="header">
    <h1>LenaSYS Installer</h1>
    <span title="Open start-dialog" id="showModalBtn"><b>Open start-dialog again.</b><br> (To see what permissions to set)</span>
  </div>

  <!-- Input Section -->
  <form action="install.php?mode=install" method="post" class="install-form">
    <!-- Input-wrapper holding headings and slides (pages) -->
    <div id="inputWrapper">
      <!-- Headings for each input-slide -->
      <div class="inputHeading" valign=top>
        <div class="inputFirst" id="th1"><h2>New/Existing MySQL user and DB</h2></div>
        <div class="inputNotFirst" id="th2"><h2>MySQL Root Login</h2></div>
        <div class="inputNotFirst" id="th3"><h2>Test Data</h2></div>
        <div class="inputNotFirst" id="th4"><h2>Write over?</h2></div>
        <div class="inputNotFirst" id="th5"><h2>Submit</h2></div>
      </div>

      <!-- PHP-SCRIPT to prefill credentials from coursesyspw - also logic for filling in credentials-->
      <?php
        $dbUsername = "";
        $dbHostname = "";
        $dbName = "";
        $dbPassword = "";
        $credentialsFile = "../../coursesyspw.php";

        // check if the credentials exists in the file, store them if they do
        if(file_exists($credentialsFile)) {
          $credentialsArray = file($credentialsFile, FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES);
          foreach($credentialsArray as $cred) {
            if(stripos(trim($cred), 'DB_') !== FALSE){
            $tArray = explode('"', trim($cred));
              if(count($tArray) == 5) {
                if($tArray[1]=="DB_USER"){
                $dbUsername = $tArray[3];
                }else if($tArray[1]=="DB_HOST"){
                $dbHostname = $tArray[3];
                }else if($tArray[1]=="DB_NAME"){
                $dbName = $tArray[3];
                }else if($tArray[1]=="DB_PASSWORD"){
                $dbPassword = $tArray[3];
                }
              }
            }
          }
        }

        echo '<div id="contentWrapper">';
        /* All the different content for input
        * td1 will be shown at start, the others (td2 - 5) will be shown by clicking arrows.
        */
        echo '<div class="inputContent" id="td1">';
        echo '<p id="infoText"><b>To start installation please enter a new (or existing) MySQL user. This could, for example, be your student login.
          Next enter a password for this user (new or existing).<br>
          After this enter a database to use. This could also be either an existing or a new database.<br>
          Finally enter the host. Is installation is running from webserver localhost should be used.</b></p><hr>';
        echo 'Enter new MySQL user. <br>';
        echo '<input title="Enter new MySQL user." class="page1input" type="text" name="newUser" placeholder="Username" value="'.$dbUsername.'" /> <br>';
        echo 'Enter password for MySQL user. <br>';
        echo '<input title="Enter password for MySQL user." class="page1input" type="password" name="password" placeholder="Password" value="'.$dbPassword.'"/> <br>';
        echo 'Enter new database name. <br>';
        echo '<input title="Enter new database name." class="page1input" type="text" name="DBName" placeholder="Database name" value="'.$dbName.'" /> <br>';
        echo 'Enter hostname (e.g localhost). <br>';
        echo '<input title="Enter hostname." class="page1input" type="text" name="hostname" placeholder="Hostname" value="'.$dbHostname.'" /> <br>';
        echo '<span class="enterAllFields" id="enterFields1">Please fill all fields before continuing.</span>';
          if($dbUsername || $dbHostname || $dbName || $dbPassword){
            echo "<br><b>Values from existing coursesyspw.php were used </b><br>";
          }
        echo '</div>';
      ?>

      <!-- Slides for each heading -->
      <div class="inputContent" id="td2" valign=top>
          <p id="infoText"><b>Enter root log-in credentials for the database you want to use.<br>
              Default user has name 'root'. If password for root user is unknown ask a teacher or someone who knows.</b></p><hr>
          Enter MySQL root user. <br>
          <input title="Enter MySQL root user." class="page2input" type="text" name="mysqlRoot" placeholder="Root" value="root"/> <br>
          Enter password for MySQL root user. <br>
          <input title="Enter password for MySQL root user." class="page2input" type="password" name="rootPwd" placeholder="Root Password" /> <br>
          <span class="enterAllFields" id="enterFields2">Please fill all fields before continuing.</span>
      </div>
      <div class="inputContent" id="td3" valign=top>
          <p id="infoText"><b>If you wish to create a new, empty database check the box 'Create new database'. If you want to fill this
            database with testdata (located in install/SQL/testdata.sql) you should check the box for this too. If you
            are using an existing database and wishes to re-write it you will be able to make this choice on the next page.</b></p><hr>
          <input title="Create new database." type="checkbox" name="createDB" value="Yes" onchange="createDBchange(this)" checked/>
            Create new database. <br><hr>
          <div id="DBboxes">
            <input title="Include test data." type="checkbox" name="fillDB" value="Yes" onchange="fillDBchange(this)" checked/>
            Include test data. <br><br>
            <input title="Include Demo-Course" type="checkbox" name="demoCourseDB" value="Yes" onchange="demoCourseDBchange(this)" checked/>
            Include demo-course. <br><br>
            <div id="testdataBoxes">
              <input title="Include markdown." type="checkbox" name="mdSupport" value="Yes" checked/>
              Include markdown. (Files located in /Install/md) <br><br>
              <b>Language keyword highlighting support.<br></b>
              <i>Choose which languages you wish to support in codeviewer. (You need to check 'Include test data' to be able to include these.</i><br>
              <div id="checkboxContainer">
                <input title="HTML" type="checkbox" name="html" value="Yes" checked/> HTML <br>
                <input title="Java" type="checkbox" name="java" value="Yes" checked/> Java <br>
                <input title="PHP" type="checkbox" name="php" value="Yes" checked/> PHP <br>
                <input title="Plain Text" type="checkbox" name="plain" value="Yes" checked/> Plain Text <br>
                <input title="SQL" type="checkbox" name="sql" value="Yes" checked/> SQL <br>
                <input title="SR" type="checkbox" name="sr" value="Yes" checked/> SR <br>
              </div>
            </div>
          </div>
      </div>
      <div class="inputContent" id="td4" colspan="3" bgcolor="#FFCCCC">
        <p id="infoText"><b>If you have entered a user and/or database that already exists you must check the checkboxes below to accept overwriting these.
          <br>If you only entered an existing user but a new database only check the box for user overwrite.
          <br>If you only entered an existing database for a new user only check the box for database overwrite.
          <br>If both are existing both boxes should be checked.
          <br>If it's a completely new database and user no box has to be checked.</b></p><hr>
        <div id="checkboxContainer2">
          <input title="Write over existing database." id="writeOver1" type="checkbox" name="writeOverDB" value="Yes" />
          Yes I want to write over an existing database.<br>
          <input title="Write over existing user." id="writeOver2" type="checkbox" name="writeOverUSR" value="Yes" />
          Yes I want to write over an existing user.<br>
          <input title="Init as transaction." id="transaction" type="checkbox" name="InitTransaction" value="Yes" />
          Yes I want to perform the database-initializing as an transaction.<br>
        </div>
            <span id='failText'>(WARNING: THIS WILL REMOVE ALL DATA IN PREVIOUS DATABASE AND/OR USER)</span></b><br>
      </div>
      <div class="inputContent" id="td5" bgcolor="#EEEEEE">
        <p id="infoText"><b>If all fields are filled out correctly the only thing remaining is to smack the 'Install' button below.
          Progress of installation will be shown. If any errors occurs please try again and check that your data is correct.
          If you still get errors please read installation guidelines on LenaSYS github page or in 'README.md'. </b></p><hr>
        <input title="Install LenaSYS!" id="submitInput" class="button" type="submit" name="submitButton" value="Install!"/>
      </div>
    </div>

    <!-- Arrows for navigation between input pages -->
    <div title="Go back" class="arrow" id="leftArrow">
      <svg height="150" width="150">
        <circle cx="75" cy="75" r="70" fill="rgb(253,203,96)" />
        <polygon points="100,30 20,75 100,120" />
      </svg>
    </div>

    <div title="Continue installation" class="arrow" id="rightArrow">
      <svg height="150" width="150">
        <circle cx="75" cy="75" r="70" fill="rgb(253,203,96)" />
        <polygon points="50,30 130,75 50,120" />
      </svg>
    </div>
  </form>

  <!-- Empty footer to show a nice border at bottom -->
  <div id="inputFooter"></div>

  <!-- Install Section -->
  <?php 
    # Installer
    if (isset($_GET["mode"]) && $_GET["mode"] == "install") {
      $putFileHere = cdirname(getcwd(), 1); // Path to lenasys
      ob_end_clean(); // Remove form and start installation.

      //---------------------------------------------------------------------------------------------------
      // Header - Contains title, progress bar and restart-button.
      //---------------------------------------------------------------------------------------------------
      echo "
        <div id='header'>
          <h1>Installation</h1>
          <svg id='progressBar' height='20px' width='50%' onresize='updateProgressBar(-1, 1);'>
            <rect id='progressRect' width='0' height='20px' />
          </svg>
          <span id='percentageText'></span>
          <a title='Restart installation.' href='install.php' id='goBackBtn' ><b>Restart installation</b></a>
        </div>
      ";

      //---------------------------------------------------------------------------------------------------
      // Modal showing after installation is done
      //---------------------------------------------------------------------------------------------------
      echo "
        <div id='warning' class='modal'>
          <!-- Modal content -->
          <div class='modal-content'>
            <span title='Close pop-up' class='close''>&times;</span>
              <span id='dialogText'></span>
          </div>
        </div>
      ";

      //---------------------------------------------------------------------------------------------------
      // Javascript for warning modal
      //---------------------------------------------------------------------------------------------------
      echo "
        <script>
          var postInstallModal = document.getElementById('warning'); // Get the modal
          var postInstallModalClose = document.getElementsByClassName('close')[0]; // Get the button that opens the modal

          document.getElementById('dialogText').innerHTML = '<div><h1>!!!WARNING!!!</h1><br>' +
            '<h2>READ INSTRUCTIONS UNDER INSTALL PROGRESS.</h2>' +
            '<p>If you don\'t follow these instructions nothing will work. G4-2020 will not take any ' +
            'responsibility for your failing system.</p>';
        </script>
      ";
      
      flush();
      ob_flush();

      //---------------------------------------------------------------------------------------------------
      // START of installation progress
      //---------------------------------------------------------------------------------------------------
      $totalSteps = 1; // Variable to hold the total steps to complete.
      $completedSteps = 0; // Variable to hold the current completed steps.
      $initSuccess = false;
      $initQuery = null;

      //---------------------------------------------------------------------------------------------------
      // The following if-block will decide how many steps there are to complete installation.
      //---------------------------------------------------------------------------------------------------
      if (isset($_POST["createDB"]) && $_POST["createDB"] == 'Yes') {
        $totalSteps += 5;
        if (isset($_POST["writeOverUSR"]) && $_POST["writeOverUSR"] == 'Yes') {
          $totalSteps++;
        }
        if (isset($_POST["writeOverDB"]) && $_POST["writeOverDB"] == 'Yes') {
          $totalSteps++;
        }
        if (isset($_POST["transaction"]) && $_POST["transaction"] == 'Yes') {
          $totalSteps++;
        }
        if (isset($_POST["fillDB"]) && $_POST["fillDB"] == 'Yes') {
          $totalSteps += 4;

          if (isset($_POST["demoCourseDB"]) && $_POST["demoCourseDB"] == 'Yes') {
            $totalSteps++;
          }
          
          if (isset($_POST["mdSupport"]) && $_POST["mdSupport"] == 'Yes') {
            $totalSteps++;
          }

          $checkBoxes = array("html", "java", "php", "plain", "sql", "sr");
          foreach ($checkBoxes AS $boxName) { //Loop trough each field
            if (isset($_POST[$boxName]) || !empty($_POST[$boxName])) {
              $totalSteps++;
            }
          }
        }
      }

      flush();
      ob_flush();

      //-----------------------------------------------------------------------------------------------------
      // All the following code of the long if-statement does the install, echoed to installationProgressWap.
      //-----------------------------------------------------------------------------------------------------
      echo "<div id='installationProgressWrap'>";
        $isPermissionsSat = isPermissionsSat($putFileHere);
        $isAllCredentialsFilled = isAllCredentialsFilled();
        global $errors;

        //---------------------------------------------------------------------------------------------------
        // Check permissions.
        //---------------------------------------------------------------------------------------------------
        if($isPermissionsSat) {
          echo "<span id='successText' />Permissions on {$putFileHere} sat correctly.</span><br>";
        } else {
          $errors++;
          exit ("<span id='failText' />Permissions on {$putFileHere} not sat correctly, please restart the installation.</span><br>
            <a title='Try again' href='install.php' class='returnButton'>Try again.</a>");
        }
        $completedSteps++;
        updateProgressBar($completedSteps, $totalSteps);

        //---------------------------------------------------------------------------------------------------
        // Check so all fields on first page are sat.
        //---------------------------------------------------------------------------------------------------
        if(!$isAllCredentialsFilled) {
          exit ("<span id='failText' />Please fill all fields.</span><br>
          <a title='Try again' href='install.php' class='returnButton'>Try again.</a>");
        }

        //---------------------------------------------------------------------------------------------------
        // Create database if this option is ticked.
        //---------------------------------------------------------------------------------------------------
        if (isset($_POST["createDB"]) && $_POST["createDB"] == 'Yes') {
          $username = $_POST["newUser"];
          $password = $_POST["password"];
          $databaseName = $_POST["DBName"];
          $serverName = $_POST["hostname"];
          $rootUser = $_POST["mysqlRoot"];
          $rootPwd = $_POST["rootPwd"];
          $connection = null;

          # Connect to database with root access.
          try {
            $connection = new PDO("mysql:host=$serverName", $rootUser, $rootPwd);
            $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            echo "<span id='successText' />Connected successfully to {$serverName}.</span><br>";
          } catch (PDOException $e) {
            $errors++;
            exit ("<span id='failText' />Connection failed: " . $e->getMessage() . "</span><br>
            You may have entered a invalid password or an invalid user.<br>
            <a title='Try again' href='install.php' class='returnButton'>Try again.</a>");
          }
          $completedSteps++;
          updateProgressBar($completedSteps, $totalSteps);
          flush();
          ob_flush();


          # If checked, delete user
          if (isset($_POST["writeOverUSR"]) && $_POST["writeOverUSR"] == 'Yes') {
            deleteUser($connection, $username);
            $completedSteps++;
            updateProgressBar($completedSteps, $totalSteps);
            flush();
            ob_flush();
          }

          # If checked, delete database
          if (isset($_POST["writeOverDB"]) && $_POST["writeOverDB"] == 'Yes') {
            deleteDatabase($connection, $databaseName);
            $completedSteps++;
            updateProgressBar($completedSteps, $totalSteps);
            flush();
            ob_flush();
          }

          # Create new database
          try {
            $connection->query("CREATE DATABASE {$databaseName}");
            echo "<span id='successText' />Database with name {$databaseName} created successfully.</span><br>";
          } catch (PDOException $e) {
            $errors++;
            echo "<span id='failText' />Database with name {$databaseName} could not be created. Maybe it already exists...</span><br>";
          }
          $completedSteps++;
          updateProgressBar($completedSteps, $totalSteps);
          flush();
          ob_flush();

          # Create new user and grant privileges to created database.
          try {
            $connection->query("FLUSH PRIVILEGES");
            $connection->query("CREATE USER '{$username}'@'{$serverName}' IDENTIFIED BY '{$password}'");
            $connection->query("GRANT ALL PRIVILEGES ON *.* TO '{$username}'@'{$serverName}'");
            $connection->query("FLUSH PRIVILEGES");
            echo "<span id='successText' />Successfully created user {$username}.</span><br>";
          } catch (PDOException $e) {
            $errors++;
            echo "<span id='failText' />Could not create user with name {$username}, maybe it already exists...</span><br>";
          }
          $completedSteps++;
          updateProgressBar($completedSteps, $totalSteps);
          flush();
          ob_flush();

          /**************************** Init database. *************************************/
          $initQuery = file_get_contents("../Shared/SQL/init_db.sql");

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
          $completeQuery = null;
          try {
            if (isset($_POST["InitTransaction"]) && $_POST["InitTransaction"] == 'Yes'){
              $connection->beginTransaction();
            }
            $connection->query("SET NAMES utf8");
            $connection->query("USE {$databaseName}");
            $queryBlock = '';
            $blockStarted = false;
            foreach ($initQueryArray AS $query) {
              $completeQuery = $query . ";";
              if (!$blockStarted && strpos(strtolower($completeQuery), "delimiter //")) {
                $blockStarted = true;
              } else if ($blockStarted && strpos(strtolower($completeQuery), "delimiter ;")) {
                $blockStarted = false;
              } else if ($blockStarted) {
              } else {
                if (trim($query) != '') { 
                  $connection->query($completeQuery);
                }
              }
            }
            $initSuccess = true;
            if (isset($_POST["InitTransaction"]) && $_POST["InitTransaction"] == 'Yes'){
              $connection->commit();
              echo "<span id='successText' />Initialization of database complete as a transaction completed.</span><br>";
            } else{
              echo "<span id='successText' />Initialization of database complete. </span><br>";
            }
          } catch (PDOException $e) {
            $errors++;
            if (isset($_POST["InitTransaction"]) && $_POST["InitTransaction"] == 'Yes'){
              $connection->rollback();
              echo "<span id='failText' />Failed initialization and rollbacking transaction because of query (in init_db.sql): </span><br>";
              echo "<div class='errorCodeBox'><code>{$completeQuery}</code></div><br><br>";
            } else{
              echo "<span id='failText' />Failed initialization of database because of query (in init_db.sql): </span><br>";
              echo "<div class='errorCodeBox'><code>{$completeQuery}</code></div><br><br>";
            }
          }
          $completedSteps++;
          updateProgressBar($completedSteps, $totalSteps);
          flush();
          ob_flush();

          /*************** Fill database with test data if this was checked. ****************/
          if (isset($_POST["fillDB"]) && $_POST["fillDB"] == 'Yes' && $initSuccess) {
            addTestData("testdata", $connection);
            
            # Add Demo-Page
            if (isset($_POST["demoCourseDB"]) && $_POST["demoCourseDB"] == 'Yes') {
              addTestData("demoCourseData", $connection);
            } else {
              echo "Skipped adding demo-page<br>";
            }

            # Copy md files to the right place.
            if (isset($_POST["mdSupport"]) && $_POST["mdSupport"] == 'Yes') {
              copyTestFiles("{$putFileHere}/install/md/", "{$putFileHere}/DuggaSys/templates/");
            } else {
              echo "Skipped adding markdown files<br>";
            }

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
              echo "<span id='successText' />Created the directory '{$putFileHere}/courses'.</span><br>";
            }
            copyTestFiles("{$putFileHere}/install/courses/global/", "{$putFileHere}/courses/global/");
            copyTestFiles("{$putFileHere}/install/courses/1/", "{$putFileHere}/courses/1/");
            copyTestFiles("{$putFileHere}/install/courses/2/", "{$putFileHere}/courses/2/");
          } else {
            echo "Skipped filling database with test data.<br>";
          }
        } else {
          echo "Skipped creating database.<br>";
        }
        $completedSteps++;
        updateProgressBar($completedSteps, $totalSteps);

        echo "<b>Installation finished.</b><br>";
        flush();
        ob_flush();
        // resetting timeout to what it was prior to installation
        set_time_limit($timeOutSeconds);
      echo "</div>
      ";

      //---------------------------------------------------------------------------------------------------
      // Will show how many errors installation finished with.
      //---------------------------------------------------------------------------------------------------
      echo "
        <div id='inputFooter'><span title='Show or hide progress.'  id='showHideInstallation'>Show/hide installation progress.</span><br>
          <span id='errorCount'>Errors: " . $errors . "</span>
        </div>
      "; 

      //---------------------------------------------------------------------------------------------------
      // Collapse progress only if there are no errors.
      //---------------------------------------------------------------------------------------------------
      if ($errors == 0) {
        echo "
          <script>
            $('#installationProgressWrap').toggle(500);
          </script>
        ";
      }

      //---------------------------------------------------------------------------------------------------
      // The rest of the if-statement prints further instructions
      //---------------------------------------------------------------------------------------------------
      $putFileHere = cdirname(getcwd(), 2); // Path to lenasys
      echo "<div id='doThisWrapper'>";
      echo "<h1><span id='warningH1'/>!!!READ BELOW!!!</span></h1>";

      //---------------------------------------------------------------------------------------------------
      // Create/update coursesyspw.php , if it fails output instructions.
      //---------------------------------------------------------------------------------------------------
      try {
        $filePutContent = "<?php
          define(\"DB_USER\",\"".$username."\");
          define(\"DB_PASSWORD\",\"".$password."\");
          define(\"DB_HOST\",\"".$serverName."\");
          define(\"DB_NAME\",\"".$databaseName."\");
        ?>";
        file_put_contents($putFileHere."/coursesyspw.php",$filePutContent);
      } catch (\Exception $e) {
        echo "<br><b>To make installation work please make a
        file named 'coursesyspw.php' at {$putFileHere} with some code.</b><br>";
        echo "<b>We tried to create one for you but an error occured: see below how to do it yourself! </b></br>";
        echo "<b>Bash command to complete all this (Copy all code below/just click the box and paste it into bash shell as one statement):</b><br>";
        echo "<div title='Click to copy this!' class='codeBox' onclick='selectText(\"codeBox1\")'><code id='codeBox1'>";
        echo 'sudo printf "' . htmlspecialchars("
        <?php") . '\n';
          echo 'define(\"DB_USER\",\"' . $username . '\");\n';
          echo 'define(\"DB_PASSWORD\",\"' . $password . '\");\n';
          echo 'define(\"DB_HOST\",\"' . $serverName . '\");\n';
          echo 'define(\"DB_NAME\",\"' . $databaseName . '\");\n';
          echo htmlspecialchars("
        ?>") . '" > ' . $putFileHere . '/coursesyspw.php';
        echo "</code></div>";
        echo '<div id="copied1">Copied to clipboard!<br></div>';
      }

      //---------------------------------------------------------------------------------------------------
      // Check upload_max_filesize parameter
      //---------------------------------------------------------------------------------------------------
      if(ini_get('upload_max_filesize')!='128M'){
        echo "<br>PHP ini setting <b>upload_max_filesize</b> should be 128M, it is currently: " . ini_get('upload_max_filesize') . " . Please change it here: <b>" . php_ini_loaded_file() . "</b>";
      }

      //---------------------------------------------------------------------------------------------------
      // Buttons and other UI-stuff
      //---------------------------------------------------------------------------------------------------
      $lenaInstall = getInstallDirectory();
      echo "<form action=\"{$lenaInstall}/DuggaSys/courseed.php\">";
      echo "<br><input title='Go to LenaSYS' class='button2' type=\"submit\" value=\"I have made all the necessary things to make it work, so just take me to LenaSYS!\" />";
      echo "</form>";
      echo "</div>";

      //---------------------------------------------------------------------------------------------------
      // Show the postInstallModal modal
      //---------------------------------------------------------------------------------------------------
      echo "
        <script>
          postInstallModal.style.display = 'block';
        </script>
      ";
    }

    //---------------------------------------------------------------------------------------------------
    // updateProgressBar(): Wrapper-function for the js-function to update progressbar.
    //---------------------------------------------------------------------------------------------------
    function updateProgressBar($cSteps, $tSteps){
      echo "
        <script>
          var totalSteps = {$tSteps};
          var completedSteps = {$cSteps};
          jsUpdateProgressBar(totalSteps, completedSteps);
        </script>
      ";
    }

    //---------------------------------------------------------------------------------------------------
    // Function that checks if all credentials are filled out (on the first page).
    //---------------------------------------------------------------------------------------------------
    function isAllCredentialsFilled(){
      global $errors;
      $isAllCredentialsFilled = true;
      $fields = array("newUser", "password", "DBName", "hostname", "mysqlRoot", "rootPwd");
      foreach ($fields AS $fieldname) {
        if (!isset($_POST[$fieldname]) || empty($_POST[$fieldname]) && !$_POST[$fieldname] === "rootPwd") {
          $isAllCredentialsFilled = false;
          $errors++;
        }
      }
      return $isAllCredentialsFilled;
    }

    //---------------------------------------------------------------------------------------------------
    // Function that deletes a user from database
    //---------------------------------------------------------------------------------------------------
    function deleteUser($connection, $username){
      global $errors;
      try {
        $connection->query("DELETE FROM mysql.user WHERE user='{$username}';");
        echo "<span id='successText' />Successfully removed old user, {$username}.</span><br>";
      } catch (PDOException $e) {
      $errors++;
      echo "<span id='failText' />User with name {$username}
      does not already exist. Will only make a new one (not write over).</span><br>";
      }
    } 

    //---------------------------------------------------------------------------------------------------
    // Function that deletes a user from database
    //---------------------------------------------------------------------------------------------------
    function deleteDatabase($connection, $databaseName){
      global $errors;
      try {
        $connection->query("DROP DATABASE {$databaseName}");
        echo "<span id='successText' />Successfully removed old database, {$databaseName}.</span><br>";
      } catch (PDOException $e) {
        $errors++;
        echo "<span id='failText' />Database with name {$databaseName}
        does not already exist. Will only make a new one (not write over).</span><br>";
      }
    }

    //---------------------------------------------------------------------------------------------------
    // Function that returns the path to the installation.
    //---------------------------------------------------------------------------------------------------
    function getInstallDirectory(){
      $lenaInstall = null;
      $lenaInstall = cdirname($_SERVER['SCRIPT_NAME'], 2);
      if(substr($lenaInstall, 0 , 2) == '/') {
        $lenaInstall = substr($lenaInstall, 1);
      }
      return $lenaInstall;
    }

    # Function to add testdata from specified file. Parameter file = sql file name without .sql.
    function addTestData($file, $connection){
      global $errors;
      global $completedSteps;
      global $totalSteps;
      $testDataQuery = @file_get_contents("SQL/{$file}.sql");
      if ($testDataQuery === FALSE) {
        $errors++;
        echo "<span id='failText' />Could not find SQL/{$file}.sql, skipped this test data.</span><br>";
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
          echo "<span id='successText' />Successfully filled database with test data from {$file}.sql.</span><br>";
        } catch (PDOException $e) {
          $errors++;
          echo "<span id='failText' />Failed to fill database with data because of query in {$file}.sql (Skipped the rest of this file):</span><br>";
          echo "<div class='errorCodeBox'><code>{$completeQuery}</code></div><br><br>";
        }
      }
      $completedSteps++;
      updateProgressBar($completedSteps, $totalSteps);
      flush();
      ob_flush();
    }

    # Function to copy test files
    function copyTestFiles($fromDir,$destDir) {
      global $completedSteps;
      global $totalSteps;
      $dir = opendir($fromDir);
      @mkdir($destDir);
      while (false !== ($copyThis = readdir($dir))) {
        if (($copyThis != '.') && ($copyThis != '..')) {
          copy($fromDir . '/' . $copyThis, $destDir . '/' . $copyThis);
        }
      }
      closedir($dir);
      echo "<span id='successText' />Successfully filled {$destDir} with files from {$fromDir}.</span><br>";
      $completedSteps++;
      updateProgressBar($completedSteps, $totalSteps);
      flush();
      ob_flush();
    }
  ?>
</body>