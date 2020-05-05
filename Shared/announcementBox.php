<?php
 $_SESSION["courseid"] = $_GET["courseid"];
 $_SESSION["coursevers"] = $_GET["coursevers"];
 $_SESSION["coursename"] = $_GET["coursename"];

?>

<div id="modal" class="modal" style="display: none;">
  
  <form class="modal-content animate" action="../Shared/announcementService.php" method="post">
   	<div class="containerHeader">
   		<h3>Create an announcement</h3>
   		<hr>
   	</div>
    <div class="modal-container">
      <input type="text" name="author" id="author" style="display: none;">
      <label for="title"><b>Title</b></label>
      <input type="text" placeholder="Enter a title for the announcement" name="title" required>
      <label for="announcementMsg"><b>Message</b></label>
      <textarea  type="Text" placeholder="What do you want your students to know?" name="announcementMsg" required></textarea>
    </div>
    <div class="modal-container modalBtns" style="background-color:#f1f1f1">
      <button type="submit" class="createbtn">Create</button>
      <button type="button" onclick="document.getElementById('modal').style.display='none'" class="cancelbtn">Cancel</button>
      
    </div>

  </form>
</div>
