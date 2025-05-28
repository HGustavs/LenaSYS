<?php





  include "../../Shared/test.php";


  $testsData = array(

    "testDownloadToWebServer" => array(

      "input" => array(

        "cid" => 'testCourse',
        "item" => array(
          'download_url' => 'http://exampleOfwebserver.com/testfile',
          'name' => 'testfile',
          'path' => 'testpath/testfile'
        )
      ),
      "output" => array(

        "fileExists" => true,
        "fileContentsMatch" => true
      )
    )
  );

  function testDownloadToWebServer($testData) {

    $input = $testData["input"];
    $expectedOutput = $testData["output"];

    // Call the function with the input
    downloadToWebServer($input["cid"], $input["item"]);


    // Check the output
    $fileExists = file_exists('../../LenaSYS/courses/'. $input["cid"] . '/' . "Github" .'/' . $input["item"]['path']);
    $fileContentsMatch = file_get_contents('../../LenaSYS/courses/'. $input["cid"] . '/' . "Github" .'/' . $input["item"]['path']) == file_get_contents($input["item"]['download_url']);


    // Return the results
    return array(

      "fileExists" => $fileExists,
      "fileContentsMatch" => $fileContentsMatch
    );
  }

  // Add the test function to the testsData array
  $testsData["testDownloadToWebServer"]["function"] = "testDownloadToWebServer";



  testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
  
  
  ?>
