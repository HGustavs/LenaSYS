<head>
    <title>Install LenaSYS!</title>
    <link rel="stylesheet" type="text/css" href="CSS/install_style.css">
    <script src="../Shared/js/jquery-1.11.0.min.js"></script>
    <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
</head>
<body>
    <?php
    // Saving away old execution time setting and setting new to 120 (default is 30).
    // this is done in order to avoid a php timeout, especially on windows where Database
    // query time also affects php executiion time. This will not work when php is running
    // in safe mode.
    $timeOutSeconds = ini_get('max_execution_time');
    set_time_limit(300);
    $errors = 0;
    // Create a version of dirname for <PHP7 compability
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

    /************* MODAL TO SHOW STEPS BEFORE AND AFTER ****************/
    $putFileHere = cdirname(getcwd(), 1); // Path to lenasys
    echo "
                    <div id='warning' class='modal'>

                        <!-- Modal content -->
                        <div class='modal-content'>
                            <span title='Close pop-up' class='close''>&times;</span>
                                <span id='dialogText'></span>
                        </div>

                    </div>";
    ?>

    <script>
        var modalRead = false; // Have the user read info?
        var modal = document.getElementById('warning'); // Get the modal
        var span = document.getElementsByClassName("close")[0]; // Get the button that opens the modal
        var filePath = "<?php echo $putFileHere; ?>";

        document.getElementById('dialogText').innerHTML="<div><h1>" +
            "!!!!!!READ THIS BEFORE YOU START!!!!!!</h1><br>" +
            "<h2>Make sure you set ownership of LenaSYS directory to 'www-data'.<br>" +
            "current owner: " +
            "<?php if(function_exists('posix_getpwuid')) {
                echo posix_getpwuid(filegroup($putFileHere))['name'];
            } else {
                echo getenv(filegroup($putFileHere))['name'];
            }?>" +
            "<br><br>" +
            "To do this run the command:<br>" +
            "sudo chgrp -R www-data " + filePath + "</h2><br>" +
            "<br>" +
            "<input title='I have completed necessary steps' onclick='if(this.checked){haveRead(true)}else{haveRead(false)}' class='startCheckbox' type='checkbox' value='1' autofocus>" +
            "<i>I promise i have done this and will not complain that it's not working</i></div>";

        function haveRead(isTrue) {
            modalRead = isTrue;
        }
    </script>

    <div id="header">
        <h1>LenaSYS Installer</h1>
        <span title="Open start-dialog" id="showModalBtn"><b>Open start-dialog again.</b><br> (To see what permissions to set)</span>
    </div>
    <script>
        var btn = document.getElementById("showModalBtn"); // Get the button that opens the modal
        // Open modal on button click
        btn.onclick = function () {
        modal.style.display = "block";
        }
    </script>
    <form action="install.php?mode=install" method="post">
        <div id="inputWrapper">
            <!-- Headings for input -->
            <div class="inputHeading" valign=top>
                <div class="inputFirst" id="th1"><h2>New/Existing MySQL user and DB</h2></div>
                <div class="inputNotFirst" id="th2"><h2>MySQL Root Login</h2></div>
                <div class="inputNotFirst" id="th3"><h2>Test Data</h2></div>
                <div class="inputNotFirst" id="th4"><h2>Write over?</h2></div>
                <div class="inputNotFirst" id="th5"><h2>Submit</h2></div>
            </div>
    <?php
    // Prefill existing credentials, exluding password
    $dbUsername = "";
    $dbHostname = "";
    $dbName = "";
    $dbPassword = "";

    $credentialsFile = "../../coursesyspw.php";
    if(file_exists($credentialsFile)) {
      $credentialsArray = file($credentialsFile, FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES);

      // check if the credentials exists in the file, store them if they do
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
                    </div>
                        <span id='failText'>(WARNING: THIS WILL REMOVE ALL DATA IN PREVIOUS DATABASE AND/OR USER)</span></b><br>
                </div>
                <div class="inputContent" id="td5" bgcolor="#EEEEEE">
                    <p id="infoText"><b>If all fields are filled out correctly the only thing remaining is to smack the 'Install' button below.
                        Progress of installation will be shown. If any errors occurs please try again and check that your data is correct.
                        If you still get errors please read installation guidelines on LenaSYS github page or in 'README.md'. </b></p><hr>
                    <input title="Install LenaSYS!" id="submitInput" class="button" type="submit" name="submitButton" value="Install!" onclick="resetWindow()"/>
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
            <!-- Javascript functions for arrow functionality-->
            <script>
                var leftArrow = document.getElementById('leftArrow');
                var rightArrow = document.getElementById('rightArrow');
                var submitButton = document.getElementById('submitInput');
                var inputPage = 1;
                var previousInputPage = 0;

                /* Function to focus the right box on the page */
                function focusTheRightBox() {
                    if (inputPage === 1 || inputPage === 2) {
                        var fields = document.getElementsByClassName("page" + inputPage + "input");
                        for (var i = 0; i < fields.length; i++) {
                            if (fields[i].value === ''){
                                fields[i].focus();
                                break;
                            }
                        }
                    } else if (inputPage === 4) {
                        if (document.getElementById("writeOver1").checked) {
                            document.getElementById("writeOver2").focus();
                        } else {
                            document.getElementById("writeOver1").focus();
                        }
                    }
                }

                leftArrow.onclick = function() {
                    previousInputPage = inputPage;
                    if(inputPage > 1) inputPage--;
                    updateInputPage();
                    focusTheRightBox();
                };

                rightArrow.onclick = function() {
                    /* Only continue if all fields on current page are filled out */
                    if (inputPage === 1 || inputPage === 2) {
                        var fields = document.getElementsByClassName("page" + inputPage + "input");
                        var found = false; /* Is an empty field found? */
                        for (var i = 0; i < fields.length; i++) {
                            if (fields[i].value === ''){
                                if (inputPage === 2 && fields[1]) {
                                    found = false;  /* Ignores empty if the input field is for root password, because the installation should not limit this */
                                }else {
                                    found = true;  /* Empty field found */
                                }
                                /* Set background of text field to light red */
                                fields[i].setAttribute("style", "background-color:rgb(255,210,210)");
                            }
                        }
                        if (!found){
                            /* If no empty field was found - proceed and reset values of text fields and hide warning text */
                            document.getElementById("enterFields" + inputPage).style.display = "none";
                            previousInputPage = inputPage;
                            if (inputPage < 5) inputPage++;
                            for (var i = 0; i < fields.length; i++) {
                                fields[i].setAttribute("style", "background-color:rgb(255,255,255)");
                            }
                            updateInputPage();
                        } else {
                            /* Show the warning text if empty field was found */
                            document.getElementById("enterFields" + inputPage).style.display = "inline-block";
                        }
                    } else {
                        /* Only page 1 and 2 has text fields so the rest have no rules */
                        previousInputPage = inputPage;
                        if (inputPage < 5) inputPage++;
                        updateInputPage();
                    }
                };

                /* Remove default behaviour (click submit button) when pressing enter */
                $(document).ready(function() {
                    $(window).keydown(function(event){
                        if(event.keyCode === 13) {
                            event.preventDefault();
                            return false;
                        }
                    });
                });

                /* You want to be able to press enter to continue, this function fixes this. */
                document.addEventListener("keydown", function(e) {
                    if(e.keyCode === 13){
                        if (modal.style.display === "none"){
                            if (inputPage < 5) {
                                /* Only continue if all fields on current page are filled out */
                                if (inputPage === 1 || inputPage === 2) {
                                    var fields = document.getElementsByClassName("page" + inputPage + "input");
                                    var found = false; /* Is an empty field found? */
                                    for (var i = 0; i < fields.length; i++) {
                                        if (fields[i].value === ''){
                                            if (inputPage === 2 && fields[1]) {
                                                found = false;  /* Ignores empty if the input field is for root password, because the installation should not limit this */
                                            }else {
                                                found = true;  /* Empty field found */
                                            }
                                            /* Set background of text field to light red */
                                            fields[i].setAttribute("style", "background-color:rgb(255,210,210)");
                                        }
                                    }
                                    if (!found){
                                        /* If no empty field was found - proceed and reset values of text fields and hide warning text */
                                        document.getElementById("enterFields" + inputPage).style.display = "none";
                                        previousInputPage = inputPage;
                                        inputPage++;
                                        for (var i = 0; i < fields.length; i++) {
                                            fields[i].setAttribute("style", "background-color:rgb(255,255,255)");
                                        }
                                        updateInputPage();
                                    } else {
                                        /* Show the warning text if empty field was found */
                                        document.getElementById("enterFields" + inputPage).style.display = "inline-block";
                                    }
                                } else {
                                    /* Only page 1 and 2 has text fields so the rest have no rules */
                                    previousInputPage = inputPage;
                                    inputPage++;
                                    updateInputPage();
                                }
                            } else if (inputPage === 5){
                                submitButton.click();
                            }
                        }
                    }
                });

                function updateInputPage(){
                    /* Hide current input page */
                    hideInputPage();
                    /* Show the new input page when animation is done */
                    window.setTimeout(showInputPage,500);

                    /* Dont show left arrow on first page and dont show right arrow on last page */
                    if (inputPage === 1) {
                        document.getElementById('leftArrow').style.display = "none";
                    } else {
                        document.getElementById('leftArrow').style.display = "block";
                    }
                    if (inputPage === 5) {
                        document.getElementById('rightArrow').style.display = "none";
                    } else {
                        document.getElementById('rightArrow').style.display = "block";
                    }
                }

                function hideInputPage(){
                    /* Slide away the old page from the right direction depending on new page */
                    if (inputPage > previousInputPage) {
                        $('#th' + previousInputPage).hide("slide", {direction: "left" }, 500);
                        $('#td' + previousInputPage).hide("slide", {direction: "left" }, 500);
                    } else {
                        $('#th' + previousInputPage).hide("slide", {direction: "right" }, 500);
                        $('#td' + previousInputPage).hide("slide", {direction: "right" }, 500);
                    }
                }

                function showInputPage(){
                    /* Slide the new page from the right direction depending on previous page */
                    if (inputPage > previousInputPage) {
                        $('#th' + inputPage).show("slide", {direction: "right" }, 500);
                        $('#td' + inputPage).show("slide", {direction: "right" }, 500);
                    } else {
                        $('#th' + inputPage).show("slide", {direction: "left" }, 500);
                        $('#td' + inputPage).show("slide", {direction: "left" }, 500);
                    }
                    window.setTimeout(focusTheRightBox,500);
                }
            </script>

            <!-- Javascript to focus the right input box after modal is closed and hide boxes -->
            <script>
                /* When the user clicks on <span> (x), close the modal */
                span.onclick = function() {
                    if (modalRead) {
                        modal.style.display = "none";
                        focusTheRightBox();
                    }
                }

                /* When the user clicks anywhere outside of the modal, close it */
                window.onclick = function(event) {
                    if (event.target == modal && modalRead) {
                        modal.style.display = "none";
                        focusTheRightBox();
                    }
                }

                var writeOver1 = document.getElementById('writeOver1');
                writeOver1.onclick = function() {
                    focusTheRightBox();
                }

                /* Hide testdata boxes when testdata is un-checked */
                function fillDBchange(checkbox) {
                    if (checkbox.checked === true){
                        $("#testdataBoxes").show("slide", {direction: "left" }, 500);
                    } else {
                        $("#testdataBoxes").hide("slide", {direction: "left" }, 500);
                    }
                }

                function createDBchange(checkbox) {
                    if (checkbox.checked === true){
                        $("#DBboxes").show("slide", {direction: "left" }, 500);
                    } else {
                        $("#DBboxes").hide("slide", {direction: "left" }, 500);
                    }
                }
            </script>

            <!-- Empty footer to show a nice border at bottom -->
            <div id="inputFooter"></div>
        </div>
    </form>
    <!-- END OF INPUT FORM SECTION -->

    <!-- START of install section. When form is submitted mode will be changed to install and this will run
      -- Flush and ob_flush is used after every output in progress to dynamically show output when something was done.
      -->
    <?php if (isset($_GET["mode"]) && $_GET["mode"] == "install") {
        $putFileHere = cdirname(getcwd(), 2); // Path to lenasys
        ob_end_clean(); // Remove form and start installation.

        /* Pop-up window when installation is done. Hidden from start. */
        echo "
                    <div id='warning' class='modal'>

                        <!-- Modal content -->
                        <div class='modal-content'>
                            <span title='Close pop-up' class='close''>&times;</span>
                                <span id='dialogText'></span>
                        </div>

                    </div>";

        /* Javascripts for warning pop-up */
        echo "
            <script>
                var modalRead = false; // Have the user read info?
                var modal = document.getElementById('warning'); // Get the modal
                var btn = document.getElementById('showModalBtn'); // Get the button that opens the modal
                var span = document.getElementsByClassName('close')[0]; // Get the button that opens the modal
                var filePath = '{$putFileHere}';

                document.getElementById('dialogText').innerHTML = '<div><h1>!!!WARNING!!!</h1><br>' +
                    '<h2>READ INSTRUCTIONS UNDER INSTALL PROGRESS.</h2>' +
                    '<p>If you don\'t follow these instructions nothing will work. Group 3 will not take any ' +
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

        /***** START of installation progress ******/
        $putFileHere = cdirname(getcwd(), 1); // Path to lenasys
        $totalSteps = 1; // Variable to hold the total steps to complete.
        $completedSteps = 0; // Variable to hold the current completed steps.

        /* The following if-block will decide how many steps there are to complete installation. */
        if (isset($_POST["createDB"]) && $_POST["createDB"] == 'Yes') {
            $totalSteps += 4;
            if (isset($_POST["writeOverUSR"]) && $_POST["writeOverUSR"] == 'Yes') {
                $totalSteps++;
            }
            if (isset($_POST["writeOverDB"]) && $_POST["writeOverDB"] == 'Yes') {
                $totalSteps++;
            }
            if (isset($_POST["fillDB"]) && $_POST["fillDB"] == 'Yes') {
                $totalSteps += 4;
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

        /* Header.
         * Will contain title and progress bar.
         */
        echo "<div id='header'>
                <h1>Installation</h1>
                <svg id='progressBar' height='20px' width='50%' onresize='updateProgressBar(-1)'>
                    <rect id='progressRect' width='0' height='20px' />
                </svg>
                <span id='percentageText'></span>
                <a title='Restart installation.' href='install.php' id='goBackBtn' ><b>Restart installation</b></a>
            </div>";

        /* Javascripts to calculate length of progressRect. This will show the current progress in progressBar. */
        echo "
            <script>
            /* Function to remove decimals from percentage text */
            truncateDecimals = function (number) {
                return Math[number < 0 ? 'ceil' : 'floor'](number);
            };

            var totalSteps = {$totalSteps};
            var completedStepsLatest = 0; // This variable is used on window resize.

            function updateProgressBar(completedSteps){
                var totalWidth = document.getElementById(\"progressBar\").clientWidth;
                var stepWidth = totalWidth / totalSteps;
                var completedWidth;

                /* if window was resized (completedsteps = -1) take latest copleted steps.
                 * Else update to new completed step.
                 */
                if (completedSteps === -1) {
                    completedWidth = stepWidth * completedStepsLatest;
                } else {
                    completedStepsLatest = completedSteps;
                    completedWidth = stepWidth * completedSteps;
                }

                /* Calculate length */
                document.getElementById(\"progressRect\").setAttribute(\"width\", \"\" + completedWidth + \"\");

                /* Update percentage text */
                document.getElementById(\"percentageText\").innerHTML = \"\" +
                truncateDecimals((document.getElementById(\"progressRect\").getAttribute(\"width\") / totalWidth) * 100) +
                \"%\";

                /* Decide color depending on how far progress has gone */
                if (document.getElementById(\"progressRect\").getAttribute(\"width\") / totalWidth < 0.33){
                    document.getElementById(\"progressRect\").setAttribute(\"fill\", \"rgb(197,81,83)\");
                } else if (document.getElementById(\"progressRect\").getAttribute(\"width\") / totalWidth < 0.66){
                    document.getElementById(\"progressRect\").setAttribute(\"fill\", \"rgb(253,203,96)\");
                } else {
                    document.getElementById(\"progressRect\").setAttribute(\"fill\", \"green\");
                }
            }
        </script>";
        flush();
        ob_flush();

        echo "<div id='installationProgressWrap'>";
        # Test permissions on directory before starting installation.
        if(!mkdir("{$putFileHere}/testPermissionsForInstallationToStartDir", 0777)) {
            $errors++;
            exit ("<span id='failText' />Permissions on {$putFileHere} not set correctly, please restart the installation.</span><br>
                    <a title='Try again' href='install.php' class='returnButton'>Try again.</a>");
        } else {
            if (!rmdir("{$putFileHere}/testPermissionsForInstallationToStartDir")) {
                $errors++;
                exit ("<span id='failText' />Permissions on {$putFileHere} not set correctly, please restart the installation.</span><br>
                    <a title='Try again' href='install.php' class='returnButton'>Try again.</a>");
            } else {
                echo "<span id='successText' />Permissions on {$putFileHere} set correctly.</span><br>";
            }
        }
        $completedSteps++;
        echo "<script>updateProgressBar({$completedSteps});</script>";

        # Check if all fields are filled.
        $fields = array("newUser", "password", "DBName", "hostname", "mysqlRoot", "rootPwd");
        foreach ($fields AS $fieldname) { //Loop trough each field
            if (!isset($_POST[$fieldname]) || empty($_POST[$fieldname]) && !$_POST[$fieldname] === "rootPwd") {
                $errors++;
                exit ("<span id='failText' />Please fill all fields.</span><br>
                    <a title='Try again' href='install.php' class='returnButton'>Try again.</a>");
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
                echo "<span id='successText' />Connected successfully to {$serverName}.</span><br>";
            } catch (PDOException $e) {
                $errors++;
                exit ("<span id='failText' />Connection failed: " . $e->getMessage() . "</span><br>
                        You may have entered a invalid password or an invalid user.<br>
                        <a title='Try again' href='install.php' class='returnButton'>Try again.</a>");
            }
            $completedSteps++;
            echo "<script>updateProgressBar({$completedSteps});</script>";
            flush();
            ob_flush();

            # If checked, write over existing database and user
            if (isset($_POST["writeOverUSR"]) && $_POST["writeOverUSR"] == 'Yes') {
                # User
                try {
                $connection->query("DELETE FROM mysql.user WHERE user='{$username}';");
                echo "<span id='successText' />Successfully removed old user, {$username}.</span><br>";
                } catch (PDOException $e) {
                $errors++;
                echo "<span id='failText' />User with name {$username}
                            does not already exist. Will only make a new one (not write over).</span><br>";
                }
                $completedSteps++;
                echo "<script>updateProgressBar({$completedSteps});</script>";
                flush();
                ob_flush();
            }
            if (isset($_POST["writeOverDB"]) && $_POST["writeOverDB"] == 'Yes') {
                # Database
                try {
                    $connection->query("DROP DATABASE {$databaseName}");
                    echo "<span id='successText' />Successfully removed old database, {$databaseName}.</span><br>";
                } catch (PDOException $e) {
                    $errors++;
                    echo "<span id='failText' />Database with name {$databaseName}
                            does not already exist. Will only make a new one (not write over).</span><br>";
                }
                $completedSteps++;
                echo "<script>updateProgressBar({$completedSteps});</script>";
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
            echo "<script>updateProgressBar({$completedSteps});</script>";
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
            echo "<script>updateProgressBar({$completedSteps});</script>";
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
                echo "<span id='successText' />Initialization of database complete. </span><br>";
            } catch (PDOException $e) {
                $errors++;
                echo "<span id='failText' />Failed initialization of database because of query (in init_db.sql): </span><br>";
                echo "<div class='errorCodeBox'><code>{$completeQuery}</code></div><br><br>";
            }
            $completedSteps++;
            echo "<script>updateProgressBar({$completedSteps});</script>";
            flush();
            ob_flush();

            /*************** Fill database with test data if this was checked. ****************/
            if (isset($_POST["fillDB"]) && $_POST["fillDB"] == 'Yes' && $initSuccess) {
                addTestData("testdata", $connection);

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
            } else {
                echo "Skipped filling database with test data.<br>";
            }

        } else {
            echo "Skipped creating database.<br>";
        }
        $completedSteps++;
        echo "<script>updateProgressBar({$completedSteps});</script>";

        echo "<b>Installation finished.</b><br>";
        flush();
        ob_flush();
        // resetting timeout to what it was prior to installation
        set_time_limit($timeOutSeconds);
        echo "</div>";
        echo "<div id='inputFooter'><span title='Show or hide progress.'  id='showHideInstallation'>Show/hide installation progress.</span><br>
                <span id='errorCount'>Errors: " . $errors . "</span></div>"; # Will show how many errors installation finished with.

        # Collapse progress only if there are no errors.
        if ($errors == 0) {
            echo "<script>$('#installationProgressWrap').toggle(500);</script>";
        }

        # All this code prints further instructions to complete installation.
        $putFileHere = cdirname(getcwd(), 2); // Path to lenasys
        echo "<div id='doThisWrapper'>";
        echo "<h1><span id='warningH1' />!!!READ BELOW!!!</span></h1>";
        // Trying to put content and/or create coursesyspw.php.
        // If there already is a file it will be filled with the entered
        // credentials in case they don't match what was originally in the file
        // and if no file exists create one with credentials, if it fails
        // give instructions on how to create the file.
        try {
          // Start of Content to put in coursesyspw.
        $filePutContent = "<?php
        define(\"DB_USER\",\"".$username."\");
        define(\"DB_PASSWORD\",\"".$password."\");
        define(\"DB_HOST\",\"".$serverName."\");
        define(\"DB_NAME\",\"".$databaseName."\");
        ?>";
          // end of coursesyspw content
          file_put_contents($putFileHere."/coursesyspw.php",$filePutContent);
        } catch (\Exception $e) {
          echo "<br><b>To make installation work please make a
          file named 'coursesyspw.php' at {$putFileHere} with some code.</b><br>";
          echo "<b>We tried to create one for you but an error occured: see below how to do it yourself! </b></br>";
          echo "<b>Bash command to complete all this (Copy all code below/just click the box and paste it into bash shell as one statement):</b><br>";
          echo "<div title='Click to copy this!' class='codeBox' onclick='selectText(\"codeBox1\")'><code id='codeBox1'>";
          echo 'sudo printf "' . htmlspecialchars("<?php") . '\n';
          echo 'define(\"DB_USER\",\"' . $username . '\");\n';
          echo 'define(\"DB_PASSWORD\",\"' . $password . '\");\n';
          echo 'define(\"DB_HOST\",\"' . $serverName . '\");\n';
          echo 'define(\"DB_NAME\",\"' . $databaseName . '\");\n';
          echo htmlspecialchars("?>") . '" > ' . $putFileHere . '/coursesyspw.php';
          echo "</code></div>";
          echo '<div id="copied1">Copied to clipboard!<br></div>';
        }

		//Check upload_max_filesize parameter
		if(ini_get('upload_max_filesize')!='128M'){
			echo "<br>PHP ini setting <b>upload_max_filesize</b> should be 128M, it is currently: " . ini_get('upload_max_filesize') . " . Please change it here: <b>" . php_ini_loaded_file() . "</b>";
		}

        if(!connectLogDB()){
            echo "<br><b> Now create a directory named 'log' (if you dont already have it)<br>
            with a sqlite database inside at " . $putFileHere . " with permissions 777<br>
            (Copy all code below/just click the box and paste it into bash shell as one statement to do this).</b><br>";
    echo "<div title='Click to copy this!' class='codeBox' onclick='selectText(\"codeBox2\")'><code id='codeBox2'>";
    echo "mkdir " . $putFileHere . "/log && ";
    echo "chmod 777 " . $putFileHere . "/log && ";
    echo "sqlite3 " . $putFileHere . '/log/loglena4.db "" && ';
    echo "chmod 777 " . $putFileHere . "/log/loglena4.db";
    echo "</code></div>";
    echo '<div id="copied2">Copied to clipboard!<br></div>';
        }

        $lenaInstall = cdirname($_SERVER['SCRIPT_NAME'], 2);
        if(substr($lenaInstall, 0 , 2) == '/') {
			$lenaInstall = substr($lenaInstall, 1);
        }

        echo "<form action=\"{$lenaInstall}/DuggaSys/courseed.php\">";
        echo "<br><input title='Go to LenaSYS' class='button2' type=\"submit\" value=\"I have made all the necessary things to make it work, so just take me to LenaSYS!\" />";
        echo "</form>";
        echo "</div>";

    }

    # Function to add testdata from specified file. Parameter file = sql file name without .sql.
    function addTestData($file, $connection){
        global $errors;
        global $completedSteps;
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
        echo "<script>updateProgressBar({$completedSteps});</script>";
        flush();
        ob_flush();
    }

    # Function to copy test files
    function copyTestFiles($fromDir,$destDir) {
        global $completedSteps;
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
        echo "<script>updateProgressBar({$completedSteps});</script>";
        flush();
        ob_flush();
    }
    function connectLogDB() {
        if(!file_exists ('../../log')) {
            if(!mkdir('../../log')){
                echo "Error creating folder: log";
                return false;
            }
        }
        try {
            $log_db = new PDO('sqlite:../../log/loglena4.db');
        } catch (PDOException $e) {
            echo "Failed to connect to the database";
            return false;
        }

        $sql = '
            CREATE TABLE IF NOT EXISTS logEntries (
                id INTEGER PRIMARY KEY,
                eventType INTEGER,
                description TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                userAgent TEXT
            );
            CREATE TABLE IF NOT EXISTS userLogEntries (
                id INTEGER PRIMARY KEY,
                uid INTEGER(10),
                eventType INTEGER,
                description VARCHAR(50),
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                userAgent TEXT,
                remoteAddress VARCHAR(15)
            );
            CREATE TABLE IF NOT EXISTS serviceLogEntries (
                id INTEGER PRIMARY KEY,
                uuid CHAR(15),
                eventType INTEGER,
                service VARCHAR(15),
                userid VARCHAR(8),
                timestamp INTEGER,
                userAgent TEXT,
                operatingSystem VARCHAR(100),
                info TEXT,
                referer TEXT,
                IP TEXT,
                browser VARCHAR(100)
            );
            CREATE TABLE IF NOT EXISTS clickLogEntries (
                id INTEGER PRIMARY KEY,
                target TEXT,
                mouseX TEXT,
                mouseY TEXT,
                clientResX TEXT,
                clientResY TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS mousemoveLogEntries (
                id INTEGER PRIMARY KEY,
                page TEXT,
                mouseX TEXT,
                mouseY TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS exampleLoadLogEntries(
                id INTEGER PRIMARY KEY,
                type INTEGER,
                courseid INTEGER,
                exampleid INTEGER,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS duggaLoadLogEntries(
                id INTEGER PRIMARY KEY,
                type INTEGER,
                cid INTEGER,
                vers INTEGER,
                quizid INTEGER,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ';
        $log_db->exec($sql);
        return true;
    }
    ?>

    <script>
        /* Show modal */
        modal.style.display = "block";
        var showHideButton = document.getElementById('showHideInstallation');

        if (showHideButton !== null){
            showHideButton.onclick = function(){
                toggleInstallationProgress();
            }
        }

        /* Show/Hide installation progress. */
        function toggleInstallationProgress(){
            $('#installationProgressWrap').toggle(500);
        }

        /* Function to select and copy text inside code boxes at end of installation. */
        function selectText(containerid) {
            /* Get selection inside div. */
            var text = document.getElementById(containerid);
            if (document.body.createTextRange) {
                var range = document.body.createTextRange();
                range.moveToElementText(text);
                range.select();
            } else {
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(text);
                selection.removeAllRanges();
                selection.addRange(range);
            }

            /* Copy selection. */
            document.execCommand("copy");

            /* Remove selection. */
            window.getSelection().removeAllRanges();

            /* Show the 'copied' text to let user know that text was copied to clipboard.
             * After show animation is done it will call hide function to hide text again.
             */
            if (containerid === "codeBox1") {
                $("#copied1").show("slide", {direction: "left" }, 1000);
                window.setTimeout(function() { hideCopiedAgain("#copied1")}, 2000);
            } else if (containerid === "codeBox2") {
                $("#copied2").show("slide", {direction: "left" }, 1000);
                window.setTimeout(function() { hideCopiedAgain("#copied2")}, 2000);
            }
        }

        /* Hide 'copied' text */
        function hideCopiedAgain(text) {
            $(text).hide("slide", {direction: "right"}, 1000)
        }
    </script>

</body>
