// Jquery Document



$(document).scroll(function(){
	
	if ($(this).scrollTop() >= 1) {
		
		$('.rightDropdownMenu').css('z-index', '0');
	}
	else {
        $('.rightDropdownMenu').css('z-index', '5001');
    }
	
}); 