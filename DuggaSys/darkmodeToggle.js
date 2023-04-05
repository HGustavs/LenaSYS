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
/**
 * @description toggles the border of all elements to white/gray depending on current border color.
 */
function toggleBorderOfElements() {
	let allTexts = document.getElementsByClassName('text');
	for (let i = 0; i < allTexts.length; i++) {
		let text = allTexts[i];
		//if the element has a stroke which has the color #383737: set it to white.
		if (text.getAttribute('stroke') == '#383737') {
			text.setAttribute('stroke', '#ffffff')
		}
		else if (text.getAttribute('stroke') == '#ffffff') {
			text.setAttribute('stroke', '#383737')
		}
	}
}
