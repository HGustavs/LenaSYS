We chose to put the canvas inside our G1 project folder since it was part of our group project. You may choose yourself  where it is placed. We have marked our own place in bold so these parts are what you would need to change to your place.


Download Canvas
cd /var/www/project-g1.webug.his.se/public_html
sudo git clone https://github.com/instructure/canvas-lms.git canvas
sudo git checkout stable

Create a virtual host for canvas
cd /etc/apache2/sites-available/
sudo cp 000-default.conf canvas.webug.his.se.conf
sudo nano canvas.webug.his.se.conf