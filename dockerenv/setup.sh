#!/bin/bash

# Exit this script if an error ocuur
set -e

# Make sure metadata folder exists
mkdir -p ./githubMetadata

# Make sure that coursesyspw.php exists before Docker mounts it
if [ ! -f ./coursesyspw.php ]; then
  echo "Creating coursesyspw.php from template"
  cp ./coursesyspw.php.template ./coursesyspw.php
fi

# Add this user to www-data group if not exists
if ! id -nG "$USER" | grep -qw "www-data"; then
  echo "Beginning to add $USER to www-data group (you may need to logout/login)..."
  sudo usermod -aG www-data "$USER"
fi

# Set appropriate user rights
sudo chown -R www-data:www-data ./githubMetadata
sudo chown www-data:www-data ./coursesyspw.php
sudo chmod -R 777 ../../LenaSYS/

# Prevent showing changing the file permissions recursively
git config core.fileMode false

# start building Docker
docker compose up --build