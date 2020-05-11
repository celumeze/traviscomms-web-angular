;(function () {
	
	'use strict';


    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'slow');
        return this; // for chaining...
    }
    $.fn.goToTrial = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'slow');
        $('#trialSubId-input').click();
        $('#paidSubId-input').click();
        return this; // for chaining...
        
    }
    $.fn.goToPaid = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'slow');
        $('#paidSubId-input').click();
        $('#trialSubId-input').click();
        return this; // for chaining...
    }
}());