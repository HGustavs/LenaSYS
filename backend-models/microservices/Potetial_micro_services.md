# Potetial micro services
---
## LIST OF FILES
---
- accessedservice
- codeviewerService
- contributedservice : _there is no documentation for this file_
- contribution_loginbox_service
- courseedservice : __No document found manual research needed__  
- diagramservice
- duggaedservice
- fileedservice
- highscoreservice
- sectionedservice
- profileservice 
- resultedservice
- sectiondservice : __No document found manual research needed__  
- showDuggaservice



## Potentaial services 
---
### hasAccess

This function is currently housed in session.php and might therefore not be something that should be transitioned to a micro service..

```
Check if a specified user ID has the requested access on a specified course

@param int __$userId__ User ID of the user to look up
@param int $courseId ID of the course to look up access for
@param string $access_type A single letter denoting read or write access (r and w respectively)
@return bool Returns true if the user has the requested access on the course and false if they don't.
```
---
### addUser
Performes inserts into the table __user__, Parameters used: 
- username
- saveemail
- firstname
- lastname
- ssn
- rnd  (uses the function standardPasswordHash to create a random password)
- className

---
### updateUserInformation

Updates values in the table __user__ in the database, columns that are updated.
- firstname
- lastname
- ssn
- username
- class
- password 

#### update password
updates the column _"password"_ should be conducted in a seperat method/function. 

---

### addUserToCourse

Performes an insert into the table __user_course__. Parameters needed:
- uid
- cid
- coursevers : This parameter is used for vers, avers and bvers



---
### updateUserCourse 

Update values in the table __user_course__, columns that are updated.
- examiner
- vers
- access
- group
--- 

### addClass
Creates new class. Makes inserts into the table __class__.
Parameters added: 
- class
- responsible
- classname
- regcode
- classcode
- hp
- tempo
- hpProgress
---

### selectFromClass
Gathers information from the table __class__.

#### different querys paramaters and retrived information 
- className : class 
