Custom progress bar that updates as images are downloaded

var pictures = [
                    "1.jgp",
                    "2.jpg"
                ];

var loadedSoFar = 0;

function loaded( ) {
    // do stuff
}

function updateProgress( ) {

    loadedSoFar++;

    var newWidth = $("#progress").width() * ( loadedSoFar / pictures.length );
    $("#bar").stop( true, true );
    $("#bar").animate({ width: newWidth }, 500, function( ) {
        if( loadedSoFar === pictures.length ) { loaded() }
    });
}

for( var i = 0; i < pictures.length; i++ ) {
    var img = new Image();
    img.src = pictures[ i ] + i;

    img.onload = function( ) {
        updateProgress();
    }
}



/********************************************************************************


Perishable Press
WordPress, Web Design, Code & Tutorials

    WordPress
    Security
    SEO
    CSS
    PHP
    HTML
    JavaScript
    .htaccess

3 Ways to Preload Images with CSS, JavaScript, or Ajax

By Jeff Starr on December 28, 2009 • 41 Comments »

Preloading images is a great way to improve the user experience. When images are preloaded in the browser, the visitor can surf around your site and enjoy extremely faster loading times. This is especially beneficial for photo galleries and other image-heavy sites where you want to deliver the goods as quickly and seamlessly as possible. Preloading images definitely helps users without broadband enjoy a better experience when viewing your content. In this article, we’ll explore three different preloading techniques to enhance the performance and usability of your site.
Method 1: Preloading with CSS and JavaScript

There are many ways to preload images, including methods that rely on CSS, JavaScript, and various combinations thereof. As one of my favorite topics here at Perishable Press, I have covered image preloading numerous times:

    Better Image Caching with CSS
    A Way to Preload Images without JavaScript that is SO Much Better
    Pure CSS: Better Image Preloading without JavaScript
    CSS Throwdown: Preload Images without JavaScript
    Preloading Images with CSS and JavaScript

Each of these techniques sort of builds on previous methods and remains quite effective and suitable for a variety of design scenarios. Thankfully, readers always seem to chime in on these posts with suggestions and improvements. Recently, Ian Dunn posted an article that improves upon my Better Image Preloading without JavaScript method.

With that method, images are easily and effectively preloaded using the following CSS:

#preload-01 { background: url(http://domain.tld/image-01.png) no-repeat -9999px -9999px; }
#preload-02 { background: url(http://domain.tld/image-02.png) no-repeat -9999px -9999px; }
#preload-03 { background: url(http://domain.tld/image-03.png) no-repeat -9999px -9999px; }

By strategically applying preload IDs to existing (X)HTML elements, we can use CSS’ background property to preload select images off-screen in the background. Then, as long as the paths to these images remains the same when they are referred to elsewhere in the web page, the browser will use the preloaded/cached images when rendering the page. Simple, effective, and no JavaScript required.

As effective as this method is, however, there is room for improvement. As Ian points out, images that are preloaded using this method will be loaded along with the other page contents, thereby increasing overall loading time for the page. To resolve this issue, we can use a little bit of JavaScript to delay the preloading until after the page has finished loading. This is easily accomplished by applying the CSS background properties using Simon Willison’s addLoadEvent() (404 link removed 2012/10/18) script:

// better image preloading @ http://perishablepress.com/press/2009/12/28/3-ways-preload-images-css-javascript-ajax/
function preloader() {
	if (document.getElementById) {
		document.getElementById("preload-01").style.background = "url(http://domain.tld/image-01.png) no-repeat -9999px -9999px";
		document.getElementById("preload-02").style.background = "url(http://domain.tld/image-02.png) no-repeat -9999px -9999px";
		document.getElementById("preload-03").style.background = "url(http://domain.tld/image-03.png) no-repeat -9999px -9999px";
	}
}
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}
}
addLoadEvent(preloader);

In the first part of this script, we are setting up the actual preloading by targeting specific preload elements with background styles that call the various images. Thus, to use this method, you will need to replace the “preload-01”, “preload-02”, “preload-03”, etc., with the IDs that you will be targeting in your markup. Also, for each of the background properties, you will need to replace the “image-01.png”, “image-02.png”, “image-03.png”, etc., with the path and name of your image files. No other editing is required for this technique to work.

Then, in the second part of the script, we are using the addLoadEvent() function to delay execution of our preloader() function until after the page has loaded.

SO what happens when JavaScript is not available on the user’s browser? Quite simply, the images will not be preloaded and will load as normal when called in the web page. This is exactly the sort of unobtrusive, gracefully degrading JavaScript that we really like :)
Method 2: Preloading with JavaScript Only

As effective as the previous method happens to be, I generally find it to be too tedious and time-consuming to actually implement. Instead, I generally prefer to preload images using a straight-up slice of JavaScript. Here are a couple of JavaScript-only preloading methods that work beautifully in virtually every modern browser..
JavaScript Method #1

Unobtrusive, gracefully degrading, and easy to implement, simply edit/add the image paths/names as needed — no other editing required:

<div class="hidden">
	<script type="text/javascript">
		<!--//--><![CDATA[//><!--
			var images = new Array()
			function preload() {
				for (i = 0; i < preload.arguments.length; i++) {
					images[i] = new Image()
					images[i].src = preload.arguments[i]
				}
			}
			preload(
				"http://domain.tld/gallery/image-001.jpg",
				"http://domain.tld/gallery/image-002.jpg",
				"http://domain.tld/gallery/image-003.jpg"
			)
		//--><!]]>
	</script>
</div>

This method is especially convenient for preloading large numbers of images. On one of my gallery sites, I use this technique to preload almost 50 images. By including this script on the login page as well as internal money pages, most of the gallery images are preloaded by the time the user enters their login credentials. Nice.
JavaScript Method #2

Here’s another similar method that uses unobtrusive JavaScript to preload any number of images. Simply include the following script into any of your web pages and edit according to the proceeding instructions:

<div class="hidden">
	<script type="text/javascript">
		<!--//--><![CDATA[//><!--

			if (document.images) {
				img1 = new Image();
				img2 = new Image();
				img3 = new Image();

				img1.src = "http://domain.tld/path/to/image-001.gif";
				img2.src = "http://domain.tld/path/to/image-002.gif";
				img3.src = "http://domain.tld/path/to/image-003.gif";
			}

		//--><!]]>
	</script>
</div>

As you can see, each preloaded image requires a variable definition, “img1 = new Image();”, as well as a source declaration, “img3.src = "../path/to/image-003.gif";”. By replicating the pattern, you can preload as many images as necessary. Hopefully this is clear — if not, please leave a comment and someone will try to help you out.

We can even improve this method a bit by delaying preloading until after the page loads. To do this, we simply wrap the script in a function and use addLoadEvent() to make it work:

function preloader() {
	if (document.images) {
		var img1 = new Image();
		var img2 = new Image();
		var img3 = new Image();

		img1.src = "http://domain.tld/path/to/image-001.gif";
		img2.src = "http://domain.tld/path/to/image-002.gif";
		img3.src = "http://domain.tld/path/to/image-003.gif";
	}
}
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}
}
addLoadEvent(preloader);

Ahhh, the joys of JavaScript!
Method 3: Preloading with Ajax

As if all of that weren’t cool enough, here is a way to preload images using Ajax. This method was discovered at Of Geeks and letters, and uses the DOM to preload not only images, but CSS, JavaScript, and just about anything else. The main benefit of using Ajax over straight JavaScript is that JavaScript and CSS files can be preloaded without their contents affecting the current page. For images this is not really an issue, but the method is clean and effective nonetheless.

window.onload = function() {
	setTimeout(function() {
		// XHR to request a JS and a CSS
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://domain.tld/preload.js');
		xhr.send('');
		xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://domain.tld/preload.css');
		xhr.send('');
		// preload image
		new Image().src = "http://domain.tld/preload.png";
	}, 1000);
};

As is, this code will preload three files: “preload.js”, “preload.css”, and “preload.png”. A timeout of 1000ms is also set to prevent the script from hanging and causing issues with normal page functionality.

To wrap things up, let’s look at how this preloading session would look written in plain JavaScript:

window.onload = function() {

	setTimeout(function() {

		// reference to <head>
		var head = document.getElementsByTagName('head')[0];

		// a new CSS
		var css = document.createElement('link');
		css.type = "text/css";
		css.rel  = "stylesheet";
		css.href = "http://domain.tld/preload.css";

		// a new JS
		var js  = document.createElement("script");
		js.type = "text/javascript";
		js.src  = "http://domain.tld/preload.js";

		// preload JS and CSS
		head.appendChild(css);
		head.appendChild(js);

		// preload image
		new Image().src = "http://domain.tld/preload.png";

	}, 1000);

};

Here we are preloading our three files upon page load by creating three elements via the DOM. As mentioned in the original article, this method is inferior to the Ajax method in cases where the preloaded file contents should not be applied to the loading page.
Know some triks?

I love these preloading tricks so much, I could just squeeze something. If you know of any good preloading tricks, including any improvements to the techniques shared here, kick start my heart with your wise words of preloading wisdom ;)

*********************************************************************************/