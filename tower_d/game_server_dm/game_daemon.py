"""==========================================================================
                                                                                                       
game_daemon.py

handles the game running on the server backend.  This is an event driven
process, it will handle communicate with the web server to push and receive
updates.

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
def run_world(game_id):
    '''run_world(game_id)
    Main function to control and run the game.''' 
    print 'Game ID: %s | In run world' % (game_id)
    while True:
        '''Main game loop'''
'''========================================================================

Init

==========================================================================='''
if __name__ == '__main__':
    #If an ID was passed in, use it and load
    game_id = sys.argv[1]
    #Call load game
    run_world(game_id)
