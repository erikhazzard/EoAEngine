'''==========================================================================
                                                                                                       
Creep.py

Handles creeps
============================================================================='''
from custom_exceptions import *

'''========================================================================

Creep

==========================================================================='''
class Creep(object):
    '''Creep class'''
    def __init__(self, health=5, power=0, armor_class=0,
            elementals={'dark':0, 'earth':0, 'fire':0, 'light':0, 
                    'water':0, 'wind':0}, 
            pos_x=1, pos_y=0, active_effects=None,
            move_speed=375, move_speed_base=375, 
            creep_player_life_value=1,
            creep_list=None, map_object=None):
        '''Set up a creep'''
        #Creep stats
        self.health = health
        self.power = power
        self.armor_class = armor_class
        #Move Speed
        self.move_speed = move_speed
        self.move_speed_base = move_speed_base

        #Health amount to take away if reached goal
        self.creep_player_life_value = 1


        #Elemental Values
        self.elementals = elementals
    
        #Position
        self.pos_x = pos_x
        self.pos_y = pos_y
        self.pos_i = self.pos_y
        self.pos_j = self.pos_x

        #Active effects (buffs / determintal effects)
        if active_effects is None:
            active_effects = []
        self.active_effects = active_effects

        #Path / Movement info
        #   Store the current index the creep is at for the map's path object
        self.path_current_index = 0
        
        #Reference to the map's creep list
        if creep_list is None:
            creep_list = []
        self.creep_list = creep_list

        #Reference to map object
        if map_object is None:
            map_object = None
        self.map_object = map_object

    def move(self, path):
        '''Move the creep to the next cell based on the path and increment 
            the path index'''
        try:
            #Store previous position
            self.pos_x_prev = path[self.path_current_index][0]
            self.pos_y_prev = path[self.path_current_index][1]
            self.pos_i_prev = path[self.path_current_index][1]
            self.pos_j_prev = path[self.path_current_index][0]

            #Increase the current path index
            self.path_current_index += 1
            
            #Set current position
            self.pos_x = path[self.path_current_index][0]
            self.pos_y = path[self.path_current_index][1]
            self.pos_j = path[self.path_current_index][1]
            self.pos_j = path[self.path_current_index][0]

            #Update the map cell objects that contain the creep
            if self.map_object is not None:
                #Store a creep reference in the previous cell
                self.map_object.cell_objects[self.pos_i_prev][
                        self.pos_j_prev].remove_creep(self)

                #Store a creep reference in the destination cell
                self.map_object.cell_objects[self.pos_i][
                        self.pos_j].adopt_creep(self)

        except IndexError:
            #An invalid path index has been accessed - this will happen 
            #   when the creep has reached its desination (the path is over)
            if self.path_current_index == len(path):
                #Ensure that the creep has reached the end of the path
                self.reached_goal()
            else:
                raise IndexError('creep.move() has index error but path_current_index != len(path)')

    def reached_goal(self):
        '''Called in the creep has reached the goal'''
        #Destroy the creep
        self.destroy()

        #Return the amount of life to take away from the player
        return self.creep_player_life_value
        '''
        #Decrease the player health
        #   The passed in players may be either a single player object or
        #   a list of player objects
        try:
            target_player.update_health(self.creep_player_life_value)
        except TypeError:
            #If a list is passed in, change each player's health
            for i in player:
                i.update_health(self.creep_player_life_value)
        '''

    def destroy(self):
        '''Destory the creep - remove it from the list of active creeps
            in the game'''
        #Remove the creep from the creep list
        try:
            self.creep_list.remove(self)
        except ValueError:
            pass

    def update_health(self, amount, referrer=None):
        '''Update the creep's health and destory if necessary'''
        #Update health
        self.health += amount
        
        #Destroy creep if necessary
        if self.health <= 0:
            self.destroy()
            if referrer is not None:
                referrer.creeps_killed += 1
            return None
        else:
            return self.health
