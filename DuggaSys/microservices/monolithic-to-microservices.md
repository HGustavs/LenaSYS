
Disclaimer, this guide serves as a guideline and can not be followed 100% since the structure of all files differ. It's recommended to test after each step which include code changing to so its faster to spot if something goes wrong.
***
## Setting up file & folder:
***

### Step 1
Locate the folder microservices:
***DuggaSys -> microservices***

### Step 2
If a folder named after the monolithic service file exists skip to step 3.
Else if it does not exist, create a folder named after the service file, for example codeviewerService.php(monolithic) becomes codeviewerService(Folder).

### Step 3
Create a file with name following the naming convention in Potential_micro_services:
***Backend-models -> microservices -> duggaSys services***

**Example:**
| codeviewerService |
| --- |
| editBoxTitle_ms.php |
| createBox_ms.php |

***
## Converting monolithic to microservice:
### Step 1
Copy the entire service file content from the monolithic php to your new made, the purpose of this is to simmer down 

### Step 2
Remove all the “opt”s(Example of opts below) that are not relevant to you. If your function is an else if, make it into an If statement. 
Once all irrelevant code is removed test if it still works (see “How to test: section)

##### Codeexample: Opt

```php
if(strcmp('EDITTITLE',$opt)===0) {
	$exampleid = $_POST['exampleid'];
	$boxId = $_POST['boxid'];
	$boxTitle = $_POST['boxtitle'];

	$query = $pdo->prepare("UPDATE box SET boxtitle=:boxtitle WHERE boxid=:boxid AND exampleid=:exampleid;");
	$query->bindParam(':boxtitle', $boxTitle);
	$query->bindValue(':exampleid', $exampleId);
	$query->bindParam(':boxid', $boxId);
	$query->execute();

	echo json_encode(array('title' => $boxTitle, 'id' => $boxId));
	return;
} else if (strcmp('DELEXAMPLE', $opt) === 0) {

	$query1 = $pdo->prepare("DELETE FROM box WHERE exampleid=:exampleid;");
	$query1->bindValue(':exampleid', $exampleId);				

	$query2 = $pdo->prepare("DELETE FROM improw WHERE exampleid=:exampleid;");
	$query2->bindValue(':exampleid', $exampleId);				

	$query3 = $pdo->prepare("DELETE FROM impwordlist WHERE exampleid=:exampleid;");
	$query3->bindValue(':exampleid', $exampleId);				

	$query4 = $pdo->prepare("DELETE FROM codeexample WHERE exampleid=:exampleid;");
	$query4->bindValue(':exampleid', $exampleId);
        ...
        ...
        ...
			
```

### Step 3
Remove global variables that your functions do not need.
For visuall representation, check **codeviewerService** and the microservice **editBoxTitle_ms**

### Step 4
Add "codeexample: Include" to the code, include should be where the other includes are and getUid(); should be called short after. 
 once the code is added remove code from your microservice that has the same functionality as getUid(see code example:getUid)
##### Codeexample: Include
```php
include ('../shared_microservices/getUid_ms.php');
getUid();
```
##### Codeexample: getUid
```php
function getUid(){
        // Checks user id, if user has none a guest id is set
        if(isset($_SESSION['uid'])){
            $userid=$_SESSION['uid'];
        }else{
            $userid="1";
        }

        $log_uuid = getOP('log_uuid');
        $log_timestamp = getOP('log_timestamp');

        $log_uuid = getOP('log_uuid');
        $info="opt: ".$opt." courseId: ".$courseId." courseVersion: ".$courseVersion." exampleName: ".$exampleName." sectionName: ".$sectionName." exampleId: ".$exampleId;
        logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "getUid_ms.php",$userid,$info);

        $appuser=(array_key_exists('uid', $_SESSION) ? $_SESSION['uid'] : 0);

        return $log_uuid;
    }
```
### Step 5
If retrieve information file does not exist, check ***Creation of retriveInformation_ms.php***

