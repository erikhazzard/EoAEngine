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
            move_speed=375, move_speed_base=375):
        '''Set up a creep'''
        #Creep stats
        self.health = health
        self.power = power
        self.armor_class = armor_class
        #Move Speed
        self.move_speed = move_speed
        self.move_speed_base = move_speed_base

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


    def move(self, path):
        '''Move the creep to the next cell based on the path and increment 
            the path index'''
        try:
            #Set the new position
            self.pos_i = path[self.path_current_index][0]
            self.pos_x = path[self.path_current_index][1]
            
            self.pos_j = path[self.path_current_index][1]
            self.pos_j = path[self.path_current_index][0]

            #Increase the current path index
            self.path_current_index += 1

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
        pass
