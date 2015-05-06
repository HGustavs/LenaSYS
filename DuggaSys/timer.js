var Timer = {	
	timer: undefined,
	timeSpent: 0,
	startTimer: function(){
		var self = this;
		this.timer = setInterval( function(){self.incrementTimer(); self.animateTimer();}, 1000 );
		this.animateTimer();
	},
	stopTimer: function(){
		var self = this;
		clearInterval(self.timer);
	},
	incrementTimer: function(){
		this.timeSpent++;
	},
	animateTimer: function(){
		var hours = Math.floor(this.timeSpent / 3600);
		var minutes = Math.floor(this.timeSpent / 60);
		var seconds = this.timeSpent % 60;

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

		document.getElementById('duggaTimer').innerHTML = str;
	}
}	
