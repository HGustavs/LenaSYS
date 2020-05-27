// Global variables for analytics
var analytics = {
	chartType: null,
	chartData: null
};

//------------------------------------------------------------------------------------------------
// Document ready callback
//------------------------------------------------------------------------------------------------
$(function() {
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

	// Load the last page from localstorage
	switch(localStorage.getItem('analyticsPage')) {
		case "onlineUsers":
			loadCurrentlyOnline();
			break;
		case "passwordGuessing":
			loadPasswordGuessing();
			break;
		case "osPercentage":
			loadOsPercentage();
			break;
		case "browserPercentage":
			loadBrowserPercentage();
			break;
		case "serviceUsage":
			loadServiceUsage();
			break;
		case "courseDiskUsage":
			loadCourseDiskUsage();
			break;
		case "serviceAvgDuration":
			loadServiceAvgDuration();
			break;
		case "serviceCrashes":
			loadServiceCrashes();
			break;
		case "fileInformation":
			loadFileInformation();
			break;
		case "pageInformation":
			loadPageInformation();
			break;
		case "userInformation":
			loadUserInformation();
			break;
		case "generalStats":
		default:
			loadGeneralStats();
			break;
	}
});

//------------------------------------------------------------------------------------------------
// Removes the chart data and clears the chart canvas
//------------------------------------------------------------------------------------------------
function resetAnalyticsChart() {
	analytics.chartType = null;
	analytics.chartData = null;
	$( "#canvas-area" ).empty();
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
		localStorage.setItem('analyticsPage', 'generalStats');

		$('#pageTitle').text("General statistics");
		$('#analytic-info').append("<p class='analyticsDesc'>General statistics about the system.</p>");
		// Login fails
		var tableData = [["Stat", "Value"]];
		var loginFails = data['stats']['loginFails'];
		for (var stat in loginFails) {
			if (loginFails.hasOwnProperty(stat)) {
				tableData.push([
					stat,
					loginFails[stat]
				]);
			}
		}

		// Number of online users last 15 minutes
		tableData.push([
			'Online users the last 15 minutes',
			data['stats']['numOnline']
		]);

		// LenaSys Installation Size
		tableData.push([
			'LenaSYS Installation Size',
			data['stats']['lenasysSize']
		]);

		// User Submissions Size
		tableData.push([
			'User Submissions Size',
			data['stats']['userSubmissionSize']
		]);

		// Biggest Course
		tableData.push([
			'Biggest Course on Disk: ' + data['stats']['biggestCourseName'],
			data['stats']['biggestCourseSize']
		]);

		// Total number of users
		tableData.push([
			'Total Users',
			data['stats']['totalUsers']
		]);

		// Top Page
		tableData.push([
			'Top Page: ' + data['stats']['topPage'],
			'Hits: ' + data['stats']['topPageHits']
    ]);

		// Top Browser
		tableData.push([
			'Top Browser',
			data['stats']['topBrowser']
		]);

		// Top OS
		tableData.push([
			'Top OS',
			data['stats']['topOS']
		]);

        // Number of service crashes
		tableData.push([
			'Service crashes',
			data['stats']['serviceCrashes']
		]);

		// Fastest Service
		tableData.push([
			'Fastest Service: ' + data['stats']['fastestService'],
			data['stats']['fastestServiceSpeed'] + " ms"
		]);

		// Slowest Service
		tableData.push([
			'Slowest Service: ' + data['stats']['slowestService'],
			data['stats']['slowestServiceSpeed'] + " ms"
		]);

        // Top viewed Example
		tableData.push([
			'Top viewed Example: ' + data['stats']['topViewedExample'],
			'Hits: ' + data['stats']['topViewedExampleHits']
		]);

        // Top viewed Dugga
		tableData.push([
			'Top viewed Dugga: ' + data['stats']['topViewedDugga'],
			'Hits: ' + data['stats']['topViewedDuggaHits']
		]);

		// Newest file
        tableData.push([
            'Newest file: ' + data['stats']['newestFile'],
            'Created: ' + new Date(data['stats']['newestFileTimestamp'].replace(' ', 'T') + "Z").toLocaleString()
    	]);

		// Most recently edited file
		var fileToTable = 'Most recently edited file: ' + data['stats']['recentlyEditedFile'];
		if(data['stats']['recentlyEditedFileTimestamp'] != null){
			tableData.push([
				fileToTable,
				'Edited: ' + new Date(data['stats']['recentlyEditedFileTimestamp'].replace(' ', 'T') + "Z").toLocaleString()
			]);
		} else{
			tableData.push([
				fileToTable,
				'Edited: ' + data['stats']['recentlyEditedFileTimestamp']
			]);
		}

		$('#analytic-info').append(renderTable(tableData));

		// Disk usage
		var chartData = [];
		chartData.push({
			label: 'Memory in use ('+data.disk.inUse+')',
			value: data.disk.inUsePercent
		});

		chartData.push({
			label: 'Memory Available ('+data.disk.memFree+')',
			value: data.disk.memFreePercent
		});

		chartData.push({
			label: 'Total Memory ('+data.disk.memTotal+')',
			value: 0
		});

		drawPieChart(chartData, 'Disk Usage on the server', true);

		// Ram Usage
		if(data.ram != undefined){
			var chartData = [];
			chartData.push({
				label: 'Total RAM ('+data.ram.total+')',
				value: data.ram.totalPercent
			});

			chartData.push({
				label: 'Free RAM ('+data.ram.free+')',
				value: data.ram.freePercent
			});
			drawPieChart(chartData, 'RAM Usage on the Server', true);
		}

		// CPU Usage
		if(data.cpu != undefined){
			var chartData = [];
			chartData.push({
				label: 'CPU Load (' + (+data.cpu.totalPercent).toFixed(1) + '%)',
				value: data.cpu.totalPercent
			});

			chartData.push({
				label: 'CPU Free (' + (+data.cpu.freePercent).toFixed(1) +'%)',
				value: data.cpu.freePercent
			});
			drawPieChart(chartData, 'CPU Usage on the Server', true);
		}
	});
}

