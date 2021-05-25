import json
import pickle
import s3Util
import os

def getFileContents(data):
    with open(data, 'r') as file:
        return json.loads(file.read())

def storeModel(modelData, fileName):
    pickledFileName = fileName + ".pickle"
    filePath = os.path.dirname(__file__) + "/models_storage/" + pickledFileName
    pickle.dump(modelData, open(filePath, "wb" ))
    s3Util.uploadFile(filePath, fileName)
