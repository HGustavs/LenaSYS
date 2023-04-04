//------------------------------------------------------------------------------
// Scroll to top of page function 
//------------------------------------------------------------------------------
$(document).ready(function(){
	$("#scrollUp").on('click', function(event) {
	  window.scrollTo(0, 0);
	});
});   
  
// Show the up-arrow when user has scrolled down 200 pixels on the page
window.onscroll = function() {scrollToTop()};
function scrollToTop() {
    var scroll = document.getElementById("fixedScroll");
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scroll.style.display = "block";
    } else {
        scroll.style.display = "none";
    }
}
