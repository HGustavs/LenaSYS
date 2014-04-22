$( document ).ready(function() {
	page = 	new page();
	page.show(page.load());
});

window.onhashchange = function() {       
	page.show(page.load());  
}

function changeURL(url) {
	history.pushState(null, null, "#"+url);
	page.show(page.load());
}

function historyBack() {
	window.history.back()
}

function page() {
	var title = "Duggasys";	
	this.show = function(pages) {
		url = $(location).attr('href');
		if((0>url.indexOf("duggaid")) || (0>url.indexOf("duggaid"))) {
				$("#content").load("pages/noid.html");
				$("#title h1").html(title+" - Missing ID!");
				document.title = title+" | "+"Missing ID";
				console.log("Missing ID!");
		}
		else {
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
				$("#content").load("pages/404.html");
				$("#title h1").html(title+" - 404");
				document.title = title+" | "+"404";
				console.log("page not found!");
			}
		}
	}

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

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}