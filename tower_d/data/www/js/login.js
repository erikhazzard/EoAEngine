/*===========================================================================

    EoA Login

=============================================================================*/
/*Global variables are set in the views_javascript file*/

/*===========================================================================

  On DOMReady Events

=============================================================================*/
window.addEvent('domready', function(){
    /* ===================================
     * Login elements
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
            }
        });
        $('login_username').addEvent('focus', function(evt){
            if($('login_username').get('value') == 'Username'){
                $('login_username').set('value', '');
            }
        });
    }
    //Login Submit Button
    if($('login_submit')){
        $('login_submit').addEvent('click', function(){
            /*Make a request to the login page*/
            var req = new Request({
                url: url_root + url_account_login,
                data: 'username=' + $('login_username').value + 
                        '&password=' + $('login_password').value,
                method: 'post',

                //Correct username / pw
                onSuccess: function(res){
                    $('login_wrapper').highlight('#22aa22');
                    $('login_log').innerHTML = "Redirecting...";
                    window.location = url_root + url_game;
                },
                
                //Wrong username / pw
                onFailure: function(res){
                    $('login_log').innerHTML = "Invalid username or password";
                    $('login_wrapper').highlight('#aa2222');
                }
            }).send();
        });
    }

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
function update_login_password(){
        $('login_password_placeholder').fade(0);
        $('login_password').setStyle('opacity',1);
        $('login_password').focus();
}
