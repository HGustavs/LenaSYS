// Global variables for analytics
var analytics = {
	chartType: null,
	chartData: null
};

//------------------------------------------------------------------------------------------------
// Document ready callback		
//------------------------------------------------------------------------------------------------
$(function() {
	$(window).resize(function() {
		switch (analytics.chartType) {
			case "bar":
				drawBarChart(analytics.chartData);
				break;
			case "pie":
				drawPieChart(analytics.chartData);
				break;
			case "line":
				drawLineChart(analytics.chartData);
				break;
		}
	});
	loadGeneralStats();
});

//------------------------------------------------------------------------------------------------
// Removes the chart data and clears the chart canvas	
//------------------------------------------------------------------------------------------------
function resetAnalyticsChart() {
	analytics.chartType = null;
	analytics.chartData = null;
	clearCanvas($("#analytic-chart")[0]);
}

//------------------------------------------------------------------------------------------------
// Loads data from the analytictoolservice using an ajax call
// @parameter q  : what query to run
// @parameter cb : callback for when data is retrieved, cb(data)
//------------------------------------------------------------------------------------------------
function loadAnalytics(q, cb) {
	$.ajax({
		url: "analyticService.php",
		type: "POST",
		dataType: "json",
		data: {query: q},
		success: function(data) {
			resetAnalyticsChart();
			$('#analytic-info').empty();
			cb(data);
		}
	});
}

//------------------------------------------------------------------------------------------------
// Analytic loaders START	
//------------------------------------------------------------------------------------------------
function loadGeneralStats() {
	loadAnalytics("generalStats", function(data) {
		$('#analytic-info').append("<p>General statistics about the system.</p>");

		var tableData = [["Stat", "Value"]];
		for (var stat in data) {
			if (data.hasOwnProperty(stat)) {
				tableData.push([
					stat,
					data[stat]
				]);
			}
		}
		$('#analytic-info').append(renderTable(tableData));
	});
}

function loadPasswordGuessing() {
	loadAnalytics("passwordGuessing", function(data) {
		$('#analytic-info').append("<p>Potential brute force attacks.</p>");

		var tableData = [["Username", "Remote address", "User agent", "Tries"]];
		for (var i = 0; i < data.length; i++) {
			tableData.push([
				data[i].userName,
				data[i].remoteAddress,
				data[i].userAgent,
				data[i].tries
			]);
		}
		$('#analytic-info').append(renderTable(tableData));
	});
}

function loadOsPercentage() {
	loadAnalytics("osPercentage", function(data) {
		$('#analytic-info').append("<p>OS percentage for main page views.</p>");

		var tableData = [["Operating system", "Percentage"]];
		for (var i = 0; i < data.length; i++) {
			tableData.push([
				data[i].operatingSystem,
				(+data[i].percentage).toFixed(2)
			]);
		}
		$('#analytic-info').append(renderTable(tableData));

		var chartData = [];
		for (var i = 0; i < data.length; i++) {
			chartData.push({
				label: data[i].operatingSystem,
				value: data[i].percentage
			});
		}
		drawPieChart(chartData);
	});
}

function loadBrowserPercentage() {
	loadAnalytics("browserPercentage", function(data) {
		$('#analytic-info').append("<p>Browser percentage for main page views.</p>");

		var tableData = [["Browser", "Percentage"]];
		for (var i = 0; i < data.length; i++) {
			tableData.push([
				data[i].browser,
				data[i].percentage
			]);
		}
		$('#analytic-info').append(renderTable(tableData));

		var chartData = [];
		for (var i = 0; i < data.length; i++) {
			chartData.push({
				label: data[i].browser,
				value: data[i].percentage
			});
		}
		drawPieChart(chartData);
	});
}

