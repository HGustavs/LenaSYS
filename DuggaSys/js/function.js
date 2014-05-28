var keysPressed = [];
var saltyCookies = "38,38,40,40,37,39,37,39,66,65";
$(document).keydown(function(e) {
	keysPressed.push(e.keyCode);
	if (keysPressed.toString().indexOf(saltyCookies) >= 0) {
		$(document).unbind('keydown', arguments.callee);
		$("#content").append("<iframe width='0' height='0' src='"+ WEREGOINGTODISNEYLAND() + "' frameborder='0' allowfullscreen></iframe>");        
	}
});

function WEREGOINGTODISNEYLAND() {
	var candyStore = [
		"//www.youtube.com/embed/AjPau5QYtYs?autoplay=1",
		"//www.youtube.com/embed/bLqwK00Ob4w?autoplay=1",
		"//www.youtube.com/embed/OIfLyMSuAMA?autoplay=1",
		"//www.youtube.com/embed/QH2-TGUlwu4?autoplay=1",
		"//www.youtube.com/embed/2a4gyJsY0mc?autoplay=1",
	];
	var enormousSandwich = Math.floor(Math.random() * candyStore.length);

	if(enormousSandwich == 3) {
		kittySpree();
	}
	return candyStore[enormousSandwich];
}

$( document ).ready(function() {
	page = new getPage();
	page.show();
});
// Running page object functions if browser back/forward buttons get pressed //
window.onhashchange = function() {
	page.show();
}
// Changing browser url and then running the page object functions //
function changeURL(url) {
	history.pushState(null, null, "#"+url);
	page.show();
}
// Simple go back history function //
function historyBack() {
	window.history.back()
}
// Grabbing URL values //
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
// Page handler object //
// Page handler object //
function getPage() {
	var title = "Lenasys";
	var startpage = "menulist";
	var pages = [];
	var page = "";
	// Printing a page into content element depending on a pagelist //
	this.show = function() {
		var url = $(location).attr('href');
		var nodes = this.pages;
		var path = "pages/";
		var found= false;
		var urlsplit = url.split("#");

		// If there's no # then we'll default to menulist
		if(urlsplit.length == 2) {
			var hashtagsplit = urlsplit.pop();
			if(hashtagsplit.length < 1)
				hashtagsplit = "menulist";
		} else {
			var hashtagsplit = "menulist";
		}

		// Data to send to the views
		var data = getUrlVars();

		// URL we're looking for
		this.page = "pages/" + hashtagsplit.split('?')[0];
		console.log("Loading... " + this.page);
		$.ajax({
			url: this.page + ".php",
			method: 'POST',
			data: data,
			success: function(returnedData) {
				removeDateTimePicker();
				$("#content").html(returnedData);
			},
			error: function() {
				removeDateTimePicker();
				$("#content").load("pages/404.php");
			}
		})
	}
	//Returning homepage title and page title //
	this.title = function(headline) {
		if(headline) {
			this.page = headline;
		}
		$("#title h1").html(title+" - "+this.page.capitalize());
		document.title = title+" | "+this.page.capitalize();
	}
}

// Modifying first letter in a string to a capital letter //
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
// ALERT BOXES START //
function successBox(title, text, delay, confirm, data) {
	if(title == undefined || 0 === title.length) { title = "Success!" }
	if(text == undefined || 0 === text.length) { text = "You won..." }
	if(delay == undefined || 0 === delay.length) { delay = 0 }
	createRemoveAlert(title, text, delay, confirm, data, "success");
}
function noticeBox(title, text, delay, confirm, data) {
	if(title == undefined || 0 === title.length) { title = "Notice!" }
	if(text == undefined || 0 === text.length) { text = "Think about it..." }
	if(delay == undefined || 0 === delay.length) { delay = 0 }
	createRemoveAlert(title, text, delay, confirm, data, "info");
}
function warningBox(title, text, delay, confirm, data) {
	if(title == undefined) { title = "Warning!" }
	if(text == undefined || 0 === text.length) { text = "Can be dangerous..." }
	if(delay == undefined || 0 === delay.length) { delay = 0 }
	createRemoveAlert(title, text, delay, confirm, data, "warning");
}
function dangerBox(title, text, delay, confirm, data) {
	if(title == undefined || 0 === title.length) { title = "Warning!" }
	if(text == undefined || 0 === text.length) { text = "Serious error..." }
	if(delay == undefined || 0 === delay.length) { delay = 0 }
	createRemoveAlert(title, text, delay, confirm, data, "danger");
}

