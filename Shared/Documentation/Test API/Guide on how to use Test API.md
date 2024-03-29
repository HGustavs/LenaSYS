# ﻿Guide on how to use Test API 

The test API makes it possible to test multiple services in a monolithic or a microservice and compare the result of the execution to determine if a microservice is working like the monolithic service or not, alternatively compare the result to an expected output. And it can also be used to automate a service execution without manually doing the actions required. 

![test-api-overview](overview-Test-API.png)

**Figure 1**  Overview of the processes performed by the Test API 


### How it works 

The test API executes three different tests, the first one making sure that the login credentials work, the second one calling the actual service with the service data, and the last test compares the result. The result that is to be compared can either be the results from the monolithic service and the microservice (to be implemented), or the value of a service execution and an expected output from the JSON input data. You need to determine the expected output yourself, a good strategy is to manually perform steps required to do something on LenaSys and then look at the payload. This payload from correct manuall steps should then be the same as the output from the automated process by the API. All these three tests will output a pass or fail for each test as well as the response. 

### How to use it 

The test API aims to be as easy as possible. In figure 2 you can find an example of the code and JSON needed to use the test API, this will be referred to in this guide. First you need to include the test.php file. And the last step in the code should be to call the testHandler() with the JSON data, path (URL to services directory) and the third parameter that decides how you want to view the results. The JSON data in $testsData is what controls the testing API. For every outer array you include in this JSON a test will be run for the service, in the example there are currently two tests: create course test and create course test 2. **OBS! All test files needs to be stored in folder DuggaSys/tests otherwise it wont work.**

- **expected-output:** Data to use in the comparison test. Compares this data to the service output. You will need to find this from the respons when manually do the actions required to execute a service.
- **query-before-test:** If database query is needed before test (ex insert) insert query here. Add a number to the end in order to execute multiple querys.  
- **query-after-test:** If database query is needed after test (ex delete) insert query here. Add a number to the end in order to execute multiple querys.   
- **service:** This should be the URL to the file that contains the service you are going to test. You can use either a relative URl (only filename) or a static URL. If realtive same URL as the Test API will be used.  
- **service-data**: Include here all data that are needed to execute the specific service. The monolithic services use the opt to decide which service to execute. But each service also needs other parameters to be able to execute the service. In the example all parameters to create a new course is defined. This is something you need to find out, and there should be test descriptions on GitHub that describes all these needed parameters. 

- **filter-option:** This decides what JSON output to use in the comparison test that will be performed later. This should be the same as the expected output if used. And it is also the displayed repones from the test. If none is used as the only value in the array all output data from the service will be used. You can also make an array to specify what values in the array of a respons field to include, in the example only coursename, cousecode and visibility will be saved. Maximum nested array is 3 as example. If there is no array like this alla data will be used (no filter will be applied to the specific field)

#### Save query output
You can save the output from a "query-before-test" and use the value in the service data as the example in figure 2 shows. Soround the name of the query you want to save with "<!" before and  "!> after (ex !query-before-test-1!) and then you can specify a path to the exact value (optional) to save, for example [0][coursename], do this "<* .... *>".

#### Unkown value in query - **variables-query-before-test-X** 
If you have an unknown value in your SQL query and you need the result of another query to determine that value, you have two options, the first one (more complex) is to modify your query to include an SQL subquery in order to retrive the value. Here's an example of how to use a subquery to delete a row with an unknown `cid` value:
```
DELETE FROM course WHERE coursename = 'MyAPICourse' AND cid = (SELECT cid FROM (SELECT cid FROM course WHERE coursecode = 'IT400G' ORDER BY coursecode DESC LIMIT 1) AS temp_table);
```

The second, more simpler method is to use the `variables-query-before-test-X` field, create this field before the query field. This allows you to retrieve values from the `service-data` array by specifying the names of the corresponding rows of data, which can be separated by commas (and space after comma ex blop, blop2, blop3). Then, in your query, you can use a question mark '?' as a placeholder. The first '?' corresponds to the first name in the 'query-variables' field. In Figure 2, the value of 'blop' is assigned to `query-before-test-3`, which is the result of **<!query-before-test-1!><[0][cid]>** in this example.