function loadServiceUsage() {
	resetAnalyticsChart();
	$('#analytic-info').empty();
	$('#analytic-info').append("<p>Service usage</p>");

	var inputDateFrom = $('<input type="text"></input>')
		.datepicker({
			dateFormat: "yy-mm-dd"
		})
		.datepicker("setDate", "-1m")
		.appendTo($('#analytic-info'));

	var inputDateTo = $('<input type="text"></input>')
		.datepicker({
			dateFormat: "yy-mm-dd"
		})
		.datepicker("setDate", "+1d")
		.appendTo($('#analytic-info'));

	var selectInterval = $("<select></select>")
		.append('<option value="hourly">Hourly</option>')
		.append('<option value="daily" selected>Daily</option>')
		.append('<option value="weekly">Weekly</option>')
		.append('<option value="monthly">Monthly</option>')
		.appendTo($('#analytic-info'));

	function updateServiceUsage() {
		$.ajax({
			url: "analyticService.php",
			type: "POST",
			dataType: "json",
			data: {
				query: "serviceUsage",
				start: inputDateFrom.val(),
				end: inputDateTo.val(),
				interval: selectInterval.val()
			},
			success: function(data) {
				resetAnalyticsChart();

				var services = {};
				$.each(data, function(i, row) {
					if (!services.hasOwnProperty(row.service)) {
						services[row.service] = [];
					}
					services[row.service].push({
						X: row.dateTime,
						Y: row.hits
					});
				});

				$('#analytic-info > select.service-select').remove();
				var serviceSelect = $('<select class="service-select"></select>');
				for (var service in services) {
					if (services.hasOwnProperty(service)) {
						serviceSelect.append('<option value="' + service + '">' + service + '</option>')
					}
				}
				serviceSelect.change(function() {
					drawLineChart(services[$(this).val()]);
				});
				$('#analytic-info').append(serviceSelect);
				serviceSelect.change();
			}
		});
	}

	inputDateFrom.change(updateServiceUsage);
	inputDateTo.change(updateServiceUsage);
	selectInterval.change(updateServiceUsage);

	updateServiceUsage();
}

function loadServiceAvgDuration() {
	loadAnalytics("serviceAvgDuration", function(data) {
		$('#analytic-info').append("<p>The average duration of service call completion in milliseconds.</p>");

		var tableData = [
			["Service", "Average duration (ms)"]
		];
		for (var i = 0; i < data.length; i++) {
			tableData.push([
				data[i].service,
				data[i].avgDuration
			]);
		}
		$('#analytic-info').append(renderTable(tableData));

		var chartData = [];
		for (var i = 0; i < data.length; i++) {
			chartData.push({
				label: data[i].service,
				value: data[i].avgDuration
			});
		}
		drawBarChart(chartData);
	});
}

function loadServiceCrashes() {
	loadAnalytics("serviceCrashes", function(data) {
		$('#analytic-info').append("<p>Service requests with missing steps</p><hr>");

		var crashes = {};
		$.each(data, function(i, step) {
			if (crashes[step.uuid] === undefined) {
				crashes[step.uuid] = {
					service: step.service,
					userAgent: step.userAgent,
					operatingSystem: step.operatingSystem,
					browser: step.browser,
					steps: {}
				};
			}
			crashes[step.uuid].steps[step.eventType] = new Date(Number(step.timestamp));
		});


		function pad(n, width) {
			n = n + '';
			return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
		}

		/*function formatDate(date) {
			var year = date.getFullYear();
			var month = date.getMonth();
			var day = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var seconds = date.getSeconds();
			var millis = date.getMilliseconds();
			return year + "-" + pad(month, 2) + "-" + pad(day, 2) + " " + pad(hour, 2) + ":" + pad(minute, 2) + ":" + pad(seconds, 2) + "." + pad(millis, 3);
		}*/

		$.each(crashes, function(i, crash) {
			var str = "<div>";
			str += "Service: " + crash.service;
			str += "<br>User agent: " + crash.userAgent;
			str += "<br>OS: " + crash.operatingSystem;
			str += "<br>Browser: " + crash.browser;
			/*str += "<br><br>Client start: " + formatDate(crash.steps[5]);
			str += "<br>Server start: " + (crash.steps[6] === undefined ? 'missing' : formatDate(crash.steps[6]));
			str += "<br>Server end: " + (crash.steps[7] === undefined ? 'missing' : formatDate(crash.steps[7]));
			str += "<br>Client end (fourth round trip): " + (crash.steps[8] === undefined ? 'missing' : formatDate(crash.steps[8]));*/
			str += "<br><hr></div>";
			$('#analytic-info').append(str);
		});
	});

}


