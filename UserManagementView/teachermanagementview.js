
// AJAX-call to dugga.js 
AJAXService("TOOLBAR", {}, "UMVTEACHER");

function renderTeacherView(data) {
	var type = data['type'];
	
	/* render the created toolbar*/
	if(type == "TOOLBAR") {
		createToolbar(data['classes']);
	}
	else if(type == "VIEW") {
		renderView(data);
	}
	
	/* Check if error occurred during execution of SQL queries */
	if(data['debug'] != "NONE!") {
		alert(data['debug']);
	}
}

function createToolbar(classes) {
	
	if(classes.length > 0) {
		renderToolbar(classes);
		//getTheDefaultProgram();
		//AJAXService("VIEW", {class}, "UMVTEACHER");
	}
	
}

function renderToolbar(classes) {
	
	var htmlStr = "";
	var currentClassCode = "";
	
	currentClassCode = classes[0]['classcode'];
	// Close current open lists
	htmlStr += "<ul>";
	htmlStr += "<li><a href='#'>" + currentClassCode + "</a>";
	htmlStr += "<ul>";
	
	for(var i = 0; i < classes.length; i++) {
		current_class = classes[i];
		if(currentClassCode != current_class['classcode']) {
			currentClassCode = current_class['classcode'];
			// Close current open lists
			htmlStr += "</ul>" + "</li>";
			htmlStr += "<li><a href='#'>" + currentClassCode + "</a>";
			htmlStr += "<ul>";
		}
		
		htmlStr += "<li><a href='#'>" + current_class['class'] + "</a></li>";
    }
    
    htmlStr += "</ul>" + "</li>" + "</ul>";
    
    var menulist = document.getElementById('DropdownMenu');
    menulist.innerHTML = htmlStr;
}

//---------------------------------------------------------------
//	renderView(data) - renders the student view from the
//	student. Will render the full view with title and everything.
//---------------------------------------------------------------

function renderView(data)
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
	
	htmlStr += '<p>' + progress[0]['completedHP'] + '/' + progress[0]['totalHP']+ '</p>';
	
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
	
	var courseHtmlStr = "";
	
	courseHtmlStr += '<div class="course">';
	courseHtmlStr += '<div class="course_wrapper">';
	
	courseHtmlStr += '<div class="course_name">' + coursename + '</div>';
	courseHtmlStr += '<div class="course_progressbar"> <div class="completed_course_progressbar">' + result + '/' + hp + '</div></div>';
	courseHtmlStr += '<div class="course_link"><a href="' + course_link + '">Course link</a></div>';
	courseHtmlStr += '<div class="course_reponsible">' + course_responsible + '</div>';
	courseHtmlStr += '</div>';
	
	courseHtmlStr += '</div>';
	
	return courseHtmlStr;
	
}

function renderStudyprogramView(data){
	

}
