var ClickCounter = {
	noClicks: 0,
	
	initialize: function() {
		this.noClicks = 0;	
	},
	onClick: function() {
		this.noClicks++;
		this.animateClicks();
	},
	animateClicks: function() {
		var str = "<p>";
		str += this.noClicks;
		document.getElementById('duggaTimer').innerHTML = str;
	}
}