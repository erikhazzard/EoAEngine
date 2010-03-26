"""==========================================================================
views.py

contains all our view functions
============================================================================="""
from views_utils import *

'''===========================================================================

Pages

When we return HttpResponseRedirects, we are using the 'name' value associated
with the URL in urls.py.  We must call the django's reverse function to do so
(http://docs.djangoproject.com/en/1.1/topics/http/urls/#reverse)

It is important to keep in mind that we should not have any clashing names
in the urls.py, or our links might not redirect to the right page
============================================================================'''

@render_to('eoa/index.html')
def index(request):
    """Renders the index page if user is logged in, game lives here"""

    #See if user is logged in
    if not request.user.is_authenticated():
        return HttpResponseRedirect(reverse('page_login'))
   
    return {}

@render_to('eoa/login.html')
def login_page(request):
    """Renders the Login page"""

    return {}
