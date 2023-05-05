<?php
    session_start();
    include_once "../../coursesyspw.php";
    include_once "../Shared/sessions.php";
	include_once "../Shared/basic.php";
	#general vars regarding current dugga.
	$cid=getOPG('courseid');
	$vers=getOPG('coursevers');
	$quizid=getOPG('did');
?>

<!DOCTYPE html>
<html>
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
    <script src="diagram.js"></script>
    <script>
        // Fetch variant parameters from server
        var DiagramResponse;
        
        function fetchDiagram() {
            var response;

            <?php 
                if (isset($cid) && $cid != "UNK") {
                    echo "const courseid = '$cid';";
                } else if (isset($_GET["folder"])) {
                    $folder = $_GET["folder"];
                    echo "const courseid = '$folder';";
                } else {
                    echo "const courseid = '1894';";
                }

                if (isset($quizid) && $quizid != "UNK") {
                    echo "const did = '$quizid';";
                } else if (isset($_GET["id"])) {
                    $id = $_GET["id"];
                    echo "const did = '$id';";
                } else {
                    echo "const did = '21';";
                }
            ?>

            $.ajax({
                async: false,
                method: "GET",
                url: `diagramservice.php?courseid=${courseid}&did=${did}`,
            }).done((res) => {
                console.log(res)
                response = res;
            }).error((req, status, err) => {
                console.error(err);
            });
            
            return response;
        }
        

        /**
         * @description get the contents of a instruction file
         * @param fileName the name of the file t.ex. test.html
         * */
        function getInstructions(fileName)
        {
            const instructions = DiagramResponse.instructions
            if(instructions.length > 0){
                for (let index = 0; index < instructions.length; index++) {
                    if(instructions[index][2]==fileName){
                        window.parent.document.getElementById("assignment_discrb").innerHTML = instructions[index][3];
                    }
                    if(instructions[index][5]==fileName){
                        window.parent.document.getElementById("diagram_instructions").innerHTML = instructions[index][6];
                    }
                }
            }			
        }

        function getVariantParam()
        {
            return DiagramResponse.variant;
        }


    </script>