function loadCurrentlyOnline() {
	loadAnalytics("onlineUsers", function(data) {
		localStorage.setItem('analyticsPage', 'onlineUsers');
		$('#pageTitle').text("Currently Online");
		$('#analytic-info').append("<p style='margin-top: 15px; margin-bottom: -20px;'>Active users the last 15 minutes</p>");
		var tableData = [["User", "Page", "Last seen"]];
		var activeUsers = data;
		console.log(activeUsers);
		for (var stat in activeUsers) {
			if (activeUsers.hasOwnProperty(stat)) {
				var date = new Date(activeUsers[stat].time.replace(' ', 'T') + "Z");
				tableData.push([
					activeUsers[stat].username,
					'<a href="' + activeUsers[stat].refer + '" target="_blank">' + activeUsers[stat].refer + '</a>',
					timeSince(date)
				]);
			}
		}

		$('#analytic-info').append(renderTable(tableData));

	});
}

function loadPasswordGuessing() {
	loadAnalytics("passwordGuessing", function(data) {
		localStorage.setItem('analyticsPage', 'passwordGuessing');
		$('#pageTitle').text("Password Guessing");
		$('#analytic-info').append("<p class='analyticsDesc'>Potential brute force attacks.</p>");

		var tableData = [["Username", "Remote address", "User agent", "Guest ID", "Tries"]];
		for (var i = 0; i < data.length; i++) {
			tableData.push([
				data[i].userName,
				data[i].remoteAddress,
				data[i].userAgent,
				data[i].guestID,
				data[i].tries
			]);
		}
		$('#analytic-info').append(renderTable(tableData));
	});
}

function loadOsPercentage() {
	loadAnalytics("osPercentage", function(data) {
		localStorage.setItem('analyticsPage', 'osPercentage');
		$('#pageTitle').text("OS percentage");
		$('#analytic-info').append("<p class='analyticsDesc'>OS percentage for main page views.</p>");

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
		localStorage.setItem('analyticsPage', 'browserPercentage');
		$('#pageTitle').text("Browser percentage");
		$('#analytic-info').append("<p class='analyticsDesc'>Browser percentage for main page views.</p>");

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
	localStorage.setItem('analyticsPage', 'serviceUsage');
	resetAnalyticsChart();
	$('#pageTitle').text("Service usage");
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
						if(localStorage.getItem('analyticsLastService') == service) {
							serviceSelect.append('<option value="' + service + '" selected>' + service + '</option>')
						} else {
							serviceSelect.append('<option value="' + service + '">' + service + '</option>')
						}
					}
				}
				serviceSelect.change(function() {
					$( "#canvas-area" ).empty();
					drawLineChart(services[$(this).val()]);
					try {
						localStorage.setItem('analyticsLastService', $(this).val());
					} catch(err) { }
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

function loadCourseDiskUsage() {
	loadAnalytics("courseDiskUsage", function(data) {
		localStorage.setItem('analyticsPage', 'courseDiskUsage');
		$('#pageTitle').text("Course Disk Usage");
		$('#analytic-info').append("<p class='analyticsDesc'>The disk usage per course</p>");

		var tableData = [
			["Course Code", "Course", "Disk Usage"]
		];
		for (var i = 0; i < data.length; i++) {
			tableData.push([
				data[i].coursecode,
				data[i].coursename,
				data[i].sizeReadable
			]);
		}
		$('#analytic-info').append(renderTable(tableData));

		var chartData = [];
		for (var i = 0; i < data.length; i++) {
			chartData.push({
				label: data[i].coursecode,
				value: data[i].size
			});
		}
		drawBarChart(chartData, "bytes");
	});
}

function loadServiceAvgDuration() {
	loadAnalytics("serviceAvgDuration", function(data) {
		localStorage.setItem('analyticsPage', 'serviceAvgDuration');
		$('#pageTitle').text("Service speed");
		$('#analytic-info').append("<p class='analyticsDesc'>The average duration of service call completion in milliseconds.</p>");

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
		localStorage.setItem('analyticsPage', 'serviceCrashes');
		$('#pageTitle').text("Service crashes");
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

		function formatDate(date) {
			var year = date.getFullYear();
			var month = date.getMonth();
			var day = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var seconds = date.getSeconds();
			var millis = date.getMilliseconds();
			return year + "-" + pad(month, 2) + "-" + pad(day, 2) + " " + pad(hour, 2) + ":" + pad(minute, 2) + ":" + pad(seconds, 2) + "." + pad(millis, 3);
		}

		$.each(crashes, function(i, crash) {
			var str = "<div>";
			str += "Service: " + crash.service;
			str += "<br>User agent: " + crash.userAgent;
			str += "<br>OS: " + crash.operatingSystem;
			str += "<br>Browser: " + crash.browser;
			str += "<br>Server start: " + (crash.steps[6] === undefined ? 'missing' : formatDate(crash.steps[6]));
			str += "<br>Server end: " + (crash.steps[7] === undefined ? 'missing' : formatDate(crash.steps[7]));
			str += "<br><hr></div>";
			$('#analytic-info').append(str);
		});
	});

}


function loadFileInformation() {
	localStorage.setItem('analyticsPage', 'fileInformation');
	resetAnalyticsChart();
	$('#pageTitle').text("File Information");
    $('#analytic-info').empty();
	$('#analytic-info').append("<p>File information for created and edited files.</p>");


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
                var fileSizes = [];
                $.each(data, function(i, row) {
                    var description = row.description.split(" ");
                    var version = description[0];
                    var file =  row.filename;
					fileSizes.push(row.filesize);
                    if(row.eventType == 15){
                        var action = "Created"
                    }
                    else{
                        var action = "Edited"
                    }

                    if (!files.hasOwnProperty(file)) {
                        files[file] = [["Username", "Action", "Version", "File", "Timestamp"]];
					}

					const splits = row.timestamp.split(' ', 2)
					timestamp = new Date(row.timestamp.replace(' ', 'T') + "Z").toLocaleString();
                    if(splits[0] >=  inputDateFrom.val() && splits[0] <= inputDateTo.val()){
                        files[file].push([
                        row.username,
                        action,
                        version,
                        file,
                        timestamp
                    ]);
                    }
                });

                $('#analytic-info > select.file-select').remove();
				var fileSelect = $('<select class="file-select"></select>');
				var i = 0;
                for (var file in files) {
                    if (files.hasOwnProperty(file)) {
						if(localStorage.getItem('analyticsLastFile') == file) {
							fileSelect.append('<option value="' + file + '" selected>' + file + ' (' + humanFileSize(fileSizes[i]) + ')</option>');
						} else {
							fileSelect.append('<option value="' + file + '">' + file + ' (' + humanFileSize(fileSizes[i]) + ')</option>')
						}
					}
					i++;
                }
                fileSelect.change(function() {
					deleteTable();
					try {
						localStorage.setItem('analyticsLastFile', files[$(this).val()][1][3]);
					} catch(err) { }
                    $('#analytic-info').append(renderTable(files[$(this).val()]));
                });
                $('#analytic-info').append(fileSelect);
                fileSelect.change();
            }
        });
    }

    inputDateFrom.change(updateFileInformation);
    inputDateTo.change(updateFileInformation);

    updateFileInformation();
}

