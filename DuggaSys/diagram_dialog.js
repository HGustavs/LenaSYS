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
    objectAppearanceMenu(form);
}
function closeAppearanceDialogMenu() {
    /*
     * Closes the dialog menu for appearance.
     */
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
            closeAppearanceDialogMenu();
        }
    });
}

function dimDialogMenu(dim) {
    if (dim == true) {
        $("#appearance").css("display", "block");
        $("#overlay").css("display", "block");
    } else {
        $("#appearance").css("display", "none");
        $("#overlay").css("display", "none");
    }
}

function loadFormIntoElement(element, dir){
    //Ajax
    var file = new XMLHttpRequest();
    file.open('GET', dir);
    file.onreadystatechange = function(){
        element.innerHTML = file.responseText;
        loadFromDiagram();
    }
    file.send();
}

function loadFromDiagram() {
    document.getElementById('nametext').value = diagram[lastSelectedObject].name;
    document.getElementById('object_type').value = diagram[lastSelectedObject].key_type;
    document.getElementById('symbolColor').value = diagram[lastSelectedObject].symbolColor;
    document.getElementById('font').value = diagram[lastSelectedObject].font;
    document.getElementById('fontColor').value = diagram[lastSelectedObject].fontColor;
    document.getElementById('TextSize').value = diagram[lastSelectedObject].sizeOftext;
}

//--------------------------------------------------------------------
// Functionality
// Different types of dialog windows
//--------------------------------------------------------------------

function globalAppearanceMenu(){
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
        loadFormIntoElement(form, 'forms/line_appearance.php');
    }
    if (diagram[lastSelectedObject].symbolkind == 5) {
        loadFormIntoElement(form, 'forms/relation_appearance.php');
    }
}
function changeObjectAppearance(object_type){
    /*
     * USES DIALOG TO CHANGE OBJECT APPEARANCE
     */

    if (diagram[lastSelectedObject].symbolkind == 4) {
        diagram[lastSelectedObject].key_type = document.getElementById('object_type').value;
    } else {
        diagram[lastSelectedObject].symbolColor = document.getElementById('symbolColor').value;
        diagram[lastSelectedObject].name = document.getElementById('nametext').value;
        diagram[lastSelectedObject].fontColor = document.getElementById('fontColor').value;
        diagram[lastSelectedObject].font = document.getElementById('font').value;
        diagram[lastSelectedObject].sizeOftext = document.getElementById('TextSize').value;
        diagram[lastSelectedObject].key_type = document.getElementById('object_type').value;
    }
    updateGraphics();
}
