<?php
    session_start();
    include_once "../Shared/sessions.php";
	include_once "../Shared/basic.php";
	#General vars regarding current dugga.
    #Strips and escapes output, should counteract XSS vulnerabilites.
    $strippedCid=strip_tags(getOPG('courseid'));
    $strippedVers=strip_tags(getOPG('coursevers'));
    $strippedQuizid=strip_tags(getOPG('did'));

	$cid=htmlspecialchars($strippedCid, ENT_QUOTES, 'UTF-8');
	$vers=htmlspecialchars($strippedVers, ENT_QUOTES, 'UTF-8');
	$quizid=htmlspecialchars($strippedQuizid, ENT_QUOTES, 'UTF-8');
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
    <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome = 1">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Diagram</title>
    <link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
    <link type="text/css" href="./diagram.css" rel="stylesheet">
    <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
    <link type="text/css" href="../Shared/css/mobile-diagram.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link id="themeBlack" type="text/css" href="../Shared/css/blackTheme.css" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=design_services" />
    <script src="darkmodeToggle.js"></script>
    <script src="../Shared/js/jquery-1.11.0.min.js"></script>
    <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  	<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  	<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="../Shared/dugga.js"></script>
    <script src="../Shared/markdown.js"></script>
    <script src="./diagram/classes/point.js"></script>
    <script src="./diagram/classes/rect.js"></script>
    <script src="./diagram/constants.js"></script>
    <script src="./diagram/defaults.js"></script>
    <script src="./diagram/globals.js"></script>
    <script src="./diagram/classes/element.js"></script>
    <script src="./diagram/classes/stateChange.js"></script>
    <script src="./diagram/helper.js"></script>
    <script src="./diagram/errorHandling.js"></script>
    <script src="./diagram/theme.js"></script>
    <script src="./diagram/draw/element.js"></script>
    <script src="./diagram/draw/line.js"></script>
    <script src="./diagram/draw/node.js"></script>
    <script src="./diagram/draw/ruler.js"></script>
    <script src="./diagram/draw/selection.js"></script>
    <script src="./diagram/draw/boxSelect.js"></script>
    <script src="./diagram/draw/update.js"></script>
    <script src="./diagram/message.js"></script>
    <script src="./diagram/toggle.js"></script>
    <script src="./diagram/draw/options.js"></script>
    <script src="./diagram/helpers/context.js"></script>
    <script src="./diagram/helpers/element.js"></script>
    <script src="./diagram/helpers/boxSelect.js"></script>
    <script src="./diagram/zoom.js"></script>
    <script src="./diagram/camera.js"></script>
    <script src="./diagram/tooltip_information.js"></script>
    <script src="./diagram/helpers/line.js"></script>
    <script src="./diagram/helpers/mouse.js"></script>
    <script src="./diagram/helpers/mouseMode.js"></script>
    <script src="./diagram/events/mouse.js"></script>
    <script defer src="diagram.js"></script>
    <script src="./assets/js/fetchDiagramInfo.js"></script>
</head>

