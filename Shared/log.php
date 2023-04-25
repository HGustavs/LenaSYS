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
        border-collapse: collapse;
    }
    #set_to_default_button{
        display: block;
        margin-top: 2vh;
        margin-bottom: 2vh;
    }
    th{
        background-color: #614875;
    }
    th a{
        color: white;
        text-decoration: none;
    }
    table tr:nth-child(even){
        background-color: #f2f2f2;
    }

    table tr:hover {
        background-color: #ddd;
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

            echo 'Choose table: ';
            echo '<select onchange="this.form.submit()" name="name" >';
                foreach($log_db->query( 'SELECT name FROM sqlite_master;' ) as $row){
                    echo '<option value="'.$row['name'].'"';
                        if(isset($_POST['name'])){
                            if($_POST['name']==$row['name']) echo " selected ";
                        }
                    echo '>'.$row['name'].'</option>';
                    echo"<p>".$row['name']."</p>";
                }
            echo '</select>';

//---------------------------------------------------------------------------------------------------
// Present data  <-- Presents the information from each db table 
//---------------------------------------------------------------------------------------------------

            // Set to default button
            echo "<a href='?name=$tableName&order=timestamp&sort=DESC' id='set_to_default_button'>Set to default(timestamp, descending order)</a>";
            
            // Code used to sort tables.
            // Default values are time in descending order.
            if(isset($_POST['order'])){
                $order = $_POST['order'];
            }
            else{
                $order = 'timestamp';
            }
            if(isset($_POST['sort'])){
                $sort = $_POST['sort'];
            }
            else{
                $sort = 'DESC';
            }
            $nextSort = $sort == 'DESC' ? 'ASC' : 'DESC';
            
            // Gathers information from database table logEntries
            if((isset($_POST['name'])) && ($_POST['name']=='logEntries')){
                $logEntriesSql = $log_db->query('SELECT * FROM logEntries ORDER BY '.$order.' '.$sort.';');
                $logEntriesResults = $logEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                    <th><a href='?name=$tableName&order=id&sort=$nextSort'>id</a></th>
                    <th><a href='?name=$tableName&order=eventype&sort=$nextSort'>eventype</a></th>
                    <th><a href='?name=$tableName&order=description&sort=$nextSort'>description</a></th>
                    <th><a href='?name=$tableName&order=userAgent&sort=$nextSort'>userAgent</a></th>
                    <th><a href='?name=$tableName&order=timestamp&sort=$nextSort'>timestamp</a></th>
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
            }
            
            // Gathers information from database table exampleLoadLogEntries
            if((isset($_POST['name'])) && ($_POST['name']=='exampleLoadLogEntries')){
                $exampleLoadLogEntriesSql = $log_db->query('SELECT * FROM exampleLoadLogEntries ORDER BY '.$order.' '.$sort.';');
                $exampleLoadLogEntriesResults = $exampleLoadLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                    <th><a href='?name=$tableName&order=id&sort=$nextSort'>id</a></th>
                    <th><a href='?name=$tableName&order=type&sort=$nextSort'>type</a></th>
                    <th><a href='?name=$tableName&order=courseid&sort=$nextSort'>courseid</a></th>
                    <th><a href='?name=$tableName&order=uid&sort=$nextSort'>uid</a></th>
                    <th><a href='?name=$tableName&order=username&sort=$nextSort'>username</a></th>
                    <th><a href='?name=$tableName&order=exampleid&sort=$nextSort'>exampleid</a></th>
                    <th><a href='?name=$tableName&order=timestamp&sort=$nextSort'>timestamp</a></th>
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
            }

            // Gathers information from database table userHistory
            if((isset($_POST['name'])) && ($_POST['name']=='userHistory')){
                $userHistorySql = $log_db->query('SELECT * FROM userHistory ORDER BY '.$order.' '.$sort.';');
                $userHistoryResults = $userHistorySql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                    <th><a href='?name=$tableName&order=refer&sort=$nextSort'>refer</a></th>
                    <th><a href='?name=$tableName&order=userid&sort=$nextSort'>userid</a></th>
                    <th><a href='?name=$tableName&order=username&sort=$nextSort'>username</a></th>
                    <th><a href='?name=$tableName&order=IP&sort=$nextSort'>IP</a></th>
                    <th><a href='?name=$tableName&order=URLParams&sort=$nextSort'>URLParams</a></th>
                    <th><a href='?name=$tableName&order=timestamp&sort=$nextSort'>timestamp</a></th>
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
            }

            // Gathers information from database table userLogEntries
            if((isset($_POST['name'])) && ($_POST['name']=='userLogEntries')){
                $userLogEntriesSql = $log_db->query('SELECT * FROM userLogEntries ORDER BY '.$order.' '.$sort.';');
                $userLogEntriesResults = $userLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                    <th><a href='?name=$tableName&order=id&sort=$nextSort'>id</a></th>
                    <th><a href='?name=$tableName&order=uid&sort=$nextSort'>uid</a></th>
                    <th><a href='?name=$tableName&order=username&sort=$nextSort'>username</a></th>
                    <th><a href='?name=$tableName&order=eventType&sort=$nextSort'>eventType</a></th>
                    <th><a href='?name=$tableName&order=description&sort=$nextSort'>description</a></th>
                    <th><a href='?name=$tableName&order=timestamp&sort=$nextSort'>timestamp</a></th>
                    <th><a href='?name=$tableName&order=userAgent&sort=$nextSort'>userAgent</a></th>
                    <th><a href='?name=$tableName&order=remoteAddress&sort=$nextSort'>remoteAddress</a></th>
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
            }

            // Gathers information from database table serviceLogEntries
            if((isset($_POST['name'])) && ($_POST['name']=='serviceLogEntries')){
                $serviceLogEntriesSql = $log_db->query('SELECT * FROM serviceLogEntries ORDER BY '.$order.' '.$sort.';');
                $serviceLogEntriesResults = $serviceLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                    <th><a href='?name=$tableName&order=id&sort=$nextSort'>id</a></th>
                    <th><a href='?name=$tableName&order=uuid&sort=$nextSort'>uuid</a></th>
                    <th><a href='?name=$tableName&order=service&sort=$nextSort'>service</a></th>
                    <th><a href='?name=$tableName&order=userid&sort=$nextSort'>userid</a></th>
                    <th><a href='?name=$tableName&order=timestamp&sort=$nextSort'>timestamp</a></th>
                    <th><a href='?name=$tableName&order=userAgent&sort=$nextSort'>userAgent</a></th>
                    <th><a href='?name=$tableName&order=operatingSystem&sort=$nextSort'>operatingSystem</a></th>
                    <th><a href='?name=$tableName&order=info&sort=$nextSort'>info</a></th>
                    <th><a href='?name=$tableName&order=referer&sort=$nextSort'>referer</a></th>
                    <th><a href='?name=$tableName&order=IP&sort=$nextSort'>IP</a></th>
                    <th><a href='?name=$tableName&order=browser&sort=$nextSort'>browser</a></th>
                    </tr>
                ";
                foreach($serviceLogEntriesResults as $rows) {
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
            }

            // Gathers information from database table duggaLoadLogEntries
            if((isset($_POST['name'])) && ($_POST['name']=='duggaLoadLogEntries')){
                $duggaLoadLogEntriesSql = $log_db->query('SELECT * FROM duggaLoadLogEntries ORDER BY '.$order.' '.$sort.';');
                $duggaLoadLogEntriesResults = $duggaLoadLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                    <th><a href='?name=$tableName&order=id&sort=$nextSort'>id</a></th>
                    <th><a href='?name=$tableName&order=type&sort=$nextSort'>type</a></th>
                    <th><a href='?name=$tableName&order=cid&sort=$nextSort'>cid</a></th>
                    <th><a href='?name=$tableName&order=uid&sort=$nextSort'>uid</a></th>
                    <th><a href='?name=$tableName&order=username&sort=$nextSort'>username</a></th>
                    <th><a href='?name=$tableName&order=vers&sort=$nextSort'>vers</a></th>
                    <th><a href='?name=$tableName&order=quizid&sort=$nextSort'>quizid</a></th>
                    <th><a href='?name=$tableName&order=timestamp&sort=$nextSort'>timestamp</a></th>
                    </tr>
                ";
                foreach($duggaLoadLogEntriesResults as $rows) {
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
            }
        ?>    
    </body>
</html>