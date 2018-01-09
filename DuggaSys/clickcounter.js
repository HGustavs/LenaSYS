//---------------------------------------------------------------------------------------------------------------
// Click counter - Used by highscore system implementations in dugga's to count the number of button clicks
//---------------------------------------------------------------------------------------------------------------

var ClickCounter = {
	// Used to count clicks
	score: 0,
	
	// Initializes the noClicks variable, called at the start of a dugga
	initialize: function() {
		this.score = 0;
		this.animateClicks();	
	},
	
	// Called whenever a dugga should count a mouse click, e.g., when a user presses a button
	onClick: function() {
		// Increments the click counter by one
		this.score++;
		
		// Calls animate clicks to directly update the click counter user interface 
		this.animateClicks();
	},
	
	//show clicker
	showClicker: function(){
		this.animateClicks();
	},
	
	// Updates the click counter user interface in a dugga, uses the same 
	animateClicks: function() {
		var cc = document.getElementById('scoreElement');
		if (cc){
			// Apply some web magic to change the ui counter
			var str = "<p>";
			str += this.score;
			cc.innerHTML = str;      
		}
	}
}
