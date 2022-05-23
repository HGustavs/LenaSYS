<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install LenaSYS!</title>
    <link rel="stylesheet" type="text/css" href="CSS/install_style.css">
</head>

<body>
  <!-- Header showing the showModalButton-->
  <div id="installHeader">
    <h1>Light LenaSYS Installer</h1>
    <div class="inputHeading" valign=top>
      <div><h2>WARNING! </h2></div>
    </div>
  </div>
  <?php 
    echo '<div id="contentWrapper">';
    echo '<div class="inputContent" id="td1">';
    echo '<p id="infoText" style="text-align: center;"><b>By clicking install the database will be dropped and reinitialized with the original courses. This is done to clean the table of contents in sectioneed.</b></p><hr>';
    echo '<form method="POST" action="install_light.php">';
	echo '<label for="fname">Root Password:</label><br>';
    echo '<input type="password" id="fname" name="fname" ><br>';
    echo '<input id="submitInput" class="button" type="submit" name="install" value="Install!"/>';
    echo '</form>';
    echo '</div>';
    echo '</div>';

    if(isset($_POST['install'])) {
    
      $canProceed = true;
      $serverName = "";
      $databaseName = "";
      $connection = "";
      $rootUser = "root";
      $rootPwd = "";
      $serverName = "";
      $username = "";
      $password = "";
      //Loads in the user values from the coursesyspw.php file.
      function load_values(){
        $credentialsFile = "../../coursesyspw.php";
        if(file_exists($credentialsFile)) {
          $credentialsArray = file($credentialsFile, FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES);
          foreach($credentialsArray as $cred) {
            if(stripos(trim($cred), 'DB_') !== FALSE){
              $tArray = explode('"', trim($cred));
              if(count($tArray) == 5) {
                if($tArray[1]=="DB_USER"){
                  $GLOBALS['username'] = $tArray[3];
                }
                else if($tArray[1]=="DB_HOST"){
                  $GLOBALS['serverName'] = $tArray[3];
                }
                else if($tArray[1]=="DB_NAME"){
                  $GLOBALS['databaseName'] = $tArray[3];
                }
                else if($tArray[1]=="DB_PASSWORD"){
                  $GLOBALS['password'] = $tArray[3];
                }
              }
            }
          }
        }
      $GLOBALS['canProceed'] = true; 
      }

      //Drops the database and recreates it with the same name.
      function recreate_db() {
        $GLOBALS['canProceed'] = false; 
        global $serverName,$rootUser,$databaseName,$connection,$username,$password;
		$rootPwd = $_POST['fname'];
        $GLOBALS['connection'] =new PDO("mysql:host=$serverName", $rootUser, $rootPwd);
        $connection = new PDO("mysql:host=$serverName", $rootUser, $rootPwd);
        $connection->query("DROP DATABASE {$databaseName}");
        $connection->query("CREATE DATABASE {$databaseName}");

        $GLOBALS['canProceed'] = true; 
      }

      //Filepath compatability. 
      function cdirname($path, $level) {
        $GLOBALS['canProceed'] = false; 
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
        } 
          else {
            $r = '/';
            for($i = 0; $i < count($paths) - $level; $i++) {
              if($i > 1) {
                $r .= '/';
              }
              $r .= $paths[$i];
            }
          }
        $GLOBALS['canProceed'] = true; 
        // Re-add the drive letter if there was one ('C:' + '/.../')
        return $prefix . $r;
      };

      //Loads in all the tables for the database.
      function init_db(){
        
        $GLOBALS['canProceed'] = false; 
        global $connection,$databaseName;
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
        $completeQuery = null;
        $connection->beginTransaction();
        $connection->query("SET NAMES utf8");
        $connection->query("USE {$databaseName}");
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
        $GLOBALS['canProceed'] = true; 
      }

      //Fills the database with all the duggas and files.  
      function fillDatabase(){
        $GLOBALS['canProceed'] = false; 
        global $connection;
        addTestData("testdata", $connection);
        addTestData("demoCourseData", $connection);
        addTestData("testingCourseData", $connection);

        $putFileHere = cdirname(getcwd(),1);
        copyTestFiles("{$putFileHere}/install/md/", "{$putFileHere}/DuggaSys/templates/");
        copyTestFiles("{$putFileHere}/install/courses/global/", "{$putFileHere}/courses/global/");
        copyTestFiles("{$putFileHere}/install/courses/1/", "{$putFileHere}/courses/1/");
        copyTestFiles("{$putFileHere}/install/courses/2/", "{$putFileHere}/courses/2/");

        $checkBoxes = array("html", "java", "php", "plain", "sql", "sr");
        foreach ($checkBoxes AS $boxName) { //Loop trough each field
            addTestData("keywords_{$boxName}", $connection);
        }
        $GLOBALS['canProceed'] = true;   
      }
	  
      //Function for finding and moving testdata from the install to the live version folder.
      function addTestData($file, $connection){
        $GLOBALS['canProceed'] = false; 
        $testDataQuery = @file_get_contents("SQL/{$file}.sql");
        # Split SQL file at semi-colons to send each query separated.
        $testDataQueryArray = explode(";", $testDataQuery);
        foreach ($testDataQueryArray AS $query) {
          $completeQuery = $query . ";"; // Add semi-colon to each query.
          if (trim($query) != '') { // do not send if empty query.
            $connection->query($completeQuery);
          }
        }
        $GLOBALS['canProceed'] = true; 
      }
        
      //Function for finding and moving testfiles from the install folder to the live version folder.
      function copyTestFiles($fromDir,$destDir){
        $GLOBALS['canProceed'] = false; 
        $dir = opendir($fromDir);
        @mkdir($destDir);
        while (false !== ($copyThis = readdir($dir))) {
          if (($copyThis != '.') && ($copyThis != '..')) {
            copy($fromDir . '/' . $copyThis, $destDir . '/' . $copyThis);
          }
        }
        $GLOBALS['canProceed'] = true; 
        closedir($dir);
      }

      function redirectToHomePage(){
        $GLOBALS['canProceed'] = false; 
        $lenaInstall = null;
        $lenaInstall = cdirname($_SERVER['SCRIPT_NAME'], 2);
        if(substr($lenaInstall, 0 , 2) == '/') {
          $lenaInstall = substr($lenaInstall, 1);
        }
        header("Location: {$lenaInstall}/DuggaSys/courseed.php");
        $GLOBALS['canProceed'] = true;     
        exit();
      }
           
      if($canProceed){
        load_values();
      }
      if($canProceed){
        recreate_db();
      }
      if($canProceed){
        init_db();
      }
      if($canProceed){
        fillDatabase();
      }
      if($canProceed){
        redirectToHomePage();
      }

      if(!$canProceed){
        echo "Something went wrong.";
        //TODO: If (something went wrong) {graceful exit}
        // canProceed should probably be an integer for error codes
      }
    }     
  ?>
  <!-- Empty footer to show a nice border at bottom -->
  <div id="inputFooter"></div>
</body>
</html>         