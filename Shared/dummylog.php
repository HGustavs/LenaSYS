<html>
<head>
    <style>
        table, th, td {
        border:1px solid black;
    }
    </style>    
</head>

    <body>

        <table border='1'>

        <?php
        
            function debug($o){
                echo '<pre>';
                print_r($o);
                echo '</pre>';
            }

            
              
            try {
	            $log_db = new PDO('sqlite:../../log/loglena6.db');
            } catch (PDOException $e) {
	            echo "Failed to connect to the database";
	            throw $e;
            }
            // $log_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
            // $log_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);           // en del av error hanteringen.

    
            echo "<tr><th>DuggaLoadLogEntries</th><th>exampleLoadLogEntries</th><th>logEntries</th><th>serviceLogEntries</th><th>userHistory</th><th>userLogEntries</th></tr>";
            

            
            echo "<select name='Db Tables'>";
            /*foreach ($arr as $dbtables) {
                 echo '<option value="'.$dbtables[1].'" >'.$dbtables[0].'</option>';
                } */
                echo "<input type='submit' value='Get Tables'>"; 
                echo "</select>"; 
                echo "</form>";
                   // Get tillverkare or default    
                 /*if(isset($_POST['dbtables']))
                 {
                    $indbtables=$_POST['dbtables']; 
                }
                    else{
                        $indbtables="Tokigt";
                    }*/
            
            echo "<table style='width:100%'>";
                foreach($log_db->query('SELECT * FROM serviceLogEntries;') as $column) {
                    echo "<th>".$column['Field']."</th>";
                    echo "<script> console.log(".$column['Field']."); </script>"; 
                    debug($column);
                }  
            echo "</table>";
            
            
            // echo "<table style='width:100%'>";
            //     foreach($log_db->query('SELECT * FROM serviceLogEntries;') as $row) {
            //         echo "BALALA";
            //         echo "<th>".$row['uuid']."</th>";
            //         echo "<script> console.log(".$row['uuid']."); </script>";
            //         printf("EFTER".$row['Field']); 

            //     }  
            // echo "</table>";
            

            $url = "https://cms.webug.se/root/G2/students/a21jeaha/LenaSYS/Shared/latestlog.json";
            $jsontext = file_get_contents($url);
            $arr = json_decode($jsontext, true);
            
            
            // echo "<table style='width:100%'>";
            //     echo "<tr>";
            //         echo "<th> Options </th>";
            //         echo "<th> Parameters </th>";
            //         echo "<th> Kind of Page </th>";
            //         echo "<th> Parameter type </th>";
            //         echo "<th> Date </th>";
              
            //     echo "<tr>";
            //         // Arrays of arrays can be traversed using a nested foreach
            //         foreach ($arr as $key => $value) {
            //             echo $value."</br>";
            //             foreach ($value as $valuekey => $valuevalue) {
            //             echo "<td>".$valuekey.": ".$valuevalue."</td></br>";
            //             }
            //         }
            //         echo "<br>";
            //         echo "</tr>";

            
            //     echo "</tr>";
            // echo "</table>";

           

        ?>    
        </table>
    </body>

</html>