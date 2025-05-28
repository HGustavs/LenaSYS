#!/bin/bash

# Check what type of the OS 
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    HTDOCS_DIR="/Applications/XAMPP/xamppfiles/htdocs"
    LENASYS_DIR="/Applications/XAMPP/xamppfiles/htdocs/LenaSYS"
    GROUP_CMD=(sudo dseditgroup -o edit -a "$USER" -t user daemon)
else
    # Linux
    HTDOCS_DIR="/opt/lampp/htdocs"
    LENASYS_DIR="/opt/lampp/htdocs/LenaSYS"
    GROUP_CMD=(sudo usermod -aG daemon "$USER")
fi

# If htdocs directory is null, then print error message, otherwise change the owner and permissions
if [ ! -d "$HTDOCS_DIR" ]; then
    echo "Couldn't find the 'htdocs' directory."
    echo "Are you running this from inside the XAMPP folder?"
    echo "Try: cd to your XAMPP folder located at LenaSYS/XAMPP and run this script again."
    exit 1
else
    # Change htdocs folder owner and permissions
    echo "Found htdocs and beginning to change htdocs folder owner and permissions"
    sudo chown daemon:daemon "$HTDOCS_DIR"
    sudo chmod -R 777 "$HTDOCS_DIR"
fi

# Add this user to daemon group if not exists
if ! id -nG "$USER" | grep -qw "daemon"; then
    echo "Beginning to add $USER to daemon group (you may need to logout/login)..."
    "${GROUP_CMD[@]}"
fi    

# If LenaSYS directory is null, then print error message, otherwise change the owner, permissions and prevent file permission changes
if [ ! -d "$LENASYS_DIR" ]; then
    echo "Couldn't find the 'LenaSYS' directory."
    echo "Are you running this from inside the XAMPP folder?"
    echo "Try: cd to your XAMPP folder located at LenaSYS/XAMPP and run this script again."
    exit 1
else
    # Add LenaSYS folder to username and daemon group recursively
    echo "Beginning to add LenaSYS to your username and daemon group..."
    sudo chown -R "$USER":daemon "$LENASYS_DIR"

    # Change permissions of LenaSYS to 777
    echo "Beginning to change permissions of LenaSYS to 777..."
    sudo chmod -R 777 "$LENASYS_DIR"

    # Prevent Git from showing the file permission changes
    cd "$LENASYS_DIR"
    git config core.fileMode false
fi

echo "Successfully change permissions of htdocs and LenaSYS"