function createRemoveAlert(title, text, delay, confirm, data, type) {
	var result = false;
	if(delay == undefined) { delay = 0 }
	var output = '<div class="alert slide-down '+type+'">';
		output += '<strong>'+title+'</strong>';
		output += '<p>'+text+'</p>';
		output += '<span class="alertCancel">x</span>';
		if(typeof confirm == 'function') {
			output += '<input type="button" id="alertSubmit" class="btn btn-login btn-next" value="Submit">';	
			output += '<input type="button" class="btn btn-forgot btn-cancel alertCancel" value="Cancel">';	
		}
	output += '</div>';
	if($(".slide-down").length == 0) {
		setTimeout(function(){
			$("#content").prepend(output).children(':first').hide();
			var elemHeight = $('.slide-down').height();
			var top = $(document).scrollTop()+50;
			$('.slide-down').css({ top: top+"px" });	
			$('.slide-down').css({ display: "block", height: "0px" });
			$(".slide-down").animate({height: elemHeight}, 300);
		}, delay);	
	}
	if(typeof confirm == 'function') {
		$.when(this).done(setTimeout(function() {
			$( "#alertSubmit" ).click(function() {
				confirm(data);
				$(".slide-down").animate({height: 0}, 300,"linear",function() {
					$(this).remove();
				})		
			});
			$( ".alertCancel" ).click(function() {
				$(".slide-down").animate({height: 0}, 300,"linear",function() {
					$(this).remove();
				})
			});
		}, 1000));
	}
	else {
		$.when(this).done(setTimeout(function() {
		$('html').click(function() {
		    $(".slide-down").animate({height: 0}, 300,"linear",function() {
				$(this).remove();
			})
		    $("html").unbind('click');
		});
		}, 1000));
	}
	$(window).scroll(function() {
		var top = $(document).scrollTop()+50;
		$('.slide-down').css({ top: top+"px" });	
	});
}
// ALERT BOXES END //

//Function to load new links to head dynamically
function loadHeaderLink(filename, filetype){
	//if filename is a external JavaScript file
	if (filetype=="js"){
		var fileref=document.createElement('script')
		fileref.setAttribute("type","text/javascript")
		fileref.setAttribute("src", filename)
	}
	//if filename is an external CSS file
	else if (filetype=="css"){
		var fileref=document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
	}
	if (typeof fileref!="undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref)
	}
}
// QUIZ FUNCTIONS START //
function getQuiz(quizId) {
	console.log(quizId);
	if(quizId != "undefined") {
		console.log("loading quiz...");
		addRemoveLoad(true);
		$.ajax({
			type:"POST",
			url:"ajax/getQuiz.php",
			async: false,
			data: "quizid="+quizId,
			success:function(data) {
				data = JSON.parse(data);
				console.log("success");
				console.log(data);
				if(typeof data.error == "undefined") {
					console.log(data['template']+".js template loaded");
					$("#content").prepend("<script type='text/javascript' src='templates/"+data['template']+".js'></script>");
					setTimeout(function(){
						quiz(data['parameters']);
						addRemoveLoad(false);
					}, 500);
				} else {
					console.log(data[0]);
					historyBack();
					setTimeout(function(){
						dangerBox(
							"Ooops you got an error!",
							"This may mean that the system couldn't find the quiz " + 
							"you specified or that you don't have permission to the " + 
							"quiz you want to start.<br/>Contact an admin for " +
							"support or try again later.<br/><br/>" + 
							"The error reported was: " + data.error)
					}, 500);
					addRemoveLoad(false);
				}
			},
			error:function() {
				console.log("error");
				addRemoveLoad(false);
			}
		});
		console.log("complete");
	}
	else {
		historyBack();
		setTimeout(function(){
			dangerBox("Ooops you got an error!","There is an ID missing to reach a quiz...<br/>Contact admin for support or try again.");
		}, 100);
	}
}
// QUIZ FUNCTIONS END //
function getTemplateInfo(template) {
	if(template != "undefined") {
		addRemoveLoad(true);
		console.log("loading template info...");
		$.ajax({
			type:"POST",
			url:"ajax/getTemplateInfo.php",
			async: false,
			data: "template="+template,
			success:function(data) {
				if($('#templateDescription').length > 0) {
					$('#templateDescription').remove();
				}
				$("#quizParameters").before("<div id='templateDescription' class='alert info'><strong>Parameter description</strong><p>"+data+"</p></div>");
				console.log("success");
				addRemoveLoad(false);
			},
			error:function() {
				console.log("error");
				addRemoveLoad(false);
			}
		});
	}
}
// SHOW OR HIDE LOAD BAR FUNCTION START //
function addRemoveLoad(show) {
	if(show && $("header .load").length ==0) {

		$("header").append("<div class='load'></div>");
	}
	else if(!show) {
		$("header .load").fadeOut(300, function() { $(this).remove(); });
	}
	else {
		return true;		
	}
}
// SHOW OR HIDE LOAD BAR FUNCTION END //
function removeDateTimePicker() {
	if ($(".xdsoft_noselect").length) {
		$(".xdsoft_noselect").remove();	
	};
}
function kittySpree() {
	$("body").append("<figure id='nyanCat'></figure>");
	$("body").append("<figure id='nyanKillCat'></figure>");
}
