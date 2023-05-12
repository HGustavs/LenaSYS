# Potetial micro services

This document primaraly focuses on the services provided by the service-files, that does not mean that a complementary document wont be needed for functions that gather information, but we start with this.

---
# LIST OF ORIGINAL FILES FILES
---
- accessedservice __==finished==__
- codeviewerService __==finished==__
- contributedservice : _there is no documentation for this file_ __dont know is needed__
- contribution_loginbox_service : __dont know if needed__
- courseedservice  __==finished==__
- diagramservice  __WORK PAUSED in this service will continue when the service is fixed__
- duggaedservice __==finished==__
- fileedservice __==finished==__
- highscoreservice __==finished==__
- sectionedservice __==finished==__
- profileservice __==finished==__
- resultedservice __==finished==__
- showDuggaservice __==finished==__ 

---
---
# Potentaial services 
---
---
<br>

---
## --------- _Misc services used in multiple of the original services_ -------------
---


<br>

### logging
Uses a function in basic.php. 


<br>

---

<br>


### getUid
Uses service __selectFromTableUser__ to _get_ information it requires from __user__.


<br>

---

<br>


### isSuperUser
Uses a function in Session.php. 
```
Returns superuser status of user
@param int $userId User ID of the user to look up
@return true false. True if superuser false if not
```


<br>

---

<br>


### hasAccess

This function is currently housed in session.php and might therefore not be something that should be transitioned to a micro service..

```
Check if a specified user ID has the requested access on a specified course

@param int __$userId__ User ID of the user to look up
@param int $courseId ID of the course to look up access for
@param string $access_type A single letter denoting read or write access (r and w respectively)
@return bool Returns true if the user has the requested access on the course and false if they don't.
```

<br>

---

<br>

### setUserID

Checks currents sessions user ID and sets it to a variable.  

*writters personal comment, this might be to small to justify making a seperat service. 

<br>

---

<br>

### setActiveCourseversion
__USED BY__
- updateCourseVersion__sectioned
- changeActiveCourseVersion_courseed
- updateCourseVersion_courseed
- copyCourseVersion
<br>

Uses the services __updateTableCourse__ to change the content of these columns:
- activeversion

<br>

---

<br>

### updateUserPassword
__USED BY__
- changeUserPassword_accessed
- changeProfileValues
<br>

Uses the services __updateTableUser__ to change the content of these columns:
- password

<br>

---

<br>

### createNewCodeexample
__USED BY__
- createListentrie
- createGithubCodeexample
<br>

Uses the services __insertIntoTableCodeexample__ to _insert_ into the table __codeexample__.
- cid
- exampleid
- sectionname
- uid = 1 (static value)
- cversion

<br>

---

<br>

### createNewListentrie
__USED BY__
- createListentrie
- createGithubCodeexample
<br>

Uses the services __insertIntoTableListentries__ to _insert_ into the table __listentries__.
- cid
- vers
- entryname
- link
- kind
- pos
- visibility
- creator 
- comment
- gradesys
- highscoremode
- groupKind

<br>

---

<br>

### createNewVersionOfCourse
__USED BY__
- createCourseVersion
- copyCourseVersion
<br>

Uses the services __insertIntoTableVers__ to _insert_ into the table __vers__.
- cid
- coursecode
- vers
- versname
- coursename
- coursenamealt
- startdate
- enddate
- motd

<br>

---

<br>

### setAsActiveCourse
__USED BY__
- createCourseVersion
- setActiveCourseversion
<br>

Uses the services __updateTableCourse__ to change the content of these columns:
- activeversion

<br>
<br>
<br>

---
## ----- _accessedservice_ -----------------------------------------------------
---

<br>
<br>


### UpdateUserAndUsercourse
Uses service __updateTableUser__ to update one of these columns in the table __user__, at a time:
- firstname
- lastname
- ssn
- username
- class
- password 

Uses service __updateTableUser__ to update one of these columns in the table __user_course__ at a time:
- examiner
- vers
- access
- group


