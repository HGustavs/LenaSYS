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

   <script type="text/javascript" src="logSearch.js">
    window.addEventListener('load', initSort);
   </script>
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
            
            // Gathers information from database table logEntries
            if((isset($_POST['name'])) && ($_POST['name']=='logEntries')){
                $sort = isset($_GET['sort']) ? $_GET['sort'] : 'timestamp DESC';
                $logEntriesSql = $log_db->query('SELECT * FROM logEntries ORDER BY $sort');
                $logEntriesResults = $logEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                    <th><a href='log.php?name=logEntries&order=id'>id</a></th>
                        <th><a href='log.php?name=logEntries&order=eventype'>eventype</a></th>
                        <th><a href='log.php?name=logEntries&order=description'>description</a></th>
                        <th><a href='log.php?name=logEntries&order=userAgent'>userAgent</a></th>
                        <th><a href='log.php?name=logEntries&order=timestamp'>timestamp</a></th>
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
                $sort = isset($_GET['sort']) ? $_GET['sort'] : 'timestamp DESC';
                $exampleLoadLogEntriesSql = $log_db->query('SELECT * FROM exampleLoadLogEntries ORDER BY $sort');
                $exampleLoadLogEntriesResults = $exampleLoadLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?name=exampleLoadLogEntries&order=id'>id</a></th>
                        <th><a href='log.php?name=exampleLoadLogEntries&order=type'>type</a></th>
                        <th><a href='log.php?name=exampleLoadLogEntries&order=courseid'>courseid</a></th>
                        <th><a href='log.php?name=exampleLoadLogEntries&order=uid'>uid</a></th>
                        <th><a href='log.php?name=exampleLoadLogEntries&order=username'>username</a></th>
                        <th><a href='log.php?name=exampleLoadLogEntries&order=exampleid'>exampleid</a></th>
                        <th><a href='log.php?name=exampleLoadLogEntries&order=timestamp'>timestamp</a></th>
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
                $sort = isset($_GET['sort']) ? $_GET['sort'] : 'timestamp DESC';
                $userHistorySql = $log_db->query('SELECT * FROM userHistory ORDER BY $sort');
                $userHistoryResults = $userHistorySql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?name=userHistory&order=refer'>refer</a></th>
                        <th><a href='log.php?name=userHistory&order=userid'>userid</a></th>
                        <th><a href='log.php?name=userHistory&order=username'>username</a></th>
                        <th><a href='log.php?name=userHistory&order=IP'>IP</a></th>
                        <th><a href='log.php?name=userHistory&order=URLParams'>URLParams</a></th>
                        <th><a href='log.php?name=userHistory&order=timestamp'>timestamp</a></th>
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
                $sort = isset($_GET['sort']) ? $_GET['sort'] : 'timestamp DESC';
                $userLogEntriesSql = $log_db->query('SELECT * FROM userLogEntries ORDER BY $sort');
                $userLogEntriesResults = $userLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?name=userLogEntries&order=id'>id</a></th>
                        <th><a href='log.php?name=userLogEntries&order=uid'>uid</a></th>
                        <th><a href='log.php?name=userLogEntries&order=username'>username</a></th>
                        <th><a href='log.php?name=userLogEntries&order=eventType'>eventType</a></th>
                        <th><a href='log.php?name=userLogEntries&order=description'>description</a></th>
                        <th><a href='log.php?name=userLogEntries&order=timestamp'>timestamp</a></th>
                        <th><a href='log.php?name=userLogEntries&order=userAgent'>userAgent</a></th>
                        <th><a href='log.php?name=userLogEntries&order=remoteAddress'>remoteAddress</a></th>
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
                $sort = isset($_GET['sort']) ? $_GET['sort'] : 'timestamp DESC';
                $serviceLogEntriesSql = $log_db->query('SELECT * FROM serviceLogEntries ORDER BY $sort');
                $serviceLogEntriesResults = $serviceLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?name=serviceLogEntries&order=id'>id</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=uuid'>uuid</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=eventType'>eventType</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=service'>service</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=userid'>userid</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=timestamp'>timestamp</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=userAgent'>userAgent</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=operatingSystem'>operatingSystem</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=info'>info</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=referer'>referer</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=IP'>IP</a></th>
                        <th><a href='log.php?name=serviceLogEntries&order=browser'>browser</a></th>
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
                $sort = isset($_GET['sort']) ? $_GET['sort'] : 'timestamp DESC';
                $duggaLoadLogEntriesSql = $log_db->query('SELECT * FROM duggaLoadLogEntries ORDER BY $sort');
                $duggaLoadLogEntriesResults = $duggaLoadLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=id'>id</a></th>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=type'>type</a></th>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=cid'>cid</a></th>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=uid'>uid</a></th>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=username'>username</a></th>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=vers'>vers</a></th>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=quizid'>quizid</a></th>
                        <th><a href='log.php?name=duggaLoadLogEntries&order=timestamp'>timestamp</a></th>
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