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

   <script type="text/javascript" src="logSearch.js"></script>
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

        <input type="text" id="searchInput" placeholder="Search...">
        <button type="button" onclick="searchTable()">Search</button>

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
            echo "<a href='log.php?order=timestamp&&sort=DESC' id='set_to_default_button'>Set to default(timestamp, descending order)</a>";
            
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
                $sort = ($sort == 'DESC') ? 'ASC' : 'DESC';
                echo"
                <table border='1'>
                    <tr>
                    <th><a href='log.php?name=logEntries&order=id&&sort=$sort'>id</a></th>
                        <th><a href='log.php?name=logEntries&order=eventype&&sort=$sort'>eventype</a></th>
                        <th><a href='log.php?name=logEntries&order=description&&sort=$sort'>description</a></th>
                        <th><a href='log.php?name=logEntries&order=userAgent&&sort=$sort'>userAgent</a></th>
                        <th><a href='log.php?name=logEntries&order=timestamp&&sort=$sort'>timestamp</a></th>
                    </tr>
                ";
                foreach($logEntriesResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        if ($rows['timestamp'] == $row) {
                            // Convert timestamp to a date format
                            $timestamp = date('Y-m-d H:i:s', $row/1000);
                            echo"<td>".$timestamp."</td>";
                        } else {
                            echo"<td>".$row."</td>";
                        }
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
                $sort = ($sort == 'DESC') ? 'ASC' : 'DESC';
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?name=exampleLoadLogEntries&order=id&&sort=$sort'>id</a></th>
                        <th><a href='log.php?name=exampleLoadLogEntries&order=type&&sort=$sort'>type</a></th>
                        <th><a href='log.php?name=exampleLoadLogEntries&order=courseid&&sort=$sort'>courseid</a></th>
                        <th><a href='log.php?name=exampleLoadLogEntries&order=uid&&sort=$sort'>uid</a></th>
                        <th><a href='log.php?name=exampleLoadLogEntries&order=username&&sort=$sort'>username</a></th>
                        <th><a href='log.php?name=exampleLoadLogEntries&order=exampleid&&sort=$sort'>exampleid</a></th>
                        <th><a href='log.php?name=exampleLoadLogEntries&order=timestamp&&sort=$sort'>timestamp</a></th>
                    </tr>
                ";
                foreach($exampleLoadLogEntriesResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        if ($rows['timestamp'] == $row) {
                            // Convert timestamp to a date format
                            $timestamp = date('Y-m-d H:i:s', $row/1000);
                            echo"<td>".$timestamp."</td>";
                        } else {
                            echo"<td>".$row."</td>";
                        }
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
                $sort = ($sort == 'DESC') ? 'ASC' : 'DESC';
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?name=userHistory&order=refer&&sort=$sort'>refer</a></th>
                        <th><a href='log.php?name=userHistory&order=userid&&sort=$sort'>userid</a></th>
                        <th><a href='log.php?name=userHistory&order=username&&sort=$sort'>username</a></th>
                        <th><a href='log.php?name=userHistory&order=IP&&sort=$sort'>IP</a></th>
                        <th><a href='log.php?name=userHistory&order=URLParams&&sort=$sort'>URLParams</a></th>
                        <th><a href='log.php?name=userHistory&order=timestamp&&sort=$sort'>timestamp</a></th>
                    </tr>
                ";
                foreach($userHistoryResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        if ($rows['timestamp'] == $row) {
                            // Convert timestamp to a date format
                            $timestamp = date('Y-m-d H:i:s', $row/1000);
                            echo"<td>".$timestamp."</td>";
                        } else {
                            echo"<td>".$row."</td>";
                        }
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
                $sort = ($sort == 'DESC') ? 'ASC' : 'DESC';
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?name=userLogEntries&order=id&&sort=$sort'>id</a></th>
                        <th><a href='log.php?name=userLogEntries&order=uid&&sort=$sort'>uid</a></th>
                        <th><a href='log.php?name=userLogEntries&order=username&&sort=$sort'>username</a></th>
                        <th><a href='log.php?name=userLogEntries&order=eventType&&sort=$sort'>eventType</a></th>
                        <th><a href='log.php?name=userLogEntries&order=description&&sort=$sort'>description</a></th>
                        <th><a href='log.php?name=userLogEntries&order=timestamp&&sort=$sort'>timestamp</a></th>
                        <th><a href='log.php?name=userLogEntries&order=userAgent&&sort=$sort'>userAgent</a></th>
                        <th><a href='log.php?name=userLogEntries&order=remoteAddress&&sort=$sort'>remoteAddress</a></th>
                    </tr>
                ";
                foreach($userLogEntriesResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        if ($rows['timestamp'] == $row) {
                            // Convert timestamp to a date format
                            $timestamp = date('Y-m-d H:i:s', $row/1000);
                            echo"<td>".$timestamp."</td>";
                        } else {
                            echo"<td>".$row."</td>";
                        }
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
                $sort = ($sort == 'DESC') ? 'ASC' : 'DESC';
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?name=serviceLogEntries&order=id&&sort=$sort'>id</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=uuid&&sort=$sort'>uuid</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=eventType&&sort=$sort'>eventType</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=service&&sort=$sort'>service</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=userid&&sort=$sort'>userid</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=timestamp&&sort=$sort'>timestamp</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=userAgent&&sort=$sort'>userAgent</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=operatingSystem&&sort=$sort'>operatingSystem</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=info&&sort=$sort'>info</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=referer&&sort=$sort'>referer</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=IP&&sort=$sort'>IP</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=browser&&sort=$sort'>browser</a></th>
                    </tr>
                ";
                foreach($serviceLogEntriesResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        if ($rows['timestamp'] == $row) {
                            // Convert timestamp to a date format
                            $timestamp = date('Y-m-d H:i:s', $row/1000);
                            echo"<td>".$timestamp."</td>";
                        } else {
                            echo"<td>".$row."</td>";
                        }
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
                $sort = ($sort == 'DESC') ? 'ASC' : 'DESC';
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=id&&sort=$sort'>id</a></th>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=type&&sort=$sort'>type</a></th>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=cid&&sort=$sort'>cid</a></th>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=uid&&sort=$sort'>uid</a></th>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=username&&sort=$sort'>username</a></th>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=vers&&sort=$sort'>vers</a></th>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=quizid&&sort=$sort'>quizid</a></th>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=timestamp&&sort=$sort'>timestamp</a></th>
                    </tr>
                ";
                foreach($duggaLoadLogEntriesResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        if ($rows['timestamp'] == $row) {
                            // Convert timestamp to a date format
                            $timestamp = date('Y-m-d H:i:s', $row/1000);
                            echo"<td>".$timestamp."</td>";
                        } else {
                            echo"<td>".$row."</td>";
                        }
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