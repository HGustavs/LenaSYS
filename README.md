LenaSYS
==============

University of Skövde Code Viewer and Course Organization System

# Install Instructions

To install LenaSYS on your computer, you first need to install XAMPP or Docker.

## How to Install Docker

### Docker installation instructions

1. Press this link: [docker desktop](https://www.docker.com/products/docker-desktop/).

2. On the Docker website press `Choose plan`-button.
<img src="Shared/Documentation/docker_images/homepage.png" width="512">

3. Choose: Docker Personal.
<img src="Shared/Documentation/docker_images/choosePlan.png" width="512">

4. Press `Continue with GitHub`-button.
<img src="Shared/Documentation/docker_images/createAccount.png" width="512">

5. Sign in with your school-email and password.
<img src="Shared/Documentation/docker_images/github.png" width="512">

6. Now that you are in Docker Home, press the `Go to download`-button. 
<img src="Shared/Documentation/docker_images/docker_home.png" width="512">

7. Select which operating software (OS) that you are using.
<img src="Shared/Documentation/docker_images/os.png" width="512">

8. When you have selected your OS and installed the installer accordingly, follow the installation steps and then open the Docker desktop program/app.

9. Congratulations, you have installed Docker desktop! If your account doesn't appear in Docker desktop, sign in with your GitHub account.
<img src="Shared/Documentation/docker_images/dockerDesktop.png" width="512">

### Run containers in Docker
Once you have installed Docker desktop, you can run Docker containers, but first you need to get a LenaSYS repository.

1. Open your terminal which can be bash, powershell or command. You can also use vscode terminal. 

2. When you have opened the terminal, change directory to where you want the LenaSYS repository. To do that you need to type `cd path/to/folder`. When using Windows I typed: `cd  .\Downloads\`  if you use a different OS then type: `cd <foldername>\`. 
<img src="Shared/Documentation/docker_images/terminal.png" width="512">

3. When you have chosen a folder, type this command: `git clone https://github.com/HGustavs/LenaSYS.git` and wait for the download to finish. When done you will have the LenaSYS repository.
<img src="Shared/Documentation/docker_images/terminal2.png" width="512">

4. Now you have the LenaSYS repository, so you need to access the new directory in the terminal by typing: `cd LenaSYS/dockerenv/`.
<img src="Shared/Documentation/docker_images/terminal3.png" width="512">

5. Here you need to build a few images and containers, and to do that run the command for Windows: `docker-compose up --build`
or macOS: `docker compose up --build`.
NOTE: You need to keep open Docker desktop program/app and do not turn off, otherwise this command will show an error and will not work.
<img src="Shared/Documentation/docker_images/terminal4.png" width="512">

6. Docker has finished building images and containers when the terminal stops printing out or/and shows a blue apache-php name. NOTE: Do not close down the terminal while docker is running, otherwise containers will shutdown.
<img src="Shared/Documentation/docker_images/terminal5.png" width="512">

7. Now go to Docker desktop and you can see a menu which says images and containers. Press the containers from the menu and here you can see there are three containers and each one has green-circle which means they are running. If you can not see three containers, then you need to press `drop-down`-button
<img src="Shared/Documentation/docker_images/dockerContainers.png" width="512">

8. There are two ports which are apache-php and phpmyadmin server. The apache-php has a port `80:80` which can be clicked, this opens the LenaSYS website. The phpmyadmin also has a port `8080:80` which opens the phpmyadmin website. There you can manipulate sql-data, user permission and more. You need to press the `80:80` link to open the LenaSYS website.
<img src="Shared/Documentation/docker_images/apacheLink.png" width="512">

9. In order to download LenaSYS you need to navigate to `LenaSYS/newinstaller/installer.php` this will lead you to the new installer. In case the new installer does not work for you, you can access the old installer at `LenaSYS/install/install.php`.
<img src="Shared/Documentation/docker_images/lenasys.png" width="512">

10. Congratulations, you can now use the LenaSYS website!
<img src="Shared/Documentation/docker_images/newlenasysinstaller.png" width="512">

11. Before you install the LenaSYS, it is good to know that the text-input which says `Hostname`, needs to be `db`, not `localhost` and you need check/turn on `Use Distributed Environment`-checkbox. Also when entering root user credentials, type in root user: `root` and root password: `password`, because all default values is set in docker-compose-yml.

12. To install the LenaSYS, you need to follow instructions for [new LenaSYS installer](Shared/Documentation/newinstaller/documentation.md/#installer-steps) or [old LenaSYS installer](README.md/#install-lenasys).

#### Using linux or mac?
Make sure you set the appropriate file permissions for LenaSYS. The easiest way to do this is to run the command `sudo chmod -R 777 LenaSYS`.
After changing the file permissions recursively over the repository, all the files may show up as changes. To fix this, run `git config core.fileMode false` in the root of the repository.

### Stop containers in Docker

1. To stop running containers, open the terminal where docker is running press `ctrl-c` and wait until all three containers says stopped. NOTE: If your terminal says all three are stopped, but your username does not appear in your terminal, then press the up- or down-arrow keys to show your username.
<img src="Shared/Documentation/docker_images/terminal6.png" width="512">

2. If you go back to Docker desktop and go to containers, you can see three containers are not running, shown by the gray circles. Now containers are not running.
<img src="Shared/Documentation/docker_images/containersdeactive.png" width="512">

### Remove containers and images in Docker

1. If you want remove all containers, then first stop running containers which you can follow this step [stop containers in Docker](#stop-containers-in-docker).

2. After that run the command: `docker-compose down` in the terminal.
<img src="Shared/Documentation/docker_images/terminal7.png" width="512">

3. Now your terminal says removed which means containers are removed.
<img src="Shared/Documentation/docker_images/terminal8.png" width="512">

4. You can check in Docker desktop and press containers. Here you can see that all containers are gone.
<img src="Shared/Documentation/docker_images/dockerContainers2.png" width="512">

5. To remove all images to free up space, you need to press images in Docker desktop and select all checkboxes. When all selected,  press `Delete`-button and it will show a pop-up if you want to delete, press `Delete forever`-button. Now you have successful removed all containers and images.
<img src="Shared/Documentation/docker_images/dockerimages.png" width="512">

### Stop running or pause Docker desktop
1. To stop running or pause Docker desktop you need to open Docker desktop press either `pause`-button to pause docker or `Quit Docker Desktop`-button to stop running docker. Now your Docker desktop is paused or stopped.
<img src="Shared/Documentation/docker_images/stopdocker.png" width="512">

---

## How to Install XAMPP

### 1. Download and Install XAMPP
- Go to the [Apache Friends website](https://www.apachefriends.org/) and download XAMPP to your workspace.
- Once downloaded, go to your **Downloads** folder and run the installer.

**macOS Specifics**
You may receive a warning saying Apple cannot verify that XAMPP is free from malware. To fix this:
  1. Go to **Settings** -> **Privacy & Security**.
  2. Select **Open Anyway**.

### 2. XAMPP Setup Wizard
- **Select Components**: Select **XAMPP Developer Files**.
- Wait for XAMPP to install. This may take a few minutes.

<img src="Shared/Documentation/Install/installXAMPP.png" width="512">


### 3. Locate the XAMPP Folder
- Find the XAMPP folder on your computer.

### 4. Download LenaSYS
- Go to the [LenaSYS GitHub Repository](https://github.com/HGustavs/LenaSYS).
- Clone the repository by clicking on the green **Code** button and selecting **Download ZIP**.

### 5. Extract and Rename the Folder
- Extract the ZIP file.
- Rename the folder to **LenaSYS**.

### 6. Move LenaSYS to XAMPP's `htdocs` Folder
- Move the **LenaSYS** folder to the **htdocs** folder inside your XAMPP directory (e.g., `/XAMPP/xamppfiles/htdocs`).

### 7. Configure Apache
- The default Apache configuration is usually fine for LenaSYS.

### 8. Configure PHP
1. Open the PHP configuration file `php.ini` located at:  
   `/XAMPP/xamppfiles/etc/php.ini`
   
2. Modify the following settings:
   - Change the `upload_max_filesize` to `128M`.

3. Enable the necessary PHP drivers by uncommenting the following lines (or adding them manually if not present):
   ```ini
    extension=php_pdo.dll
    extension=php_pdo_mysql.dll
    extension=php_pdo_odbc.dll
    extension=php_pdo_sqlite.dll
   ```

**macOS Specifics**
- On Mac, you need to set extra permissions on the folder `xamppfiles`. 
- To do this:
  1. Right-click on the `xamppfiles` folder and select **Get Info** (or press `Cmd + I`).
  2. Under **Sharing & Permissions**, make sure to select **Read & Write** for the appropriate user (www_).

# Install LenaSYS
Make sure you have a working install of apache2 and other needed packages. Look at the wiki page for this at [Configuring web server for LenaSYS installation](https://github.com/HGustavs/LenaSYS/wiki/Configuring-web-server-for-LenaSYS-installation) for further information.



To install a fresh copy of LenaSYS on your system an installer has been created called 'install.php'.
This installer is located in the LenaSYS directory.
What the installer will do is help you create a new user in the MySQL database and a new database and fill it with some test data (if desired) to help you get started.

**1. To start the installation, put the LenaSYS directory at the place you want the system located.**

**2. When the the directory is in the right place, go to the installer from a web browser of your choosing.**

**3. Set permissions for Apache.**

<img src="Shared/Documentation/Install/Install_warning.png" width="512">

* The first thing you will have to do is set permissions for Apache. Notice that this popup will only show for Linux and Mac (Darwin) based systems. No * permissions are by default needed for Windows.

**4. Database credentials used by the system**

<img src="Shared/Documentation/Install/Install_1.png" width="512">

* In the first field you will need to provide the desired username to be used in the database.
* A password for this user will be needed for identification when logging in to the database later. This will need to be filled in the next field.
* Provide the name of the database you want to use. You can use an existing database here and choose later if you want to write over it. If you dont want to write over you will need to provide a unique name.
* For hostname you will need to provide the name of the host the database is located on (standard is localhost/127.0.0.1).

## 5. Database credentials for installer
<img src="Shared/Documentation/Install/Install_2.png" width="512">

* You will need to enter the credentials for root access (to get this - ask someone that have knowledge of this information).

## 6. Database creation
<img src="Shared/Documentation/Install/Install_3.png" width="512">

* The last step is to fill the three boxes. The upper box should be checked if a new database with the provided name should be created (this will only initialize a new database for the site and create empty tables to hold information).
* If the created database should be filled with some test data (this includes some courses, users, etc.). This can be used to easily test the new installation of the system. 
* The demo-page which can be included consist of all currently available duggas.

## 7. Database overwrite
<img src="Shared/Documentation/Install/Install_4.png" width="512">

* The box should be checked if you provided an existing database or/and user and wish to overwrite this. (**WARNING! THIS WILL DESTROY ALL PREVIOUS INFORMATION IN THIS DATABASE**).

* There is also an option to run the installer as an transaction. If something goes wrong this can be unticked to find the exact SQL-query that's causing trouble.

## 8. Installation start
<img src="Shared/Documentation/Install/Install_5.png" width="512">

* When everything is filled, press 'Install!'.


## 9. Installation finished
* The installer will automatically create all you need and fill the new database with data (if this was selected). If the first rows of the installation progress are GREEN (successull messages) it means everything was successfull and you will not need to do any further investigation.
* If you get error-messages (RED) that tells you something has failed - please check what went wrong and try again. A common error is that the creation of database or user failed because they already exist in the database (and you did not check the box that writes over the existing one).
* If you get other error messages (with weird exceptions and such) this will probably mean that connection failed (the hostname is incorrect or unavailable) or the root credentials were wrong. Please look this information up and try again;

## 10. The installer will, after successful creation of database, tell you what to do next.
<img src="Shared/Documentation/Install/Install_6.png" width="512">



**The installation should now be completed and the website should be linked to the database.**
#### CONGRATULATIONS!

## 11. Handling possible remaining errors
If LenaSYS is still not functional, possible errors may be found in \apache2\logs. It is very possible that the installer promts you to change upload_max_filesize in ini.php. Make sure that the webserver is restarted after any changes to php.ini. Another issue commonly encountered is ": PHP Fatal error: Uncaught PDOException:could not find driver...". To solve this, enbale the following drivers in the ini.php file by uncommenting them: php_pdo.dll, php_pdo_mysql.dll, php_pdo_odbc.dll and php_pdo_sqlite.dll.

## To get ZIP-ARCHIVE to work(used in download zip function)
* If the zip function to work your server needs to have to zip plugin installed and activated.
  on linux you need to do:
  sudo apt-get install php7.2-zip (if the server is running a different php install the right version or ZIP-ARCHIVE)
  sudo /etc/init.d/apache2 restart

* for windows: should be built in to php. please google ZIP-ARCHIVE if it still don't work.

* The you need to give the LenaSYS directory enough permissions to read and write for this you can do "chmod -R 777 *folder*" 

# Push notifications installation

**Note:** For the push notification system to work the server needs to use https, so make sure that is set up and valid.

To set up https, look at the guide on this wiki page: [Getting a free ssl certificate and installing it when not having access to port 80](https://github.com/HGustavs/LenaSYS/wiki/Getting-a-free-ssl-certificate-and-installing-it-when-not-having-access-to-port-80)

**Note:** Only install if there is no other push notifications installation on the system already, if an installation already exists follow the guide further below for instructions for that.

1. To install the push notification subsystem first the following packages needs to be installed. The following commands assume the system is using php version 7.0. If you use another version, change all the 7.0 in the command below to the php version on your system and run the following command:

```BASH
sudo apt-get install php7.0-curl php7.0-gmp php7.0-mbstring
```

2. Install composer in your LenaSYS folder ( https://getcomposer.org/ )

3. Go into the LenaSYS folder run the following command. This command will download all the packages listed in the 'composer.json' file and download them to the 'vendor/' folder.

```BASH
php composer.phar install
```

4. Now open the 'coursesyspw.php' file created earlier during the initial installation of LenaSYS. The following settings need to be added in the bottom part of the file:

```PHP
define("PUSH_NOTIFICATIONS_VAPID_PUBLIC_KEY", "Insert your public key here");
define("PUSH_NOTIFICATIONS_VAPID_PRIVATE_KEY", "Insert your private key here");
define("PUSH_NOTIFICATIONS_VAPID_EMAIL", "Insert your email address here");
```

If you do not have a private and public key already, you can use the tool at /DuggaSys/pushnotifications.php?action=genkeys to generate keys locally for usage. You need to be logged in as an administrator in LenaSys to use the tool. These keys should be shared to every installation on the same server.


## Copying a push notifications installation if it was already installed before

If another installation of LenaSys has push notification installed it is much simpler to copy that.

1. Find another installation of LenaSys with push notifications installed. In the following steps we will assume an installation exists at /[groupname]/[username]/LenaSYS

2. Copy the folder vendor/ from /[groupname]/[username]/LenaSYS to /[groupname]/[**YOUR**username]/LenaSYS

3. Open the file /[groupname]/[username]/coursesyspw.php and locate the rows containing code like this

```PHP
define("PUSH_NOTIFICATIONS_VAPID_PUBLIC_KEY", "Insert your public key here");
define("PUSH_NOTIFICATIONS_VAPID_PRIVATE_KEY", "Insert your private key here");
define("PUSH_NOTIFICATIONS_VAPID_EMAIL", "Insert your email address here");
```

4. Copy that code from that file into /[groupname]/[**YOUR**username]/LenaSYS/coursesyspw.php
