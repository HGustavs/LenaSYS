
// AJAX-call to dugga.js 
AJAXService("TOOLBAR", {}, "UMVTEACHER");

var selectedClass = "";
var selectedClassCode = "";
var selectedPage = "";


//---------------------------------------------------------------
//	renderTeacherView(data) - renders given html code for the given
//	data that was returned.
//---------------------------------------------------------------
function renderTeacherView(data) 
{
	var type = data['type']; //Array that holds what type of data should be rendered from DB

	// render the created toolbar
	if(type == "TOOLBAR") {
		createToolbar(data['classes']);
	}
	//Render the studentlist 
	else if(type == "VIEW") {
		clearView();
		renderView(data);
	}

	// Check if error occurred during execution of SQL queries
	if(data['debug'] != "NONE!") {
		alert(data['debug']);
	}
	navigate_page();
}

//---------------------------------------------------------------
//	createToolbar(classes) - creates the the toolbar with the
//	given classes that the teacher is responsible for.
//---------------------------------------------------------------
function createToolbar(classes) 
{
	//Check if there is a class that can be placed in the toolbar
	if(classes.length > 0) {
		renderToolbar(classes);
		updateDefaultProgram(classes); // Updates the view for the default class
	}
	
}

//---------------------------------------------------------------
//	renderToolbar(classes) - renders the toolbar with the given
//	classnames, sorts under the given coursecode
//---------------------------------------------------------------
function renderToolbar(classes) 
{
	var htmlStr = "";
	var currentClassCode = "";
	// Close current open lists
	htmlStr += "<ul>";
	
	//Loop to list every class into a dropdownmenu for the teacher
	for(var i = 0; i < classes.length; i++) {
		current_class = classes[i];
		if(currentClassCode != current_class['classcode']) {	//Check if course has a new course code
			currentClassCode = current_class['classcode'];
			if(i > 0) {
				htmlStr += "</ul>";
			}
			// Close current open lists
			htmlStr += "</li>";
			htmlStr += "<li id='"+currentClassCode+"' class='noActive'><a>" + currentClassCode + "</a>";
			htmlStr += "<ul>";
		}
		htmlStr += "<li class='noActive' id='"+current_class['class']+"' onclick='updateView(" + "\"" + 		current_class['class'] + "\", \"" + current_class['classcode'] + "\")'><a>" + current_class['class'] + "</a></li>";
    }
    
    htmlStr += "</ul>" + "</li>" + "</ul>";
    
    //Place everything that is retrived as a class and put it into a dropdownmenu.
    var menulist = document.getElementById('DropdownMenu');
    menulist.innerHTML = htmlStr;
}

//---------------------------------------------------------------
// selects the active menu and sets the css 
//---------------------------------------------------------------
function markAsActive(classname_id, classcode) 
{
	if(selectedClass !== classname_id) {
		if(selectedClass !== "") {
			$("#" + selectedClass).removeClass('active');
			$("#" + selectedClass).addClass('noActive');
			//Remove active from classcode 
			$("#" + selectedClassCode).removeClass('active');
			$("#" + selectedClassCode).addClass('noActive');
		}
		$("#" + classname_id).removeClass('noActive');
		$("#" + classname_id).addClass('active');
		
		$("#" + classcode).removeClass('noActive');
		$("#" + classcode).addClass('active');
		
		// Save current selected for later use
		selectedClass = classname_id;
		selectedClassCode = classcode;
	}
}

//---------------------------------------------------------------
//	getTheDefaultProgram(classes) - returns the first class in the
//	the array that represents the default choice
//---------------------------------------------------------------
function updateDefaultProgram(classes) 
{
	updateView(classes[0]['class'], classes[0]['classcode']);
}

//---------------------------------------------------------------
//	updateView(classname) - calls the ajaxservice that renders
//	the view for the given class
//---------------------------------------------------------------
function updateView(classname, classcode) 
{
	markAsActive(classname, classcode);
	// AJAX call to request students of 'classname' 
	AJAXService("VIEW", {classname:classname}, "UMVTEACHER");
}

