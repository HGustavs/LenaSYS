## How to think with includes: 

## Microservices:
*Don’t use () around the quotation marks 
Example:
don’t - include_once (“../../../Shared/basic.php”);
do - include_once “../../../Shared/basic.php”;

## -Rules with the paths:
*The ../ is one path back from where you are. For each ../ you will jump one step back.
 
*To reach one file that exists in another folder, you need to jump the right amount of steps back, then name the right folder to later name the correct file. 
Example: If you are working in the addClass_ms.php file located in the accessedService folder, which is inside the microservices folder, within the DuggaSys directory and you want to link the file basic.php from the folder Shared, it should look like this: include_once “../../../Shared/basic.php”;. With this you have jumped 3 steps back so that you are outside the directory, then you need to jump forward by naming the folder (Shared) that the desired file is inside to then name the right file (basic.php). 

*If the microservice that you want to link is in the same folder as the one you work on, 
do: include_once “./retriveDuggaedService_ms.php”;
don’t: include_once “retriveDuggaedService_ms.php”;

*the “gitfetchService.php” is already inside of the folder “DuggaSys”. Therefore the path should look like this: 
include_once “../../gitfetchService.php”;

## Services:
The same rules about the paths applies here. 

*if you need to link “coursesyspw.php”, the path should look like this:
include_once "../../coursesyspw.php";
This is because this file is outside of the directory. There is a file named the same thing inside the “shared” folder but this should not be used. 

*include_once(__DIR__ . "/database.php");
This is used when the path is more important. It will always look in the right place wherever it is included. 
Before it looked like this: ("../Shared/database.php");
but with DIR it stands out more and should therefore be used. 
