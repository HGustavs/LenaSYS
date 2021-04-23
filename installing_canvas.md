# Canvas
 
## Targeted OS
This guide is written for ubuntu server v20

# Prerequisites 
Canvas need several libraries to be installed on Ubuntu. Some are even not available any longer on the regular apt-get command. So custom libraries are needed to get them. The needed libraries to date (15/04-21) are the following ruby2.6, ruby2.6-dev, postgresql, zlib1g-dev, libxml2-dev, libsqlite3-dev, ibpq-dev, libxmlsec1-dev, curl and lastly build-essential.

It’s possible that the requirements may change in the near future as Ruby2.6 is on EOL. 

### $USER not working
$USER seems not to work correctly on Ubuntu v20, The idea behind $USER is that the current user should get elevated privileges when creating/modifying the database. This did not occur when testing the code for Ubuntu v20 so a solution for this is to replace $USER with the account name.

## Commands
<pre>
sudo apt-get install software-properties-common
sudo apt-add-repository ppa:brightbox/ruby-ng
sudo apt-get update
sudo apt-get install ruby2.6 ruby2.6-dev postgresql zlib1g-dev libxml2-dev libsqlite3-dev libpq-dev libxmlsec1-dev curl build-essential
</pre>
<pre>
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs 
sudo npm install -g npm@latest
</pre>
<pre>
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
sudo echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn
sudo yarn set version 1.19.1
</pre>
<pre>
sudo -u postgres createuser <b>$USER</b>
sudo -u postgres psql -c "alter user <b>$USER</b> with superuser" postgres
sudo gem install bundler -v 2.2.11
</pre>

# Setup Canvas
## Installing Canvas
We chose to put the canvas inside our G1 project folder since it was part of our group project. You may choose yourself  where it is placed. We have marked our own place in bold so these parts are what you would need to change to your place.

## Download Canvas
The easiest way to download canvas is to use the command git which requires the library git to be installed on the server.

### Installing git
You can download Git by using the apt-get command.

<pre>
sudo apt-get install git
</pre>

### Commands 
<pre>
cd <b>/var/www/project-g1.webug.his.se/public_html</b>
git clone https://github.com/instructure/canvas-lms.git canvas
cd canvas/
git checkout stable
</pre>

## Create a virtual host for canvas
Virtual host is a feature in apache that allows us to create subdomains. 000-default.conf comes pre configured with apache and can be used as the base when creating new subdomains.

### Commands
<pre>
cd /etc/apache2/sites-available/
sudo cp 000-default.conf <b>canvas.webug.his.se.conf</b>
sudo nano <b>canvas.webug.his.se.conf</b>
</pre>

### Change
<pre>
DocumentRoot <b>/var/www/project-g1.webug.his.se/public_html/canvas/</b>
</pre>
### Add
<pre>
serverName <b>canvas.webug.his.se</b>
</pre>
## Restart Apache2
For the changes to be implemented so does apache need to be restarted.
### Commands
<pre>
sudo systemctl restart apache2
</pre>





# Installing Canvas (Ubuntu)
Now that all libraries that canvas relies on are installed so is it possible to install canvas. 
Sadly however so is it possible that when installing canvas that the files do not have high enough privileges to conduct the installation correctly. In these cases it would be recommended to temporarily elevate the files read and write access in the canvas folder by using chmod -R 777 through the rest of installation. These should later be reverted to chmod -R 400 so that only the owner may access the files since some of these files contain passwords.

## Commands
<pre>
cd <b>/var/www/project-g1.webug.his.se/public_html/canvas</b>
bundle install --without pulsar
yarn install --pure-lockfile
yarn install --pure-lockfile
</pre>


## Configuring database
Here we will set up the database that is used by canvas and do some basic testing of the database. Remember that these commands should be done in the root of the canvas folder.

### Canvas default configuration (Remade script for ubuntu v20)

#### Commands
<pre>
for config in amazon_s3 delayed_jobs domain file_store outgoing_mail security external_migration
do 
cp -v config/$config.yml.example config/$config.yml
done
</pre>

### Unpacking database

#### Commands
<pre>
bundle exec rails canvas:compile_assets
</pre>

### Database configuration
Inorder to use the postgres database so are accounts needed. There may also be a need to create an account for root since the OS may be locked down in such a way that no other user may use postgres.

#### Commands
<pre>
cp config/database.yml.example config/database.ymlpostgres
createdb canvas_development
</pre>

### Installing database
Now it's time to install the database and setup the adminimistor account that will be your main account when handeling Canvas.
#### Commands
<pre>
bundle exec rails db:initial_setup
</pre>
#### During this setup it will ask you for...
E-mail:\
Password: \
Databasename:\
Share data with us:

### Test Data
Canvas have sadly not updated their scripts for test data to meet the latest versions of postgres. This has caused commands that they use to longer function properly since they rely on permissions that are no longer available. It’s possible to bypass this by temporarily removing database protection by setting the connection to trust on all. Then after installation is done revert them back to their original values. 

### Temporary remove protection
The file that needs to be changed is pg_hba.conf . This file may be located in different places depending on where the database is installed. So the easiest way to find where it lay is by searching for it. After it’s found, access it by sudo nano and temporarily change md5 and peer to trust thereafter revert it back once the installation is done. 

#### Commands
<pre>
sudo find / -type f -name pg_hba.conf
</pre>

### Commands
<pre>
psql -c 'CREATE USER canvas' -d postgres
psql -c 'ALTER USER canvas CREATEDB' -d postgres
createdb -U canvas canvas_test
psql -c 'GRANT ALL PRIVILEGES ON DATABASE canvas_test TO canvas' -d canvas_test
psql -c 'GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO canvas' -d canvas_test
psql -c 'GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO canvas' -d canvas_test
env RAILS_ENV=test bundle exec rails db:test:reset
</pre>

<pre>
sudo bundle exec rspec spec/models/assignment_spec.rb
</pre>


## Speed up canvas
This step is not required but will help with the loading speed of canvas since it allows the server to cache data which allows faster delivery. 

### Commands
<pre>
sudo apt-get update
sudo apt-get install redis-server
redis-server
echo -e "development:\n  cache_store: redis_store" > config/cache_store.yml
echo -e "development:\n  servers:\n  - redis://localhost" > config/redis.yml
</pre>

## Start Canvas (in background)
Rails server will be terminated if it’s running in the foreground when the ssh connection is terminated. So some extra methods are needed in order to keep the server running 24/7. We chose the screen since it’s already a component that is installed on ubuntu v20 and kinda easy to use for beginners. 


### Start a screen instance for canvas (local instance)
<pre>
screen -S canvas
</pre>

<pre>
cd <b>/var/www/project-g1.webug.his.se/public_html/canvas</b>
bundle exec rails server
</pre>

Exit screen by pressing ctrl + a then ctrl + d

### Remote instance
<pre>
screen -S canvas
</pre>

<pre>
cd <b>/var/www/project-g1.webug.his.se/public_html/canvas</b>
bundle exec rails server --binding=<b>MYIPADRESS</b>
</pre>

Exit screen by pressing ctrl + a then ctrl + d

### Return to last used screen
<pre>
screen -r
</pre>

### List screen 
<pre>
screen -list
</pre>

### Return to specific screen **XXXX**
<pre>
screen -r canvas
</pre>