function loadPageInformation() {
	localStorage.setItem('analyticsPage', 'pageInformation');
	resetAnalyticsChart();
	$('#pageTitle').text("Page Information");
    $('#analytic-info').empty();
	$('#analytic-info').append("<p>Page information.</p>");

	var firstLoad = true;

	var selectPage = $("<select></select>")
		.append('<option value="accessed">accessed</option>')
		.append('<option value="analytic">analytic</option>')
		.append('<option value="codeviewer">codeviewer</option>')
		.append('<option value="courseed">courseed</option>')
		.append('<option value="contribution">contribution</option>')
		.append('<option value="duggaed">duggaed</option>')
		.append('<option value="diagram">diagram</option>')
		.append('<option value="fileed">fileed</option>')
		.append('<option value="profile">profile</option>')
		.append('<option value="resulted">resulted</option>')
        .append('<option value="showDugga" selected>showDugga</option>')
        .append('<option value="accessed">profile</option>')
		.append('<option value="sectioned">sectioned</option>')
        .appendTo($('#analytic-info'));

    function updatePageHitInformation(pages, page){
        loadAnalytics("pageInformation", function(data) {

			var tableData = [["Page", "Hits"]];
			for(var i = 0; i < pages.length; i++){

				if(data['hits'][pages[i]] !== null){
					tableData.push([
						pages[i],
						data['hits'][pages[i]].pageLoads
					]);
				}else{
					tableData.push([
						pages[i],
						"0"
					]);
				}
			}

            updatePieChartInformation(page, tableData, data);
        });
    }

    function updatePieChartInformation(page, tableData, data){
		var courseID = [];
		var coursePercentage = [];
		var courseName = [];
		var numberOfCourses = 0;
		var loopCounter = 0;
		var tablePercentage = [["Courseid", "Percentage", "Coursename"]];

        for (var i = 0; i < data['percentage'][page].length; i++) {
			numberOfCourses = parseInt(data['percentage'][page].length);

			var cid = data['percentage'][page][i].refer.match('.+?cid=([0-9]+)');
			if(cid != null) {
				data['percentage'][page][i].courseid = cid[1];
			}

			courseID.push([
                data['percentage'][page][i].courseid
			]);
			coursePercentage.push([
                data['percentage'][page][i].percentage
			]);

			$.ajax({
				url: "analyticService.php",
				type: "POST",
				dataType: "json",
				data: {
					query: "resolveCourseID",
					cid: parseInt(courseID[i])
				},success: function(data){
					loopCounter++;
					for (var i = 0; i < data.length; i++) {
						courseName.push([
							data[i].coursename
						]);
					}
					tablePercentage = [["Courseid", "Percentage", "Coursename"]];
					for (var i = 0; i < courseName.length; i++){
						tablePercentage.push([
							courseID[i],
							Number(coursePercentage[i]).toFixed(2),
							courseName[i]
						]);
					}

					if(loopCounter == numberOfCourses){
						if(courseName.length !== 0){
							$('#analytic-info').append(renderTable(tablePercentage));
						}
					}
				}, error: function(){
					console.log(" AJAX error");
				}
			});
        }

        var chartData = [];
        for (var i = 0; i < data['percentage'][page].length; i++) {

            chartData.push({
                label: "courseid:" + " " + data['percentage'][page][i].courseid,
                value: data['percentage'][page][i].percentage
            });
		}

        $('#analytic-info').append("<p>Page information.</p>");
        $('#analytic-info').append(selectPage);
		$('#analytic-info').append(renderTable(tableData));
		if(chartData !== 0){
		$('#analytic-info').append(drawPieChart(chartData, "Hit spread for " + page + " page loads:"));
		}
        updateState();
    }

    function updateState(){
		// Add additonal pages here
		var pages = ["dugga", "codeviewer", "sectioned", "courseed", "fileed", "resulted", "analytic", "contribution", "duggaed", "accessed", "profile", "diagram"];

		if(firstLoad === true){
			updatePageHitInformation(pages, pages[0]);
			firstLoad = false;
		}
        selectPage.change(function(){
            switch(selectPage.val()){
                case "showDugga":
                    updatePageHitInformation(pages, pages[0]);
                    break;
                case "codeviewer":
                    updatePageHitInformation(pages, pages[1]);
					break;
				case "sectioned":
					updatePageHitInformation(pages, pages[2]);
					break;
				case "courseed":
					updatePageHitInformation(pages, pages[3]);
					break;
				case "fileed":
					updatePageHitInformation(pages, pages[4]);
					break;
				case "resulted":
					updatePageHitInformation(pages, pages[5]);
					break;
				case "analytic":
					updatePageHitInformation(pages, pages[6]);
					break;
				case "contribution":
					updatePageHitInformation(pages, pages[7]);
					break;
				case "duggaed":
					updatePageHitInformation(pages, pages[8]);
					break;
				case "accessed":
					updatePageHitInformation(pages, pages[9]);
					break;
				case "profile":
					updatePageHitInformation(pages, pages[10]);
					break;
				case "diagram":
					updatePageHitInformation(pages, pages[11]);
					break;

            }
        });
    }

    updateState();
}

