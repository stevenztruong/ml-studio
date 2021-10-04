from sklearn import svm

import json

import command_types
import utilities
import s3Util

def handleSVM(command, trainingData, classificationData, modelName, parameters):
    if(command == command_types.CREATE_MODEL):
        return createModel(trainingData, classificationData, modelName, parameters)
    elif(command == command_types.TRAIN_MODEL):
        return trainModel(trainingData, classificationData, modelName, parameters)
    else:
        return(json.dumps({'result': 'error', 'message': "Invalid command. Please use a valid command type."}))


def createModel(trainingData, classificationData, modelName, parameters):
    try:
        classifer = svm.SVC(gamma = "auto")
        print("Created SVM classifier")
        # The commented lines for trainingDataSet and classificationDataSet
        # are used for retrieving the files locally for TESTING purposes only

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

def trainModel(trainingData, classificationData, modelName, parameters):
    try:
        classifer = utilities.getModel(modelName)
        print("Fetched stored SVM classifier")
        # The commented lines for trainingDataSet and classificationDataSet
        # are used for retrieving the files locally for TESTING purposes only

        # trainingDataSet = utilities.getFileContents(trainingData)
        # classificationDataSet = utilities.getFileContents(classificationData)

        print("Fetching training and classification data")
        trainingDataSet = json.loads(s3Util.getFile(trainingData))
        classificationDataSet = json.loads(s3Util.getFile(classificationData))
        print("Training SVM model")
        res = classifer.fit(trainingDataSet, classificationDataSet)

        # print("score: " + str(classifer.predict(trainingDataSet)))

        print("Uploading newly trained SVM model")
        utilities.storeModel(res, modelName)
        print("success")
        return(json.dumps({'result': 'success'}))
    except Exception as e:
        print("failure")
        return(json.dumps({'result': 'error', 'message': str(e)}))

if __name__ == '__main__':
    createModel("testTrainingData.json", "testClassificationData.json", "testModelName", None)
    trainModel("testTrainingData.json", "testClassificationData.json", "testModelName", None)