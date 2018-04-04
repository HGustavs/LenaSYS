<!DOCTYPE html>
<html>
<body>

<h2>Myfirst page</h2>



<?php
$t = date("h:i");
echo $t;

if ($t < "20") {
    echo "Have a good day!";
}

?>

</body>
</html>
