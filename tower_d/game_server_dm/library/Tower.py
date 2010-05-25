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

    def __init__(self, player_id=0, 
            i=0, j=0, cell_size_xy=1,
            base_damage=1, base_delay=1000, base_range=3,
            damage=1, delay=1000, range= 3,
            attributes=None,
            bullet_speed=500,
            creeps_killed=0,
            elemental_effects=None,
            value=0,
            base_cost=10):
        '''Update class variables'''
        Tower.towers_created += 1

        '''Initalize object variables'''
        #Tower ID
        self.id = Tower.towers_created

        #ID of owner     
        self.player_id = player_id

        #Positions(save x,y and i,j)
        self.pos_x = j
        self.pos_y = i

        self.pos_i = i
        self.pos_j = j

        #How many cells needed for both x and y 
        #   e.g. 2 would mean it really takes up 4 cells (2x + 2y = 4)
        self.cell_size_xy = cell_size_xy

        #Base attributes
        self.base_damage = base_damage
        self.base_delay = base_delay
        self.base_range = base_range

        #current attributes
        self.damage = damage
        self.delay = delay
        self.range = range
    
        if attributes is None:
            attributes = { 
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
        self.attributes = attributes
        
        #Bullet speed
        self.bullet_speed = bullet_speed

        #Creeps tower has killed
        self.creeps_killed = creeps_killed

        #Active Effects
        #--------------------------------

        #Elemental Buffs
        #--------------------------------
        if elemental_effects is None:
            elemental_effects = {'dark': {'tick_delay': 1000,
                                        'tick_damage': 0,
                                        'tick_number': 0
                                    },
                            'earth': {'slow_amount': 0,
                                        'slow_duration': 0
                                    },
                            'wind': {'stun_chance': 0,
                                    'stun_duration': 0}}
        self.elemental_effects = elemental_effects

        #Gold value of tower
        self.value = value
    
        #Base cost of tower, 10 by default
        self.tower_base_cost = base_cost 

        #Timers
        #--------------------------------
        self.attack_timer = 0
       
        #Objects in range of tower
        #--------------------------------
        #Cells in the radius of the tower (may not be necessary)
        self.cells_in_range = []
        
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

    '''Update Cells in Range
    -------------------------------------'''
    def update_cells_in_range(self, cell_grid=None):
        '''Calculate the cells in a radius around the tower.  Takes in a grid
        which is the map cell object list and stores the cells in the tower
        cell radius list'''
        if cell_grid is None:
            raise EmptyCellGrid('Empty cell_grid_object passed in')


        #Store cells that fall in a radius of the tower
        #Store a loop length and range variable to keep track of radius
        loop_length = self.range + 1

        count_i = -self.range
        count_j = -self.range

        #reset the tower's cells in range list
        self.cells_in_range = []

        #Loop through all the cells around the tower within a radius
        #   The radius is self.radius
        while count_i < loop_length:
            while count_j < loop_length:
                if self.pos_i + count_i > -1 and \
                    self.pos_j + count_j > -1:
                    #Add the cell object to the tower's cells in range list
                    self.cells_in_range.append(
                            cell_grid[self.pos_i+count_i][self.pos_j+count_j])

                    #Add the tower to the cell's tower object list
                    cell_grid[self.pos_i+count_i][self.pos_j+count_j]

                count_j += 1
            #Reset count_j and increase count_i
            count_j = -self.range
            count_i += 1

        #Return the cells in range
        return self.cells_in_range

    '''Attack
    -------------------------------------'''
    def attack(self, target=None):
        '''Attack will attack the passed in target
            Target can be a creep or a cell position (e.g. (0,0))'''
        if target is None:
            return

