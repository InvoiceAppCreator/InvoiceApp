from django.http import HttpResponse, HttpResponseNotFound

def showDefault(request):
    return HttpResponse("<h1>Backend</h1>")
