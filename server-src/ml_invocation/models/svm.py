from sklearn import svm

import json

import command_types
import utilities
import s3Util

def handleSVM(command, trainingData, classificationData, modelName, parameters):
    if(command == command_types.CREATE_MODEL):
        return createModel(trainingData, classificationData, modelName, parameters)

def createModel(trainingData, classificationData, modelName, parameters):
    try:
        classifer = svm.SVC(gamma = "auto")
        # trainingDataSet = utilities.getFileContents(trainingData)
        # classificationDataSet = utilities.getFileContents(classificationData)
        trainingDataSet = json.loads(s3Util.getFile(trainingData))
        classificationDataSet = json.loads(s3Util.getFile(classificationData))
        res = classifer.fit(trainingDataSet, classificationDataSet)
        # print("score: " + str(classifer.predict(trainingDataSet)))
        utilities.storeModel(res, modelName)
        print("success")
        return(json.dumps({'result': 'success'}))
    except Exception as e:
        print("failure")
        return(json.dumps({'result': 'error', 'message': str(e)}))

if __name__ == '__main__':
    createModel("testTrainingData.json", "testClassificationData.json", "testModelName", None)