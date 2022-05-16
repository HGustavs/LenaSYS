<head>
<link rel="stylesheet" type="text/css" href="CSS/install_style.css">
  <script src="../Shared/js/jquery-1.11.0.min.js"></script>
  <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
</head>

<body>
<?php
$serverName = "";
$databaseName = "";
$connection = "";
$rootUser = "root";
$rootPwd = "";
$serverName = "";
$username = "";
$password = "";



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
                }else if($tArray[1]=="DB_HOST"){
                 $GLOBALS['serverName'] = $tArray[3];
                   
                }else if($tArray[1]=="DB_NAME"){
                  $GLOBALS['databaseName'] = $tArray[3];
                }else if($tArray[1]=="DB_PASSWORD"){
                  $GLOBALS['password'] = $tArray[3];
                }
            }
            }
        }
    }                  
}

function recreate_db() {
    global $serverName,$rootUser,$rootPwd,$databaseName,$connection,$username,$password;
    $GLOBALS['connection'] =new PDO("mysql:host=$serverName", $rootUser, $rootPwd);
    $connection = new PDO("mysql:host=$serverName", $rootUser, $rootPwd);
    $connection->query("DROP DATABASE {$databaseName}");
    $connection->query("CREATE DATABASE {$databaseName}");
    

    // $connection->query("FLUSH PRIVILEGES");
    // $connection->query("CREATE USER '{$username}@{$serverName}' IDENTIFIED BY '{$password}'");
    // $connection->query("GRANT ALL PRIVILEGES ON *.* TO '{$username}@{$serverName}'");
    // $connection->query("FLUSH PRIVILEGES");
}
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

function init_db(){

}  
function fillDatabase(){
    global $connection;
    addTestData("testdata", $connection);
    addTestData("demoCourseData", $connection);
    addTestData("testingCourseData", $connection);
    $putFileHere = cdirname(getcwd(),1);
    copyTestFiles("{$putFileHere}/install/md/", "{$putFileHere}/DuggaSys/templates/");
    $checkBoxes = array("html", "java", "php", "plain", "sql", "sr");
    foreach ($checkBoxes AS $boxName) { //Loop trough each field
        addTestData("keywords_{$boxName}", $connection);
    }
      
      
}
function addTestData($file, $connection){
    $testDataQuery = @file_get_contents("SQL/{$file}.sql");
    # Split SQL file at semi-colons to send each query separated.
    $testDataQueryArray = explode(";", $testDataQuery);
    try {
      foreach ($testDataQueryArray AS $query) {
        $completeQuery = $query . ";"; // Add semi-colon to each query.
        if (trim($query) != '') { // do not send if empty query.
          $connection->query($completeQuery);
        }
      }
   
    } catch (PDOException $e) {
   
    }
}
function copyTestFiles($fromDir,$destDir){
    $dir = opendir($fromDir);
    @mkdir($destDir);
    while (false !== ($copyThis = readdir($dir))) {
      if (($copyThis != '.') && ($copyThis != '..')) {
        copy($fromDir . '/' . $copyThis, $destDir . '/' . $copyThis);
      }
    }
    closedir($dir);
}



        load_values();
        recreate_db();
        init_db();
        fillDatabase();
       

    ?>
</body>

           