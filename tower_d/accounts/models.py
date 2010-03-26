from django.db import models
from django.contrib.auth.models import *

class Account(models.Model):
    """Account: Stores account information.

    Accounts are connected to auth_user.  auth_user handles authenication
        and little more.

    Accounts are connected to users and can hold as many users as we define.
    In the longer term, each account would be hooked up to something such 
        like facebook.  
    """

    #Link to auth_user
    user = models.ForeignKey(User)

    #username is same as auth username
    username = models.CharField(max_length=255)

    #Some other stuff we might want to keep track of
    city = models.CharField(max_length=255)

