
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

            // // // $logContet['opt'][$arr['opt']];
            // // // foreach($arr['apara'] as $row){
            // // //     $logContet['apara'][$row];
            // // // }
            // // // $logContet['kind'][$arr['kind']];
            // // // $logContet['apara_type'][$arr['apara_type']];
            // // // $logContet['dateTime'][$arr['dateTime']];


            // // foreach ($apara[1] as $arr)
            // //             {
            // //     echo "<tr>";
            // //     echo "<td>".$array[0]."</td>"; 
            // //     echo "<td>".$array[1]."</td>";
            // // }

            // print_r($logContet);

            // echo "<table style='width:100%'>";
            //     foreach($logContet as $row){
            //         echo "<tr>";
            //             foreach($logContet as $colum){
            //                 echo "<td>".$logContet[$row][$column]."</td>";
            //             }
            //         echo "</tr>";
            //     }
            // echo "</table>";
            
            
            echo "<table style='width:100%'>";
                echo "<tr>";
                    echo "<th> Options </th>";
                    echo "<th> Parameters </th>";
                    echo "<th> Kind of Page </th>";
                    echo "<th> Parameter type </th>";
                    echo "<th> Date </th>";
                echo "</tr>";
                echo "<tr>";
                    // Arrays of arrays can be traversed using a nested foreach
                    foreach ($arr as $key => $value) {
                        echo $value."</br>";
                        foreach ($value as $valuekey => $valuevalue) {
                        echo "<tb>".$valuekey.": ".$valuevalue."</td></br>";
                        }
                    }
                    echo "<br>";

                    // Arrays of arrays can be printed with print_r
                    // print_r($array);

                    // foreach($arr as $row){
                    //     foreach($row as $value){
                    //         echo 
                    //     }
                    // }
                echo "</tr>";
            echo "</table>";

            // $opt = $arr['opt'];
            // $apara[] = $arr['apara'];
            // $kind = $arr['kind'];
            // $apara_type = $arr['apara_type'];
            // $dateTime = $arr['dateTime'];           

        
            // // // // echo "<table style='width:100%'>";
            // // // //     echo "<tr>";
            // // // //         echo "<th> Options </th>";
            // // // //         echo "<th> Parameters </th>";
            // // // //         echo "<th> Kind of Page </th>";
            // // // //         echo "<th> Parameter type </th>";
            // // // //         echo "<th> Date </th>";
            // // // //     echo "</tr>";
            // // // //     echo "<tr>";
            // // // //         echo "<td>".$opt."</td>";
            // // // //         /*echo "<td>".foreach($apara as $value){
            // // // //             echo $value;
            // // // //         }."</td>";*/
            // // // //         echo "<td>".$apara."</td>";
            // // // //         echo "<td>".$kind."</td>";
            // // // //         echo "<td>".$apara_type."</td>";
            // // // //         echo "<td>".$dateTime."</td>";
            // // // //     echo "</tr>";
            // // // // echo "</table>";

        ?>    
    </body>

</html>