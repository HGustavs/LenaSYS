//--------------------------------------------------------------------
// Basic functionality
// The building blocks for creating the menu
//--------------------------------------------------------------------
function showMenu(){
    canvas.style.cursor = "default";
    $("#appearance").show();
    $("#appearance").width("auto");
    dimDialogMenu(true);
    hashCurrent();
    return document.getElementById("f01");
}
function openAppearanceDialogMenu() {
    /*
     * Opens the dialog menu for appearance.
     */
    var form = showMenu();
    appearanceMenuOpen = true;
    objectAppearanceMenu(form);
}
function closeAppearanceDialogMenu() {
    /*
     * Closes the dialog menu for appearance.
     */
    appearanceMenuOpen = false;
    globalAppearanceValue = 0;
    hashFunction();
    $("#appearance").hide();
    dimDialogMenu(false);
    document.removeEventListener("click", clickOutsideDialogMenu);
}

function clickOutsideDialogMenu(ev) {
    /*
     * Closes the dialog menu when click is done outside box.
     */
    $(document).mousedown(function (ev) {
        var container = $("#appearance");
        if (!container.is(ev.target) && container.has(ev.target).length === 0) {
            globalAppearanceValue = 0;
            closeAppearanceDialogMenu();
        }
    });
}

function clickEnterOnDialogMenu(ev) {
    /*
     * Closes the dialog menu when the enter button is pressed.
     */
    $(document).keypress(function (ev) {
        var container = $("#appearance");
        if (ev.which == 13) {
            globalAppearanceValue = 0;
            closeAppearanceDialogMenu();

            // Is called in the separate appearance php-files at the buttons.
            // Called here since an enter press doesn't relate to any element
            changeObjectAppearance();
        }
    });
}

function dimDialogMenu(dim) {
    if (dim == true) {
        $("#appearance").css("display", "flex");
        //$("#overlay").css("display", "block");
    } else {
        $("#appearance").css("display", "none");
        //$("#overlay").css("display", "none");
    }
}

function loadFormIntoElement(element, dir){
  //Ajax
  var file = new XMLHttpRequest();
  file.open('GET', dir);
  file.onreadystatechange = function(){

    if(file.readyState === 4){
      element.innerHTML = file.responseText;
      if(globalAppearanceValue == 0){
        document.getElementById('nametext').value = diagram[lastSelectedObject].name;
        setSelectedOption('object_type', diagram[lastSelectedObject].key_type);
        setSelectedOption('symbolColor', diagram[lastSelectedObject].symbolColor);
        setSelectedOption('font', diagram[lastSelectedObject].font);
        setSelectedOption('fontColor', diagram[lastSelectedObject].fontColor);
        setSelectedOption('TextSize', diagram[lastSelectedObject].sizeOftext);
        setSelectedOption('AttributeLineColor', diagram[lastSelectedObject].strokeColor);
      }
    }
  }
  file.send();
}

function loadLineForm(element, dir){
    //Ajax
    var file = new XMLHttpRequest();
    file.open('GET', dir);
    file.onreadystatechange = function(){
        if(file.readyState === 4){
            element.innerHTML = file.responseText;
            if(globalAppearanceValue == 0){
                var cardinalityVal = diagram[lastSelectedObject].cardinality[0].value
                var tempCardinality = cardinalityVal == "" || cardinalityVal == null ? "None" : cardinalityVal;

                setSelectedOption('object_type', diagram[lastSelectedObject].key_type);
                setSelectedOption('cardinality', tempCardinality);
            }
        }
    }
    file.send();
}

function setSelectedOption(type, value){
  if(type != null){
    for(var i = 0; i < document.getElementById(type).options.length; i++){
      if(value == document.getElementById(type).options[i].value){
        document.getElementById(type).value = value;
        document.getElementById(type).options[i].selected = "true";
        break;
      }else{
        document.getElementById(type).options[i].selected = "false";
      }
    }
  }
}

//--------------------------------------------------------------------
// Functionality
// Different types of dialog windows
//--------------------------------------------------------------------

function globalAppearanceMenu(){
    globalAppearanceValue = 1;
    //open a menu to change appearance on all entities.
    var form = showMenu();
    //AJAX
    loadFormIntoElement(form,'forms/global_appearance.php');
}

function objectAppearanceMenu(form) {
    /*
    * EDITS A SINGLE OBJECT WITHIN THE DIAGRAM
    */

    form.innerHTML = "No item selected<type='text'>";
    if (diagram[lastSelectedObject].symbolkind == 1) {
        loadFormIntoElement(form, 'forms/class_appearance.php');
    }
    if (diagram[lastSelectedObject].symbolkind == 2) {
        loadFormIntoElement(form, 'forms/attribute_appearance.php');
    }
    if (diagram[lastSelectedObject].symbolkind == 3) {
        loadFormIntoElement(form, 'forms/entity_appearance.php');
    }
    if (diagram[lastSelectedObject].symbolkind == 4) {
        loadLineForm(form, 'forms/line_appearance.php');
    }
    if (diagram[lastSelectedObject].symbolkind == 5) {
        loadFormIntoElement(form, 'forms/relation_appearance.php');
    }
    if (diagram[lastSelectedObject].kind == 1) {
        loadFormIntoElement(form, 'forms/figure_appearance.php');
    }
}
function changeObjectAppearance(object_type){
    /*
    * USES DIALOG TO CHANGE OBJECT APPEARANCE
    */

    if (diagram[lastSelectedObject].symbolkind == 4) {
        diagram[lastSelectedObject].key_type = document.getElementById('object_type').value;
    } else if (diagram[lastSelectedObject].kind == 1){
        diagram[lastSelectedObject].fillColor = document.getElementById('figureFillColor').value;
        diagram[lastSelectedObject].strokeColor = document.getElementById('figureLineColor').value;
    } else {
        diagram[lastSelectedObject].symbolColor = document.getElementById('symbolColor').value;
        diagram[lastSelectedObject].name = document.getElementById('nametext').value;
        diagram[lastSelectedObject].fontColor = document.getElementById('fontColor').value;
        diagram[lastSelectedObject].font = document.getElementById('font').value;
        diagram[lastSelectedObject].sizeOftext = document.getElementById('TextSize').value;
        diagram[lastSelectedObject].key_type = document.getElementById('object_type').value;
        diagram[lastSelectedObject].strokeColor = document.getElementById('AttributeLineColor').value;
    }
    updateGraphics();
}

function createCardinality(){
    //Setting cardinality on new line
    if(diagram[lineStartObj].symbolkind == 5 && diagram[hovobj].symbolkind == 3){
      diagram[diagram.length-1].cardinality[0] = ({"value": "", "isCorrectSide": false});
    }
    else if(diagram[lineStartObj].symbolkind == 3 && diagram[hovobj].symbolkind == 5) {
      diagram[diagram.length-1].cardinality[0] = ({"value": "", "isCorrectSide": true});
    }
}
function changeCardinality(){
    var val = document.getElementById('cardinality').value;

    //Setting existing cardinality value on line
    if(val == "None") val = "";
    if(diagram[lastSelectedObject].cardinality[0].value != null){
        diagram[lastSelectedObject].cardinality[0].value = val;
}
}