var hasCounter;
var rowCount;
var nameCount;
var pageCount;
var counterFirstLoad = true;

function loadUserInformation(){
	localStorage.setItem('analyticsPage', 'userInformation');
	resetAnalyticsChart();
	$('#pageTitle').text("User Information");
    $('#analytic-info').empty();
	$('#analytic-info').append("<p>User information.</p>");

	var firstLoad = true;

	var selectPage = $("<select id='userInformationPage'></select>")
		.append('<option value="calendar">Calendar Subscriptions</option>')
    .append('<option value="sectioned">sectioned</option>')
    .append('<option value="courseed">courseed</option>')
    .append('<option value="showDugga">showDugga</option>')
    .append('<option value="fileed">fileed</option>')
    .append('<option value="resulted">resulted</option>')
    .append('<option value="codeviewer">codeviewer</option>')
    .append('<option value="profile">profile</option>')
    .append('<option value="duggaed">duggaed</option>')
    .append('<option value="accessed">accessed</option>')
    .append('<option value="events">events</option>')
    .append('<option value="fileEvents">fileEvents</option>')
    .append('<option value="course">course</option>')
    .append('<option value="loginFail">loginFail</option>')
    .appendTo($('#analytic-info'));

	$("#userInformationPage").val(localStorage.getItem('userInformationPage'));
	console.log(localStorage.getItem('userInformationPage'));
	switch(localStorage.getItem('userInformationPage')){
		case "courseed":
			updateCourseedInformation();
			pageCount = "courseed.php";
			break;
		case "showDugga":
			updateDuggaInformation();
			pageCount = "showdugga.php";
			break;
		case "codeviewer":
			updateCodeviewerInformation();
			pageCount = "codeviewer.php";
			break;
		case "events":
			updateUserLogInformation();
			break;
		case "fileEvents":
			updatefileEvents();
			break;
		case "course":
			updateCourseInformation();
			break;
		case "loginFail":
			updateloginFail();
			break;
		case "calendar":
			updateCalendarInformation();
			pageCount = "calendar.php";
			break;
		case "sectioned":
		default:
			updateSectionedInformation();
			pageCount = "sectioned.php";
			break;
	}

  function updateCalendarInformation(){
    hasCounter = true;
    loadAnalytics("calendarInformation", function(data) {
      var users = {};
      $.each(data, function(i, row) {
				var user = row.username;
        
        if (!users.hasOwnProperty(user)) {
          users[user] = [["User ID", "Username",  "Course ID", "Course Version", "Subscribed at"]];
				}
				if(row.courseid != "") {
					users[user].push([
						row.uid,
						row.username,
						row.courseid,
						row.coursevers,
						new Date(row.timestamp.replace(' ', 'T') + "Z").toLocaleString()
					]);
				}
            });
            updateState(users);
        });
	}
 
    function updateSectionedInformation(){
		hasCounter = true;
        loadAnalytics("sectionedInformation", function(data) {
            var users = {};
            $.each(data, function(i, row) {
				var user = row.username;

                if (!users.hasOwnProperty(user)) {
                    users[user] = [["Userid", "Username", "Page", "Courseid", "Course Version", "Timestamp"]];
				}

				if(row.courseid != "") {
					users[user].push([
						row.uid,
						row.username,
						"sectioned.php",
						row.courseid,
						row.coursevers,
						new Date(row.timestamp.replace(' ', 'T') + "Z").toLocaleString()
					]);
				}
            });
            updateState(users);
        });
	}

	function updateCourseedInformation(){
		hasCounter = true;
    loadAnalytics("courseedInformation", function(data) {
			var users = {};
      $.each(data, function(i, row) {
			  var user = row.username;
        
        if (!users.hasOwnProperty(user)) {
          users[user] = [["Userid", "Username", "Page", "Timestamp"]];
				}
				if(row.uid != undefined) {
					users[user].push([
						row.uid,
						row.username,
						"courseed.php",
						new Date(row.timestamp.replace(' ', 'T') + "Z").toLocaleString()
					]);
				}
            });
            updateState(users);
        });
    }

    function updateCodeviewerInformation(){
		hasCounter = true;
		var users = {};
        loadAnalytics("codeviewerInformation", function(data) {
            $.each(data, function(i, row) {
                var user = row.username;

                if (!users.hasOwnProperty(user)) {
                    users[user] = [["Userid", "Username", "Page", "Courseid", "Exampleid", "Timestamp"]];
				}
				if(row.cid != "") {
					users[user].push([
						row.uid,
						row.username,
						"codeviewer.php",
						row.cid,
						row.exampleid,
						new Date(row.timestamp.replace(' ', 'T') + "Z").toLocaleString()
					]);
				}
            });
            updateState(users);
        });
	}


    function updateDuggaInformation(){
		hasCounter = true;
		var users = {};
        loadAnalytics("duggaInformation", function(data) {
            $.each(data, function(i, row) {
                var user = row.username;

                if (!users.hasOwnProperty(user)) {
                    users[user] = [["Userid", "Username", "Page", "Courseid", "Duggaid", "Timestamp"]];
				}
				if(row.cid != "") {
					users[user].push([
						row.uid,
						row.username,
						"showDugga.php",
						row.cid,
						row.quizid,
						new Date(row.timestamp.replace(' ', 'T') + "Z").toLocaleString()
					]);
				}
            });
            updateState(users);
        });
    }
//------------------------------------------------------------------------------------------------
// Retrieves the data and makes the table for events
//------------------------------------------------------------------------------------------------
    function updateUserLogInformation(users){
		var event;
		var users = {};
		var user;
		//Array containing all different eventTypes
		eventNames = ['arrayStartOn0','DuggaRead','DuggaWrite','LoginSuccess','LoginFail','ServiceClientStart','ServiceServerStart',
		'ServiceServerEnd','ServiceClientEnd','Logout','pageLoad','PageNotFound','RequestNewPW','CheckSecQuestion','SectionItems',
		'AddFile','EditCourseVers','AddCourseVers','AddCourse','EditCourse','ResetPW','DuggaFileupload','DownloadAllCourseVers',
		'EditFile','MarkedDugga'];

        loadAnalytics("userLogInformation", function(data) {
            $.each(data, function(i, row) {
                user = row.username;
                if (!users.hasOwnProperty(user)) {
                    users[user] = [["Userid", "Username", "EventType", "Description", "Timestamp", "EventDescription"]];
				}
				eventNumber = row.eventType;
				event = eventNames[eventNumber];
				if(row.eventType != "") {
					if(event != 'AddFile' && event != 'EditFile' && event != 'LoginFail'){
						users[user].push([
							row.uid,
							row.username,
							row.eventType,
							row.description,
							new Date(row.timestamp.replace(' ', 'T') + "Z").toLocaleString(),
							event
						]);
						updateState(users);
					}
				}
			});
			updateState(users);
		});
	}
//------------------------------------------------------------------------------------------------
// Retrieves the data and makes the table for fileEvents
//------------------------------------------------------------------------------------------------
	function updatefileEvents(users){
		var event;
		var users = {};
		var user;
		var empty = true;
		//Array containing all different eventTypes
		eventNames = ['arrayStartOn0','DuggaRead','DuggaWrite','LoginSuccess','LoginFail','ServiceClientStart','ServiceServerStart',
		'ServiceServerEnd','ServiceClientEnd','Logout','pageLoad','PageNotFound','RequestNewPW','CheckSecQuestion','SectionItems',
		'AddFile','EditCourseVers','AddCourseVers','AddCourse','EditCourse','ResetPW','DuggaFileupload','DownloadAllCourseVers',
		'EditFile','MarkedDugga'];

		loadAnalytics("userLogInformation", function(data) {
			$.each(data, function(i, row) {
				user = row.username;
				if (!users.hasOwnProperty(user)) {
					users[user] = [["Userid", "Username", "EventType", "Description", "Timestamp", "EventDescription"]];
				}
				eventNumber = row.eventType;
				event = eventNames[eventNumber];

				if(row.eventType != "") {
					if(event == 'AddFile' || event == 'EditFile'){
						users[user].push([
							row.uid,
							row.username,
							row.eventType,
							row.description,
							new Date(row.timestamp.replace(' ', 'T') + "Z").toLocaleString(),
							event
						]);
						updateState(users);
						empty = false;
					}
				}
			});
			if(empty == true){
				updateState(users);
			}
		});
	}

	function updateCourseInformation(){
		var users = {};

        loadAnalytics("courseInformation", function(data) {
            console.log(data)
            $.each(data.users, function(i, row) {
				var userClass = row.class;
				var user = row.username;

                if (!users.hasOwnProperty(user)) {
                    users[user] = [["courseid", "coursename"]];
				}

				$.each(data.programcourses, function(i, row) {
					var cid = row.cid;

					if(userClass === row.class){
						$.each(data.courses, function(i, row) {
							if(cid === row.cid){
								users[user].push([
									cid,
									row.coursename
								]);
							}
						});
					}
				});
			});
			updateState(users);

        });
  }

//------------------------------------------------------------------------------------------------
// Retrieves the data and makes the table for loginFail
//------------------------------------------------------------------------------------------------
	function updateloginFail(users){
		var event;
		var users = {};
		var user;
		//Array containing all different eventTypes
		eventNames = ['arrayStartOn0','DuggaRead','DuggaWrite','LoginSuccess','LoginFail','ServiceClientStart','ServiceServerStart',
		'ServiceServerEnd','ServiceClientEnd','Logout','pageLoad','PageNotFound','RequestNewPW','CheckSecQuestion','SectionItems',
		'AddFile','EditCourseVers','AddCourseVers','AddCourse','EditCourse','ResetPW','DuggaFileupload','DownloadAllCourseVers',
		'EditFile','MarkedDugga'];

        loadAnalytics("userLogInformation", function(data) {
            $.each(data, function(i, row) {
                user = row.username;
                if (!users.hasOwnProperty(user)) {
                    users[user] = [["Userid", "Username", "EventType", "Description", "Timestamp", "EventDescription"]];
				}
				eventNumber = row.eventType;
				event = eventNames[eventNumber];
				if(row.eventType != "") {
					if(event == 'LoginFail'){
						users[user].push([
							row.uid,
							row.username,
							row.eventType,
							row.description,
							new Date(row.timestamp.replace(' ', 'T') + "Z").toLocaleString(),
							event
						]);
						updateState(users);
					}
				}
			});
			updateState(users);
		});
	}

//------------------------------------------------------------------------------------------------
// Retrieves the data and makes the table for fileed
//------------------------------------------------------------------------------------------------
 	function updateFileedInformation(){
		hasCounter = true;
        loadAnalytics("fileedInformation", function(data) {
			var users = {};
            $.each(data, function(i, row) {
				var user = row.username;
				var pageParts;
				var pageLoad;

				//Retrives the page
				if(row.refer.includes("/DuggaSys/")){
					pageParts = row.refer.split("/DuggaSys/");
					pageLoad = pageParts[1];

					if(pageLoad.includes("?")){
						pageParts = pageParts[1].split("?");
						pageLoad = pageParts[0];
					}
				}

                if (!users.hasOwnProperty(user)) {
                    users[user] = [["Userid", "Username", "Event", "Timestamp"]];
				}
				if(pageLoad != undefined) {
					users[user].push([
						row.uid,
						row.username,
						pageLoad,
						row.timestamp
					]);
				}
            });
            updateState(users);
        });
    }

//------------------------------------------------------------------------------------------------
// Retrieves the data and makes the table for resulted
//------------------------------------------------------------------------------------------------
 	function updateResultedInformation(){
		hasCounter = true;
        loadAnalytics("resultedInformation", function(data) {
			var users = {};
            $.each(data, function(i, row) {
				var user = row.username;
				var pageParts;
				var pageLoad;

				//Retrives the page
				if(row.refer.includes("/DuggaSys/")){
					pageParts = row.refer.split("/DuggaSys/");
					pageLoad = pageParts[1];

					if(pageLoad.includes("?")){
						pageParts = pageParts[1].split("?");
						pageLoad = pageParts[0];
					}
				}

                if (!users.hasOwnProperty(user)) {
                    users[user] = [["Userid", "Username", "Event", "Timestamp"]];
				}
				if(pageLoad != undefined) {
					users[user].push([
						row.uid,
						row.username,
						pageLoad,
						row.timestamp
					]);
				}
            });
            updateState(users);
        });
    }
//------------------------------------------------------------------------------------------------
// Retrieves the data and makes the table for profile
//------------------------------------------------------------------------------------------------
 	function updateProfileInformation(){
		hasCounter = true;
        loadAnalytics("profileInformation", function(data) {
			var users = {};
            $.each(data, function(i, row) {
				var user = row.username;
				var pageParts;
				var pageLoad;

				//Retrives the page 
				if(row.refer.includes("/DuggaSys/")){
					pageParts = row.refer.split("/DuggaSys/");
					pageLoad = pageParts[1];

					if(pageLoad.includes("?")){
						pageParts = pageParts[1].split("?");
						pageLoad = pageParts[0];
					}
				}

                if (!users.hasOwnProperty(user)) {
                    users[user] = [["Userid", "Username", "Timestamp"]];
				}
				if(pageLoad != undefined) {
					users[user].push([
						row.uid,
						row.username,
						row.timestamp
					]);
				}
            });
            updateState(users);
        });
    }
    //------------------------------------------------------------------------------------------------
// Retrieves the data and makes the table for duggaed
//------------------------------------------------------------------------------------------------
  	function updateDuggaedInformation(){
		hasCounter = true;
        loadAnalytics("duggaedInformation", function(data) {
			var users = {};
            $.each(data, function(i, row) {
				var user = row.username;
				var pageParts;
				var pageLoad;

				//Retrives the page 
				if(row.refer.includes("/DuggaSys/")){
					pageParts = row.refer.split("/DuggaSys/");
					pageLoad = pageParts[1];

					if(pageLoad.includes("?")){
						pageParts = pageParts[1].split("?");
						pageLoad = pageParts[0];
					}
				}

                if (!users.hasOwnProperty(user)) {
                    users[user] = [["Userid", "Username", "Event", "Timestamp"]];
				}
				if(pageLoad != undefined) {
					users[user].push([
						row.uid,
						row.username,
						pageLoad,
						row.timestamp
					]);
				}
            });
            updateState(users);
        });
    }
    //------------------------------------------------------------------------------------------------
// Retrieves the data and makes the table for accessed
//------------------------------------------------------------------------------------------------
  	function updateAccessedInformation(){
		hasCounter = true;
        loadAnalytics("accessedInformation", function(data) {
			var users = {};
            $.each(data, function(i, row) {
				var user = row.username;
				var pageParts;
				var pageLoad;

				//Retrives the page 
				if(row.refer.includes("/DuggaSys/")){
					pageParts = row.refer.split("/DuggaSys/");
					pageLoad = pageParts[1];

					if(pageLoad.includes("?")){
						pageParts = pageParts[1].split("?");
						pageLoad = pageParts[0];
					}
				}

                if (!users.hasOwnProperty(user)) {
                    users[user] = [["Userid", "Username", "Event", "Timestamp"]];
				}
				if(pageLoad != undefined) {
					users[user].push([
						row.uid,
						row.username,
						pageLoad,
						row.timestamp
					]);
				}
            });
            updateState(users);
        });
    }


    function updateState(users){
        $('#analytic-info > select.file-select').remove();
        var userSelect = $('<select class="file-select"></select>');
        for (var user in users) {
            if (users.hasOwnProperty(user)) {
				if(localStorage.getItem('analyticsLastUser') == user) {
					userSelect.append('<option value="' + user + '" selected>' + user + '</option>');
					nameCount = user;
				} else {
					userSelect.append('<option value="' + user + '">' + user + '</option>');
				}
            }
        }

        userSelect.change(function() {
			deleteTable();
			$('#analytic-info').append(selectPage);

			var events = [];
			if(users[$(this).val()][0][5] == "EventDescription") {
				for(var i = 1; i < users[$(this).val()].length; i++) {
					if(events[users[$(this).val()][i][5]] == null) {
						events[users[$(this).val()][i][5]] = 1; // Set the starting value
					} else {
						events[users[$(this).val()][i][5]] = events[users[$(this).val()][i][5]] + 1; // Increments the values
					}
				}
			}

			if(Object.keys(events).length > 0) {
				userNumEvents = [["Event", "Times Preformed"]];
				for (var key in events) {
					if(Number.isInteger(events[key]))
					userNumEvents.push([
						key,
						events[key]
					]);
					deleteTable();
					$('#analytic-info').append(renderTable(userNumEvents));
				}
			}

			$('#analytic-info').append(renderTable(users[$(this).val()]));

			try {
				localStorage.setItem('analyticsLastUser', $(this).val());
			} catch(err) { }

		});
        $('#analytic-info').append(userSelect);
		userSelect.change();
		pageSelect();
	}

	function pageSelect(){
        selectPage.change(function(){
			localStorage.setItem('userInformationPage', selectPage.val());
            switch(selectPage.val()){
                case "resulted":
					updateResultedInformation();
					pageCount = "resulted.php";
					break;
                case "sectioned":
					updateSectionedInformation();
					pageCount = "sectioned.php";
                    break;
                case "courseed":
					updateCourseedInformation();
					pageCount = "courseed.php";
					break;
                case "fileed":
					updateFileedInformation();
					pageCount = "fileed.php";
					break;
                case "profile":
					updateProfileInformation();
					pageCount = "profile.php";
					break;
                case "duggaed":
					updateDuggaedInformation();
					pageCount = "duggaed.php";
					break;
                case "accessed":
					updateAccessedInformation();
					pageCount = "accessed.php";
					break;
				case "showDugga":
					updateDuggaInformation();
					pageCount = "showdugga.php";
					break;
				case "codeviewer":
					updateCodeviewerInformation();
					pageCount = "codeviewer.php";
					break;
				case "events":
					updateUserLogInformation();
					break;
				case "fileEvents":
					updatefileEvents();
					break;
				case "course":
					updateCourseInformation();
					break;
				case "loginFail":
					updateloginFail();
					break;
				case "calendar":
					updateCalendarInformation();
					pageCount = "calendar.php";
					break;
            }
        });
	}

    pageSelect();
}