//---------------------------------------------------------------
//	clearView(classname) - clears the views to only display the 
//	teacher view
//---------------------------------------------------------------
function clearView()
{
	$('#class_view').show();
	
	/* Clear the student view */
	var titleList = document.getElementById('studentTitle');
	titleList.innerHTML = "";
	
	var progressBar = document.getElementById('completedMainProgress');
	progressBar.innerHTML = "";
	
	var yearList = document.getElementById('Year1');
	yearList.innerHTML = "";
	
	
	var yearList2 = document.getElementById('Year2');
	yearList2.innerHTML = "";
	
	
	var yearList3 = document.getElementById('Year3');
	yearList3.innerHTML = "";
}

//---------------------------------------------------------------
//	renderView(data) - renders the view from the
//	teacher. Will render the full view with title and everything.
//---------------------------------------------------------------
function renderView(data)
{
	clearLinearGraph();
	
	var htmlStr = "";
	var classname = data['classname'];
	var studentlist = data['studentlist'];
	var calcNumberOfStudents = null;
	//change this varible for the number of students that renders per page
	var numberOfStudentsPerPages = 8; 
	
	//Render title
	htmlStr += "<h2>" + classname + "</h2>";
	
	//program title
	var programTitle = document.getElementById("title");
	programTitle.innerHTML = htmlStr;
	
	htmlStr = "";
	var wichPage=1;
	var renderStudent = 0;

	
	//If there is no students this will execute.
	if(studentlist.length == 0) {
		htmlStr = "<div id='no_page'><h2>No student data found for this class.</h2></div>";
		$('.changePages').hide();
		$('#radio_buttonToolbar').hide();
		$('graphContainer').hide();
		$('#studentView').hide();
		

	}else{

		for(var i = 0; i <= studentlist.length; i+=numberOfStudentsPerPages){
		

		if(wichPage>1){
			htmlStr += "<div id='page_"+wichPage+"' class='student_pages' style='display:none;'>";
		}else{

			htmlStr += "<div id='page_"+wichPage+"' class='student_pages'>";
		}

		for(var j = 0; j < numberOfStudentsPerPages;j++) {
		
			var student = studentlist[renderStudent];

			htmlStr += "<div class='studentInfo'>";
			htmlStr += getStudentInfo(student, renderStudent);
			htmlStr += getCourseResults(student['results'],j+i);

			htmlStr += "</div>";
		
			calcNumberOfStudents++;
			//error handling so it breaks when all the students are render
			if(renderStudent+1==studentlist.length){
				break;
			}
			renderStudent++;	
		}
		wichPage++;
		htmlStr += "</div>";
		}
	
		render_next_pages(calcNumberOfStudents,numberOfStudentsPerPages);


		$('#radio_buttonToolbar').show();
		
	}
	
	var studentView = document.getElementById("studentslist");
	studentView.innerHTML = htmlStr;
	
	
	progress_bar_hover(data);
	//jquery functions
	//The line graph needs to be redrawn once for the text to appear correctly
	createLinearGraph(data);
	clearLinearGraph();
	createLinearGraph(data);
	onClick_Students_To_page();
	input_search_alternative()
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
		htmlStr += "<div id='"+student['uid']+"' class='student'>";
	}else {
		htmlStr += "<div id='"+student['uid']+"' class='student odd'>";
	}
	htmlStr += "<div class='student_name'><p>" + student['fullname'] + "</p></div>";
	htmlStr += "<div class='student_ssn'><p>" + student['ssn'] + "</p></div>";
	htmlStr += "<div class='student_username'><p>" + student['username'] + "</p></div>";
	
	if(number % 2 == 0) {
		htmlStr += "<div class='student_email'><a href='mailto:" + student['email'] + "'>";
		htmlStr += "<img src='img/envelope_white.svg' id='mail-icon' width='13' height='10' alt='mail'></a></div>";
	}else {
		htmlStr += "<div class='student_email'><a href='mailto:" + student['email'] + "'>";
		htmlStr += "<img src='img/envelope_purple.svg' id='mail-icon' width='13' height='10' alt='mail'></a></div>";
	}
		
	htmlStr += "</div>";
	
	return htmlStr;
}

//---------------------------------------------------------------
//	getCourseResults(results, studentNumber) - creates the html representation
//	of the course results for a student and returns it
//---------------------------------------------------------------

