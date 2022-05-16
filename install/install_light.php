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



function init_db(){
$credentialsFile = "../../coursesyspw.php";
    if(file_exists($credentialsFile)) {
        $credentialsArray = file($credentialsFile, FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES);
        foreach($credentialsArray as $cred) {
            if(stripos(trim($cred), 'DB_') !== FALSE){
                $tArray = explode('"', trim($cred));
            if(count($tArray) == 5) {
                if($tArray[1]=="DB_USER"){
                  $dbUsername = $tArray[3];
                }else if($tArray[1]=="DB_HOST"){
                 $GLOBALS['serverName'] = $tArray[3];
                   
                }else if($tArray[1]=="DB_NAME"){
                  $GLOBALS['databaseName'] = $tArray[3];
                }else if($tArray[1]=="DB_PASSWORD"){
                  $dbPassword = $tArray[3];
                }
            }
            }
        }
    }                  
}

function recreate_db() {
    global $serverName,$rootUser,$rootPwd,$databaseName,$connection;
    $connection = new PDO("mysql:host=$serverName", $rootUser, $rootPwd);
    $connection->query("DROP DATABASE {$databaseName}");
    $connection->query("CREATE DATABASE {$databaseName}");
}

function fillDatabase(){

}
        init_db();
        recreate_db();

    ?>
</body>
