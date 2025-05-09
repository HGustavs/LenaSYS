<?php

function getServicesByParameter($parameter)
{
    // connect to the database 
    $dbFile = __DIR__ . '/endpointDirectory_db.sqlite';
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $parameter = '%' . $parameter . '%';
    $query = $pdo->prepare("SELECT * FROM microservices WHERE parameters LIKE :parameter");
    $query->bindParam(':parameter', $parameter);
    $query->execute();

    $result = $query->fetchAll(PDO::FETCH_ASSOC);

    return $result;
}

?>