LenaSYS
==============

University of Skövde Code Viewer and Course Organization System

# Install instructions
==============

To install a fresh copy of LenaSYS on your system an installes has been created called 'install.php'.
This installer is located in the LenaSYS directory.
What the installer will do is to help you create a new user in the MySQL database and a new database and fill it with some test data (if desired) to help you get started. It will also guide you through the steps necessary to link LenaSYS to this newly created database and get it running. 

1. To start the installation, put the LenaSYS directory at the place you want the system located. 
2. When the the directory is in the right place, go to the installer from a web browser of your choosing.
3. On this page you will have to fill out 6 fields (NOTHING CAN BE LEFT EMPTY).
  1. In the first field you will need to provide the desired name to be used in the database.
  2. A password for this user will be needed for identification when logging in to the database later.
  3. Provide the name of the database you want to use. You can use an existing database here but the installer wont be able to create a new one, thus you will preferably need to provide a unique name.
  4. For hostname you will need to provide the name of the host the database is located on (standard is localhost).
  5. In the upper right two fields you will need to enter the credentials for root access (to get this - ask someone that have knowledge of this information).
  6. The last step is to fill the two boxes. The upper box should be checked if a new database with the provided name should be created (this will only initialize a new database for the site and create empty tables to hold information). 
  7. The second box should be checked if the created database should be filled with some test data (this includes some courses, users, etc.). This can be used to easily test the new installation of the system.
4. When everything is filled, press 'Install!'.
5. The installer will automatically create all you need and fill the new database with data (if this was selected). If the first 5 rows of the installation progress are GREEN (successull messages) it means everything was successfull and you will not need to do any further investigation.
  1. If you get error-messages (RED) that tells you something has failed - please check what went wrong and try again. A common error is that the creation of database or user failed because they already exist in the database.
  2. If you get other error messages (with weird exceptions and such) this will probably mean that connection failed (the hostname is incorrect or unavailable) or the root credentials were wrong. Please look this information up and try again.
6. There are three more steps to complete for the installation to be successful. The installer will, after successful creation of database, tell you what to do next but this will be explained here too.
  1. You will need to create a file named 'coursesyspw.php' outside the root directory of LenaSYS. If LenaSYS is located at /var/www/html/LenaSYS/ you will need to create this file at /var/www/html/ (NOT IN THE LENASYS CATALOG). In this file you will need to paste the code provided in the installer after installation. This code is:

```PHP
        <?php
        define("DB_USER","enter_user_here");
        define("DB_PASSWORD","enter_password_here");
        define("DB_HOST","enter_hostname_here");
        define("DB_NAME","enter_database_here");
        ?>
```

   enter_user_here = The username you provided as the new user.
   enter_password_here = The password you provided for this user.
   enter_hostname_here = The hostname you provided (where the databae is located, probably localhost).
   enter_database_here = The name of the new database you provided. IF you are using an old database (you did not create a new one) enter the database you wish to use here.
  2. When this file is created and filled create a new directory at the same location as the file you just created (NOT IN THE LENASYS DIRECTORY; ONE LEVEL UP). Call this directory 'log'.
  3. Give the folder 'log' full permissions (in unix run the command chmod 777 log).
  4. Inside the log directory create a new sqlite database. Enter 'log' and run the command sqlite3 loglena4.db. IT IS IMPORTANT TO USE THE NAME loglena4.db OR ELSE IT WONT WORK.
  5. Set full permissions on this file also with the command chmod 777 loglena4.db.



The installation should now be completed and the website should be linked to the database.
CONGRATULATIONS!

