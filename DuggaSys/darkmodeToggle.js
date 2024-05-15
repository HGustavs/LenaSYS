//----------------------------------------
// Dark mode toggle button listener.  
//----------------------------------------
const themeStylesheet = document.getElementById('themeBlack');

//default theme, if its null it becomes light theme 
if (!localStorage.getItem('themeBlack')) {
	themeStylesheet.href = "../Shared/css/style.css";
	localStorage.setItem('themeBlack',themeStylesheet.href)
}

/*/ The code below is waitng for the page to load, and check when the user changes his/her 
operative system to either black or white mode . /*/

// This is an event listener that toggles the theme of the page (dark or light)
document.addEventListener('DOMContentLoaded', () => {
	const storedTheme = localStorage.getItem('themeBlack');
	if(storedTheme){
		themeStylesheet.href = storedTheme;
	}
	const themeToggle = document.getElementById('theme-toggle');

	if (!themeToggle) return false;

	themeToggle.addEventListener('click', () => {
    // if it's light -> go dark
    if(themeStylesheet.href.includes('blackTheme')){
      themeStylesheet.href = "../Shared/css/style.css";
      localStorage.setItem('themeBlack',themeStylesheet.href);
    } 
    else if(themeStylesheet.href.includes('style')) {
      // if it's dark -> go light
      themeStylesheet.href = "../Shared/css/blackTheme.css";
      localStorage.setItem('themeBlack',themeStylesheet.href);
    }
	// Redraw course schedule / planner SVG to get the appropriate color scheme
	// Course schedule = the SVG that displays the weeks and how far into a course we are
	drawSwimlanes();		
  })
})

//It actively checks if the "theme" changes on the operating system and changes colors based on it. It override your preferences.
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
	const newColorScheme = e.matches ? "dark" : "light";
	if(newColorScheme == "dark") {
		themeStylesheet.href = "../Shared/css/blackTheme.css";
		localStorage.setItem('themeBlack',themeStylesheet.href)
	}
	else {
		themeStylesheet.href = "../Shared/css/style.css";
		localStorage.setItem('themeBlack',themeStylesheet.href)
	}
});
