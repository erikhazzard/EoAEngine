from django.conf import settings
from django.utils import simplejson

from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect

def render_to(template_name):
    def renderer(func):
        def wrapper(request, *args, **kw):
            output = func(request, *args, **kw)
            if not isinstance(output, dict):
                return output
            return render_to_response(template_name, output, context_instance = RequestContext(request))
        return wrapper
    return renderer


#when template is passed in as like func(request, something, template)
def render_to_template():
    def renderer(func):
        def wrapper(request, *args, **kw):
            output = func(request, *args, **kw)
            if not isinstance(output, dict):
                return output
            return render_to_response(args[1], output, context_instance = RequestContext(request))
        return wrapper
    return renderer

