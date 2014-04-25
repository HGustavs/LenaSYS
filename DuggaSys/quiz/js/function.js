$( document ).ready(function() {
	page = 	new getPage();
	getTest();
	page.show(page.load());
});
// Running page object funktions if browser back/forward buttons get pressed //
window.onhashchange = function() {       
	page.show(page.load());  
}
// Changing browser url and then running the page object functions //
function changeURL(url) {
	history.pushState(null, null, "#"+url);
	page.show(page.load());
}
// Simple go back history function //
function historyBack() {
	window.history.back()
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
	var title = "Duggasys";
	// Printing a page into content element depending on a pagelist //
	this.show = function(pages) {
		url = $(location).attr('href');
		for (var i = pages.length - 1; i >= 0; i--) {
			name = pages[i].replace(/^.*[\\\/]/, '');
			name = name.replace(/.[^.]+$/,'');
			if(0<url.indexOf("#"+name)) {
				$("#content").load("pages/"+pages[i]);
				$("#title h1").html(title+" - "+name.capitalize());
				document.title = title+" | "+name.capitalize();
				var found=true;
			}
		};	
		if(!found) {
			$("#content").load("pages/404.php");
			$("#title h1").html(title+" - 404");
			document.title = title+" | "+"404";
			console.log("page not found!");
		}
	}
	// Grabing a list of pages existing in the pages folder //
	this.load = function() {
		console.log("Loading pages...");
		$.ajax({
			url:"ajax/getPages.php",
			async: false,  
			success:function(data) {
				pages = JSON.parse(data);
				console.log("success");
			},
			error:function() {
				pages = "404";
				console.log("error");
			}
		});
		console.log("complete");
		return(pages);
	}
}
// Modifying first letter in a string to a capital letter //
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function getTest() {
  
  	console.log("Loading Test...");

		$.ajax({
			type:"POST",
			url:"ajax/getTest.php",
			async: false,  
			data: "testid="+getUrlVars()["testid"]+"&courseid="+getUrlVars()["courseid"],
			success:function(data) {
				console.log("success");
				console.log("databas: "+data);
			},
			error:function() {
				console.log("error");
			}
		});
		console.log("complete");
}