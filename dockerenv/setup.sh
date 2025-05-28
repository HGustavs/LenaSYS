#!/bin/bash

# Exit this script if an error ocuur
set -e

# Check what type of the OS 
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  GROUP_CMD=(sudo dseditgroup -o edit -a "$USER" -t user _www)
  GROUP_NAME="_www"
  CHOWN_CMD=(sudo chown -R "$USER":_www ../../LenaSYS)
else
  # Linux  
  GROUP_CMD=(sudo usermod -aG www-data "$USER")
  GROUP_NAME="www-data"
  CHOWN_CMD=(sudo chown -R "$USER":www-data ../../LenaSYS)
fi

# Make sure metadata folder exists
mkdir -p ./githubMetadata

# Make sure that coursesyspw.php exists before Docker mounts it
if [ ! -f ./coursesyspw.php ]; then
  echo "Creating coursesyspw.php from template"
  cp ./coursesyspw.php.template ./coursesyspw.php
fi

# Add this user to www-data/_www group if not exists
if ! id -nG "$USER" | grep -qw "$GROUP_NAME"; then
  echo "Beginning to add $USER to $GROUP_NAME group (you may need to logout/login)..."
  "${GROUP_CMD[@]}"
fi

# Add LenaSYS folder to username and group recursively
echo "Changing ownership of LenaSYS to $USER:$GROUP_NAME..."
"${CHOWN_CMD[@]}"

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