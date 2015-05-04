
// AJAX-call to dugga.js 
AJAXService("TOOLBAR", {}, "UMVTEACHER");

//---------------------------------------------------------------
//	renderTeacherView(data) - renders given html code for the given
//	data that was returned.
//---------------------------------------------------------------
function renderTeacherView(data) {
	var type = data['type']; //Array that holds what type of data should be rendered from DB
	
	// render the created toolbar
	if(type == "TOOLBAR") {
		createToolbar(data['classes']);
	}
	//Render the studentlist 
	else if(type == "VIEW") {
		renderView(data);
	}

	// Check if error occurred during execution of SQL queries
	if(data['debug'] != "NONE!") {
		alert(data['debug']);
	}
}

//---------------------------------------------------------------
//	createToolbar(classes) - creates the the toolbar with the
//	given classes that the teacher is responsible for.
//---------------------------------------------------------------
function createToolbar(classes) {

	console.log("Trying to create toolbar...");
	
	//Check if there is a class that can be placed in the toolbar
	if(classes.length > 0) {
		renderToolbar(classes);
		var defaultclass = getTheDefaultProgram(classes); // Reads data from getTheDeaultProgram()
		console.log("AJAXService call to retrieve view");
		updateView(defaultclass);
	}
	
}

//---------------------------------------------------------------
//	renderToolbar(classes) - renders the toolbar with the given
//	classnames, sorts under the given coursecode
//---------------------------------------------------------------
function renderToolbar(classes) {
	
	var htmlStr = "";
	var currentClassCode = "";
	
	currentClassCode = classes[0]['classcode'];
	// Close current open lists
	htmlStr += "<ul>";
	htmlStr += "<li><a>" + currentClassCode + "</a>";
	htmlStr += "<ul>";
	
	//Loop to list every class into a dropdownmenu for the teacher
	for(var i = 0; i < classes.length; i++) {
		current_class = classes[i];
		if(currentClassCode != current_class['classcode']) {	//Check if course has a new course code
			currentClassCode = current_class['classcode'];
			// Close current open lists
			htmlStr += "</ul>" + "</li>";
			htmlStr += "<li><a>" + currentClassCode + "</a>";
			htmlStr += "<ul>";
		}
		
		htmlStr += "<li onclick='updateView(" + "\"" + current_class['class'] + "\"" +")'><a>" + current_class['class'] + "</a></li>";
    }
    
    htmlStr += "</ul>" + "</li>" + "</ul>";
    
    //Place everything that is retrived as a class and put it into a dropdownmenu.
    var menulist = document.getElementById('DropdownMenu');
    menulist.innerHTML = htmlStr;
}

//---------------------------------------------------------------
//	getTheDefaultProgram(classes) - returns the first class in the
//	the array that represents the default choice
//---------------------------------------------------------------
function getTheDefaultProgram(classes) 
{
	return classes[0]['class'];
}

//---------------------------------------------------------------
//	updateView(classname) - calls the ajaxservice that renders
//	the view for the given class
//---------------------------------------------------------------
function updateView(classname) {
	console.log("Clicked classname: " + classname);
	// AJAX call to request students of 'classname' 
	AJAXService("VIEW", {classname:classname}, "UMVTEACHER");
}

//---------------------------------------------------------------
//	renderView(data) - renders the view from the
//	teacher. Will render the full view with title and everything.
//---------------------------------------------------------------

function renderView(data)
{

	console.log("DATA_FOR_VIEW_RECIVED - DONE");
	
	var htmlStr = "";
	var classname = data['classname'];
	var studentlist = data['studentlist'];
	
	//Render title
	htmlStr += "<h2>" + "Programvy för " + classname + "</h2>";
	
	//program title
	var programTitle = document.getElementById("title");
	programTitle.innerHTML = htmlStr;
	
	htmlStr = "";
	
	//Render student information
	for(var i = 0; i < studentlist.length; i++) {
	
		var student = studentlist[i];
		
		htmlStr += "<div class='studentInfo'>";
		
		htmlStr += getStudentInfo(student, i);
		
		htmlStr += getCourseResults(student['results']);
		
		htmlStr += "</div>";
		
	}
	
	//If there is no students this will execute.
	if(studentlist.length == 0) {
		htmlStr = "<div id='no_page'><h2>No student data found for this class.</h2></div>";
	}
	
	var studentView = document.getElementById("studentslist");
	studentView.innerHTML = htmlStr;
	
	
}

//---------------------------------------------------------------
//	getStudentInfo(student, number) - Creates a div that shows 
//	a list of every student of a specific class. Fullname, ssn
//	username and email.
//---------------------------------------------------------------
function getStudentInfo(student, number) 
{
	var htmlStr = "";

	if(number % 2 == 0) {
		htmlStr += "<div class='student'>";
	}else {
		htmlStr += "<div class='student odd'>";
	}
		
	//Student name
	htmlStr += "<div class='student_name'><p>" + student['fullname'] + "</p></div>";
	//Student ssn
	htmlStr += "<div class='student_ssn'><p>" + student['ssn'] + "</p></div>";
	//Username
	htmlStr += "<div class='student_username'><p>" + student['username'] + "</p></div>";
	//E-mail
	htmlStr += "<div class='student_email'><p>" + student['email'] + "</p></div>";
		
	htmlStr += "</div>";
	
	return htmlStr;
}

//---------------------------------------------------------------
//	getCourseResults(results) - creates the html representation
//	of the course results for a student and returns it
//---------------------------------------------------------------

function getCourseResults(results)
{
	var colorGreen = "#50a750";
	var colorYellow = "#F0AD4E";
	var htmlStr = "";
		
	htmlStr += "<div class='students_results'>";
	
	for(var i = 0; i < results.length; i++) {
	
		/* Check that result is not null and set to 0 if so */
		var course_result = results[i]['result'] == null ? 0 : results[i]['result'];
		var course_hp	  = results[i]['hp'];
		var procent		  = course_result/course_hp * 100;
		var color		  = procent < 100 ? colorYellow : colorGreen;
		
		htmlStr += "<div class='progress_course_total'>";
		htmlStr += "<div class='progress_course' style='width:" + procent + "%; background-color: " + color + ";'>";
		htmlStr += "<p>" + parseFloat(course_result) + "/" + course_hp + "</p>";
		htmlStr += "</div>";
		htmlStr += "</div>";
		
	}
		
	htmlStr += "</div>";
	
	return htmlStr;
	
}
