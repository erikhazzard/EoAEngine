import os
import sys
sys.path.append('/home/erik/Code/EoAWeb1')
sys.path.append('/home/erik/Code/EoAWeb1/eoaweb')

os.environ['DJANGO_SETTINGS_MODULE'] = 'eoaweb.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
