# Docs for diagram.js
Each function will be explained briefly and what this is connected to. 

## CLASSES REGION

## State Machine functions
These create a new instance of StateChange based on whatever parameter a given function takes. These states are states of the site, which are stores to be used in undo and redo, like ctrl+z.

### appendValuesFrom(changes)
This is used in the function save and its main purpose is copying values from one state change to a new state change.

### ElementCreated(element)
Called in mouseMode_onMouseUp while the cursor is in PLACING_ELEMENT mode. For creating a new instance of the StateChange based on the new element created.

### ElementsDeleted(element)
Similar to ElementCreated but used instead for when elements are deleted. Called in removeElements.

### ElementsMoved(elementIDs, moveX, moveY)
Creates a new instance of StateChange for when elements are moved. This is used in setPos. 

### ElementResized(elementIDs, changeX, changeY)
Creates a new instance of StateChange for when elements are resized. This is used in mmoving when the user clicks a node (those blue things for resizing elements)

### ElementMovedAndResized(elementIDs, moveX, moveY, changeX, changeY)
self explanatory. Used in mmoving.

### ElementAttributesChanged(elementID, changeList)
Creates a new StateChange for when elements attributes' have changed. Called in changeState, saveProperties, changeLineProperties, toggleEntityLocked and setElementColors

### LineAdded(line)
Creates a new StateChange for when a line is added. Called in addObjectToLines

### LinesRemoved(lines)
similar to LineAdded, called in removeLines

### These two are the same as the rest but slightly different, just the function names are explenation enough.
#### ElementsAndLinesDeleted(elements, lines)
#### ElementsAndLinesCreated(elements, lines)

### save(stateChangeArray, changeType)
Stores the passed state change into the state machine. This is used in, for example, mouseMode_onMouseUp when the mouse is in PLACING_ELEMENT mode.

### removeFutureStates() 
Remove the history entries that are after current index. This is used in exportWithHistory, storeDiagramInLocalStorage, loadDiagram and loadDiagramFromString. It is worth noting that it used to be called in resetDiagram but since we created the loadMockupDiagram function, we commented out the entirety of resetDiagram and replaced it with a single call for loadMockupDiagram. Perhaps this is a mistake and this should be calling upon the state machine so that a user can undo a load? It is not hard to imagine a mistake where a user accidentally deletes thier work by loading an example diagram ontop of everything and not being able to undo this.

### stepBack()
Undoes the last stored history log changes. Think ctrl+z

### stepForward()
Think ctrl + y, opposite of stepBack. Worth noting that stepForward calls a bunch of functions at the end itself: 
clearContext();
showdata();
updatepos(0, 0);
displayMessage(messageTypes.SUCCESS, "Changes reverse reverted!")

All of these except displayMessage updates the diagram in some way.

This is called in toggleStepForward. It is also called via a keybind in the Window Events region.

### scrubHistory(endIndex)
This has no comments or description but it seems it iterates through all the states and calls restoreState on it to restore them. This is used in stepBack and replay.

### restoreState(state)
Restore an given state. This is called in stepForward, scrubHistory and replay.

### gotoInitialState()
Go back to the inital state in the diagram. This is called in scrubHistory.

### replay(cri = parseInt(document.getElementById("replay-range").value))
Create a timers and go-through all states grouped by time. This is used in the replay function so that you can see how you built a diagram. This is used in toggleReplay().

## ENUMS REGION
Writers note, enums stands for enumerability and mozilla MDN has a page on this.

### getData()
This is the very first function that is called when the window is loaded. It calls many other functions such as generateToolTips() and toggleGrid().

### showDiagramTypes()
Used to determine the tools shown depending on diagram type. As far as I can tell, this seems to only be called in setPreviewValues() which, as of the time of writing, always throws an error.

## EVENTS REGION

### mwheel(event)
Event function triggered when the mousewheel reader has a value of grater or less than 0. This subsequently calls zoomin or zoomout function. As well as setTimeout which sets a new timeout to determine the time until the user is allowed to zoom again.

