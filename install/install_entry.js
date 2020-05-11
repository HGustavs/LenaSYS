//---------------------------------------------------------------------------------------------------
// JavaScript entry file. Javascript-stuff that are needed from the start goes here.
//---------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------
// getPermissionModalText, f for functionVariable
//---------------------------------------------------------------------------------------------------
function getPermissionModalText(fOwner, fFilePath, fOperatingSystem){
  var permissionModalText = null;
  
  permissionModalText = `<h1>--- READ THIS BEFORE YOU START ---</h1><br>
  ${setFirstPermissionText(fOperatingSystem)}<br><br>
  Current Owner: ${fOwner}<br>
  Current OperatingSystem: ${fOperatingSystem}<br><br>
  To do this run the command: <br> ${setSecondPermissionText(fOperatingSystem, fFilePath)}\<br><br>
  <input title='I have completed necessary steps' onclick='if(this.checked){haveRead(true)}else{haveRead(false)}' class='startCheckbox' type='checkbox' value='1' autofocus>
  <i>I promise I have done this.</i>`

  return permissionModalText;
}

//-----------------------------------------------------------------------------------------------------------
// setFirstPermissionText: Sets the the first text for permission-modal, called by getPermissionModalText() (using fp not own, os)
//-----------------------------------------------------------------------------------------------------------
function setFirstPermissionText(fOperatingSystem){
  var firstText;
  switch(fOperatingSystem){
    case "Linux":
      firstText = "<h2>Make sure you set ownership of LenaSYS directory to 'www-data'.";
      break;
    case "Darwin":
      firstText = "<h2>Make sure you set ownership of LenaSYS directory to 'www'";
      break;
    case "Windows":
      firstText = "<h2>For Windows 10 with WAMP no additional permissions needs to be sat.";
      break;
  }
  return firstText;
}

//-----------------------------------------------------------------------------------------------------------
// setSecondPermissionText: Sets the the second text for permission-modal, called by getPermissionModalText() (using fp os not own)
//-----------------------------------------------------------------------------------------------------------
function setSecondPermissionText(fOperatingSystem, fFilePath){
  var secondText;
  switch(fOperatingSystem){
    case "Linux":
      secondText = "sudo chgrp -R www-data " + fFilePath + "<br>" + "sudo chown -R www-data " + fFilePath + "</h2><br>";
      break;
    case "Darwin":
      secondText = "sudo chgrp -R www " + fFilePath + "<br>" + "</h2><br>";
      break;
    case "Windows":
      secondText = "For Windows 10 with WAMP no additional permissions needs to be sat.</h2><br>";
      break;
  }
  return secondText;
}

//-----------------------------------------------------------------------------------------------------------
// selectText(): Used to copy text from container.
//-----------------------------------------------------------------------------------------------------------
/* Function to select and copy text inside code boxes at end of installation. */
function selectText(containerid) {
  /* Get selection inside div. */
  var text = document.getElementById(containerid);
  if (document.body.createTextRange) {
    var range = document.body.createTextRange();
    range.moveToElementText(text);
    range.select();
  } else {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /* Copy selection. */
  document.execCommand("copy");

  /* Remove selection. */
  window.getSelection().removeAllRanges();

  /* Show the 'copied' text to let user know that text was copied to clipboard.
  * After show animation is done it will call hide function to hide text again.
  */
  if (containerid === "codeBox1") {
    $("#copied1").show("slide", {direction: "left" }, 1000);
    window.setTimeout(function() { hideCopiedAgain("#copied1")}, 2000);
  } else if (containerid === "codeBox2") {
    $("#copied2").show("slide", {direction: "left" }, 1000);
    window.setTimeout(function() { hideCopiedAgain("#copied2")}, 2000);
  }
}

//-----------------------------------------------------------------------------------------------------------
// hideCopiedText(): Hide 'copied' text, used by selectText()
//-----------------------------------------------------------------------------------------------------------
function hideCopiedAgain(text) {
  $(text).hide("slide", {direction: "right"}, 1000)
}

/* Show/Hide installation progress. */
function toggleInstallationProgress(){
  $('#installationProgressWrap').toggle(500);
}