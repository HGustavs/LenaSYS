//------------------------------------------------------------------------------------------------------
// JavaScript defer file. Stuff that needs to be loaded defer (after php-file have been run) goes here.
//------------------------------------------------------------------------------------------------------

var btn = document.getElementById("showModalBtn");
var modalRead = false; // Have the user read info?
var leftArrow = document.getElementById('leftArrow');
var rightArrow = document.getElementById('rightArrow');
var submitButton = document.getElementById('submitInput');
var inputPage = 1;
var previousInputPage = 0;

//---------------------------------------------------------------------------------------------------
// On-click function for the permission-button
//---------------------------------------------------------------------------------------------------    
btn.onclick = function () {
  modal.style.display = "block";
}

//---------------------------------------------------------------------------------------------------
// haveRead: Used for the permission-modal, called by getPermissionModalText()
//---------------------------------------------------------------------------------------------------    
function haveRead(isTrue) {
  modalRead = isTrue;
}

//---------------------------------------------------------------------------------------------------
// Javascript functions for arrow functionality
//---------------------------------------------------------------------------------------------------    

/* Function to focus the right box on the page */
function focusTheRightBox() {
  if (inputPage === 1 || inputPage === 2) {
    var fields = document.getElementsByClassName("page" + inputPage + "input");
    for (var i = 0; i < fields.length; i++) {
      if (fields[i].value === ''){
        fields[i].focus();
        break;
      }
    }
  } 
  else if (inputPage === 4) {
    if (document.getElementById("writeOver1").checked) {
      document.getElementById("writeOver2").focus();
    } else {
      document.getElementById("writeOver1").focus();
    }
  }
}

leftArrow.onclick = function() {
  previousInputPage = inputPage;
  if(inputPage > 1) inputPage--;
  updateInputPage();
  focusTheRightBox();
};

rightArrow.onclick = function() {
  /* Only continue if all fields on current page are filled out */
  if (inputPage === 1 || inputPage === 2) {
    var fields = document.getElementsByClassName("page" + inputPage + "input");
    var found = false; /* Is an empty field found? */
    for (var i = 0; i < fields.length; i++) {
      if (fields[i].value === ''){
        if (inputPage === 2 && fields[1]) {
          found = false;  /* Ignores empty if the input field is for root password, because the installation should not limit this */
        }else {
          found = true;  /* Empty field found */
        }
        /* Set background of text field to light red */
        fields[i].setAttribute("style", "background-color:rgb(255,210,210)");
      }
    }
    if (!found){
      /* If no empty field was found - proceed and reset values of text fields and hide warning text */
      document.getElementById("enterFields" + inputPage).style.display = "none";
      previousInputPage = inputPage;
      if (inputPage < 5) inputPage++;
      for (var i = 0; i < fields.length; i++) {
        fields[i].setAttribute("style", "background-color:rgb(255,255,255)");
      }
      updateInputPage();
    } else {
      /* Show the warning text if empty field was found */
      document.getElementById("enterFields" + inputPage).style.display = "inline-block";
    }
  } else {
    /* Only page 1 and 2 has text fields so the rest have no rules */
    previousInputPage = inputPage;
    if (inputPage < 5) inputPage++;
    updateInputPage();
  }
};

/* Remove default behaviour (click submit button) when pressing enter */
$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode === 13) {
      event.preventDefault();
      return false;
    }
  });
});

/* You want to be able to press enter to continue, this function fixes this. */
document.addEventListener("keydown", function(e) {
  if(e.keyCode === 13){
    if (modal.style.display === "none"){
      if (inputPage < 5) {
        /* Only continue if all fields on current page are filled out */
        if (inputPage === 1 || inputPage === 2) {
          var fields = document.getElementsByClassName("page" + inputPage + "input");
          var found = false; /* Is an empty field found? */
          for (var i = 0; i < fields.length; i++) {
            if (fields[i].value === ''){
              if (inputPage === 2 && fields[1]) {
                found = false;  /* Ignores empty if the input field is for root password, because the installation should not limit this */
              }else {
                found = true;  /* Empty field found */
              }
              /* Set background of text field to light red */
              fields[i].setAttribute("style", "background-color:rgb(255,210,210)");
            }
          }
          if (!found){
            /* If no empty field was found - proceed and reset values of text fields and hide warning text */
            document.getElementById("enterFields" + inputPage).style.display = "none";
            previousInputPage = inputPage;
            inputPage++;
            for (var i = 0; i < fields.length; i++) {
              fields[i].setAttribute("style", "background-color:rgb(255,255,255)");
            }
            updateInputPage();
          } else {
            /* Show the warning text if empty field was found */
            document.getElementById("enterFields" + inputPage).style.display = "inline-block";
          }
        } else {
          /* Only page 1 and 2 has text fields so the rest have no rules */
          previousInputPage = inputPage;
          inputPage++;
          updateInputPage();
        }
      } else if (inputPage === 5){
        submitButton.click();
      }
    }
  }
});

function updateInputPage(){
  /* Hide current input page */
  hideInputPage();
  /* Show the new input page when animation is done */
  window.setTimeout(showInputPage,500);

  /* Dont show left arrow on first page and dont show right arrow on last page */
  if (inputPage === 1) {
    document.getElementById('leftArrow').style.display = "none";
  } else {
    document.getElementById('leftArrow').style.display = "block";
  }
  if (inputPage === 5) {
    document.getElementById('rightArrow').style.display = "none";
  } else {
    document.getElementById('rightArrow').style.display = "block";
  }
}

function hideInputPage(){
  /* Slide away the old page from the right direction depending on new page */
  if (inputPage > previousInputPage) {
    $('#th' + previousInputPage).hide("slide", {direction: "left" }, 500);
    $('#td' + previousInputPage).hide("slide", {direction: "left" }, 500);
  } else {
    $('#th' + previousInputPage).hide("slide", {direction: "right" }, 500);
    $('#td' + previousInputPage).hide("slide", {direction: "right" }, 500);
  }
}

function showInputPage(){
  /* Slide the new page from the right direction depending on previous page */
  if (inputPage > previousInputPage) {
    $('#th' + inputPage).show("slide", {direction: "right" }, 500);
    $('#td' + inputPage).show("slide", {direction: "right" }, 500);
  } else {
    $('#th' + inputPage).show("slide", {direction: "left" }, 500);
    $('#td' + inputPage).show("slide", {direction: "left" }, 500);
  }
  window.setTimeout(focusTheRightBox,500);
}

//---------------------------------------------------------------------------------------------------
// Javascript to focus the right input box after modal is closed and hide boxes
//---------------------------------------------------------------------------------------------------    

/* When the user clicks on <span> (x), close the modal */
span.onclick = function() {
  if (modalRead) {
      modal.style.display = "none";
      focusTheRightBox();
  }
}

/* When the user clicks anywhere outside of the modal, close it */
window.onclick = function(event) {
  if (event.target == modal && modalRead) {
      modal.style.display = "none";
      focusTheRightBox();
  }
}

var writeOver1 = document.getElementById('writeOver1');
writeOver1.onclick = function() {
  focusTheRightBox();
}

/* Hide testdata boxes when testdata is un-checked */
function fillDBchange(checkbox) {
  if (checkbox.checked === true){
      $("#testdataBoxes").show("slide", {direction: "left" }, 500);
  } else {
      $("#testdataBoxes").hide("slide", {direction: "left" }, 500);
  }
}

function createDBchange(checkbox) {
  if (checkbox.checked === true){
      $("#DBboxes").show("slide", {direction: "left" }, 500);
  } else {
      $("#DBboxes").hide("slide", {direction: "left" }, 500);
  }
}

