This is a guide on how to install a local database for testing of contribution\*-files. It is not recommended that you push your local database to the master(main) branch, it should only be on your local version of LenaSYS on your local machine.

As of 28/05/2025 in the github repository there is a folder named ‘test\_contribution’, in it is a sql file named ‘test\_database.sql’.

This file is made for testing contribution.php and its associated functionality.

The sql-file is filled with data, mainly about contributions made by HGustavs and a97marbr.

### **\#\# How to make it work with the current system** 

You need to convert the sql-file to db-format. This can be done by:

- downloading the sql file  
- open it with MySQL  
- file \> save script as...  
- name the file ‘BGHdata\_2021\_05.db’  
- save as type ‘All Files (\*.\*)’  
- put the db-file in your local htdocs folder

Now when you access contribution.php there will be data to load\!

### **\#\# How to put in your own data in the database**

If you for some reason want to add your own data for testing in the database, the easiest way to do this is to modify the sql-file, ‘test\_database.sql’, before converting it to a db.

The tables available for putting in data:

- commitgit(id INTEGER PRIMARY KEY,cid VARCHAR(40) NOT NULL UNIQUE,p1id VARCHAR(40),p2id VARCHAR(40),author VARCHAR(32),thedate TIMESTAMP, space INTEGER, thetime TIMESTAMP, thetimed INTEGER, thetimeh INTEGER,message TEXT);  
- Bfile (id INTEGER PRIMARY KEY, purl TEXT, path TEXT, filename VARCHAR(256), filesize REAL, filelines INTEGER, harvestdate TIMESTAMP, gittag VARCHAR(16), courseyear VARCHAR(8));  
- Blame (id INTEGER PRIMARY KEY, blamedate TIMESTAMP, blameuser VARCHAR(32), href VARCHAR(64),mess TEXT, rowcnt INTEGER, fileid INTEGER, gittag VARCHAR(16), courseyear VARCHAR(8));  
- CodeRow(id INTEGER PRIMARY KEY, fileid INTEGER, blameid INTEGER, blameuser VARCHAR(32), rowno INTEGER, code TEXT, gittag VARCHAR(16), courseyear VARCHAR(8),cid VARCHAR(40));  
- issue (id INTEGER PRIMARY KEY,issueno VARCHAR(8), issuetime TIMESTAMP, issuetimed INTEGER, issuetimeh INTEGER, author VARCHAR(32), state VARCHAR(32), title TEXT, message TEXT);  
- event (id INTEGER PRIMARY KEY,issueno VARCHAR(8), eventtime TIMESTAMP,eventtimed INTEGER, eventtimeh INTEGER, author VARCHAR(32), kind VARCHAR(32), content TEXT, aux TEXT);
