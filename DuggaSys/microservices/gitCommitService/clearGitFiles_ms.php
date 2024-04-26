<?php





function clearGitFiles($cid) {
    $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
    $query = $pdolite->prepare("DELETE FROM gitFiles WHERE cid = :cid"); 
    $query->bindParam(':cid', $cid);
    if (!$query->execute()) {
        $error = $query->errorInfo();
        echo "Error updating file entries" . $error[2];
        $errorvar = $error[2];
        print_r($error);
        echo $errorvar;
    }
}




?>