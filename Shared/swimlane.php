<!-- Overlay -->

  <div id="overlay" style="display:none"></div>
  
	<!-- Swimlane Box Start! -->

  <div id="swimlanebox" class="swimlanebox" style="display:block">
      <svg width="3000" height="700">
          <!--<line x1="50" y1="50" x2="50" y2="100" style="stroke:rgb(255,0,0);stroke-width:2" />
          <circle cx="50" cy="50" r="10" stroke="green" stroke-width="2" fill="yellow" />
          <line x1="40" y1="75" x2="60" y2="75" style="stroke:rgb(255,0,0);stroke-width:2" />
          <line x1="50" y1="100" x2="60" y2="110" style="stroke:rgb(255,0,0);stroke-width:2" />
          <line x1="50" y1="100" x2="40" y2="110" style="stroke:rgb(255,0,0);stroke-width:2" />-->

          <rect x="0" y="70" width="200" height="70" style="fill:rgb(255,255,255);stroke-width:2;stroke:rgb(0,0,0)" />
          <rect x="0" y="140" width="200" height="70" style="fill:rgb(255,255,255);stroke-width:2;stroke:rgb(0,0,0)" />
          <rect x="0" y="210" width="200" height="70" style="fill:rgb(255,255,255);stroke-width:2;stroke:rgb(0,0,0)" />
          <rect x="0" y="280" width="200" height="70" style="fill:rgb(255,255,255);stroke-width:2;stroke:rgb(0,0,0)" />
          <rect x="0" y="350" width="200" height="70" style="fill:rgb(255,255,255);stroke-width:2;stroke:rgb(0,0,0)" />
          <rect x="0" y="420" width="200" height="70" style="fill:rgb(255,255,255);stroke-width:2;stroke:rgb(0,0,0)" />
          <rect x="0" y="490" width="200" height="70" style="fill:rgb(255,255,255);stroke-width:2;stroke:rgb(0,0,0)" />
          <rect x="0" y="560" width="200" height="70" style="fill:rgb(255,255,255);stroke-width:2;stroke:rgb(0,0,0)" />
          <rect x="0" y="630" width="200" height="70" style="fill:rgb(255,255,255);stroke-width:2;stroke:rgb(0,0,0)" />
          <text x="70" y="110" fill="black">Week 1</text>
          <text x="70" y="180" fill="black">Week 2</text>
          <text x="70" y="250" fill="black">Week 3</text>
          <text x="70" y="320" fill="black">Week 4</text>
          <text x="70" y="390" fill="black">Week 5</text>
          <text x="70" y="460" fill="black">Week 6</text>
          <text x="70" y="530" fill="black">Week 7</text>
          <text x="70" y="600" fill="black">Week 8</text>
          <text x="70" y="670" fill="black">Week 9</text>

          <?php
            date_default_timezone_set("Europe/Stockholm");

            // Include basic application services!
            include_once "../Shared/sessions.php";
            include_once "../Shared/basic.php";

            pdoConnect();
            session_start();

            $course = 2;

              $querystring="SELECT entryname FROM listentries WHERE cid={$course} AND kind=4";
              $stmt = $pdo->prepare($querystring);
              $stmt->bindParam(':cid', $cid);
              $stmt->bindParam(':uid', $userid);
              $stmt->bindParam(':coursevers', $coursevers);

              try{
                  $stmt->execute();
              }catch (PDOException $e){
                  // Error handling to $debug
              }

          $white = true;
          $i = 0;
          foreach($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
              echo '<text y="30" x="' . (($i * 200) + 230) . '" fill="black">' . $row['entryname'] . '</text>';
              echo '<rect y="70" x="' . (($i * 200) + 200) . '" width="200" height="700" style="fill:rgb(';
              if ($white){
                  echo '255,255,255';
                  $white = false;
              } else {
                  echo '230,230,230';
                  $white = true;
              }
              echo ')" />';
              $i++;
          }

          ?>

      </svg>
  
  
  </div>