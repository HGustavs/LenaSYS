retrieveProfileService_ms.php:

Purpose:

Creates and returns an array with variables $success, $status and $debug and passes it to the two microservices.


updateSecurityQuestion_ms.php:

Purpose:

Is the microservices that is used for updating or setting a security question for an account on LenaSys. This is accessed on LenaSys if you are logged in and click your name in the top right (Teachers cannot change security question). Originally this service was from profileservice.php but that file was split up into 3 microservices in the folder profileService.

The ms checks if the user is logged in and retrieves password. It then checks if the typed in password is correct before allowing you to set or update security question.


updateUserPassword_ms.php

Purpose: 

This microservice comes from the file profileservice.php and the purpose is to take all the code that is related to changing the password for a user and making it into a microservice.

It is not possible for a teacher to change password, only for regular users such as students.

The microservice retrieves the uid (user id) and then checks if it is a super user with the function checklogin. There is also the logServiceEvent function which logs if a user changes password. The user has to write the old password in order to change to a new one that is why the function password_verify is included. The sql query inserts the new password into the database for that particular user id.
