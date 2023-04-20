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

            // Set to default button
            echo "<a href='log.php?order=timestamp&&sort=DESC'>Set to default(timestamp, descending order)</a>";
            
            // Code used to sort tables.
            // Default values are time in descending order.
            if(isset($_GET['order'])){
                $order = $_GET['order'];
            }
            else{
                $order = 'timestamp';
            }
            if(isset($_GET['sort'])){
                $sort = $_GET['sort'];
            }
            else{
                $sort = 'DESC';
            }
            
            // Gathers information from database table logEntries
            if((isset($_POST['name'])) && ($_POST['name']=='logEntries')){
                $logEntriesSql = $log_db->query('SELECT * FROM logEntries ORDER BY '.$order.' '.$sort.';');
                $logEntriesResults = $logEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                $sort == 'DESC' ? $sort = 'ASC' : $sort = 'DESC';
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?order=id&&sort=$sort'>id</a></th>
                        <th><a href='log.php?order=eventype&&sort=$sort'>eventype</a></th>
                        <th><a href='log.php?order=description&&sort=$sort'>description</a></th>
                        <th><a href='log.php?order=userAgent&&sort=$sort'>userAgent</a></th>
                        <th><a href='log.php?order=timestamp&&sort=$sort'>timestamp</a></th>
                    </tr>
                ";
                foreach($logEntriesResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        echo"
                            <td>".$row."</td>
                        ";
                    }
                    echo"</tr>";
                }
                echo"
                </table>
                ";
                /*print "<pre>";
                print_r($userHistoryResults);
                print "</pre>";*/
            }
            
            // Gathers information from database table exampleLoadLogEntries
            if((isset($_POST['name'])) && ($_POST['name']=='exampleLoadLogEntries')){
                $exampleLoadLogEntriesSql = $log_db->query('SELECT * FROM exampleLoadLogEntries ORDER BY '.$order.' '.$sort.';');
                $exampleLoadLogEntriesResults = $exampleLoadLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                $sort == 'DESC' ? $sort = 'ASC' : $sort = 'DESC';
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?order=id&&sort=$sort'>id</a></th>
                        <th><a href='log.php?order=type&&sort=$sort'>type</a></th>
                        <th><a href='log.php?order=courseid&&sort=$sort'>courseid</a></th>
                        <th><a href='log.php?order=uid&&sort=$sort'>uid</a></th>
                        <th><a href='log.php?order=username&&sort=$sort'>username</a></th>
                        <th><a href='log.php?order=exampleid&&sort=$sort'>exampleid</a></th>
                        <th><a href='log.php?order=timestamp&&sort=$sort'>timestamp</a></th>
                    </tr>
                ";
                foreach($exampleLoadLogEntriesResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        echo"
                            <td>".$row."</td>
                        ";
                    }
                    echo"</tr>";
                }
                echo"
                </table>
                ";
                /*print "<pre>";
                print_r($userHistoryResults);
                print "</pre>";*/
            }

            // Gathers information from database table userHistory
            if((isset($_POST['name'])) && ($_POST['name']=='userHistory')){
                $userHistorySql = $log_db->query('SELECT * FROM userHistory ORDER BY '.$order.' '.$sort.';');
                $userHistoryResults = $userHistorySql->fetchAll(PDO::FETCH_ASSOC);
                $sort == 'DESC' ? $sort = 'ASC' : $sort = 'DESC';
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?order=refer&&sort=$sort'>refer</a></th>
                        <th><a href='log.php?order=userid&&sort=$sort'>userid</a></th>
                        <th><a href='log.php?order=username&&sort=$sort'>username</a></th>
                        <th><a href='log.php?order=IP&&sort=$sort'>IP</a></th>
                        <th><a href='log.php?order=URLParams&&sort=$sort'>URLParams</a></th>
                        <th><a href='log.php?order=timestamp&&sort=$sort'>timestamp</a></th>
                    </tr>
                ";
                foreach($userHistoryResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        echo"
                            <td>".$row."</td>
                        ";
                    }
                    echo"</tr>";
                }
                echo"
                </table>
                ";
                /*print "<pre>";
                print_r($userHistoryResults);
                print "</pre>";*/
            }

            // Gathers information from database table userLogEntries
            if((isset($_POST['name'])) && ($_POST['name']=='userLogEntries')){
                $userLogEntriesSql = $log_db->query('SELECT * FROM userLogEntries ORDER BY '.$order.' '.$sort.';');
                $userLogEntriesResults = $userLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                $sort == 'DESC' ? $sort = 'ASC' : $sort = 'DESC';
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?order=id&&sort=$sort'>id</a></th>
                        <th><a href='log.php?order=uid&&sort=$sort'>uid</a></th>
                        <th><a href='log.php?order=username&&sort=$sort'>username</a></th>
                        <th><a href='log.php?order=eventType&&sort=$sort'>eventType</a></th>
                        <th><a href='log.php?order=description&&sort=$sort'>description</a></th>
                        <th><a href='log.php?order=timestamp&&sort=$sort'>timestamp</a></th>
                        <th><a href='log.php?order=userAgent&&sort=$sort'>userAgent</a></th>
                        <th><a href='log.php?order=remoteAddress&&sort=$sort'>remoteAddress</a></th>
                    </tr>
                ";
                foreach($userLogEntriesResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        echo"
                            <td>".$row."</td>
                        ";
                    }
                    echo"</tr>";
                }
                echo"
                </table>
                ";
                /*print "<pre>";
                print_r($userLogEntriesResults);
                print "</pre>";*/
            }

            // Gathers information from database table serviceLogEntries
            if((isset($_POST['name'])) && ($_POST['name']=='serviceLogEntries')){
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
                    foreach($log_db->query('SELECT * FROM serviceLogEntries ORDER BY timestamp DESC;') as $row) {
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

            // Gathers information from database table duggaLoadLogEntries
            if((isset($_POST['name'])) && ($_POST['name']=='duggaLoadLogEntries')){
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
                    foreach($log_db->query('SELECT * FROM duggaLoadLogEntries ORDER BY timestamp DESC;') as $row) {
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