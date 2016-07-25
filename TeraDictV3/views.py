from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseNotFound
from django.core.urlresolvers import reverse
from TeraDictV3.apps import Teradictv3Config

# Create your views here.
def index(request):
	if request.method == 'GET':
		return render(request, 'TeraDictV3/index.html', { 'inlang': request.session.get('inlang',''), 'outlang': request.session.get('outlang','') })
	else:
		return HttpResponseNotFound('not found')

def set(request):
	if request.method == 'POST':
		if 'param' in request.POST and 'value' in request.POST and (request.POST['param'] == 'inlang' or request.POST['param'] == 'outlang'):
			request.session[request.POST['param']] = request.POST['value']
			return HttpResponse(status=200)
		else:
			return HttpResponse(status=409)
	else:
		return HttpResponseNotFound('not found')