</head>
<body onload="getData();addAlertOnUnload();" style="overflow: hidden;">

    <!-- Markdown document with keybinds -->
    <div id="markdownKeybinds" style="display: none">

    </div>

     <!-- Used for calculating pixels per millimeter using offsetWidth. Note that in offsetWidth system scaling is not included
    and window.devicePixelRatio have to be included -->
    <div id="pixellength" style="width:1000mm;;padding:0px;visibility:hidden;"></div>

    <!-- Toolbar for diagram -->
    <div id="diagram-toolbar" onmousedown='mdown(event)' onmouseup='tup();'>
        <fieldset>
            <legend aria-hidden="true" aria-hidden="true">Modes</legend>
                <div id="mouseMode0" class="diagramIcons toolbarMode active" onclick='setMouseMode(0);'>
                    <img src="../Shared/icons/diagram_pointer_white.svg" alt="Pointer"/>
                    <span class="toolTipText" id="highestToolTip"><b>Pointer</b><br>
                        <p>Allows you to select and move different elements as well as navigate the workspace</p><br>
                        <p id="tooltip-POINTER" class="key_tooltip">Keybinding:</p>
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
                            <p>Add an ER entity to the diagram</p><br>
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
                                    <p>Change to ER entity</p>
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons" onclick='togglePlacementType(4,0); setElementPlacementType(4); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                                <span class="placementTypeToolTipText"><b>UML class</b><br>
                                    <p>Change to UML class</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons" onclick='togglePlacementType(6,0); setElementPlacementType(6); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                                <span class="placementTypeToolTipText"><b>IE entity</b><br>
                                    <p>Change to IE entity</p>
                                </span>
                            </div>
                            <div class="SDButton placementTypeBoxIcons" onclick='togglePlacementType(8,0); setElementPlacementType(8); setMouseMode(2);' > <!-- Dummy button, functions like IE-button -->
                                <img class="SDState-rounded" src="../Shared/icons/diagram_state.svg" alt="State diagram state"/>
                                <span class="placementTypeToolTipText"><b>State diagram state</b><br>
                                    <p>Change to state diagram state</p>
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
                            <p>Add an UML class to the diagram</p><br>
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
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(4,0); setElementPlacementType(4); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                                <span class="placementTypeToolTipText"><b>UML class</b><br>
                                    <p>Change to UML class</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons" onclick='togglePlacementType(6,0); setElementPlacementType(6); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                                <span class="placementTypeToolTipText"><b>IE entity</b><br>
                                    <p>Change to IE entity</p>
                                </span>
                            </div>
                            <div class="SDButton placementTypeBoxIcons" onclick='togglePlacementType(8,0); setElementPlacementType(8); setMouseMode(2);' > <!-- Dummy button, functions like IE-button -->
                                <img class="SDState-rounded" src="../Shared/icons/diagram_state.svg" alt="State diagram state"/>
                                <span class="placementTypeToolTipText"><b>State diagram state</b><br>
                                    <p>Change to state diagram state</p>
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
                            <p>Add an IE entity to the diagram</p><br>
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
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons" onclick='togglePlacementType(4,0); setElementPlacementType(4); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                                <span class="placementTypeToolTipText"><b>UML class</b><br>
                                    <p>Change to UML class</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(6,0); setElementPlacementType(6); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                                <span class="placementTypeToolTipText"><b>IE entity</b><br>
                                    <p>Change to IE entity</p>
                                </span>
                            </div>
                            <div class="SDButton placementTypeBoxIcons" onclick='togglePlacementType(8,0); setElementPlacementType(8); setMouseMode(2);' > <!-- Dummy button, functions like IE-button -->
                                <img src="../Shared/icons/diagram_state.svg" alt="State diagram state"/>
                                <span class="placementTypeToolTipText"><b>State diagram state</b><br>
                                    <p>Change to state diagram state</p>
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
                            <p>Add state diagram state to the diagram</p><br>
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
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons" onclick='togglePlacementType(4,0); setElementPlacementType(4); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_UML_entity.svg" alt="UML class"/>
                                <span class="placementTypeToolTipText"><b>UML class</b><br>
                                    <p>Change to UML class</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons" onclick='togglePlacementType(6,0); setElementPlacementType(6); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_IE_entity.svg" alt="IE entity"/>
                                <span class="placementTypeToolTipText"><b>IE entity</b><br>
                                    <p>Change to IE entity</p>
                                </span>
                            </div>
                            <div class="SDButton placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(8,0); setElementPlacementType(8); setMouseMode(2);' > <!-- Dummy button, functions like IE-button -->
                                <img class="SDState-rounded" src="../Shared/icons/diagram_state.svg" alt="Statediagram state"/>
                                <span class="placementTypeToolTipText"><b>Statediagram state</b><br>
                                    <p>Change to state diagram state</p>
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
                            <p>Add a ER relation to the diagram</p><br>
                            <p id="tooltip-PLACE_RELATION" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton1" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div> 
                    <div id="diagramPopOut">
                        <div id="togglePlacementTypeBox1" class="togglePlacementTypeBox togglePlacementTypeBoxRI"><!--<-- UML functionality start-->
                            <div class="ERButton placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(1,1); setElementPlacementType(1); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_relation.svg" alt="ER relation"/>
                                <span class="placementTypeToolTipText"><b>ER relation</b><br>
                                    <p>Change to ER relation</p>
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons" onclick='togglePlacementType(5,1); setElementPlacementType(5); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_inheritance.svg" alt="UML Inheritance"/>
                                <span class="placementTypeToolTipText"><b>UML Inheritance</b><br>
                                    <p>Change to UML inheritance</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons" onclick='togglePlacementType(7,1); setElementPlacementType(7); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_IE_inheritance.svg" alt="IE inheritance"/>
                                <span class="placementTypeToolTipText"><b>IE Inheritance</b><br>
                                    <p>Change to IE inheritance</p>
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
                        <img src="../Shared/icons/diagram_inheritance.svg"alt="UML inheritance"/>
                        <span class="toolTipText"><b>UML inheritance</b><br>
                            <p>Add an UML inheritance to the diagram</p><br>
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
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(5,1); setElementPlacementType(5); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_inheritance.svg" alt="UML inheritance"/>
                                <span class="placementTypeToolTipText"><b>UML Inheritance</b><br>
                                    <p>Change to UML inheritance</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons " onclick='togglePlacementType(7,1); setElementPlacementType(7); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_IE_inheritance.svg" alt="IE inheritance"/>
                                <span class="placementTypeToolTipText"><b>IE Inheritance</b><br>
                                    <p>Change to IE inheritance</p>
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
                            <p>Add an IE inheritance to the diagram</p><br>
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
                                </span>
                            </div>
                            <div class="UMLButton placementTypeBoxIcons" onclick='togglePlacementType(5,1); setElementPlacementType(5); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_inheritance.svg" alt="UML inheritance"/>
                                <span class="placementTypeToolTipText"><b>UML Inheritance</b><br>
                                    <p>Change to UML inheritance</p>
                                </span>
                            </div>
                            <div class="IEButton placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(7,1); setElementPlacementType(7); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_IE_inheritance.svg" alt="IE inheritance"/>
                                <span class="placementTypeToolTipText"><b>IE Inheritance</b><br>
                                    <p>Change to IE inheritance</p>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="elementPlacement2" class="diagramIcons toolbarMode" onclick='setElementPlacementType(2); setMouseMode(2);'>
                    <img src="../Shared/icons/diagram_attribute.svg" alt="ER Attribute"/>
                    <span class="toolTipText"><b>Attribute</b><br>
                        <p>Add an ER attribute to the diagram</p><br>
                        <p id="tooltip-PLACE_ATTRIBUTE" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
                <div id="mouseMode3" class="diagramIcons toolbarMode" onclick='clearContext(); setMouseMode(3);'>
                    <img src="../Shared/icons/diagram_line.svg" alt="Line"/>
                    <span class="toolTipText"><b>Line</b><br>
                        <p>Make a line between elements</p><br>
                        <p id="tooltip-EDGE_CREATION" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
                <!-- UML Initial state selection 
                <div id="elementPlacement9" class="diagramIcons toolbarMode" onclick='setElementPlacementType(9); setMouseMode(2);' onmouseup='holdPlacementButtonUp();'>
                    <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state"/>
                    <span class="toolTipText"><b>UML initial state</b><br>
                        <p>Creates an initial state for UML.</p><br>
                        <p id="tooltip-STATE_INITIAL" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>-->
                <!-- UML Final state selection 
                <div id="elementPlacement10" class="diagramIcons toolbarMode" onclick='setElementPlacementType(10); setMouseMode(2);' onmouseup='holdPlacementButtonUp();'>
                    <img src="../Shared/icons/diagram_UML_final_state.svg" alt="UML final state"/>
                    <span class="toolTipText"><b>UML final state</b><br>
                        <p>Creates a final state for UML.</p><br>
                        <p id="tooltip-STATE_FINAL" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>-->
                <!-- Sequence diagram lifeline | for now is bound to uml final state 
                <div id="elementPlacement10" class="diagramIcons toolbarMode" onclick='setElementPlacementType(10); setMouseMode(2);' onmouseup='holdPlacementButtonUp();'>
                    <img src="../Shared/icons/diagram_lifeline.svg" alt="sequnece diagram lifeline"/>
                    <span class="toolTipText"><b>Sequence lifeline</b><br>
                        <p>Creates a lifeline for a sequnece diagram</p><br>
                        <p id="tooltip-SQ-LIFELINE" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>-->
                <!-- UML Super state selection 
                <div id="elementPlacement11" class="diagramIcons toolbarMode" onclick='setElementPlacementType(11); setMouseMode(2);' onmouseup='holdPlacementButtonUp();'>
                    <img src="../Shared/icons/diagram_super_state.svg" alt="UML super state"/>
                    <span class="toolTipText"><b>UML super state</b><br>
                        <p>Creates a super state.</p><br>
                        <p id="tooltip-STATE_SUPER" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>-->
                <!-- Sequence diagram object selection 
                <div id="elementPlacement12" class="diagramIcons toolbarMode" onclick='setElementPlacementType(10); setMouseMode(2);' onmouseup='holdPlacementButtonUp();'>
                    <img src="../Shared/icons/diagram_sequence_object.svg" alt="Sequence Object"/>
                    <span class="toolTipText"><b>Sequence Object</b><br>
                        <p>Creates a sequence object.</p><br>
                        <p id="tooltip-SEQUENCE_OBJECT" class="key_tooltip">Keybinding:</p>
                        </span>
                </div> -->
                <!-- Sequence activation selection -->
                <div id="elementPlacement12" class="diagramIcons toolbarMode" onclick=""> <!--add function to place activation box later-->
                    <img src="../Shared/icons/diagram_activation.svg" alt="Sequence activation"/>
                    <span class="toolTipText"><b>Sequence activation</b><br>
                        <p>Creates an activation box.</p><br>
                        <p id="tooltip-STATE_SEQUENCE" class="key_tooltip">Keybinding:</p>
                    </span>
                </div>
                <div>
                    <div id="elementPlacement9"
                         class="SDButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(9); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp()'
                         onmousedown="holdPlacementButtonDown(9)"><!--<-- UML functionality -->
                        <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state"/>
                        <span class="toolTipText"><b>UML initial state</b><br>
                            <p>Creates an initial state for UML.</p><br>
                            <p id="tooltip-STATE_INITIAL" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton9" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>    
                    <div id="diagramPopOut">
                        <div id="togglePlacementTypeBox9" class="togglePlacementTypeBox togglePlacementTypeBoxEntity"><!--<-- UML functionality start-->
                            <div class="placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(9,9); setElementPlacementType(9); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state"/>
                                <span class="placementTypeToolTipText"><b>UML initial state</b><br>
                                    <p>Change to UML initial state</p>
                                </span>
                            </div>
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(10,9); setElementPlacementType(10); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_UML_final_state.svg" alt="UML final state"/>
                                <span class="placementTypeToolTipText"><b>UML final state</b><br>
                                    <p>Change to UML final state</p>
                                </span>
                            </div>
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(11,9); setElementPlacementType(11); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_super_state.svg" alt="UML super state"/>
                                <span class="placementTypeToolTipText"><b>UML super state</b><br>
                                    <p>Change to UML super state</p>
                                </span>
                            </div>                           
                        </div>
                    </div>
                </div>
                <div>
                    <div id="elementPlacement10"
                         class="SDButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(10); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp();'
                         onmousedown="holdPlacementButtonDown(10)">
                        <img src="../Shared/icons/diagram_UML_final_state.svg" alt="UML final state"/>
                        <span class="toolTipText"><b>UML final state</b><br>
                            <p>Add an UML class to the diagram</p><br>
                            <p id="tooltip-STATE_FINAL" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton10" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <div id="diagramPopOut">
                        <div id="togglePlacementTypeBox10" class="togglePlacementTypeBox togglePlacementTypeBoxEntity"><!--<-- UML functionality start-->
                            <div class="placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(9,9); setElementPlacementType(9); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state"/>
                                <span class="placementTypeToolTipText"><b>UML initial state</b><br>
                                    <p>Change to UML initial state</p>
                                </span>
                            </div>
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(10,9); setElementPlacementType(10); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_UML_final_state.svg" alt="UML final state"/>
                                <span class="placementTypeToolTipText"><b>UML final state</b><br>
                                    <p>Change to UML final state</p>
                                </span>
                            </div>
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(11,9); setElementPlacementType(11); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_super_state.svg" alt="UML super state"/>
                                <span class="placementTypeToolTipText"><b>UML super state</b><br>
                                    <p>Change to UML super state</p>
                                </span>
                            </div>                           
                        </div>
                    </div>
                </div><!--<-- UML functionality end -->
                <div>
                    <div id="elementPlacement11"
                         class="SDButton diagramIcons toolbarMode"
                         onclick='setElementPlacementType(11); setMouseMode(2);'
                         onmouseup='holdPlacementButtonUp();'
                         onmousedown="holdPlacementButtonDown(11)">
                        <img src="../Shared/icons/diagram_super_state.svg" alt="UML super state"/>
                        <span class="toolTipText"><b>UML super state</b><br>
                            <p>Add an IE entity to the diagram</p><br>
                            <p id="tooltip-STATE_SUPER" class="key_tooltip">Keybinding:</p>
                        </span>
                        <div id="togglePlacementTypeButton11" class="placementTypeIcon togglePlacementTypeButton">
                            <img src="../Shared/icons/diagram_toolbar_arrow.svg" alt="An arrow for expanding this menu option"/>
                        </div>
                    </div>
                    <div id="diagramPopOut">
                        <div id="togglePlacementTypeBox9" class="togglePlacementTypeBox togglePlacementTypeBoxEntity">
                            <div class="placementTypeBoxIcons activePlacementType" onclick='togglePlacementType(9,9); setElementPlacementType(9); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_UML_initial_state.svg" alt="UML initial state"/>
                                <span class="placementTypeToolTipText"><b>UML initial state</b><br>
                                    <p>Change to UML initial state</p>
                                </span>
                            </div>
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(10,9); setElementPlacementType(10); setMouseMode(2);'>
                                <img src="../Shared/icons/diagram_UML_final_state.svg" alt="UML final state"/>
                                <span class="placementTypeToolTipText"><b>UML final state</b><br>
                                    <p>Change to UML final state</p>
                                </span>
                            </div>
                            <div class="placementTypeBoxIcons" onclick='togglePlacementType(11,9); setElementPlacementType(11); setMouseMode(2);' >
                                <img src="../Shared/icons/diagram_super_state.svg" alt="UML super state"/>
                                <span class="placementTypeToolTipText"><b>UML super state</b><br>
                                    <p>Change to UML super state</p>
                                </span>
                            </div>                           
                        </div>
                    </div>
                </div><!--<-- UML functionality end -->
        </fieldset>
        <!-- <fieldset>
            <legend>Zoom</legend>
            <div class="diagramIcons" onclick='zoomin();'>
                <img src="../Shared/icons/diagram_zoomin.svg"/>
                <span class="toolTipText"><b>Zoom IN</b><br>
                    <p>Zoom in on viewed area</p><br>
                    <p id="tooltip-ZOOM_IN" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div class="diagramIcons" onclick='zoomout();'>
                <img src="../Shared/icons/diagram_zoomout.svg"/>
                <span class="toolTipText"><b>Zoom OUT</b><br>
                    <p>Zoom out on viewed area</p><br>
                    <p id="tooltip-ZOOM_OUT" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div class="diagramIcons" onclick="zoomreset()">
                <img src="../Shared/icons/diagram_zoomratio1to1.svg"/>
                <span class="toolTipText"><b>Zoom RESET</b><br>
                    <p>Reset the zoom to 1x</p><br>
                    <p id="tooltip-ZOOM_RESET" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset> -->
        <fieldset>
            <legend aria-hidden="true">Camera</legend>
            <div id="camtoOrigo" class="diagramIcons" onclick="centerCamera(); centerCamera();">
                <img src="../Shared/icons/fullscreen.svg" alt="Reset view">
                <span class="toolTipText"><b>Reset view</b><br>
                    <p>Reset view to show all elements</p><br>
                    <p id="tooltip-CENTER_CAMERA" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset>
        <fieldset>
            <legend aria-hidden="true">History</legend>
            <div id="erTableToggle" class="diagramIcons" onclick="resetDiagramAlert()">
                <img src="../Shared/icons/diagram_Refresh_Button.svg" alt="Reset diagram"/>
                <span class="toolTipText"><b>Reset diagram</b><br>
                    <p>Reset diagram to default state</p><br>
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
            <div id="erTableToggle" class="diagramIcons" onclick="toggleErTable()">
                <img src="../Shared/icons/diagram_ER_table_info.svg" alt="Toggle ER-Table"/>
                <span class="toolTipText"><b>Toggle ER-Table</b><br>
                    <p>Click to toggle ER-Table in options</p><br>
                    <p id="tooltip-TOGGLE_ER_TABLE" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset>
        <fieldset>
            <legend aria-hidden="true">Testcase</legend>
            <div id="testCaseToggle" class="diagramIcons" onclick="toggleTestCase()"> <!--add func here later-->
                <img src="../Shared/icons/diagram_ER_table_info.svg" alt="Toggle test-cases"/>
                <span class="toolTipText"><b>Toggle test-cases</b><br>
                    <p>Click to toggle test-cases in options</p><br>
                    <p id="tooltip-TOGGLE_TEST_CASE" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset> 
        <fieldset id = "errorCheckField">
        <legend aria-hidden="true">Check</legend>
            <div id="errorCheckToggle" class="diagramIcons" onclick="toggleErrorCheck()">
                <img src="../Shared/icons/diagram_errorCheck.svg" alt="Toggle error check"/>
                <span class="toolTipText"><b>Toggle error check</b><br>
                    <p>Click to toggle error checking on/off</p><br>
                    <p id="tooltip-TOGGLE_ERROR_CHECK" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </fieldset>   
        <!-- <fieldset>
            <legend>Include</legend>
            <div id="Include" class="diagramIcons" onclick="toggleErTable()">
                <img src="../Shared/icons/angelBrackets.svg"/>
                <span class="toolTipText"><b>To use less than</b><br>
                    <p>To use less than type & #60; <br><strong>"EX: <& #60;Include>>"</STRONG> </p><br>
                </span>
        </fieldset> -->      
    </div>

    <!-- Message prompt -->
    <div id="diagram-message"></div>

  <!--  <div id ="zoom-message-box"><img width="25%" height="25%" src="../Shared/icons/zoom-message-icon.svg" alt="An icon depicting a magnifying glass"/><text id ="zoom-message">1x</text></div> -->


    <!-- Diagram drawing system canvas. -->
    <svg id="svgoverlay" preserveAspectRatio="none"></svg>
    <div id="container" onmousedown='mdown(event)' onmouseup='mup(event)' onmousemove='mmoving(event)' onwheel='mwheel(event)'></div> <!-- Contains all elements (items) -->
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
    <div id="svggrid" style="z-index:-11">
        <svg id="svgbacklayer" class="svgbacklayer-background">
            <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">

                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke="0.8 0.8" stroke-width="1"/>
            </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <line id="origoX" x1="0%" y1="100" x2="100%" y2="100" style="stroke:rgb(105, 105, 105);stroke-width:8;"/>
            <line id="origoY" x1="100" y1="0%" x2="100" y2="100%" style="stroke:rgb(105, 105, 105);stroke-width:8;"/>
        </svg>  
    </div>
    <!-- A4 template -->
    <div id="a4Template" style="z-index:-11">
        <svg id="svgA4Template">
            <rect id="a4Rect" x="100" y="100" width="794" height="1122" style="stroke:rgb(50, 50, 50);stroke-width:2" stroke-dasharray="5 3" fill="#ffffee" fill-opacity="0.4"/>
            <rect id="vRect" x="100" y="100" width="1122" height="794" style=" display:none; stroke:rgb(50, 50, 50);stroke-width:2" stroke-dasharray="5 3" fill="#ffffee" fill-opacity="0.4"/>
            <text id="a4Text" x="880" y="90">A4</text>
        </svg>  
    </div>  
    <div id="zoom-container">
            <div id="zoom-message-box"><img width="25%" height="27px" src="../Shared/icons/zoom-message-icon.svg"/> <text id ="zoom-message">1x</text></div>
            <div class="diagramZoomIcons" onclick='zoomin();'>
                <img src="../Shared/icons/diagram_zoomin.svg"/>
                <span class="zoomToolTipText"><b>Zoom IN</b><br>
                    <p>Zoom in on viewed area</p><br>
                    <p id="tooltip-ZOOM_IN" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div class="diagramZoomIcons" onclick='zoomout();'>
                <img src="../Shared/icons/diagram_zoomout.svg"/>
                <span class="zoomToolTipText"><b>Zoom OUT</b><br>
                    <p>Zoom out on viewed area</p><br>
                    <p id="tooltip-ZOOM_OUT" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div class="diagramZoomIcons" onclick="zoomreset()">
                <img src="../Shared/icons/diagram_zoomratio1to1.svg"/>
                <span class="zoomToolTipText"><b>Zoom RESET</b><br>
                    <p>Reset the zoom to 1x</p><br>
                    <p id="tooltip-ZOOM_RESET" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </div>
    <div id="options-pane" class="hide-options-pane"> <!-- Yellow menu on right side of screen -->
        <div id="options-pane-button" onclick="toggleOptionsPane();"><span id='optmarker'>&#9660;Options</span>
            <span id="tooltip-OPTIONS" class="toolTipText"><b>Show Option Panel</b><br>
                <p>Enable/disable the Option Panel</p><br>
                <p id="tooltip-OPTIONS" class="key_tooltip">Keybinding:</p>
            </span>
        </div>
        <div id ="fieldsetBox">
            <fieldset id='propertyFieldset' class='options-fieldset options-fieldset-hidden'>
            </fieldset>

            <fieldset class='options-fieldset options-section'>
                <legend>Toggle</legend>
                <button id="gridToggle" class="saveButton" onclick="toggleGrid();">Grid</button><br><br>
                <button id="rulerSnapToGrid" class="saveButton" onclick="toggleSnapToGrid()">Snap to grid</button><br><br>
                <button id="rulerToggle" class="saveButton" style="background-color:#362049;" onclick="toggleRuler()">Ruler</button><br><br>
                <button id="a4TemplateToggle" class="saveButton" onclick="toggleA4Template()">A4 template</button><br><br>
                <button id="darkmodeToggle" class="saveButton" onclick="toggleDarkmode()">Darkmode</button><br><br>
                <button id="diagramDropDownToggle" class="saveButton" onclick="toggleDiagramDropdown()">Example diagrams </button><br><br>
                <div class="dropdownContent">
                    <select id="diagramTypeDropdown" onchange="checkDropdownOption()">
                        <option >Null</option>
                        <option value="JSON/IEDiagramMockup.json">IE diagrams</option>
                        <option  value="JSON/UMLDiagramMockup.json">UML diagrams</option>
                        <option value="JSON/ERDiagramMockup.json">ER diagrams </option>
                    </select>
                    <button class="saveButton" id="diagramLoad" onclick="loadMockupDiagram();">Load</button>
                </div>

                <div id="a4Options" style="display:flex;">
                    <button id="a4VerticalButton" style="display:none; width:76px; margin-right:45%;" onclick="toggleA4Vertical()">Vertical</button>
                    <button id="a4HorizontalButton" style="display:none;" onclick="toggleA4Horizontal()">Horizontal</button>
                </div>
            </fieldset>
            <fieldset class='options-fieldset options-section'>
                <legend>Export</legend>
                <button class="saveButton" onclick="exportWithHistory();">With history</button><br><br>
                <button class="saveButton" onclick="exportWithoutHistory();">Without history</button>
            </fieldset>
            <fieldset class='options-fieldset options-section'>
                <legend>Import</legend>
                <input style="width: 100%" id="importDiagramFile" type="file"><br><br>
                <button class="saveButton" onclick="loadDiagram();">Load</button>
            </fieldset>
        </div>
      <!-- 
        <div id="zoom-container">
            <div class="diagramZoomIcons" onclick='zoomin();'>
                <img src="../Shared/icons/diagram_zoomin.svg" alt="Zoom in"/>
                <span class="zoomToolTipText"><b>Zoom IN</b><br>
                    <p>Zoom in on viewed area</p><br>
                    <p id="tooltip-ZOOM_IN" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div class="diagramZoomIcons" onclick='zoomout();'>
                <img src="../Shared/icons/diagram_zoomout.svg" alt="Zoom out"/>
                <span class="zoomToolTipText"><b>Zoom OUT</b><br>
                    <p>Zoom out on viewed area</p><br>
                    <p id="tooltip-ZOOM_OUT" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
            <div class="diagramZoomIcons" onclick="zoomreset()">
                <img src="../Shared/icons/diagram_zoomratio1to1.svg" alt="Zoom reset"/>
                <span class="zoomToolTipText"><b>Zoom RESET</b><br>
                    <p>Reset the zoom to 1x</p><br>
                    <p id="tooltip-ZOOM_RESET" class="key_tooltip">Keybinding:</p>
                </span>
            </div>
        </div>
   -->

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
            <div style="width: 250px">
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
