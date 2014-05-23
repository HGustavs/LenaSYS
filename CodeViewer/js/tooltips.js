// IIFE to ensure safe use of $

(function( $ ) {

// Create plugin
    $.fn.tooltips = function(el) {

        var $tooltip,
            $body = $('body'),
            $el;

        // Ensure chaining works
        return this.each(function(i, el) {

            $el = $(el).attr("data-tooltip", i);

            //Used to determine space above object
            var scrollTop     = $(window).scrollTop(),
                elementOffsetTop = $($el).offset().top,
                distanceTop      = (elementOffsetTop - scrollTop);



            // Make DIV and append to page. Different class depending on available room above the object.
            if (distanceTop < 25) {

                var $tooltip = $('<div class="tooltip" data-tooltip="' + i + '">' + $el.attr('title') + '<div class="arrow2"></div></div>').appendTo("body");
            }

            else {
                var $tooltip = $('<div class="tooltip" data-tooltip="' + i + '">' + $el.attr('title') + '<div class="arrow"></div></div>').appendTo("body");
            }


            $el
                // Get rid of yellow box popup
                .removeAttr("title")

                // Mouseenter
                .hover(function() {

                    $el = $(this);
                    var scrollTop     = $(window).scrollTop(),
                        elementOffsetTop = $($el).offset().top,
                        elementOffsetLeft = $($el).offset().left,
                        distanceTop      = (elementOffsetTop - scrollTop);



                    $tooltip = $('div[data-tooltip=' + $el.data('tooltip') + ']');
  				 
                    // Reposition tooltip, in case of page movement e.g. screen resize
                    var linkPosition = $el.offset();
                    //Collect the target objects height which is used to adjust the tooltips position
                    var targetHeight = $el.height();




                    // Show tooltip below object if there is no room above
                    if (distanceTop < 25 && elementOffsetLeft > ($tooltip.width()/2)) {

					
						// width of the target
						var twidth=parseInt($el.width());
						// position of the target
						var tpos=parseInt(linkPosition.left);
						// position of the tooltip
						var toolpos = parseInt(linkPosition.left - ($tooltip.width()/2));
						// width of arrow
						var awidth=$tooltip.children(".arrow2").width();
						
						// The targets middle position from left.
						var targetmid = tpos+(twidth/2);
						
						// makes the arrow centered by the target
						var arrowpos = targetmid-toolpos-(awidth/2);
					
						// Prevents the arrow to have a position which is bigger than the size of the tooltip
						if(toolpos+arrowpos+(awidth/2) > toolpos+$tooltip.width()){
							arrowpos=$tooltip.width()-(awidth/2);
						}
						// prevents the arrow to have a position which is smaller than the size of the tooltip
						if(toolpos+arrowpos+(awidth/2) < toolpos){
							arrowpos=-awidth/2+12.5;   // 12.5 to make room for the whole arrow
						}
						
                        $tooltip.css({
                            top: distanceTop + targetHeight + 15,
                            left: linkPosition.left - ($tooltip.width()/2)

                        });
						$tooltip.children(".arrow2").css({
                            left: arrowpos+3
                        });
                        // Adding class handles animation through CSS
                        $tooltip.addClass("active2");

                    }

                    // Show tooltip below object if there is no room above + align to the right if there's no space on the left side
                    else if (distanceTop < 25 && elementOffsetLeft < ($tooltip.width()/2)) {
						// width of the target
						var twidth=parseInt($el.width());
						// position of the target
						var tpos=parseInt(linkPosition.left);
						// position of the tooltip
						var toolpos = parseInt(linkPosition.left);
						// width of arrow
						var awidth=$tooltip.children(".arrow2").width();
						
						// The targets middle position from left.
						var targetmid = tpos+(twidth/2);
						
						// makes the arrow centered by the target
						var arrowpos = targetmid-toolpos-(awidth/2);
						
						// Prevents the arrow to have a position which is bigger than the size of the tooltip
						if(toolpos+arrowpos+(awidth/2) > toolpos+$tooltip.width()){
							arrowpos=$tooltip.width()-(awidth/2);
						}
						// prevents the arrow to have a position which is smaller than the size of the tooltip
						if(toolpos+arrowpos+(awidth/2) < toolpos){
							arrowpos=-awidth/2+12.5;   // 12.5 to make room for the whole arrow
						}
						
                        $tooltip.css({
                            top: distanceTop + targetHeight + 15,
                            left: linkPosition.left

                        });
						$tooltip.children(".arrow2").css({
                            left: arrowpos+3
                        });


                        // Adding class handles animation through CSS
                        $tooltip.addClass("active2");
                    }


                    // Show tooltip above object + align to the right if there's no space on the left side
                    else if (distanceTop > 25 && elementOffsetLeft < ($tooltip.width()/2)) {

                        //Change to correct arrow
                        $tooltip.children(".arrow2").removeClass("arrow2").addClass("arrow");

						// width of the target
						var twidth=parseInt($el.width());
						// position of the target
						var tpos=parseInt(linkPosition.left);
						// position of the tooltip
						var toolpos = parseInt(linkPosition.left);
						// width of arrow
						var awidth=$tooltip.children(".arrow").width();
						
						// The targets middle position from left.
						var targetmid = tpos+(twidth/2);
						
						// makes the arrow centered by the target
						var arrowpos = targetmid-toolpos-(awidth/2);
						
						
						// Prevents the arrow to have a position which is bigger than the size of the tooltip
						if(toolpos+arrowpos+(awidth/2) > toolpos+$tooltip.width()){
							arrowpos=$tooltip.width()-(awidth/2);
						}
						// prevents the arrow to have a position which is smaller than the size of the tooltip
						if(toolpos+arrowpos+(awidth/2) < toolpos){
							arrowpos=-awidth/2+12.5;   // 12.5 to make room for the whole arrow
						}
						
                        $tooltip.css({
                            top: distanceTop - ($tooltip.outerHeight() + 13),
                            left: linkPosition.left

                        });
						$tooltip.children(".arrow").css({
                            left: arrowpos+3
                        });
						
                        // Adding class handles animation through CSS
                        $tooltip.addClass("active2");

                    }
                    // Show tooltip above object
                    else {

                        //Change to correct arrow
                        $tooltip.children(".arrow2").removeClass("arrow2").addClass("arrow");
						
						// width of the target
						var twidth=parseInt($el.width());
						// position of the target
						var tpos=parseInt(linkPosition.left);
						// position of the tooltip
						var toolpos = parseInt(linkPosition.left - ($tooltip.width()/2));
						// width of arrow
						var awidth=$tooltip.children(".arrow").width();
						
						// The targets middle position from left.
						var targetmid = tpos+(twidth/2);
						// makes the arrow centered by the target
						var arrowpos = targetmid-toolpos-(awidth/2);
					
						// Prevents the arrow to have a position which is bigger than the size of the tooltip
						if(toolpos+arrowpos+(awidth/2) > toolpos+$tooltip.width()){
							arrowpos=$tooltip.width()-(awidth/2);
						}
						// prevents the arrow to have a position which is smaller than the size of the tooltip
						if(toolpos+arrowpos+(awidth/2) < toolpos){
							arrowpos=-awidth/2+12.5;   // 12.5 to make room for the whole arrow
						}
                        $tooltip.css({
                            top: distanceTop - ($tooltip.outerHeight() + 13),
                            left: linkPosition.left - ($tooltip.width()/2)
                        });
                        
                        $tooltip.children(".arrow").css({
                            left: arrowpos+3
                        });
                        
                        // Adding class handles animation through CSS
                        $tooltip.addClass("active");

                    }
                    // Mouseleave
                }, function() {
					
                    $el = $(this);

                    if (distanceTop < 25) {

                        // Temporary class for same-direction fadeout
                        $tooltip = $('div[data-tooltip=' + $el.data('tooltip') + ']').addClass("out2");


                    }

                    else {
                        // Temporary class for same-direction fadeout
                        $tooltip = $('div[data-tooltip=' + $el.data('tooltip') + ']').addClass("out");

                    }
					
                    // Remove all classes
                    setTimeout(function() {
                        $tooltip.removeClass("active").removeClass("active2").removeClass("out").removeClass("out2");
                    }, 300);


                });

        });

    }

})(jQuery);

/* Remove tooltips if mouse leaves window */ 
$(window).mouseout(function(e){
	var pageX = e.pageX || e.clientX,
        pageY = e.pageY || e.clientY;
    var w = window.innerWidth,
     	h = window.innerHeight; 
 // Remove tooltips if mouse leaves window in x-axis
    if(parseInt(pageX)>parseInt(w) || parseInt(pageX)<parseInt(0)){
     	 $(".active").removeClass("active");
         $(".active2").removeClass("active2");
	//	Remove tooltips if mouse leaves window in y-axis
     }else if(parseInt(pageY)>parseInt(h) || parseInt(pageY)<parseInt(0)){
     	 $(".active").removeClass("active");
         $(".active2").removeClass("active2");
     } 
});
