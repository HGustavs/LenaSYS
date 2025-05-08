<?php

function getServicesByName($name){
    //get names from database
    $dbFile = __DIR__ . '/endpointDirectory_db.sqlite';
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "pdo connection should be done";

    $name = '%' . $name . '%'; 
    $query = $pdo->prepare("SELECT * FROM microservices WHERE ms_name LIKE :name");
	$query->bindParam(':name', $name);
    $query->execute();

    return $query->fetchAll(PDO::FETCH_ASSOC);
/*
    return [
        [
            "id" => 1,
            "serviceName" => "courseManager",
            "endpoint" => "/api/course",
            "description" => "Handles course-related operations like creating and retrieving courses.",
            "documentationPath" => "docs/courseManager.md"
        ],
        [
            "id" => 2,
            "serviceName" => "courseEditor",
            "endpoint" => "/api/course/edit",
            "description" => "Updates and edits existing course information.",
            "documentationPath" => "docs/courseEditor.md"
        ],
        [
            "id" => 3,
            "serviceName" => "courseDeleter",
            "endpoint" => "/api/course/delete",
            "description" => "Deletes courses from the system.",
            "documentationPath" => "docs/courseDeleter.md"
        ]
    ];
    */
}