function getCourseResults(results, studentNumber)
{
	var colorGreen = "#50a750";
	var colorYellow = "#F0AD4E";
	var htmlStr = "";
		
	htmlStr += "<div class='students_results'>";
	
	for(var i = 0; i < results.length; i++) {
	
		/* Check that result is not null and set to 0 if so */
		var course_result = results[i]['result'] == null ? 0 : results[i]['result'];
		var course_hp	  = results[i]['hp'];
		var course_name	  = results[i]['coursename'];
		var procent		  = course_result/course_hp * 100;
		var color		  = procent < 100 ? colorYellow : colorGreen;
		
		htmlStr += "<div class='courseNameindicator' id='course_"+course_name+" "+course_result+"/"+course_hp+"hp#"+studentNumber+"'>";		
		htmlStr += "</div>";
		htmlStr += "<div id='"+course_name+" "+course_result+"/"+course_hp+"hp#"+studentNumber+"' class='progress_course_total'>";
		htmlStr += "<div class='progress_course' style='width:" + procent + "%; background-color: " + color + ";'>";
		htmlStr += "</div>";
		htmlStr += "</div>";
		
	}
		
	htmlStr += "</div>";
	
	return htmlStr;
	
}
//---------------------------------------------------------------
//	progress_bar_hover(data) - shows the coursename when hovering 
//	over the small progressbars. 
//---------------------------------------------------------------
function progress_bar_hover(data)
{
	$('.progress_course_total').on( 'mouseenter',function() {
		
			var course = 'course_'+$(this).attr('id');

			var htmlString = "";
			htmlString += "<p>"+$(this).attr('id').split('#')[0]+"</p>";
			
			var hover_name = document.getElementById(course);
			hover_name.innerHTML = htmlString;

		}).on('mouseleave', function(){
			
			var courseout = "course_"+$(this).attr('id');

			var hover_name = document.getElementById(courseout);
			hover_name.innerHTML = "";
  
    });
}

//---------------------------------------------------------------
//	render_next_pages(calcNumberOfStudents,numberOfStudentsPerPages) 
//	Sets the number of change pages buttons depending of how many 
//	students in class.
//---------------------------------------------------------------
function render_next_pages(calcNumberOfStudents,numberOfStudentsPerPages)
{
	var htmlInserts="";
	var numberOfPage=1;
	
	htmlInserts+="<div class='changePages'>";
	htmlInserts+="<p>Page</p>";
	
	for(var i =0; i < calcNumberOfStudents; i+=numberOfStudentsPerPages){
		htmlInserts+= "<div class='page_"+numberOfPage +" pages notActive_Page' onClick='activePage("+numberOfPage+")'>"+numberOfPage +"</div>";
		numberOfPage++;
	}

	var changePages = document.getElementById("teacher_pages");
	changePages.innerHTML = htmlInserts;
	activePage(1);
}

//------------------------------------------------------------------------
//	activePage(numberOfPage) - When click on pagenumber the pagenumber 
// 	is going to be markt
//------------------------------------------------------------------------
function activePage(numberOfPage)
{
	if(selectedPage !== numberOfPage) {
		if(selectedPage !== "") {
			$('.page_'+selectedPage).removeClass('active_Page');
			$('.page_'+selectedPage).addClass('notActive_Page');
		}
		$('.page_'+numberOfPage).removeClass('notActive_Page');
		$('.page_'+numberOfPage).addClass('active_Page');
		
		selectedPage = numberOfPage;
	}
	else{
		selectedPage = "";
		$('.page_'+numberOfPage).removeClass('notActive_Page');
		$('.page_'+numberOfPage).addClass('active_Page');
	}
	
}

//---------------------------------------------------------------
//	navigate_page() - navigates between pages
//---------------------------------------------------------------
function navigate_page()
{
	$('.pages').click(function(){
		
		var classPage = "#"+this.className.split(' ')[0]; 
		
		// hides all studen_pages before the right one is displayesd
		$('.student_pages').each(function(){
			$(this).css("display", "none");
		});
		$(classPage).css("display", "block");
		
	});
}

//---------------------------------------------------------------
//	clearLinearGraph() - clears the line graph representing
//	all the student results in every course
//---------------------------------------------------------------
function clearLinearGraph() 
{
	var graph = $('#graph');
	var c = graph[0].getContext('2d');
	c.clearRect(0, 0, graph[0].width, graph[0].height);
}

