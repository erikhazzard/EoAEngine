/*===========================================================================

    EoA Register 

=============================================================================*/
/*Global variables are set in the views_javascript file*/

/*===========================================================================

  On DOMReady Events

=============================================================================*/
window.addEvent('domready', function(){ 
    /* ===================================
     * Register Elements
     * ---------------
     * Account Bar
     * ===================================*/
    //Register Submit Button
    if($('register_button')){
        $('register_button').addEvent('click', function(e){
            //Don't close the popup window if it is open
            e.stop();
    
            //Toggle the popup window
            toggle_popup_window();
                //Set the popup window title
                $('site_popup_title').set('html', 'Register');
            $('popup_register_wrapper').setStyle('display', 'block');
            $('popup_register_wrapper').setStyle('opacity', 1);
        });
    }

    /* ===================================
     * Register button 
     * ===================================*/
    //Register Submit Button
    if($('register_submit')){
        $('register_submit').addEvent('click', function(){
            /*Make a request to the login page*/
            var req = new Request({
                url: url_root + url_account_register,
                data: 'username=' + $('register_username').value + 
                        '&email=' + $('register_email').value + 
                        '&color=' + $('register_color').value + 
                        '&password=' + $('register_password').value,
                method: 'post',

                //Correct username / pw
                onSuccess: function(res){
                    //Update the login wrapper to let them know they've logged in
                    //  this should just call a function to load a new page here
                    var register_uname =  $('register_username').value;
                    var register_pw =  $('register_password').value;
                    $('register_wrapper').innerHTML = "Account created! " + res +
                                "<br />" + "Log in above";
                    $('register_wrapper').highlight('#22aa22');
                    
                    //Send a request to log the user in
                    //This should probably be handled better ><
                    var login_register_req = new Request({
                        url: url_root + url_account_login,
                        data: 'username=' + register_uname + 
                            '&password=' + register_pw,
                        method:'post',
                        onSuccess: function(res){
                            window.location= url_root + url_index;
                        }
                    }).send();
                },
                
                //Wrong username / pw
                onFailure: function(res){
                    $('register_error_message').innerHTML = "<br />" + 
                                                    "Username already exists";
                    $('register_wrapper').highlight('#aa2222');
                }
            }).send();
        });
    }
    
});
/*===========================================================================

    Functions 

=============================================================================*/
