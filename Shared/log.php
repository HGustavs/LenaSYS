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

            // Gathers information from database table serviceLogEntries
            if((isset($_POST['name'])) && ($_POST['name']=='serviceLogEntries')){

                $serviceLogEntriesSql = $log_db->query('SELECT * FROM serviceLogEntries');
                $serviceLogEntriesResults = $serviceLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                ?>
                <table border='1'>
                <tr>
                    <th><a href="#" onclick="sortTable(0)">id</a></th>
                    <th><a href="#" onclick="sortTable(1)">uuid</a></th>
                    <th><a href="#" onclick="sortTable(2)">eventType</a></th>
                    <th><a href="#" onclick="sortTable(3)">service</a></th>
                    <th><a href="#" onclick="sortTable(4)">userid</a></th>
                    <th><a href="#" onclick="sortTable(5)">timestamp</a></th>
                    <th><a href="#" onclick="sortTable(6)">userAgent</a></th>
                    <th><a href="#" onclick="sortTable(7)">operatingSystem</a></th>
                    <th><a href="#" onclick="sortTable(8)">info</a></th>
                    <th><a href="#" onclick="sortTable(9)">referer</a></th>
                    <th><a href="#" onclick="sortTable(10)">IP</a></th>
                    <th><a href="#" onclick="sortTable(11)">browser</a></th>
                </tr>

                <?php
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
        ?>    
        <script src="logSearch.php"></script>
    </body>
</html>