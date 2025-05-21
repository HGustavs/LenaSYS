@echo off

REM Make sure that coursesyspw.php exists before Docker mounts it
IF NOT EXIST coursesyspw.php (
  echo Creating coursesyspw.php from template
  copy coursesyspw.php.template coursesyspw.php
)

REM start building Docker
docker compose up --build