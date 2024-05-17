<?php

include_once "../../../../Shared/test.php";

$testsData = array(

    // Test 1 Retrieve information

    'updateListEntriesTabs_ms' => array(
        'expected-output' => '{"entries":[{"lid":1,"tabs":1},{"lid":4000,"tabs":null},{"lid":4001,"tabs":null},{"lid":4002,"tabs":null},{"lid":4003,"tabs":null},{"lid":4004,"tabs":null},{"lid":4005,"tabs":null},{"lid":4006,"tabs":null},{"lid":4007,"tabs":null},{"lid":4008,"tabs":null},{"lid":4009,"tabs":null},{"lid":2,"tabs":null},{"lid":5000,"tabs":null},{"lid":5001,"tabs":null},{"lid":5002,"tabs":null},{"lid":5003,"tabs":null},{"lid":5004,"tabs":null},{"lid":5005,"tabs":null},{"lid":5006,"tabs":null},{"lid":5007,"tabs":null},{"lid":5008,"tabs":null},{"lid":5009,"tabs":null},{"lid":4,"tabs":null},{"lid":3110,"tabs":null},{"lid":3111,"tabs":null},{"lid":3112,"tabs":null},{"lid":3113,"tabs":null},{"lid":3114,"tabs":null},{"lid":3115,"tabs":null},{"lid":3116,"tabs":null},{"lid":3117,"tabs":null},{"lid":3118,"tabs":null},{"lid":3119,"tabs":null},{"lid":5,"tabs":null},{"lid":2110,"tabs":null},{"lid":2111,"tabs":null},{"lid":2112,"tabs":null},{"lid":2113,"tabs":null},{"lid":2114,"tabs":null},{"lid":2115,"tabs":null},{"lid":2116,"tabs":null},{"lid":2117,"tabs":null},{"lid":2118,"tabs":null},{"lid":2119,"tabs":null},{"lid":6,"tabs":null}],"debug":"NONE!"}',

        'query-before-test-1' => "INSERT INTO "
        'query-after-test-1' => "UPDATE listentries SET tabs = null WHERE cid = 1885 AND lid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateListEntriesTabs_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'get',
                'courseid' => 1885,
                'coursename' => 4,
                'coursevers' => 1337,
                'comment' => 'undefined',
                'lid' => 1,
                'tabs' => 1,
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'lid',
                    'tabs',
                ),
                'debug'
            )
        ),
    )

    
    // Test 2 Retrieve quiz entries + release and deadline

    'updateListEntriesTabs_ms' => array(
        'expected-output' => '{"entries":[{"lid":1,"tabs":1},{"lid":4000,"tabs":null},{"lid":4001,"tabs":null},{"lid":4002,"tabs":null},{"lid":4003,"tabs":null},{"lid":4004,"tabs":null},{"lid":4005,"tabs":null},{"lid":4006,"tabs":null},{"lid":4007,"tabs":null},{"lid":4008,"tabs":null},{"lid":4009,"tabs":null},{"lid":2,"tabs":null},{"lid":5000,"tabs":null},{"lid":5001,"tabs":null},{"lid":5002,"tabs":null},{"lid":5003,"tabs":null},{"lid":5004,"tabs":null},{"lid":5005,"tabs":null},{"lid":5006,"tabs":null},{"lid":5007,"tabs":null},{"lid":5008,"tabs":null},{"lid":5009,"tabs":null},{"lid":4,"tabs":null},{"lid":3110,"tabs":null},{"lid":3111,"tabs":null},{"lid":3112,"tabs":null},{"lid":3113,"tabs":null},{"lid":3114,"tabs":null},{"lid":3115,"tabs":null},{"lid":3116,"tabs":null},{"lid":3117,"tabs":null},{"lid":3118,"tabs":null},{"lid":3119,"tabs":null},{"lid":5,"tabs":null},{"lid":2110,"tabs":null},{"lid":2111,"tabs":null},{"lid":2112,"tabs":null},{"lid":2113,"tabs":null},{"lid":2114,"tabs":null},{"lid":2115,"tabs":null},{"lid":2116,"tabs":null},{"lid":2117,"tabs":null},{"lid":2118,"tabs":null},{"lid":2119,"tabs":null},{"lid":6,"tabs":null}],"debug":"NONE!"}',

        'query-before-test-1' => "INSERT INTO "
        'query-after-test-1' => "UPDATE listentries SET tabs = null WHERE cid = 1885 AND lid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateListEntriesTabs_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'get',
                'courseid' => 1885,
                'coursename' => 4,
                'coursevers' => 1337,
                'comment' => 'undefined',
                'lid' => 1,
                'tabs' => 1,
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'lid',
                    'tabs',
                ),
                'debug'
            )
        ),
    )


    // Test 3 Create dugga array to store information


    'updateListEntriesTabs_ms' => array(
        'expected-output' => '{"entries":[{"lid":1,"tabs":1},{"lid":4000,"tabs":null},{"lid":4001,"tabs":null},{"lid":4002,"tabs":null},{"lid":4003,"tabs":null},{"lid":4004,"tabs":null},{"lid":4005,"tabs":null},{"lid":4006,"tabs":null},{"lid":4007,"tabs":null},{"lid":4008,"tabs":null},{"lid":4009,"tabs":null},{"lid":2,"tabs":null},{"lid":5000,"tabs":null},{"lid":5001,"tabs":null},{"lid":5002,"tabs":null},{"lid":5003,"tabs":null},{"lid":5004,"tabs":null},{"lid":5005,"tabs":null},{"lid":5006,"tabs":null},{"lid":5007,"tabs":null},{"lid":5008,"tabs":null},{"lid":5009,"tabs":null},{"lid":4,"tabs":null},{"lid":3110,"tabs":null},{"lid":3111,"tabs":null},{"lid":3112,"tabs":null},{"lid":3113,"tabs":null},{"lid":3114,"tabs":null},{"lid":3115,"tabs":null},{"lid":3116,"tabs":null},{"lid":3117,"tabs":null},{"lid":3118,"tabs":null},{"lid":3119,"tabs":null},{"lid":5,"tabs":null},{"lid":2110,"tabs":null},{"lid":2111,"tabs":null},{"lid":2112,"tabs":null},{"lid":2113,"tabs":null},{"lid":2114,"tabs":null},{"lid":2115,"tabs":null},{"lid":2116,"tabs":null},{"lid":2117,"tabs":null},{"lid":2118,"tabs":null},{"lid":2119,"tabs":null},{"lid":6,"tabs":null}],"debug":"NONE!"}',

        'query-after-test-1' => "UPDATE listentries SET tabs = null WHERE cid = 1885 AND lid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateListEntriesTabs_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'get',
                'courseid' => 1885,
                'coursename' => 4,
                'coursevers' => 1337,
                'comment' => 'undefined',
                'lid' => 1,
                'tabs' => 1,
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'lid',
                    'tabs',
                ),
                'debug'
            )
        ),
    )

    // Test 4 Remove grade and feedback if release date is set and has not ocured

    'updateListEntriesTabs_ms' => array(
        'expected-output' => '{"entries":[{"lid":1,"tabs":1},{"lid":4000,"tabs":null},{"lid":4001,"tabs":null},{"lid":4002,"tabs":null},{"lid":4003,"tabs":null},{"lid":4004,"tabs":null},{"lid":4005,"tabs":null},{"lid":4006,"tabs":null},{"lid":4007,"tabs":null},{"lid":4008,"tabs":null},{"lid":4009,"tabs":null},{"lid":2,"tabs":null},{"lid":5000,"tabs":null},{"lid":5001,"tabs":null},{"lid":5002,"tabs":null},{"lid":5003,"tabs":null},{"lid":5004,"tabs":null},{"lid":5005,"tabs":null},{"lid":5006,"tabs":null},{"lid":5007,"tabs":null},{"lid":5008,"tabs":null},{"lid":5009,"tabs":null},{"lid":4,"tabs":null},{"lid":3110,"tabs":null},{"lid":3111,"tabs":null},{"lid":3112,"tabs":null},{"lid":3113,"tabs":null},{"lid":3114,"tabs":null},{"lid":3115,"tabs":null},{"lid":3116,"tabs":null},{"lid":3117,"tabs":null},{"lid":3118,"tabs":null},{"lid":3119,"tabs":null},{"lid":5,"tabs":null},{"lid":2110,"tabs":null},{"lid":2111,"tabs":null},{"lid":2112,"tabs":null},{"lid":2113,"tabs":null},{"lid":2114,"tabs":null},{"lid":2115,"tabs":null},{"lid":2116,"tabs":null},{"lid":2117,"tabs":null},{"lid":2118,"tabs":null},{"lid":2119,"tabs":null},{"lid":6,"tabs":null}],"debug":"NONE!"}',

        'query-after-test-1' => "UPDATE listentries SET tabs = null WHERE cid = 1885 AND lid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateListEntriesTabs_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'get',
                'courseid' => 1885,
                'coursename' => 4,
                'coursevers' => 1337,
                'comment' => 'undefined',
                'lid' => 1,
                'tabs' => 1,
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'lid',
                    'tabs',
                ),
                'debug'
            )
        ),
    )

    // Test 5 Retrieve course versions from microservice getCourseVersions_ms

    'updateListEntriesTabs_ms' => array(
        'expected-output' => '{"entries":[{"lid":1,"tabs":1},{"lid":4000,"tabs":null},{"lid":4001,"tabs":null},{"lid":4002,"tabs":null},{"lid":4003,"tabs":null},{"lid":4004,"tabs":null},{"lid":4005,"tabs":null},{"lid":4006,"tabs":null},{"lid":4007,"tabs":null},{"lid":4008,"tabs":null},{"lid":4009,"tabs":null},{"lid":2,"tabs":null},{"lid":5000,"tabs":null},{"lid":5001,"tabs":null},{"lid":5002,"tabs":null},{"lid":5003,"tabs":null},{"lid":5004,"tabs":null},{"lid":5005,"tabs":null},{"lid":5006,"tabs":null},{"lid":5007,"tabs":null},{"lid":5008,"tabs":null},{"lid":5009,"tabs":null},{"lid":4,"tabs":null},{"lid":3110,"tabs":null},{"lid":3111,"tabs":null},{"lid":3112,"tabs":null},{"lid":3113,"tabs":null},{"lid":3114,"tabs":null},{"lid":3115,"tabs":null},{"lid":3116,"tabs":null},{"lid":3117,"tabs":null},{"lid":3118,"tabs":null},{"lid":3119,"tabs":null},{"lid":5,"tabs":null},{"lid":2110,"tabs":null},{"lid":2111,"tabs":null},{"lid":2112,"tabs":null},{"lid":2113,"tabs":null},{"lid":2114,"tabs":null},{"lid":2115,"tabs":null},{"lid":2116,"tabs":null},{"lid":2117,"tabs":null},{"lid":2118,"tabs":null},{"lid":2119,"tabs":null},{"lid":6,"tabs":null}],"debug":"NONE!"}',

        'query-after-test-1' => "UPDATE listentries SET tabs = null WHERE cid = 1885 AND lid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateListEntriesTabs_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'get',
                'courseid' => 1885,
                'coursename' => 4,
                'coursevers' => 1337,
                'comment' => 'undefined',
                'lid' => 1,
                'tabs' => 1,
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'lid',
                    'tabs',
                ),
                'debug'
            )
        ),
    )

    // Test 6 Reading entries in file database

    'updateListEntriesTabs_ms' => array(
        'expected-output' => '{"entries":[{"lid":1,"tabs":1},{"lid":4000,"tabs":null},{"lid":4001,"tabs":null},{"lid":4002,"tabs":null},{"lid":4003,"tabs":null},{"lid":4004,"tabs":null},{"lid":4005,"tabs":null},{"lid":4006,"tabs":null},{"lid":4007,"tabs":null},{"lid":4008,"tabs":null},{"lid":4009,"tabs":null},{"lid":2,"tabs":null},{"lid":5000,"tabs":null},{"lid":5001,"tabs":null},{"lid":5002,"tabs":null},{"lid":5003,"tabs":null},{"lid":5004,"tabs":null},{"lid":5005,"tabs":null},{"lid":5006,"tabs":null},{"lid":5007,"tabs":null},{"lid":5008,"tabs":null},{"lid":5009,"tabs":null},{"lid":4,"tabs":null},{"lid":3110,"tabs":null},{"lid":3111,"tabs":null},{"lid":3112,"tabs":null},{"lid":3113,"tabs":null},{"lid":3114,"tabs":null},{"lid":3115,"tabs":null},{"lid":3116,"tabs":null},{"lid":3117,"tabs":null},{"lid":3118,"tabs":null},{"lid":3119,"tabs":null},{"lid":5,"tabs":null},{"lid":2110,"tabs":null},{"lid":2111,"tabs":null},{"lid":2112,"tabs":null},{"lid":2113,"tabs":null},{"lid":2114,"tabs":null},{"lid":2115,"tabs":null},{"lid":2116,"tabs":null},{"lid":2117,"tabs":null},{"lid":2118,"tabs":null},{"lid":2119,"tabs":null},{"lid":6,"tabs":null}],"debug":"NONE!"}',

        'query-after-test-1' => "UPDATE listentries SET tabs = null WHERE cid = 1885 AND lid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateListEntriesTabs_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'get',
                'courseid' => 1885,
                'coursename' => 4,
                'coursevers' => 1337,
                'comment' => 'undefined',
                'lid' => 1,
                'tabs' => 1,
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'lid',
                    'tabs',
                ),
                'debug'
            )
        ),
    )

    // Test 7 New codeexample?

    'updateListEntriesTabs_ms' => array(
        'expected-output' => '{"entries":[{"lid":1,"tabs":1},{"lid":4000,"tabs":null},{"lid":4001,"tabs":null},{"lid":4002,"tabs":null},{"lid":4003,"tabs":null},{"lid":4004,"tabs":null},{"lid":4005,"tabs":null},{"lid":4006,"tabs":null},{"lid":4007,"tabs":null},{"lid":4008,"tabs":null},{"lid":4009,"tabs":null},{"lid":2,"tabs":null},{"lid":5000,"tabs":null},{"lid":5001,"tabs":null},{"lid":5002,"tabs":null},{"lid":5003,"tabs":null},{"lid":5004,"tabs":null},{"lid":5005,"tabs":null},{"lid":5006,"tabs":null},{"lid":5007,"tabs":null},{"lid":5008,"tabs":null},{"lid":5009,"tabs":null},{"lid":4,"tabs":null},{"lid":3110,"tabs":null},{"lid":3111,"tabs":null},{"lid":3112,"tabs":null},{"lid":3113,"tabs":null},{"lid":3114,"tabs":null},{"lid":3115,"tabs":null},{"lid":3116,"tabs":null},{"lid":3117,"tabs":null},{"lid":3118,"tabs":null},{"lid":3119,"tabs":null},{"lid":5,"tabs":null},{"lid":2110,"tabs":null},{"lid":2111,"tabs":null},{"lid":2112,"tabs":null},{"lid":2113,"tabs":null},{"lid":2114,"tabs":null},{"lid":2115,"tabs":null},{"lid":2116,"tabs":null},{"lid":2117,"tabs":null},{"lid":2118,"tabs":null},{"lid":2119,"tabs":null},{"lid":6,"tabs":null}],"debug":"NONE!"}',

        'query-after-test-1' => "UPDATE listentries SET tabs = null WHERE cid = 1885 AND lid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateListEntriesTabs_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'get',
                'courseid' => 1885,
                'coursename' => 4,
                'coursevers' => 1337,
                'comment' => 'undefined',
                'lid' => 1,
                'tabs' => 1,
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'lid',
                    'tabs',
                ),
                'debug'
            )
        ),
    )

);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON