<head>
  <title>Install LenaSYS!</title>
  <link rel="stylesheet" type="text/css" href="style.css">
  <script src="../Shared/js/jquery-1.11.0.min.js"></script>
  <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="new_components.js"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</head>
<body>
    <?php
        $value1 = null;
        $value2 = null;
        function testButton($value1,$value2) {
            echo "<div class='buttonContainer'>";
            echo "<button class='backButton' onclick='breadCrumbDecr(); breadCrumbActive();'>".$value1."</button>";
            echo "<button class='progressButton' onclick='breadCrumbInc(); breadCrumbActive();'>".$value2."</button>";
            echo "</div>";
        }

        function testBreadcrumb() {
            echo "<div>
                    <ul class='breadcrumbs'>
                        <li id='bcStep1' class='breadcrumb breadcrumb-selected'>Step 1</li><span class='arrow_icon'>
                            &gt;
                            </span>
                        <li id='bcStep2' class='breadcrumb'>Step 2</li><span class='arrow_icon'>
                            &gt;
                            </span>
                        <li id='bcStep3' class='breadcrumb'>Step 3</li><span class='arrow_icon'>
                            &gt;
                            </span>
                        <li id='bcStep4' class='breadcrumb'>Step 4</li><span class='arrow_icon'>
                            &gt;
                            </span>
                        <li id='bcStep5' class='breadcrumb'>Step 5</li><span class='arrow_icon'>
                            &gt;
                            </span>
                        <li id='bcStep6' class='breadcrumb'>Step 6</li>
                    </ul>
                </div>";
        }

        function testHeader2($header2Text) {
            echo "<div>
                <h2 class='header-2'>".$header2Text."</h2>
                </div>";
        }

        function testBodyText($bodyText) {
            echo "<div class='body-text'>
                <p>".$bodyText."</p>
                </div>";
        }

        function testProgressBar() {
            echo "<div class='progressBar'>
                    <div class='progressBarLabels'>
                        <label>lenasys/dugga...</label>
                        <label>15%</label>
                    </div>
                    <div class='progressBarBorder'>
                        <div class='progressBarIndicator'></div>
                    </div>
                </div>";
        }

        function testInputField($inputId, $inputLabel) {
            echo "<div class='input-field'>
                        <label for='$inputId'>$inputLabel</label>
                        <input id='$inputId' type='text'>
                </div>";
        }

        function testInputFieldAccText($inputId, $inputLabel, $accClass, $accText) {
            echo "<div class='input-field'>
                        <label for='$inputId'>$inputLabel</label>
                        <input id='$inputId' type='text'>              
                        <p class='$accClass'>".$accText."</p>        
                </div>";
        }

        function testCheckBox($checkBoxId, $checkBoxText) {
            echo "<div class='checkbox'>
                    <input id='$checkBoxId' type='checkbox'>
                    <label for='$checkBoxId'>".$checkBoxText."</label>
                </div>";
        }
        function testCheckBoxAccText($checkBoxId, $checkBoxText, $accClass, $accText) {
            echo "<div class='checkbox'>
                    <input id='$checkBoxId' type='checkbox'>
                    <label for='$checkBoxId'>".$checkBoxText."</label>
                    </div>
                    <p class='$accClass'>".$accText."</p>";
        }
    ?>

    <div class="page" id="page1">
        <div class="banner">
            <h1 class="header-1">Installer <b>LenaSYS</b> </h1>
        </div>
        <div class="wrapper">
            <?php
                testBreadcrumb()
            ?>
        <div class="content">
            <?php
                $testHeader2 = "Create New Database & User";
                testHeader2($testHeader2);
            ?>
            <div class="inner-wrapper">
                <?php
                    testBodyText("Provide the following data for the data and user.");
                    echo "<div class='input-grid'>";
                        testInputField("databaseName","Database Name");
                        testInputField("mySQLUser", "MySQL user");
                        testInputFieldAccText("hostname", "Hostname", "tip","Usaually set to localhost" );
                        testInputField("mySQLUserPW", "MySQL user password");
                        testCheckBox("distributed_environment","Use Distributed Environment");
                        testCheckBox("iniDatabaseTrans","Initialize database as transaction");
                        echo "<div class='grid-element-span'>";
                        testCheckBoxAccText("overwriteDatabase","Overwrite existing database and user names", "warning", "WARNING! Overwriting databases and users cannot be undone!");
                        testCheckBoxAccText("overwriteDatabase","Overwrite existing database and user names", "success", "WARNING! Overwriting databases and users cannot be undone!");
                        echo "</div>";
                    echo "</div>";
                ?>
            </div>
        </div>

        <?php
            testButton("Back","Continue");
            testProgressBar();
        ?>
    </div>
</body>