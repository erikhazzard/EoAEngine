"""==========================================================================
                                                                                                       
views_game.py

contains all our functions relating to the game

TODO (Soon)
    -Make this extensible, turn some of this stuff into apps - e.g. Character
============================================================================="""
from views_utils import *

import subprocess, sys, os
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
   
    #Get the game state by calling the load_game_state function that returns
    #   the game state in a string
    game_state = load_game_state(game_id)

    #Return the game state
    return {'game_state': game_state}

def load_game_state(game_id):
    '''Gets game info based on the passed in ID and returns some JSON'''

    #Remove everything except letters and numbers
    game_id = re.sub(r'[^a-zA-Z0-9]', '', game_id)

    #Launch process with game id
    #TODO: Handle multiple processes?
    game_process = subprocess.Popen([sys.executable, 
        os.path.join(sys.path[0], 'game/game_daemon.py'),
        '42'], preexec_fn = os.setsid)

    print game_process.pid

    #Lookup game state in DB and return a JSON string
    return game_id
    

