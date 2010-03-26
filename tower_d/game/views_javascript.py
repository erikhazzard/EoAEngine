"""==========================================================================
views_javascript.py

contains all our dynamic javascript returns
============================================================================="""
from views_utils import *

'''===========================================================================

Javascript Pages
----------------

Some Javascript files need to be have some 'dynamicness' about them.  For
example, the main config file that defines where the root URL is will vary
based on what computer the server is running on.  We'll generate the JS
files and return them here.  There may other uses as well, such as generating
JS for individual clients for whatever reason
============================================================================'''

def generate_config(request):
    """Generate some configuration settings and return them as a JS file"""

    #Set up some variables we'll stuff into the response string
    #   EOA_ROOT_URL is set as the root url the browser receives
    root_url = settings.TOWER_D_ROOT_URL
    
    #More config stuff goes here...
    
    #Write the JS config
    res = """
    /* =======================================================================
                    EoA Game Engine Tower Defense JS Config

    -Contains global variables / objects and global configuration settings

    ========================================================================*/
    /*-----------------------------------------
    *           URLS
    *------------------------------------------*/
    //Root URL
    var url_root = '%(root_url)s';

    //Base pages
    var url_index = '%(url_index)s';
    var url_game = '%(url_game)s';
    var url_login = '%(url_login)s';

    //Account related URLs
    var url_account_login = '%(url_account_login)s';
    var url_account_logout = '%(url_account_logout)s';
    var url_account_register = '%(url_account_register)s';

    //Chat Functions
    var url_chat_heartbeat = '%(url_chat_heartbeat)s';
    var url_chat_send_message = '%(url_chat_send_message)s';

    //Game Functions
    var url_game_heartbeat = '%(url_game_heartbeat)s';

    //Character Functions
    var url_character_info = '%(url_character_info)s';
    var url_character_move = '%(url_character_move)s';

    """

    #Build values to insert in the response
    values = {'root_url':root_url,
            #Base page related
            'url_index':'index/',
            'url_game':'game/',
            'url_login':'login/',
            #Account Related
            'url_account_login': 'account/login/',
            'url_account_logout': 'account/logout/',
            'url_account_register': 'account/register/',
            #Chat Related
            'url_chat_heartbeat': 'chat/heartbeat/',
            'url_chat_send_message': 'chat/send_message/',
            #Game Functions
            'url_game_heartbeat': 'game/heartbeat/', 
            #Character Functions
            'url_character_info': 'character/get/info/',
            'url_character_move': 'character/action/move/',
        }

    #Build the response string with the values
    res = res % values

    #Return the response as javascript file using mimetype
    return HttpResponse(res, mimetype='text/javascript')
