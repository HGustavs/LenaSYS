//---------------------------------------------------------------------------------------------------------------
// Click counter - Used by highscore system implementations in dugga's to count the number of button clicks
//---------------------------------------------------------------------------------------------------------------

var ClickCounter = {
	// Used to count clicks
	noClicks: 0,
	
	// Initializes the noClicks variable, called at the start of a dugga
	initialize: function() {
		this.noClicks = 0;	
	},
	
	// Called whenever a dugga should count a mouse click, e.g., when a user presses a button
	onClick: function() {
		// Increments the click counter by one
		this.noClicks++;
		
		// Calls animate clicks to directly update the click counter user interface 
		this.animateClicks();
	},
	
	// Updates the click counter user interface in a dugga, uses the same 
	animateClicks: function() {
		// Apply some web magic to change the ui counter
		var str = "<p>";
		str += this.noClicks;
		document.getElementById('duggaTimer').innerHTML = str;
	}
}