```php
/*
----------------------------------------------------------
    Example on how to run this test from another file:
----------------------------------------------------------
*/
 
<?php
 
include "../../Shared/test.php";
 
$testsData = array(
    'create course test' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'IT401G' ORDER BY coursecode DESC LIMIT 1",
	'variables-query-before-test-2' => "blop",
        'query-before-test-2' => "INSERT INTO course (coursecode,coursename,visibility,creator, hp) VALUES('IT401G','MyAPICourse',0,101, 7.5)",
	'variables-query-before-test-3' => "blop",
        'query-before-test-3' => "DELETE FROM course WHERE coursecode = 'IT401G' AND cid = ?",
        'query-after-test-1' => "DELETE FROM course WHERE coursecode = 'IT478G' AND coursename = 'APICreateCourseTestQuery'",
        'query-after-test-2' => "DELETE FROM course WHERE coursecode = 'IT478G' AND coursename = 'APICreateCourseTestQuery'",
        'service' => 'courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'NEW',
            'username' => 'usr',
            'password' => 'pass',
            'coursecode' => 'IT466G',
            'coursename' => 'TestCourseFromAPI4',
            'uid' => '101',
	    'blop' => '<!query-before-test-1!> <*[0][cid]*>'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'readonly',
            'entries' => array( // if not specified all data in array is used otherwise filtered with defined values
                'coursename' => array(
		     'shortname'
		),
                'coursecode',
                'visibility'
            ),
        )),
    ),
    'create course test 2' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'NEW',
            'username' => 'usr',
            'password' => 'pass',
            'coursecode' => 'IT466G',
            'coursename' => 'TestCourseFromAPI5',
            'uid' => '101'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
);
 
testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON

```


Example output (can be some differences): 
```
{
  "create course test": {
    "querys-before-test": {
      "query-before-test-1": [
        {
          "0": "2354",
          "cid": "2354"
        }
      ],
      "query-before-test-2": "Succesfully executed query but no return data",
      "query-before-test-3": "Succesfully executed query but no return data"
    },
    "Test 1 (Login)": {
      "result": "passed",
      "username": "hidden",
      "password": "hidden"
    },
    "Test 2 (callService)": {
      "result": "passed",
      "respons": {
        "debug": "Error updating entries\nDuplicate entry 'IT466G' for key 'course.coursecode'",
        "motd": "UNK"
      },
      "service": "https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php",
      "data": {
        "opt": "NEW",
        "username": "hidden",
        "password": "hidden",
        "coursecode": "IT466G",
        "coursename": "TestCourseFromAPI4",
        "uid": "101",
        "blop": "2354",
        "blop2": "S"
      },
      "query-return": {
        "query-before-test-1[0][cid]": "2354",
        "query-before-test-2[0][coursename]": "S"
      }
    },
    "Test 3 (assertEqual)": {
      "result": "failed",
      "value-expected": {
        "debug": "NONE!",
        "motd": "UNK"
      },
      "value-output": {
        "debug": "Error updating entries\nDuplicate entry 'IT466G' for key 'course.coursecode'",
        "motd": "UNK"
      }
    },
    "querys-after-test": {
      "query-after-test-2": "Succesfully executed query but no return data"
    }
  },
  "create course test 2": {
    "querys-before-test": {
      "query-before-test-1": [
        {
          "0": "2354",
          "cid": "2354"
        }
      ],
      "query-before-test-2": "Succesfully executed query but no return data",
      "query-before-test-3": "Succesfully executed query but no return data"
    },
    "Test 1 (Login)": {
      "result": "passed",
      "username": "stei",
      "password": "password"
    },
    "Test 2 (callService)": {
      "result": "passed",
      "respons": {
        "LastCourseCreated": [
          {
            "LastCourseCreatedId": "2354"
          }
        ],
        "entries": [
          {
            "cid": "307",
            "coursename": "Datorns grunder",
            "coursecode": "IT115G",
            "visibility": "0",
            "activeversion": "12307",
            "activeedversion": null,
            "registered": false
          },
          {
            "cid": "324",
            "coursecode": "IT108G",
            "vers": "12324",
            "versname": "HT15",
            "coursename": "Webbutveckling - webbplatsdesign",
            "coursenamealt": "UNK"
          },
          {
            "cid": "1894",
            "coursecode": "G420",
            "vers": "52432",
            "versname": "ST20",
            "coursename": "Demo-Course",
            "coursenamealt": "Chaos Theory - Conspiracy 64k Demo"
          }
        ],
        "debug": "Error updating entries\nDuplicate entry 'IT466G' for key 'course.coursecode'",
        "writeaccess": true,
        "motd": "UNK",
        "readonly": 0
      }
    },
    "querys-after-test": {
      "query-after-test-2": "Succesfully executed query but no return data"
    }
  }
}
```

**Figure 2**  Example of test case code 


### JSON Output and pretty print 

Depending on the second argument to testHandler two different outputs will be displayed.  

- **True:** Returns HTML that displays the results.  
- **False:** Returns all test results as JSON. 

***Guide for Test API version 1.5***