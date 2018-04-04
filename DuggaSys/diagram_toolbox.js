function initToolbox(){
    var element = document.getElementById('diagram-toolbar');
    var myCanvas = document.getElementById('myCanvas');
    var bound = myCanvas.getBoundingClientRect();
    element.style.top = (bound.top+"px");
    //element.style.height = (bound.bottom-bound.top-200+"px");
    //element.style.height = (400+"px");
}

function toggleToolbarMinimize(){
  console.log("Jag var här");
    if($("#toolbar-minimize").hasClass("toolbarMaximized")){
      console.log("Tjooooo");
        $(".application-toolbar").hide();
        $("#toolbar-minimize").removeClass("toolbarMaximized").addClass("toolboxMinimized");
    }else{
      console.log("byeee");
        $(".application-toolbar").show();
        $("#toolbar-minimize").removeClass("toolbarMinimized").addClass("toolboxMaximized");
    }
}

$( function() {
    $( "#diagram-toolbar" ).draggable();
} );
