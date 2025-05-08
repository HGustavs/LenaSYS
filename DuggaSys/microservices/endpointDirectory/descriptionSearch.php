<?php

function getServicesByDescription($description){
    //get results based of descriptions in database

    $dbFile = __DIR__ . '/endpointDirectory_db.sqlite';
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "PDO connection should be done";

    $description = '%' . $description . '%'; 
    $query = $pdo->prepare("SELECT * FROM microservices WHERE description LIKE :description");
	$query->bindParam(':description', $description);
    $query->execute();

    return $query->fetchAll(PDO::FETCH_ASSOC);

}