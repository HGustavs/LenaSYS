
<?php

include "../../Shared/test.php";

$testsData = array(
    // Test 1
    'update firstname test' => array(
        'expected-output' => '', // Look up output
        'query-before-test-1' => "SELECT uid FROM user WHERE username = 'testuser1'",
        'variables-query-before-test-2' => "variableSave", // Save query output
        'query-before-test-2' => "INSERT INTO user(username, pwd) VALUES('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array( // The data that the service needs to execute
            'opt' => 'UPDATE',
            'prop' => 'firstname',
            'val' => 'test',
            'uid' => 'testuser1',
            'variableSave' => '<!query-before-test-1!> <*[0][uid]*>' // Save value
        )),
        'filter-output' => serialize(array(
            'none' // To use all output from service
        )),
    ),
    // Test 2
    'update lastname test 2' => array(
        'expected-output' => '',
        'query-before-test-1' => "SELECT uid FROM user WHERE username = 'testuser1'",
        'variables-query-before-test-2' => "variableSave", // Save query output
        'query-before-test-2' => "INSERT INTO user(username, pwd) VALUES('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array( 
            'opt' => 'UPDATE',
            'prop' => 'lastname',
            'val' => 'test',
            'uid' => 'testuser1',
            'variableSave' => '<!query-before-test-1!> <*[0][uid]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 3
    'update ssn test 3' => array(
        'expected-output' => '',
        'query-before-test-1' => "SELECT uid FROM user WHERE username = 'testuser1'",
        'variables-query-before-test-2' => "variableSave", // Save query output
        'query-before-test-2' => "INSERT INTO user(username, pwd) VALUES('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDATE',
            'prop' => 'ssn',
            'val' => 'test',
            'uid' => 'testuser1',
            'variableSave' => '<!query-before-test-1!> <*[0][uid]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 4
    'update username test 4' => array(
        'expected-output' => '',
        'query-before-test-1' => "SELECT uid FROM user WHERE username = 'testuser1'",
        'variables-query-before-test-2' => "variableSave", // Save query output
        'query-before-test-2' => "INSERT INTO user(username, pwd) VALUES('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDATE',
            'prop' => 'username',
            'val' => 'test',
            'uid' => 'testuser1',
            'variableSave' => '<!query-before-test-1!> <*[0][uid]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 5
    'update class test 5' => array(
        'expected-output' => '',
        'query-before-test-1' => "SELECT uid FROM user WHERE username = 'testuser1'", 
        'variables-query-before-test-2' => "variableSave", // Save query output
        'query-before-test-2' => "INSERT INTO user(username, pwd) VALUES('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDATE',
            'prop' => 'class',
            'val' => 'test',
            'uid' => 'testuser1',
            'variableSave' => '<!query-before-test-1!> <*[0][uid]*>'        
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 6
    'update examiner test 6' => array(
        'expected-output' => '',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testtest'", 
        'variables-query-before-test-2' => "variableSave", // Save query output
        'query-before-test-2' => "INSERT INTO course(creator, ccoursecode) VALUES(1 , 'testtest')",
        'query-after-test-1' => "DELETE FROM course WHERE cid = 'testtest'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDATE',
            'prop' => 'examiner',
            'val' => 'test',
            'uid' => '2',
            'cid' => 'testtest',
            'variableSave' => '<!query-before-test-1> <*[0][coursecode]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 7
    'update none examiner test 7' => array(
        'expected-output' => '',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testtest'", 
        'variables-query-before-test-2' => "variableSave", // Save query output
        'query-before-test-2' => "INSERT INTO user_course(uid, cid, access) VALUES(2 , 'testtest', 'test')",
        'query-before-test-3' => "INSERT INTO course(creator, coursecode) VALUES (1, 'testtest')",
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 'testtest'", 
        'query-after-test-2' => "DELETE FROM course WHERE cid = 'testtest'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' =>serialize(array(
            'opt' => 'UPDATE',
            'prop' => 'examiner',
            'val' => 'None',
            'uid' => '2',
            'cid' => 'testtest',
            'variableSave' => '<!query-before-test-1> <*[0][coursecode]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 8
    'update version test 8' => array(
        'expected-output' => '',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testtest'", 
        'variables-query-before-test-2' => "variableSave", // Save query output
        'query-before-test-2' => "INSERT INTO course(creator, coursecode) VALUES(1 , 'testtest')",
        'query-before-test-3' => "INSERT INTO user_course(uid, cid, access) VALUES (2, 'testtest', 'test')",
        'query-after-test-1' => "DELETE FROM course WHERE cid = 'testtest'",
        'query-after-test-2' => "DELETE FROM user_course WHERE cid = 'testtest'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDATE',
            'prop' => 'vers',
            'val' => 'test',
            'uid' => '2',
            'cid' => 'testtest',
            'variableSave' => '<!query-before-test-1> <*[0][coursecode]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 9
    'update access test 9' => array(
        'expected-output' => '',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testtest'",
        'variables-query-before-test-2' => "variableSave", // Save query output 
        'query-before-test-2' => "INSERT INTO course(creator, coursecode) VALUES(1 , 'testtest')",
        'query-before-test-3' => "INSERT INTO user_course(uid, cid, access) VALUES (2, 'testtest', 'test')",
        'query-after-test-1' => "DELETE FROM course WHERE cid = 'testtest'",
        'query-after-test-2' => "DELETE FROM user_course WHERE cid = 'testtest'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDATE',
            'prop' => 'access',
            'val' => 'test',
            'uid' => '2',
            'cid' => 'testtest',
            'variableSave' => '<!query-before-test-1> <*[0][coursecode]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 10
    'update group test 10' => array(
        'expected-output' => '',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testtest'", 
        'variables-query-before-test-2' => "variableSave", // Save query output
        'query-before-test-2' => "INSERT INTO course(creator, coursecode) VALUES(1 , 'testtest')",
        'query-before-test-3' => "INSERT INTO user_course(uid, cid, access) VALUES (2, 'testtest', 'test')",
        'query-after-test-1' => "DELETE FROM course WHERE cid = 'testtest'",
        'query-after-test-2' => "DELETE FROM user_course WHERE cid = 'testtest'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDATE',
            'prop' => 'group',
            'val' => 'test',
            'uid' => '2',
            'cid' => 'testtest',
            'variableSave' => '<!query-before-test-1> <*[0][coursecode]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 11
    'add class test 11' => array(
        'expected-output' => '',
        'query-before-test-1' => "INSERT INTO class(class, responsible, classname, regcode, classcode, hp, tempo, hpProgress) VALUES ('testClass', 2, 'testClassName', 12345678, '87654321', 7.5, 100, 1.5)",
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
    'change password test 12' => array(
        'expected-output' => '',
        'query-before-test-1' => "SELECT uid FROM user WHERE username = 'testuser1'",
        'variables-query-before-test-2' => "variableSave", // Save query output
        'query-before-test-2' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'CHPWD',
            'uid' => 'testuser1',
            'pwd' => '123123',
            'variableSave' => '<!query-before-test-1> <*[0][uid]*>'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 13
    'add user test 13' => array(
        'expected-output' => '',
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd')",
        'query-before-test-2' => "INSERT INTO class(class, responsible, regcode, classcode, hp, tempo, hpProgress) VALUES ('testClass', 2,'testClassName', 12345678, '87654321', 7.5, 100, 1.5)",
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
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 14
    'add user none exist class test 14' => array(
        'expected-output' => '',
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd')",
        'query-before-test-2' => "INSERT INTO class(class, responsible, regcode, classcode, hp, tempo, hpProgress) VALUES ('testClass', 2,'testClassName', 12345678, '87654321', 7.5, 100, 1.5)",
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
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 15
    'connect user to user_course test 15' => array(
        'expected-output' => '',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testtest'",
        'variables-query-before-test-2' => "variableSave", // Save query output
        'query-before-test-2' => "INSERT INTO course(creator, coursecode) VALUES (1, 'testtest')",
        'query-before-test-3' => "INSERT INTO user_course(uid, cid, access) VALUES (2, 'testtest', 'test')",
        'query-after-test-1' => "DELETE FROM course WHERE cid = 'testtest'",
        'query-after-test-2' => "DELETE FROM user_course WHERE cid = 'testtest'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'ADDUSR',
            'regstatus' => 'UNK',
            'uid' => 2,
            'cid' => 'testtest',
            'coursevers' => 'testvers',
            'variableSave' => '<!query-before-test-1> <*[0][cid]*>'
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