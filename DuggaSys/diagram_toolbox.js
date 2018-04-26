var val = 0;

function initToolbox(){
    var element = document.getElementById('diagram-toolbar');
    var myCanvas = document.getElementById('myCanvas');
    var bound = myCanvas.getBoundingClientRect();
    element.style.top = (bound.top+"px");
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
    val = val <= 2 ? 2 : val--;
  }else if(direction == 'right'){
    val = val >= 2 ? 0 : val++;
  }
  document.getElementById('toolbarTypeText').innerHTML = text[val];

  //hides irrelevant buttons, and shows relevant buttons
  if(val == 1){
    $(".tooltipDialog").hide();
  }else{
    $(".tooltipDialog").show();
  }

  document.getElementById('toolbar-switcher').value = val;
}


$( function() {
    $( "#diagram-toolbar" ).draggable();
} );