### mdown(event)
Event function triggered when any mouse button is pressed down on top of the container. The "container" here is, in my opinion, easier to look at as the diagram board.

This function checks which button was pressed; left, right or middle and then does varios actions depending on this. It will also prevent certain unwanted actions like middle mouse panning when moving an object.

### ddown(event)
Event function triggered when any mouse button is pressed down on top of any element.

This is given to divs surrounding diagram elements, to catch mouse button events on them.

### mouseMode_onMouseUp(event)
Called on mouse up if no pointer state has blocked the input in the mup()-function.

This calls the functions that create elements, it also checks overlapping before calling these. 

### tup(event) 
Event function triggered when any mouse button is released on top of the toolbar.

It is called on mouseup for the toolbar. A notable functionality of this is that it resets the pointerstate to DEFAULT.

### mup(event)
Event function triggered when any mouse button is released on top of the container. Logic is handled depending on the current pointer state.

### mouseEnter()
change cursor style when mouse hovering over an element.

### mouseLeave()
change cursor style when mouse is hovering over the container.

### checkDeleteBtn()
Checks if the mouse is hovering over the delete button on selected element/s and deletes it/them.

### mouseOverSelection(mouseX, mouseY)
change cursor style if mouse position is over a selection box or the deletebutton.

### determineLineSelect(mouseX, mouseY)
Calculates if any line is present on x/y position in pixels.

### didClickLine(a, b, c, circle_x, circle_y, circle_radius, line_data)
Performs a circle detection algorithm on a certain point in pixels to decide if any line was clicked.

### didClickLabel(c, lw, lh, circle_x, circle_y, circle_radius)
Performs a circle detection algorithm on a certain point in pixels to decide if a label was clicked.

### mouseMode_onMouseMove(event)
Called on mouse moving if no pointer state has blocked the event in mmoving()-function.

This calls, for example, boxSelect_Update if the mouse is in the mode BOX_SELECTION.

### mmoving(event)
Event function triggered when the mouse has moved on top of the container.

The container reffered to is the diagram board. 

This function calls drawRulerBars to update the ruler and also moves elements when in CLICKED_ELEMENT pointerState, it does this via updatepos.

This function also deals with resizing elements when in pointerState CLICKED_NODE. The site currently has support for 3 nodes, right, left and down. While there is nothing really hindering a future developer from adding more, perhaps a top node?

## ELEMENT MANIPULATION REGION
### makeRandomID()
Generates a new hexadecimal ID that is not already stored to identify things in the program.

### findIndex(arr, id)
Searches an array for the specified item and returns its stored index in the array if found.

arr is the array to be searched and id is the items that is being searched for.

### addObjectToData(object, stateMachineShouldSave = true)
Adds an object to the data array of elements.

### addObjectToLines(object, stateMachineShouldSave = true)
Adds a line to the data array of lines.

### removeElements(elementArray, stateMachineShouldSave = true)
Attempts removing all elements passed through the elementArray argument. Passed argument will be sanitized to ensure it ONLY contains real elements that are present in the data array. This is to make sure the state machine does not store deletion of non-existent objects.

### removeLines(linesArray, stateMachineShouldSave = true)
Attempts removing all lines passed through the linesArray argument. Passed argument will be sanitized to ensure it ONLY contains real lines that are present in the data array. This is to make sure the state machine does not store deletion of non-existent objects.

### makeGhost()
Generatesa a new ghost element that is used for visual feedback to the end user when creating new elements and/or lines. Setting ghostElement to null will remove the ghost element.

Ghost element is used for placing new elements.

This is called in mouseMode_onMouseUp when placing elements or edge creation. And in onMouseModeEnabled for mousemode PLACING_ELEMENT.

### constructElementOfType(type)
Creates a new element using the appropriate default values. These values are determined using the elementTypes enum.

This will return a object which is a new element of the requested type.

This is used in makeGhost to make a ghost of the selected element type. 

### getElementLines(element)
Returns all the lines (all sides) from given element

### elementHasLines(element)
Checks if the given element have lines connected to it or not.




