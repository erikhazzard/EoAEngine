'''==========================================================================
                                                                                                       
Tower.py

Tower class for the game DM
============================================================================='''
from custom_exceptions import *

'''========================================================================

Tower

==========================================================================='''
class Tower(object):
   #Class variables
    towers_created = 0

    def __init__(self, player_id = 0):
        '''Update class variables'''
        Tower.towers_created += 1

        '''Initalize object variables'''
        #Tower ID
        self.id = Tower.towers_created

        #ID of owner     
        self.player_id = player_id

        #Positions
        self.pos_x = 0
        self.pos_y = 0

        #How many cells needed for both x and y 
        #   e.g. 2 would mean it really takes up 4 cells (2x + 2y = 4)
        self.cell_size_xy = 1

        #Base attributes
        self.base_damage = 1
        self.base_delay = 1000
        self.base_range = 3

        #current attributes
        self.damage = 1
        self.delay = 1000
        self.range = 3

        self.attributes = { 
            'damage': {'value': 1,
                        'level': 1,
                        'modifier': 1.3},
            'delay': {'value': 1000,
                        'level': 1,
                        'modifier': 1.3},
            'range': {'value': 3,
                        'level': 1,
                        'modifier': 3.1},
            'elemental_dark': {'value': 0,
                        'level': 0,
                        'modifier': 1.5},
            'elemental_earth': {'value': 0,
                        'level': 0,
                        'modifier': 1.5},
            'elemental_fire': {'value': 0,
                        'level': 0,
                        'modifier': 1.5},
            'elemental_light': {'value': 0,
                        'level': 0,
                        'modifier': 1.5},
            'elemental_water': {'value': 0,
                        'level': 0,
                        'modifier': 1.5},
            'elemental_wind': {'value': 0,
                        'level': 0,
                        'modifier': 1.5}
        }
        
        #Bullet speed
        self.bullet_speed = 500

        #Creeps tower has killed
        self.creeps_killed = 0

        #Active Effects
        #--------------------------------

        #Elemental Buffs
        #--------------------------------
        self.elemental_effects = {'dark': {'tick_delay': 1000,
                                        'tick_damage': 0,
                                        'tick_number': 0
                                    },
                            'earth': {'slow_amount': 0,
                                        'slow_duration': 0
                                    },
                            'wind': {'stun_chance': 0,
                                    'stun_duration': 0}}

        #Gold value of tower
        self.value = 0
    
        #Base cost of tower, 10 by default
        self.tower_base_cost = 10

        #Timers
        #--------------------------------
        self.attack_timer = 0
       
        #Objects in range of tower
        #--------------------------------
        #Cells in the radius of the tower (may not be necessary)
        self.cells_in_range = {}
        
        #The creep aggro list, which is a priority list of creeps the tower 
        #  wants to attack.  When a creep enters the tower radius, it is
        #  pushed to this list. When it leaves, it is removed
        self.creep_aggro_array = {}

    '''Upgrade Related Methods
    -------------------------------------'''
    def calc_upgrade_cost(self, type):
        '''calc_upgrade_cost
        Returns an integer of the upgrade cost for a particlar type
            based on the type's level (type = e.g. damage)
        '''
        #Get the level of the type passed in (e.g. damage)
        level = self.attributes[type]['level']

        #Get the modifier value
        cost_modifier = self.attributes[type]['level']

        #Calculate cost
        cost = int(self.tower_base_cost + round(cost_modifier ** level))

        return cost


    def upgrade(self, type, player_gold=False):
        '''upgrade
        Upgrades a tower based on thet type passed in.  Possible types are
            -damage
            -delay
            -range
            -elemental_X (where X is one of the elementals)
        '''
            #   passed in

        #Tower is updated regardless of player gold
        #--------------------------------
        if player_gold is False:
            #Upgrade the type
            self.attributes[type]['level'] += 1

            #We're done here
            return

        #Player updates tower
        #--------------------------------
        #Calculate the cost based on the type
        cost = self.calc_upgrade_cost(type)

        if cost <= player_gold:
            #Upgrade the type
            self.attributes[type]['level'] += 1

            #Return the cost
            return cost

        else:
            #Player does not have enough money
            raise MoneyAmountError('Insufficient Funds!') 
