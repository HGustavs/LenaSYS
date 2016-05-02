 <?php



session_start();
include_once "forumservice.php";

pdoConnect();

if (file_exists("../.git/refs/heads/master")) {
	$versionFile = fopen("../.git/refs/heads/master", "r");
	$version = fgets($versionFile);
	fclose($versionFile);
} else {
	$version = "v0.7+";
}

?>
<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Course Forum</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/responsive.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/markdown.css" rel="stylesheet">


	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>

	<script src="../Shared/markdown.js"></script>

	<script src="../Shared/dugga.js"></script>
	<script src="forum.js"></script>




  <script type="text/javascript">
    $(document).ready(function(){
      initThread();
    });
  </script>

</head>
<body>
	<?php
	$noup="COURSE";
	$loginvar="COURSE";
	include '../Shared/navheader.php';
	setcookie("loginvar", $loginvar);
	?>

	<!-- content START -->
	<div id="content">
		<!-- Section List -->
		<div id='threadHeader'>
			<div id="threadTopicWrapper">
				<div class="threadTopic"></div>
				<div id="threadOptions">
          <?php
          if ($threadAccess==="super" || $threadAccess==="op") {
            echo "<div class='threadDeleteAndEdit' style='float:right;'></div>";
          }
          if ($threadAccess==="op") {
            echo "<div class='opEditThread' style='float:right;'></div>";
          }
          ?>
        </div>
			</div>
			<div id="threadDescr"></div>
			<div id="threadDetails">
				Created <span id="threadDate">3 mar 2016</span> by <span id="threadCreator">a97marb</span>
			</div>
		</div>

    <?php
    if ($threadAccess === "normal" || $threadAccess === "super" || $threadAccess === "op") {
      echo "<div class='threadMakeComment'>";
  			echo "<div class='makeCommentHeader'>";
  				echo "Comment";
  			echo "</div>";
  			echo "<div class='makeCommentInputWrapper'>";
  				echo "<textarea class='commentInput' name='commentInput' placeholder='Leave a comment' onkeyup='checkComment()'></textarea>";
  				echo "<input class='submit-button commentSubmitButton' type='button' value='Submit' onclick='makeComment();'>";
  			echo "</div>";
  		echo "</div>";
    }
    ?>

		<div id="threadComments"></div>


    <!-- Create thread -->
    <div id="createThreadWrapper">
      <div id="createThreadHeader">
        Create thread
      </div>
      <div id="createThreadBody">
        <div id="createThreadFormWrapper">
          <input type="text" name="threadTopic" id="threadTopicInput" placeholder="Topic"></input>
          <div id="createThreadDescrOptions">
              <button id="threadWriteButton" class="submit-button createThreadButton threadActiveButton" type="button" name="writeDescr" onclick="writeText()">Write</button>
              <button id="threadPreviewButton" class="submit-button createThreadButton" type="button" name="previewDescr" onclick="previewText()">Preview</button>

              <ul id="editorBarMenu">
                <li class="editorDropdown editorMarkdownIcon">
                    <div class="editorDropdownLink" >
                      <svg aria-hidden="true" class="octicon octicon-text-size" height="16" version="1.1" viewBox="0 0 18 16" width="18">
                          <path d="M17.97 14h-2.25l-0.95-3.25H10.7l-0.95 3.25H7.5l-0.69-2.33H3.53l-0.7 2.33H0.66l3.3-9.59h2.5l2.17 6.34 2.89-8.75h2.52l3.94 12zM6.36 10.13s-1.02-3.61-1.17-4.11h-0.08l-1.13 4.11h2.38z m7.92-1.05l-1.52-5.42h-0.06l-1.5 5.42h3.08z"></path>
                      </svg>
                    </div>
                    <div class="editorSubMenu headings">
                        <ul>
                            <li><h1>Heading 1</h1></li>
                            <li><h2>Heading 2</h2></li>
                            <li><h3>Heading 3</h3></li>
                        </ul>
                    </div>                
                </li>
            </ul>
            <svg aria-hidden="true" class="octicon octicon-bold editorMarkdownIcon" height="16" version="1.1" viewBox="0 0 10 16" width="10" title="We ask for your age only for statistical purposes.">
              <path d="M0 2h3.83c2.48 0 4.3 0.75 4.3 2.95 0 1.14-0.63 2.23-1.67 2.61v0.06c1.33 0.3 2.3 1.23 2.3 2.86 0 2.39-1.97 3.52-4.61 3.52H0V2z m3.66 4.95c1.67 0 2.38-0.66 2.38-1.69 0-1.17-0.78-1.61-2.34-1.61H2.13v3.3h1.53z m0.27 5.39c1.77 0 2.75-0.64 2.75-1.98 0-1.27-0.95-1.81-2.75-1.81H2.13v3.8h1.8z">
              </path>
            </svg>

            <svg aria-hidden="true" class="octicon octicon-italic editorMarkdownIcon" height="16" version="1.1" viewBox="0 0 6 16" width="6">
              <path d="M2.81 5h1.98L3 14H1l1.81-9z m0.36-2.7c0-0.7 0.58-1.3 1.33-1.3 0.56 0 1.13 0.38 1.13 1.03 0 0.75-0.59 1.3-1.33 1.3-0.58 0-1.13-0.38-1.13-1.03z"></path>
            </svg>

          </div>
          <div id="createThreadDescrWrapper">
              <textarea id="createThreadDescr" name="threadDescr" placeholder="Description"></textarea>
              <div id="editorPreviewText" name="threadDescr" placeholder="Preview" disabled></div>
          </div>
          <div id="createThreadOptions">
            <div class="createThreadOptionLabel">Course:</div>
            <select class="createThreadOption" id="createThreadCourseList" name="courseList" onchange="updateClassList()"></select>

            <div class="createThreadOptionLabel">Access:</div>
            <div class="createThreadRadioWrapper createThreadOption">
              <input id="threadRadioPublic" class="createThreadRadio" name="threadAccessRadio" type="radio" value="public" onclick="createThreadPublicUI();" checked="checked">
              <label for="threadRadioPublic">Public</label>
            </div>

            <div class="createThreadRadioWrapper createThreadOption">
              <input id="threadRadioPrivate" class="createThreadRadio" name="threadAccessRadio" type="radio" value="private" onclick="createThreadPrivateUI();">
              <label for="threadRadioPrivate">Private</label>
            </div>

            <!-- If thread is private -->
            <div id="createThreadPrivateWrapper">
              <div class="createThreadOptionLabel">Class:</div>
              <select class="createThreadOption" id="createThreadClassList" name="courseList" onchange="updateStudentList()"></select>
              <div class="createThreadOptionLabel">User:</div>
              <select class="createThreadOption" id="createThreadUserList" name="courseList"></select>
            </div>


            <div class="createThreadOptionLabel">Allow comments:</div>
            <div class="createThreadRadioWrapper createThreadOption">
              <input id="threadRadioOpen" class="createThreadRadio" name="threadAllowCommentsRadio" type="radio" value="open" checked="checked">
              <label for="threadRadioOpen">Open</label>
            </div>
            <div class="createThreadRadioWrapper createThreadOption">
              <input id="threadRadioLocked" class="createThreadRadio" name="threadAllowCommentsRadio" type="radio" value="locked">
              <label for="threadRadioLocked">Locked</label>
            </div>
          </div>
          <input id="submitThreadButton" class="submit-button createThreadButton" type="button" value="Submit" onclick="createThread();" style="background-color: rgb(97, 72, 117);">
        </div>
      </div>
    </div>
	</div>

	<!-- version identification -->
	<div id="version" class='version'>Master hash <br /><?php echo $version ?></div>
	<!-- content END -->
	<?php
	include '../Shared/loginbox.php';
	?>

</body>
</html>
