





<?php

    $url = "https://cms.webug.se/root/G2/students/a21jeaha/LenaSYS/Shared/logging.json";
    $jsontext = file_get_contents($url);
    $arr = json_decode($jsontext);

    print_r($arr);








    // if(isset ($_POST)){
    //     $test = file_get_contents("php://input");
    //     $testArray = json_decode($test, true); 
    //     foreach($testArray as $value ){
    //         echo $value;
    //     }
    //     // echo $testArray["kind"];
    //     // echo json_encode[$test];
    // }
    

    // // if ($_POST['input']) {
    // //     echo $_POST['input'];
    // // }

    // // echo "<p>";
?>

<!-- echo "<form action='dugga.js' method='POST'>"; -->