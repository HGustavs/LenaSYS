<?php

function getServicesByDescription($description){
    //get results based of descriptions in database
/*
    $description = '%' . $description . '%'; 
    $query = $pdo->prepare("SELECT * FROM microservices WHERE serviceDescription LIKE :description");
	$query->bindParam(':description', $description);
    $query->execute();

    return $query->fetchAll(PDO::FETCH_ASSOC);
*/
}