//----------------------------------------
// Dark mode toggle button listener.  
//----------------------------------------

/*/ The code below is waitng for the page to load, and check when the user changes his/her 
operative system to either black or white mode . /*/

const themeStylesheet = document.getElementById('themeBlack');

document.addEventListener('DOMContentLoaded', () => {
	const storedTheme = localStorage.getItem('themeBlack');
	if(storedTheme){
		themeStylesheet.href = storedTheme;
	}
	const themeToggle = document.getElementById('theme-toggle');
	themeToggle.addEventListener('click', () => {
    // if it's light -> go dark
    if(themeStylesheet.href.includes('blackTheme')){
      themeStylesheet.href = "../Shared/css/style.css";
      localStorage.setItem('themeBlack',themeStylesheet.href)
    } 
    else if(themeStylesheet.href.includes('style')) {
      // if it's dark -> go light
      themeStylesheet.href = "../Shared/css/blackTheme.css";
      localStorage.setItem('themeBlack',themeStylesheet.href)
    }		
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
//checks if the theme is black, if so, makes it so that all the elements have a white border.
function setElementsToDarkTheme() {
	let allElems = document.getElementsByClassName('element');
	for (var i = 0; i < allElems.length; i++) {
		let elem = allElems[i];
		console.log(elem[0][0]);
	}
	if (localStorage.getItem('themeBlack') == "../Shared/css/blackTheme.css") {
		
	}
}
