<?php

function getServicesByName($name){
    //get names from database
    include_once "../../../Shared/basic.php";

    pdoConnect();
    session_start();

    $name = '%' . $name . '%'; 
    $query = $pdo->prepare("SELECT * FROM microservices WHERE serviceName LIKE :name");
	$query->bindParam(':name', $name);
    $query->execute();

    //return $query->fetchAll(PDO::FETCH_ASSOC);

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
}