Documentation on how to conduct tests for service files

**Guide on how to setup such file:**  
Name the file filename-tests.md (e.g duggaedservice-tests, do NOT include .php here) \
Include the name of the file to be tested at the first line (e.g duggaedservice.php). \ 

For each test, write the values needed to get to that line of code and then how to decide if the test has passed or not. Name the tests in a describing manner. \
Give a short description of the test, and how it will test. \

E.g \

saveDuggaNewTest (line 57): \
  #Test to see ensure that saving a new dugga works. First make an SQL query for the dugga/quiz, create the dugga and then make the same query. \
  #The test passes if the database has added the new dugga. \

  * pre-req: {checklogin = true && hasAccess = true, ... etc...} \
  * SQL query to find the current number of quizes !!!WRITE THE QUERY WITH VALUES HERE!!! \
  * Send values to duggaedservice.php !!!WRITE THE PARAMETERS TO BE SENT, NAMED ACCORDING TO THE VARIABLES IN THE FILE!!! \
  * - send { $var1 = value1, $var2 = value2 ... }
  * SQL query, same as above  \
  * Relevant output in order to know if succeeded \
  * Clean up database !!!! VERY IMPORTANT !!!!

test2:

  etc....
  
Look at duggaedservice.md to get a more complete example
