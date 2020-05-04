var modalRead = false; // Have the user read info?
var modal = document.getElementById('warning'); // Get the modal
var span = document.getElementsByClassName("close")[0]; // Get the button that opens the modal
var btn = document.getElementById("showModalBtn"); // Get the button that opens the modal

document.getElementById('dialogText').innerHTML="<div><h1>" +
"-!- READ THIS BEFORE YOU START -!-</h1><br>" +
"<br><br>" +
"current owner: " +
"<br>" +
"current os: " + 
"<br><br>" +
"To do this run the command:<br>" +
"<br>" +
"<input title='I have completed necessary steps' onclick='if(this.checked){haveRead(true)}else{haveRead(false)}' class='startCheckbox' type='checkbox' value='1' autofocus>" +
"<i>I promise I have done this.</i></div>";

btn.onclick = function () {
modal.style.display = "block";
}

function haveRead(isTrue) {
    modalRead = isTrue;
}

/*************           Function to set the first text           ****************/
/*************      Takes O/S of installing system as input       ****************/
/************* Easy to extend to new supported operating systems. ****************/
function setFirstText(os){
  var firstText;
  switch(os){
    case "Linux":
      firstText = "<h2>Make sure you set ownership of LenaSYS directory to 'www-data'.";
      break;
    case "Darwin":
      firstText = "<h2>Make sure you set ownership of LenaSYS directory to 'www'";
      break;
  }
  return firstText;
}

function setSecondText(os){
  var secondText;
  switch(os){
    case "Linux":
      secondText = "sudo chgrp -R www-data " + filePath + "<br>" + "sudo chown -R www-data " + filePath + "</h2><br>";
      break;
    case "Darwin":
      secondText = "sudo chgrp -R www " + filePath + "<br>" + "sudo chown -R www " + filePath + "</h2><br>";
      break;
  }
  return secondText;
}