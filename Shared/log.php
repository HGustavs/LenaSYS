<?php
/********************************************************************************

   Documentation 
   
*********************************************************************************

 Presents the data housed in the loglena database tables, in a readable fashion.

-------------==============######## Documentation End ###########==============-------------
*/?>

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
            try {
	            $log_db = new PDO('sqlite:../../log/loglena6.db');
            } catch (PDOException $e) {
	            echo "Failed to connect to the database";
	            throw $e;
            }
        ?>
        
        <!----------------------------------------------------------------------------------->  
        <!------Creates a dropdown with all tables in the loglena database------------------->
        <!----------------------------------------------------------------------------------->
        <span><form id="form1" name="form1" method="post" action="<?php echo $PHP_SELF; ?>">
        <?php    
                date_default_timezone_set('Etc/GMT+2'); //Used in serviceLogEntries to convert unix to datetime

                echo 'choose table';

                echo '<select onchange="submit();" name="name" >';

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


//---------------------------------------------------------------------------------------------------
// Present data  <-- Presents the information from each db table 
//---------------------------------------------------------------------------------------------------

                if((isset($_POST['name'])) && ($_POST['name']=='logEntries')){
                    // gathers information from database table userHistory
                    echo "<table style='width:100%'>";
                        echo '<tr>';
                            echo '<th> id </th>';
                            echo '<th> eventype </th>';
                            echo '<th> description </th>';
                            echo '<th> userAgent </th>';
                            echo '<th> timestamp </th>';
                        echo '<tr>';
                    foreach($log_db->query('SELECT * FROM logEntries;') as $row) {
                        echo '<tr>';
                            echo '<td>'.$row["id"].'</td>';
                            echo '<td>'.$row["eventype"].'</td>';
                            echo '<td>'.$row["description"].'</td>';
                            echo '<td>'.$row["userAgent"].'</td>';
                            echo '<td>'.$row["timestamp"].'</td>';
                        echo '</tr>';
                    }  
                    echo "</table>";
                }
                    
                if((isset($_POST['name'])) && ($_POST['name']=='exampleLoadLogEntries')){
                    // gathers information from database table exampleLoadLogEntries
                    echo "<table style='width:100%'>";
                        echo '<tr>';
                            echo '<th> id </th>';
                            echo '<th> type </th>';
                            echo '<th> courseid </th>';
                            echo '<th> uid </th>';
                            echo '<th> username </th>';
                            echo '<th> exampleid </th>';
                            echo '<th> timestamp </th>';
                        echo '<tr>';
                    foreach($log_db->query('SELECT * FROM exampleLoadLogEntries;') as $row) {
                        echo '<tr>';
                            echo '<td>'.$row["id"].'</td>';
                            echo '<td>'.$row["type"].'</td>';
                            echo '<td>'.$row["courseid"].'</td>';
                            echo '<td>'.$row["uid"].'</td>';
                            echo '<td>'.$row["username"].'</td>';
                            echo '<td>'.$row["exampleid"].'</td>';
                            echo '<td>'.$row["timestamp"].'</td>';
                        echo '</tr>';
                    }  
                    echo "</table>";
                }

            if((isset($_POST['name'])) && ($_POST['name']=='userHistory')){
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
            }

            if((isset($_POST['name'])) && ($_POST['name']=='userLogEntries')){

                if(isset($_GET['order'])){
                    $order = $_GET['order'];
                }
                else{
                    $order = 'id';
                }
                if(isset($_GET['sort'])){
                    $sort = $_GET['sort'];
                }
                else{
                    $sort = 'ASC';
                }
                
                $sql = $log_db->query('SELECT * FROM userLogEntries;'); // ORDER BY $order $sort
                $userLogEntriesResults = $sql->fetchAll(PDO::FETCH_ASSOC);
                $sort == 'DESC' ? $sort = 'ASC' : $sort = 'DESC';
            
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='?order=id&&sort=$sort'>id</a></th>
                        <th><a href='?order=uid&&sort=$sort'>uid</a></th>
                    </tr>
                ";
                foreach($userLogEntriesResults as $rows) {
                    foreach($rows as $row) {
                        echo"
                        <tr>
                            <td>".$row[0]."</td>
                        </tr>
                        ";
                    }
                }
                echo"
                </table>
                ";
                print "<pre>";
                print_r($userLogEntriesResults);
                print "</pre>";
                /*
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
                echo "</table>";*/
            }

            if((isset($_POST['name'])) && ($_POST['name']=='serviceLogEntries')){
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
                    echo '</tr>';
                    foreach($log_db->query('SELECT * FROM serviceLogEntries;') as $row) {
                        echo '<tr>';
                            echo '<td>'.$row["id"].'</td>';
                            echo '<td>'.$row["uuid"].'</td>';
                            echo '<td>'.$row["eventType"].'</td>';
                            echo '<td>'.$row["service"].'</td>';
                            echo '<td>'.$row["userid"].'</td>';
                            $timestamp=$row["timestamp"];
                            $timestamp = date('Y-m-d h:i:s', $timestamp/1000); //Divide by 1000 cause unix is in miliseconds
                            echo '<td>'.$timestamp.'</td>';
                            echo '<td>'.$row["userAgent"].'</td>';
                            echo '<td>'.$row["operatingSystem"].'</td>';
                            echo '<td>'.$row["info"].'</td>'; //  $info = $opt..$cid..$coursevers..$fid..$filename..$kind;
                            echo '<td>'.$row["referer"].'</td>';
                            echo '<td>'.$row["IP"].'</td>';
                            echo '<td>'.$row["browser"].'</td>';
                        echo '</tr>';
                    }  
                echo "</table>";
            }
            
            if((isset($_POST['name'])) && ($_POST['name']=='duggaLoadLogEntries')){
                // collects information from database table duggaLoadLogEntries
                echo "<table style='width:100%'>";
                    echo '<tr>';
                        echo '<th> id </th>';
                        echo '<th> type </th>';
                        echo '<th> cid </th>';
                        echo '<th> uid </th>';
                        echo '<th> username </th>';
                        echo '<th> vers </th>';
                        echo '<th> quizid </th>';
                        echo '<th> timestamp </th>';
                    echo '<tr>';
                    foreach($log_db->query('SELECT * FROM duggaLoadLogEntries;') as $row) {
                        echo '<tr>';
                            echo '<td>'.$row["id"].'</td>';
                            echo '<td>'.$row["type"].'</td>';
                            echo '<td>'.$row["cid"].'</td>';
                            echo '<td>'.$row["uid"].'</td>';
                            echo '<td>'.$row["username"].'</td>';
                            echo '<td>'.$row["vers"].'</td>';
                            echo '<td>'.$row["quizid"].'</td>';
                            echo '<td>'.$row["timestamp"].'</td>';
                        echo '</tr>';
                    }
                echo "</table>";
            }
        ?>    
    </body>
</html>