//----------------------------------------------------------------------------------
//	input_search_alternative() - Checks if the first letter is a number
//	or a character in the searchfield. If it's a number the search_alternatives 
//	function will parse ssn data from the database and if its a character it
//	will parse username data.
//----------------------------------------------------------------------------------
function input_search_alternative(){
	$('#inputSearch').keydown(function(e){
		switch(e.wich){
			case 38: break;	//this is the press up key
			case 40: break; // this is press down key
			case 13: break; // this is the enter key
			default:

				// checks witch query it will use to get data from php. add more statments for diffrent querys
				if(isNaN(this.value.charAt(0))){
					search_alternatives(this.value,2);
				}else{
					search_alternatives(this.value,1);
				};
		}
	
	});
}

//----------------------------------------------------------------------------------
//	search_alternatives(varible,query) - Depending on the query value the 
//	the function will either parse ssn or username data. 
//----------------------------------------------------------------------------------
function search_alternatives(varible,query) {
	if(query==1){	
		$.ajax({
			type:"POST",
			url: "../UserManagementView/umvSearch.php",
			data: {
				ssn: varible,
				query: query,
				classID: selectedClass
			},
			success:function(data) {
				if(data != null){
					var dataclean = JSON.parse(data);
					search_option(dataclean,1);
				}
			},
			error:function() {
				console.log("error");
			}
		});

	}if(query==2){
		$.ajax({
			type:"POST",
			url: "../UserManagementView/umvSearch.php",
			data: {
				usernameSearch: varible,
				query: query,
				classID: selectedClass
			},
			success:function(data) {
				if(data != null){
					var dataclean = JSON.parse(data);
					search_option(dataclean,2);
				}
			},
			error:function() {
				console.log("error");
			}
		});
	}
}

//------------------------------------------------------------------------------------------
//	search_option_pnr(data) - Adds the top five searchresults to the search options
//	under the searchbar when searching for ssn. 
//------------------------------------------------------------------------------------------
function search_option(data,input){
	var htmlStr= "";
	var user = data['user'];
	
	if(input==1 & user.length > 0){
		for(var i = 0; i<8;i++){
			htmlStr += "<option value='"+user[i]['ssn']+"  "+user[i]['username']+"' class='"+user[i]['uid']+"'></option>";
			if(i == user.length-1){
				break;
			}
		}
	}if(input==2 & user.length > 0){
		for(var i = 0; i<8;i++){
			htmlStr += "<option value='"+user[i]['username']+"  "+user[i]['ssn']+"' class='"+user[i]['uid']+"'></option>";
			if(i == user.length-1){
				break;
			}
		}
	}
	var insert = document.getElementById("searchOptions");
	insert.innerHTML = htmlStr;
}
//------------------------------------------------------------------------------------------
//	display_search_data() - Render student view for the selected option in the
//	in the searchfield.
//------------------------------------------------------------------------------------------
function display_search_data(){
	var studentToRender = null;
	var theOption = $('#inputSearch').val();

	$('option').each( function() {

		if(this.value== theOption){
			studentToRender = this.className;
		}
	});
	if(studentToRender != null){
		get_student_data(studentToRender);
	}
}

//------------------------------------------------------------------------------------------
//	Redirect teacher to specific student page
//------------------------------------------------------------------------------------------
function onClick_Students_To_page()
{
	$('.student').click(function(){
		get_student_data(this.id);
	});
}

//------------------------------------------------------------------------------------------
//	get_student_data(studentid) - Collects the right data from the DB to render the
//	student view for a specific student. 
//------------------------------------------------------------------------------------------
function get_student_data(studentid) 
{
	var renderstudent = 'render';
	$.ajax({
		type:"POST",
		url: "../UserManagementView/usermanagementviewservice.php",
		data: {
			studentid: studentid,
			renderstudent: renderstudent
		},
		success:function(data) {
			var result = JSON.parse(data);
			renderStudentView(result);
			$('#class_view').hide();
		},
		error:function() {
			console.log("error");
		}
	});
}

//---------------------------------------------------------------
//	clearLinearGraph() - clears the line graph representing
//	all the student results in every course
//---------------------------------------------------------------
function clearLinearGraph() 
{
	var graph = $('#graph');
	var c = graph[0].getContext('2d');
	c.clearRect(0, 0, graph[0].width, graph[0].height);
}