<br>

---

<br>


### addClass

Uses service __insertIntoTableClass__ to makes _inserts_ into the table __class__.


<br>

---

<br>


#### changeUserPassword_accessed
Uses service __updateUserPassword__ to _update_ the column "_password_" in the table __user__. 


<br>

---

<br>


### addUser
Uses service __selectFromTableClass__ to _get_ information it requires from __class__.
Uses service __insertIntoTableclass__ to _insert_ into the table __class__.
<br>

Uses service __insertIntoTableUser__ to _insert_ into the table __user__.
Uses service __insertIntoTableUserCourse__ to _insert_ into the table __user_course__.


<br>
<br>
<br>

---
## ------- _codeviewerService_ ----------------------------------------------
---


<br>


### settingCodeexampleTemplate
Updates the template for the code boxes in LenaSYS.

Uses service __updateTableCodeexample__ to set templateid recived from input, that value is also placed in the variable __templateNumber__. 
The number of boxes created depends on on the value of _templateNumber_. 
The contents of all boxes are gatherd with the service __selectFromTableBox__.
Depending on if a box with the set id exists or not an insert into the table __box__, using service __insertIntoTableBox__, or an update, using __updateTableBox__, is performed. 


<br>

---

<br>


### editCodeExample
This service uses __updateTableCodeexample__ to update values in table __codeexample__:
- runlink
- examplename
- sectionname
- beforeid
- afterid

Aswell as __insertIntoTableImpwordlist__ or __deliteFromTableImpwordlist__ to add or remove a row in table __impwordlist__.


<br>

---

<br>


### editContentOfCodeExample
Uses the services __updateTableBox__ to change the content of these columns:
- boxtitle
- boxcontent
- filename
- fontsize
- wordlistid

Aswell as __insertIntoTableImprow__ or __deleteFromTableImpwordlist__ to add or remove a row in table __improw__.


<br>

---

<br>


### editBoxTitle
Uses service __updateTableBox__ to change value of column: 
- boxtitle


<br>

---

<br>



### deliteExample
Uses service __deleteFromTableBox__ to delete a row from the table __Box__.
Uses service __deleteFromTableImprow__ to delete a row from the tabe __improw__.
Uses service __deleteFromTableImpwordlist__ to delete a row from the tabe __impwordlist__.
Uses service __deleteFromTableCodeexample__ to delete a row from the tabe __Codeexample__.
Uses service __deleteFromTableListentries__ to delete a row from the tabe __listentries__.


<br>
<br>
<br>

---
## ----- _courseedservice_ -------------------------------------------------
---

<br>



### createNewCourse
Uses service __insertIntoTableCourse__ to makes _inserts_ into the table __course__.
Uses service __selectFromTableCourse__ to _get_ information it requires from __course__.


<br>

---

<br>


### createCourseVersion
Uses service __insertIntoTableVers__ to makes _inserts_ into the table __Vers__.
Uses the services __setAsActiveCourse__ to change the content of these columns:
- activeversion

<br>

---

<br>

### updateCourseVersion_courseed
Uses the services __updateTableVers__ to change the content of these columns:
- versname

Uses the services __setActiveCourseversion__ to change the content of these columns:
- activeversion

<br>

---

<br>

### changeActiveCourseVersion_courseed
Uses the services __setActiveCourseversion__ to change the content of these columns:
- activeversion

<br>

---

<br>


### copyCourseVersion
Uses service __createNewVersionOfCourse__ to makes _inserts_ into the table __Vers__.
<br>

Uses service __selectFromTableQuiz__ to _get_ information it requires from __quiz__.
Uses service __insertIntoTableQuiz__ to makes _inserts_ into the table __quiz__. (copys values from a row into a new insert, with new _vers_ number)
<br>

Uses service __selectFromTableVariant__ to _get_ information it requires from __variant__.
Uses service __insertIntoTableVariant__ to makes _inserts_ into the table __variant__. (copys values from a row into a new insert, with new _quizID_ number)
<br>

