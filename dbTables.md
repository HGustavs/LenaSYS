#  LenaSYS Database

## Creating tables or adding columns
When creating tables or adding columns permanent go to `/Shared/SQL/init_db.sql` and follow the current syntax when adding your table/column. When you are done go to `/install/` and run `install.php` for the changes to take effect.

## Adding/editing testdata
When adding or editing testdata go to `/install/SQL/testdata.sql` and keep in mind to keep the structure in the code. When you are done go to `/install/` and run `install.php` for the changes to take effect.

## Schema of the database without relationsships
![LenaSYS_schema_simple](https://user-images.githubusercontent.com/43996354/81921863-8c278c80-95db-11ea-9140-e3be59bf48ef.png)

## Schema of the database with relationships
![LenaSYS_schema_relations](https://user-images.githubusercontent.com/43996354/81922100-eb859c80-95db-11ea-85e3-2bd4c5685426.png)

## Tables

### announcment
An entry in the announcement table is created when a teacher creates an announcement. There will be one entry in the table for each student that gets the announcement.

### box
"Dugga" entries in the "Webbprogrammering" course. 2 entries per dugga, 1 txt entry and one other for the dugga type (html, php or js file). (NOT IMPLEMENTED YET, NOT FUNCTIONAL.) 

### class
The class table stores all the programs that are available in the school and is stored alongside a responsible teacher for that class.

### codeexample
Code Example contains a list of the code examples for a version of a course in the database. Version of sections and examples corresponds roughly to year or semester that the course was given.

### course
In this table every course that is available is stored, however there are some courses that has visibility '0' and those courses are only visible for the teachers. The course table contains the most essential information relating to study courses in the database.

### course_req
This table represents a many-to-many relation between courses, to illustrate pre-requirements for courses.

### eventlog
When a user tries to log in and fails to enter the correct password an entry is created in the eventlog table.

### fileLink
An entry in this table allow file locations to be related to specific courses. For example, if an instructor wants to give students a link to a file that they should be able to download from the course page.

### groups
All groups that exists are stored in this table. Students needing to team up on a cooperative dugga are assigned to a group (This is done in the user_group table).

### highscore_quiz_time 
This is a view that pulls the top 10 fastest quiz finishing students and lists them.

### improw
improw contains a list of the important rows for a certain example (NOT IMPLEMENT YET, NOT FUNCTIONAL BECAUSE IT USES THE box TABLE).

### impwordlist
impwordlist contains a list of important words for a certain code example (NOT IMPLEMENT YET, NOT FUNCTIONAL BECAUSE IT USES THE box TABLE).

### list
This table is not used.

### listentries
The listentries table contains the list of dugga's, headers, etc. in a course. Everything that is listed in a dugga is stored in this table. 

### opponents
Opponents table used to save opponents for seminars.

### options
This table is not used.

### partresult
This table is not used right now. However, it stores results from a part of a course. Might need a rework.

### playereditor_playbacks
This table is not used.

### programcourse
This table represents a many-to-many relation between class and course tables.

### quiz
The quiz table contains everything related to a dugga, and connects the dugga to a specific .js template file. It does not save answers, it only loads the dugga how it is supposed to look like.

### sequence
This table is not used.

### settings
The settings table is used for setting the MOTD in courseed.php. This MOTD is currently hidden but can still be set.

### studentresultat
This table is not used.

### studentresultcourse
A view that selects elements from the partresult and subparts tables.

### submission
The table that stores the link to the uploaded file that a student submits on a dugga where you upload a file.

### subparts
Not in use at the moment. However, it stores the different subparts of each course.

### template
This table is not used, there is no way to insert and all the entries in the table are files that do no exist.

### timesheet
Used for timesheet duggas.

### user
Stores all the users that exists in the system.

### userAnswer
Stores all the duggas that has been saved in the system. That is, the answers that a student has entered is stored here.

### user_course
This table represents a many-to-many relation between users and courses. That is, a tuple in this table joins a user with a course.

### user_group
Represents a many-to-many relation between users and groups.

### user_participant
This table is not used.

### user_push_registration
Stores all users that have signed up for push notifications.

### variant
An entry in the variant table is used to add questions to quiz tests.

### vers
Stores the different versions of a course for different years.

### word
Stores all the keywords that are used in a specific language.

### wordlist
Used to categorize the words from the word table into different languages.