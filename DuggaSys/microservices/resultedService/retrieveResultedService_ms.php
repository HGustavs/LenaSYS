<?php

function retrieveResultedService($tableInfo, $duggaFilterOptions){
    $returnArray = array(
        'tableInfo' => $tableInfo,
        'duggaFilterOptions' => $duggaFilterOptions
    );

    echo json_encode($returnArray);
}