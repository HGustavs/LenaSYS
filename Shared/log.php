
<html>
    <head>
        <style>
            span{
                padding-left:8px;
            }
        </style>
    </head>
    <body>
        <table border='1'>
        <?php

            $url = "https://cms.webug.se/root/G2/students/a21jeaha/LenaSYS/Shared/logging.json";
            $jsontext = file_get_contents($url);
            $arr = json_decode($jsontext, true);

            $opt = $arr['opt'];
            $apara[] = $arr['apara'];
            $kind = $arr['kind'];
            $apara_type = $arr['apara_type'];
            $dateTime = $arr['dateTime'];           

            echo "<ul>";
                echo $opt;
                foreach($apara as $value){
                    echo $value;
                }
                echo $kind;
                echo $apara_type;
                echo $dateTime;
            echo "</ul>"; 


            // print_r($arr);











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
    </body>
    
</html>
<!-- echo "<form action='dugga.js' method='POST'>"; -->