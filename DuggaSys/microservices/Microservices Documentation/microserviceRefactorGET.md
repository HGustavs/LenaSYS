# Refactor a function with no parameters and a return

To refactor a function with no parameters and a return you can follow these steps.
What i mean with function with no parameter and a return is a function like this:

```php
    $result = getActiveCourse();
```

## What to change and where
getActiveCourse is an imaginary microservice being used by updateCourseVersion and updateCourseVersionSectioned

When you get an issue you will get something like Re-engineer microservice getActiveCourse. This means that you will need to change how this service works, as well as all services that use it. 

In the case of getActiveCourse we can check the inverse dependency documentation and see that updateCourseVersion and updateCourseVersionSectioned uses this service.[Inverse Dependencies](../Microservices_inverse_dependencies.md)

The end goal is to be able to remove the include /.../getActiveCourse from the two updateCourseVersion files.

These files call the function getActiveCourse() directly, we want to change this to be called using a HTTP request instead.

To do this we must locate where the function is used in updateCourseVersion (do it in one and then just copy-paste the solution to the other files).

# Locate the function call

In the file updateCourseVersion on line 86 we find this, the function has been located.

```php
    if ($makeactive == 3) {
        $result = getActiveCourse();
    }
```

# Decide what HTTP request to use

In our case here we see a function call with a return expected.
This means we want to use a GET call since we don't need to send variables, and set our return option to true since we expect an answer from the function.

# What is GET and cURL
GET is a method to transfer data, it is used most often when something should be retrieved in the database (SELECT). cURL is the tool used to request the data via HTTP. So cURL starts the connection to HTTP, tells it to request the provided data using GET. We can then send the data from the specified location in the call.

# Implement the GET call

In our file updateCourseVersion we will then add this:

```php
// Retrieve Course Versions from microservice 'readCourseVersions_ms.php'
$baseURL = "https://" . $_SERVER['HTTP_HOST'];

$url = $baseURL . "/LenaSYS/duggaSys/microservices/sectionedService/readCourseVersions_ms.php";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

$versions = $data;
```

This will replace the function call getActiveCourse();

This might look like a lot but if we take it step by step there isn't alot of crazy things happening.

## url setup
The next two lines are to setup the url to the service we want to call, since we don't have the include anymore we must tell our program where to send the GET request.
This will be the baseURL (this is just http or localhost) + the location of the file.

## setup curl call
The next line is to initialise a curl call on the url provided, this just tells the program that we want to setup a curl call.

Next line is an option to the curl call, 
with the option we say that we want a return.

## execute curl call
We have now set up our curl call to the proper address (url), with the right options, and the right data.

The curl call can now be executed, the result is stored in a variable, and after that we close it as is good practice.

# recap so far

So far we located the function call we want to replace, and replaced it with a GET call.
To do this we had to tell our curl call where to send the call (our url), and then to execute the call.
The call has now been sent, but we still need to change how the reply is sent back from our getActiveCourse function.

We will go over how to change getActiveCourse now.

# Implement GET reception
We now want to move over to the file containing the function that we called (getActiveCourse)

This is how the file looks before changing anything:

```php
function getActiveCourse()
{
	$query = $pdo->prepare("SELECT activeversion FROM course;");
	if (!$query->execute()) {
		$error = $query->errorInfo();
		$debug = "Error updating entries\n" . $error[2];
		echo json_encode($debug);
	}

    $result = $query->fetch(PDO::FETCH_ASSOC);
    return $result;
}
```

# Sending back a result
To send back a result replace the return $result; line with this:

```php
    header('Content-Type: application/json');
    echo json_encode($result);
```

# Removing the function
We now need to remove the function brackets (function wrapper), otherwise when the file is called the code won't run since it is stuck in a function that isn't called.


~~function getActiveCourse()~~

~~{~~

    [function code]

~~}~~

So now you should only have the contents of the function left in the file.
 
Once we have done this, we are done with the whole refactoring. We can remove the include getActiveCourse in the updateCourseVersion files and after that we just need to test that it works.

# TLDR

This:

```php
    if ($makeactive == 3) {
        $result = getActiveCourse();
    }
```

Becomes this:

```php
    if ($makeactive == 3){
        // Retrieve Course Versions from microservice 'readCourseVersions_ms.php'
        $baseURL = "https://" . $_SERVER['HTTP_HOST'];

        $url = $baseURL . "/LenaSYS/duggaSys/microservices/sectionedService/readCourseVersions_ms.php";
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);

        $versions = $data;
    }
``` 

And this:

```php
function getActiveCourse()
{
	$query = $pdo->prepare("SELECT activeversion FROM course;");
	if (!$query->execute()) {
		$error = $query->errorInfo();
		$debug = "Error updating entries\n" . $error[2];
		echo json_encode($debug);
	}

    $result = $query->fetch(PDO::FETCH_ASSOC);
    return $result;
}
```

Becomes this:


```php
	$query = $pdo->prepare("SELECT activeversion FROM course;");
	if (!$query->execute()) {
		$error = $query->errorInfo();
		$debug = "Error updating entries\n" . $error[2];
		echo json_encode($debug);
	}

    $result = $query->fetch(PDO::FETCH_ASSOC);
    header('Content-Type: application/json');
    echo json_encode($result);

```