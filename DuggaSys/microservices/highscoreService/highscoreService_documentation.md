# HighscoreService Documentation
This is the documentation for the microservices highscoreservice_ms.php and retrieveHighscoreService_ms.php.

### highscoreservice_ms.php
The highscoreservice outputs the highscores for the selected dugga. 
An array is created which stores the highscore information that is returned by making a call to the function retrieveHighscoreService(). json_encode() then returns a JSON representaton of the array with highscore infromation. Events are also logged with the function logServiceEvent().  

### retrieveHighscoreService_ms.php

