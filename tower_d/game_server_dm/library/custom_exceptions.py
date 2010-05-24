'''==========================================================================
                                                                                                       
Exceptions.py

Contains custom error exceptions
============================================================================='''
'''========================================================================

Player Related

==========================================================================='''
class MoneyAmountError(Exception):
    def __init__(self, value):
        self.parameter = value
    def __str__(self):
        return repr('Money error: %s' % (self.parameter))

class PlayerDefeated(Exception):
    def __init__(self, value):
        self.parameter = value
    def __str__(self):
        return repr(self.parameter)
'''========================================================================

Tower / Cell Related

==========================================================================='''
class CellOccupiedError(Exception):
    def __init__(self, value):
        self.parameter = value
    def __str__(self):
        return repr('Cell occupied: %s' % (self.parameter))

class EmptyCellGrid(Exception):
    def __init__(self, value):
        self.parameter = value
    def __str__(self):
        return repr(self.parameter)
