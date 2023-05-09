<html>
<head>
<style>

    
        table, th, td {
        border:1px solid black;
        border-collapse: collapse;
    }

    /*#set_to_default_button{
        display: block;
        margin-top: 2vh;
        margin-bottom: 2vh;
    }*/
    th{
        background-color: #614875;
    }
    th a{
        color: white;
        text-decoration: none;
    }
    table tr:nth-child(even){
        background-color: #f2f2f2;
    }

    table tr:hover {
        background-color: #ddd;
    }
    </style>
<?php

/*
include_once ".../test1";
include_once ".../test2";
include_once ".../test3";
include_once ".../test4";

pdoConnect();
*/

echo "
<table border='1'>
<tr>
    <th>test1</th>
    <th>test2</th>
    <th>test3</th>
    <th>test4</th>
    <th>test5</th>
</tr>
";

echo "</table>";


            ?>
   </body>
</html>