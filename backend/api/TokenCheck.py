from api.models import User, TokenMake
from random import randbytes
import json
import hashlib
import time

def createNewToken(username):
    author = User.objects.get(username=username)
    randonBytes = randbytes(15)
    issueDate = int(time.time())
    expiryDate = issueDate + 1800 # 40 minutes
    salt = hashlib.sha256(randonBytes).hexdigest()[0:15]
    hashData = {
        'firstName':author.firstName,
        'lastName':author.lastName,
        'username':author.username,
        'email':author.email,
        'password':author.password,
        'issueDate':issueDate,
        'expiryDate':expiryDate,
        'salt':salt
    }
    hashDataDumped = json.dumps(hashData).encode('utf-8')
    token = hashlib.sha256(hashDataDumped).hexdigest()
    TokenMake.objects.create(
        author=author,
        createdDate=issueDate,
        expiryDate=expiryDate,
        salt=salt,
        token=token
    )
    return token

def getDataForToken(username, specificToken):
    author = User.objects.get(username=username)
    tokenData = TokenMake.objects.filter(author=author.id)

    for tokens in tokenData:
        if tokens.token == specificToken:
            if tokens.expiryDate < int(time.time()):
                return False
            else:
                hashData = {
                    'firstName':author.firstName,
                    'lastName':author.lastName,
                    'username':author.username,
                    'email':author.email,
                    'password':author.password,
                    'issueDate':tokens.createdDate,
                    'expiryDate':tokens.expiryDate,
                    'salt':tokens.salt
                }
                hashDataDumped = json.dumps(hashData).encode('utf-8')
                token = hashlib.sha256(hashDataDumped).hexdigest()
                return token


def checkToken(username, token):
    tokenCheck = getDataForToken(username, token)
    if tokenCheck == False:
        return False
    elif token == tokenCheck:
        return True