Uses service __selectFromTableCodeexample__ to _get_ information it requires from __codeexample__.
Uses service __insertIntoTableCodeexample__ to makes _inserts_ into the table __codeexample__. (copys values from a row into a new insert, with new _quizID_ number)
<br>

Uses service __selectFromTableBox__ to _get_ information it requires from __box__.
Uses service __insertIntoTableBox__ to makes _inserts_ into the table __box__. (copys values from a row into a new insert, with new _exampleid_ number)
<br>

Uses service __selectFromTableImprow__ to _get_ information it requires from __improw__.
Uses service __insertIntoTableImprow__ to makes _inserts_ into the table __improw__. (copys values from a row into a new insert, with new _exampleid_ number)
<br>

Uses service __selectFromTableImpwordlist__ to _get_ information it requires from __impwordlist__.
Uses service __insertIntoTableImpwordlist__ to makes _inserts_ into the table __impwordlist__. (copys values from a row into a new insert, with new _exampleid_ number)
<br>

Uses the services __updateTableListentries__ to change the content of these columns:
- moment

Uses the services __updateTableListentries__ to change the content of these columns:
- link

Uses the services __updateTableCodeexample__ to change the content of these columns:
- beforeid

Uses the services __updateTableCodeexample__ to change the content of these columns:
- afterid

Uses the services __setAsActiveCourse__ to change the content of these columns:
- activeversion


<br>


---


<br>


### updateCourse
Uses the services __updateTableCourse__ to change the content of these columns:
- coursename
- visibility
- coursecode
- courseGitURL


<br>

---

<br>


### createMOTD
Uses service __insertIntoTableSettings__ to makes _inserts_ into the table __settings__.


<br>


---


<br>


### deleteCourseMaterial
Uses service __deliteFromTableCodexample__ to delete a row from the table __codeexample__.
Uses service __deliteFromTableListentries__ to delete a row from the table __listentries__.
Uses service __deliteFromTableQuiz__ to delete a row from the table __quiz__.
Uses service __deliteFromTableVers__ to delete a row from the table __vers__.
Uses service __deliteFromTableCourse__ to delete a row from the table __course__.



<br>
<br>
<br>


---
# ----- _fileedservice_ -----------------------------------------------------------
---

<br>
<br>

### createOrUpdateDugga
Uses service __insertIntoTableQuiz__ to makes _inserts_ into the table __quiz__. 
Uses the services __updateTableQuiz__ to change the content of these columns:
- coursename
- visibility
- coursecode
- courseGitURL
- qname
- autograde
- gradesystem
- quizFile (template)
- qstart (start date)
- deadline
- qrelease (release date)
- jsondeadline
- group



<br>

---

<br>


### deleteDugga
Uses service __deliteFromTableQuiz__ to delete a row from the table __quiz__.



<br>

---

<br>


### createDuggaVariant
Uses service __insertIntoTablVariant__ to makes _inserts_ into the table __Variant__.


<br>

---

<br>


### updateDuggaVariant 
Uses the services __updateTableVariant__ to change the content of these columns:
- disabled
- param
- variantanswer


<br>

---

<br>


### deleteDuggaVariant
Uses service __deliteFromTableUserAnswer__ to delete a row from the table __userAnswer__.
Uses service __deliteFromTableVariant__ to delete a row from the table __variant__.


<br>

---

<br>


### deleteFileLink
Count rows where these conditions hold. This will indicate if the file is in used.

- __FROM__ fileLink, box __WHERE__ box.filename = fileLink.filename __AND__ (fileLink.kind = 2 __OR__ fileLink.kind = 3) __AND__ fileLink.fileid=:fid ;
<br>

If not in use, then service __deliteFromTableFileLink__ is used to delete a row from the table __fileLink__.

This service contains two seperat instanses of the above mentiond code, placed in an if and else statment. 


<br>

---

<br>

