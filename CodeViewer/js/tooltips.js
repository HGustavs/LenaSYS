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
  						
  						// Remove all classes so the tooltip wont duplicate when mouse leaves window of the browser
                        $(".active").removeClass("active");
                        $(".active2").removeClass("active2");
                        $(".out").removeClass("out");
                        $(".out2").removeClass("out2");
                        
                    // Reposition tooltip, in case of page movement e.g. screen resize
                    var linkPosition = $el.offset();



                    //Collect the target objects height which is used to adjust the tooltips position
                    var targetHeight = $el.height();




                    // Show tooltip below object if there is no room above
                    if (distanceTop < 25 && elementOffsetLeft > ($tooltip.width()/2)) {



                        $tooltip.css({
                            top: distanceTop + targetHeight + 15,
                            left: linkPosition.left - ($tooltip.width()/2)

                        });

                        // Adding class handles animation through CSS
                        $tooltip.addClass("active2");
                    }

                    // Show tooltip below object if there is no room above + align to the right if there's no space on the left side
                    else if (distanceTop < 25 && elementOffsetLeft < ($tooltip.width()/2)) {



                        $tooltip.css({
                            top: distanceTop + targetHeight + 15,
                            left: linkPosition.left

                        });



                        // Adding class handles animation through CSS
                        $tooltip.addClass("active2");

                    }


                    // Show tooltip above object + align to the right if there's no space on the left side
                    else if (distanceTop > 25 && elementOffsetLeft < ($tooltip.width()/2)) {

                        //Change to correct arrow
                        $tooltip.children(".arrow2").removeClass("arrow2").addClass("arrow");

                        $tooltip.css({
                            top: distanceTop - ($tooltip.outerHeight() + 13),
                            left: linkPosition.left

                        });

                        // Adding class handles animation through CSS
                        $tooltip.addClass("active2");

                    }
                    // Show tooltip above object
                    else {

                        //Change to correct arrow
                        $tooltip.children(".arrow2").removeClass("arrow2").addClass("arrow");


                        $tooltip.css({
                            top: distanceTop - ($tooltip.outerHeight() + 13),
                            left: linkPosition.left - ($tooltip.width()/2)
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

