#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import time
import sys

def findOccurences(s, ch):
    return [i for i, letter in enumerate(s) if letter == ch]

installSourcePath = os.getcwd()
print("=== Installing LenaSYS ===")
print("Enter full path to where you want to install LenaSYS")
print("Make sure you have write permissions to that location.")
installPath = raw_input(">")
print(installPath)
if os.access(installPath, os.F_OK):
   print (installPath + " is a valid path.")
else:
   print (installPath + " is not valid!")
   sys.exit(2)
os.chdir(installPath) ## Makes life easier
print("Enter install directory or press enter for default value.")
installDir = raw_input("[lenasys]>")
if installDir == "":
   installDir = "lenasys"
try:
   os.mkdir(installDir)
except IOError as e:
   if e.errno == errno.EACCES:
       print "Access denied!"
       sys.exit(2)
   # Not a permission error.
   raise
except OSError as e:
   if e.errno == 17:
      print "Install directory already exists. Aborting install!"
      sys.exit(2)
   # Some other error
   raise
else:
   print "Copying files."
   os.chdir(installDir)
   os.popen("rsync -av --exclude 'install.py' %s/ ." % (installSourcePath))
   
   print("Enter LenaSYS mysql root or press enter for default value.")
   lenasysRoot = raw_input("[lenasys]>")
   if lenasysRoot == "":
      lenasysRoot = "lenasys"
  
   print("Enter password for '" + lenasysRoot + "' or press enter for default value.")
   lenasysRootPwd = raw_input("[snus]>")
   if lenasysRootPwd == "":
      lenasysRootPwd = "harrenliggerinte"
   
   print("Enter database name or press enter for default value.")
   lenasysDatabaseName = raw_input("[imperious]>")
   if lenasysDatabaseName == "":
      lenasysDatabaseName = "imperious"
   
   print("Enter database host or press enter for default value.")
   lenasysDatabaseHost = raw_input("[localhost]>")
   if lenasysDatabaseHost == "":
      lenasysDatabaseHost = "localhost"
   print("define(\"DB_USER\",\""+lenasysRoot+"\")")
   print("define(\"DB_PASSWORD\",\""+lenasysRootPwd+"\")")
   print("define(\"DB_HOST\",\""+lenasysDatabaseHost+"\")")
   print("define(\"DB_NAME\",\""+lenasysDatabaseName+"\")")

   fh1 = open("/tmp/dbcreate.sql", "wb")
   fh1.write("CREATE DATABASE "+lenasysDatabaseName+";\n")
   fh1.write("CREATE USER '"+lenasysRoot+"'@'"+lenasysDatabaseHost+"' IDENTIFIED BY '"+lenasysRootPwd+"';\n")
   fh1.write("GRANT ALL PRIVILEGES ON "+lenasysDatabaseName+" . * TO '"+lenasysRoot+"'@'"+lenasysDatabaseHost+"';\n")
   fh1.write("FLUSH PRIVILEGES;\n")
   fh1.close()
   print("Enter mysql root account or press enter for default value.")
   mysqlRoot = raw_input("[root]>")
   if mysqlRoot == "":
      mysqlRoot = "root"
   print("Enter mysql root account or press enter for default value.")
   print("Enter mysql root account password:")
   mysqlRootPwd = raw_input(">")
   os.popen("mysql -h %s -u %s -p%s < /tmp/dbcreate.sql" % (lenasysDatabaseHost, mysqlRoot, mysqlRootPwd))
   os.popen("mysql -h %s -u %s -p%s %s < Shared/SQL/init_db.sql" % (lenasysDatabaseHost, lenasysRoot, lenasysRootPwd, lenasysDatabaseName))

   fh2 = open("../coursesyspw.php", "wb")
   fh2.write("<?php\n")
   fh2.write("define(\"DB_USER\",\""+lenasysRoot+"\");\n")
   fh2.write("define(\"DB_PASSWORD\",\""+lenasysRootPwd+"\");\n")
   fh2.write("define(\"DB_HOST\",\""+lenasysDatabaseHost+"\");\n")
   fh2.write("define(\"DB_NAME\",\""+lenasysDatabaseName+"\");\n")
   fh2.write("?>\n")
   fh2.close()
   print("Installation done!")

sys.exit()

