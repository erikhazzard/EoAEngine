"""==========================================================================

Imports

============================================================================="""
#Django Imports
from django.shortcuts import *
from django.http import *
from django.template import *

#Django auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login as django_login
from django.contrib.auth import authenticate as django_authenticate
from django.contrib.auth import logout as django_logout
from django.contrib.auth.models import User
from django.contrib.auth.forms import *

from django.forms.models import modelformset_factory
from django.core.mail import EmailMessage, SMTPConnection, send_mail

#Our util imports
from util import *

#EoAWeb application imports
from tower_d.game.models import *
from tower_d.accounts.models import *

#other python imports
import operator, cgi, re, datetime, string, random
'''========================================================================

Functions

==========================================================================='''
'''----------------------
Login
-------------------------'''
def login(request):
    '''Take in a username and password, check it against DB'''

    #Get the username and password.  We'll use python's .get for dicts to 
    #   ensure that something is returned, albeit an empty string
    username = cgi.escape(request.POST.get('username', ''))
    password = cgi.escape(request.POST.get('password', ''))

    #Create an empty response string
    res = 'Success'

    #Return an user object if the username and password match
    user = django_authenticate(username=username, password=password)

    #See if we got back a user
    if user is not None:
        #Call django's built in login
        django_login(request, user)
    else:
        raise Http404

    return HttpResponse(res)

'''----------------------
Logout
-------------------------'''
def logout(request):
    """Logouts the user by calling django's biult in logout function"""
    
    django_logout(request)
    return HttpResponseRedirect('/tower_d/game/')

'''----------------------
Register
-------------------------'''
def register(request):
    """Register a user account
    
    TODO: Put the form stuff in a form
    """

    #Get the registration info
    username = cgi.escape(request.POST.get('username',''))
    email = cgi.escape(request.POST.get('email',''))
    password = cgi.escape(request.POST.get('password',''))

    #Get and set the character's color
    character_color = cgi.escape(request.POST.get('color'))
    character_color = character_color.replace('#','')
    character_color = character_color[0:6]

    res = 'Account created successfully!'
    
    try:
        #See if the user exists.  If it does, raise an error
        User.objects.get(username=username)
        raise Http404        
    except User.DoesNotExist:
        pass 

    #creates a user in auth_user
    new_user = User.objects.create_user(username, email, password) 
    new_user.save()

    #create an account in accounts
    new_account = Account(user=new_user)
    new_account.username = username
    new_account.save()

    #creates a character
    new_character = Character(name=username, pos_x=0, pos_y=0, 
                        color=character_color, account=new_account,
                        is_logged_in=True)
    new_character.save()

    #For now, make the active character the one just created
    new_account = Account.objects.get(user=new_user)
    new_account.active_character = new_character
    new_account.save()

    return HttpResponse(res)
