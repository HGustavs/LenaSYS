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
        font-size : 30px;
        padding : 30px;
        position : relative;
        left : 80px;
    }
    th a{
        color: white;
        text-decoration: none;
        font-size : 30px;
    }
    table tr:nth-child(even){
        background-color: #f2f2f2;
    }

    table tr:hover {
        background-color: #ddd;
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
        <!------Creates a dropdown with the Test 1-3 from motherTestJSON.json file----------->
        <!-----------------------------------------------------------------------------------> 
        
        <input type="text" id="searchInput" placeholder="Search...">
        <button type="button" onclick="searchTable()">Search</button>

        <span><form id="form1" name="form1" method="post" action="<?php echo $PHP_SELF; ?>">
        
        <input type="checkbox"  id="sort_passed" name="sort_passed" value="passed_value">
        <label for='sort_passed'>Passed tests</label>

        <input type="checkbox" id="sort_failed" name="sort_failed" value="failed_value">
        <label for='sort_failed'>Failed tests</label>
        <?php    
            
            $motherTest_json = file_get_contents('motherTestJSON.json');
            $decoded_json = json_decode($motherTest_json, true);
            
            
            echo 'Choose table: ';
            echo '<select onchange="this.form.submit()" name="test" >';
            echo '<option value="all">All Tests</option>';
                foreach($decoded_json ['create course test'] as $key => $value) {
                    echo '<option value="'.$key.'"';
                   
                        if(isset($_POST['test'])){
                            if($_POST['test']==$key) echo " selected ";
                        }  else {
                            if($key == 'Test 2 (callService)') echo " selected ";
                        }
                        echo '>'.$key.'</option>';
                    }
                    echo '
                    </select>
                    </form>
                    ';

        /*------------------------------------------------------------------------- */
        /*----------------------------Headers for Tests-----------------------------*/
        /*--------------------------------------------------------------------------*/

                echo '
                    <table border="1">
                        <tr>
                        <table>
                          <th>Test 1 (Login)</th>
                          </table>
                          <table>
                          <th>Test 2 (callService)</th>
                          </table>
                          <table>
                          <th>Test 3 (uploadFile)</th>
                          </table>
                        </tr>
                      
                ';

        /*------------------------------------------------------------------------- */
        /*----------------------------Print data in column-------------------------*/
        /*--------------------------------------------------------------------------*/


                
                echo '<tbody>';
                if(isset($_POST['test']) && $_POST['test'] != 'all'){
                    $test = $_POST['test'];
                    echo '<tr>';
                    foreach($decoded_json['create course test'][$test] as $key => $value){
                      if($key == 'result'){
                        echo '<td>';
                        if($value == 'passed'){
                          echo '<p style="font-size:30px">&#9989;</p>';
                        } else {
                          echo '<p style="font-size:30px">&#10060;</p>';
                        }
                        echo '</td>';
                      } else {
                        echo '<td>'.$value.'</td>';
                      }
                    }
                    echo '</tr>';
                  } else {
                    foreach($decoded_json['create course test'] as $key => $value){
                      echo '<tr>';
                      foreach($value as $nyckel => $val){
                        if($nyckel == 'result'){
                          echo '<td>';
                          if($val == 'passed'){
                            echo '<p style="font-size:30px">&#9989;</p>';
                          } else {
                            echo '<p style="font-size:30px">&#10060;</p>';
                          }
                          echo '</td>';
                        } else {
                          echo '<td>'.$val.'</td>';
                        }
                      }
                      echo '</tr>';
                    }
                  }
                echo '</tbody>';
                
        
                



                       

                        

            ?>
   </body>
</html>