# SSL for XAMPP

## !IMPORTANT!
this is only relevant if your XAMPP installation does not come with an SSL-ready config.

to check, try to access __`https://localhost`__
If you get __Warning: Potential Security Risk Ahead__, you have SSL configured and you can use LenaSYS with HTTPS. (you get a warning because it is a self-signed certificate, it is fine to continue).

## Prerequisites

To follow this tutorial you need to have run __newinstaller__, or have your own SSL-cert and key. If the installation was successful, you should have these two files at the following path:
- _LenaSYS/newinstaller/tools/ssl/__localhost.crt___
- _LenaSYS/newinstaller/tools/ssl/__localhost.key___
These files are local to your system and are ignored by git.

## Step 1: configure Apache (httpd.conf)
In the XAMPP GUI, press the _Config_ button belonging to __Apache__, and open _httpd.conf_:
(_xampp/apache/conf/__httpd.conf___)

locate and uncomment the following lines:
``` 
LoadModule ssl_module modules/mod_ssl.so
Include conf/extra/httpd-ssl.conf
```
save the file

## Step 2: configure SSL (httpd-ssl.conf)
Next, open _httpd-ssl.conf_ the same way as before:
(_xampp/apache/conf/__httpd-ssl.conf___)

The XAMPP conf will have a bunch of comments, so you will need to locate the lines. Some lines should not need to change, e.g __SSLEngine on__ but it is good to check. 
Update the config to reflect the following:
(NOTE: you can not just copy it into the file, it will break the config)

```
Listen 443

<VirtualHost default:443>
    DocumentRoot "C:/xampp/htdocs"
    ServerName localhost:443
    ServerAdmin admin@localhost

    SSLEngine on

    SSLCertificateFile "$PATH_TO_LENASYS/newinstaller/tools/ssl/localhost.crt"
    SSLCertificateKeyFile "$PATH_TO_LENASYS/newinstaller/tools/ssl/localhost.key"

</VirtualHost>
```

## Final step: Restart Apache

restart apache and try to visit __`https://localhost`__
if it does not work, double check that all relevant lines are present and that the correct path to the .crt and .key is given.



