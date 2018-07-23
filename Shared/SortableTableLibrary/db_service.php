<?php
  $db = new PDO("mysql:host=localhost;port=20001;dbname=c16linst", "c16linst", "password");
  if (isset($_GET['command'])) {
      $command = $_GET['command']; 
  } else {
      $command = "UNK";
  }

  if (isset($_GET['dbarr'])) {
      $dbarr = json_decode($_GET['dbarr']);    
  } else {
      $dbarr = "UNK";  
  }

  if (isset($_GET['updatecol'])) {
      $updatecol = $_GET['updatecol'];    
  } else {
      $updatecol = "UNK";  
  }

  if (isset($_GET['updatetable'])) {
      $updatetable = $_GET['updatetable'];    
  } else {
      $updatetable = "UNK";  
  }

  if (isset($_GET['updatevalue'])) {
      $updatevalue = $_GET['updatevalue'];    
  } else {
      $updatevalue = "UNK";  
  }

  if (isset($_GET['updateid'])) {
      $updateid = $_GET['updateid'];    
  } else {
      $updateid = "UNK";  
  }

  
  $command="update";
  $updatecol="first_last";
  $updatevalue="Snus";
  $updateid=1;
  

  function genData() {
      $possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      $tblbody = array();  		
      for ($i = 0; $i < 200; $i++) {
      		$wordcnt = rand(1,5);
      		$str = "";
      		$str2 = "";
      		$str3 = "";
      		for ($j = 0; $j < $wordcnt; $j++) {
      				$charcnt = rand(1,10);
      				for ($k = 0; $k < $charcnt; $k++) {
      						$str .= substr($possible,rand(0,(strlen($possible) - 1)),1);
                  $str2 .= substr($possible,rand(0,(strlen($possible) - 1)),1);
                  $str3 .= substr($possible,rand(0,(strlen($possible) - 1)),1);
      				}
              $str .= " ";
              $str2 .= " ";
              $str3 .= " ";
      		}
      		array_push($tblbody, array($i,$str,lcg_value() * 5000,rand(1,20), $str2, $str3, array("xk" => rand(1000,3000), "yk" => rand(1,500), "col" => "Free Shevacadoo")));
      }  
      return $tblbody;
  }

  if ($command === "gendata" && $dbarr !== "UNK") {    
      foreach ($dbarr as $database) {
          $db->exec("DROP TABLE IF EXISTS " . $database);
          //"id","First/Last","Pnr","Num","Foo","Holk","Trumma"
          $db->exec(
              "CREATE TABLE IF NOT EXISTS " . $database . " (
              id INTEGER PRIMARY KEY, 
              firstlast TEXT, 
              pnr REAL,
              num INTEGER,
              foo TEXT,
              holk TEXT,
              trumma TEXT)"
          );

          // Prepare INSERT statement 
          $insert = "INSERT INTO " . $database . " (id,firstlast,pnr,num,foo,holk,trumma) VALUES (:id,:firstlast,:pnr,:num,:foo,:holk,:trumma)";
          $stmt = $db->prepare($insert);

          // Bind parameters to statement variables
          $stmt->bindParam(':id', $id);
          $stmt->bindParam(':firstlast', $first_last);
          $stmt->bindParam(':pnr', $pnr);
          $stmt->bindParam(':num', $num);
          $stmt->bindParam(':foo', $foo);
          $stmt->bindParam(':holk', $holk);
          $stmt->bindParam(':trumma', $trumma);

          // Insert all of the items in the array
          foreach (genData() as $item) {
              $id = intval($item[0]);
              $first_last = $item[1];
              $pnr = floatval($item[2]);
              $num = intval($item[3]);
              $foo = $item[4];
              $holk = $item[5];
              $trumma = json_encode($item[6]);

              try {    
                  $stmt->execute();
              } catch (PDOException $e) {
                  echo $e->getMessage();
              }
          }        
      }
  }

  if ($command === "update" && $updatetable !== "UNK" && $updateid !== "UNK" && $updatevalue !== "UNK") {
      // Updating
      $update = "UPDATE " . $updatetable . " SET " . $updatecol . " = :updatevalue WHERE id = :id";
      $stmt = $db->prepare($update);
      $stmt->bindParam(':updatevalue', $updatevalue);
      $stmt->bindParam(':id', $updateid);
      try {    
          $stmt->execute();
      } catch(PDOException $e) {
          echo $e->getMessage();
      }
  }

  $data = array();
  if ($dbarr !== "UNK") {
      foreach ($dbarr as $database) {
          $tbl = array();
          try {   
              $results = $db->query('SELECT * FROM ' . $database);
              if ($results) {
                  while ($result = $results->fetch(PDO::FETCH_ASSOC)) {
                      array_push(
                        $tbl,
                        array(
                          intval($result['cid']),
                          intval($result['lid']),
                          getType($result['entryname'])
                        )
                      );
                  }             
              }
              $data[$database] = $tbl;
          } catch (PDOException $e) {
              echo $e->getMessage();
          }        
      }
  }
  echo json_encode($data);
?>