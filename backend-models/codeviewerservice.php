codeviewerservice.php

This file starts by including four files once. Meaning that when the system starts, these four files gets started as well but only at start time.
the files are as follows : 
courseyspw.php,
sessions.php,
basic.php,
courses.php,
database.php.

There after, a database connection gets started and a session start gets started.

The system checks if the user has an id, if it doesn't, a user will be assigned as "guest".

A fetch happens that fetches a row of querys with information about the examples everytime the statement is true.

If there isn't an avaible example, a check happens to see if the user is a teacher(superuser), otherwise the user doesn't get to change or update this information. If the user is a superUser, the superUser parses and gets the extra information about the example, such as templateNumber and exampleId.

Afterwards, POST requests get sent to the database, holding information suchs as exampleName and "before and after id".

If this information is unknown, the tables gets updated.

A functionality to POST important words to the database exist. Same goes for removing words and also rows.

An output in form of a array holding title,"boxtitle" and "boxid" gets "echoed".
Same goes for an array holding writeacces to the superUser "w".

Another output in form of an echoe sends an array holding "deleted" if the statements is true.

A fetch, meaning, a form of input where the system fetches stylesheet, section names and information about the examples.

Another fetch happens, where all words for each wordlist gets fetched.
And all wordlists.


To sumarize the file!
The file checks what kind of user it is, and gives code examples in the lenaSys system depending on what kind of user it is. 
It prepares data from the database to be presented in other files. 


