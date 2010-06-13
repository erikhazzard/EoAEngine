'''==========================================================================

Cell.py

Cell class to store information about cell objects
============================================================================='''
from custom_exceptions import *

'''========================================================================

Cell

==========================================================================='''
class Cell(object):
    '''Cell
    Contains cell object information'''

    def __init__(self, pos_x=0, pos_y=0, cell_value=0):
        '''Set up cell attributes'''
        
        #Position
        self.pos_x = pos_x
        self.pos_y = pos_y

        #Store i and j, just for (in)sanity checks
        self.pos_i = self.pos_y
        self.pos_j = self.pos_x

        #Cell value (passed in from grid)
        self.cell_value = cell_value
        
        #List of creeps occupying the cell
        self.contained_creeps = []

        #Stores a reference to the contained tower
        self.contained_tower = None

        #Store a list of towers that have a radius extending to this cell
        self.towers_in_range = []
        
        '''=====================================================================

        Methods

        ========================================================================'''
    def adopt_tower(self, tower=None):
        '''Stores a reference to the tower in the cell'''

        #See if the cell can store the tower
        if self.cell_value != 1:
            #If the cell value is not 1 then it can store a tower
            self.contained_tower = tower

            #Set the cell value to 1 so other towers cannot be placed 
            #   in the same cell
            self.cell_value = 0

            #We're done
            return
        else:
            #A tower cannot be placed here
            raise CellOccupiedError('Cell at i:%s, j:%s | Value: %s ' % (
                        self.pos_y, self.pos_x, self.cell_value) + \
                        '| Tower already exists in desired location')
