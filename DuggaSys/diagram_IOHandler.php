<?php
if(isset($_POST['save'])){
    save();
}
    function save(){
        $myfile = fopen("Saves/te.txt", "w");
    }
?>

