//---------------------------------------------------------------------------------------------------------------
// Timer - Used in dugga's to count the amount of time spent on a dugga
//---------------------------------------------------------------------------------------------------------------

var Timer = {	
	// Determines if the timer should update ui
	update: 0,

	// Declare the timer variable, will be accessible from this object in a dugga
	timer: undefined,
	
	// Counts the amount of time spent on a dugga
	score: 0,
	
	// Called at the start of a dugga to initialize the object
	startTimer: function(){
		var self = this;
		
		// Sets the update interval of the timer, calls animate timer on increment
		this.timer = setInterval( function(){self.incrementTimer(); self.animateTimer();}, 1000 );
		
		// Call animate timer to initialize ui at 00:00:00
		this.animateTimer();
	},
	// Reset the timer.
	reset: function(){
		this.score = 0;

		// Call animate timer to initialize ui at 00:00:00
		this.animateTimer();
	},
	
	// Stops the timer from counting, called at the end of a dugga
	stopTimer: function(){
		var self = this;
		clearInterval(self.timer);
		
		// Quick fix
		this.update = 1;
	},
	
	// Increments the time counter by one
	incrementTimer: function(){
		this.score++;
	},
	
	//Show timer
	showTimer: function(){
		this.animateTimer();
	},
	
	// Updates the user interface
	animateTimer: function(){
		// Calculate hours, minutes and seconds based on timespent
		var hours = Math.floor(this.score / 3600);
		var minutes = Math.floor(this.score / 60) % 60;
		var seconds = this.score % 60;

		// Create a nice looking clock thing with the information we have
		var str = "<p>";
		str += hours + ":";
		
		if(minutes < 10){
			str += 0;
		}

		str += minutes + ":";
		if(seconds < 10){
			str += 0;
		}
		str += seconds;

		// Push new value to ui thing
		if(this.update == 0) {
			document.getElementById('scoreElement').innerHTML = str;
		}
	}
}	