If retrive information exist, call the function by writing **include_once "servicename"**. Before the end "?>" tag write **echo json_encode("your service file"($Needed params));**. See example below:

#### Codeexample: courseedservice retrive information

```php
//Below the other includes
include_once ("../DuggaSys/microservices/courseedservice/retrieveCourseedService_ms.php");
...
...

//End of code
echo json_encode(retrieveCourseedService($pdo, $ha, $debug, $writeAccess, $LastCourseCreated));
?>
```

***
## How to test:

### Step 1
First things first we need to navigate through dugga.js and find the relevant function. Easiest way to find this is to search for "url: "yourservicename.php"

Figure out which of the service statements is relevant to your function, then comment out the old url and write the microservice files name(see code example: url). It will look something like this: *url : "../DuggaSys/microservices/codeviewerService/editBoxTitle_ms.php"*


#### example: url
```php
else if(kind=="BOXCONTENT"){
		$.ajax({
			//url: "codeviewerService.php",
			url : "../DuggaSys/microservices/codeviewerService/editBoxTitle_ms.php",
			type: "POST",
			data: "opt="+opt+para,
			dataType: "json",
			success: returned
		});
	}else if(kind=="BOXTITLE"){
		$.ajax({
			//url: "codeviewerService.php",
			url: "../DuggaSys/microservices/codeviewerService/editBoxTitle_ms.php",
			//url: "../DuggaSys/MicroservicesBeta/Misc/checkUserStatus.php",
			type: "POST",
			data: "opt="+opt+para,
			dataType: "json",
			success: returnedTitle
		});
```
### Step 2
Log in to the webserver through the commandline through the cmc(Will not write a guide on this, sorry people)

### Step 3
Find on LenaSys where your service is used, this can be found through the website developer tool

How to find:
ctrl + shift + i -> network -> search for service -> click around on LenaSys until your service file shows up

Select the file: It should now display options

Select "Preview"

The JSoN data should display an “opt”, find the opt that has the same name as your function in the microservice. 

***
## Creation of retriveInformation_ms:
**Disclaimer:** This method is flawed, better methods exist. This was created on last day before end of course. This guide will use courseedservice as example, you will need to change things according to what is needed in your file. Creating this file is best to test in the monolithic system by commenting out the old retrieve information code and implement function from done above.

An example file exist under ***microservices -> courseedservice -> retrieveCourseedService_ms.php***

### Step 1:
Create a retrieve(servicename)_ms.php in your service name folder

***Example***
Folder: courseedService
Files: retrieveCourseedService_ms.php
### Step 2:
Copy and paste the code below in to the new retrive file created. 
Change params and service name to the ones needed for your service to work.
```php
<?php
    include_once "../../../Shared/basic.php";
    function retrieveCourseedService($pdo, $ha, $debug, $writeAccess, $LastCourseCreated){//CHANGE HERE
        // Include basic application services! Include more if needed
        date_default_timezone_set("Europe/Stockholm");
        include_once "../../../Shared/sessions.php";

        pdoConnect();
    }
?>

```

### Step 3:
Copy everything under:
```
//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------
```
Paste the copied code under pdoConnect();


### Step 4:
At the end of the code an array with values should exist(see code example: array). If echo json_encode($array); exist, you can comment it out.

Add at the end of the function a ***Return $array;***

**Codeexample**
```php
    $array = array(
            'LastCourseCreated' => $LastCourseCreated,
            'entries' => $entries,
            'versions' => $versions,
            "debug" => $debug,
            'writeaccess' => $ha,
            'motd' => $motd,
            'readonly' => $readonly
            );
    //echo json_encode($array);

    logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "retrieveCourseedService_ms.php",$userid,$info);

    return $array;
}
```
***
## Don't forget!:
It's very important that you swap the url when done, so it doesn't cause error for the other groups, unless the website official transfers to microservices
***