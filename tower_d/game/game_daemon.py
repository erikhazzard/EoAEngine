"""==========================================================================
                                                                                                       
run_world.py

handles the game running on the server backend

============================================================================="""
"""----------------------------------------
Imports
-------------------------------------------"""
import sys

'''========================================================================

Classes

==========================================================================='''
#TODO: Define game classes


'''========================================================================

Functions

==========================================================================='''
#TODO: This
def load_game(game_id):
    '''load_game(game_id)
    Takes in a game_id and sets up the game state based on the data in the DB
    '''
    print 'Game id: ', game_id
    run_world()

def run_world():
    '''run_world()
    After everything has been setup (if necessary), run the world'''
    
    print 'In run world'
'''========================================================================

Init

==========================================================================='''
if __name__ == '__main__':
    try:
        #If an ID was passed in, use it and load
        game_id = sys.argv[1]
        #Call load game
        load_game(game_id)
    except IndexError:
        #No system arguments passed in, directly call run_world
        run_world()
