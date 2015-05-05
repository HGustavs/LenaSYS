<html>                                                                                                                                                
<body>                                                                                                                                                
<pre>                                                                                                                                                 
<?php                                                                                                                                                 
 
$variable="Hello!";                                                                                                                                
$numbervariable=2;                                                                                                                                 
                                                                                                                                      
// You can mix printing of variables with printing of html code                                                                                    
echo $variable;                                                                                                                                    
echo "<br>";                                                                                                                                       
echo $numbervariable;                                                                                                                              
                                                                                                                                                     
// Variables support ordinary mathematical operators from programming languages                                                                    
$numbervariable++;                                                                                                                                 
echo "<br>";                                                                                                                                       
echo $numbervariable;                                                                                                                              
                                                                                                                                                   
// String variables and number variables cannot be added                                                                                           
echo "<br>";                                                                                                                                       
echo $variable+$numbervariable;                                                                                                                    
                                                                                                                                                     
// The dot operator merges two string variables                                                                                                    
echo "<br>".$variable." ".$numbervariable;                                                                                                         
                                                                                                                                                    
// Variables can be printed as part of a text                                                                                                      
// This syntax is distinct from many other languages but allows simpler text expressions                                                           
echo "<br>$variable $numbervariable";                                                                                                              
                                                                                                                                                    
?>                                                                                                                                                    
</pre>                                                                                                                                                
</body>                                                                                                                                               
</html>
