FROM php:8.0-apache

# Update package list and install system dependencies required for PHP extensions
RUN apt-get update && \
    apt-get install -y \
    libaio1 \
    git \
    libsqlite3-dev \
    libcurl4-openssl-dev \
    libzip-dev \
    zip \
    && docker-php-ext-install pdo_mysql pdo_sqlite curl zip posix \
    && rm -rf /var/lib/apt/lists/*

# Increase PHP upload size
RUN { \
        echo 'upload_max_filesize=128M'; \
        echo 'post_max_size=128M'; \
    } > /usr/local/etc/php/conf.d/uploads.ini

# Create a custom configuration to control access to specific directories and files
RUN { \
    echo '<Directory /var/www/html/LenaSYS/dockerenv>'; \
    echo '    Require all denied'; \
    echo '</Directory>'; \
    echo '<Directory /var/www/html/githubMetadata>'; \
    echo '    Require all denied'; \
    echo '</Directory>'; \
    echo '<Directory /var/www/html>'; \
    echo '    <Files "coursesyspw.php">'; \
    echo '        Require all denied'; \
    echo '    </Files>'; \
    echo '</Directory>'; \
} > /etc/apache2/conf-available/restricted-access.conf \
    && a2enconf restricted-access

# Enable Apache Directory Listing
RUN a2enmod autoindex
RUN echo '<Directory /var/www/html>' > /etc/apache2/conf-available/custom-directory-listing.conf \
    && echo '    Options Indexes FollowSymLinks' >> /etc/apache2/conf-available/custom-directory-listing.conf \
    && echo '    AllowOverride None' >> /etc/apache2/conf-available/custom-directory-listing.conf \
    && echo '    Require all granted' >> /etc/apache2/conf-available/custom-directory-listing.conf \
    && echo '</Directory>' >> /etc/apache2/conf-available/custom-directory-listing.conf \
    && a2enconf custom-directory-listing

RUN chown -R www-data:www-data /var/www/html/

# Copy the initialization script
COPY ./init.sh /usr/local/bin/init.sh

# Make sure the script is executable
RUN chmod +x /usr/local/bin/init.sh
RUN sed -i 's/\r$//' /usr/local/bin/init.sh

USER root

# Set the script as the entrypoint
ENTRYPOINT [ "/usr/local/bin/init.sh" ]

USER www-data

# Default command
CMD [ "apache2-foreground" ]
