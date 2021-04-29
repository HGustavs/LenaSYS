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

### class

### codeexample

### course

### course_req

### eventlog

### fileLink

### groups

### highscore_quiz_time 

### improw

### impwordlist

### list

### listentries

### opponents

### options

### partresult

### playereditor_playbacks

### programcourse

### quiz

### sequence

### settings

### studentresultat

### studentresultcourse

### submission

### subparts

### template

### timesheet

### user

### userAnswer

### user_course

### user_group

### user_participant

### user_push_registration

### variant

### vers

### word

### wordlist