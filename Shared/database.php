
<?php
include_once(dirname(__file__)."/../../umvpw.php");
//---------------------------------------------------------------------------------------------------------------
// dbconnect - Makes database connection
//---------------------------------------------------------------------------------------------------------------
$pdo = null;

//---------------------------------------------------------------------------------------------------------------
// err - Displays nicely formatted error and exits
//---------------------------------------------------------------------------------------------------------------
function err ($errmsg,$hdr='')
{
        if(!empty($hdr)){
                        echo($hdr);
        }
        print "<p><span class=\"err\">Serious Error: <br /><i>$errmsg</i>.";
        print "</span></p>\n";
        exit;
}

$dbh = new PDO('mysql:host=localhost; DB_USERNAME', 'DB_PASSWORD', $DB_USERNAME, $DB_PASSWORD);

?>

