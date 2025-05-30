
# Coding standard for removing includes
Do this

## Retrieving data: GET

### Calling function 
The place where you are retrieving data needs to use curl to call the php file.
In this case, it is _readCourseVersion_ that gives you the data for _$versions_.

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

$baseURL is set to ensures your code works in both development and production without changing URLs manually.

```php
$baseURL = "https://" . $_SERVER['HTTP_HOST'];
```

Now, add the specific path to the microservice:
```php
$url = $baseURL . "path/to/the/microservice";
```

You’ll use cURL to send a GET request to the microservice:
```php
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
```
The cURL call is now set up and ready to be executed, below we show the execution which returns data that we store in $response.

```php
$response = curl_exec($ch);
curl_close($ch);
```

To retrieve the data we decode the message to get an associative array in our $data variable.
```php
$data = json_decode($response, true);
```


### Receiving function

The function that will receive the GET request will do some work to produce the data and then wants to send it back to the caller, to do this you will need to add the following:
```php
header('Content-Type: application/json');
echo json_encode($data);
``` 
The header says the content will be json and the echo sends the json data back to the caller.

If there isn't already an echo json_encode($data) you will have to:
1. Remove the function body
2. Replace the _return $data_ at the bottom with _echo json_encode($data)_

Now you have retrieved the data with cURL instead of using includes!
## Sending data: POST

Instead of calling functions to send data and do something with them we should use http POST.
To do this we will set up a curl call to the place we want to send data to, in the example below we do it to setAsActiveCourse_ms.php.

### Calling function

```php
    header("Content-Type: application/json");
    //set url for setAsActiveCourse.php path
    $baseURL = "https://" . $_SERVER['HTTP_HOST'];
    $url = $baseURL . "/LenaSYS/DuggaSys/microservices/sharedMicroservices/setAsActiveCourse_ms.php";
    $ch = curl_init($url);
```

The header tells the application that the data sent will be json data.
$baseURL is used to determine if the call is located on localhost or a server and the rest is the path to the file, this should later be changed to be found in a database instead of hardcoding it.
curl_init starts the curl call.

We must now set up the options we want on the curl call, since this is a POST where we do not want an answer we will set the following options:

```php
    //options for curl
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'cid' => $cid, 'versid' => $versid
    ]));
   
    curl_exec($ch);
    curl_close($ch);
```

First option says we don't want a return answer, next is that we want to use POST, and finally the last option is what the POST fields should contain. For the content of the POST fields we build a http query and assign variables like you normally would in a POST call. 
Once we have set our options we can execute the curl call and close it after, as is best practice.

### Receiving function

To receive the values from the POST request we check if the request method is POST (so that we don't check GET or other requests) if this is true we check if the variables are set and if they are we can use them in our query.
After this we can do the query we want just as usual.

```php
    //get values from post
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['cid'], $_POST['versid'])) {
            $cid = $_POST['cid'];
            $versid = $_POST['versid'];
        }
    }

    //set active course in database
    $query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
    $query->bindParam(':cid', $cid);
    $query->bindParam(':vers', $versid);
```

Some things that can lead to errors are keeping the code inside the preexisting function, this will not work as the function has nothing calling it. Either remove the function so all the code is straight in the php file or call the function from the php file (Haven't tested this but should work theoretically).