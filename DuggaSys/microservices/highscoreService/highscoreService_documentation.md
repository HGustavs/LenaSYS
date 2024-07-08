# HighscoreService Documentation
This is the documentation for the microservices highscoreservice_ms.php and retrieveHighscoreService_ms.php.

### highscoreservice_ms.php
The highscoreservice outputs the highscores for the selected dugga. 
An array is created which stores the highscore information that is returned by making a call to the function retrieveHighscoreService(). json_encode() then returns a JSON representaton of the array with highscore infromation. Events are also logged with the function logServiceEvent().  

### retrieveHighscoreService_ms.php
The retrieveHighscoreService is used by highscoreservice to fetch highscore information. The function takes four parameters which are used to create a database query to fetch the correct highscore information.

//add explanation for line 24-34 and line 36-65 (research to understand what is going on first)

An array is created containing all the relevant highscore infromation, namely the arrays $debug, $rows and $user. The array is returned at the end of the function. 