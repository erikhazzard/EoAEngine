import os

from django.conf.urls.defaults import *
from django.conf import settings


urlpatterns = patterns('accounts',
 
    ###=======================================================================
    ###    Account Functions    
    ###=======================================================================
    #-------------------------------------
    #User account functions
    #-------------------------------------
    url(r'account/login/', 'views.login', name="account_login"),
    url(r'account/logout/', 'views.logout', name="account_logout"),
    url(r'account/register/', 'views.register', name="account_register"),
)

