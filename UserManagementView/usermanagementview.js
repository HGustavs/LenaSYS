
// AJAX-call to dugga.js 
AJAXService("GET", {}, "UMVSTUDENT");

function strcmp(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}

function natcmp(a, b) {
    var x = [], y = [];

    a.replace(/(\d+)|(\D+)/g, function($0, $1, $2) { x.push([$1 || 0, $2]) })
    b.replace(/(\d+)|(\D+)/g, function($0, $1, $2) { y.push([$1 || 0, $2]) })

    while(x.length && y.length) {
        var xx = x.shift();
        var yy = y.shift();
        var nn = (xx[0] - yy[0]) || strcmp(xx[1], yy[1]);
        if(nn) return nn;
    }

    if(x.length) return -1;
    if(y.length) return +1;

    return 0;
}



function loadData(studyprogram, pnr) {
	$.get( "usermanagementviewservice.php", { studyprogram: studyprogram, pnr: pnr })  
		.done(
			function( data ) {
				//alert( "Data Loaded: " + data );
				if (data[0][0]==="student"){
					renderStudentView(data);
				} else if (data[0][0]==="studyprogram"){
					renderStudyprogramView(data);	
				} else {
					alert("Error, unkown data returned\n"+data);
				}								
			});

}

//---------------------------------------------------------------
//	renderStudentView(data) - renders the student view from the
//	student. Will render the full view with title and everything.
//---------------------------------------------------------------

function renderStudentView(data)
{

	console.log("DATA_RECIVED - DONE");
	
	var htmlStr = "";
	var fullname = data['fullname'];
	var studentClass = data['class'];
	
	htmlStr += '<h3 id="headerText">' + studentClass + ' för ' + fullname +'</h3>';
	
	var titleList = document.getElementById('studentTitle');
	titleList.innerHTML = htmlStr;
	
	/* Add Progressbar data */
	
	htmlStr = "";
	var progress = data['progress'];
	
	htmlStr += '<p>' + parseFloat(progress[0]['completedHP']) + '/' + progress[0]['totalHP']+ '</p>';
	
	var progressBar = document.getElementById('completedMainProgress');
	progressBar.innerHTML = htmlStr;
	
	/* Add course data */
	
	htmlStr = "";
	var year = data['year'];
	var courses = year['courses'];
	
	htmlStr += '<div class="year_header"><h3>Year '+ year['value'] +'</h3></div>';
	
	htmlStr += '<div class="courses_body">';
	
	for(var i = 0; i < courses.length; i++) {
		
		htmlStr += createHTMLForCourse(courses[i]);
		
	}
	
	htmlStr += '</div>';
	
	var yearList = document.getElementById('Year1');
	yearList.innerHTML = htmlStr;
	
	console.log("DATA_PRINTED - DONE");
	
	/* Check if error occurred during execution of SQL queries */
	if(data['debug'] != "NONE!") {
		alert(data['debug']);
	}
	
}
//---------------------------------------------------------------
//	createHTMLForCourse(data) - creates HTML representation of a
//	specific course. Prints out the information into div-elements
//---------------------------------------------------------------
function createHTMLForCourse(data) 
{
	var coursename 	= data['coursename'];
	var result		= data['result'];
	var hp			= data['hp'];
	// Check that the link is not null and if null present a '#' instead
	var course_link = (data['course_link'] == null ?  '#' : data['course_link']);
	var course_responsible = data['course_responsible'];
	
	if(result==null){
		result=0;
	}
	
	var courseHtmlStr = "";
	
	courseHtmlStr += '<div class="course">';
	courseHtmlStr += '<div class="course_wrapper">';
	
	courseHtmlStr += '<div class="course_name">' + coursename + '</div>';
	courseHtmlStr += '<div class="course_progressbar"> <div class="completed_course_progressbar">' + parseFloat(result) + '/' + hp + '</div></div>';
	courseHtmlStr += '<div class="course_link"><a href="' + course_link + '">Course link</a></div>';
	courseHtmlStr += '<div class="course_reponsible">' + course_responsible + '</div>';
	courseHtmlStr += '</div>';
	
	courseHtmlStr += '</div>';
	
	return courseHtmlStr;
	
}

function renderStudyprogramView(data){
	

}
