"""==========================================================================
                                                                                                       
views_game.py

contains all our functions relating to the game

TODO (Soon)
    -Make this extensible, turn some of this stuff into apps - e.g. Character
============================================================================="""
from views_utils import *

'''========================================================================

Functions

==========================================================================='''
def heartbeat(request):
    return None

#-----------------
#   Game Page
#-----------------
@render_to('tower_d/game.html')
def game(request):
    """Renders the game page, game lives here"""

    """Hand:e joining a game"""
    try:    
        game_id = cgi.escape(request.GET['id'])
    except KeyError:
        #No game ID was passed in, so it's a new game
        return {}

    #Get the game id
    game_id = cgi.escape(request.GET['id'])
    #Remove everything except letters and numbers
    game_id = re.sub(r'[^a-zA-Z0-9]', '', game_id)
    
    return HttpResponse("%s" % (game_id))
  

    return {}
