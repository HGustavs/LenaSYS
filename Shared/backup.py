#!/usr/bin/env python
import os
import time
def findOccurences(s, ch):
    return [i for i, letter in enumerate(s) if letter == ch]

print("=== Backing up LenaSYS ===")
dbdata = {}
fh = open('../../coursesyspw.php', 'r')
lines = [line.rstrip('\n') for line in fh]

for line in lines:
    strDelimiter = findOccurences(line, '"')
    if (len(strDelimiter) > 0):
        dbdata[line[strDelimiter[0]+1:strDelimiter[1]]] = line[strDelimiter[2]+1:strDelimiter[3]]


filestamp = time.strftime('%Y-%m-%d-%H-%M')
filename = "lenasys-backup-"+filestamp
os.chdir("../")
lenasysdir = os.getcwd().rsplit("/", 1)[1]
os.chdir("../")
os.popen("tar cf ~/%s.tar %s" % (filename, lenasysdir))

os.popen("mysqldump –-single-transaction -u %s -p%s -h %s -e --opt -c %s | gzip -c > /tmp/%s.gz" % (dbdata['DB_USER'], dbdata['DB_PASSWORD'], dbdata['DB_HOST'], dbdata['DB_NAME'], "lenasysdb.sql"))

os.popen("tar --append --file ~/%s.tar -C /tmp/ lenasysdb.sql.gz" % (filename))

os.popen("rm /tmp/lenasysdb.sql.gz")
os.popen("bzip2 ~/%s.tar" % (filename))

print("Backup done.")
print("Backup file: "+filename+".tar.bz2")
