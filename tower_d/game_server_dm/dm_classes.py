'''==========================================================================
                                                                                                       
game_dm_classes.py

Library classes for the game DM
============================================================================='''
'''----------------------------------------
Imports
-------------------------------------------'''
import sys

'''========================================================================

Classes

==========================================================================='''
'''----------------------------------------
Tower
-------------------------------------------'''
class Tower(Object):
   #Class variables
    towers_created = 0

    def __init__(self, player_id):
        '''Update class variables'''
        Tower.towers_created += 1

        '''Initalize object variables'''
        #Tower ID
        id = Tower.towers_created

        #ID of owner     
        player_id = 0

        #Positions
        pos_x = 0
        pos_y = 0

        #How many cells needed for both x and y 
        #   e.g. 2 would mean it really takes up 4 cells (2x + 2y = 4)
        cell_size_xy = 1

        #Base attributes
        base_damage = 1
        base_delay = 1000
        base_range = 3

        #current attributes
        damage = 1
        delay = 1000
        range = 3

        #attribute levels
        level_damage = 0
        level_delay = 0
        level_range = 0

        #Bullet speed
        bullet_speed = 500

        #Creeps tower has killed
        creeps_killed = 0

        #Elemental values
        elemental_effects = {'dark': {'tick_delay': 1000,
                                        'tick_damage': 0,
                                        'tick_number': 0
                                    },
                            'earth': {'slow_amount': 0,
                                        'slow_duration': 0
                                    },
                            'wind': {'stun_chance': 0,
                                    'stun_duration': 0}}

        #Active Effects
        #--------------------------------

        #Gold value of tower
        value = 0

        #Timers
        #--------------------------------
        attack_timer = 0
       
        #Objects in range of tower
        #--------------------------------
        cells_in_range = {}
        creep_aggro_array = {}


