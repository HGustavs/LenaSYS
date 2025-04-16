<?php

include_once "./nameQuery.php";
include_once "./parameterQuery.php";
include_once "./descriptionSearch.php";
include_once "./directoryRendering.php";

$results = null;

if(isset($_GET['name'])){
    $name = $_GET['name'];
    //get list of courses with matching name
    $results = getServicesByName($name);
    echo "<pre>";
        print_r($results);
    echo "</pre>";
}
elseif(isset($_GET['parameter'])){
    $parameter = $_GET['parameter'];
    //get list of courses with matching parameters
    $results = getServicesByParameter($parameter);
    echo "<pre>";
        print_r($results);
    echo "</pre>";
}
elseif(isset($_GET['description'])){
    $description = $_GET['description'];
    //get list of courses with matching description
    $results = getServicesByDescription($description);
    echo "<pre>";
    print_r($results);
    echo "</pre>";
}
else{
    echo "no valid queries found";
}
if($results != null){
    render($results);
}




