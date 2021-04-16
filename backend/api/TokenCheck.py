from api.models import User
import json
import hashlib

def checkToken(username, token):
    checkData = User.objects.get(username=username)
    hashData = {
        'firstName':checkData.firstName,
        'lastName':checkData.lastName,
        'username':checkData.username,
        'email':checkData.email,
        'password':checkData.password,
    }
    hashData = json.dumps(hashData).encode('utf-8')
    tokenCheck = hashlib.sha256(hashData).hexdigest()
    if token == tokenCheck:
        return True
    else:
        return False
