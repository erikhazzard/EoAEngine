"""==========================================================================
Imports

Import all the views and models
============================================================================="""
from django.db import models
from django.contrib.auth.models import *

from django.contrib import admin

#Import that Account class
from tower_d.accounts.models import Account

#Import the config file
import views_config as CONFIG

"""==========================================================================

Classes
-----------

Set up all the database structures
============================================================================="""
"""==========================================================================
Zone Related
-----------
Models related to zones 
============================================================================="""
class Map(models.Model):
    """Map"""
    #Map name
    name = models.CharField(default='My Map', max_length=142)

    #Create of map
    author = models.ForeignKey('accounts.Account', null=True, blank=True)

    #TODO: How to store grid? Store it as a text field for now and use python
    #to parse it later?  Does it need to be saved in the DB at all? Could it
    #be saved in some file (e.g. pickled) on the server and we store a 
    #referend to the file name?
    grid = models.TextField(null=True, blank=True)

    #Store the URL to the map image file.  Alternately, we could just store 
    #the image as a file, but that may not be great if we swich to a 
    #non-rel DB?
    map_image = models.CharField(null=True, blank=True, max_length=255)

"""==========================================================================
Tower Related
-----------
Models related to towers
============================================================================="""
class Tower(models.Model):
    """Tower"""
    #The associated game id
    game = models.ForeignKey('Game')

    #Player the tower belongs to
    player = models.ForeignKey('accounts.Account')

    #Tower position.  Stored as a coordinate i,j.
    position = models.CharField(default='0,0', max_length=100)

    #Store the number of creeps killed
    creeps_killed = models.IntegerField(default=0)

    #Keep track of the value of the tower (how much gold its worth)
    value = models.IntegerField(default=0)

    #Store the levels for each attribute
    level_damage = models.IntegerField(default=0)
    level_delay = models.IntegerField(default=0)
    level_range = models.IntegerField(default=0)

    level_elemental_dark = models.IntegerField(default=0)
    level_elemental_earth = models.IntegerField(default=0)
    level_elemental_fire = models.IntegerField(default=0)
    level_elemental_light = models.IntegerField(default=0)
    level_elemental_water = models.IntegerField(default=0)
    level_elemental_wind = models.IntegerField(default=0)


"""==========================================================================
Game Related
-----------
Models related specifically to a game
============================================================================="""
class GamePlayerInfo(models.Model):
    """GamePlayerInfo
    Stores the info (e.g. health and gold) for each player for each game"""
    #The associated game id
    game = models.ForeignKey('Game')
    
    #The related player
    player = models.ForeignKey('accounts.Account')

    #The player's health
    health = models.IntegerField(default=CONFIG.DEFAULT_PLAYER_HEALTH)
    
    #The player's gold
    gold = models.IntegerField(default=0)

class Game(models.Model):
    """Game
    Stores information about each game played.  Keeps track of the game state
    """
    
    #Store the players (accounts)
    accounts = models.ManyToManyField('accounts.Account')

    #Stores the map
    map = models.ForeignKey(Map)

    #Store the start and end dates
    date_started = models.DateTimeField(auto_now_add=True)
    date_ended = models.DateTimeField(auto_now_add=True)
