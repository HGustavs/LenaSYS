# Review considerations of importance

* Small code is important - a small solution is better, reuse important
* Minimize use of libraries such as jquery
* Innerhtml better than dom .addchild etc
* Static code better than dynamic.
* Styled html inputs better than hand made or from libraries e.g. jquery

# Code standard for LenaSYS

+ Text that uses <-- are used for commenting the coding style only, and are not part of the code nor the comments in the file
+ three periods ... denotes any section of random code
+ this file contains coding style for both javascript and php
+ We use tabs rather than space and each tab corresponds to 2 spaces to view properly on the web add ts parameter https://github.com/HGustavs/LenaSYS/blob/master/code_standard.md?ts=2

``` javascript
/********************************************************************************

   Documentation <-- Top of file contains documentation e.g. call order and in some cases list of important bugs and/or version history

*********************************************************************************

Execution Order
---------------------
 #1 setup() is first function to be called this then invokes returned() callback through AJAX
 #2 returned() is next function to be called as a callback from setup.
 		#1 addTemplatebox() is called in order to create the main template box

-------------==============######## Documentation End ###########==============-------------
*/

/********************************************************************************

   Globals <-- Next are globals - properly declared with var

*********************************************************************************/

var retdata;
var tokens = [];            			// Array to hold the tokens.  <-- we declare arrays with [] comment for important data
var dmd=0;
var isdropped=false;   <-- We use false for false and not 0 or null 
var genSettingsTabMenuValue = "wordlist";
var codeSettingsTabMenuValue = "implines";				
var querystring = parseGet(); 		// Reads data from url get link <-- all comments are on the same column vertically
var filez;

/********************************************************************************

   SETUP <-- Automatically called code as "setup" we want to clearly know where execution starts in each file

*********************************************************************************/

function setup()
{
	
		$.ajax({url: "editorService.php", type: "POST", data: "courseid="+querystring['courseid']+"&exampleid="+querystring['exampleid']+"&opt=List", dataType: "json", success: returned});
		<-- Try to keep ajax or jquery calls on a single line		
}

//---------------------------------------------------------------------------------------------------
// Renderer  <-- If file is large, group functionally similar functions into one comment heading
//---------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------
// returned: callback from ajax call in setup data is json <--- we explain both functionality, who calls the function and contents of data
//----------------------------------------------------------------------------------

function returned(data) <-- Returned function should exist and work the same in most files
{	 <-- brackets on same level as function keyword but on the next line
		test=2; <-- wrong since variable test is not declared using var
		let test2 = ""; <-- wrong since let is not supported by older browsers, should use var when declaring variables
		if(retdata['debug']!="NONE!") alert(retdata['debug']); <-- only for very short code we allow single line if-statements and never allow else with single line if-statements
		
		// User can choose template if no template has been choosen and the user has write access.
		if((retdata['template']['templateid'] == 0)){ <-- any superfluous or redundant parentheses should be removed i.e. outer ones in this case
		    ...
				for(i=0;i<10;i++)     <-- this is wrong for two reasons, firstly the for loop has undeclared variable i and secondly bracket is on next line, which we only do for functions
				{
				...
		}else{ <-- both brackets on same line as elese
		
		} 
		
		var a=retdata['template']['templateid']; 		<-- We prefer using varaibles to most cases of double indirection in arrays
		
		var template=retdata['template'];
		var a=template['templateid'];								<-- This code split into two rows is preferred

		/* Box comments are not allowed inside functions */ <-- box comments makes boxing out code impractical and should be avoided
		
		// Populate interface with returned data (all relevant data is returned)  <-- bigger comments that explain algorithms should be used sparsely and be followed by a line of ------ to simplify finding important sections of code 
		//---------------------------------------------------------------------

    str+="<div id='impLinesError' class='errormsg'>";  <-- Indenting for structure is good! in this case inputs are inside div, we indent inputs one step
    	str+="<input type='text' size='4' id=\""+boxid+"from\" /> - <input type='text' size='4' id=\""+boxid+"to\"/>"; <-- if possible keep lines below 80-90 characters
    	str+="<input type='button' value='add' onclick='addImpline(\""+boxid+"\")'/>";
    	str+="<input type='button' value='del' onclick='delImpline(\""+boxid+"\")'/>";
		str+="</div>";
		element.innerHTML=str;  <-- we use innerHTML to change document and not DOM createElement and appendChild which is hard to read
		
		var hotdogmenu = document.createElement("span");    <-- we use innerhtml and strings instead
		content.appendChild(hotdogmenu);                    <-- we use innerhtml and strings instead

// for(u=0;u<10;u++){							<-- We do not use c++ comments to block out code -- c++ comments are used to comment code only either between functions or in functions
//   if(u%2==0) alert(u);
// }
//

/*
 for(u=0;u<10;u++){							<-- We use C comments for blockint out code -- this is the only valid use for C style comments outside of file header comments and documentation between functions.
   if(u%2==0) alert(u);
 }
*/

}
```
```php
//---------------------------------------------------------------------------------------------------
// myTest: Test code  <-- Same rules apply for PHP
//         Second line comment <-- if used, second line comment aligns vertically with first line comment
//---------------------------------------------------------------------------------------------------

function myTest() { <-- Capitals on second word in function name e.g. Test
    global $x, $y;  <-- Global variable should be declared with "global"
    $y = $x + $y;

		$sqlString="SELECT * FROM FOO;"; <-- SQL code should be capitalized and terminated properly
		
		$foo="<div>".$olle."</div>";  <-- html is generated in javascript render function or statically in html file		
}
```

