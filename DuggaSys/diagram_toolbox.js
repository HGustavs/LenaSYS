var toolbarState;

function initToolbox(){
    var element = document.getElementById('diagram-toolbar');
    var myCanvas = document.getElementById('myCanvas');
    var bound = myCanvas.getBoundingClientRect();
    element.style.top = (bound.top+"px");
    toolbarState = (localStorage.getItem("toolbarState") != null) ? localStorage.getItem("toolbarState") : 0;
    switchToolbar();
    element.style.display = "inline-block";
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
  var text = ["All", "ER", "UML", "Free"];
  if(direction == 'left'){
    toolbarState--;
    if(toolbarState < 0){
      toolbarState = 3;
    }
  }else if(direction == 'right'){
    toolbarState++;
    if(toolbarState > 3){
      toolbarState = 0;
    }
  }
  document.getElementById('toolbarTypeText').innerHTML = text[toolbarState];
  localStorage.setItem("toolbarState", toolbarState);
  //hides irrelevant buttons, and shows relevant buttons
  if(toolbarState == 1){
    $(".toolbar-drawer").hide();
    $("#drawerTools").show();
    $("#drawerCreate").show();
    $(".tlabel").hide();
    $("#labelCreate").show();
    $("#labelTools").show();
    $("#labelUndo").show();
    $(".buttonsStyle").hide();
    $("#linebutton").show();
    $("#attributebutton").show();
    $("#entitybutton").show();
    $("#relationbutton").show();
  }else if( toolbarState == 2){
    $(".toolbar-drawer").hide();
    $("#drawerTools").show();
    $("#drawerCreate").show();
    $(".tlabel").hide();
    $("#labelCreate").show();
    $("#labelTools").show();
    $("#labelUndo").show();
    $(".buttonsStyle").hide();
    $("#linebutton").show();
    $("#classbutton").show();
  }else if(toolbarState == 3){
    $(".toolbar-drawer").hide();
    $("#drawerDraw").show();
    $(".tlabel").hide();
    $("#labelDraw").show();
    $("#labelUndo").show();
    $(".buttonsStyle").hide();
    $("#squarebutton").show();
    $("#drawfreebutton").show();
  }
  else{
    $(".toolbar-drawer").show();
    $(".label").show();
    $(".buttonsStyle").show();
  }

  document.getElementById('toolbar-switcher').value = toolbarState;
}


$( function() {
    $( "#diagram-toolbar" ).draggable();
} );
