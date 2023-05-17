



<?php 
pdoConnect();
session_start();
include ("../../../shared/dugga.js");
include("../../../shared/sessions.php");
//echo '<script> testLogin_showLoginPopup(); </script>'; 



require __DIR__ . '../Misc/checkUserStatus.php';

echo checkUserStatusTest();
var_dump(checkUserStatusTest());
?>
<!DOCTYPE html>
<html lang="en">
<body onload="">
   
</body>
</html>

