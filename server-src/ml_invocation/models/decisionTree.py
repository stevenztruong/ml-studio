from sklearn import tree

import json

import command_types
import utilities
import s3Util

def handleDecisionTree(command, inputData, classificationData, modelName, parameters):
    if(command == command_types.CREATE_MODEL):
        return createModel(inputData, classificationData, modelName, parameters)
    elif(command == command_types.TRAIN_MODEL):
        return trainModel(inputData, classificationData, modelName, parameters)
    elif(command == command_types.TEST_MODEL):
        return testModel(inputData, classificationData, modelName, parameters)
    elif(command == command_types.PREDICT_MODEL):
        return predictModel(inputData, modelName, None)
    else:
        return(json.dumps({'result': 'error', 'message': "Invalid command. Please use a valid command type."}))

def createModel(trainingData, classificationData, modelName, parameters):
    try:
        classifer = tree.DecisionTreeClassifier()
        print("Created Decision Tree classifier")
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
        print("Fetched stored Decision Tree classifier")
        # The commented lines for trainingDataSet and classificationDataSet
        # are used for retrieving the files locally for TESTING purposes only

        # trainingDataSet = utilities.getFileContents(trainingData)
        # classificationDataSet = utilities.getFileContents(classificationData)

        print("Fetching training and classification data")
        trainingDataSet = json.loads(s3Util.getFile(trainingData))
        classificationDataSet = json.loads(s3Util.getFile(classificationData))
        print("Training Decision Tree model")
        res = classifer.fit(trainingDataSet, classificationDataSet)

        # print("score: " + str(classifer.predict(trainingDataSet)))

        print("Uploading newly trained Decision Tree model")
        utilities.storeModel(res, modelName)
        print("success")
        return(json.dumps({'result': 'success'}))
    except Exception as e:
        print("failure")
        return(json.dumps({'result': 'error', 'message': str(e)}))

def testModel(testingData, classificationData, modelName, parameters):
    try:
        classifer = utilities.getModel(modelName)
        print("Fetched stored Decision Tree classifier")
        # The commented lines for trainingDataSet and classificationDataSet
        # are used for retrieving the files locally for TESTING purposes only

        # trainingDataSet = utilities.getFileContents(trainingData)
        # classificationDataSet = utilities.getFileContents(classificationData)

        print("Fetching testing and classification data")
        testingDataSet = json.loads(s3Util.getFile(testingData))
        classificationDataSet = json.loads(s3Util.getFile(classificationData))
        print("Testing Decision Tree model")
        res = classifer.score(testingDataSet, classificationDataSet)

        print("Score: " + str(res))
        print("success")

        returnObject = json.dumps({'result': 'success', 'score': str(res)})
        print("Return object: " + str(returnObject))
        return(returnObject)
    except Exception as e:
        print("failure")
        return(json.dumps({'result': 'error', 'message': str(e)}))

def predictModel(predictionData, modelName, parameters):
    try:
        classifer = utilities.getModel(modelName)
        print("Fetched stored Decision Tree classifier")
        # The commented lines for trainingDataSet and classificationDataSet
        # are used for retrieving the files locally for TESTING purposes only

        # trainingDataSet = utilities.getFileContents(trainingData)
        # classificationDataSet = utilities.getFileContents(classificationData)

        print("Fetching prediction data")
        predictionDataSet = json.loads(s3Util.getFile(predictionData))
        print("Predicting dataset against Decision Tree model")
        res = classifer.predict(predictionDataSet)

        print("Result: " + str(res))
        print("success")

        returnObject = json.dumps({'result': 'success', 'prediction': str(res)})
        print("Return object: " + str(returnObject))
        return(returnObject)
    except Exception as e:
        print("failure")
        return(json.dumps({'result': 'error', 'message': str(e)}))

if __name__ == '__main__':
    createModel("testTrainingData.json", "testClassificationData.json", "testModelName", None)
    trainModel("testTrainingData.json", "testClassificationData.json", "testModelName", None)
    testModel("testTrainingData.json", "testClassificationData.json", "testModelName", None)
    predictModel("testTrainingData.json", "testModelName", None)
