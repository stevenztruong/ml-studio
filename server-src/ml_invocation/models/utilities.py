import json

def getFileContents(data):
    with open(data, 'r') as file:
        return json.loads(file.read())