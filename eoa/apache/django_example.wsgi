import os
import sys
sys.path.append('/home/erik/www/vasirdev/EoAEngine')
sys.path.append('/home/erik/www/vasirdev/EoAEngine/eoa')

os.environ['DJANGO_SETTINGS_MODULE'] = 'eoa.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
