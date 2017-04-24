<?php
    $myfile = fopen("Saves/test.txt", "w");
    if( $_REQUEST["hash"] ) {

        $hash = $_REQUEST['hash'];
        echo "Welcome " . $hash;
    }

   // $bar = $_POST['bar'];
   // echo($bar);
//
?>
<script>
    console.log();
</script>

