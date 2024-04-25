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

        function breadCrumbActive() {
            var breadcrumbs = document.getElementsByClassName("breadcrumb");
        for(breadcrumb of breadcrumbs)
        {
            breadcrumb.classList.remove("breadcrumb-selected");
        }
        document.getElementById('bcStep'+stepSelected).classList.add("breadcrumb-selected");
        }

        function breadCrumbInc() {
            stepSelected += 1;
            if(stepSelected>=6){
                stepSelected = 6;
            }
            console.log(stepSelected);
        }
        function breadCrumbDecr() {
            stepSelected -= 1;
            if(stepSelected<=1){
                stepSelected = 1;
            }
            console.log(stepSelected);
        }
    </script>
</body>