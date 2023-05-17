profileservice-tests.txt



------------------------------------------------------------------
Row : 46 Check if it blocks teacher, send parameters as an teacher
------------------------------------------------------------------
-------------------------
Name : teacherBlockerTEST
-------------------------

*********
* pre-req:
********* 
pdoConnect();
session_start();

	$userid="1";		
 
*********
End pre-
********* 

send {
	$status = "teacher";
	$action = "password";
	$action = "challenge";
}

*********
Expected outputs-
********* 


-----------------------------------------
Row : 46 Check if methods work if student
-----------------------------------------
------------------------
Name : studentAccessTEST
------------------------

*********
* pre-req:
********* 
pdoConnect();
session_start();

	$userid='uid';

*********
End pre-
********* 


	send {	
		$status = "student";
		$action = "password";
		$action = "challenge";	
	}

*********
Expected outputs-
********* 


----------------------------------
Row 62: Check if passwords matches
----------------------------------


*********
* pre-req:
********* 

	$userid="uid";		
 
	send {
		$status = "student";
	}


*********
End pre-
********* 
	

	send {

		$password = "Kong";
		$result = "Kong"; 	
	}

*********
Expected outputs-
********* 
	

------------------------------------------------------------------------
Row 64: Methods for changing challenge and passwords of a student user. 
------------------------------------------------------------------------

*********
* pre-req:
********* 
pdoConnect();


	$userid= 'uid'
	send {
		$status = "student";
	}
	
*********
End pre-
********* 


Sql-query: "UPDATE user SET securityquestion=:SQ, securityquestionanswer=:answer WHERE uid=:userid";

Sql-query: "UPDATE user SET password=:PW WHERE uid=:userid";


 
// Test as student user, check data in database. If password and challenge changed, it's correct.

*********
Expected outputs-
********* 