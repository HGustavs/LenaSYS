function initToolbox(){
    var element = document.getElementById('diagram-toolbar');
    var myCanvas = document.getElementById('myCanvas');
    var bound = myCanvas.getBoundingClientRect();
    element.style.top = (bound.top+"px");
    //element.style.height = (bound.bottom-bound.top-200+"px");
    //element.style.height = (400+"px");
}

function toggleToolboxMinimize(){
    if($("#toolbar-minimize").hasClass("toolboxMaximized")){
        $(".application-toolbar").hide();
        $("#toolbar-minimize").removeClass("toolboxMaximized").addClass("toolboxMinimized");
    }else{
      $(".application-toolbar").show();
      $("#toolbar-minimize").removeClass("toolboxMinimized").addClass("toolboxMaximized");
    }
}

$( function() {
    $( "#diagram-toolbar" ).draggable();
} );
