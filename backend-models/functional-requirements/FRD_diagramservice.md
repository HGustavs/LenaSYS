| Functionality Requirement No.  | Function Requirement Description  |
| ------------- | ------------- |
| FR1  | Server shall be able to read activity data for github  |
| FR2  | Server shall be able to read and retrive diagrams from course or hash  |
| FR2  | Server shall be able to save diagrams  |


| FN No:  | Test Proposal:  |
| ------------- | ------------- |
| FR1  | Logtest and manipulationtest to see if correct information gets sent  |
| FR2  | Logtest and manipulationtest the sent diagrams  |
| FR3  | Logtest the saved documents  |


| FN No:  | FR1  |
| ------------- | ------------- |
| Shall  | Server shall be able to read activity data for github  |
| While  | While server is running  |
| When  | When changes been made or data exist  |
| Where  | Where activity exist  |
| If Then  | If weekly data exist, then return data as a JSON object  |


| FN No:  | FR2  |
| ------------- | ------------- |
| Shall  | Server shall be able to read and retrive diagrams from course or hash  |
| While  | While server is running  |
| When  | When database is running  |
| Where  | Where diagram have been made  |
| If Then  | If course or hash is invalid, then provide server error  |


| FN No:  | FR3  |
| ------------- | ------------- |
| Shall  | Server shall be able to save diagrams  |
| While  | While diagrams have been created  |
| When  | When database is running  |
| Where  | Where diagram have been made  |
| If Then  | If diagram is invalid, then provide server error  |


