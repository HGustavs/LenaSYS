contributonservice.php

----------------------------------------------------------------------------------------
# Create an assignment (line 57):
----------------------------------------------------------------------------------------

*********
## pre-req:

    checklogin() IS TRUE && 
    isSuperUser($_SESSION['uid']) IS TRUE

### Login values: 

    username: keree
    password: password


*********
*********
# send parameters inputs to duggaedservice.php 

## send
    {
        $opt = "SAVDUGGA";
        $qid = null; or $qid = “UNK”;
        $cid = 1885;
        $userid = 2;        // this is automatically added depending on what session is active (if any), we want the value to be 2
        $coursevers = 1337;
        $qname = "TestQuiz";
        $autograde = 1;
        $gradesys = 2;
        $template = "Quiz";
        $jsondeadline = '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}';
        $release = "2023-04-27 00:00:00";
        $deadline = "2023-04-29 00:00:00";
        $qstart = "2023-04-17";
    } 

*****
* Get newly creaded Assignment ID
*****
    
    SQL-query: SELECT MAX(id) FROM quiz;     // save to variable $id this value will identify the last assignment that was created (it has the highest ID number) 

*****
* Gather service output
*****

    Save the values of the echoed array as a JSON (at the end of the file. echo json_encode($array);)
    this is the expected output for the micro service.  

*****
* remove inserted row from DB, using qid 
*****

    SQL-query: DELETE FROM quiz WHERE id = $id;

