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

# Add LenaSYS folder to username and www-data group recursively
echo "Beginning to add LenaSYS to your username and www-data group..."
sudo chown -R "$USER":www-data ../../LenaSYS

# Change permissions of LenaSYS to 777
echo "Beginning to change permissions of LenaSYS to 777..."
sudo chmod -R 777 ../../LenaSYS/

# Prevent Git from showing the file permission changes
git config core.fileMode false

# start building Docker
docker compose up --build