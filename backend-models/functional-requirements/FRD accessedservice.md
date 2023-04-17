| Functionality Requirement No.  | Function Requirement Description  |
| ------------- | ------------- |
| FR1  | A user shall be able to update the user table or user_course table  |
| FR2  | A user shall be able to add a class to LenaSYS  |
| FR3  | A user shall be able to change their password  |
| FR4  | A user shall be able to add a user, based on ssn or username  |


| FN No:  | Test Proposal:  |
| ------------- | ------------- |
| FR1  | Try mixing capital letters, add numbers or special characters and look at the actual output  |
| FR2  | Perhaps try adding special characters as input and look at what will be inserted in the database  |
| FR3  | Are all characters allowed and what is the standardPasswordHash?  |
| FR4  | Try adding a user with an ssn and try adding a user with username and see how it interacts/inputs into the database. Try adding a new user and try adding the same user again.  |


| FN No:  | Input/output  |
| ------------- | ------------- |
| FR1  | The system will determine that the user wants to update with strcmp. If it's == 0 it means the user wants to use this "function". All variables in the code have no restrictions (ex case sensitive).  |
| FR2  | All variables that are needed gets put into an array that is decoded into normal text that is then inserted into the database. This seems to be to avoid special conversions from special characters such as &, "" or spaces. This is done with json_decode(htmlspecialchars_decode())  |
| FR3  | Determines the user by their user id(uid). Updates password determined by standandPasswordHash($pw). loguserevent() to log when resetting the password  |
| FR4  | The input is decoded. This seems to be to avoid special conversions from special characters such as &, "" or spaces. This is done with json_decode(htmlspecialchars_decode()).  |


| FN No:  | FR1  |
| ------------- | ------------- |
| Shall  | A user shall be able to update the user table or user_course table  |
| While  | While the user have an active duggaSession  |
| When  | When the update is requested  |
| Where  | Where the user is able to update a dugga  |
| If Then  | If the update cannot be made then an error is provided  |


| FN No:  | FR2  |
| ------------- | ------------- |
| Shall  | A user shall be able to add a class to LenaSYS  |
| While  | While the user have an active duggaSession  |
| When  | When the user presses "add"  |
| Where  | Where a add option is visible  |
| If Then  | If the insert cannot be made Then an error is provided  |


| FN No:  | FR3  |
| ------------- | ------------- |
| Shall  | A user shall be able to change their password  |
| While  | While the user have an active duggaSession  |
| When  | When the student presses "Save"  |
| Where  | Where a save option is visible  |
| If Then  | If the change cannot be made Then an error is provided  |


| FN No:  | FR4  |
| ------------- | ------------- |
| Shall  | A user shall be able to add a user, based on ssn or username  |
| While  | While the user have an active duggaSession  |
| When  | When the user presses "add"  |
| Where  | Where a add option is visible  |
| If Then  | If the insert cannot be made Then an error is provided  |


