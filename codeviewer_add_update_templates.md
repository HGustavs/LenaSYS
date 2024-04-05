# CodeViewer: Add/Update Templates

> Documentation of how to add and update codeviewer template/boxes


# Files

**These are the files that needs to be updated/added:**

 - codeviewer.php
 - template"template number".css
 - codeviewerService.php
 - codeviewer.js
 - template"template number"_butt.svg

# template"template number".css
In this file we have the initial positioning of all the boxes. Each box has a wrapper around it and this wrapper is what you target with the css. If your template has 2 boxes you need to target a #box1wrapper and #box2wrapper. If you have more boxes just add an entry for those boxes.

**For creating new template:**
Go into the folder Shared/css. Here create a new css file and find the template with the highest number in its name. If the highest number was 6 add 1 to that. This means your file should be named template7.css and then add the css to this file.

**For updating existing template:**
Find out the name of the template you want to update. Then locate its css file in Shared/css.

**Example from template4.css:**

    #box1wrapper {
    position: absolute;
    top: 0px;
    left: 0px;
    width: -moz-calc(50.0%);
    width: -webkit-calc(50.0%);
    width: calc(50.0%);
    height: -webkit-calc(35%);
    height: -moz-calc(35%);
    height: calc(35%);
    max-width: 90%;
    min-width: 10%;
    max-height: 90%;
    min-height: 10%;
    }
    

# codeviewer.php

**If you create new template:**
First add new table data to the chooseTemplateContainer table. To find it search for: chooseTemplateContainer in your text editor and then below you can see `<td>` tags for every template. Add a new row for your template. If you copy and paste one of the existing entries remember to change the number to the number your new template will have this includes: id, onclick, src (to the icon).

    <td  id="templat4"  class="tmpl"><img  class='templatethumbicon wiggle'  onclick='changetemplate("4");'  src='../Shared/icons/template4_butt.svg'  /></td>

# codeService.php

**If you create new template:**
Search for: There are at least two boxes, create two boxes to start with

Below you have to add an entry for the new template. Lets say the name of the new template is  template12 and it has 3 boxes. Then we would add an entry for it at this row:

    if($templateNumber==3||$templateNumber==4 ||$templateNumber==8) $boxCount=3;

**it should be changed to:**

    if($templateNumber==3||$templateNumber==4 ||$templateNumber==8 ||$templateNumber12) $boxCount=3;

# codeviewer.js

## maximizeBoxes:

**For creating new template:**
Locate the function: maximizeBoxes. This function makes boxes able to be maximized quickly by pressing a button. To add this function to the new template scroll down to the bottom of the function and add an if statement for the new template. If your templates name is template12 its templateid == 12. Now try to find a template with the same amount of boxes in this function and start out by trying something similar. You might have to align the boxes with a different function or order depending on the layout of your template.

## resizeBoxes:


**For creating new template:**
Look at the function resizeBoxes. And find an entry with the same amount of boxes as the new template. Lets say we have a new template with 3 boxes. Then you would start out by copy and pasting an already existing entry that also has 3 boxes. For this example we copy the entry for template 6 but change the templateid to look for the new end number for the new template. So for template12:

    else  if (templateId  ==  12) {
    
      
    
    getLocalStorageProperties(templateId, boxValArray);
    
    $("#box3wrapper").css("top", localStorage.getItem("template6box2heightPercent") +  "%");
    
      
      
    
        $(boxValArray['box1']['id']).resizable({
        
        containment:  parent,
        
        handles:  "e",
        
        start:  function(event, ui) {
        
        $('iframe').css('pointer-events','none');
        
        },
        
        resize:  function(e, ui){
        
        alignWidth4boxes(boxValArray, 1, 2, 3, 4);
        
        $(boxValArray['box1']['id']).height(100  +  "%");
        
          
        
        },
        
        stop:  function(e, ui) {
        
        setLocalStorageProperties(templateId, boxValArray);
        
        $('iframe').css('pointer-events','auto');
        
        }
        
        });
        
          
        
        $(boxValArray['box2']['id']).resizable({
        
        containment:  parent,
        
        handles:  "s",
        
        start:  function(event, ui) {
        
        $('iframe').css('pointer-events','none');
        
        },
        
        resize:  function(e, ui){
        
        alignBoxesHeight3stack(boxValArray, 2, 3, 4);
        
        $(boxValArray['box3']['id']).css("left", " ");
        
        $(boxValArray['box2']['id']).css("left", " ");
        
        },
        
        stop:  function(e, ui) {
        
        setLocalStorageProperties(templateId, boxValArray);
        
        $('iframe').css('pointer-events','auto');
        
        }
        
        });
        
          
        
        $(boxValArray['box3']['id']).resizable({
        
        containment:  parent,
        
        handles:  "s",
        
        start:  function(event, ui) {
        
        $('iframe').css('pointer-events','none');
        
        },
        
        resize:  function(e, ui){
        
        $(boxValArray['box4']['id']).css("top", " ");
        
        alignBoxesHeight3stackLower(boxValArray, 2, 3, 4);
        
        },
        
        stop:  function(e, ui) {
        
        $(boxValArray['box4']['id']).css("top", " ");
        
        setLocalStorageProperties(templateId, boxValArray);
        
        $('iframe').css('pointer-events','auto');
        
        }
        
        });
Then you would have to edit the copied code to match your layout better. But this is the easiest and fastest way to do it.

## resizeBoxes:

**For creating a new template:**

Locate the function erasePercentageGap. Here you need to add an entry for the new template.

# template"template number"_butt.svg


**Create a new svg icon for the new template:**
The icon should be in this kid of style:
![Template SVG Icon](https://lh3.googleusercontent.com/bng0Y1m7T413Nic5asvxhgULFVIGvAzHdZM62eFeJI_cjQJI1EnXhrMVzbJKmbItTewb2bgy-p4a "Icon")
Add the newly created template icon to this folder /Shared/icons
