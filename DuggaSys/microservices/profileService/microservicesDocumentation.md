updateSecurityQuestion_ms.php:

Purpose:

Is the microservices that is used for updating or setting a security question for an account on LenaSys. This is accessed on LenaSys if you are logged in and click your name in the top right (Teachers cannot change security question). Originally this service was from profileservice.php but that file was split up into 3 microservices in the folder profileService.

The ms checks if the user is logged in and retrieves password. It then checks if the typed in password is correct before allowing you to set or update security question.