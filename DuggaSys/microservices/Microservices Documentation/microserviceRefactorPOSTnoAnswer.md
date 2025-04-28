# Refactor a function with parameters and no return

To refactor a function with parameters and no return you can follow these steps.
What i mean with function with parameter and no return is a function like this:

```php
    setAsActiveCourse($pdo, $cid, $versid);
```

## What to change and where

When you get an issue you will get something like Re-engineer microservice setAsActiveCourse. This means that you will need to change how this service works, as well as all services that use it. 

In the case of setAsActiveCourse we can check the inverse dependency documentation and see that updateCourseVersion and updateCourseVersionSectioned uses this service.
[Inverse Dependencies](../Microservices_inverse_dependencies.md)

The end goal is to be able to remove the include /.../setAsActiveCourse from the two updateCourseVersion files.

These files call the function setAsActiveCourse($pdo, $cid, $versid) directly, we want to change this to be called using a HTTP request instead.

To do this we must locate where the function is used in updateCourseVersion (do it in one and then just copy-paste the solution to the other files).

# Locate the function call

In the file updateCourseVersion on line 86 we find, the function has been located.

```php
    if ($makeactive == 3) {
        setAsActiveCourse($pdo, $cid, $versid);
    }
```

# Decide what HTTP request to use

In our case here we see a simple function call with no return expected (ie, no $result = setAsActiveCourse())

This means we want to use a POST call to be able to send variables, and set our return option to false since we don't expect an answer from the function.

# What is POST and cURL
POST is a method to transfer data, it is used most often when something should be changed in the database (create, update or delete). cURL is the tool used to send the data via HTTP. So cURL starts the connection to HTTP, tells it to send the provided data using POST. We can then retrieve the data at the specified location in the call.


# Implement the POST call

In our file updateCourseVersion we will then add this:

```php
    header("Content-Type: application/json");
    //set url for setAsActiveCourse.php path
    $baseURL = "https://" . $_SERVER['HTTP_HOST'];
    $url = $baseURL . "/LenaSYS/DuggaSys/microservices/sharedMicroservices/setAsActiveCourse_ms.php";
    $ch = curl_init($url);
        //options for curl
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'cid' => $cid, 'versid' => $versid
    ]));
   
    curl_exec($ch);
    curl_close($ch);
```

This will replace the function call setAsActiveCourse($pdo, $cid, $versid);

This might look like a lot but if we take it step by step there isn't alot of crazy things happening.

## header
First line is a header to say that the information we will send is of type json. (This will always be the case in our context)

## url setup
The next two lines are to setup the url to the service we want to call, since we don't have the include anymore we must tell our program where to send the POST call.
This will be the baseURL (this is just http or localhost) + the location of the file.

## setup curl call
The next line is to initialise a curl call on the url provided, this just tells the program that we want to setup a curl call.

Next three lines are options to the curl call, 
first is to say we don't want a return, 
next is to specify that we want to use POST,
last is to specify the fields to send with the POST.

The fields will be the same as the ones in the original function call (setAsActiveCourse($pdo, $cid, $versid);), you will see that $pdo is missing, this is because we cannot send a pdo object over HTTP POST. Don't worry about that for now.

## execute curl call
We have now set up our curl call to the proper address (url), with the right options, and the right data.

The curl call can now be executed, and after that we close it as is good practice.

# recap so far

So far we located the function call we want to replace, and replaced it with a POST call.
To do this we had to tell our curl call where to send the information (our url), what to send with it, and then finally to execute the call.
The information has now been sent, but we still need to retrieve the information from our setAsActiveCourse function.

We will go over how to change setAsActiveCourse now.

# Implement POST reception
We now want to move over to the file containing the function that we called (setAsActiveCourse)

This is how the file looks before changing anything:

```php
function setAsActiveCourse($pdo, $cid, $versid)
{
	$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
	$query->bindParam(':cid', $cid);
	$query->bindParam(':vers', $versid);

	if (!$query->execute()) {
		$error = $query->errorInfo();
		$debug = "Error updating entries\n" . $error[2];
		echo json_encode($debug);
	}
}
```

We have a problem right now, we are no longer calling the function directly so the parameters passed in the function will never be set, these need to be retrieved from POST. We don't need to care too much about the logic of the file, we just need to provide the parameters again.

```php
    //get values from post
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['cid'], $_POST['versid'])) {
            $cid = $_POST['cid'];
            $versid = $_POST['versid'];
        }
    }
```
To do this, we add the code above, and retrieve the variables that we put into the POST fields earlier.
This is done with $cid = $_POST['cid];

# Removing the function
We now need to remove the function brackets, otherwise when the file is called the code won't run since it is stuck in a function that isn't called.


~~function setAsActiveCourse($pdo, $cid, $versid)~~

~~{~~

    [function code]

~~}~~

So now you should only have the contents of the function left in the file.
    
# Replacing $pdo
As you saw earlier we did not send the $pdo object which means we cannot use it. To fix this add this code at the start of the file:

```php
    // Include basic application services!
    include_once "../Shared/basic.php";
    include_once "../Shared/sessions.php";

    // Connect to database and start session
    pdoConnect();
    session_start();
```
This basically just creates a new pdo that you can use, you can just copy paste this in at the start.

Once we have done this, we are done with the whole refactoring. We can remove the include SetAsActiveCourse in the updateCourseVersion files and after that we just need to test that it works.

# TLDR

This:

```php
    if ($makeactive == 3) {
        setAsActiveCourse($pdo, $cid, $versid);
    }
```

Becomes this:

```php
    if ($makeactive == 3){
        header("Content-Type: application/json");
        //set url for setAsActiveCourse.php path
        $baseURL = "https://" . $_SERVER['HTTP_HOST'];
        $url = $baseURL . "/LenaSYS/DuggaSys/microservices/sharedMicroservices/setAsActiveCourse_ms.php";
        $ch = curl_init($url);
            //options for curl
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'cid' => $cid, 'versid' => $versid
        ]));
    
        curl_exec($ch);
        curl_close($ch);
    }
``` 

And this:

```php
function setAsActiveCourse($pdo, $cid, $versid)
{
	$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
	$query->bindParam(':cid', $cid);
	$query->bindParam(':vers', $versid);

	if (!$query->execute()) {
		$error = $query->errorInfo();
		$debug = "Error updating entries\n" . $error[2];
		echo json_encode($debug);
	}
}
```

Becomes this:


```php
    // Include basic application services!
    include_once "../Shared/basic.php";
    include_once "../Shared/sessions.php";

    // Connect to database and start session
    pdoConnect();
    session_start();

    //get values from post
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['cid'], $_POST['versid'])) {
            $cid = $_POST['cid'];
            $versid = $_POST['versid'];
        }
    }

	$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
	$query->bindParam(':cid', $cid);
	$query->bindParam(':vers', $versid);

	if (!$query->execute()) {
		$error = $query->errorInfo();
		$debug = "Error updating entries\n" . $error[2];
		echo json_encode($debug);
	}
```