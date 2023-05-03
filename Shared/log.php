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
            ?>
            <?php
            if(isset($_POST['name']) && $_POST['name'] == 'serviceLogEntries'){
                // Get the sort column and direction
                $sort_col = isset($_GET['sort_col']) ? $_GET['sort_col'] : 'timestamp';
                $sort_dir = isset($_GET['sort_dir']) ? $_GET['sort_dir'] : 'desc';
                
                // Get the search keyword
                $search_keyword = isset($_POST['search_keyword']) ? $_POST['search_keyword'] : '';
                
                // Build the query to fetch serviceLogEntries data
                $sql = 'SELECT * FROM serviceLogEntries';
                if($search_keyword){
                    $sql .= ' WHERE eventType LIKE :search_keyword 
                              OR service LIKE :search_keyword 
                              OR userAgent LIKE :search_keyword 
                              OR operatingSystem LIKE :search_keyword 
                              OR info LIKE :search_keyword 
                              OR referer LIKE :search_keyword 
                              OR IP LIKE :search_keyword 
                              OR browser LIKE :search_keyword';
                }
                $sql .= ' ORDER BY '.$sort_col.' '.$sort_dir;
                
                // Prepare and execute the query
                $stmt = $log_db->prepare($sql);
                if($search_keyword){
                    $stmt->bindValue(':search_keyword', '%'.$search_keyword.'%', PDO::PARAM_STR);
                }
                $stmt->execute();
                $serviceLogEntriesResults = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Display the serviceLogEntries table
                
                echo '<table>';
                echo '<thead><tr>';
                echo '<th><a href="?sort_col=id&sort_dir='.($sort_col == 'id' ? ($sort_dir == 'asc' ? 'desc' : 'asc') : 'asc').'">id</a></th>';
                echo '<th><a href="?sort_col=id&sort_dir='.($sort_col == 'id' ? ($sort_dir == 'asc' ? 'desc' : 'asc') : 'asc').'">uuid</a></th>';
                echo '<th><a href="?sort_col=id&sort_dir='.($sort_col == 'id' ? ($sort_dir == 'asc' ? 'desc' : 'asc') : 'asc').'">eventType</a></th>';
                echo '<th><a href="?sort_col=id&sort_dir='.($sort_col == 'id' ? ($sort_dir == 'asc' ? 'desc' : 'asc') : 'asc').'">service</a></th>';
                echo '<th><a href="?sort_col=id&sort_dir='.($sort_col == 'id' ? ($sort_dir == 'asc' ? 'desc' : 'asc') : 'asc').'">userid</a></th>';
                echo '<th><a href="?sort_col=id&sort_dir='.($sort_col == 'id' ? ($sort_dir == 'asc' ? 'desc' : 'asc') : 'asc').'">timestamp</a></th>';
                echo '<th><a href="?sort_col=id&sort_dir='.($sort_col == 'id' ? ($sort_dir == 'asc' ? 'desc' : 'asc') : 'asc').'">userAgent</a></th>';
                echo '<th><a href="?sort_col=id&sort_dir='.($sort_col == 'id' ? ($sort_dir == 'asc' ? 'desc' : 'asc') : 'asc').'">operatingSystem</a></th>';
                echo '<th><a href="?sort_col=id&sort_dir='.($sort_col == 'id' ? ($sort_dir == 'asc' ? 'desc' : 'asc') : 'asc').'">info</a></th>';
                echo '<th><a href="?sort_col=id&sort_dir='.($sort_col == 'id' ? ($sort_dir == 'asc' ? 'desc' : 'asc') : 'asc').'">referer</a></th>';
                echo '<th><a href="?sort_col=id&sort_dir='.($sort_col == 'id' ? ($sort_dir == 'asc' ? 'desc' : 'asc') : 'asc').'">IP</a></th>';
                echo '<th><a href="?sort_col=id&sort_dir='.($sort_col == 'id' ? ($sort_dir == 'asc' ? 'desc' : 'asc') : 'asc').'">browser</a></th>';
   
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
           <script type="text/javascript" src="logSearch.js"></script>
    </body>
</html>