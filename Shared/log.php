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
        ?>
            <span><form id="form1" name="form1" method="post" action="<?php echo $PHP_SELF; ?>">

        <?php    
                echo 'choose table';

                echo '<select onchange="submit();" name="SpannNamn" >';

                    foreach($log_db->query( 'SELECT name FROM sqlite_master;' ) as $row){
                    
                        echo '<option value="'.$row['name'].'"';
                            if(isset($_POST['name'])){
                                if($_POST['name']==$row['name']) echo " selected ";
                            }
                        echo '>';
                        
                            echo $row['name'];
                        echo '</option>';
                    }
                echo '</select>';   
                    

        

            // gathers information from database table userHistory
            echo "<table style='width:100%'>";
                
                echo '<tr>';
                    echo '<th> refer </th>';
                    echo '<th> userid </th>';
                    echo '<th> username </th>';
                    echo '<th> IP </th>';
                    echo '<th> URLParams </th>';
                    echo '<th> timestamp </th>';
                echo '<tr>';
                
                foreach($log_db->query('SELECT * FROM userHistory;') as $row) {
                    echo '<tr>';
                        echo '<td>'.$row["refer"].'</td>';
                        echo '<td>'.$row["userid"].'</td>';
                        echo '<td>'.$row["username"].'</td>';
                        echo '<td>'.$row["IP"].'</td>';
                        echo '<td>'.$row["URLParams"].'</td>';
                        echo '<td>'.$row["timestamp"].'</td>';
                        echo '</tr>';
                }  
            echo "</table>";

            // gathers information from database table userLogEntries
            echo "<table style='width:100%'>";
                
            echo '<tr>';
                echo '<th> id </th>';
                echo '<th> uid </th>';
                echo '<th> username </th>';
                echo '<th> eventType </th>';
                echo '<th> description </th>';
                echo '<th> timestamp </th>';
                echo '<th> userAgent </th>';
                echo '<th> remoteAddress </th>';
            echo '<tr>';
            
            foreach($log_db->query('SELECT * FROM userLogEntries;') as $row) {
                echo '<tr>';
                    echo '<td>'.$row["id"].'</td>';
                    echo '<td>'.$row["uid"].'</td>';
                    echo '<td>'.$row["username"].'</td>';
                    echo '<td>'.$row["eventType"].'</td>';
                    echo '<td>'.$row["description"].'</td>';
                    echo '<td>'.$row["timestamp"].'</td>';
                    echo '<td>'.$row["userAgent"].'</td>';
                    echo '<td>'.$row["remoteAddress"].'</td>';
                    echo '</tr>';
            }  
        echo "</table>";



            // collects information from database table serviceLogEntries
            echo "<table style='width:100%'>";
                
                echo '<tr>';
                    echo '<th> id </th>';
                    echo '<th> uuid </th>';
                    echo '<th> eventType </th>';
                    echo '<th> service </th>';
                    echo '<th> userid </th>';
                    echo '<th> timestamp </th>';
                    echo '<th> userAgent </th>';
                    echo '<th> operatingSystem </th>';
                    echo '<th> info </th>';
                    echo '<th> referer </th>';
                    echo '<th> IP </th>';
                    echo '<th> browser </th>';
                echo '<tr>';
                
                foreach($log_db->query('SELECT * FROM serviceLogEntries;') as $row) {
                    echo '<tr>';
                        echo '<td>'.$row["id"].'</td>';
                        echo '<td>'.$row["uuid"].'</td>';
                        echo '<td>'.$row["eventType"].'</td>';
                        echo '<td>'.$row["service"].'</td>';
                        echo '<td>'.$row["userid"].'</td>';
                        echo '<td>'.$row["timestamp"].'</td>';
                        echo '<td>'.$row["userAgent"].'</td>';
                        echo '<td>'.$row["operatingSystem"].'</td>';
                        echo '<td>'.$row["info"].'</td>'; //  $info = $opt..$cid..$coursevers..$fid..$filename..$kind;
                        echo '<td>'.$row["referer"].'</td>';
                        echo '<td>'.$row["IP"].'</td>';
                        echo '<td>'.$row["browser"].'</td>';
                    echo '</tr>';
                }  
            echo "</table>";
            
           
            
           
           
           // currently not used, to be removed later on. 
            /*    
            $url = "https://cms.webug.se/root/G2/students/a21jeaha/LenaSYS/Shared/latestlog.json";
            $jsontext = file_get_contents($url);
            $arr = json_decode($jsontext, true);
            */
            
          
        ?>    
    </body>

</html>