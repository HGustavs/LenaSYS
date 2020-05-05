var btn = document.getElementById("showModalBtn");
var modalRead = false; // Have the user read info?

btn.onclick = function () {
  modal.style.display = "block";
}

//---------------------------------------------------------------------------------------------------
// haveRead: Used for the permission-modal, called by getPermissionModalText()
//---------------------------------------------------------------------------------------------------    
function haveRead(isTrue) {
  modalRead = isTrue;
}