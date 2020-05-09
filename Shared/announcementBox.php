
<link href="https://fonts.googleapis.com/css2?family=Varela&display=swap" rel="stylesheet">

<form id="announcementForm" class="announcementForm animate" action="../Shared/announcementService.php" method="post">
  <span onclick="document.getElementById('announcementForm').style.display='none'" class="closeAnnouncementForm" title="Close Modal">&times;</span>
  <div class="announcementFormcontainer">
    <h1>Create announcement</h1>
    <p>Please fill in this form to create an announcement.</p>
    <hr>

    <input type="hidden" name="uid" id="userid">
    <input type="hidden" name="cid" id="courseid">
    <input type="hidden" name="versid" id="versid">

    <label for="title"><b>Title</b></label>
    <input type="text" id="announcementTitle" placeholder="Enter a title" name="announcementTitle" required>

    <label for="announcementMsg"><b>Message</b></label>
    <textarea  type="Text" id="announcementMsg" placeholder="What do you want your students to know?" name="announcementMsg" required></textarea>

    <div class="clearfix">
      <button type="submit" class="createBtn" onclick="validateCreateAnnouncementForm();">Create</button>
    </div>
  </div>
</form>
