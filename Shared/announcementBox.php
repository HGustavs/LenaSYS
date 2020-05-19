
<?php 
include_once ("../Shared/database.php");
pdoConnect();
?>

<link href="https://fonts.googleapis.com/css2?family=Varela&display=swap" rel="stylesheet">

<form id="announcementForm" class="announcementForm animate" action="../Shared/announcementService.php" method="post">
  <span onclick="displayAnnouncementForm();" class="closeAnnouncementForm" title="Close Modal">&times;</span>
  <div class="announcementFormcontainer">
    <h1 class="formTitle">Create announcement</h1>
    <p class="formSubtitle">Please fill in this form to create an announcement.</p>
    <hr>

    <div>
      <input type="hidden" name="uid" id="userid">
    </div>
    <div>
      <input type="hidden" name="secondannouncementid" id="secondannouncementid" value="<?php echo substr(str_shuffle("0123456789"), 0, 5); ?>">
    </div>
    <div id="courseidAndVersid">
      <div>
        <label for="cid">Course</label><br>
        <select id="cid" name="cid">
          <option selected disabled>ID</option>
          <?php
          foreach ($pdo->query('SELECT * FROM course ORDER BY coursename ASC') as $course) {
            echo "<option value='".$course['cid']."'>".$course['coursename']."</option>";
          }
          ?>
        </select>
      </div>
      <div>
        <label for="versid">Version</label><br>
        <select id="versid" name="versid" disabled>
          <option selected disabled>ID</option>
        </select>
      </div>
    </div>
    <div id="recipientBox">
      <label for="recipient">Recipients</label><br>
      <select id="recipient" name="recipients[]" multiple disabled>
        <option disabled>Select</option>
      </select>
    </div>
    <div>
      <label for="title"><b>Title</b></label>
      <input type="text" id="announcementTitle" placeholder="Enter a title" name="announcementTitle" required>
    </div>
    <div>
      <label for="announcementMsg"><b>Message</b></label>
      <textarea  type="Text" id="announcementMsg" placeholder="What do you want your students to know?" name="announcementMsg" required></textarea>
    </div>

    <div class="clearfix">
      <button type="submit" class="createBtn" name="createBtn" onclick="validateCreateAnnouncementForm();">Create</button>
    </div>
  </div>
</form>
