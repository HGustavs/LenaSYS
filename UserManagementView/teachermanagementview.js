
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

	console.log("Trying to create toolbar...");
	
	if(classes.length > 0) {
		renderToolbar(classes);
		var defaultclass = getTheDefaultProgram(classes);
		console.log("AJAXService call to retrieve view");
		updateView(defaultclass);
	}
	
}

function renderToolbar(classes) {
	
	var htmlStr = "";
	var currentClassCode = "";
	
	currentClassCode = classes[0]['classcode'];
	// Close current open lists
	htmlStr += "<ul>";
	htmlStr += "<li><a>" + currentClassCode + "</a>";
	htmlStr += "<ul>";
	
	for(var i = 0; i < classes.length; i++) {
		current_class = classes[i];
		if(currentClassCode != current_class['classcode']) {
			currentClassCode = current_class['classcode'];
			// Close current open lists
			htmlStr += "</ul>" + "</li>";
			htmlStr += "<li><a>" + currentClassCode + "</a>";
			htmlStr += "<ul>";
		}
		
		htmlStr += "<li onclick='updateView(" + "\"" + current_class['class'] + "\"" +")'><a>" + current_class['class'] + "</a></li>";
    }
    
    htmlStr += "</ul>" + "</li>" + "</ul>";
    
    var menulist = document.getElementById('DropdownMenu');
    menulist.innerHTML = htmlStr;
}

function getTheDefaultProgram(classes) 
{
	return classes[0]['class'];
}

function updateView(classname) {
	console.log("Clicked classname: " + classname);
	/* AJAX call to request students of 'classname' */
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
	
	var programTitle = document.getElementById("title");
	programTitle.innerHTML = htmlStr;
	
	htmlStr = "";
	
	//Render student information
	for(var i = 0; i < studentlist.length; i++) {
	
		var student = studentlist[i];
		
		if(i % 2 == 0) {
			htmlStr += "<div class='student_even'>";
		}else {
			htmlStr += "<div class='student_odd'>";
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
		
	}
	
	if(studentlist.length == 0) {
		htmlStr = "<div id='no_page'><h2>NO STUDENTS FOUND THAT ARE REGISTERED TO THIS COURSE</h2></div>";
	}
	
	var studentView = document.getElementById("studentslist");
	studentView.innerHTML = htmlStr;
	
	
}
