#!/bin/bash

# Exit this script if an error ocuur
set -e

# Check what type of the OS 
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  GROUP_CMD=(sudo dseditgroup -o edit -a "$USER" -t user _www)
else
  # Linux  
  GROUP_CMD=(sudo usermod -aG www-data "$USER")
fi

# Make sure metadata folder exists
mkdir -p ./githubMetadata

# Make sure that coursesyspw.php exists before Docker mounts it
if [ ! -f ./coursesyspw.php ]; then
  echo "Creating coursesyspw.php from template"
  cp ./coursesyspw.php.template ./coursesyspw.php
fi

# Add this user to www-data group if not exists
if ! id -nG "$USER" | grep -qw "www-data"; then
  echo "Beginning to add $USER to www-data or _www for macOS group (you may need to logout/login)..."
  "${GROUP_CMD[@]}"
fi

# Add LenaSYS folder to username and www-data group recursively
echo "Beginning to add LenaSYS to your username and www-data group..."
sudo chown -R "$USER":www-data ../../LenaSYS

# Change permissions of LenaSYS to 777
echo "Beginning to change permissions of LenaSYS to 777..."
sudo chmod -R 777 ../../LenaSYS/

# Prevent Git from showing the file permission changes
git config core.fileMode false

# Start building Docker
echo "Beginning to build and start containers..."
docker compose build \
  --build-arg USER_ID=$(id -u) \
  --build-arg USER_NAME=$USER

docker compose up