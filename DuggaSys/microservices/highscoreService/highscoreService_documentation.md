# HighscoreService Documentation
This is the documentation for the microservices highscoreservice_ms.php and retrieveHighscoreService_ms.php.

### highscoreservice_ms.php
The highscoreservice outputs the highscores for the selected dugga. 
An array is created which stores the highscore information that is returned by making a call to the function retrieveHighscoreService(). json_encode() then returns a JSON representaton of the array with highscore infromation. Events are also logged with the function logServiceEvent().  

### retrieveHighscoreService_ms.php
The retrieveHighscoreService is used by highscoreservice to fetch highscore information. The function takes four parameters which are used to create a database query to fetch the correct highscore information.

An array "$rows" is created to store user names and scores that were fetched from the database. A "$user" array is then created to store the index of the element in the $rows array that corresponds to the logged in user for this session, if it exists in the $rows array that is. If $user is empty it is instead populated with one row from the database query. According to a comment in the file this is for testing reasons. 

An array "$array" is created and populated with all the relevant highscore information, namely the arrays "$debug", "$rows" and "$user". The array is returned at the end of the function.