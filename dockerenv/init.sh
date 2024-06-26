#!/bin/bash

# Add user and group if not exists
if ! id "www-data" &>/dev/null; then
    groupadd -g 33 www-data
    useradd -u 33 -g www-data -s /bin/false www-data
fi

# Set appropriate user rights
umask 000
chown www-data:www-data /var/www/html/coursesyspw.php
mkdir /var/www/html/githubMetadata
chown www-data:www-data /var/www/html/LenaSYS
chown -R www-data:www-data /var/www/html/githubMetadata
chmod -R 777 /var/www/html

git config core.fileMode false

# Execute the main container command
exec "$@"