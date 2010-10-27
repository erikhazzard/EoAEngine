from django.conf.urls.defaults import *
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    ###=======================================================================
    ###    Base Pages
    ###=======================================================================
    #ADMIN
    (r'^admin/', include(admin.site.urls)),
    
    #Index Page
    url(r'^index/', 'game.views_pages.index', name="page_index"),
    url(r'^game/', 'game.views_game.game', name="page_game"),

    #Login Page
    url(r'^login/', 'game.views_pages.login_page', name="page_login"),
   
    ###=======================================================================
    ###    Account Functions    
    ###=======================================================================
    #-------------------------------------
    #User account functions
    #-------------------------------------
    url(r'account/login/', 'accounts.views.login', name="account_login"),
    url(r'account/logout/', 'accounts.views.logout', name="account_logout"),
    url(r'account/register/', 'accounts.views.register', name="account_register"),

    ###=======================================================================
    ###     Javascript Functions    
    ###=======================================================================
    #-------------------------------------
    #       Javascript Files
    #-------------------------------------
    url(r'^js_config/', 'game.views_javascript.generate_config', 
        name="js_config"),

    ###=======================================================================
    ###    Game Functions    
    ###=======================================================================
    #-------------------------------------
    #       Heartbeat
    #-------------------------------------
    url(r'^game/heartbeat/', 'game.views_game.heartbeat', 
        name="character_heartbeat"),
    
)
if settings.DEBUG:
    urlpatterns += patterns('',
    (r'^static/tower_d/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    )
