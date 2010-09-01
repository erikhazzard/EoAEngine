/*===========================================================================

  End of Ages Game Main JS file

  This file is used sitewide

=============================================================================*/
/*================================
 * Setup global objects 
 * ===============================*/
var Tool_Tips = {}; 
var roar_object= {};

var popup_site_click_func = {};
var popup_site_close_key_func = {};

/*===========================================================================

  Event extentions 

=============================================================================*/
Element.Events.escape_key= {
    base: 'keydown', //we set a base type
    condition: function(event){ //and a function to perform additional checks.
        return (event.key == 'esc'); //this means the event is free to fire
    }
};
/*===========================================================================

  Functions 

=============================================================================*/
/* ==========================================================================
 * Popup Related
 * ==========================================================================*/
/* --------------------------------------
 * Setup popup window
 * --------------------------------------*/
function setup_popup(){
    //Close the popup when the X is clicked
    $('site_popup_close_button_wrapper').addEvent('click', function(e){
        toggle_popup_window();
    });

    //Dont close the popup if anything in the content is clicked
    $('site_popup_content_wrapper').addEvent('click', function(e){
        e.stop();
    });

}
//Function that will close the popup window if the site is clicked on
popup_site_click_func = function(){
    toggle_popup_window();
}
//Escape key event to close window
popup_site_close_key_func = function(){
    toggle_popup_window();
}

/* --------------------------------------
 * Open / close popup window
 * --------------------------------------*/
function toggle_popup_window(){
    //CLOSE window
    //see if the popup window is open.  If so, close it
    if($('site_popup_window').getStyle('opacity') === 1){
        //Remove click function from site wrapper
        $('site_wrapper').removeEvent('click', popup_site_click_func);

        //Fade out popup window (Slow(
        //$('site_popup_window').fade(0);
        $('site_popup_window').setStyle('display', 'none');
        $('site_popup_window').setStyle('opacity', 0);

        //Fade the site wrapper (A bit slow, especially when game in progress)
        //$('site_wrapper').fade(1);
        $('site_wrapper').setStyle('opacity', 1);
        $('site_wrapper').setStyle('cursor', 'normal');

        //Add escape key event
        window.removeEvent('escape_key', popup_site_close_key_func); 
        
    }
    //OPEN window
    else if($('site_popup_window').getStyle('opacity') === 0){
        //Add event that closes popup window on site click
        $('site_wrapper').addEvent('click', popup_site_click_func);

        //Fade in popup window
        $('site_popup_window').setStyle('display', 'block');
        $('site_popup_window').setStyle('opacity', 1);
        //Fade the site wrapper
        $('site_wrapper').setStyle('opacity', .4);
        $('site_wrapper').setStyle('cursor', 'pointer');

        //Remove escape key event
        window.addEvent('escape_key', popup_site_close_key_func); 
    }
}

/* --------------------------------------
 * Hide popup windows
 * --------------------------------------*/
function hide_popup_windows(){
    var popup_wrappers = $$('.popup_window_item');
    for(var i=popup_wrappers.length-1; i>=0; i--){
        popup_wrappers[i].setStyle('display', 'none');
        popup_wrappers[i].setStyle('opacity', 0);
    }
}
/*===========================================================================

  on domready events

=============================================================================*/
window.addEvent('domready', function(){
    /*================================
     *  Hide all hidden elements 
     * ===============================*/
    $$('.hidden_element').setStyle('opacity',0);
    
    //Add Tool Tips
    Tool_Tips = new Tips($$('.tool_tip'),{
            className: 'tool_tip_custom',
            fixed: true
    });
    
    //Set up Roar
    roar_object = new Roar({
        position: 'bottomRight'
    });

    //Setup popup window
    setup_popup();

});
