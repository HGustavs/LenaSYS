### Branch names
One development branch for each project:
* codeviewer-master 
* duggasys-master
* playereditor-master

And one development branch in common for all the project:
* develop

Feature and bugfix branches are branched from their respective master 
branches and them merged back when complete.

Bugfixes etc on branches should use the following naming convention:
* groupname-bugfix-name-issue# 
* groupname-feature-name-issue# 
* groupname-hotfix-name-issue# (do we need this?) 

For example: The issue with issue number 123 and the name "Alpha particle bug" belonging to the duggasys group would be fixed in a branch named "duggasys-bugfix-alpha-particle-bug-123".

Branching this way can be done by selecting your master (e.g. duggasys-master or similar) in the GitHub client and then typing a new name into the text field used for search. Making some commits and then pressing "publish" to publish the branch on GitHub for everyone to see.

### Procedures
On Friday each week the people responsible for merging in each project meets and performs the merge. Any conflicts (code-wise) are resolved and the results are merged back into master (when the code has been tested) and their development branch (to keep it from going out of date).

Each time a merge has been completed the result is uploaded to the testing server where it is tested, the SQL dump is imported if there has been any changes and potential bugs that have come from merging are located and fixed throughout the day (and next week if there's any particularly hard-to-solve bugs).

Feature or bugfix branches that have not been completed by the merge on Friday are postponed to the next week. These branches should merge develop into their history to keep themselves from ending up too far behind. This can be done using the merge tool in the GitHub client or by using pull requests on GitHub (by selecting the correct branches).
