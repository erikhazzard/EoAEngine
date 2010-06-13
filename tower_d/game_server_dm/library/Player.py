'''==========================================================================
                                                                                                       
Player.py

Handles players
============================================================================='''
from custom_exceptions import *

'''========================================================================

Player

==========================================================================='''
class Player(object):
    amount_of_players = 0

    '''Handles the player'''
    def __init__(self, health=20, gold=100, id=None):
        '''Set up player attributes'''
        #Player info
        self.health = health
        self.gold = gold

        #Keep track of amount of gold...might not be necessary
        self.accumulated_gold = self.gold

        #Store a list of towers owned
        self.towers_owned = []

        #An aggregate of the creeps killed from each tower owned
        self.creeps_killed = 0

        #Store an ID
        if id is None:
            id = Player.amount_of_players
        self.id = id
        
        Player.amount_of_players += 1

    '''=====================================================================

    Methods

    ========================================================================'''
    def update_gold(self, gold_amount):
        '''Update the player gold with the passed in amount  
            gold_amount: amount of gold to update.  Will likely be positive,
                but we'll leave the possibility open that it may be negative'''
        self.gold += gold_amount
        self.accumulated_gold += gold_amount

        #Return the new gold amount
        return self.gold

    def update_health(self, amount):
        '''Updates the player health - usually this will be negative, but may
            positive'''
        self.health += amount

        #return the current health
        return self.health

    def destroy(self):
        '''Similar to creep destroy function, will raise an exception 
            with info that the player has been defeated'''
        raise PlayerDefeated('%s has been defeated!  Life: %s' % (
                self.id, self.health))
