$( document ).ready(function() {
	page = 	new getPage();
	page.load()
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
			$("#content").load(path);
			console.log(this.page+ " was found!");
			$("#title h1").html(title+" - "+this.page.capitalize());
			document.title = title+" | "+this.page.capitalize();
		}
		else {
			$("#content").load("pages/404.php");
			console.log(this.page+ " not found!");
			$("#title h1").html(title+" - 404");
			document.title = title+" | "+"404";
			this.page = "404";
		}
	}
	//Returning homepage title and page title //
	this.title = function() {
		return(title+" - "+this.page.capitalize());
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