function loadFileInformation() {
    $('#analytic-info').empty();
	$('#analytic-info').append("<p>File information for created and edited files.</p>");
	
	/* SAVE FOR LATER: DATE PICKING
    var inputDateFrom = $('<input type="text"></input>')
        .datepicker({
            dateFormat: "yy-mm-dd"
        })
        .datepicker("setDate", "-1m")
        .appendTo($('#analytic-info'));
 
    var inputDateTo = $('<input type="text"></input>')
        .datepicker({
            dateFormat: "yy-mm-dd"
        })
        .datepicker("setDate", "+1d")
        .appendTo($('#analytic-info'));
	*/
 
    function updateFileInformation() {
        $.ajax({
            url: "analyticService.php",
            type: "POST",
            dataType: "json",
            data: {
				query: "fileInformation",
            },
            success: function(data) {
                var files = {};
                $.each(data, function(i, row) {
                    var description = row.description.split(" ");
                    var version = description[0];
                    var file =  description[1];
 
                    if(row.eventType == 15){
                        var action = "Created"
                    }
                    else{
                        var action = "Edited"
                    }
 
                    if (!files.hasOwnProperty(file)) {
                        files[file] = [["Username", "Action", "Version", "File", "Timestamp"]];
                    }
                    files[file].push([
                        row.userName,
                        action,
                        version,
                        file,
                        row.timestamp
                    ]);
                });
 
                $('#analytic-info > select.file-select').remove();
                var fileSelect = $('<select class="file-select"></select>');
                for (var file in files) {
                    if (files.hasOwnProperty(file)) {
                        fileSelect.append('<option value="' + file + '">' + file + '</option>')
                    }
                }
                fileSelect.change(function() {
					deleteTable();
                    $('#analytic-info').append(renderTable(files[$(this).val()]));
                });
                $('#analytic-info').append(fileSelect);
                fileSelect.change();
            }
        });
    }
   
	// SAVE FOR LATER: DATE PICKING
    //inputDateFrom.change(updateFileInformation);
    //inputDateTo.change(updateFileInformation);
 
    updateFileInformation();
}

//------------------------------------------------------------------------------------------------
// Analytic loaders END	
//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Fits a canvas to its container	
//------------------------------------------------------------------------------------------------
function fitCanvasToContainer(canvas){
	canvas.style.width="100%";
	canvas.style.height="100%";
	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
}