//------------------------------------------------------------------------------------------------
// Analytic loaders END
//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Fits a canvas to its container
//------------------------------------------------------------------------------------------------
function fitCanvasToContainer(canvas, width = 100, height = 100) {
	canvas.style.width = width + "%";
	canvas.style.height = height + "%";
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
function drawBarChart(data, format = null) {
	if (!$.isArray(data)) return;

	analytics.chartType = "bar";
	analytics.chartData = data;

	var elementID = 'canvas' + $('canvas').length;
	$('<canvas>').attr({
		id: elementID
	}).appendTo('#canvas-area');

	var canvas = document.getElementById(elementID);
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

		if(format == "bytes") {
			ctx.fillText(humanFileSize(data[i].value), x + barWidth / 2, -data[i].value * barHeightMultiplier);
		} else {
			ctx.fillText(Number(data[i].value).toFixed(0), x + barWidth / 2, -data[i].value * barHeightMultiplier);
		}
		ctx.fillStyle = "black";
		if(isDarkMode()){
			ctx.fillStyle = "white";
		}
		ctx.fillText(data[i].label, x + barWidth / 2, -textAreaHeight / 2);
	}
}

function humanFileSize(size) {
	if (size < 1024)
		return size + ' B'
    let i = Math.floor(Math.log(size) / Math.log(1024))
    let num = (size / Math.pow(1024, i))
    let round = Math.round(num)
	num = round < 10 ? num.toFixed(2) : round < 100 ? num.toFixed(1) : round

    return `${num} ${'KMGTPEZY'[i-1]}B`
}