<!-- No onload in body - eventlistener in diagram.js handles onload (top of INIT AND SETUP REGION) -->
<body style="overflow: hidden;">
    
    <!-- loading spinner -->
    <div id="loadingSpinner">
        <!-- this svg is here instaed of in its own file since, during development, -->
        <!-- this proved to load faster meaning the user spend less time staring at nothing -->
        <svg width="200" height="200" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <mask id="spinnerMask">
                <!-- Everything under a white pixel will be visible, and everything under a black pixel will be invisible -->
                <rect x="0" y="0" width="200" height="200" fill="white" />
                <rect x="100" y="-100" width="200" height="200" fill="black" />
            </mask>
            <circle cx="100" cy="100" r="90" fill="none" stroke="#775886" stroke-width="10" mask="url(#spinnerMask)"/>
        </svg>
    </div>

    <!-- Markdown document with keybinds -->
    <div id="markdownKeybinds" style="display: none">

    </div>
    
    <!-- The tooltip container that pops up with information based on where the user hovers -->
    <div class="diagram-tooltip" style="display:none;"></div>

    <!-- Used for calculating pixels per millimeter using offsetWidth. Note that in offsetWidth system scaling is not included
    and window.devicePixelRatio have to be included -->
    <div id="pixellength" style="width:1000mm;;padding:0px;visibility:hidden;"></div>

    <!-- The chevron/arrows used for toggling the diagram-toolbar on the right of the mobile version-->
    <div class="icon-wrapper-sidebar" onclick="secondToolbarToggle()">
        <i class="material-icons toggle-chevron-sidebar">keyboard_arrow_up</i>
    </div>

    <!-- The chevron/arrows used for toggling the diagram-toolbar-->
    <div class="icon-wrapper" onclick="toggleToolbar();">
        <i class="material-icons toggle-chevron">keyboard_arrow_up</i>
    </div>

    <!-- The FAB-btn for the diagram.php, STARTS HERE!" -->
        <div class="fixed-action-button diagram-fab">
        <ol class="fab-btn-list" style="margin-bottom: 60px; padding: 0; display: none;">
            <button id="fab-check" class="btn-floating fab-inner diagramIcons" type="button">
            <img class="icon-fit" src="../Shared/icons/LookingGlass.svg" alt="Check"/>
            </button>  
            <button id="fab-localSaveAs" class="btn-floating fab-inner diagramIcons" type="button">
            <img class="icon-fit" src="../Shared/icons/diagram_save_as_icon.svg" alt="Save as diagram"/>
            </button>  
            <button id="fab-localSave"  class="btn-floating fab-inner diagramIcons" type="button">
            <img class="icon-fit" src="../Shared/icons/save_button.svg" alt="Save diagram"/>
            </button>   
            <button id="fab-load" class="btn-floating fab-inner diagramIcons" type="button">
            <img class="icon-fit" src="../Shared/icons/diagram_load_icon.svg" alt="Load diagram"/>
            </button>  
        </ol>
            <button id="diagram-fab"class="fab-btn-lg btn-floating diagram-btn-fab">+</button>
        </div>
        <!-- FAB-btn ENDS HERE! -->
        <!-- The FAB-btn for the optionmenu, STARTS HERE!-->
        <div class="fixed-option-button tooltip-fab">
                
            <button id="fab-options"class="fab-btn-lg btn-floating option-btn-fab"><span id="options-fab" class="material-symbols-outlined">
                design_services</span>
            </button>
        </div>
        <!-- FAB-btn for optionmenu ENDS HERE! -->

    <!-- TOOLBAR STARTS HERE!! -->
    <!-- Holds all buttons in the left-hand toolbar of the diagram-page -->
    <div id="diagram-toolbar">
        <!-- MODES FIELD IN TOOLBAR -->
        <!-- Some of the modes have multiple options that show up when hovering over one of the buttons/options. -->
        <!-- When an option has been pressed, it shows up as the "default" in the toolbar, and so the options are written multiple times to mirror this behaviour -->
        <!-- "data-toolmode", is used for mapping to the correct object in the tooltip_information.js (e.g. "Pointer"==="Pointer") -->
        <!-- "data-toolid", is used for mapping to the correct ID for when creating the corresponding keybind.  -->
        <fieldset>
            <legend aria-hidden="true">Modes</legend>
                <!-- POINTER -->
                <div id="mouseMode0" onmouseenter='hidePlacementType()' data-single="true" class="diagramIcons toolbarMode active tooltip-target" onclick='setMouseMode(0);' data-toolmode="Pointer" data-toolid="0">
                    <img src="../Shared/icons/diagram_pointer_white.svg" alt="Pointer"/>
                </div>
                <!-- BOX SELECTION -->
                <div id="mouseMode1" onmouseenter='hidePlacementType()' data-single="true" class="diagramIcons toolbarMode tooltip-target" onclick='setMouseMode(1); ' data-toolmode="Box_Selection" data-toolid="1">
                    <img src="../Shared/icons/diagram_box_selection2.svg" alt="Box Selection"/>
                </div>
                <!-- ER, UML, IE, AND STATE ELEMENTS -->
                <div>
                    <!-- ER-ENTITY (initial default, on pageload, choice) -->
                    <div id="elementPlacement0" class="ERButton diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(0); setMouseMode(2);' onmouseenter='hoverPlacementButton(0)' data-toolmode="ER_Entity" data-toolid="2"><!--<-- UML functionality -->
                        <img src="../Shared/icons/diagram_entity.svg" alt="ER entity"/>
                        <div id="togglePlacementTypeButton0" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <!-- Pop-out panel for element-options -->
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(0), hidePlacementType()'>
                        <div id="togglePlacementTypeBox0" class="togglePlacementTypeBox togglePlacementTypeBoxEntity"><!--<-- UML functionality start-->
                            <!-- ER-ENTITY (fist option when hovering) -->
                            <div class="ERButton placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(0,0); setElementPlacementType(0); setMouseMode(2);' data-toolmode="ER_Entity" data-toolid="2">
                                <img src="../Shared/icons/diagram_entity.svg" alt="ER entity"/>
                            </div>
                            <!-- UML CLASS ("change to" - second option when hovering) -->
                            <div class="UMLButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(4,0); setElementPlacementType(4); setMouseMode(2);' data-toolmode="UML_Class" data-toolid="2">
                                <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                            </div>
                            <!-- IE-ENTITY ("change to" - third option when hovering) -->
                            <div class="IEButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(6,0); setElementPlacementType(6); setMouseMode(2);' data-toolmode="IE_Entity" data-toolid="2">
                                <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                            </div>
                            <!-- STATE DIAGRAM STATE ("change to" - fourth option when hovering) -->
                            <div class="SDButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(8,0); setElementPlacementType(8); setMouseMode(2);' data-toolmode="SD_State" data-toolid="2"> <!-- Dummy button, functions like IE-button -->
                                <img class="SDState-rounded" src="../Shared/icons/diagram_state.svg" alt="State diagram state"/>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- If UML CLASS has been chosen, the entity-options change position in the menu -->
                <div>
                    <!-- UML CLASS (When chosen, takes up the "default" position in the toolbar) -->
                    <div id="elementPlacement4" class="UMLButton diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(4); setMouseMode(2); 'onmouseenter='hoverPlacementButton(4)' data-toolmode="UML_Class" data-toolid="2">
                        <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                        <div id="togglePlacementTypeButton4" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <!-- Pop-out panel for element-options -->
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(4), hidePlacementType()'>
                        <div id="togglePlacementTypeBox4" class="togglePlacementTypeBox togglePlacementTypeBoxEntity tooltip-target" data-toolmode="ER_Entity" data-toolid="2">
                            <!-- ER-ENTITY ("Change to" - first option when hovering) -->
                            <div class="ERButton placementTypeBoxIcons" onclick='togglePlacementType(0,0); setElementPlacementType(0); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_entity.svg" alt="ER entity"/>
                            </div>
                            <!-- UML CLASS ("Change to" - second option when hovering) -->
                            <div class="UMLButton placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(4,0); setElementPlacementType(4); setMouseMode(2);' data-toolmode="UML_Class" data-toolid="2">
                                <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                            </div>
                            <!-- IE-ENTITY ("Change to" - third option when hovering) -->
                            <div class="IEButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(6,0); setElementPlacementType(6); setMouseMode(2);' data-toolmode="IE_Entity" data-toolid="2">
                                <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                            </div>
                            <!-- STATE DIAGRAM STATE ("Change to" - fourth option when hovering) -->
                            <div class="SDButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(8,0); setElementPlacementType(8); setMouseMode(2);' data-toolmode="SD_State" data-toolid="2"> <!-- Dummy button, functions like IE-button -->
                                <img class="SDState-rounded" src="../Shared/icons/diagram_state.svg" alt="State diagram state"/>
                            </div>
                        </div>
                    </div>
                </div><!--<-- UML functionality end -->
                <!-- If IE-ENTITY has been chosen, the entity-options change position in the menu -->
                <div>
                    <!-- IE-ENTITY (When chosen, takes up the "default" position in the toolbar) -->
                    <div id="elementPlacement6" class="IEButton diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(6); setMouseMode(2);'onmouseenter='hoverPlacementButton(6)' data-toolmode="IE_Entity" data-toolid="2">
                        <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                        <div id="togglePlacementTypeButton6" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <!-- Pop-out panel for element-options -->
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(6), hidePlacementType()'>
                        <div id="togglePlacementTypeBox6" class="togglePlacementTypeBox togglePlacementTypeBoxEntity" >
                            <!-- ER-ENTITY ("Change to" - first option when hovering) -->
                            <div class="ERButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(0,0); setElementPlacementType(0); setMouseMode(2);' data-toolmode="ER_Entity" data-toolid="2">
                                <img src="../Shared/icons/diagram_entity.svg" alt="ER entity"/>
                            </div>
                            <!-- UML CLASS ("Change to" - second option when hovering) -->
                            <div class="UMLButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(4,0); setElementPlacementType(4); setMouseMode(2);' data-toolmode="UML_Class" data-toolid="2">
                                <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                            </div>
                            <!-- IE-ENTITY ("Change to" - third option when hovering) -->
                            <div class="IEButton placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(6,0); setElementPlacementType(6); setMouseMode(2);' data-toolmode="IE_Entity" data-toolid="2">
                                <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                            </div>
                            <!-- STATE DIAGRAM STATE ("Change to" - fourth option when hovering) -->
                            <div class="SDButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(8,0); setElementPlacementType(8); setMouseMode(2);' data-toolmode="SD_State" data-toolid="2"> <!-- Dummy button, functions like IE-button -->
                                <img src="../Shared/icons/diagram_state.svg" alt="State diagram state"/>
                            </div>
                        </div>
                    </div>
                </div><!--<-- UML functionality end -->
                <!-- If STATE DIAGRAM STATE has been chosen, the entity-options change position in the menu -->
                <div>
                    <!-- STATE DIAGRAM STATE (When chosen, takes up the "default" position in the toolbar) -->
                    <div id="elementPlacement8" class="SDButton diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(8); setMouseMode(2);'onmouseenter='hoverPlacementButton(8);' data-toolmode="SD_STATE" data-toolid="2">
                        <img src="../Shared/icons/diagram_state.svg" alt="State diagram state"/>
                        <div id="togglePlacementTypeButton8" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <!-- Pop-out panel for element-options -->
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(8), hidePlacementType()'>
                        <div id="togglePlacementTypeBox8" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <div class="ERButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(0,0); setElementPlacementType(0); setMouseMode(2);' data-toolmode="ER_Entity" data-toolid="2">
                                <!-- ER-ENTITY ("Change to" - first option when hovering) -->
                                <img src="../Shared/icons/diagram_entity.svg" alt="ER entity"/>
                            </div>
                            <!-- UML CLASS ("Change to" - second option when hovering) -->
                            <div class="UMLButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(4,0); setElementPlacementType(4); setMouseMode(2);' data-toolmode="UML_Class" data-toolid="2">
                                <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                            </div>
                            <!-- IE-ENTITY ("Change to" - third option when hovering) -->
                            <div class="IEButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(6,0); setElementPlacementType(6); setMouseMode(2);' data-toolmode="IE_Entity" data-toolid="2">
                                <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                            </div>
                            <!-- STATE DIAGRAM STATE ("Change to" - fourth option when hovering) -->
                            <div class="SDButton placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(8,0); setElementPlacementType(8); setMouseMode(2);' data-toolmode="SD_State" data-toolid="2"> <!-- Dummy button, functions like IE-button -->
                                <img class="SDState-rounded" src="../Shared/icons/diagram_state.svg" alt="Statediagram state"/>
                            </div>
                        </div>
                    </div>        
                </div>
                <!--<-- State diagram functionality end -->

                <!-- RELATION, INHERITANCE, ATTRIBUTE -->
                <div>
                    <!-- ER RELATION (initial default choice) -->
                    <div id="elementPlacement1" class="ERButton diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(1); setMouseMode(2);' onmouseenter='hoverPlacementButton(1);' data-toolmode="ER_Relation" data-toolid="3"> <!--<-- UML functionality -->
                        <img src="../Shared/icons/diagram_relation.svg"  alt="ER relation"/>
                        <div id="togglePlacementTypeButton1" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div> 
                    <!-- Pop-out panel for element-options -->
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(1), hidePlacementType()'>
                        <div id="togglePlacementTypeBox1" class="togglePlacementTypeBox togglePlacementTypeBoxRI"><!--<-- UML functionality start-->
                            <!-- ER RELATION ("Change to" - first option when hovering) -->
                            <div class="ERButton placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(1,1); setElementPlacementType(1); setMouseMode(2);' data-toolmode="ER_Relation" data-toolid="3">
                                <img src="../Shared/icons/diagram_relation.svg" alt="ER relation"/>
                            </div>
                            <!-- ER ATTRIBUTE ("Change to" - second option when hovering) -->
                            <div class="ERAttribute placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(2,1);setElementPlacementType(2); setMouseMode(2);' data-toolmode="ER_Attribute" data-toolid="3">
                                <img src="../Shared/icons/diagram_attribute.svg" alt="ER Attribute"/>
                            </div>
                            <!-- UML INHERITANCE ("Change to" - third option when hovering) -->
                            <div class="UMLButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(5,1); setElementPlacementType(5); setMouseMode(2);' data-toolmode="UML_Inheritance" data-toolid="3">
                                <img src="../Shared/icons/diagram_inheritance.svg" alt="UML Inheritance"/>
                            </div>
                            <!-- IE INHERITANCE ("Change to" - fourth option when hovering) -->
                            <div class="IEButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(7,1); setElementPlacementType(7); setMouseMode(2);' data-toolmode="IE_Inheritance" data-toolid="3">
                                <img src="../Shared/icons/diagram_IE_inheritance.svg" alt="IE inheritance"/>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- If UML INHERITANCE has been chosen, the entity-options change position in the menu -->
                <div>
                    <!-- UML INHERITANCE (When chosen, takes up the "default" position in the toolbar) -->
                    <div id="elementPlacement5" class="UMLButton diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(5); setMouseMode(2);' onmouseenter='hoverPlacementButton(5)' data-toolmode="UML_Inheritance" data-toolid="3">
                        <img src="../Shared/icons/diagram_inheritance.svg" alt="UML inheritance"/>
                        <div id="togglePlacementTypeButton5" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>  
                    <!-- Pop-out panel for element-options -->
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(5), hidePlacementType()'>  
                        <div id="togglePlacementTypeBox5" class="togglePlacementTypeBox togglePlacementTypeBoxRI">
                            <!-- ER RELATION ("Change to" - first option when hovering) -->
                            <div class="ERButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(1,1); setElementPlacementType(1); setMouseMode(2);' data-toolmode="ER_Relation" data-toolid="3">
                                <img src="../Shared/icons/diagram_relation.svg" alt="ER Relation"/>
                            </div>
                            <!-- ER ATTRIBUTE ("Change to" - second option when hovering) -->
                            <div class="ERAttribute placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(2,1);setElementPlacementType(2); setMouseMode(2);' data-toolmode="ER_Attribute" data-toolid="3">
                                <img src="../Shared/icons/diagram_attribute.svg" alt="ER Attribute"/>
                            </div>
                            <!-- UML INHERITANCE ("Change to" - third option when hovering) -->
                            <div class="UMLButton placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(5,1); setElementPlacementType(5); setMouseMode(2);' data-toolmode="UML_Inheritance" data-toolid="3">
                                <img src="../Shared/icons/diagram_inheritance.svg" alt="UML inheritance"/>
                            </div>
                            <!-- IE INHERITANCE ("Change to" - fourth option when hovering) -->
                            <div class="IEButton placementTypeBoxIcons tooltip-target " onclick='togglePlacementType(7,1); setElementPlacementType(7); setMouseMode(2);' data-toolmode="IE_Inheritance" data-toolid="3">
                                <img src="../Shared/icons/diagram_IE_inheritance.svg" alt="IE inheritance"/>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- If IE INHERITANCE has been chosen, the entity-options change position in the menu -->
                <div>
                    <!-- IE INHERITANCE (When chosen, takes up the "default" position in the toolbar) -->
                    <div id="elementPlacement7" class="IEButton diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(7); setMouseMode(2);' onmouseenter='hoverPlacementButton(7)' data-toolmode="IE_Inheritance" data-toolid="3">
                        <img src="../Shared/icons/diagram_IE_inheritance.svg" alt="IE inheritance"/>
                        <div id="togglePlacementTypeButton7" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>  
                    <!-- Pop-out panel for element-options -->
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(7), hidePlacementType()'>  
                        <div id="togglePlacementTypeBox7" class="togglePlacementTypeBox togglePlacementTypeBoxRI">
                            <!-- ER RELATION ("Change to" - first option when hovering) -->
                            <div class="ERButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(1,1); setElementPlacementType(1); setMouseMode(2);' data-toolmode="ER_Relation" data-toolid="3">
                                <img src="../Shared/icons/diagram_relation.svg" alt="ER Relation"/>
                            </div>
                            <!-- ER ATTRIBUTE ("Change to" - second option when hovering) -->
                            <div class="ERAttribute placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(2,1);setElementPlacementType(2); setMouseMode(2);' data-toolmode="ER_Attribute" data-toolid="3">
                                <img src="../Shared/icons/diagram_attribute.svg" alt="ER Attribute"/>
                            </div>
                            <!-- UML INHERITANCE ("Change to" - third option when hovering) -->
                            <div class="UMLButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(5,1); setElementPlacementType(5); setMouseMode(2);' data-toolmode="UML_Inheritance" data-toolid="3">
                                <img src="../Shared/icons/diagram_inheritance.svg" alt="UML inheritance"/>
                            </div>
                            <!-- IE INHERITANCE ("Change to" - fourth option when hovering) -->
                            <div class="IEButton placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(7,1); setElementPlacementType(7); setMouseMode(2);' data-toolmode="IE_Inheritance" data-toolid="3">
                                <img src="../Shared/icons/diagram_IE_inheritance.svg" alt="IE inheritance"/>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- If ER ATTRIBUTE has been chosen, the entity-options change position in the menu -->
                <div>
                    <!-- ER ATTRIBUTE (When chosen, takes up the "default" position in the toolbar) -->
                    <div id="elementPlacement2" class="ERAttribute diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(2); setMouseMode(2);' onmouseenter='hoverPlacementButton(2)' data-toolmode="ER_Attribute" data-toolid="3">
                        <img src="../Shared/icons/diagram_attribute.svg" alt="ER Attribute"/>
                        <div id="togglePlacementTypeButton2" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>  
                    <!-- Pop-out panel for element-options -->
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(2), hidePlacementType()'>  
                        <div id="togglePlacementTypeBox2" class="togglePlacementTypeBox togglePlacementTypeBoxRI">
                            <!-- ER RELATION ("Change to" - first option when hovering) -->
                            <div class="ERButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(1,1); setElementPlacementType(1); setMouseMode(2);' data-toolmode="ER_Relation" data-toolid="3">
                                <img src="../Shared/icons/diagram_relation.svg" alt="ER Relation"/>
                            </div>
                            <!-- ER ATTRIBUTE ("Change to" - second option when hovering) -->
                            <div class="ERAttribute placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(2,1);setElementPlacementType(2); setMouseMode(2);' data-toolmode="ER_Attribute" data-toolid="3">
                                <img src="../Shared/icons/diagram_attribute.svg" alt="ER Attribute"/>
                            </div>
                            <!-- UML INHERITANCE ("Change to" - third option when hovering) -->
                            <div class="UMLButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(5,1); setElementPlacementType(5); setMouseMode(2);' data-toolmode="UML_Inheritance" data-toolid="3">
                                <img src="../Shared/icons/diagram_inheritance.svg" alt="UML inheritance"/>
                            </div>
                            <!-- IE INHERITANCE ("Change to" - fourth option when hovering) -->
                            <div class="IEButton placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(7,1); setElementPlacementType(7); setMouseMode(2);' data-toolmode="IE_Inheritance" data-toolid="3">
                                <img src="../Shared/icons/diagram_IE_inheritance.svg" alt="IE inheritance"/>
                            </div> 
                        </div>
                    </div>
                </div>
                <!-- LINE -->
                <div id="mouseMode3" onmouseenter='hidePlacementType()' data-single="true" class="diagramIcons toolbarMode tooltip-target" onclick='clearContext(); setMouseMode(3);' data-toolmode="Line" data-toolid="4">
                    <img src="../Shared/icons/diagram_line.svg" alt="Line"/>
                </div>

                <!-- OPTIONS FOR STATE ELEMENTS START HERE -->
                <div> 
                    <!-- UML INITIAL STATE (initial default choice) -->
                    <div id="elementPlacement9" class="SDButton diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(9); setMouseMode(2);' onmouseenter='hoverPlacementButton(9)' data-toolmode="UML_Initial_State" data-toolid="5"><!--<-- UML functionality -->
                        <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state"/>
                        <div id="togglePlacementTypeButton9" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>  
                    <!-- Pop-out panel for element-options -->  
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(9), hidePlacementType()'><!--Initial state -->
                        <div id="togglePlacementTypeBox9" class="togglePlacementTypeBox togglePlacementTypeBoxEntity"><!--<-- UML functionality start-->
                            <!-- UML INITIAL STATE ("Change to" - first option when hovering) -->
                            <div class="placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(9,9); setElementPlacementType(9); setMouseMode(2);' data-toolmode="UML_Initial_State" data-toolid="5">
                                <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state"/>
                            </div>
                            <!-- FINAL STATE ("Change to" - second option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(10,9); setElementPlacementType(10); setMouseMode(2);' data-toolmode="UML_Final_State" data-toolid="5">
                                <img src="../Shared/icons/diagram_UML_final_state.svg" alt="UML final state"/>
                            </div>
                            <!-- UML SUPER STATE ("Change to" - third option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(11,9); setElementPlacementType(11); setMouseMode(2);' data-toolmode="UML_Super_State" data-toolid="5">
                                <img src="../Shared/icons/diagram_super_state.svg" alt="UML super state"/>
                            </div>                           
                        </div>
                    </div>
                </div>
                <!-- If UML FINAL STATE has been chosen, the entity-options change position in the menu-->
                <div>
                <!-- UML FINAL STATE (When chosen, takes up the "default position in the toolbar) -->
                    <div id="elementPlacement10" class="SDButton diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(10); setMouseMode(2);' onmouseenter='hoverPlacementButton(10)' data-toolmode="UML_Final_State" data-toolid="5">
                        <img src="../Shared/icons/diagram_UML_final_state.svg" alt="UML final state"/>
                        <div id="togglePlacementTypeButton10" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <!-- Pop-out panel for element-options -->
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(10), hidePlacementType()'>
                        <div id="togglePlacementTypeBox10" class="togglePlacementTypeBox togglePlacementTypeBoxEntity"><!--<-- UML functionality start-->
                            <!-- UML INITIAL STATE ("Change to" - first option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(9,9); setElementPlacementType(9); setMouseMode(2);' data-toolmode="UML_Initial_State" data-toolid="5">
                                <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state"/>
                            </div>
                            <!-- FINAL STATE("Change to" - second option when hovering) -->
                            <div class="placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(10,9); setElementPlacementType(10); setMouseMode(2);' data-toolmode="UML_Final_State" data-toolid="5">
                                <img src="../Shared/icons/diagram_UML_final_state.svg" alt="UML final state"/>
                            </div>
                            <!-- SUPER STATE ("Chaange to" - third option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(11,9); setElementPlacementType(11); setMouseMode(2);' data-toolmode="UML_Super_State" data-toolid="5">
                                <img src="../Shared/icons/diagram_super_state.svg" alt="UML super state"/>
                            </div>                           
                        </div>
                    </div>
                </div><!--<-- UML functionality end -->
                <!-- If UML SUPER STATE has been chosen, the entity-options change position in the menu  -->
                <div>
                    <!-- UML SUPER STATE (When chosen, takes up the "default position in the toolbar)-->
                    <div id="elementPlacement11" class="SDButton diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(11); setMouseMode(2);' onmouseenter='hoverPlacementButton(11)' data-toolmode="UML_Super_State" data-toolid="5">
                        <img src="../Shared/icons/diagram_super_state.svg" alt="UML super state"/>
                        <div id="togglePlacementTypeButton11" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <!-- Pop-out panel for element-options -->
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(11), hidePlacementType()'>
                        <div id="togglePlacementTypeBox11" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <!-- UML INITIAL STATE ("Change to" - first option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(9,9); setElementPlacementType(9); setMouseMode(2);' data-toolmode="UML_Initial_State" data-toolid="5">
                                <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state"/>
                            </div>
                            <!-- FINAL STATE ("Change to" - second option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(10,9); setElementPlacementType(10); setMouseMode(2);' data-toolmode="UML_Final_State" data-toolid="5">
                                <img src="../Shared/icons/diagram_UML_final_state.svg" alt="UML final state"/>
                            </div>
                            <!-- SUPER STATE ("Change to" - third option when hovering) -->
                            <div class="placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(11,9); setElementPlacementType(11); setMouseMode(2);' data-toolmode="UML_Super_State" data-toolid="5">
                                <img src="../Shared/icons/diagram_super_state.svg" alt="UML super state"/>
                            </div>                           
                        </div>
                    </div>
                </div><!--<-- UML functionality end -->

                <!-- SEQUENCE POP-OUT START-->
                <div> 
                    <!-- SEQUENCE LIFELINE (initial default choice, and the same as the Sequence Lifeline (Actor)) -->
                    <div id="elementPlacement12" class="SEButton diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(12); setMouseMode(2);' onmouseenter='hoverPlacementButton(12)' data-toolmode="Sequence_Lifeline_Actor" data-toolid="6">
                        <img src="../Shared/icons/diagram_lifeline.svg" alt="sequnece diagram lifeline"/>
                        <div id="togglePlacementTypeButton12" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <!-- Pop-out panel for element-options -->
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(12), hidePlacementType()'>
                        <div id="togglePlacementTypeBox12" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <!-- SEQUENCE LIFELINE (ACTOR)(First option when hovering and the same as the initial option, as seen above this) -->
                            <div class="placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(12,12); setElementPlacementType(12); setMouseMode(2);'data-toolmode="Sequence_Lifeline_Actor" data-toolid="6"> 
                                <img src="../Shared/icons/diagram_lifeline.svg" alt="sequnece diagram lifeline object"/>
                            </div>
                            <!-- SEQUENCE LIFELINE (OBJECT) (Second option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(16,12); setElementPlacementType(16); setMouseMode(2);' data-toolmode="Sequence_Lifeline_Object" data-toolid="6"> 
                                <img src="../Shared/icons/diagram_sequence_object.svg" alt="sequnece diagram lifeline"/>
                            </div>
                            <!-- SEQUENCE ACTIVATION (Third option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(13,12); setElementPlacementType(13); setMouseMode(2);' data-toolmode="Sequence_Activation" data-toolid="7"> 
                                <img src="../Shared/icons/diagram_activation.svg" alt="Sequence activation"/>
                            </div>  
                            <!-- SEQUENCE OBJECT (Fourth option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(14,12); setElementPlacementType(14); setMouseMode(2);' data-toolmode="Sequence_Condition" data-toolid="8"> 
                                <img src="../Shared/icons/diagram_optionLoop.svg" alt="Option loop"/>
                            </div>                         
                        </div>
                    </div>
                </div>
                <!-- If SEQUENCE LIFELINE OBJECT has been chosen, the the entity-options change position in the menu -->
                <div> <!-- SEQUENCE LIFELINE OBJECT (When chosen, takes up the "default position in the toolbar) -->
                    <div id="elementPlacement16" class="SEButton diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(16); setMouseMode(2);' onmouseenter='hoverPlacementButton(16)' data-toolmode="Sequence_Lifeline_Object" data-toolid="6">
                        <img src="../Shared/icons/diagram_sequence_object.svg" alt="Sequence activation"/>
                        <div id="togglePlacementTypeButton16" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>  
                    <!-- Pop-out panel for element-options -->  
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(16), hidePlacementType()'>
                        <div id="togglePlacementTypeBox16" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <!-- SEQUENCE LIFELINE (ACTOR) (First option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(12,12); setElementPlacementType(12); setMouseMode(2);' data-toolmode="Sequence_Lifeline_Actor" data-toolid="6"> 
                                <img src="../Shared/icons/diagram_lifeline.svg" alt="sequnece diagram lifeline"/>
                            </div>
                            <!-- SEQUENCE LIFELINE (OBJECT) (Second option when hovering) -->
                            <div class="placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(16,12); setElementPlacementType(16); setMouseMode(2);' data-toolmode="Sequence_Lifeline_Object" data-toolid="6"> 
                                <img src="../Shared/icons/diagram_sequence_object.svg" alt="sequnece diagram lifeline"/>
                            </div>
                            <!-- SEQUENCE ACTIVATION (Third option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(13,12); setElementPlacementType(13); setMouseMode(2);' data-toolmode="Sequence_Activation" data-toolid="7"> 
                                <img src="../Shared/icons/diagram_activation.svg" alt="Sequence activation"/>
                            </div>  
                            <!-- SEQUENCE CONDITION (Fourth option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(14,12); setElementPlacementType(14); setMouseMode(2);' data-toolmode="Sequence_Condition" data-toolid="8"> 
                                <img src="../Shared/icons/diagram_optionLoop.svg" alt="Option loop"/>
                            </div>                         
                        </div>
                    </div>
                </div> 
                <!-- If SEQUENCE ACTIVATION START has been chosen, the element-options change position in menu -->
                <div> <!-- SEQUENCE ACTIVATION START (When chosen, takes up the "default position in the toolbar) -->
                    <div id="elementPlacement13" class="SEButton diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(13); setMouseMode(2);' onmouseenter='hoverPlacementButton(13)' data-toolmode="Sequence_Activation" data-toolid="7">
                        <img src="../Shared/icons/diagram_activation.svg" alt="Sequence activation"/>
                        <div id="togglePlacementTypeButton13" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>  
                    <!-- Pop-out panel for element-options -->  
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(13), hidePlacementType()'>
                        <div id="togglePlacementTypeBox13" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <!-- SEQUENCE LIFELINE (First option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(12,12); setElementPlacementType(12); setMouseMode(2);' data-toolmode="Sequence_Lifeline_Actor" data-toolid="6"> 
                                <img src="../Shared/icons/diagram_lifeline.svg" alt="sequnece diagram lifeline"/>
                            </div>
                            <!-- SEQUENCE LIFELINE (OBJECT) (Second option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(16,12); setElementPlacementType(16); setMouseMode(2);' data-toolmode="Sequence_Lifeline_Object" data-toolid="6"> 
                            <img src="../Shared/icons/diagram_sequence_object.svg" alt="sequnece diagram lifeline"/>
                            </div>
                            <!-- SEQUENCE ACTIVATION (Third option when hovering) -->
                            <div class="placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(13,12); setElementPlacementType(13); setMouseMode(2);' data-toolmode="Sequence_Activation" data-toolid="7"> 
                                <img src="../Shared/icons/diagram_activation.svg" alt="Sequence activation"/>
                            </div>    
                            <!-- SEQUENCE CONDITION (Fourth option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(14,12); setElementPlacementType(14); setMouseMode(2);' data-toolmode="Sequence_Condition" data-toolid="8"> 
                                <img src="../Shared/icons/diagram_optionLoop.svg" alt="Option loop"/>
                            </div>                         
                        </div>
                    </div>
                </div> 
                <!-- If SEQUENCE CONDITION/LOOP has been chosen, the element-options change position in the menu -->
                <div> <!-- SEQUENCE CONDITION/LOOP START (When chosen, takes up the "default position in the toolbar) -->
                    <div id="elementPlacement14" class="SEButton diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(14); setMouseMode(2); ' onmouseenter='hoverPlacementButton(14)' data-toolmode="Sequence_Condition" data-toolid="8">
                        <img src="../Shared/icons/diagram_optionLoop.svg" alt="Option loop"/>
                        <div id="togglePlacementTypeButton14" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>  
                    <!-- Pop-out panel for element-options --> 
                    <div id="diagramPopOut" onmouseleave='hoverPlacementButton(14), hidePlacementType()'>
                        <div id="togglePlacementTypeBox14" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <!-- SEQUENCE LIFELINE (ACTOR) (First option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(12,12); setElementPlacementType(12); setMouseMode(2);' data-toolmode="Sequence_Lifeline_Actor" data-toolid="6"> 
                                <img src="../Shared/icons/diagram_lifeline.svg" alt="sequnece diagram lifeline"/>
                            </div>
                            <!-- SEQUENCE LIFELINE (OBJECT) (Second option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(16,12); setElementPlacementType(16); setMouseMode(2);' data-toolmode="Sequence_Lifeline_Object" data-toolid="6"> 
                                <img src="../Shared/icons/diagram_sequence_object.svg" alt="sequnece diagram lifeline"/>
                            </div>
                            <!-- SEQUENCE ACIVATION (Third option when hovering) -->
                            <div class="placementTypeBoxIcons tooltip-target" onclick='togglePlacementType(13,12); setElementPlacementType(13); setMouseMode(2);' data-toolmode="Sequence_Activation" data-toolid="7"> 
                                <img src="../Shared/icons/diagram_activation.svg" alt="Sequence activation"/>
                            </div>  
                            <!-- EQUENCE CONDITION (Fourth option when hovering) -->
                            <div class="placementTypeBoxIcons activePlacementType tooltip-target" onclick='togglePlacementType(14,12); setElementPlacementType(14); setMouseMode(2);' data-toolmode="Sequence_Condition" data-toolid="8"> 
                                <img src="../Shared/icons/diagram_optionLoop.svg" alt="Option loop"/>
                            </div>                         
                        </div>
                    </div>
                </div> 
                <!-- SEQUENCE POP-OUT END -->
                
                <!-- NOTE ELEMENT -->
                <div id="elementPlacement15" onmouseenter='hidePlacementType()' data-single="true" class="diagramIcons toolbarMode tooltip-target" onclick='setElementPlacementType(15); setMouseMode(2);' data-toolmode="Note" data-toolid="9">
                    <img src="../Shared/icons/diagram_note.svg"/>
                </div>
        </fieldset>
        <!-- MODES FIELD ENDS HERE!! -->

        <!-- CAMERA FIELD IN TOOLBAR -->
        <fieldset>
            <legend aria-hidden="true">Camera</legend>
            <div id="camtoOrigo" data-single="true" class="diagramIcons tooltip-target" onclick="centerCamera();" data-toolmode="Camera" data-toolid="10">
                <img src="../Shared/icons/fullscreen.svg" alt="Reset view">
            </div>
        </fieldset>
        <!-- CAMERA FIELD IN TOOLBAR ENDS HERE!! -->

        <!-- HISTORY FIELD IN TOOLBAR -->
        <fieldset>
            <legend aria-hidden="true">History</legend>
            <!-- RESET DIAGRAM -->
            <div id="diagramReset" data-single="true" class="diagramIcons tooltip-target" onclick="resetDiagramAlert()" data-toolmode="Reset" data-toolid="11">
                <img src="../Shared/icons/diagram_Refresh_Button.svg" alt="Reset diagram"/>
            </div>
            <!-- REDO -->
            <div id="stepForwardToggle" data-single="true" class="diagramIcons tooltip-target" onclick="toggleStepForward()" data-toolmode="Redo" data-toolid="12">
                <img src="../Shared/icons/diagram_stepforward.svg" alt="Redo"/>
            </div>
            <!-- UNDO -->
            <div id="stepBackToggle" data-single="true" class="diagramIcons tooltip-target" onclick="toggleStepBack()" data-toolmode="Undo" data-toolid="13">
                <img src="../Shared/icons/diagram_stepback.svg" alt="Undo"/>
            </div>
            <!-- REPLAY MODE -->
            <div id="replayToggle" data-single="true" class="diagramIcons tooltip-target" onclick="toggleReplay()" data-toolmode="Replay_Mode" data-toolid="14">
                <img src="../Shared/icons/diagram_replay.svg" alt="Enter replay mode"/>
            </div>
        </fieldset>
        <!-- HISTORY FIED IN TOOLBAR ENDS HERE!! -->

        <!-- ER TABLE FIELD IN TOOLBAR -->
        <!-- When an ER table is open, it allows user to edit properties in the options-panel -->
        <fieldset>
            <legend aria-hidden="true">ER-Table</legend>
            <div id="erTableToggle" data-single="true" class="diagramIcons toolbarMode tooltip-target" onclick="toggleErTable()" data-toolmode="ER_Table" data-toolid="15">
                <img src="../Shared/icons/diagram_ER_table_info.svg" alt="Toggle ER-Table"/>
            </div>
        </fieldset>
        <!-- ER TABLE IN TOOLBAR ENDS HERE -->

        <!-- TESTCASE FIELD IN TOOLBAR -->
        <!-- Allows user to see properties for a state diagram in the options-panel -->
        <fieldset>
            <legend aria-hidden="true">Testcase</legend>
            <div id="testCaseToggle" data-single="true" class="diagramIcons toolbarMode tooltip-target" onclick="toggleTestCase()" data-toolmode="Testcase" data-toolid="16"> <!--add func here later-->
                <img src="../Shared/icons/diagram_ER_table_info.svg" alt="Toggle test-cases"/>
            </div>
        </fieldset> 
        <!-- TESTCASE FIELD IN TOOLBAR ENDS HERE!! -->

        <!-- CHECK FIELD IN TOOLBAR -->
        <!-- Toggle error-checking on/off -->
        <fieldset id = "errorCheckField">
        <legend aria-hidden="true">Check</legend>
            <div id="errorCheckToggle" data-single="true" class="diagramIcons tooltip-target" onclick="toggleErrorCheck()" data-toolmode="Error_Check" data-toolid="17">
                <img src="../Shared/icons/diagram_errorCheck.svg" alt="Toggle error check"/>
            </div>
        </fieldset>
        <!-- CHECK FIELD IN TOOLBAR ENDS HERE -->

        <!-- SAVE FIELD IN TOOLBAR (SAVE CURRENT FILE) -->
        <fieldset id="localSaveField" class="disabledIcon">
            <legend aria-hidden="true">Save</legend>
            <div id="localSave" class="diagramIcons tooltip-target" onclick="quickSaveDiagram()" data-toolmode="Save" data-toolid="18">
                <img src="../Shared/icons/diagram_save_icon.svg" alt="Save diagram"/>
            </div>
        </fieldset>
        <!-- SAVE FIELD IN TOOLBAR ENDS HERE -->

        <!-- SAVE AS FIELD IN TOOLBAR (SAVE CURRENT DIAGRAM TO FILE) -->
        <fieldset id="localSaveAsField" class="disabledIcon">
            <legend aria-hidden="true">Save As</legend>
            <div id="localSaveAs" class="diagramIcons tooltip-target" onclick="showSavePopout()" data-toolmode="Save_As" data-toolid="19">
                <img src="../Shared/icons/diagram_save_as_icon.svg" alt="Save diagram as"/>
            </div>
        </fieldset>
        <!-- SAVE AS FIELD IN TOOLBAR ENDS HERE!! -->

        <!-- LOAD FIELD IN TOOLBAR -->
        <fieldset id="localLoadField">
            <legend aria-hidden="true">Load</legend>
            <div id="localLoad" data-single="true" class="diagramIcons tooltip-target" onclick="showModal();" data-toolmode="Load" data-toolid="20">
                <img src="../Shared/icons/diagram_load_icon.svg" alt="Load diagram"/>
            </div>
        </fieldset>
        <!-- LOAD FIELD IN TOOLBAR ENDS HERE!! -->
    </div>
    <!-- TOOLBAR ENDS HERE!! -->
    
    <!-- POPUP FOR LOADINNG A FILE - NO SAVES FOUND -->
    <div class="loadModal hiddenLoad">
        <div id="loadHeader">
            <p id="loadTitle">Select a load:</p>
            <button id="closeLoadModal" onclick="closeModal();">&times;</button>
        </div>
        <div id="loadContainer"></div>
        <p id="amountOfLoads"><span id="loadCounter">0</span> saves found</p>
    </div>
    <div class="loadModalOverlay hiddenLoad"></div>

    <!-- POPUP FOR SAVING A FILE - FILENAME ALREADY EXISTS (OVERRIDEING FILE)  -->
    <div id="overrideContainer" class="loginBoxContainer" style="display:none">
        <div class="formBox">
            <div class="formBoxHeader">
                <h3>
                    Filename already exists!
                </h3>
                <div class="cursorPointer" onclick="closeOverridePopout()">
                    x
                </div>
            </div>
            <div id="savePopout" style="margin-top:15px;display:block">
                <div>
                    <p>Do you want to overwrite the existing file?</p>
                </div>
                <div class="button-row">
                    <button class="submit-button" onclick="closeOverridePopout(); showSavePopout();">Cancel</button>
                    <button class="submit-button" onclick="storeDiagramInLocalStorage(getCurrentFileName()); closeOverridePopout();">Overwrite</button>
                </div>
            </div>
        </div>
    </div>

    <!-- DISPLAYS THE NAME OF AN OPENED FILE -->
    <div id='diagramFileName' style='display: none;'> 
        <p>Current file: <span id='openedFileName'></span></p>
    </div>

    <!-- MESSAGE PROMPT -->
    <div id="diagram-message"></div>
    
    <!-- DIAGRAM DRAWING CANVAS -->
    <svg id="svgoverlay" preserveAspectRatio="none"></svg>
    <div id="container"></div><!-- Contains all elements (items) -->
    
    <!-- ONE SVG LAYER FOR BACKGROUND, ONE FOR FOREGROUND -->
    <svg id="svgbacklayer" preserveAspectRatio="none"></svg>

	<canvas id='canvasOverlay'></canvas> 
    <!-- DIAGRAM RULERS -->
    <div id="rulerOverlay">
        <div id="rulerCorner"></div>
        <svg id="ruler-x-svg"></svg>
        <svg id="ruler-y-svg"></svg>
        <div id="ruler-x"></div>
        <div id="ruler-y"></div>
    </div>
    
    <!-- DIAGRAM GRID -->
    <div id="svggrid">
        <svg id="svgbacklayer" class="svgbacklayer-background">
            <defs>
                <pattern id="grid" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100"/>
                </pattern>
            </defs>
            <rect id="grid_rect"/>
            <line id="origoX" x1="0%" y1="100" x2="100%" y2="100" />
            <line id="origoY" x1="100" y1="0%" x2="100" y2="100%" />
        </svg>  
    </div>
    <!-- A4 TEMPLATE -->
    <div id="a4Template">
        <svg id="svgA4Template">
            <rect id="a4Rect" x="100" y="100"/>
            <rect id="vRect" x="100" y="100"/>
            <text id="a4Text" x="880" y="90">A4</text>
        </svg>  
    </div> 
    <!-- ZOOMING CONTAINER -->
    <div id="zoom-container">
        <div id="zoom-message-box">
            <img src="../Shared/icons/zoom-message-icon.svg"/> 
            <!-- DISPLAYS CURRENT ZOOM-RATIO -->
            <text id ="zoom-message">1x</text>
        </div>
        <!-- ZOOM IN BUTTON -->
        <div class="diagramZoomIcons tooltip-target" onclick='zoomin();' data-toolmode="Zoom_In" data-toolid="21">
            <img src="../Shared/icons/diagram_zoomin.svg"/>
        </div>
        <!-- ZOOM OUT BUTTON -->
        <div class="diagramZoomIcons tooltip-target" onclick='zoomout();' data-toolmode="Zoom_Out" data-toolid="22">
            <img src="../Shared/icons/diagram_zoomout.svg"/>
        </div>
        <!-- RESET ZOOM BUTTON -->
        <div class="diagramZoomIcons tooltip-target" onclick="zoomreset()" data-toolmode="Zoom_Reset" data-toolid="23">
            <img src="../Shared/icons/diagram_zoomratio1to1.svg"/>
        </div>
    </div>

    <!-- OPTIONS PANE -->
    <!-- Yellow panel on the right side of the screen -->
    <div id="options-pane" class="hide-options-pane"> 
        <div id="options-pane-button" class="tooltip-target" onclick="toggleOptionsPane();" data-toolmode="Option_Panel" data-toolid="24">
            <span id='optmarker'>&#9660;Options</span>
        </div>

        <span class="close-btn" onclick="toggleOptionsPane();">&times;</span>

        <!-- FIELD FOR SMALLER FIELDS CONTAING THE OPTIONS -->
        <div id ="fieldsetBox">
            <fieldset id='propertyFieldset' class='options-fieldset options-fieldset-hidden'></fieldset>

            <!-- TOGGLE FIELD IN OPTIONS -->
            <fieldset class='options-fieldset options-section'>
                <legend>Toggle</legend>
                <button id="gridToggle" class="saveButton" onclick="toggleGrid();">Grid</button><br><br>
                <button id="rulerSnapToGrid" class="saveButton" onclick="toggleSnapToGrid()">Snap to grid</button><br><br>
                <button id="rulerToggle" class="saveButton" onclick="toggleRuler()">Ruler</button><br><br>
                <button id="a4TemplateToggle" class="saveButton" onclick="toggleA4Dropdown()">A4 template</button><br><br>
                <div id="dropDownContent">
                    <select id="a4OptionsDropdown" onchange="applyA4Option();">
                        <option value="vertical">Vertical</option>
                        <option value="horizontal">Horizontal</option>
                    </select>
                    <button class="saveButton" id="a4Load" onclick="toggleA4Template()">Load</button>
                </div>
                <button id="darkmodeToggle" class="saveButton" onclick="toggleDarkmode()">Darkmode</button><br><br>
                <button id="diagramDropDownToggle" class="saveButton" onclick="toggleDiagramDropdown()">Example diagrams </button><br><br>
                <div class="dropdownContent">
                    <select id="diagramTypeDropdown">
			<option value="JSON/EMPTYDiagramMockup.json">Empty board</option>
                        <option value="JSON/StateChartDiagramMockup.json">State chart diagrams</option>
                        <option value="JSON/IEDiagramMockup.json">IE diagrams</option>
                        <option value="JSON/UMLDiagramMockup.json">UML diagrams</option>
                        <option value="JSON/ERDiagramMockup.json">ER diagrams </option>
                    </select>
                    <button class="saveButton" id="diagramLoad" onclick="loadMockupDiagram();">Load</button>
                </div>
            </fieldset>
            <!-- TOGGLE FIELD ENDS HERE!! -->

            <!-- EXPORT FIELD IN OPTIONS -->
            <fieldset class='options-fieldset options-section'>
                <legend>Export</legend>
                <button class="saveButton" onclick="exportWithHistory();">With history</button><br><br>
                <button class="saveButton" onclick="exportWithoutHistory();">Without history</button>
            </fieldset>
            <!-- EXPORT FIELD ENDS HERE!! -->
            
            <!-- IMPORT FIELD IN OPTIONS -->
            <fieldset id="option-import" class='options-fieldset options-section'>
                <legend>Import</legend>
                <input id="importDiagramFile" type="file"><br><br>
                <button class="saveButton" onclick="loadDiagram();">Load</button>
            </fieldset>
            <!-- IMPORT FIELD ENDS HERE!! -->
        </div>
    </div>
    </div>
    <!-- REPLAY-MODE -->
    <div id="diagram-replay-box">
        <div style="display: flex;">
            <!-- PLAY/REPLAY/EXIT FIELD -->
            <fieldset style="display: flex; justify-content: space-between">
                <div id="diagram-replay-switch">
                    <div class="diagramIcons tooltip-target mb-tooltip" onclick="stateMachine.replay()" data-toolmode="Replay_Play">
                        <img src="../Shared/icons/Play.svg" alt="Play">
                    </div>
                </div>
                <div class="diagramIcons tooltip-target mb-tooltip" onclick="stateMachine.replay(-1)" data-toolmode="Replay">
                    <img src="../Shared/icons/replay.svg" alt="Replay">
                </div>
                <div class="diagramIcons tooltip-target mb-tooltip" onclick="exitReplayMode()" data-toolmode="Replay_Exit" data-toolid="25">
                    <img src="../Shared/icons/exit.svg" alt="Exit">
                </div>
            </fieldset>
            <!-- PLAY/REPLAY/EXIT FIELD ENDS HERE!! -->

            <!-- TIME DELAY FOR REPLAY -->
            <div id="replay-time-container">
                <label id="replay-time-label" for="replay-time">Delay (1s)</label>
                <input id="replay-time" onchange="setReplayDelay(this.value)" class="zoomSlider" type="range" min="1" max="9" value="5">
            </div>

            <!-- MOVE THROUGH REPLAY -->
            <div>
                <label for="replay-range">Change</label>
                <input id="replay-range" class="zoomSlider" onchange="changeReplayState(parseInt(this.value))" type="range" min="-1" max="-1">
            </div>
        </div>
    </div>

    <!-- ON-SCREEN MESSAGE DURING REPLAY-MODE -->
    <div id="diagram-replay-message">
        <h2>Replay mode</h2>
        <p>Press "ESCAPE" to exit the replay-mode.</p>
    </div>

    <!-- POPUP FOR SAVING A DIAGRAM (SAVE AS) -->
    <div id="savePopoutContainer" class="loginBoxContainer" style="display:none">
        <div class="formBox">
            <div class="formBoxHeader">
                <h3>
                    Save current diagram as:
                </h3>
                <div class="cursorPointer" onclick="hideSavePopout()">
                    x
                </div>
            </div>
            <div id="savePopout" style="margin-top:15px;display:block">
                <div class="inputwrapper">
                    <span style="margin-right:5px">Filename:</span>
                    <input class="textinput" type="text" id="saveDiagramAs" placeholder="Untitled" value='' autocomplete="off"/>
                </div>
                <div class="button-row">
                    <input type="submit" class="submit-button" onclick="saveDiagramAs(getCurrentFileName()); hideSavePopout();" value="Save"/>
                </div>
            </div>
        </div>
    </div>

    <!-- CONFIRMATION POPUP, USE loadConfirmPopup FUNCTION -->
    <div id="confirmationPopup" class="loginBoxContainer" style="display:none">  
        <div class="formBox">
            <div class="formBoxHeader">
                <h3 id="confirmPopupHeader">  </h3>
                <div id="closeWindow" class="cursorPointer">
                    x
                </div>
            </div>
            <p id="confrimPopupText">  </p>
            <div class="buttonGroup">
                <button class="confirmButton" id="confirmYes">Yes</button>
                <button class="confirmButton"  id="confirmNo">No</button>
            </div>
        </div>
    </div>


    <!--Mobile sidebar-->
    <nav id="mb-diagram-sidebar">
        <ul class="mb-nav-list">
        <?php
            if (checklogin()) {
                echo '
                <li  class="mb-nav-item" title="Log out">
                    <div class="mb-toolbar-box mb-toolbar-main active">
                        <button id="mb-logoutButton">
                            <img src="../Shared/icons/logout_button.svg" />
                        </button>
                    </div>
                </li>
                ';
            } else {
                echo '
                <li  class="mb-nav-item" title="Log in">
                    <div class="mb-toolbar-box mb-toolbar-main active">
                        <button id="mb-loginButton">
                            <img src="../Shared/icons/login_button.svg" />
                        </button>
                    </div>
                </li>
                ';
            }
        ?>
             <li class="mb-nav-item" title="Home">
                <div class="mb-toolbar-box mb-toolbar-main active">
                    <button id="mb-Home">
                        <img src="../Shared/icons/Home.svg">
                    </button>
                </div>
            </li>
              <li class="mb-nav-item" title="Back">
                <div class="mb-toolbar-box mb-toolbar-main active">
                    <button id="mb-backButton">
                        <img src="../Shared/icons/Up.svg"/>
                    </button>
                </div>
            </li>
              <li class="mb-nav-item" title="Save Dugga" >
                <div class="mb-toolbar-box mb-toolbar-main active">
                    <button id="mb-saveDuggaButton">
                        <img src="../Shared/icons/save_button.svg"  > 
                    </button>
                </div>
            </li>
            <li class="mb-nav-item" title="Load Dugga"> 
                <div class="mb-toolbar-box mb-toolbar-main active">
                    <button id="mb-loadDuggaButton">
                        <img src="../Shared/icons/Document.svg"> 
                    </button>
                </div>
            </li>
            <li class="mb-nav-item" title="Reset Dugga">
                <div class="mb-toolbar-box mb-toolbar-main active">
                    <button id="mb-resetDuggaButton">
                        <img src="../Shared/icons/diagram_Refresh_Button.svg"> 
                    </button>
                </div>
            </li>
            <li class="mb-nav-item" title="Dark Mode" >
                <div class="mb-toolbar-box mb-toolbar-main active">
                    <button id="mb-darkModeButton"> 
                        <img src="../Shared/icons/ThemeToggle.svg" > 
                    </button>
                </div>
            </li>

        </ul>
    </nav>

    <!-- MOBILE VERSION OF THE DIAGRAM-TOOLBAR, STARTS HERE! -->
    <!-- "mb", stands for mobile -->
    <!-- "mb-toolbar-main", is the active element that is shown when the sub menu is closed/hidden -->
    <!-- "title", a static and visible tooltip on top of every tooltip box -->
    <!-- "data-toolmode", is used for receiving the correct tooltip -->
    <!-- "data-elementtype", is used to match the active element with the element in the sub menu (see "activeSubMenuElement(...)") -->
    <!-- "data-placementtype", stores the elements' placementtype used for "setElementPlacementType(...) "-->
    <!-- "data-imagesrc", stores the image of the toolbar box -->
    <!-- "aria-hidden", is used to improve accesibility (for screen readers). true = hidden : false = visible-->
    <nav id="mb-diagram-toolbar" aria-hidden="true" style="display: none;">
        <ul class="mb-nav-list">

            <!-- POINTER -->
            <li class="mb-nav-item" title="Pointer">
                <div class="mb-toolbar-box mb-toolbar-main mb-tooltip active" data-toolmode="Pointer" onclick='setMouseMode(0);'>
                    <img src="../Shared/icons/diagram_pointer_white.svg" alt="Pointer"/>
                </div>
            </li>

            <!-- BOX SELECTION -->
            <li class="mb-nav-item" title="Box Selection">
                <div class="mb-toolbar-box mb-toolbar-main mb-tooltip" data-toolmode="Box_Selection" onclick='setMouseMode(1);'>
                    <img src="../Shared/icons/diagram_box_selection2.svg" alt="Box Selection"/>
                </div>
            </li>

            <!-- ENTITIES (ER, UML, IE, SD)-->
            <li class="mb-nav-item has-dropdown" title="Entities">
                <div class="mb-toolbar-box mb-toolbar-main mb-tooltip"
                    data-toolmode="ER_Entity" data-elementtype="ER-E" data-imagesrc="../Shared/icons/diagram_entity.svg" data-placementtype="0" onclick='setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);'>

                    <img src="../Shared/icons/diagram_entity.svg" alt="ER entity" class="active-image"/>
                </div>
                <!-- Sub menu for entities, STARTS HERE -->
                <ul class="mb-sub-menu" aria-hidden="true"> 
                    <li>
                        <div class="mb-toolbar-box mb-tooltip" 
                            data-toolmode="ER_Entity" data-elementtype="ER-E" data-imagesrc="../Shared/icons/diagram_entity.svg" data-placementtype="0" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img src="../Shared/icons/diagram_entity.svg" alt="ER entity"/>
                        </div>
                    </li>
                    <li>
                        <div class="mb-toolbar-box mb-tooltip" 
                            data-toolmode="UML_Class" data-elementtype="UML-C" data-imagesrc="../Shared/icons/diagram_UML_entity.svg" data-placementtype="4" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                        </div>
                    </li>
                    <li>
                        <div class="mb-toolbar-box mb-tooltip"
                            data-toolmode="IE_Entity" data-elementtype="IE-E" data-imagesrc="../Shared/icons/diagram_IE_entity.svg" data-placementtype="6" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                        </div>
                    </li>
                    <li>
                        <div class="mb-toolbar-box mb-tooltip"
                            data-toolmode="SD_State" data-elementtype="SD" data-imagesrc="../Shared/icons/diagram_state.svg" data-placementtype="8" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img class="SDState-rounded" src="../Shared/icons/diagram_state.svg" alt="State diagram state"/>
                        </div>
                    </li>
                </ul>
                <!-- Sub-menu for entities, ENDS HERE -->
                <div class="mb-dropdown-icon"><i class="material-icons">chevron_right</i></div>
            </li>

            <!-- THE DIFFERENT TYPES OF RELATIONS(e.g. inheritance and attributes) -->
            <li class="mb-nav-item has-dropdown" title="Relations">
                <div class="mb-toolbar-box mb-toolbar-main mb-tooltip"
                    data-toolmode="ER_Relation" data-elementtype="ER-R" data-imagesrc="../Shared/icons/diagram_relation.svg" data-placementtype="1" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                    <img src="../Shared/icons/diagram_relation.svg"  alt="ER relation" class="active-image"/>
                </div>
                <!-- Sub menu for relations, STARTS HERE -->
                <ul class="mb-sub-menu" aria-hidden="true"> 
                    <li>
                        <div class="mb-toolbar-box mb-tooltip" 
                            data-toolmode="ER_Relation" data-elementtype="ER-R" data-imagesrc="../Shared/icons/diagram_relation.svg" data-placementtype="1" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img src="../Shared/icons/diagram_relation.svg"  alt="ER relation"/>
                        </div>
                    </li>
                    <li>
                        <div class="mb-toolbar-box mb-tooltip"
                            data-toolmode="ER_Attribute" data-elementtype="ER-A" data-imagesrc="../Shared/icons/diagram_attribute.svg" data-placementtype="2" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img src="../Shared/icons/diagram_attribute.svg" alt="ER Attribute"/>
                        </div>
                    </li>
                    <li>
                        <div class="mb-toolbar-box mb-tooltip" 
                            data-toolmode="UML_Inheritance" data-elementtype="UML-I" data-imagesrc="../Shared/icons/diagram_inheritance.svg" data-placementtype="5" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img src="../Shared/icons/diagram_inheritance.svg" alt="UML Inheritance"/>
                        </div>
                    </li>
                    <li>
                        <div class="mb-toolbar-box mb-tooltip" 
                            data-toolmode="IE_Inheritance" data-elementtype="IE-I" data-imagesrc="../Shared/icons/diagram_IE_inheritance.svg" data-placementtype="7" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img src="../Shared/icons/diagram_IE_inheritance.svg" alt="IE inheritance"/>
                        </div>
                    </li>
                </ul>
                <!-- Sub-menu for relations, ENDS HERE -->
                <div class="mb-dropdown-icon"><i class="material-icons">chevron_right</i></div>
            </li>

            <li class="mb-nav-item" title="Line">
                <div class="mb-toolbar-box mb-toolbar-main mb-tooltip" data-toolmode="Line" onclick='clearContext(); setMouseMode(3);'>
                    <img src="../Shared/icons/diagram_line.svg" alt="Line"/>
                </div>
            </li>

            <!-- STATE DIAGRAM SYMBOLS -->
            <li class="mb-nav-item has-dropdown" title="SD Symbols">
                <div class="mb-toolbar-box mb-toolbar-main mb-tooltip" 
                    data-toolmode="UML_Initial_State" data-elementtype="UML-IS" data-imagesrc="../Shared/icons/diagram_UML_inital_state.svg" data-placementtype="9" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                    <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state" class="active-image"/>
                </div>
                <!-- Sub menu for State Diagram Symbols, STARTS HERE-->
                <ul class="mb-sub-menu" aria-hidden="true"> 
                    <li>
                        <div class="mb-toolbar-box mb-tooltip"
                            data-toolmode="UML_Initial_State" data-elementtype="UML-IS" data-imagesrc="../Shared/icons/diagram_UML_initial_state.svg" data-placementtype="9" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state"/>
                        </div>
                    </li>
                    <li>
                        <div class="mb-toolbar-box mb-tooltip"
                            data-toolmode="UML_Final_State" data-elementtype="UML-FS" data-imagesrc="../Shared/icons/diagram_UML_final_state.svg" data-placementtype="10" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img src="../Shared/icons/diagram_UML_final_state.svg" alt="UML final state"/>
                        </div>
                    </li>
                    <li>
                        <div class="mb-toolbar-box mb-tooltip"
                            data-toolmode="UML_Super_State" data-elementtype="UML-SS" data-imagesrc="../Shared/icons/diagram_super_state.svg" data-placementtype="11" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img src="../Shared/icons/diagram_super_state.svg" alt="UML super state"/>
                        </div>
                    </li>
                </ul>
                <!-- Sub-menu for State Diagram Symbols, ENDS HERE -->
                <div class="mb-dropdown-icon"><i class="material-icons">chevron_right</i></div>
            </li>

            <!-- SEQUENCE DIAGRAM SYMBOLS -->
            <li class="mb-nav-item has-dropdown" title="Sequence D">
                <div class="mb-toolbar-box mb-toolbar-main mb-tooltip"
                    data-toolmode="Sequence_Lifeline_Actor" data-elementtype="SL-A" data-imagesrc="../Shared/icons/diagram_lifeline.svg" data-placementtype="12" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                    <img src="../Shared/icons/diagram_lifeline.svg" alt="sequnece diagram lifeline" class="active-image"/>
                </div>
                <!-- Sub menu for Sequence Diagram Symbols, STARTS HERE -->
                <ul class="mb-sub-menu" aria-hidden="true"> 
                    <li>
                        <div class="mb-toolbar-box mb-tooltip"
                            data-toolmode="Sequence_Lifeline_Actor" data-elementtype="SL-A" data-imagesrc="../Shared/icons/diagram_lifeline.svg" data-placementtype="12" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img src="../Shared/icons/diagram_lifeline.svg" alt="sequnece diagram lifeline"/>
                        </div>
                    </li>
                    <li>
                        <div class="mb-toolbar-box mb-tooltip"
                            data-toolmode="Sequence_Lifeline_Object" data-elementtype="SL-O" data-imagesrc="../Shared/icons/diagram_sequence_object.svg" data-placementtype="16" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img src="../Shared/icons/diagram_sequence_object.svg" alt="sequnece diagram lifeline"/>
                        </div>
                    </li>
                    <li>
                        <div class="mb-toolbar-box mb-tooltip"
                            data-toolmode="Sequence_Activation" data-elementtype="SA" data-imagesrc="../Shared/icons/diagram_activation.svg" data-placementtype="13" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img src="../Shared/icons/diagram_activation.svg" alt="Sequence activation"/>
                        </div>
                    </li>
                    <li>
                        <div class="mb-toolbar-box mb-tooltip"
                            data-toolmode="Sequence_Condition" data-elementtype="SL" data-imagesrc="../Shared/icons/diagram_optionLoop.svg" data-placementtype="14" onclick="setElementPlacementType(parseInt(this.dataset.placementtype));setMouseMode(2);">

                            <img src="../Shared/icons/diagram_optionLoop.svg" alt="Option loop"/>
                        </div>
                    </li>
                </ul>
                <!-- Sub-menu for Sequence Diagram Symbols, ENDS HERE -->
                <div class="mb-dropdown-icon"><i class="material-icons">chevron_right</i></div>
            </li>

            <!-- NOTE -->
            <li class="mb-nav-item" title="Note">
                <div class="mb-toolbar-box mb-toolbar-main mb-tooltip" data-toolmode="Note" data-placementtype="15" onclick='setElementPlacementType(parseInt(this.dataset.placementtype)); setMouseMode(2);'>
                    <img src="../Shared/icons/diagram_note.svg"/>
                </div>
            </li>

            <!-- CAMERA -->
            <li class="mb-nav-item" title="Camera">
                <div class="mb-toolbar-box mb-toolbar-main non-element mb-tooltip" data-toolmode="Camera" onclick="centerCamera(); nonElementToggle(this);">
                    <img src="../Shared/icons/fullscreen.svg" alt="Reset view">
                </div>
            </li>

            <!-- HISTORY AND REPLAY MODE -->
            <li class="mb-nav-item" title="History">
                <div class="mb-toolbar-box mb-toolbar-main non-element mb-tooltip" data-toolmode="Reset" onclick="resetDiagramAlert(); nonElementToggle(this);">
                    <img src="../Shared/icons/diagram_Refresh_Button.svg" alt="Reset diagram"/>
                </div>
                <div class="mb-toolbar-box mb-toolbar-main non-element mb-tooltip" data-toolmode="Redo" onclick="toggleStepForward(); nonElementToggle(this);">
                    <img src="../Shared/icons/diagram_stepforward.svg" alt="Redo"/>
                </div>
                <div class="mb-toolbar-box mb-toolbar-main non-element mb-tooltip" data-toolmode="Undo" onclick="toggleStepBack(); nonElementToggle(this);">
                    <img src="../Shared/icons/diagram_stepback.svg" alt="Undo"/>
                </div>
                <div class="mb-toolbar-box mb-toolbar-main non-element mb-tooltip" data-toolmode="Replay_Mode" onclick="toggleReplay(); nonElementToggle(this);">
                    <img src="../Shared/icons/diagram_replay.svg" alt="Enter replay mode"/>
                </div>
            </li>

            <!-- ER-TABLE -->
            <li class="mb-nav-item" title="ER-Table">
                <div class="mb-toolbar-box mb-toolbar-main mb-tooltip" data-toolmode="ER_Table" onclick="toggleErTable();">
                    <img src="../Shared/icons/diagram_ER_table_info.svg" alt="Toggle ER-Table"/>
                </div>
            </li>
            
            <!-- TESTCASE -->
            <li class="mb-nav-item" title="Testcase">
                <div class="mb-toolbar-box mb-toolbar-main mb-tooltip" data-toolmode="Testcase" onclick="toggleTestCase();">
                    <img src="../Shared/icons/diagram_ER_table_info.svg" alt="Toggle test-cases"/>
                </div>
            </li>

            <!-- ERROR CHECK -->
            <!-- <li class="mb-nav-item">
                <div id="errorCheckToggle" class="mb-toolbar-box" data-mode="Error-Check" onclick="toggleErrorCheck();">
                    <img src="../Shared/icons/diagram_errorCheck.svg" alt="Toggle error check"/>
                </div>
            </li> -->

            <!-- Save -->
            <!-- <li class="mb-nav-item">
                <div class="mb-toolbar-box" data-mode="Save" onclick="quickSaveDiagram();">
                    <img src="../Shared/icons/diagram_save_icon.svg" alt="Save diagram"/>
                </div>
            </li> -->

            <!-- Save as-->
            <!-- <li class="mb-nav-item">
                <div class="mb-toolbar-box" data-mode="Save-As" onclick="showSavePopout();">
                    <img src="../Shared/icons/diagram_save_as_icon.svg" alt="Save diagram as"/>
                </div>
            </li> -->

            <!-- Load -->
            <!-- <li class="mb-nav-item">
                <div class="mb-toolbar-box" data-mode="Load" onclick="showModal();">
                    <img src="../Shared/icons/diagram_load_icon.svg" alt="Load diagram"/>
                </div>
            </li>
        </ul> -->
    </nav>

    <!-- CONTENT END -->

    <?php
        include '../Shared/loginbox.php';
        /*
        Code not used, commented out so that
        it can be used in the future.
        if(isset($_POST['id'])) {
        }*/
    ?>
</body>
</html>
