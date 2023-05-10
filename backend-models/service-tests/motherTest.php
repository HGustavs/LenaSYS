<html>
<head>
<style>


        table, th, td {
        border:1px solid black;
        border-collapse: collapse;
    }

    /*#set_to_default_button{
        display: block;
        margin-top: 2vh;
        margin-bottom: 2vh;
    }*/
    th{
        background-color: #800080;
        font-size : 100px;
    }
    th a{
        color: white;
        text-decoration: none;
        font-size : 100px;
    }
    table tr:nth-child(even){
        background-color: #f2f2f2;
    }

    table tr:hover {
        background-color: #ddd;
    }

    #passth {
        background-color: #614875;
    }
    #passG{
        background-color: green;
        
    }
    #failR{
        background-color: red;
    }
    </style>
<?php

/*
include_once ".../test1";
include_once ".../test2";
include_once ".../test3";
include_once ".../test4";
*/
//pdoConnect();
?>


        <!----------------------------------------------------------------------------------->  
        <!------Creates a dropdown with all tables in the loglena database------------------->
        <!-----------------------------------------------------------------------------------> 
        
        <input type="text" id="searchInput" placeholder="Search...">
        <button type="button" onclick="searchTable()">Search</button>

        <span><form id="form1" name="form1" method="post" action="<?php echo $PHP_SELF; ?>">
        
        <input type="checkbox" name="sort_passed" value="passed_value">
        <label for='sort_passed'>Passed tests</label>

        <input type="checkbox" name="sort_failed" value="failed_value">
        <label for='sort_failed'>Failed tests</label>
        <?php    
            //$test = json_decode($_GET["name"]);

            
            echo 'Choose table: ';
            echo '<select onchange="this.form.submit()" name="name" >';
                foreach($test as $row){
                    echo '<option value="'.$row['name'].'"';
                        if(isset($_POST['name'])){
                            if($_POST['name']==$row['name']) echo " selected ";
                        }
                    echo '>'.$row['name'].'</option>';
                    echo"<p>".$row['name']."</p>";
                }
            echo '</select>';

                echo "
                <table border='1'>
                <tr>
                    <th>test1</th>
                    <th>test2</th>
                    <th>test3</th>
                    <th>test4</th>
                    <th>test5</th>
                    <th id='passth'> <p id='passG'>Passed</p> or <p id='failR'>Failed</p> </th>
                </tr>
                </table>
                ";



                        echo "
                        <table border='1'>
                        <tr>
                            <td><p style='font-size:30px';>&#9989;</p></td>
                        </tr>
                        <tr>
                            <td><p style='font-size:30px';>&#10060;</p></td>
                        </tr>
                        </table>
                        ";


            ?>
   </body>
</html>