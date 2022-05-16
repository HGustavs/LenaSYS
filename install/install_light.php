<head>
<link rel="stylesheet" type="text/css" href="CSS/install_style.css">
  <script src="../Shared/js/jquery-1.11.0.min.js"></script>
  <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
</head>

<body>
<?php
$rootUser = "";
$rootPwd = "";
$serverName ="";
$databaseName = "";
$connection = "";
$dbUsername = "";
$dbHostname = "";
$dbName = "";
$dbPassword = "";
function init_db(){
    $rootUser = $_POST["mysqlRoot"];
    $rootPwd = $_POST["rootPwd"];
    $serverName = $_POST["hostname"];
    $databaseName = $_POST["DBName"];
    $connection = new PDO("mysql:host=$serverName", $rootUser, $rootPwd);
  
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
          $connection->query("DROP DATABASE {$databaseName}");
          $connection->query("CREATE DATABASE {'Nhodert'}");
          
        }


        init_db();





    ?>
</body>
