

You need github for your favourite Operating System. It will automatically connect your account and you will be able to see your projects, including LenaSYS.

In case you right click on LenaSYS, you will see "Open in Git shell". Git shell is basically powershell. The reason why I used it today is that you cannot really solve everything from the GUI.

If you want to travel to a branch ("master" in this case), use
    git checkout master
Afterwards, the branch will be displayed in the command line. Note that the master should be red.

You can then use the following command to merge a given branch ("hejhej" in this case) with the current branch:
    git merge hejhej
Note that you should be at the master branch. Afterwards, if there are no problems, the merge should be done. You can the use the following command to push your changes:
    git push

In case you get merge errors after the command "git merge hejhej", you need to solve them first. You can use notepad++ (or any other editor) for this. For example we get a problem with the file "hello.html" in the directory "misc".

**1.)** You need to travel to "misc/hello.html" and search for the errors. As your errors are configured now, you will get error messages in the style of
```
    <a>
    <<<<<<<< HEAD
    say hello
    ---
    say hejhej
    >>>>>>>> hejhej
    </a>
```
As you can see, the master branch has the row "say hello", while the hejhej branch has "say hejhej" in the same row. You need to fix the problem by choosing the most appropriate one (or use a middleway solution). We can chose "say hejhej", which means that the code snippet should look like this (not that the <a> and </a> before and after the snippet is unchanged).
```
    <a>
    say hejhej
    </a>
```
**2.)** The next step is to re-add the file to the project, otherwise you get "commit is not possible because you have unmerged files" problems.
```
    git add misc/hello.html
```
Note that there will be no prompt.
**3.)** The third step is to commit the file again, as you would otherwise get "commit your changes or stash them before you can merge". This can be done by a commit.
```
    git commit -i misc/hello.html
```
**4.)** So, now you are ready to merge hejhej into master.
```
    git merge origin/hejhej
```
Now, as only hello.html had conflicts which you updated manually, this should show the feedback:
```
> Already up-to-date.
```
**5.)** Now the penultimate step is to push back master and update your online repo. This can be done as following:
```
    git push
```
**6.)** The VERY last step is to publish the code to the testing server and test it. Remember that in order for the test to be valid, in order for a sucessful test you are not allowed to make any changes e.g. configuration changes. If any changes have to be made, the master branch must be fixed to reflect those changes.
It is also a good idea to test using the "blank" database from init_db.sql so that no additional data not present there is needed to pass the test.

It may not be possible to fix all errors immediately, but the erors must be documented in issues and fixed A$AP.
