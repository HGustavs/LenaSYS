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
                var_dump($log_db);
            } catch (PDOException $e) {
	            echo "Failed to connect to the database";
	            throw $e;
            }

            // Define columns to search inside
$columns_to_search = ['logEntries', 'exampleLoadLogEntries', 'userHistory', 'userLogEntries', 'serviceLogEntries', 'duggaLoadLogEntries'];

// Get search query from input field
$search_query = $_GET['q'] ?? '';
echo $sql_query;

// Prepare SQL query to fetch data
$sql_query = 'SELECT * FROM ';

// Add search conditions to SQL query based on the entered query and columns to search inside
$conditions = [];
foreach ($columns_to_search as $column) {
    $conditions[] = "$column.description LIKE '%$search_query%'";
}
$sql_query .= implode(' OR ', $conditions);

// Execute SQL query and display results in table format
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
foreach ($log_db->query($sql_query) as $row) {
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
?>

<form method="get">
    <input type="text" name="q" value="<?= htmlentities($_GET['q'] ?? '') ?>" />
    <button type="submit">Search</button>
</form>


        ?>
        
        <!----------------------------------------------------------------------------------->  
        <!------Creates a dropdown with all tables in the loglena database------------------->
        <!----------------------------------------------------------------------------------->
        <span><form id="form1" name="form1" method="get" action="<?php echo $PHP_SELF; ?>">
        <?php    
                date_default_timezone_set('Etc/GMT+2'); //Used in serviceLogEntries to convert unix to datetime

                echo 'choose table';

                echo '<select onchange="submit();" name="name" >';

                    foreach($log_db->query( 'SELECT name FROM sqlite_master;' ) as $row){
                    
                        echo '<option value="'.$row['name'].'"';
                            if(isset($_GET['name'])){
                                if($_GET['name']==$row['name']) echo " selected ";
                            }
                        echo '>';
                        
                            echo $row['name'];
                        echo '</option>';
                    }
                echo '</select>';

        ?>

        <?php

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
                    echo '<tr>';
                    
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