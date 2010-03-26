from django.db import models
from django.contrib.auth.models import *

from django.contrib import admin

from tower_d.accounts.models import Account

class Character(models.Model):
    name = models.CharField(max_length=200)
    
    pos_x = models.IntegerField(default=0)
    pos_y = models.IntegerField(default=0)

    color = models.CharField(max_length=6, default="000000")

    #Last time a chat call was made
    last_update = models.DateTimeField(auto_now=True, null=True, blank=True)

    #The account associated with the character
    account = models.ForeignKey(Account)

    #Flag to set if the character is logged in
    #   There should only be one active character per account
    is_logged_in = models.BooleanField(default=False)

admin.site.register(Character)

class ServerLog(models.Model):
    """Server Log - Handles all messages, borth from players and server"""

    #Author may be null if coming from server
    author = models.ForeignKey(User, null=True, blank=True)

    #Contains the content of the message
    message = models.CharField(max_length = 1024, default='', null=True, blank=True)

    #Date / Time message was created
    message_time = models.DateTimeField(auto_now=True, null=True, blank=True)

admin.site.register(ServerLog)
