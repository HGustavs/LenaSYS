FROM php:8.0-apache

# Update package list and install system dependencies required for PHP extensions
RUN apt-get update && \
    apt-get install -y \
    libaio1 \
    git \
    libsqlite3-dev \
    libcurl4-openssl-dev \
    && docker-php-ext-install pdo_mysql pdo_sqlite curl \
    && rm -rf /var/lib/apt/lists/*

# Increase PHP upload size
RUN { \
        echo 'upload_max_filesize=128M'; \
        echo 'post_max_size=128M'; \
    } > /usr/local/etc/php/conf.d/uploads.ini

# Enable Apache Directory Listing
RUN a2enmod autoindex
RUN echo '<Directory /var/www/html>' > /etc/apache2/conf-available/custom-directory-listing.conf \
    && echo '    Options Indexes FollowSymLinks' >> /etc/apache2/conf-available/custom-directory-listing.conf \
    && echo '    AllowOverride None' >> /etc/apache2/conf-available/custom-directory-listing.conf \
    && echo '    Require all granted' >> /etc/apache2/conf-available/custom-directory-listing.conf \
    && echo '</Directory>' >> /etc/apache2/conf-available/custom-directory-listing.conf \
    && a2enconf custom-directory-listing

# Copy the initialization script
COPY ./init.sh /usr/local/bin/init.sh

# Make sure the script is executable
RUN chmod +x /usr/local/bin/init.sh
RUN sed -i 's/\r$//' /usr/local/bin/init.sh

# Set the script as the entrypoint
ENTRYPOINT [ "/usr/local/bin/init.sh" ]

# Default command
CMD [ "apache2-foreground" ]
