<?php
    session_start();
    include_once "../Shared/sessions.php";
	include_once "../Shared/basic.php";
	try {
        $cid = getOPG('courseid');
        $vers = getOPG('coursevers');
        $quizid = getOPG('did');
    
        if (!$cid || !$vers || !$quizid) {
            throw new Exception("Missing required parameters.");
        }
    
    } catch (Exception $e) {
        handleError($e->getMessage());
    }

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
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

        <!-- To enable dark mode, these 2 files were added. -->
    <link id="themeBlack" type="text/css" href="../Shared/css/blackTheme.css" rel="stylesheet">
    <script src="darkmodeToggle.js"></script>
    <script src="../Shared/js/jquery-1.11.0.min.js"></script>
    <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
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
    <script src="./diagram/helpers/line.js"></script>
    <script src="./diagram/helpers/mouse.js"></script>
    <script src="./diagram/helpers/mouseMode.js"></script>
    <script src="./diagram/events/mouse.js"></script>
    <script defer src="diagram.js"></script>
    <script src="./assets/js/fetchDiagramInfo.js"></script>
</head>
<!-- instead of onload on body there is an event listener for loaded in diagram.js at the top of the INIT AND SETUP REGION -->
<body style="overflow: hidden;">
    
    <!-- loading spinner -->
    <div id="loadingSpinner">
        <!-- this svg is here instaed of in its own file since, during development, -->
        <!-- this proved to load faster meaning the user spend less time staring at nothing -->
        <svg width="200" height="200" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <mask id="spinnerMask">
                <!-- Everything under a white pixel will be visible -->
                <rect x="0" y="0" width="200" height="200" fill="white" />
                <!-- Everything under a black pixel will be invisible -->
                <rect x="100" y="-100" width="200" height="200" fill="black" />
            </mask>
            <!-- its just a circle with a mask -->
            <circle cx="100" cy="100" r="90" fill="none" stroke="#775886" stroke-width="10" mask="url(#spinnerMask)"/>
        </svg>
    </div>

    <!-- Markdown document with keybinds -->
    <div id="markdownKeybinds" style="display: none">

    </div>

     <!-- Used for calculating pixels per millimeter using offsetWidth. Note that in offsetWidth system scaling is not included
    and window.devicePixelRatio have to be included -->
    <div id="pixellength" style="width:1000mm;;padding:0px;visibility:hidden;"></div>

    <!-- Toolbar for diagram -->
    <div id="diagram-toolbar">
        <fieldset>
            <legend aria-hidden="true">Modes</legend>
                <div id="mouseMode0" class="diagramIcons toolbarMode active" onclick='setMouseMode(0);'>
                    <img src="../Shared/icons/diagram_pointer_white.svg" alt="Pointer"/>
                    <span class="toolTipText" id="highestToolTip"><b>Pointer</b><br>
                        <span>Allows you to select and move different elements as well as navigate the workspace</span><br>
                        <span id="tooltip-POINTER" class="key_tooltip">Keybinding:</span>
                    </span>
                </div>
                <div id="mouseMode1" class="diagramIcons toolbarMode" onclick='setMouseMode(1);'>
                    <img src="../Shared/icons/diagram_box_selection2.svg" alt="Box Selection"/>
                    <span class="toolTipText"><b>Box Selection</b><br>
                        <p>Click and drag to select multiple elements within the selected area</p><br>
                        <p id="tooltip-BOX_SELECTION" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
                <div>
                    <div id="elementPlacement0"
                         class="ERButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(0); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp()'
                         onmousedown="holdPlacementButtonDown(0)"><!--<-- UML functionality -->
                        <img src="../Shared/icons/diagram_entity.svg" alt="ER entity"/>
                        <span class="toolTipText"><b>ER entity</b><br>
                            <p>Add an ER entity to the diagram</p>
                            <p>Each entity represents an object which is a representation of concepts or data.</p>
                            <p>The entity only holds the name of the object and if it depends on another object.</p>
                            <br>
                            <p id="tooltip-PLACE_ENTITY" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton0" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>    
                    <div id="diagramPopOut">
                        <div id="togglePlacementTypeBox0" class="togglePlacementTypeBox togglePlacementTypeBoxEntity"><!--<-- UML functionality start-->
                            <div class="ERButton placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(0,0); setElementPlacementType(0); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_entity.svg" alt="ER entity"/>
                                <span class="placementTypeToolTipText"><b>ER entity</b><br>
                                    <p>Each entity represents an object which is a representation of concepts or data.</p>
                                    <p>The entity only holds the name of the object and if it depends on another object.</p>
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons" onclick='togglePlacementType(4,0); setElementPlacementType(4); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                                <span class="placementTypeToolTipText"><b>UML class</b><br>
                                    <p>Change to UML class</p>
                                    <p>Each class entity represents its own class along with the attributes and operations held within the class.</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons" onclick='togglePlacementType(6,0); setElementPlacementType(6); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                                <span class="placementTypeToolTipText"><b>IE entity</b><br>
                                    <p>Change to IE entity</p>
                                    <p>Each entity represents an object along with its attributes.</p>
                                    <p>Each entity is represented by a table with a field that shows attributes.</p>
                                </span>
                            </div>
                            <div class="SDButton placementTypeBoxIcons" onclick='togglePlacementType(8,0); setElementPlacementType(8); setMouseMode(2);' > <!-- Dummy button, functions like IE-button -->
                                <img class="SDState-rounded" src="../Shared/icons/diagram_state.svg" alt="State diagram state"/>
                                <span class="placementTypeToolTipText"><b>State diagram state</b><br>
                                    <p>Change to state diagram state</p>
                                    <p>A state diagram state is a representation of a status a process can have.</p>
                                    <p>Each state represents a unique status that a process can have.</p>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div id="elementPlacement4"
                         class="UMLButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(4); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp();'
                         onmousedown="holdPlacementButtonDown(4)">
                        <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                        <span class="toolTipText"><b>UML class</b><br>
                            <p>Add an UML class to the diagram</p>
                            <p>Each class entity represents its own class along with the attributes and operations held within the class.</p>
                            <br>
                            <p id="tooltip-PLACE_ENTITY" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton4" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <div id="diagramPopOut">
                        <div id="togglePlacementTypeBox4" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <div class="ERButton placementTypeBoxIcons" onclick='togglePlacementType(0,0); setElementPlacementType(0); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_entity.svg" alt="ER entity"/>
                                <span class="placementTypeToolTipText"><b>ER entity</b><br>
                                    <p>Change to ER entity</p>
                                    <p>Each entity represents an object which is a representation of concepts or data.</p>
                                    <p>The entity only holds the name of the object and if it depends on another object.</p>
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(4,0); setElementPlacementType(4); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                                <span class="placementTypeToolTipText"><b>UML class</b><br>                      
                                    <p>Each class entity represents its own class along with the attributes and operations held within the class.</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons" onclick='togglePlacementType(6,0); setElementPlacementType(6); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                                <span class="placementTypeToolTipText"><b>IE entity</b><br>
                                    <p>Change to IE entity</p>
                                    <p>Each entity represents an object along with its attributes.</p>
                                    <p>Each entity is represented by a table with a field that shows attributes.</p>
                                </span>
                            </div>
                            <div class="SDButton placementTypeBoxIcons" onclick='togglePlacementType(8,0); setElementPlacementType(8); setMouseMode(2);' > <!-- Dummy button, functions like IE-button -->
                                <img class="SDState-rounded" src="../Shared/icons/diagram_state.svg" alt="State diagram state"/>
                                <span class="placementTypeToolTipText"><b>State diagram state</b><br>
                                    <p>Change to state diagram state</p>
                                    <p>A state diagram state is a representation of a status a process can have.</p>
                                    <p>Each state represents a unique status that a process can have.</p>
                                </span>
                            </div>
                        </div>
                    </div>
                </div><!--<-- UML functionality end -->
                <div>
                    <div id="elementPlacement6"
                         class="IEButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(6); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp();'
                         onmousedown="holdPlacementButtonDown(6)">
                        <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                        <span class="toolTipText"><b>IE entity</b><br>
                            <p>Add an IE entity to the diagram</p>
                            <p>Each entity represents an object along with its attributes.</p>
                            <p>Each entity is represented by a table with a field that shows attributes.</p>
                            <br>
                            <p id="tooltip-PLACE_IEENTITY" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton6" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <div id="diagramPopOut">
                        <div id="togglePlacementTypeBox6" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <div class="ERButton placementTypeBoxIcons" onclick='togglePlacementType(0,0); setElementPlacementType(0); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_entity.svg" alt="ER entity"/>
                                <span class="placementTypeToolTipText"><b>ER entity</b><br>
                                    <p>Change to ER entity</p>
                                    <p>Each entity represents an object which is a representation of concepts or data.</p>
                                    <p>The entity only holds the name of the object and if it depends on another object.</p>
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons" onclick='togglePlacementType(4,0); setElementPlacementType(4); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                                <span class="placementTypeToolTipText"><b>UML class</b><br>
                                    <p>Change to UML class</p>
                                    <p>Each class entity represents its own class along with the attributes and operations held within the class.</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(6,0); setElementPlacementType(6); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                                <span class="placementTypeToolTipText"><b>IE entity</b><br>
                                    <p>Each entity represents an object along with its attributes.</p>
                                    <p>Each entity is represented by a table with a field that shows attributes.</p>
                                </span>
                            </div>
                            <div class="SDButton placementTypeBoxIcons" onclick='togglePlacementType(8,0); setElementPlacementType(8); setMouseMode(2);' > <!-- Dummy button, functions like IE-button -->
                                <img src="../Shared/icons/diagram_state.svg" alt="State diagram state"/>
                                <span class="placementTypeToolTipText"><b>State diagram state</b><br>
                                    <p>Change to state diagram state</p>
                                    <p>A state diagram state is a representation of a status a process can have.</p>
                                    <p>Each state represents a unique status that a process can have.</p>
                                </span>
                            </div>
                        </div>
                    </div>
                </div><!--<-- UML functionality end -->
                <div>
                    <div id="elementPlacement8" 
                        class="SDButton diagramIcons toolbarMode" 
                        onclick='setElementPlacementType(8); setMouseMode(2);'
                        onmouseup='holdPlacementButtonUp();'
                        onmousedown='holdPlacementButtonDown(8);'>
                        <img src="../Shared/icons/diagram_state.svg" alt="State diagram state"/>
                        <span class="toolTipText"><b>State diagram state</b><br>
                            <p>Add state diagram state to the diagram</p>
                            <p>A state diagram state is a representation of a status a process can have.</p>
                            <p>Each state represents a unique status that a process can have.</p>
                            <br>
                            <p id="tooltip-PLACE_IEENTITY" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton8" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <div id="diagramPopOut">
                        <div id="togglePlacementTypeBox8" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <div class="ERButton placementTypeBoxIcons" onclick='togglePlacementType(0,0); setElementPlacementType(0); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_entity.svg" alt="ER entity"/>
                                <span class="placementTypeToolTipText"><b>ER entity</b><br>
                                    <p>Change to ER entity</p>
                                    <p>Each entity represents an object which is a representation of concepts or data.</p>
                                    <p>The entity only holds the name of the object and if it depends on another object.</p>
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons" onclick='togglePlacementType(4,0); setElementPlacementType(4); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                                <span class="placementTypeToolTipText"><b>UML class</b><br>
                                    <p>Change to UML class</p>
                                    <p>Each class entity represents its own class along with the attributes and operations held within the class.</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons" onclick='togglePlacementType(6,0); setElementPlacementType(6); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                                <span class="placementTypeToolTipText"><b>IE entity</b><br>
                                    <p>Change to IE entity</p>
                                    <p>Each entity represents an object along with its attributes.</p>
                                    <p>Each entity is represented by a table with a field that shows attributes.</p>
                                </span>
                            </div>
                            <div class="SDButton placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(8,0); setElementPlacementType(8); setMouseMode(2);' > <!-- Dummy button, functions like IE-button -->
                                <img class="SDState-rounded" src="../Shared/icons/diagram_state.svg" alt="Statediagram state"/>
                                <span class="placementTypeToolTipText"><b>State diagram state</b><br>
                                    <p>A state diagram state is a representation of a status a process can have.</p>
                                    <p>Each state represents a unique status that a process can have.</p>
                                </span>
                            </div>
                        </div>
                    </div>        
                </div>
                <!--<-- State diagram functionality end -->
                <div>
                    <div id="elementPlacement1"
                         class="ERButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(1); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp();'
                         onmousedown="holdPlacementButtonDown(1)"> <!--<-- UML functionality -->
                        <img src="../Shared/icons/diagram_relation.svg"  alt="ER relation"/>
                        <span class="toolTipText"><b>ER relation</b><br>
                            <p>Add a ER relation to the diagram</p>
                            <p>Represents how entities are associated with each other.</p>
                            <br>
                            <p id="tooltip-PLACE_RELATION" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton1" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div> 
                    <div id="diagramPopOut">
                        <div id="togglePlacementTypeBox1" class="togglePlacementTypeBox togglePlacementTypeBoxRI"><!--<-- UML functionality start-->
                            <div class="ERButton placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(0,1); setElementPlacementType(1); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_relation.svg" alt="ER relation"/>
                                <span class="placementTypeToolTipText"><b>ER relation</b><br>
                                    <p>Represents how entities are associated with each other.</p>
                                </span>
                            </div>
                            <div class="ERAttribute placementTypeBoxIcons" onclick='togglePlacementType(2,1);setElementPlacementType(2); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_attribute.svg" alt="ER Attribute"/>
                                <span class="placementTypeToolTipText"><b>ER Attribute</b><br>
                                    <p>Add a ER attribute to the diagram</p>
                                    <p>Each attribute represents different characteristics of an entity.</p>
                                    <br>
                                    <p id="tooltip-PLACE_ATTRIBUTE" class="key_tooltip">Keybinding:</p>
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons" onclick='togglePlacementType(5,1); setElementPlacementType(5); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_inheritance.svg" alt="UML Inheritance"/>
                                <span class="placementTypeToolTipText"><b>UML Inheritance</b><br>
                                    <p>Change to UML inheritance</p>
                                    <p>A relation between a superclass and subclasses.</p>
                                    <p>The subclasses acquire all the properties and behaviors from the superclass.</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons" onclick='togglePlacementType(7,1); setElementPlacementType(7); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_IE_inheritance.svg" alt="IE inheritance"/>
                                <span class="placementTypeToolTipText"><b>IE Inheritance</b><br>
                                    <p>Change to IE inheritance</p>
                                    <p>A relation between two or more entities.</p>
                                    <p>The subclasses acquire all the properties and behaviors from the superclass.</p>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div id="elementPlacement5"
                         class="UMLButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(5); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp();'
                         onmousedown="holdPlacementButtonDown(5)">
                        <img src="../Shared/icons/diagram_inheritance.svg" alt="UML inheritance"/>
                        <span class="toolTipText"><b>UML inheritance</b><br>
                            <p>Add an UML inheritance to the diagram</p>
                            <p>A relation between a superclass and subclasses.</p>
                            <p>The subclasses acquire all the properties and behaviors from the superclass.</p>
                            <br>
                            <p id="tooltip-PLACE_RELATION" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton5" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>  
                    <div id="diagramPopOut">  
                        <div id="togglePlacementTypeBox5" class="togglePlacementTypeBox togglePlacementTypeBoxRI">
                            <div class="ERButton placementTypeBoxIcons" onclick='togglePlacementType(1,1); setElementPlacementType(1); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_relation.svg" alt="ER Relation"/>
                                <span class="placementTypeToolTipText"><b>ER Relation</b><br>
                                    <p>Change to ER relation</p>
                                    <p>Represents how entities are associated with each other.</p>
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(5,1); setElementPlacementType(5); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_inheritance.svg" alt="UML inheritance"/>
                                <span class="placementTypeToolTipText"><b>UML Inheritance</b><br>
                                    <p>A relation between a superclass and subclasses.</p>
                                    <p>The subclasses acquire all the properties and behaviors from the superclass.</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons " onclick='togglePlacementType(7,1); setElementPlacementType(7); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_IE_inheritance.svg" alt="IE inheritance"/>
                                <span class="placementTypeToolTipText"><b>IE Inheritance</b><br>
                                    <p>Change to IE inheritance</p>
                                    <p>A relation between two or more entities.</p>
                                    <p>The subclasses acquire all the properties and behaviors from the superclass.</p>
                                </span>
                            </div>
                            <div class="ERAttribute placementTypeBoxIcons" onclick='togglePlacementType(2,1);setElementPlacementType(2); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_attribute.svg" alt="ER Attribute"/>
                                <span class="placementTypeToolTipText"><b>ER Attribute</b><br>
                                    <p>Add a ER attribute to the diagram</p>
                                    <p>Each attribute represents different characteristics of an entity.</p>
                                    <br>
                                    <p id="tooltip-PLACE_ATTRIBUTE" class="key_tooltip">Keybinding:</p>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div id="elementPlacement7"
                         class="IEButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(7); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp();'
                         onmousedown="holdPlacementButtonDown(7)">
                        <img src="../Shared/icons/diagram_IE_inheritance.svg" alt="IE inheritance"/>
                        <span class="toolTipText"><b>IE inheritance</b><br>
                            <p>Add an IE inheritance to the diagram</p>
                            <p>A relation between two or more entities.</p>
                            <p>The subclasses acquire all the properties and behaviors from the superclass.</p>
                            <br>
                            <p id="tooltip-PLACE_RELATION" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton7" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>  
                    <div id="diagramPopOut">  
                        <div id="togglePlacementTypeBox7" class="togglePlacementTypeBox togglePlacementTypeBoxRI">
                            <div class="ERButton placementTypeBoxIcons" onclick='togglePlacementType(1,1); setElementPlacementType(1); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_relation.svg" alt="ER Relation"/>
                                <span class="placementTypeToolTipText"><b>ER Relation</b><br>
                                    <p>Change to ER relation</p>
                                    <p>Represents how entities are associated with each other.</p>
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons" onclick='togglePlacementType(5,1); setElementPlacementType(5); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_inheritance.svg" alt="UML inheritance"/>
                                <span class="placementTypeToolTipText"><b>UML Inheritance</b><br>
                                    <p>Change to UML inheritance</p>
                                    <p>A relation between a superclass and subclasses.</p>
                                    <p>The subclasses acquire all the properties and behaviors from the superclass.</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(7,1); setElementPlacementType(7); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_IE_inheritance.svg" alt="IE inheritance"/>
                                <span class="placementTypeToolTipText"><b>IE Inheritance</b><br>
                                    <p>A relation between two or more entities.</p>
                                    <p>The subclasses acquire all the properties and behaviors from the superclass.</p>
                                </span>
                            </div>
                            <div class="ERAttribute placementTypeBoxIcons" onclick='togglePlacementType(2,1);setElementPlacementType(2); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_attribute.svg" alt="ER Attribute"/>
                                <span class="placementTypeToolTipText"><b>ER Attribute</b><br>
                                    <p>Add a ER attribute to the diagram</p>
                                    <p>Each attribute represents different characteristics of an entity.</p>
                                    <br>
                                    <p id="tooltip-PLACE_ATTRIBUTE" class="key_tooltip">Keybinding:</p>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div id="elementPlacement2"
                         class="ERAttribute diagramIcons toolbarMode"
                         onclick='setElementPlacementType(2); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp();'
                         onmousedown="holdPlacementButtonDown(2)">
                        <img src="../Shared/icons/diagram_attribute.svg" alt="ER Attribute"/>
                        <span class="toolTipText"><b>ER Attribute</b><br>
                            <p>Add a ER attribute to the diagram</p>
                            <p>Each attribute represents different characteristics of an entity.</p>
                            <br>
                            <p id="tooltip-PLACE_ATTRIBUTE" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton2" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>  
                    <div id="diagramPopOut">  
                        <div id="togglePlacementTypeBox2" class="togglePlacementTypeBox togglePlacementTypeBoxRI">
                            <div class="ERButton placementTypeBoxIcons" onclick='togglePlacementType(1,1); setElementPlacementType(1); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_relation.svg" alt="ER Relation"/>
                                <span class="placementTypeToolTipText"><b>ER Relation</b><br>
                                    <p>Change to ER relation</p>
                                    <p>Represents how entities are associated with each other.</p>
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons" onclick='togglePlacementType(5,1); setElementPlacementType(5); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_inheritance.svg" alt="UML inheritance"/>
                                <span class="placementTypeToolTipText"><b>UML Inheritance</b><br>
                                    <p>Change to UML inheritance</p>
                                    <p>A relation between a superclass and subclasses.</p>
                                    <p>The subclasses acquire all the properties and behaviors from the superclass.</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons" onclick='togglePlacementType(7,1); setElementPlacementType(7); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_IE_inheritance.svg" alt="IE inheritance"/>
                                <span class="placementTypeToolTipText"><b>IE Inheritance</b><br>
                                    <p>A relation between two or more entities.</p>
                                    <p>The subclasses acquire all the properties and behaviors from the superclass.</p>
                                </span>
                            </div>
                            <div class="ERAttribute placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(2,1);setElementPlacementType(2); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_attribute.svg" alt="ER Attribute"/>
                                <span class="placementTypeToolTipText"><b>ER Attribute</b><br>
                                    <p>Add a ER attribute to the diagram</p>
                                    <p>Each attribute represents different characteristics of an entity.</p>
                                    <br>
                                    <p id="tooltip-PLACE_ATTRIBUTE" class="key_tooltip">Keybinding:</p>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="mouseMode3" class="diagramIcons toolbarMode" onclick='clearContext(); setMouseMode(3);'>
                    <img src="../Shared/icons/diagram_line.svg" alt="Line"/>
                    <span class="toolTipText"><b>Line</b><br>
                        <p>Make a line between elements</p><br>
                        <p id="tooltip-EDGE_CREATION" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
                <div> <!--state elements start--><!--Initial state button-->
                    <div id="elementPlacement9"
                         class="SDButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(9); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp()'
                         onmousedown="holdPlacementButtonDown(9)"><!--<-- UML functionality -->
                        <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state"/>
                        <span class="toolTipText"><b>UML initial state</b><br>
                            <p>Creates an initial state for UML.</p>
                            <p>The initial state represents the start of a process.</p>
                            <br>
                            <p id="tooltip-STATE_INITIAL" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton9" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>    
                    <div id="diagramPopOut"><!--Initial state -->
                        <div id="togglePlacementTypeBox9" class="togglePlacementTypeBox togglePlacementTypeBoxEntity"><!--<-- UML functionality start-->
                            <div class="placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(9,9); setElementPlacementType(9); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state"/>
                                <span class="placementTypeToolTipText"><b>UML initial state</b><br>
                                    <p>Creates an initial state for UML.</p>
                                    <p>The initial state represents the start of a process.</p>
                                </span>
                            </div><!--Final state -->
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(10,9); setElementPlacementType(10); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_UML_final_state.svg" alt="UML final state"/>
                                <span class="placementTypeToolTipText"><b>UML final state</b><br>
                                    <p>Change to UML final state</p>
                                    <p>Creates a final state for UML.</p>
                                    <p>The final state represents where a process ends.</p>
                                </span>
                            </div><!--Super state -->
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(11,9); setElementPlacementType(11); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_super_state.svg" alt="UML super state"/>
                                <span class="placementTypeToolTipText"><b>UML super state</b><br>
                                    <p>Change to UML super state</p>
                                    <p>Creates a super state.</p>
                                    <p>A state that can contain substates.</p>
                                </span>
                            </div>                           
                        </div>
                    </div>
                </div>
                <div><!--Final state button-->
                    <div id="elementPlacement10"
                         class="SDButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(10); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp();'
                         onmousedown="holdPlacementButtonDown(10)">
                        <img src="../Shared/icons/diagram_UML_final_state.svg" alt="UML final state"/>
                        <span class="toolTipText"><b>UML final state</b><br>
                            <p>Creates a final state for UML.</p>
                            <p>The final state represents where a process ends.</p>
                            <br>
                            <p id="tooltip-STATE_FINAL" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton10" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <div id="diagramPopOut"><!--Initial state -->
                        <div id="togglePlacementTypeBox10" class="togglePlacementTypeBox togglePlacementTypeBoxEntity"><!--<-- UML functionality start-->
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(9,9); setElementPlacementType(9); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state"/>
                                <span class="placementTypeToolTipText"><b>UML initial state</b><br>
                                    <p>Change to UML initial state</p>
                                    <p>Creates an initial state for UML.</p>
                                    <p>The initial state represents the start of a process.</p>
                                </span>
                            </div><!--Final state -->
                            <div class="placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(10,9); setElementPlacementType(10); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_UML_final_state.svg" alt="UML final state"/>
                                <span class="placementTypeToolTipText"><b>UML final state</b><br>
                                    <p>Creates a final state for UML.</p>
                                    <p>The final state represents where a process ends.</p>
                                </span>
                            </div><!--Super state -->
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(11,9); setElementPlacementType(11); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_super_state.svg" alt="UML super state"/>
                                <span class="placementTypeToolTipText"><b>UML super state</b><br>
                                    <p>Change to UML super state</p>
                                    <p>Creates a super state.</p>
                                    <p>A state that can contain substates.</p>
                                </span>
                            </div>                           
                        </div>
                    </div>
                </div><!--<-- UML functionality end -->
                <div><!--Super state button-->
                    <div id="elementPlacement11" 
                         class="SDButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(11); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp();'
                         onmousedown="holdPlacementButtonDown(11)">
                        <img src="../Shared/icons/diagram_super_state.svg" alt="UML super state"/>
                        <span class="toolTipText"><b>UML super state</b><br>
                            <p>Creates a super state.</p>
                            <p>A state that can contain substates.</p>
                            <br>
                            <p id="tooltip-STATE_SUPER" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton11" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <div id="diagramPopOut"><!--Initial state -->
                        <div id="togglePlacementTypeBox11" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(9,9); setElementPlacementType(9); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state"/>
                                <span class="placementTypeToolTipText"><b>UML initial state</b><br>
                                    <p>Change to UML initial state</p>
                                    <p>Creates an initial state for UML.</p>
                                    <p>The initial state represents the start of a process.</p>
                                </span>
                            </div><!--Final state -->
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(10,9); setElementPlacementType(10); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_UML_final_state.svg" alt="UML final state"/>
                                <span class="placementTypeToolTipText"><b>UML final state</b><br>
                                    <p>Change to UML final state</p>
                                    <p>Creates a final state for UML.</p>
                                    <p>The final state represents where a process ends.</p>
                                </span>
                            </div><!--Super state -->
                            <div class="placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(11,9); setElementPlacementType(11); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_super_state.svg" alt="UML super state"/>
                                <span class="placementTypeToolTipText"><b>UML super state</b><br>
                                    <p>Creates a super state.</p>
                                    <p>A state that can contain substates.</p>
                                </span>
                            </div>                           
                        </div>
                    </div>
                </div><!--<-- UML functionality end -->

                <!-- SEQUENCE POP-OUT START-->

                <div> <!-- SEQUENCE LIFELINE ACTOR START -->
                    <div id="elementPlacement12"
                         class="SEButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(12); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp()'
                         onmousedown="holdPlacementButtonDown(12)">
                         <img src="../Shared/icons/diagram_lifeline.svg" alt="sequnece diagram lifeline"/>
                        <span class="toolTipText"><b>Sequence lifeline</b><br>
                            <p>Creates a lifeline for a sequnece diagram</p>
                            <p>Represents the passage of time.</p>
                            <p>Shows events that occur to an object during the process.</p>
                            <br>
                            <p id="tooltip-SQ_LIFELINE" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton12" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <div id="diagramPopOut">
                        <div id="togglePlacementTypeBox12" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <div class="placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(12,12); setElementPlacementType(12); setMouseMode(2);'> <!-- LIFELINE ACTOR !-->
                            <img src="../Shared/icons/diagram_lifeline.svg" alt="sequnece diagram lifeline object"/>
                            <span class="placementTypeToolTipText"><b>Sequence lifeline</b><br>
                                <p>Creates a lifeline for a sequnece diagram</p>
                                <p>Represents the passage of time.</p>
                                <p>Shows events that occur to an object during the process.</p>
                                <br>
                                <p id="tooltip-SQ_LIFELINE" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(16,12); setElementPlacementType(16); setMouseMode(2);'> <!-- LIFELINE OBJECT !-->
                            <img src="../Shared/icons/diagram_sequence_object.svg" alt="sequnece diagram lifeline"/>
                            <span class="placementTypeToolTipText"><b>Sequence lifeline (object)</b><br>
                                <p>Creates a lifeline for a sequnece diagram</p>
                                <p>Represents the passage of time.</p>
                                <p>Shows events that occur to an object during the process.</p>
                                <br>
                                <p id="tooltip-SQ_LIFELINE" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(13,12); setElementPlacementType(13); setMouseMode(2);'> <!-- ACTIVATION !-->
                            <img src="../Shared/icons/diagram_activation.svg" alt="Sequence activation"/>
                            <span class="placementTypeToolTipText"><b>Sequence activation</b><br>
                                <p>Creates an activation box.</p>
                                <p>Represents that an object is active during an interaction, with the length indicating the duration.</p>
                                <br>
                                <p id="tooltip-STATE_SEQUENCE" class="key_tooltip">Keybinding:</p>
                            </span>
                          </div>     
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(14,12); setElementPlacementType(14); setMouseMode(2);' > <!-- LOOP !-->
                            <img src="../Shared/icons/diagram_optionLoop.svg" alt="Option loop"/>
                            <span class="placementTypeToolTipText"><b>Sequence Object</b><br>
                                <p>Creates a option loop or alternative.</p><br>
                                <p id="tooltip-SEQUENCE_OBJECT" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>                         
                        </div>
                    </div>
                </div> <!-- SEQUENCE LIFELINE ACTOR END -->
                <div> <!-- SEQUENCE LIFELINE OBJECT -->
                    <div id="elementPlacement16"
                         class="SEButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(16); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp()'
                         onmousedown="holdPlacementButtonDown(16)">
                         <img src="../Shared/icons/diagram_sequence_object.svg" alt="Sequence activation"/>
                        <span class="toolTipText"><b>Sequence activation</b><br>
                            <p>Creates an activation box.</p>
                            <p>Represents that an object is active during an interaction, with the length indicating the duration.</p>
                            <br>
                            <p id="tooltip-STATE_SEQUENCE" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton16" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>    
                    <div id="diagramPopOut">
                        <div id="togglePlacementTypeBox16" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(12,12); setElementPlacementType(12); setMouseMode(2);'> <!-- LIFELINE ACTOR !-->
                            <img src="../Shared/icons/diagram_lifeline.svg" alt="sequnece diagram lifeline"/>
                            <span class="placementTypeToolTipText"><b>Sequence lifeline</b><br>
                                <p>Creates a lifeline for a sequnece diagram</p>
                                <p>Represents the passage of time.</p>
                                <p>Shows events that occur to an object during the process.</p>
                                <br>
                                <p id="tooltip-SQ_LIFELINE" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(16,12); setElementPlacementType(16); setMouseMode(2);'> <!-- LIFELINE OBJECT !-->
                            <img src="../Shared/icons/diagram_sequence_object.svg" alt="sequnece diagram lifeline"/>
                            <span class="placementTypeToolTipText"><b>Sequence lifeline (object)</b><br>
                                <p>Creates a lifeline for a sequnece diagram</p>
                                <p>Represents the passage of time.</p>
                                <p>Shows events that occur to an object during the process.</p>
                                <br>
                                <p id="tooltip-SQ_LIFELINE" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>
                            <div class="placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(13,12); setElementPlacementType(13); setMouseMode(2);'> <!-- ACTIVATION !-->
                            <img src="../Shared/icons/diagram_activation.svg" alt="Sequence activation"/>
                            <span class="placementTypeToolTipText"><b>Sequence activation</b><br>
                                <p>Creates an activation box.</p>
                                <p>Represents that an object is active during an interaction, with the length indicating the duration.</p>
                                <br>
                                <p id="tooltip-STATE_SEQUENCE" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>     
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(14,12); setElementPlacementType(14); setMouseMode(2);' > <!-- LOOP !-->
                            <img src="../Shared/icons/diagram_optionLoop.svg" alt="Option loop"/>
                            <span class="placementTypeToolTipText"><b>Sequence Condition</b><br>
                                <p>Creates a option loop or alternative.</p><br>
                                <p id="tooltip-SEQUENCE_OBJECT" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>                         
                        </div>
                    </div>
                </div> <!-- SEQUENCE LIFELINE OBJECT END -->
                <div> <!-- SEQUENCE ACTIVATION START -->
                    <div id="elementPlacement13"
                         class="SEButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(13); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp()'
                         onmousedown="holdPlacementButtonDown(13)">
                         <img src="../Shared/icons/diagram_activation.svg" alt="Sequence activation"/>
                        <span class="toolTipText"><b>Sequence activation</b><br>
                            <p>Creates an activation box.</p>
                            <p>Represents that an object is active during an interaction, with the length indicating the duration.</p>
                            <br>
                            <p id="tooltip-STATE_SEQUENCE" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton13" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>    
                    <div id="diagramPopOut">
                        <div id="togglePlacementTypeBox13" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(12,12); setElementPlacementType(12); setMouseMode(2);'> <!-- LIFELINE ACTOR !-->
                            <img src="../Shared/icons/diagram_lifeline.svg" alt="sequnece diagram lifeline"/>
                            <span class="placementTypeToolTipText"><b>Sequence lifeline</b><br>
                                <p>Creates a lifeline for a sequnece diagram</p>
                                <p>Represents the passage of time.</p>
                                <p>Shows events that occur to an object during the process.</p>
                                <br>
                                <p id="tooltip-SQ_LIFELINE" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(16,12); setElementPlacementType(16); setMouseMode(2);'> <!-- LIFELINE OBJECT !-->
                            <img src="../Shared/icons/diagram_sequence_object.svg" alt="sequnece diagram lifeline"/>
                            <span class="placementTypeToolTipText"><b>Sequence lifeline (object)</b><br>
                                <p>Creates a lifeline for a sequnece diagram</p>
                                <p>Represents the passage of time.</p>
                                <p>Shows events that occur to an object during the process.</p>
                                <br>
                                <p id="tooltip-SQ_LIFELINE" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>
                            <div class="placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(13,12); setElementPlacementType(13); setMouseMode(2);'> <!-- ACTIVATION !-->
                            <img src="../Shared/icons/diagram_activation.svg" alt="Sequence activation"/>
                            <span class="placementTypeToolTipText"><b>Sequence activation</b><br>
                                <p>Creates an activation box.</p>
                                <p>Represents that an object is active during an interaction, with the length indicating the duration.</p>
                                <br>
                                <p id="tooltip-STATE_SEQUENCE" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>     
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(14,12); setElementPlacementType(14); setMouseMode(2);' > <!-- LOOP !-->
                            <img src="../Shared/icons/diagram_optionLoop.svg" alt="Option loop"/>
                            <span class="placementTypeToolTipText"><b>Sequence Condition</b><br>
                                <p>Creates a option loop or alternative.</p><br>
                                <p id="tooltip-SEQUENCE_OBJECT" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>                         
                        </div>
                    </div>
                </div> <!-- SEQUENCE ACTIVATION END -->
                <div> <!-- SEQUENCE CONDITION/LOOP START -->
                    <div id="elementPlacement14"
                         class="SEButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(14); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp()'
                         onmousedown="holdPlacementButtonDown(14)">
                         <img src="../Shared/icons/diagram_optionLoop.svg" alt="Option loop"/>
                            <span class="toolTipText"><b>Sequence Condition</b><br>
                                <p>Creates a option loop or alternative.</p><br>
                                <p id="tooltip-SEQUENCE_OBJECT" class="key_tooltip">Keybinding:</p>
                            </span>
                        <div id="togglePlacementTypeButton14" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>    
                    <div id="diagramPopOut">
                        <div id="togglePlacementTypeBox14" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(12,12); setElementPlacementType(12); setMouseMode(2);'> <!-- LIFELINE ACTOR !-->
                            <img src="../Shared/icons/diagram_lifeline.svg" alt="sequnece diagram lifeline"/>
                            <span class="placementTypeToolTipText"><b>Sequence lifeline</b><br>
                                <p>Creates a lifeline for a sequnece diagram</p>
                                <p>Represents the passage of time.</p>
                                <p>Shows events that occur to an object during the process.</p>
                                <br>
                                <p id="tooltip-SQ_LIFELINE" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(16,12); setElementPlacementType(16); setMouseMode(2);'> <!-- LIFELINE OBJECT !-->
                            <img src="../Shared/icons/diagram_sequence_object.svg" alt="sequnece diagram lifeline"/>
                            <span class="placementTypeToolTipText"><b>Sequence lifeline (object)</b><br>
                                <p>Creates a lifeline for a sequnece diagram</p>
                                <p>Represents the passage of time.</p>
                                <p>Shows events that occur to an object during the process.</p>
                                <br>
                                <p id="tooltip-SQ_LIFELINE" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(13,12); setElementPlacementType(13); setMouseMode(2);'> <!-- ACTIVATION !-->
                            <img src="../Shared/icons/diagram_activation.svg" alt="Sequence activation"/>
                            <span class="placementTypeToolTipText"><b>Sequence activation</b><br>
                                <p>Creates an activation box.</p>
                                <p>Represents that an object is active during an interaction, with the length indicating the duration.</p>
                                <br>
                                <p id="tooltip-STATE_SEQUENCE" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>      
                            <div class="placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(14,12); setElementPlacementType(14); setMouseMode(2);' > <!-- LOOP !-->
                            <img src="../Shared/icons/diagram_optionLoop.svg" alt="Option loop"/>
                            <span class="placementTypeToolTipText"><b>Sequence Condition</b><br>
                                <p>Creates a option loop or alternative.</p><br>
                                <p id="tooltip-SEQUENCE_OBJECT" class="key_tooltip">Keybinding:</p>
                            </span>
                            </div>                         
                        </div>
                    </div>
                </div> <!-- SEQUENCE CONDITION/LOOP END -->
                <!-- SEQUENCE POP-OUT END -->
                <!-- NOTE -->
                <div id="elementPlacement15" class="diagramIcons toolbarMode" onclick='setElementPlacementType(15); setMouseMode(2);' onmouseup='holdPlacementButtonUp();'>
                    <img src="../Shared/icons/diagram_note.svg"/>
                    <span class="toolTipText"><b>Note</b><br>
                        <p>Creates a note</p><br>
                        <p id="tooltip-NOTE_ENTITY" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
        </fieldset>
        <fieldset>
            <legend aria-hidden="true">Camera</legend>
            <div id="camtoOrigo" class="diagramIcons" onclick="centerCamera();">
                <img src="../Shared/icons/fullscreen.svg" alt="Reset view">
                <span class="toolTipText"><b>Reset view</b><br>
                    <p>Reset view to show all elements</p><br>
                    <p id="tooltip-CENTER_CAMERA" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset>
        <fieldset>
            <legend aria-hidden="true">History</legend>
            <div id="diagramReset" class="diagramIcons" onclick="resetDiagramAlert()">
                <img src="../Shared/icons/diagram_Refresh_Button.svg" alt="Reset diagram"/>
                <span class="toolTipText"><b>Reset diagram</b><br>
                    <p>Reset diagram to default state</p><br>
                    <p id="tooltip-RESET_DIAGRAM" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div id="stepForwardToggle" class="diagramIcons" onclick="toggleStepForward()">
                <img src="../Shared/icons/diagram_stepforward.svg" alt="Redo"/>
                <span class="toolTipText"><b>Redo</b><br>
                    <p>Redo last change</p><br>
                    <p id="tooltip-HISTORY_STEPFORWARD" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div id="stepBackToggle" class="diagramIcons" onclick="toggleStepBack()">
                <img src="../Shared/icons/diagram_stepback.svg" alt="Undo"/>
                <span class="toolTipText"><b>Undo</b><br>
                    <p>Undo last change</p><br>
                    <p id="tooltip-HISTORY_STEPBACK" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div id="replayToggle" class="diagramIcons" onclick="toggleReplay()">
                <img src="../Shared/icons/diagram_replay.svg" alt="Enter replay mode"/>
                <span class="toolTipText"><b>Enter replay mode</b><br>
                    <p>View history of changes made</p><br>
                    <p id="tooltip-TOGGLE_REPLAY_MODE" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset>
        <fieldset>
            <legend aria-hidden="true">ER-Table</legend>
            <div id="erTableToggle" class="diagramIcons toolbarMode" onclick="toggleErTable()">
                <img src="../Shared/icons/diagram_ER_table_info.svg" alt="Toggle ER-Table"/>
                <span class="toolTipText"><b>Toggle ER-Table</b><br>
                    <p>Click to toggle ER-Table in options</p><br>
                    <p id="tooltip-TOGGLE_ER_TABLE" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset>
        <fieldset>
            <legend aria-hidden="true">Testcase</legend>
            <div id="testCaseToggle" class="diagramIcons toolbarMode" onclick="toggleTestCase()"> <!--add func here later-->
                <img src="../Shared/icons/diagram_ER_table_info.svg" alt="Toggle test-cases"/>
                <span class="toolTipText"><b>Toggle test-cases</b><br>
                    <p>Click to toggle test-cases in options</p><br>
                    <p id="tooltip-TOGGLE_TEST_CASE" class="key_tooltip">Keybinding: "CTRL + ALT + T"</p>
                </span>
            </div>
        </fieldset> 
        <fieldset id = "errorCheckField">
        <legend aria-hidden="true">Check</legend>
            <div id="errorCheckToggle" class="diagramIcons" onclick="toggleErrorCheck()">
                <img src="../Shared/icons/diagram_errorCheck.svg" alt="Toggle error check"/>
                <span class="toolTipText"><b>Toggle error check</b><br>
                    <p>Click to toggle error checking on/off</p>
                    <p>Highlights errors inside a diagram.</p>
                    <br>
                    <p id="tooltip-TOGGLE_ERROR_CHECK" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset>
        <fieldset id="localSaveField" class="disabledIcon">
            <legend aria-hidden="true">Save</legend>
            <div id="localSave" class="diagramIcons" onclick="showSavePopout()">
                <img src="../Shared/icons/diagram_save_icon.svg" alt="Save diagram"/>
                <span class="toolTipText"><b>Save current diagram</b><br>
                    <p>Click to save current diagram</p>
                    <br>
                    <p id="tooltip-SAVE_DIAGRAM" class="key_tooltip">Keybinding: "CTRL + S"</p>
                </span>
            </div>
        </fieldset>
        <fieldset id="localLoadField">
            <legend aria-hidden="true">Load</legend>
            <div id="localLoad" class="diagramIcons" onclick="showModal();">
                <img src="../Shared/icons/diagram_load_icon.svg" alt="Load diagram"/>
                <span class="toolTipText"><b>Load diagram</b><br>
                    <p>Click to load a diagram</p>
                    <br>
                    <p id="tooltip-LOAD_DIAGRAM" class="key_tooltip">Keybinding: "CTRL + L"</p>
                </span>
            </div>
        </fieldset>
    </div>
    
    <div class="loadModal hiddenLoad">
        <div id="loadHeader">
            <p id="loadTitle">Select a load:</p>
            <button id="closeLoadModal" onclick="closeModal();">&times;</button>
        </div>
        <div id="loadContainer"></div>
        <p id="amountOfLoads"><span id="loadCounter">0</span> saves found</p>
    </div>
    <div class="loadModalOverlay hiddenLoad"></div>

    <div id="overrideContainer" class="loginBoxContainer" style="display:none">
        <div class="formBox">
            <div class="formBoxHeader">
                <h3>
                    Filename already exists
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

    <!-- Message prompt -->
    <div id="diagram-message"></div>
    
    <!-- Diagram drawing system canvas. -->
    <svg id="svgoverlay" preserveAspectRatio="none"></svg>
    <div id="container"></div><!-- Contains all elements (items) -->
     <!-- One svg layer for background stuff and one for foreground stuff -->
    <svg id="svgbacklayer" preserveAspectRatio="none"></svg>

	<canvas id='canvasOverlay'></canvas> 
    <!-- Diagram rules -->
    <div id="rulerOverlay">
        <div id="rulerCorner"></div>
        <svg id="ruler-x-svg"></svg>
        <svg id="ruler-y-svg"></svg>
        <div id="ruler-x"></div>
        <div id="ruler-y"></div>
    </div>
    
    <!-- Diagram grid -->
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
    <!-- A4 template -->
    <div id="a4Template">
        <svg id="svgA4Template">
            <rect id="a4Rect" x="100" y="100" />
            <rect id="vRect" x="100" y="100"/>
            <text id="a4Text" x="880" y="90">A4</text>
        </svg>  
    </div>  
    <div id="zoom-container">
        <div id="zoom-message-box">
            <img src="../Shared/icons/zoom-message-icon.svg"/> 
            <text id ="zoom-message">1x</text>
        </div>
        <div class="diagramZoomIcons" onclick='zoomin();'>
            <img src="../Shared/icons/diagram_zoomin.svg"/>
            <span class="zoomToolTipText">
                <b>Zoom IN</b><br>
                <p>Zoom in on viewed area</p><br>
                <p id="tooltip-ZOOM_IN" class="key_tooltip">Keybinding:</p>
            </span>
        </div>
        <div class="diagramZoomIcons" onclick='zoomout();'>
            <img src="../Shared/icons/diagram_zoomout.svg"/>
            <span class="zoomToolTipText">
                <b>Zoom OUT</b><br>
                <p>Zoom out on viewed area</p><br>
                <p id="tooltip-ZOOM_OUT" class="key_tooltip">Keybinding:</p>
            </span>
        </div>
        <div class="diagramZoomIcons" onclick="zoomreset()">
            <img src="../Shared/icons/diagram_zoomratio1to1.svg"/>
            <span class="zoomToolTipText">
                <b>Zoom RESET</b><br>
                <p>Reset the zoom to 1x</p><br>
                <p id="tooltip-ZOOM_RESET" class="key_tooltip">Keybinding:</p>
            </span>
        </div>
    </div>
    <div id="options-pane" class="hide-options-pane"> <!-- Yellow menu on right side of screen -->
        <div id="options-pane-button" onclick="toggleOptionsPane();">
            <span id='optmarker'>&#9660;Options</span>
            <span id="tooltip-OPTIONS" class="toolTipText"><b>Show Option Panel</b><br>
                <p>Enable/disable the Option Panel</p><br>
                <p id="tooltip-OPTIONS" class="key_tooltip">Keybinding:</p>
            </span>
        </div>
        <div id ="fieldsetBox">
            <fieldset id='propertyFieldset' class='options-fieldset options-fieldset-hidden'></fieldset>

            <fieldset class='options-fieldset options-section'>
                <legend>Toggle</legend>
                <button id="gridToggle" class="saveButton" onclick="toggleGrid();">Grid</button><br><br>
                <button id="rulerSnapToGrid" class="saveButton" onclick="toggleSnapToGrid()">Snap to grid</button><br><br>
                <button id="rulerToggle" class="saveButton" onclick="toggleRuler()">Ruler</button><br><br>
                <button id="a4TemplateToggle" class="saveButton" onclick="toggleA4Template()">A4 template</button><br><br>
                <div id="a4Options">
                    <button id="a4VerticalButton" onclick="toggleA4Vertical()">Vertical</button>
                    <button id="a4HorizontalButton" onclick="toggleA4Horizontal()">Horizontal</button>
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
            <fieldset class='options-fieldset options-section'>
                <legend>Export</legend>
                <button class="saveButton" onclick="exportWithHistory();">With history</button><br><br>
                <button class="saveButton" onclick="exportWithoutHistory();">Without history</button>
            </fieldset>
            <fieldset id="option-import" class='options-fieldset options-section'>
                <legend>Import</legend>
                <input id="importDiagramFile" type="file"><br><br>
                <button class="saveButton" onclick="loadDiagram();">Load</button>
            </fieldset>
        </div>
    </div>
    </div>
    <!-- Replay-mode -->
    <div id="diagram-replay-box">
        <div style="display: flex;">
            <fieldset style="display: flex; justify-content: space-between">
                <div id="diagram-replay-switch">
                    <div class="diagramIcons" onclick="stateMachine.replay()">
                        <img src="../Shared/icons/Play.svg" alt="Play">
                        <span class="toolTipText" style="top: -80px"><b>Play</b><br>
                            <p>Play history of changes made to the diagram</p><br>
                        </span>
                    </div>
                </div>
                <div class="diagramIcons" onclick="stateMachine.replay(-1)">
                    <img src="../Shared/icons/replay.svg" alt="Replay">
                    <span class="toolTipText" style="top: -80px"><b>Replay</b><br>
                        <p>Replay history of changes made to the diagram</p><br>
                    </span>
                </div>
                <div class="diagramIcons" onclick="exitReplayMode()">
                    <img src="../Shared/icons/exit.svg" alt="Exit">
                    <span class="toolTipText" style="top: -95px"><b>Exit</b><br>
                        <p>Exit the replay-mode</p><br>
                        <p id="tooltip-ESCAPE" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
            </fieldset>
            <div id="replay-time-container">
                <label id="replay-time-label" for="replay-time">Delay (1s)</label>
                <input id="replay-time" onchange="setReplayDelay(this.value)" class="zoomSlider" type="range" min="1" max="9" value="5">
            </div>

            <div>
                <label for="replay-range">Change</label>
                <input id="replay-range" class="zoomSlider" onchange="changeReplayState(parseInt(this.value))" type="range" min="-1" max="-1">
            </div>
        </div>
    </div>
    <div id="diagram-replay-message">
        <h2>Replay mode</h2>
        <p>Press "ESCAPE" to exit the replay-mode.</p>
    </div>
    <div id="savePopoutContainer" class="loginBoxContainer" style="display:none">
        <div class="formBox">
            <div class="formBoxHeader">
                <h3>
                    Save current diagram as
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
                    <input type="submit" class="submit-button" onclick="saveDiagramAs(); hideSavePopout();" value="Save"/>
                </div>
            </div>
        </div>
    </div>
    <!-- content END -->
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
