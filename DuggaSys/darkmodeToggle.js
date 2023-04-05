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
	console.log("called");
	let allTexts = document.getElementsByClassName('text');
	let cssUrl = localStorage.getItem('themeBlack');
	//.../Shared/css/style.css -> style.css
	cssUrl = cssUrl.split("/").pop();
	console.log(cssUrl);
	if(cssUrl.href == "blackTheme.css"){
		for (let i = 0; i < allTexts.length; i++) {
			let text = allTexts[i];
			let strokeColor = text.getAttribute('stroke');
			//if the element has a stroke which has the color #383737: set it to white.
			//this is because we dont want to affect the strokes that are null or other colors.
			if (strokeColor == '#383737') {
				strokeColor = '#ffffff';
				text.setAttribute('stroke', strokeColor);
			}	
		}
	}
	//if the theme isnt darkmode, make the stroke gray.
	else{
		for (let i = 0; i < allTexts.length; i++) {
			let text = allTexts[i];
			let strokeColor = text.getAttribute('stroke');
			if (strokeColor == '#ffffff') {
				strokeColor = '#383737';
				text.setAttribute('stroke', strokeColor);
			}
		}
	}
}
