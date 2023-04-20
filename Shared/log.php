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
        $columns_to_search = ['description'];

        // Get search query from input field
        $search_query = $_GET['q'] ?? '';

        // Get selected table from dropdown list
        $selected_table = $_GET['name'] ?? '';

        if (!empty($search_query) && !empty($selected_table)) {
            // Prepare SQL query to fetch data
            $sql_query = "SELECT * FROM $selected_table WHERE ";

            // Add search conditions to SQL query based on the entered query and columns to search inside
            $conditions = [];
            foreach ($columns_to_search as $column) {
                $conditions[] = "$column LIKE '%$search_query%'";
            }
            $sql_query .= implode(' OR ', $conditions);

            // Execute SQL query and display results in table format
            echo "<table style='width:100%'>";
            echo '<tr>';
            echo '<th> id </th>';
            echo '<th> eventype </th>';
            echo '<th> description </th>';
            echo '<th> userAgent </th>';
            echo '<th> timestamp </th>';
            echo '</tr>';
            foreach ($log_db->query($sql_query) as $row) {
                echo '<tr>';
                echo '<td>'.$row["id"].'</td>';
                echo '<td>'.$row["eventype"].'</td>';
                echo '<td>'.$row["description"].'</td>';
                echo '<td>'.$row["userAgent"].'</td>';
                echo '<td>'.date('Y-m-d h:i:s', $row["timestamp"]/1000).'</td>'; //Divide by 1000 cause unix is in miliseconds
                echo '</tr>';
            }
            echo "</table>";
        } else {
            // Display dropdown list of tables
            echo '<form method="get">';
            echo '<select onchange="this.form.submit();" name="name">';
            echo '<option value="">Choose table</option>';
            foreach ($log_db->query('SELECT name FROM sqlite_master WHERE type=\'table\'') as $row) {
                $table_name = $row['name'];
                $selected = ($table_name == $selected_table) ? 'selected' : '';
                echo "<option value='$table_name' $selected>$table_name</option>";
            }
            echo '</select>';
            echo '<input type="text" name="q" value="'.htmlentities($search_query).'" />';
            echo '<button type="submit">Search</button>';
            echo '</form>';
        }
    ?>
</body>
</html>