//------------------------------------------------------------------------------------------------
// Clears a canvas and resets the transform property
//------------------------------------------------------------------------------------------------
function clearCanvas(canvas) {
	var ctx = canvas.getContext("2d");
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//------------------------------------------------------------------------------------------------
// Deletes tables with the class name "rows" 
//------------------------------------------------------------------------------------------------
function deleteTable() {
	var table = document.getElementsByClassName("rows");
    while(table.length > 0){
        table[0].parentNode.removeChild(table[0]);
    }
}

//------------------------------------------------------------------------------------------------
// Returns the highest value in the chart data
//------------------------------------------------------------------------------------------------
function chartDataMax(data) {
	var max = 0;
	$.each(data, function(i, obj) {
		if (max < Number(obj.value)) max = Number(obj.value);
	});
	return max;
}

//------------------------------------------------------------------------------------------------
// Returns the width (in pixels) of the longest label in the data
//------------------------------------------------------------------------------------------------
function chartDataLongestLabelWidth(data, ctx) {
	var longest = 0;
	$.each(data, function(i, obj) {
		if (longest < ctx.measureText(obj.label).width) longest = ctx.measureText(obj.label).width
	});
	return longest;
}

//------------------------------------------------------------------------------------------------
// Draws a bar chart with the data given
//------------------------------------------------------------------------------------------------
function drawBarChart(data) {
	if (!$.isArray(data)) return;

	analytics.chartType = "bar";
	analytics.chartData = data;

	var canvas = $("#analytic-chart")[0];
	var ctx = canvas.getContext("2d");

	fitCanvasToContainer(canvas);
	clearCanvas(canvas);
	
	var barWidth = 40;
	var fontSize = 12;
	ctx.font = fontSize + "px Arial";
	ctx.textAlign = "center";
	ctx.translate(0, canvas.height);

	var barSpacing = chartDataLongestLabelWidth(data, ctx) - barWidth + 10;
	barSpacing = barSpacing > 50 ? barSpacing : 50;
	var textAreaHeight = fontSize * 2.2;
	var barHeightMultiplier = (canvas.height - textAreaHeight) / chartDataMax(data);
	
	for (var i = 0; i < data.length; i++) {
		var x = barSpacing + i * (barWidth + barSpacing);
		ctx.fillStyle = "#614875";
		ctx.scale(1, -1);
		ctx.fillRect(x, textAreaHeight, barWidth, data[i].value * barHeightMultiplier);
		ctx.scale(1, -1);
		ctx.fillStyle = "white";
		ctx.fillText(Number(data[i].value).toFixed(0), x + barWidth / 2, -data[i].value * barHeightMultiplier);
		ctx.fillStyle = "black";
		ctx.fillText(data[i].label, x + barWidth / 2, -textAreaHeight / 2);
	}
}

//------------------------------------------------------------------------------------------------
// Generates a random pastel color in hex format and returns it
//------------------------------------------------------------------------------------------------
function getRandomColor() {
	var r = Math.floor((Math.floor(Math.random() * 255) + 255) / 2);
	var g = Math.floor((Math.floor(Math.random() * 255) + 255) / 2);
	var b = Math.floor((Math.floor(Math.random() * 255) + 255) / 2);
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

//------------------------------------------------------------------------------------------------
// Draws a pie chart with the data given
//------------------------------------------------------------------------------------------------
function drawPieChart(data) {
	if (!$.isArray(data)) return;

	analytics.chartType = "pie";
	analytics.chartData = data;

	var canvas = $("#analytic-chart")[0];
	var ctx = canvas.getContext("2d");

	fitCanvasToContainer(canvas);
	clearCanvas(canvas);

	var total = 0;
	for (var i = 0; i < data.length; i++) {
		total += (isNaN(data[i].value)) ? 0 : Number(data[i].value);
	}

	var fontSize = 14;
	var textAreaHeight = fontSize * 2.2;
	var radius = canvas.height / 2;
	var last = 0;
	for (var i = 0; i < data.length; i++) {
		ctx.fillStyle = getRandomColor();
		ctx.beginPath();
		ctx.moveTo(radius, radius);
		ctx.arc(radius, radius, radius, last, last + (Math.PI*2*(data[i].value/total)), false);
		ctx.lineTo(radius, radius);
		ctx.fill();
		last += (Math.PI*2*(data[i].value/total));

		ctx.fillRect(radius * 2 + 30, i * textAreaHeight + 20, 12, 12);
		ctx.fillStyle = "black";
		ctx.font = fontSize + "px Arial";
		ctx.fillText(data[i].label, radius * 2 + 50, i * textAreaHeight + textAreaHeight);
	}
}

function renderTable(data) {
	if (!$.isArray(data)) return;

	var str = '<table class="list rows">';
	if (data.length > 0) {
		// Render headings
		str += "<thead><tr>";
		$.each(data[0], function(i, s){
			str += "<th>" + s + "</th>";
		});
		str += "</tr></thead><tbody>";

		// Render rows
		$.each(data, function(i, row) {
			if (i === 0) return;
			str += "<tr>";
			$.each(row, function(j, col) {
				str += "<td>" + col + "</td>";
			});
			str += "</tr>"
		});
	}
	str += "</tbody></table>";
	return str;
}

function drawLineChart(data) {
	if (!$.isArray(data)) return;

	analytics.chartType = "line";
	analytics.chartData = data;

	var canvas = $("#analytic-chart")[0];
	var ctx = canvas.getContext("2d");

	fitCanvasToContainer(canvas);
	clearCanvas(canvas);

	var xPadding = 30;
	var yPadding = 30;

	function getMaxY() {
		var max = 0;
		for (var i = 0; i < data.length; i++) {
			if (data[i].Y > max) {
				max = data[i].Y;
			}
		}
		return max;
	}

	function getXPixel(val) {
		return ((canvas.width - xPadding) / data.length) * val + (xPadding * 1.5);
	}

	function getYPixel(val) {
		return canvas.height - (((canvas.height - yPadding) / getMaxY()) * val) - yPadding;
	}

	ctx.lineWidth = 2;
	ctx.strokeStyle = "#333";
	ctx.font = "Arial 8pt";
	ctx.textAlign = "center"

	// Draw L
	ctx.beginPath();
	ctx.moveTo(xPadding, 0);
	ctx.lineTo(xPadding, canvas.height - yPadding);
	ctx.lineTo(canvas.width, canvas.height -yPadding);
	ctx.stroke();

	// Draw X values
	for (var i = 0; i < data.length; i++) {
		ctx.fillText(data[i].X, getXPixel(i), canvas.height - yPadding + 20);
	}

	// Draw Y values
	ctx.textAlign = "right";
	ctx.textBaseline = "middle";
	for (var i = 0; i < getMaxY(); i += 5) {
		ctx.fillText(i, xPadding - 10, getYPixel(i));
	}

	// Draw line graph
	ctx.strokeStyle = "#614875";
	ctx.beginPath();
	ctx.moveTo(getXPixel(0), getYPixel(data[0].Y));
	for(var i = 1; i < data.length; i++) {
		ctx.lineTo(getXPixel(i), getYPixel(data[i].Y));
	}
	ctx.stroke();
}