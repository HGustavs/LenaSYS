#!/bin/bash

mkdir -p ./githubMetadata

# Make sure that coursesyspw.php exists before Docker mounts it
if [ ! -f ./coursesyspw.php ]; then
  echo "Creating coursesyspw.php from template"
  cp ./coursesyspw.php.template ./coursesyspw.php
fi

# Add user and group if not exists
if ! id "www-data" &>/dev/null; then
  sudo groupadd -g 33 www-data
  sudo useradd -u 33 -g www-data -s /bin/false www-data
fi

# Set appropriate user rights
sudo chown -R www-data:www-data ./githubMetadata
sudo chown www-data:www-data ./coursesyspw.php
sudo chmod -R 777 ../../LenaSYS/

# Prevent showing changing the file permissions recursively
git config core.fileMode false

# start building Docker
docker compose up --build