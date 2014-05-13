$( document ).ready(function() {
	page = 	new getPage();
	page.load();
	page.show();
});
// Running page object funktions if browser back/forward buttons get pressed //
window.onhashchange = function() {
	page.show();
}
// Changing browser url and then running the page object functions //
function changeURL(url) {
	history.pushState(null, null, "#"+url);
	page.show();
}
// Grabing URL values //
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
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
		var hashtagsplit = url.split('#').pop();
		if(window.location.hash && hashtagsplit.length > 0) {
			var slashsplit = hashtagsplit.split('/');
			for (var i = 1 - 1; i <= slashsplit.length-1; i++) {
				//CHECK IF A FILE OR A FOLDER ELSE LAST ONE IS A FILE //
				if(!slashsplit[i].match(/^\s*$/)) {
					//CHECK IF A FOLDER //
					if(i>0) {
						if(slashsplit[i-1] in nodes) {
							name = slashsplit[i-1].split('?')[0];
							nodes = nodes[name];
							path +=name+"/";
						}
					}
					//CHECK IF A FILE //
					if(i==slashsplit.length-1) {
						this.page = slashsplit[i].split('?')[0];
					}
				}
				else {
					this.page = slashsplit[i-1].split('?')[0];
					i=slashsplit.length;
				}
			};
		}
		else {
			this.page = startpage;
		}
		//CHECK IF FILE EXISTS IN FOLDER //
		for (var filename in nodes) {
			if (typeof nodes[filename] != 'object') {
				if(nodes[filename].replace(/\..+$/, '') == this.page) {
					path +=nodes[filename];
					found=true;
				}
			}
		}
		//PRINT PAGE IF FILE FOUND OR PRINT 404 //
		if(found) {
			console.log("page "+this.page+" was loaded");
			$("#content").load(path);
		}
		else {
			console.log(this.page+ " not found!");
			this.page = "404";
			$("#content").load("pages/404.php");
		}
	}
	//Returning homepage title and page title //
	this.title = function(headline) {
		if(headline) {
			this.page = headline;
		}
		$("#title h1").html(title+" - "+this.page.capitalize());
		document.title = title+" | "+this.page.capitalize();
	}
	// Grabing a list of pages existing in the pages folder //
	this.load = function() {
		console.log("loading pages...");
		var result;
		$.ajax({
			url:"ajax/getPages.php",
			async: false,
			success:function(data) {
				result = JSON.parse(data);
				console.log("success");
			},
			error:function() {
				result = "404";
				console.log("error");
			}
		});
		console.log("complete");
		this.pages = result;
	}
}
// Modifying first letter in a string to a capital letter //
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function getTest() {
	console.log("loading Test...");

	$.ajax({
		type:"POST",
		url:"ajax/getTest.php",
		async: false,
		data: "testid="+getUrlVars()["testid"]+"&courseid="+getUrlVars()["courseid"],
		success:function(data) {
			console.log("success");
		},
		error:function() {
			console.log("error");
		}
	});
	console.log("complete");
}
// ALERT BOXES START //
function successBox(title, text, delay) {
	if(title == undefined || 0 === title.length) { title = "Success!" }
	if(text == undefined || 0 === text.length) { text = "You won..." }
	if(delay == undefined || 0 === delay.length) { delay = 0 }
	createRemoveAlert(title, text, delay, confirm, "success");
}
function noticeBox(title, text, delay) {
	if(title == undefined || 0 === title.length) { title = "Notice!" }
	if(text == undefined || 0 === text.length) { text = "Think about it..." }
	if(delay == undefined || 0 === delay.length) { delay = 0 }
	createRemoveAlert(title, text, delay, confirm, "info");
}
function warningBox(title, text, delay) {
	if(title == undefined) { title = "Warning!" }
	if(text == undefined || 0 === text.length) { text = "Can be dangerous..." }
	if(delay == undefined || 0 === delay.length) { delay = 0 }
	createRemoveAlert(title, text, delay, confirm, "warning");
}
function dangerBox(title, text, delay, confirm) {
	if(title == undefined || 0 === title.length) { title = "Warning!" }
	if(text == undefined || 0 === text.length) { text = "Serious error..." }
	if(delay == undefined || 0 === delay.length) { delay = 0 }
	createRemoveAlert(title, text, delay, confirm, "danger");
}

function createRemoveAlert(title, text, delay, confirm, type) {
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
	if($(".alert").length == 0) {
		setTimeout(function(){
			$("#content").prepend(output).children(':first').hide();
			var elemHeight = $('.alert').height();
			$('.alert').css({ display: "block", height: "0px" });
			$(".alert").animate({height: elemHeight}, 300);
		}, delay);	
	}
	if(typeof confirm == 'function') {
		$.when(this).done(setTimeout(function() {
			$( "#alertSubmit" ).click(function() {
				confirm();
				$(".alert").animate({height: 0}, 300,"linear",function() {
					$(this).remove();
				})
			});
			$( ".alertCancel" ).click(function() {
				$(".alert").animate({height: 0}, 300,"linear",function() {
					$(this).remove();
				})
			});
		}, 1000));
	}
	else {
		$.when(this).done(setTimeout(function() {
		$('html').click(function() {
		    $(".alert").animate({height: 0}, 300,"linear",function() {
				$(this).remove();
			})
		    $("html").unbind('click');
		});
		}, 1000));
	}
}
// ALERT BOXES END //