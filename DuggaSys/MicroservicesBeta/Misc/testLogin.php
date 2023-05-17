



<?php 
pdoConnect();
session_start();
include ("../../../shared/dugga.js");
include("../../../shared/sessions.php");
//echo '<script> testLogin_showLoginPopup(); </script>'; 



require __DIR__ . '../Misc/checkUserStatus.php';

echo checkUserStatusTest();
?>
<html lang="en">
<body onload="showLoginPopUp();">
   

    <button >Call checkUserStatusTest</button>
</body>
</html>

