<head>
  <title>Install LenaSYS!</title>
  <link rel="stylesheet" type="text/css" href="style.css">
  <script src="../Shared/js/jquery-1.11.0.min.js"></script>
  <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
  
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</head>
<body>
    <?php
        $value1 = null;
        $value2 = null;
        function testButton($value1,$value2) {
            echo "<div class='buttonContainer'>";
            echo "<button class='backButton'>".$value1."</button>";
            echo "<button class='progressButton' onclick='breadCrumbInc();'>".$value2."</button>";
            echo "</div>";
        }

        function testBreadcrumb() {
            echo "<div>
                    <ul class='breadcrumbs'>
                        <li>Step 1</li><span class='arrow_icon'>
                            &gt;
                            </span>
                        <li>Step 2</li><span class='arrow_icon'>
                            &gt;
                            </span>
                        <li class='breadcrumb-selected'>Step 3</li><span class='arrow_icon'>
                            &gt;
                            </span>
                        <li>Step 4</li><span class='arrow_icon'>
                            &gt;
                            </span>
                        <li>Step 5</li><span class='arrow_icon'>
                            &gt;
                            </span>
                        <li>Step 6</li>
                    </ul>
                </div>";
        }
          
    ?>

    <div class="page">
    <div class="banner">
            <h1 class="header-1">Installer <b>LenaSYS</b> </h1>
        </div>
        <div class="wrapper">
            <?php
                testBreadcrumb()
            ?>
        <div>
            Some random text...
        </div>
        <?php
            testButton("Back","Continue");
        ?>
    </div>
    <script>
        var stepSelected = 1;
        function breadCrumbInc() {
            stepSelected += 1;
            console.log(stepSelected);
        }
    </script>
</body>