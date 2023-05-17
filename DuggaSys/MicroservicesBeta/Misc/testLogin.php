



<?php 
pdoConnect();
session_start();
include ("../../../shared/dugga.js");
include("../../../shared/sessions.php");
//echo '<script> testLogin_showLoginPopup(); </script>'; 



require __DIR__ . '../Misc/checkUserStatus.php';

echo checkUserStatusTest();
?>
<!DOCTYPE html>
<html lang="en">
<body onload="showLoginPopUp();">
   
</body>
</html>

