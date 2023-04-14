<html>
<head>
    <style>
        table, th, td {
        border:1px solid black;
    }
    </style>    
</head>

    <body>
    <form id="form1" name="form1" method="post" action="<?php echo $PHP_SELF; ?>">  
    Table List :  
            <select dbtable Name='NEW'>  
            <option value="">--- Select ---</option> 

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

    
            //echo "<tr><th>DuggaLoadLogEntries</th><th>exampleLoadLogEntries</th><th>logEntries</th><th>serviceLogEntries</th><th>userHistory</th><th>userLogEntries</th></tr>";
              
                //mysql_connect ("localhost","root","");  
                mysql_select_db ("company");  
                $select="company";  
                if (isset ($select)&&$select!=""){  
                $select=$_POST ['NEW'];  
            }  
            ?>  
            <? 
            $list=mysql_query("select * from employee order by emp_id asc");  
            while($row_list=mysql_fetch_assoc($list)){  
                ?>  
                    <option value="<? echo $row_list['emp_id']; ?>"<? if($row_list['emp_id']==$select){ echo "selected"; } ?>>  
                                         <?echo $row_list['emp_name'];?>  
                    </option>  
                <?  
                }  
                ?>  
            </select>  
            <input type="submit" name="Submit" value="Select" />  
        </form>

            
           <?php 
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