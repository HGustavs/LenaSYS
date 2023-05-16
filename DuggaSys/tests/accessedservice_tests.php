
<?php

include "../../Shared/test.php";

$testsData = array(
    // Test 1
    'create access test' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-before-test-1' => "SELECT userid FROM user WHERE username = 'testuser1'", // May change userid to uid
        'query-before-test-2' => "INSERT INTO user(username, pwd) VALUES('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'query-after-test-2' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array( // The data that the service needs to execute
            'opt' => 'UPDAT', // May change UPDAT to UPDATE
            'prop' => 'firstname',
            'val' => 'test',
            'uid' => 'testuser1',
            'blop' => '<!query-before-test-1!> <*[0][uid]*>' 
        )),
        'filter-output' => serialize(array(
            'none' // To use all output from service
        )),
    ),
    // Test 2
    'create access test 2' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-before-test-1' => "SELECT userid FROM user WHERE username = 'testuser1'", // May change userid to uid
        'query-before-test-2' => "INSERT INTO user(username, pwd) VALUES('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'query-after-test-2' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array( 
            'opt' => 'UPDAT',
            'prop' => 'lastname',
            'val' => 'test',
            'uid' => 'testuser1',
            'blop' => '<!query-before-test-1!> <*[0][uid]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 3
    'create access test 3' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-before-test-1' => "SELECT userid FROM user WHERE username = 'testuser1'", // May change userid to uid
        'query-before-test-2' => "INSERT INTO user(username, pwd) VALUES('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'query-after-test-2' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDAT',
            'prop' => 'ssn',
            'val' => 'test',
            'uid' => 'testuser1',
            'blop' => '<!query-before-test-1!> <*[0][uid]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 4
    'create access test 4' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-before-test-1' => "SELECT userid FROM user WHERE username = 'testuser1'", // May change userid to uid
        'query-before-test-2' => "INSERT INTO user(username, pwd) VALUES('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'query-after-test-2' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDAT',
            'prop' => 'username',
            'val' => 'test',
            'uid' => 'testuser1',
            'blop' => '<!query-before-test-1!> <*[0][uid]*>'
        )),
        'filter-output' => serialize(aarray(
            'none'
        )),
    ),
    // Test 5
    'create access test 5' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-before-test-1' => "SELECT userid FROM user WHERE username = 'testuser1'", // May change userid to uid
        'query-before-test-2' => "INSERT INTO user(username, pwd) VALUES('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'query-after-test-2' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDAT',
            'prop' => 'class',
            'val' => 'test',
            'uid' => 'testuser1',
            'blop' => '<!query-before-test-1!> <*[0][uid]*>'        
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 6
    'create access test 6' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testtest'", 
        'query-before-test-2' => "INSERT INTO course(creator, ccoursecode) VALUES(1 , 'testtest')",
        'query-after-test-1' => "DELETE FROM course WHERE cid = 'testtest'", // cid may have another value
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDAT',
            'prop' => 'examiner',
            'val' => 'test',
            'uid' => '2',
            'cid' => 'testtest',
            'blop' => '<!query-before-test-1> <*[0][coursecode]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 7
    // Part of Test 6 when the examiner value is NONE!
    'create access test 7' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testtest'", 
        'query-before-test-2' => "INSERT INTO user_course(userid, cid, access) VALUES(1 , 'testtest', 'test')",
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 'testtest'", // cid may have another value
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' =>serialize(array(
            'opt' => 'UPDAT',
            'prop' => 'examiner',
            'val' => 'None',
            'uid' => '2',
            'cid' => 'testtest',
            'blop' => '<!query-before-test-1> <*[0][coursecode]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 8
    'create access test 8' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testtest'", 
        'query-before-test-2' => "INSERT INTO course(creator, coursecode) VALUES(1 , 'testtest')",
        'query-before-test-3' => "INSERT INTO user_course(uid, cid, access) VALUES (2, 'testtest', 'test')",
        'query-after-test-1' => "DELETE FROM course WHERE cid = 'testtest'",
        'query-after-test-2' => "DELETE FROM user_course WHERE cid = 'testtest'", // cid may have another value
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDATE',
            'prop' => 'vers',
            'val' => 'test',
            'uid' => '2',
            'cid' => 'testtest',
            'blop' => '<!query-before-test-1> <*[0][coursecode]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 9
    'create access test 9' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testtest'", 
        'query-before-test-2' => "INSERT INTO course(creator, coursecode) VALUES(1 , 'testtest')",
        'query-before-test-3' => "INSERT INTO user_course(uid, cid, access) VALUES (2, 'testtest', 'test')",
        'query-after-test-1' => "DELETE FROM course WHERE cid = 'testtest'",
        'query-after-test-2' => "DELETE FROM user_course WHERE cid = 'testtest'", // cid may have another value
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDATE',
            'prop' => 'access',
            'val' => 'test',
            'uid' => '2',
            'cid' => 'testtest',
            'blop' => '<!query-before-test-1> <*[0][coursecode]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 10
    'creat access test 10' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testtest'", 
        'query-before-test-2' => "INSERT INTO course(creator, coursecode) VALUES(1 , 'testtest')",
        'query-before-test-3' => "INSERT INTO user_course(uid, cid, access) VALUES (2, 'testtest', 'test')",
        'query-after-test-1' => "DELETE FROM course WHERE cid = 'testtest'",
        'query-after-test-2' => "DELETE FROM user_course WHERE cid = 'testtest'", // cid may have another value
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDATE',
            'prop' => 'group',
            'val' => 'test',
            'uid' => '2',
            'cid' => 'testtest',
            'blop' => '<!query-before-test-1> <*[0][coursecode]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 11
    'create access test 11' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-after-test-1' => "DELETE FROM class WHERE class = 'testClass'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'ADDCLASS',
            'class' => 'testClass',
            'responsible' => '2',
            'classname' => 'testClassName',
            'regcode' => '12345678',
            'classcode' => '87654321',
            'hp' => '7.5',
            'tempo' => '100',
            'hpProgress' => '1.5'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 12
    'create access test 12' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-before-test-1' => "SELECT uid FROM user WHERE username = 'testuser1'",
        'query-before-test-2' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'CHPWD',
            'uid' => 'testuser1',
            'pwd' => '123123',
            'blop' => '<!query-before-test-1> <*[0][uid]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 13
    'create access test 13' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-before-test-1' => "INSERT INTO class(class, responsible, regcode, classcode, hp, tempo, hpProgress) VALUES ('testClass', 2,'testClassName', 12345678, '87654321', 7.5, 100, 1.5)",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'query-after-test-2' => "DELETE FROM class WHERE class = 'testClass'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'ADDUSR',
            'username' => 'testuser',
            'saveemail' => 'testmail',
            'firstname' => 'testfirstname',
            'lastname' => 'testlastname',
            'ssn' => 'testssn',
            'rnd' => 'testpassword',
            'className' => 'testClassName',
            'blop' => '<!query-before-test-1> <*[0][class]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 14
    // Add select and insert
    'create access test 14' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-before-test-1' => "SELECT count(username) FROM user", // May change!
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'query-after-test-2' => "DELETE FROM class WHERE class = 'testClass'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'ADDUSR',
            'cstmt' => 0,
            'className' => 'testClass',
            'username' => 'testuser',
            'saveemail' => 'testmail',
            'firstname' => 'testfirstname',
            'lastname' => 'testlastname',
            'ssn' => 'testssn',
            'rnd' => 'testpassword',
            'className' => 'testclassName',
            'blop' => '<!query-before-test-1> <*[0][?]*>' // Add a value
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 15
    'create access test 15' => array(
        'expected-output' => '{"entries":"UNK", "debug":"UNK", "teachers":"UNK", "classes":"UNK", "courses":"UNK", "groups":"UNK", "queryResult":"UNK", "examiners":"UNK", "submissions":"UNK", "access":"UNK"}',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testtest'",
        'query-before-test-2' => "INSERT INTO course(creator, coursecode) VALUES (1, 'testtest')",
        'query-after-test-1' => "DELETE FROM course WHERE cid = 'testtest'",
        'query-after-test-2' => "DELETE FROM user_course WHERE cid = 'testtest'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'ADDUSR',
            'regstatus' => 'UNK',
            'uid' => 2,
            'cid' => 'testtest',
            'coursevers' => 'testvers',
            'blop' => '<!query-before-test-1> <*[0][cid]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Create new test
);

// Call JSON data, how to view the result
testHandler($testsData, false);

?>