$( document ).ready(function() {
	//dynamically load and add this .js file
	loadHeaderLink(getScriptPath("header.js")+"/login.js", "js") 
	//dynamically load css file
	loadHeaderLink(getScriptPath("header.js")+"/css/style.css", "css")
	printHeader();
});
// Simple go back history function //
function historyBack() {
	window.history.back()
}
function printHeader () {
	$("header").load(getScriptPath("header.js")+"/content/header.php", function() {
		page.title();
	});
}
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
//Function to grab path to a script file
function getScriptPath(name) {
    var scripts = document.getElementsByTagName('script');
    for (i=0;i<scripts.length;i++){
        if (scripts[i].src.indexOf(name) > -1) {
        	var path = scripts[i].src;
        	path = path.substring(0, path.lastIndexOf("/"));
            return(path);
        }
    }
}