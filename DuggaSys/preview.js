


//GLOBAL
var windowIsOpen;  //måste skapa en funktion till denna


//funcion for showing popupWindow

function popupWindow(){
    //initializeName();

    alert('hello it works');
}



//This is just some comments on what we need to do, feel free to edit och suggest ideas.
//Need to implement some variables and function, this is a not working beta-test.
//Obs the funtion names are just random and will be changed.

function initializeName() {     //Change name!
    windowIsOpen = true;
    run();
}


/**************************************************************
-----------------------------run()-----------------------------
 The run function will execute when called, the purpose is that
 as long as the wndow is open a set of different funtions will
 run along. It will constantly check for updates and if the
 variable windowIsOpen == false the while-loop will break and
 the window close.
 **************************************************************/
function run(){
    //Set frame ?
    while (windowIsOpen == true){
		//calls the function that handles the users key-events - updateText();
		//checks if the user wants to save the file - saveFile();
        updateCode();
		//closeWi(); kolla
        reWriteCode();
	}   //when the variable windowIsOpen = false {
		//close the window
	//}
}

function reWriteCode(){
    //call parseMarkdown
    // empty window ----> !empty window
    //rewrite the code to the second window
    //check for updates, if there is any call reWrite()
    //if not - do nothing
}
/*
Maybe we should create a seperate funtion for the keyIsPressed? Call the keyIsPressed here and in the updateText
just uppdate the window with the latest update?
updateText <<<<<{
	when a keyboard is pressed and detected {
		call a function that paseMarkdown

	}
}
 */

//----------------------------updateCode----------------------------//
//For now, we need to rename it and change the function to saveFile() later
//if the user presses the save button we shold save it with this function
function updateCode(){
    //kolla efter key-input
    //check for updates, if there is any call reWrite()
    //if not - do nothing
}


function closeWindow(){
    //knapp som stänger
	//if the user presses the cancel-button windowIsOpen = false{
		windowIsOpen = false;
	  //  same thing happens here, the window will close
	//}
}