### updataFileLink
Uses the services __updateTableFileLink__ to change the content of these columns:
- filesize
There exist tree different versions of this update, with different _WHERE_ cases.
__WHERE__ kind __AND__ filename;
__WHERE__ cid __AND__ kind __AND__ filename;
__WHERE__ vers __AND__ cid __AND__ kind __AND__ filename;

<br>
<br>
<br>

---
## -------------------------------------- _highscoreservice_ --------------------------------
---

<br>
(writers comment: i belive this service is small enough as is)

### highscoreservice
Return max ten passed scores.
Uses service __selectFromTableScore__ to _get_ information it requires from __Score__ and __userAnswer__. 
<br>

Return score for a specific test.
Uses service __selectFromTableScore__ to _get_ information it requires from __Score__ and __userAnswer__. 

<br>
<br>
<br>

---
## ------------------------------------ _sectionedservice_ -----------------------------
---

<br>
<br>

### getGroupValues  
Uses service __selectFromTableGroup__ to _get_ information it requires from __group__. 
<br>

---

<br>


### getCourseGroupsAndMembers
Gets groups and there members for a specific course  
Uses service __selectFromTableScore__ to _get_ information it requires from __user__ and __user_course__. 

<br>

---

<br>

### deleteListentries
listentries are duggas, headers, tests,  etc..  
Uses service __deliteFromTableListentries__ to delete a row from the table __listentries__.

<br>

---

<br>

### removeListentries (hides the entrie, no delete it)
This will change the visibility of a listentry to deleted instead of deleting the item from the database. This will enable restoring deleted items.
<br>

Uses the services __updateTableListentries__ to change the content of these columns:
- visible = 3

<br>

---

<br>

### createListentrie
Insert a new code example and update variables accordingly.
Uses service __selectFromTableCodeexample__ to _get_ information it requires from __codeexample__. 
Uses service __createNewCodeexample__ to makes _inserts_ into the table __codeexample__.
Uses service __createNewListentrie__ to makes _inserts_ into the table __listentries__.

<br>

---

<br>

### reorderListentries
Uses the services __updateTableListentries__ to change the content of these columns:
- pos
- moment

<br>

---

<br>

### updateListentrie
Uses service __selectFromTableListentries__ to _get_ information it requires from __listentries__.
Uses service __createNewCodeexample__ to makes _inserts_ into the table __codeexample__.
Uses the services __updateTableListentries__ to change the content of these columns:
- highscoremode
- gradesystem
- moment
- entryname
- kind
- link
- visible
- comments
- groupKind
- feedbackenabled
- feedbackquestion

Uses service __insertIntoTableList__ to makes _inserts_ into the table __list__.

<br>

---

<br>

### updateQuizDeadline
Uses the services __updateTableQuiz__ to change the content of these columns:
- deadline
- relativedeadline

<br>

---

<br>

### updateListentriesGradesystem
Uses the services __updateTableListentries__ to change the content of these columns:
- gradesystem



<br>

---

<br>


### updateCourseVersion_sectioned
Uses the services __updateTableVers__ to change the content of these columns:
- motd

Uses the services __updateTableVers__ to change the content of these columns:
- versname
- startdate
- enddate

Uses the services __setActiveCourseVersion__ to change the content of these columns:
- activeversion

<br>

---

<br>

### changeActiveCourseVersion_sectioned    
Uses the services __setActiveCourseVersion__ to change the content of these columns:
- activeversion

<br>

---

<br>

### setVisibleListentrie
(writers comment: These both do the same thing, i would sugest combining them and use if cases instead.)
<br>

#### changeVisibleHidden
Uses the services __updateTableListentries__ to change the content of these columns:
- visible
#### changeVisiblePublic
Uses the services __updateTableListentries__ to change the content of these columns:
- visible


<br>

---

<br>

### getCourseVersions
Uses service __selectFromTableVers__ to _get_ information it requires from __vers__.

<br>

---

<br>

