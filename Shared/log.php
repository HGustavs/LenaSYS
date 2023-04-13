
<html>
    <head>
    <style>
        table, th, td {
        border:1px solid black;
    }
</style>
    </head>
    <body>
        
        <?php

            $url = "https://cms.webug.se/root/G2/students/a21jeaha/LenaSYS/Shared/latestlog.json";
            $jsontext = file_get_contents($url);
            $arr = json_decode($jsontext, true);
            var_dump(json_decode($jsontext,true))

            $opt = $arr['opt'];
            $apara[] = $arr['apara'];
            $kind = $arr['kind'];
            $apara_type = $arr['apara_type'];
            $dateTime = $arr['dateTime'];           

        
            echo "<table style='width:100%'>";
                echo "<tr>";
                    echo "<th> Options </th>";
                    echo "<th> Parameters </th>";
                    echo "<th> Kind of Page </th>";
                    echo "<th> Parameter type </th>";
                    echo "<th> Date </th>";
                echo "</tr>";
                echo "<tr>";
                    echo "<td>".$opt."</td>";
                    echo "<td>".$apara."</td>";
                    echo "<td>".$kind."</td>";
                    echo "<td>".$apara_type."</td>";
                    echo "<td>".$dateTime."</td>";
                echo "</tr>";
            echo "</table>";



            // echo "<table>";
            //     echo "<td>".$opt;."</td>";
            //         echo"<tr>";
            //             foreach($apara as $value){
            //                 echo "<td>".$value."</td>";
            //             }
            //         echo "</tr>";
                    
            //         echo "<tr>";
            //         echo "<td>".$kind."</td>";
            //         echo "<td>".$apara_type."</td>";
            //         echo "<td>".$dateTime."</td>";
            //     echo "</tr>";
            // echo "</table>";    
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