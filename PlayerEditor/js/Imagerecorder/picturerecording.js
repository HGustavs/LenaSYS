		/*
		 * Declaring an array that will act as a picutre library(for the time being), and adding pictures to the array.
		 */
		var picArray = new Array();
			
		var img = document.createElement("IMG");
		img.src = "pictures/a.png";
		picArray[0] = new Image();
		picArray[0] = img;
		
		var img1 = document.createElement("IMG");
		img1.src = "pictures/b.png"
		picArray[1] = new Image();
		picArray[1] = img1;

		var img2 = document.createElement("IMG");
		img2.src = "pictures/c.png"
		picArray[2] = new Image();
		picArray[2] = img2;
		
		var img3 = document.createElement("IMG");
		img3.src = "pictures/d.png"
		picArray[3] = new Image();
		picArray[3] = img3;
		
		/*
		 *  this function checks the mouse coords via an event that occurs when the user clicks the div-element
		 *  then calls the function that changes the picture. 
		 */
		function checkMouseCoords(event){
			var xMouse = event.clientX;
			var yMouse = event.clientY;
		
			document.getElementById('xCord').innerHTML=xMouse;
			document.getElementById('yCord').innerHTML=yMouse;
	
		changePic();
		}
		/*
		 *  Function that fills the div-element with a picture. Changes picture depending on the 
		 *  array number, which is declared by the variable "i". Also removes the previous picture.
		 */
		var i = 0;
		function changePic(){
			document.getElementById('iPic').innerHTML=i;	
			document.getElementById('OutputDiv').appendChild(picArray[i]);

			if(i > 0){
				document.getElementById('OutputDiv').removeChild(picArray[i-1]);
			}	
		}
		/*
		 *  Adds 1 to "i" each time the user releases the mousebutton.
		 */
		function addI(){
			i++;
		}