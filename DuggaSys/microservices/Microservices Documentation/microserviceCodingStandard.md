
# Coding standard for removing includes
Do this

## retrieving data: GET

the place where you are retrieving data needs to use curl to call the php file.
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


This ensures your code works in both development and production without
changing URLs manually
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
$response = curl_exec($ch);
curl_close($ch);
```

The microservice should return JSON. We decode it into a PHP associative array:
```php
$data = json_decode($response, true);
```


You need to check if the microservice you are calling have something
like this at the bottom:
```php
echo json_encode($data);
``` 

if it does not, there are several modifications you will have to do.
1. Remove the function body
2. Replace the _return $data_ at the bottom with _echo json_encode($data)_


Now you have retrieved the data with cURL instead of using includes!
## sending data: POST