### getGitReference (this is a TEMP name, dont really know what the point of this "service" is yet )
This service creates an array containing values from the column downloadeURL in the database found here "../../githubMetadata/metadata2.db"
Uses service __selectFromTableBox__ to _get_ information it requires from __box__.
Uses service __selectFromTableCodeexample__ to _get_ information it requires from __codeexample__.
Uses service __selectFromTableGitFiles__ to _get_ information it requires from __gitFiles__.

<br>

---

<br>

### createGithubCodeexample
Uses service __selectFromTableCodeexample__ to _get_ information it requires from __codeexample__.
Uses service __selectFromTableCourse__ to _get_ information it requires from __course__.
Uses service __selectFromTableListentries__ to _get_ information it requires from __listentries__.
<br>

Uses service __createNewCodeexample__ to makes _inserts_ into the table __codeexample__.
Uses service __createNewListentrie__ to makes _inserts_ into the table __listentries__.


<br>

---

<br>

### getUserDuggaFeedback
<br>

Retrives all information
Uses service __selectFromTableUserduggafeedback__ to _get_ information it requires from __userduggafeedback__.
<br>

Retrives the average score
Uses service __selectFromTableUserduggafeedback__ to _get_ information it requires from __userduggafeedback__.

<br>

---

<br>

### getDeletedListentries
Retrives all removed (but not delited from db) listentries
Uses service __selectFromTableListentries__ to _get_ information it requires from __listentries__.

<br>
<br>
<br>

---
## ------------------------------------ _profileservice_ -----------------------------
---

<br>
<br>
profileService - handles password changes and challenge question

### changeProfileValues    
(writter comment: i think this service is small enough as is )
<br>

Uses service __selectFromTableUser__ to _get_ information it requires from __user__.
Uses service __selectFromTableUser_course__ to _get_ information it requires from __user_course__.
<br>

Statements below are methods for _changeProfileValues_ and not services.

#### updateSecurityQuestion
Uses service __selectFromTableUser__ to _get_ information it requires from __user__.

#### updatePassword
Uses service __updateUserPassword__ to _get_ information it requires from __user__.

<br>
<br>
<br>

---
## ------------------------------------ _resultedservice_ -----------------------------
---

<br>
<br>

### getUserAnswar  
(writers comment: this service is small enough as is)
<br>

Uses service __selectFromTableUserAnswar__ to _get_ information it requires from __userAnswer__.
Uses service __selectFromTableListentries__ to _get_ information it requires from __Listentries__.

<br>
<br>
<br>

---
## ------------------------------------ _showDuggaservice_ -----------------------------
---

<br>
<br>

### updateActiveUsers
Collect active users
Uses service __selectFromTableUserAnswar__ to _get_ information it requires from __userAnswer__.
<br>

Uses service __insertIntoTableGroupdugga__ to makes _inserts_ into the table __groupdugga__.
Uses the services __updateTableGroupdugga__ to change the content of these columns:
- active_users

<br>

---

<br>

### processDuggaFile
Search with __hash__
Uses service __selectFromTableSubmission__ to _get_ information it requires from __submission__.
<br>
If no match on _hash_, retreive all submissions
Uses service __selectFromTableSubmission__ to _get_ information it requires from __submission__.

<br>

---

<br>

### submitDugga
Get submission based on __hash__.
Uses service __selectFromTableUserAnswer__ to _get_ information it requires from __userAnswer__.
<br>

These are not services but __methods__. 
#### updateUserAnswer
Uses the services __updateTableUserAnswer__ to change the content of these columns:
- useranswer
- timesSubmitted

#### createUserAnswer
Uses service __insertIntoTableUserAnswer__ to makes _inserts_ into the table __userAnswer__.

<br>

---

<br>

### loadDugga
Get information based on __hash__.
Uses service __selectFromTableUserAnswer__ to _get_ information it requires from __userAnswer__ and __variant__.
<br>

If _hash_ did not work, retrive all answeres for that __moment__. 
Uses service __selectFromUserAnswer__ to _get_ information it requires from __userAnswer__ and __variant__.

