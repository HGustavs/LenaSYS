@echo off

REM Make sure that coursesyspw.php exists before Docker mounts it
IF NOT EXIST coursesyspw.php (
  echo Creating coursesyspw.php from template
  copy coursesyspw.php.template coursesyspw.php
)

REM start building Docker
docker compose up --build -d

REM Make sure the containers are running
echo Please wait a bit to make sure the containers are running
timeout /t 10

REM Run chown and chmod command in Apache container
echo Beginning to change ownership and permissions of html folder
docker exec -u root apache-php chown -R www-data:www-data /var/www/html/
docker exec -u root apache-php chmod -R 777 /var/www/html/

echo Now you can use the website!