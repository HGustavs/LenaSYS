#!/bin/bash

# Make sure that coursesyspw.php exists before Docker mounts it
if [ ! -f ./coursesyspw.php ]; then
  echo "Creating coursesyspw.php from template"
  cp ./coursesyspw.php.template ./coursesyspw.php
fi

# start building Docker
docker compose up --build