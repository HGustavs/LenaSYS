<?php
header('Content-Type: application/json');

// Remove includes
// include_once "../../../Shared/sessions.php";
// include_once "../../../Shared/basic.php";
// include_once "./newUpdateTime_ms.php";

// Variables for the refresh button, deadlines specified in seconds
$shortdeadline = 300; // 300 = 5 minutes
$longdeadline = 600; // 600 = 10 minutes

// Check if it's a POST request and get parameters
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['cid']) && isset($_POST['user'])) {
        $cid = $_POST['cid'];
        $user = $_POST['user'];
        
        // Connect to database
        $pdo = new PDO('mysql:host=localhost;dbname=LenaSYS', 'lena', 'password');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Start session
        session_start();

        // Fetching the latest update of the course from the MySQL database
        $query = $pdo->prepare('SELECT updated FROM course WHERE cid = :cid;');
        $query->bindParam(':cid', $cid);
        $query->execute();

        // Save the result in a variable
        $updated = "";
        foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
            $updated = $row['updated'];
        }

        $currentTime = time(); // Get the current time as a Unix timestamp
        $updateTime = strtotime($updated); // Format the update-time as Unix timestamp

        $_SESSION["updatetGitReposCooldown"][$cid] = $updateTime;

        $_SESSION["lastFetchTime"] = date("Y-m-d H:i:s", $currentTime);
        $fetchCooldown = $longdeadline - (time() - $updateTime);
        if($fetchCooldown < 0) {
            $_SESSION["fetchCooldown"] = 0;
        } else {
            $_SESSION["fetchCooldown"] = $fetchCooldown;
        }
        
        // Check if the user has superuser privileges
        if($user == 1) { // 1 = superuser
            if(($currentTime - $_SESSION["updatetGitReposCooldown"][$cid]) < $shortdeadline) { // If they to, use the short deadline
                
                echo json_encode(['status' => 'error', 'message' => 'Too soon since last update, please wait.']);
            } else {
                // Call newUpdateTime microservice
                $baseURL = "https://" . $_SERVER['HTTP_HOST'];
                $updateURL = $baseURL . "/LenaSYS/DuggaSys/microservices/gitCommitService/newUpdateTime_ms.php";
                $ch = curl_init($updateURL);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                    'currentTime' => $currentTime,
                    'cid' => $cid
                ]));
                curl_exec($ch);
                curl_close($ch);
                
                
                echo json_encode(['status' => 'success']);
            }
        } else { 
            if(($currentTime - $_SESSION["updatetGitReposCooldown"][$cid]) > $longdeadline) { // Else use the long deadline
                // Call newUpdateTime microservice
                $baseURL = "https://" . $_SERVER['HTTP_HOST'];
                $updateURL = $baseURL . "/LenaSYS/DuggaSys/microservices/gitCommitService/newUpdateTime_ms.php";
                $ch = curl_init($updateURL);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                    'currentTime' => $currentTime,
                    'cid' => $cid
                ]));
                curl_exec($ch);
                curl_close($ch);
                
                
                echo json_encode(['status' => 'success']);
            } else {
                
                echo json_encode(['status' => 'error', 'message' => 'Too soon since last update, please wait.']);
            }
        }
    } else {
        
        echo json_encode(['status' => 'error', 'message' => 'Missing required parameters']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method. Use POST.']);
}
