/*
----------------------------------------------------------
    Courseedservice.php implement test file
----------------------------------------------------------
*/
 
<?php
 
include "../../Shared/test.php";
 
$testsData = array(

    /* Insert into course */

    'Insert into course test' => array(
        'expected-output' => '{
            "LastCourseCreated": [],
            "entries": [],
            "versions": [],
            "debug": "NONE!",
            "writeaccess": null,
            "motd": "UNK",
            "readonly": 0
          }',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'G1337' ORDER BY coursecode DESC LIMIT 1",
        'query-before-test-2' => "INSERT INTO course (coursecode,coursename,visibility) VALUES('G1337','Testing-Course',1)",
        'query-before-test-3' => "DELETE FROM course WHERE coursecode = 'G1337' AND cid = ?",
        'query-after-test-1' => "DELETE FROM course WHERE coursecode = 'G1337' AND coursename = 'Testing-Course'",
        'query-after-test-2' => "DELETE FROM course WHERE coursecode = 'G1337' AND coursename = 'Testing-Course'",
	'query-variables' => "blop",
        'service' => 'https://cms.webug.se/root/G2/students/a21ponkr/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array(
            'opt' => 'NEW',
            'cid' => '1885',
            'username' => 'usr',
            'password' => 'pass',
            'coursecode' => 'G1337',
            'coursename' => 'Testing-Course',
            'activeversion' => '1337',
            'activeedversion' => null,
            'registered' => false,
	    'blop' => '<!query-before-test-1!> <*[0][cid]*>'
        )),
        'filter-output' => serialize(array(
            'cid',
            'coursecode',
            'vers',
            'versname',
            'coursename',
            'coursenamealt',
            'opt',
            'activeversion',
            'activeedversion',
            'registered'
        )),
    ),

    /* Insert into vers */

    'Insert into course test' => array(
        'expected-output' => '{
            "LastCourseCreated": [],
            "entries": [],
            "versions": [],
            "debug": "NONE!",
            "writeaccess": null,
            "motd": "UNK",
            "readonly": 0
          }',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'G1337' ORDER BY coursecode DESC LIMIT 1",
        'query-before-test-2' => "INSERT INTO course($cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1])",
        'query-before-test-3' => "DELETE FROM course WHERE coursecode = 'G1337' AND cid = ?",
        'query-after-test-1' => "DELETE FROM vers WHERE cid = 9999",
        'query-after-test-2' => "DELETE FROM course WHERE cid = 9999'",
	'query-variables' => "blop",
        'service' => 'https://cms.webug.se/root/G2/students/a21ponkr/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array(
            'opt' => 'NEWVRS',
            'cid' => '9999',
            'coursecode' => 'G1337',
            'versid' => '1338',
            'versname' => 'HT15',
            'coursename' => 'Testing-Course',
            'coursenamealt' => 'Course for testing codeviewer',
            'motd' => 'Code examples shows both templateid and boxid!',
            'startdate' => '2020-05-01 00:00:00',
            'enddate' => '2020-06-30 00:00:00',
	    'blop' => '<!query-before-test-1!> <*[0][cid]*>'
        )),
        'filter-output' => serialize(array(
            'cid',
            'coursecode',
            'vers',
            'versname',
            'coursename',
            'coursenamealt',
            'opt',
            'motd',
            'startdate',
            'enddate'
        )),
    ),

        /* Update course */

        'Update course test' => array(
            'expected-output' => '{
                "LastCourseCreated": [],
                "entries": [],
                "versions": [],
                "debug": "NONE!",
                "writeaccess": null,
                "motd": "UNK",
                "readonly": 0
              }',
            'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'G1337' ORDER BY coursecode DESC LIMIT 1",
            'query-before-test-2' => "INSERT INTO course($cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1]);",
            'query-before-test-3' => "DELETE FROM course WHERE coursecode = 'G1337' AND cid = ?",
            'query-after-test-1' => "DELETE FROM vers WHERE cid = 9999",
            'query-after-test-2' => "DELETE FROM course WHERE cid = 9999'",
        'query-variables' => "blop",
            'service' => 'https://cms.webug.se/root/G2/students/a21ponkr/LenaSYS/DuggaSys/courseedservice.php',
            'service-data' => serialize(array(
                'cid' => '9999',
                'coursecode' => 'G1337',
                'versid' => '1338',
                'versname' => 'HT15',
                'coursename' => 'Testing-Course',
            'blop' => '<!query-before-test-1!> <*[0][cid]*>'
            )),
            'filter-output' => serialize(array(
                'cid',
                'coursecode',
                'versid',
                'versname',
                'coursename'
            )),
        ),

        /* Update vers */

        'Update vers test' => array(
            'expected-output' => '{
                "LastCourseCreated": [],
                "entries": [],
                "versions": [],
                "debug": "NONE!",
                "writeaccess": null,
                "motd": "UNK",
                "readonly": 0
              }',
            'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testCourseCode' ORDER BY coursecode DESC LIMIT 1",
            'query-before-test-2' => "INSERT INTO course($cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1]);",
            'query-before-test-3' => "INSERT INTO vers(cid, vers, versname, coursecode, coursename, coursenamealt, startdate, enddate, motd) VALUES ($preValuesVers[0], $preValuesVers[1], $preValuesVers[2], $preValuesVers[3], $preValuesVers[4], $preValuesVers[5]);",
            'query-after-test-1' => "DELETE FROM vers WHERE cid = 9999;",
            'query-after-test-2' => "DELETE FROM course WHERE cid = 9999'",
        'query-variables' => "blop",
            'service' => 'https://cms.webug.se/root/G2/students/a21ponkr/LenaSYS/DuggaSys/courseedservice.php',
            'service-data' => serialize(array(
                'opt' => 'UPDATEVRS',
                'courseid' => '9999',
                'coursecode' => 'testCourseCode',
                'versid' => '12345678',
                'versname' => 'updateTest',
            'blop' => '<!query-before-test-1!> <*[0][cid]*>'
            )),
            'filter-output' => serialize(array(
                'opt',
                'courseid',
                'coursecode',
                'versid',
                'versname'
             )),
        ),

        /* Update course */

        'Update course test' => array(
            'expected-output' => '{
                "LastCourseCreated": [],
                "entries": [],
                "versions": [],
                "debug": "NONE!",
                "writeaccess": null,
                "motd": "UNK",
                "readonly": 0
              }',
            'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testCourseCode' ORDER BY coursecode DESC LIMIT 1",
            'query-before-test-2' => "INSERT INTO course($cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1]);",
            'query-after-test-1' => "DELETE FROM vers WHERE cid = 9999;",
            'query-after-test-2' => "DELETE FROM course WHERE cid = 9999'",
        'query-variables' => "blop",
            'service' => 'https://cms.webug.se/root/G2/students/a21ponkr/LenaSYS/DuggaSys/courseedservice.php',
            'service-data' => serialize(array(
                'opt' => 'CHGVERS',
                'courseid' => '9999',
                'coursecode' => 'testCourseCode',
                'versid' => '1337',
                'versname' => 'updateTest',
            'blop' => '<!query-before-test-1!> <*[0][cid]*>'
            )),
            'filter-output' => serialize(array(
                'opt',
                'courseid',
                'coursecode',
                'versid',
                'versname'
             )),
        ),

        /* INSERT INTO VERS */

        'Insert into vers test' => array(
            'expected-output' => '{
                "LastCourseCreated": [],
                "entries": [],
                "versions": [],
                "debug": "NONE!",
                "writeaccess": null,
                "motd": "UNK",
                "readonly": 0
              }',
            'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testCourseCode' ORDER BY coursecode DESC LIMIT 1",
            'query-before-test-2' => "INSERT INTO course($cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1]);",
            'query-before-test-3' => "INSERT INTO vers(cid, vers, versname, coursecode, coursename, coursenamealt, startdate, enddate, motd) VALUES ($preValuesVers[0], $preValuesVers[1], $preValuesVers[2], $preValuesVers[3], $preValuesVers[4], $preValuesVers[5], $preValuesVers[6], $preValuesVers[7], $preValuesVers[8]);",
            'query-after-test-1' => "DELETE FROM vers WHERE cid = 9999;",
            'query-after-test-2' => "DELETE FROM course WHERE cid = 9999'",
        'query-variables' => "blop",
            'service' => 'https://cms.webug.se/root/G2/students/a21ponkr/LenaSYS/DuggaSys/courseedservice.php',
            'service-data' => serialize(array(
                'opt' => 'CPYVRS',
                'courseid' => '9999',
                'coursecode' => 'testCourseCode',
                'versid' => '12345679',
                'versname' => 'testVersName',
                'coursename' => 'testCourseName',
                'coursenamealt' => 'testCourseNameAlt',
                'motd' => 'testMotd',
                'startdate' => '2020-05-01 00:00:00',
                'enddate' => '2020-06-30 00:00:00',
            'blop' => '<!query-before-test-1!> <*[0][cid]*>'
            )),
            'filter-output' => serialize(array(
                'cid',
                'coursecode',
                'vers',
                'versname',
                'coursename',
                'coursenamealt',
                'opt',
                'motd',
                'startdate',
                'enddate'
             )),
        ),

        /* Update course */

        'Update course test' => array(
            'expected-output' => '{
                "LastCourseCreated": [],
                "entries": [],
                "versions": [],
                "debug": "NONE!",
                "writeaccess": null,
                "motd": "UNK",
                "readonly": 0
              }',
            'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testCourseCode' ORDER BY coursecode DESC LIMIT 1",
            'query-before-test-2' => "INSERT INTO course($cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1]);",
            'query-after-test-1' => "DELETE FROM vers WHERE cid = 9999;",
            'query-after-test-2' => "DELETE FROM course WHERE cid = 9999'",
        'query-variables' => "blop",
            'service' => 'https://cms.webug.se/root/G2/students/a21ponkr/LenaSYS/DuggaSys/courseedservice.php',
            'service-data' => serialize(array(
                'opt' => 'CPYVRS',
                'courseid' => '9999',
                'coursecode' => 'testCourseCode',
                'versid' => '12345679',
                'versname' => 'testVersName',
                'coursename' => 'testCourseName',
                'coursenamealt' => 'testCourseNameAlt',
                'motd' => 'testMotd',
                'startdate' => '2020-05-01 00:00:00',
                'enddate' => '2020-06-30 00:00:00',
            'blop' => '<!query-before-test-1!> <*[0][cid]*>'
            )),
            'filter-output' => serialize(array(
                'cid',
                'coursecode',
                'vers',
                'versname',
                'coursename',
                'coursenamealt',
                'opt',
                'motd',
                'startdate',
                'enddate'
             )),
        ),

        /* Update course */

        'Update course test' => array(
            'expected-output' => '{
                "LastCourseCreated": [],
                "entries": [],
                "versions": [],
                "debug": "NONE!",
                "writeaccess": null,
                "motd": "UNK",
                "readonly": 0
              }',
            'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testCourseCode' ORDER BY coursecode DESC LIMIT 1",
            'query-before-test-2' => "INSERT INTO course($cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1]);",
            'query-after-test-1' => "DELETE FROM vers WHERE cid = 9999;",
            'query-after-test-2' => "DELETE FROM course WHERE cid = 9999'",
        'query-variables' => "blop",
            'service' => 'https://cms.webug.se/root/G2/students/a21ponkr/LenaSYS/DuggaSys/courseedservice.php',
            'service-data' => serialize(array(
                'opt' => 'UPDATE',
                'courseid' => '9999',
                'coursecode' => 'G9999',
                'coursename' => 'Testing-Course',
                'courseGitURL' => 'NULL',
                'visibility' => '1',
            'blop' => '<!query-before-test-1!> <*[0][cid]*>'
            )),
            'filter-output' => serialize(array(
                'readonly',
                'opt',
                'courseid',
                'coursecode',
                'coursename',
                'courseGitURL',
                'visibility'
             )),
        ),

        /* SETTINGS test */

        'SETTINGS test' => array(
            'expected-output' => '{
                "LastCourseCreated": [],
                "entries": [],
                "versions": [],
                "debug": "NONE!",
                "writeaccess": null,
                "motd": "UNK",
                "readonly": 0
              }',
            'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testCourseCode' ORDER BY coursecode DESC LIMIT 1",
            'query-after-test-1' => "DELETE FROM settings ORDER BY sid DESC LIMIT 1;'",
        'query-variables' => "blop",
            'service' => 'https://cms.webug.se/root/G2/students/a21ponkr/LenaSYS/DuggaSys/courseedservice.php',
            'service-data' => serialize(array(
                'opt' => 'SETTINGS',
                'motd' => 'Test',
                'readonly' => '0',
            'blop' => '<!query-before-test-1!> <*[0][cid]*>'
            )),
            'filter-output' => serialize(array(
                'readonly',
                'opt',
                'motd',
             )),
        ),


);

 
testHandler($testsData, false);
