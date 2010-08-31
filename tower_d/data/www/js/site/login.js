/*===========================================================================

    EoA Login

=============================================================================*/
/*Global variables are set in the views_javascript file*/

/*===========================================================================

  On DOMReady Events

=============================================================================*/
window.addEvent('domready', function(){ 
    /* ===================================
     * Login Elements
     * ---------------
     * Account Bar
     * ===================================*/
    //Login Submit Button
    if($('login_button_login')){
        $('login_button_login').addEvent('click', function(e){
            //Don't close the popup window if it is open
            e.stop();
    
            //Toggle the popup window
            toggle_popup_window();
            //Set the popup window title
            $('site_popup_title').set('html', 'Login');
            $('popup_login_wrapper').setStyle('display', 'block');
            $('popup_login_wrapper').setStyle('opacity', 1);
        });
    }

    /* ===================================
     *
     * Popup Login Window
     *
     * ===================================*/
    //Password
    if($('login_password_placeholder')){
        $('login_password_placeholder').addEvent('click', function(evt){
            update_login_password();
        });
        $('login_password_placeholder').addEvent('focus', function(evt){
            update_login_password();
        });
    }
    //Username
    if($('login_username')){
        $('login_username').addEvent('click', function(evt){
            if($('login_username').get('value') == 'Username'){
                $('login_username').set('value', '');
                $('login_username').setStyle('font-variant', 'normal');
            }
        });
        $('login_username').addEvent('focus', function(evt){
            if($('login_username').get('value') == 'Username'){
                $('login_username').set('value', '');
                $('login_username').setStyle('font-variant', 'normal');
            }
        });
    }
    
    //Login button
    if($('popup_login_button_login')){
        //Add event to submit login credientals to server on login button click
        $('popup_login_button_login').addEvent('click', function(e){
            //Make a request to the login page
            var req = new Request({
                url: url_root + url_account_login,
                data: 'username=' + $('login_username').value + 
                        '&password=' + $('login_password').value,
                method: 'post',

                //Correct username / pw
                onSuccess: function(res){
                    //Show the wrapper
                    $('login_log').setStyle('display', 'block');
                    
                    //Add the success class
                    $('login_log').removeClass('notification_error');
                    $('login_log').addClass('notification_success');
                    
                    //Show the log
                    $('login_log').fade(1);

                    //Set the HTML
                    $('login_log').innerHTML = "Redirecting...";

                    //Reload page
                    window.location.reload();
                },
                
                //Wrong username / pw
                onFailure: function(res){
                    //Show the wrapper
                    $('login_log').setStyle('display', 'block');
                    $('login_log').addClass('notification_error');
                    //Show the log
                    $('login_log').fade(1);

                    //Set the HTML
                    $('login_log').innerHTML = "Invalid username or password";

                    //Show alert
                    if(SITE_ROAR_ENABLED == true){
                        roar_object.alert('Invalid login details', 'Unable to login');
                    }
                }
            }).send();
        });
    }
});
/*===========================================================================

    Functions 

=============================================================================*/
function update_login_password(){
        $('login_password_placeholder').fade(0);
        $('login_password_placeholder').setStyle('display', 'none');
        $('login_password').setStyle('display', 'block');
        $('login_password').setStyle('opacity',1);
        $('login_password').focus();
}
