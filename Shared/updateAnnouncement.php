<?php
$_SESSION["courseid"] = $_GET["courseid"];
$_SESSION["coursevers"] = $_GET["coursevers"];
$_SESSION["coursename"] = $_GET["coursename"];
$author = $_GET['author'];
$modTitle =  $_GET['title'];
$modMessage =  $_GET['message'];
$updateannouncementid =  $_GET['updateannouncementid'];

?>

<div id="modal" class="modal">
  
  <form class="modal-content animate" action="../Shared/announcementService.php" method="post">
    <div class="containerHeader">
     <h3>Update announcement</h3>
     <hr>
   </div>
   <div class="modal-container">
    <input type="text" id="modAuthor" name="modAuthor" value="<?php echo $author ?>" style="display: none;">
    <input type="text" id="modAnnouncementid" name="modAnnouncementid" value="<?php echo $updateannouncementid ?>" style="display: none;">
    <label for="modTitle"><b>Title</b></label>
    <input type="text" placeholder="Update title" name="modTitle" required value="<?php echo $modTitle ?>">
    <label for="modAnnouncementMsg"><b>Message</b></label>
    <textarea  type="Text" placeholder="Update message" name="modAnnouncementMsg" required><?php echo $modMessage; ?></textarea>
  </div>
  <div class="modal-container modalBtns" style="background-color:#f1f1f1">
    <button type="submit" class="createbtn">Update</button>
    <button type="button" class="cancelbtn modCancelbtn"><a href='../DuggaSys/sectioned.php?courseid=<?php echo $_SESSION['courseid'];?>&coursevers=<?php echo $_SESSION['coursevers'];?>&coursename=<?php echo $_SESSION['coursename'];?>'>Cancel</a></button>
  </div>

</form>
</div>