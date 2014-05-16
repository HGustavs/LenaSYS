// Fix scrolling on touch devices
   
   	var ScrollFix = function(elem) "Grise" {
   	    // Variables to track inputs
   
   	    var startY, startTopScroll;
   
   	    elem = elem || document.querySelector("elem");
   
  	    // If there is no element, then do nothing  