//------------------------------------------------------------------------------------------------
// Generates a random pastel color in hex format and returns it
//------------------------------------------------------------------------------------------------
function getRandomColor(i) {
	var colors = ["#775886", "#cccccc", '#927b9e', '#93A561', 'ffd369', '#50a750', '#75050'];

	if(i > colors.length-1) {
		var r = Math.floor((Math.floor(Math.random() * 255) + 255) / 2);
		var g = Math.floor((Math.floor(Math.random() * 255) + 255) / 2);
		var b = Math.floor((Math.floor(Math.random() * 255) + 255) / 2);
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	} else {
		return colors[i];
	}
}

//------------------------------------------------------------------------------------------------
// Draws a pie chart with the data given
//------------------------------------------------------------------------------------------------

function drawPieChart(data, title = null, multirow = false) {
	if (!$.isArray(data)) return;

	analytics.chartType = "pie";
	analytics.chartData = data;

	// Dynamically generate the canvas elem
	var elementID = 'canvas' + $('canvas').length;
	$('<canvas>').attr({
		id: elementID
	}).appendTo('#canvas-area');

	var canvas = document.getElementById(elementID);
	var ctx = canvas.getContext("2d");

	if(multirow) {
		fitCanvasToContainer(canvas, 48.5, 75);
	} else {
		fitCanvasToContainer(canvas);
	}

	clearCanvas(canvas);

	var total = 0;
	for (var i = 0; i < data.length; i++) {
		total += (isNaN(data[i].value)) ? 0 : Number(data[i].value);
	}

	var fontSize = 14;
	var textAreaHeight = fontSize * 2.2;
	var radius = canvas.height / 2;
	var last = 0;

	// Add the title to the chart
	if(title != null) {
		ctx.font = "20px Arial";
		if(isDarkMode()){
			ctx.fillStyle = "white";
		}
		ctx.fillText(title, radius * 2 + 30, 25);
	}

	var labelCount = 0;
	var textSpacing = 50;
	var rectSpacing = 30;

	for (var i = 0; i < data.length; i++) {
		ctx.fillStyle = getRandomColor(i);
		ctx.beginPath();
		ctx.moveTo(radius, radius);
		ctx.arc(radius, radius, radius, last, last + (Math.PI*2*(data[i].value/total)), false);
		ctx.lineTo(radius, radius);
		ctx.fill();
		last += (Math.PI*2*(data[i].value/total));

		if(labelCount < 4){
			ctx.fillRect(radius * 2 + rectSpacing , labelCount * textAreaHeight + 40, 12, 12);
		}
		ctx.fillStyle = "black";
		if(isDarkMode()){
			ctx.fillStyle = "white";
		}
		ctx.font = fontSize + "px Arial";
		if(labelCount < 4){
			ctx.fillText(data[i].label, radius * 2 + textSpacing , labelCount * textAreaHeight + textAreaHeight + 20);
			labelCount++;
		}
		else{
			var w = ctx.measureText(data[i - 4].label);
			textSpacing += w.width + 30;
			rectSpacing += w.width + 30;
			labelCount = 0;
			i--;
			last -= (Math.PI*2*(data[i].value/total));
		}
	}
}

