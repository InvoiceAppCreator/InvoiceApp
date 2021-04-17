from api.models import User
import json
import hashlib

def getDataForToken(username):
    checkData = User.objects.get(username=username)
    hashData = {
        'firstName':checkData.firstName,
        'lastName':checkData.lastName,
        'username':checkData.username,
        'email':checkData.email,
        'password':checkData.password,
    }
    hashData = json.dumps(hashData).encode('utf-8')
    token = hashlib.sha256(hashData).hexdigest()
    return token

def checkToken(username, token):
    tokenCheck = getDataForToken(username)
    if token == tokenCheck:
        return True
    else:
        return False

def makeToken(username):
    token = getDataForToken(username)
    return token
