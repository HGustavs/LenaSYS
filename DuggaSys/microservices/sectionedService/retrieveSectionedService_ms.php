<?php
    function retrieveSectionedService($userid, $debug, ...$sectionedInfo){

        $serviceInformation = [
            'User ID' => $userid,
            'Timestamp' => date("Y-m-d H:i:s"),
            'Error log' => $debug,
            'Service Info' => []
        ];

        if (empty($debug)) {
            $serviceInformation['Error log'] = 'NONE!';
        }

        // Add information from the microservice to service information
        foreach ($sectionedInfo as $info) {
            array_push($serviceInformation['Service Info'], $info);
        }

        return $serviceInformation;
    }