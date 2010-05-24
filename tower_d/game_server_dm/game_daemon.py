"""==========================================================================
                                                                                                       
game_daemon.py

Handles the game running on the server backend.  This is an event driven
process, it will handle communicate with the web server to push and receive
updates.

============================================================================="""
"""----------------------------------------
Imports
-------------------------------------------"""
import sys
#Import game libraries
from library.custom_exceptions import *
from library.Cell import *
from library.Map import *
from library.Tower import *
from library.Player import *

'''========================================================================

Functions

==========================================================================='''
#TODO: This
def run_world(game_id):
    '''run_world(game_id)
    Main function to control and run the game.''' 
    print 'Game ID: %s | In run world' % (game_id)

    '''Initialize World
    -------------------------------------'''
    print 'Creating map and cells...'
    map = Map()

    '''Initialize World
    -------------------------------------'''
    #TODO: GET DATA FROM DB

    #Set up the players.  Keep track of a list called players which contains
    #   the player objects
    print 'Creating players...'
    players = []
    #Use a dummy player
    players.append(Player())

    '''Game Loop
    -------------------------------------'''
    print '\n\nEntering game loop...'
    a = 0
    while True:
        '''Main game loop'''
        a += 1
        if a >= 999999:
            print players[0]
            a = 0
'''========================================================================

Init

==========================================================================='''
if __name__ == '__main__':
    #If an ID was passed in, use it and load
    game_id = sys.argv[1]
    #Call load game
    run_world(game_id)
