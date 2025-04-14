<?php

include_once "./nameQuery.php";
include_once "./parameterQuery.php";
include_once "./descriptionsearch.php";
include_once "./directoryRendering";

$results = null;

if(isset($_GET['name'])){
    $name = $_GET['name'];
    //get list of courses with matching name
    $results = getCoursesByName($name);
}
elseif(isset($_GET['parameter'])){
    $parameter = $_GET['parameter'];
    //get list of courses with matching parameters
    $results = getCoursesByParameter($parameter);
}
elseif(isset($_GET['description'])){
    $description = $_GET['description'];
    //get list of courses with matching description
    $results = getCoursesByDescription($description);
}
else{
    echo "no valid queries found";
}
if($results != null){
    render($results);
}




