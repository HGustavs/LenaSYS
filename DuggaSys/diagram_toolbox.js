var val;

function initToolbox(){
    var element = document.getElementById('diagram-toolbar');
    var myCanvas = document.getElementById('myCanvas');
    var bound = myCanvas.getBoundingClientRect();
    element.style.top = (bound.top+"px");
    val = (localStorage.getItem("toolbarState") != null) ? localStorage.getItem("toolbarState") : 0;
    //element.style.height = (bound.bottom-bound.top-200+"px");
    //element.style.height = (400+"px");
}

function toggleToolbarMinimize(){
    if($("#minimizeArrow").hasClass("toolbarMaximized")){
        $(".application-toolbar").slideUp("fast");
        $("#minimizeArrow").removeClass("toolbarMaximized").addClass("toolbarMinimized");
    }else{
        $(".application-toolbar").slideDown("fast");
        $("#minimizeArrow").removeClass("toolbarMinimized").addClass("toolbarMaximized");
    }
}

//function for switching the toolbar state (All, ER, UML)
function switchToolbar(direction){
  var text = ["All", "ER", "UML"];
  if(direction == 'left'){
    val--;
    if(val < 0){
      val = 2;
    }
  }else if(direction == 'right'){
    val++;
    if(val > 2){
      val = 0;
    }
  }
  document.getElementById('toolbarTypeText').innerHTML = text[val];
  localStorage.setItem("toolbarState", val)
  //hides irrelevant buttons, and shows relevant buttons
  if(val == 1){
    $(".buttonsStyle").hide();
    $("#linebutton").show();
    $("#attributebutton").show();
    $("#entitybutton").show();
    $("#relationbutton").show();
  }else if( val == 2){
    $(".buttonsStyle").hide();
    $("#linebutton").show();
    $("#classbutton").show();
  }
  else{
    $(".buttonsStyle").show();
  }

  document.getElementById('toolbar-switcher').value = val;
}


$( function() {
    $( "#diagram-toolbar" ).draggable();
} );
