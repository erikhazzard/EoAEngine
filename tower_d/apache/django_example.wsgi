import os
import sys
sys.path.append('/home/erik/www/vasirdev/EoAEngine')
sys.path.append('/home/erik/www/vasirdev/EoAEngine/tower_d')

os.environ['DJANGO_SETTINGS_MODULE'] = 'tower_d.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
