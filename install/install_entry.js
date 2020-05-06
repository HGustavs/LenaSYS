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
  <input title='I have completed necessary steps' onclick='if(this.checked){haveRead(true)}else{haveRead(false)}' class='startCheckbox' type='checkbox' value='1' autofocus>" +
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
  }
  return secondText;
}