As of now, microservices can not be tested by itself, but instead by replacing file path in the service file.
 
showDuggaService: Used in courseed.php to immplement functionality of duggor. A dugga can be shown by opening a course.




getShowDugga_ms.php: This PHP microservice is designed to retrieve and display information related to a specific "dugga" (quiz or assignment) in LenaSYS.
Output:
   JSON-encoded response containing the retrieved dugga information.


loadDugga_ms.php
Purpose:
This PHP microservice is designed to retrieve and display information related to a specific "dugga" (quiz or assignment) in LenaSYS.
Output: 
JSON-encoded response containing the retrieved dugga information.

processDuggaFile_ms.php: 
Purpose:
This PHP microservice retrieves all submissions related to a specific "dugga" (quiz or assignment) in a learning management system, processing the files and related information stored in the database.
Output:
An array of processed submission information, indexed by segment. Each entry contains detailed information about the submission, including file contents, feedback, metadata, and directory listings of zip files. If no files are found, an empty object is returned.

retrieveShowDuggaService_ms.php
Purpose:
The retrieveShowDuggaService function retrieves and processes detailed information about a specific "dugga" (quiz or assignment) based on various parameters such as hash, password, course ID, and user session data. It includes logic to handle different user roles (e.g., superusers, guests), validate submissions, and collect associated files and feedback for the dugga.
Output:
An associative array containing detailed information about the dugga

saveDugga_ms.php:
Purpose:
The microservice handles saving and updating user submissions (answers) for a specific "dugga" (quiz or assignment) in a learning management system. It validates user permissions, checks for existing submissions, and either updates the existing submission or inserts a new one. Additionally, it logs events and retrieves detailed information about the dugga.
Output:
An associative array containing the processed dugga information

updateActiveUsers_ms.php:
Purpose:
The microservice manages active user tracking for group duggas (quizzes or assignments) by updating the active user count based on a hash identifier. It either inserts a new record or updates an existing one, and retrieves detailed dugga information for further processing and display.

Output:
An associative array containing the processed dugga information