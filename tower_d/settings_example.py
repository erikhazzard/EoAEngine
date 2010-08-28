'''=============================================================================
    Settings.py
    ------------
    Handles server specific settings.  Also contains state-specific settings
============================================================================='''
#Debug settings
#----------------------------------------
DEBUG = True
TEMPLATE_DEBUG = DEBUG


#Path settings
#----------------------------------------
import os
TOWER_D_ROOT_URL = '/tower_d/'
ROOT_URL = 'game'
TOWER_D_PATH = '/home/erik/Code/EoAEngine'
ROOT_PATH = os.path.join(TOWER_D_PATH, 'tower_d')

#Set Cookie age
SESSION_COOKIE_AGE = 180000

'''Database Settings'''
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.db',
        'USER': '',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '',
    },
}

'''EMail Settings'''
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'vasirr.tower.d@gmail.com'
EMAIL_HOST_PASSWORD = '_______'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

'''--------------------------------------
    Constants
    -------------------------------------'''
ADMINS = (
    # ('Your Name', 'your_email@domain.com'),
)

MANAGERS = ADMINS

#Set default login url
#Should this use os.path.join?
LOGIN_URL = '%slogin/' % (TOWER_D_ROOT_URL)

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Chicago'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = os.path.join(ROOT_PATH, 'data/www')

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = 'http://vasirdev.net/tower_d/static'

# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
# Examples: "http://foo.com/media/", "/media/".
ADMIN_MEDIA_PREFIX = '/tower_d/media/'

# Make this unique, and don't share it with anybody.
SECRET_KEY = 's#v&4s42-*5ue#i8kvk+eln#&(!3^9&o0)t(_ha1eh^)%8^i#j'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.load_template_source',
    'django.template.loaders.app_directories.load_template_source',
#     'django.template.loaders.eggs.load_template_source',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.csrf.CsrfResponseMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.request",
)

ROOT_URLCONF = 'tower_d.urls'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    #os.path.join(ROOT_PATH, "data/templates"),
    os.path.join(os.path.dirname(__file__), 'data/templates').replace('\\','/'),
)

FIXTURES_DIRS = (
    os.path.join(ROOT_PATH, 'data/fixtures'),
)

AUTH_PROFILE_MODULE= 'accounts.Account'

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'tower_d.game',
    'tower_d.accounts',
)