function renderTable(data) {
	rowCount = 0;
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
			str += "</tr>";
			rowCount++;
		});
	}
	str += "</tbody></table>";
	if(hasCounter == true && counterFirstLoad == false){
		updateCounter(rowCount, nameCount, pageCount);
	}
	counterFirstLoad = false;
	return str;
}

function updateCounter(count, user, page)
{
	if(page == undefined)
		return;

	$('#analytic-info').append("<p>" + page + " has been loaded " + count + " times by " + user + "! </p>");
	hasCounter = false;
}

function drawLineChart(data) {
	if (!$.isArray(data)) return;

	analytics.chartType = "line";
	analytics.chartData = data;

	var elementID = 'canvas' + $('canvas').length;
	$('<canvas>').attr({
		id: elementID
	}).appendTo('#canvas-area');

	var canvas = document.getElementById(elementID);
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
	if(isDarkMode()) {
		ctx.strokeStyle = "#888"
		ctx.fillStyle = "white"
	}
	ctx.font = "Arial 8pt";
	ctx.textAlign = "center";


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

// Converts timestamps to how long ago
function timeSince(date) {
	let minute = 60;
    let hour   = minute * 60;
    let day    = hour   * 24;
    let month  = day    * 30;
    let year   = day    * 365;

    let suffix = ' ago';

    let elapsed = Math.floor((Date.now() - date) / 1000);

    if (elapsed < minute) {
        return 'just now';
    }

    // get an array in the form of [number, string]
    let a = elapsed < hour  && [Math.floor(elapsed / minute), 'minute'] ||
            elapsed < day   && [Math.floor(elapsed / hour), 'hour']     ||
            elapsed < month && [Math.floor(elapsed / day), 'day']       ||
            elapsed < year  && [Math.floor(elapsed / month), 'month']   ||
            [Math.floor(elapsed / year), 'year'];

    // pluralise and append suffix
    return a[0] + ' ' + a[1] + (a[0] === 1 ? '' : 's') + suffix;
  }

	function isDarkMode() {
	  return (
	    window.matchMedia &&
	    window.matchMedia("(prefers-color-scheme: dark)").matches
	  );
	}