//---------------------------------------------------------------
//	createLinearGraph() - creates the line graph
//	representing all the student results in every course
//---------------------------------------------------------------
function createLinearGraph(data)
{
	var backgroundcolor_overlay = "#F5F0F5";
	var color_helpLines 		= "#D8D8D8";
	var width_helpLines			= 2;
	var x_axis_text_font		= 'italic 8pt sans-serif';
	var x_axis_text_align		= "center";
	var x_axis_text_color		= "#000";
	var width_axisLines			= 2;
	var color_axisLines			= "#333";
	var y_axis_text_baseline	= "middle";
	var y_axis_text_align		= "right";
	var graphLine_color			= "#5C005C";
	var graphLine_width			= 4;
	var circle_fill_color		= '#FFF';
	var circle_stroke_color		= '#D8D8D8';
	var circle_width			= 10;
	
	
	var graph;
   	var yPadding_top = 20;
    	var yPadding_bottom = 30;
	var xPadding = 40;
	var maxY = 100;

	var courselist = data['courselist'];
	var courses = [];
	var hp = 0;
	for(var i = 0; i < courselist.length; i++) {
		hp = Math.floor(((courselist[i]['result'] / (courselist[i]['hp'] * courselist[i]['studentCount'])) * 100), 0);
		courses.push({X: courselist[i]['name'], Y: hp});
	}
	
	// Return the x pixel for a graph point
	function getXPixel(val) {
		return ((graph.width() - (xPadding * 2)) / courses.length) * val + (xPadding * 2);
	}
	
	// Return the y pixel for a graph point
	function getYPixel(val) {
		return graph.height() - (((graph.height() - (yPadding_top + yPadding_bottom)) / maxY) * val) - yPadding_bottom;
	}
	 
	graph = $('#graph');

	// Adjust the width of the graph to fit the amount of ćourses
	graph[0].width = 700 + ((courselist.length/30) * 700);

	var c = graph[0].getContext('2d');

	// Style for the overlay under the graph
	c.fillStyle = backgroundcolor_overlay;
	
	// Begin the drawing of the polygon that should be under the graph
	c.beginPath();
	c.moveTo(getXPixel(0), getYPixel(0));
	
	for(var i = 0; i < courses.length; i++) {
		c.lineTo(getXPixel(i), getYPixel(courses[i].Y));
	}
	
	c.lineTo(getXPixel(courses.length - 1), getYPixel(0));
	c.fill();
	
	c.lineWidth 	= width_helpLines;
	c.strokeStyle 	= color_helpLines;
	c.font 			= x_axis_text_font;
	c.textAlign 	= x_axis_text_align;
	c.fillStyle 	= x_axis_text_color;
	
	// Draw the X value texts
	for(var i = 0; i < courses.length; i++) {
		c.beginPath();
		c.fillText(courses[i].X, getXPixel(i), graph.height() - yPadding_bottom + 20);
		c.fillText(courses[i].Y + "%", getXPixel(i) - 15, getYPixel(courses[i].Y) - 15);
		c.moveTo(getXPixel(i), graph.height() - yPadding_bottom);
		c.lineTo(getXPixel(i), getYPixel(100));
		c.stroke();
	}
	
	c.lineWidth = width_axisLines;
	c.strokeStyle = color_axisLines;
	
	// Draw the axises
	c.beginPath();
	c.moveTo(xPadding, yPadding_top);
	c.lineTo(xPadding, graph.height() - yPadding_bottom);
	c.lineTo(graph.width(), graph.height() - yPadding_bottom);
	c.stroke();
	
	// Draw the Y value texts
	c.textAlign = y_axis_text_align;
	c.textBaseline = y_axis_text_baseline;
	
	c.fillText((0 + "%"), xPadding - 5, getYPixel(0));
	c.fillText((100 + "%"), xPadding - 5, getYPixel(100));
	
	c.strokeStyle = graphLine_color;
	c.lineWidth = graphLine_width;
	
	// Draw the line graph
	if(courses.length > 0) {
		c.beginPath();
		c.moveTo(getXPixel(0), getYPixel(courses[0].Y));
		for(var i = 1; i < courses.length; i++) {
			c.lineTo(getXPixel(i), getYPixel(courses[i].Y));
		}
		c.stroke();
		
		// Draw the dots
		c.fillStyle = circle_fill_color;
		c.strokeStyle = circle_stroke_color;
						
		for(var i = 0; i < courses.length; i++) {  
			c.beginPath();
			c.arc(getXPixel(i), getYPixel(courses[i].Y), circle_width, 0, Math.PI * 2, true);
			c.fill();
			c.stroke();
		}
	}
}
