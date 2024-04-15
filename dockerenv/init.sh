#!/bin/bash

chown www-data:1000 /var/www/html/coursesyspw.php
mkdir /var/www/html/githubMetadata
chown -R www-data:www-data /var/www/html/githubMetadata

git config core.fileMode false

# Execute the main container command
exec "$@"