#!/bin/bash

# Add user and group if not exists
if ! id "www-data" &>/dev/null; then
    groupadd -g 33 www-data
    useradd -u 33 -g www-data -s /bin/false www-data
fi

chown www-data:1000 /var/www/html/coursesyspw.php
mkdir /var/www/html/githubMetadata
chown -R www-data:www-data /var/www/html/githubMetadata

git config core.fileMode false

# Execute the main container command
exec "$@"