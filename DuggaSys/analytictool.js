$(function() {
	loadGeneralStats();
});

function loadAnalytics(q, cb) {
	$.ajax({
		url: 'analytictoolservice.php',
		type: 'POST',
		dataType: 'json',
		data: {query: q},
		success: function(data) {
			$('#analytic-data').empty();
			$('#analytic-data').append('<pre>' + JSON.stringify(data, null, 4));
			cb(data);
		}
	});
}

function loadGeneralStats() {
	loadAnalytics("generalStats", function(data) {
	});
}

function loadPasswordGuessing() {
	loadAnalytics("passwordGuessing", function(data) {
	});
}

function loadOsPercentage() {
	loadAnalytics("osPercentage", function(data) {
	});
}

function loadBrowserPercentage() {
	loadAnalytics("browserPercentage", function(data) {
	});
}

function loadServiceUsage() {
	loadAnalytics("serviceUsage", function(data) {
	});
}

function loadServiceAvgDuration() {
	loadAnalytics("serviceAvgDuration", function(data) {
		var chartData = [];
		for (var i = 0; i < data.length; i++) {
			chartData.push({
				label: data[i].service,
				value: data[i].avgDuration
			});
		}
		drawBarChart($('#analytic-chart'), chartData);
	});
}

function loadServiceCrashes() {
	loadAnalytics("serviceCrashes", function(data) {
	});
}


function chartDataMax(data) {
	var max = 0;
	$.each(data, function(i, obj) {
		if (max < obj.value) max = obj.value;
	});
	return max;
}

function chartDataLongestLabelWidth(data, ctx) {
	var longest = 0;
	$.each(data, function(i, obj) {
		if (longest < ctx.measureText(obj.label).width) longest = ctx.measureText(obj.label).width
	});
	return longest;
}

function drawBarChart(canvas, data) {
	if (!$.isArray(data)) return;
	$(canvas).each(function(i, el) {
		if ($(el).is('canvas')) {
			var barWidth = 40;
			var fontSize = 12;

			var ctx = el.getContext("2d");
			ctx.font = fontSize + "px Arial";
			ctx.textAlign = "center";
			ctx.translate(0, el.height);

			var barSpacing = chartDataLongestLabelWidth(data, ctx) - barWidth + 10;
			barSpacing = barSpacing > 50 ? barSpacing : 50;
			var textAreaHeight = fontSize * 2.2;
			var barHeightMultiplier = (el.height - textAreaHeight) / chartDataMax(data);
			
			for (var i = 0; i < data.length; i++) {
				ctx.fillStyle = "#614875";
				ctx.scale(1, -1);
				ctx.fillRect(barSpacing + i * (barWidth + barSpacing), textAreaHeight, barWidth, data[i].value * barHeightMultiplier);
				ctx.fillStyle = "black";
				ctx.scale(1, -1);
				ctx.fillText(data[i].label, barSpacing + i * (barWidth + barSpacing) + barWidth / 2, -textAreaHeight / 2);
			}
		}
	});
}
