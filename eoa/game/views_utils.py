"""==========================================================================
views_util.py

contains all our view imports
============================================================================="""
"""----------------------------------------
Imports

Here we import the majority of modules we'll need for most the views.  Some 
views may have more imports they need specifically, but most views will simply
import this module and have access to all the modules imported below.

It isn't always a good idea to import *, but we want to be sure we catch all
django modules and we can overwrite in individual view files if necessary
-------------------------------------------"""
#Django Imports
from django.conf import settings
from django.shortcuts import *
from django.http import *
from django.template import *
from django.core.urlresolvers import reverse

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

#Nyimi application imports
from eoa.game.models import *

#other python imports
import operator, cgi, re, datetime, string, random
