import json
import pickle
import s3Util
import os

DOT_PICKLE_STRING = ".pickle"

def getFileContents(data):
    with open(data, 'r') as file:
        return json.loads(file.read())

def storeModel(modelData, fileName):
    pickledFileName = fileName + DOT_PICKLE_STRING
    filePath = os.path.dirname(__file__) + "/models_storage/" + pickledFileName
    pickle.dump(modelData, open(filePath, "wb" ))
    s3Util.uploadFile(filePath, fileName)

def getModel(fileName):
    modelContents = s3Util.getFile(fileName)
    modelObject = pickle.loads(modelContents)
    return modelObject