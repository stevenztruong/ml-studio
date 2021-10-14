from sklearn import linear_model

import json

import command_types
import utilities
import s3Util


def handleSGD(command, inputData, classificationData, modelName, parameters):
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
        print("API input parameters: "+str(parameters))
        jsonParameters = json.loads(parameters)

        modelParams = {}

        print("reached")

        sgdAlpha = jsonParameters.get('sgdAlpha')
        if(sgdAlpha != None):
            print("Alpha parameter present")
            modelParams['alpha'] = float(sgdAlpha)
            print("Successfully read Alpha parameter")

        sgdMaxIter = jsonParameters.get('sgdMaxIter')
        if(sgdMaxIter != None):
            print("Max iterations parameter present")
            modelParams['max_iter'] = int(sgdMaxIter)
            print("Successfully read max iterations parameter")

        sgdEpsilon = jsonParameters.get('sgdEpsilon')
        if(sgdEpsilon != None):
            print("Epsilon parameter present")
            modelParams['epsilon'] = float(sgdEpsilon)
            print("Successfully read Epsilon parameter")

        sgdLearningRate = jsonParameters.get('sgdLearningRate')
        if(sgdLearningRate != None):
            print("Learning rate parameter present")
            modelParams['learning_rate'] = str(sgdLearningRate)
            print("Successfully read learning rate parameter")

        print("Constructed parameters: " + str(modelParams))
        classifer = linear_model.SGDClassifier(**modelParams)
        print("Created SGD classifier")
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
        print("Fetched stored SGD classifier")
        # The commented lines for trainingDataSet and classificationDataSet
        # are used for retrieving the files locally for TESTING purposes only

        # trainingDataSet = utilities.getFileContents(trainingData)
        # classificationDataSet = utilities.getFileContents(classificationData)

        print("Fetching training and classification data")
        trainingDataSet = json.loads(s3Util.getFile(trainingData))
        classificationDataSet = json.loads(s3Util.getFile(classificationData))
        print("Training SGD model")
        res = classifer.fit(trainingDataSet, classificationDataSet)

        # print("score: " + str(classifer.predict(trainingDataSet)))

        print("Uploading newly trained SGD model")
        utilities.storeModel(res, modelName)
        print("success")
        return(json.dumps({'result': 'success'}))
    except Exception as e:
        print("failure")
        return(json.dumps({'result': 'error', 'message': str(e)}))


def testModel(testingData, classificationData, modelName, parameters):
    try:
        classifer = utilities.getModel(modelName)
        print("Fetched stored Random  Forest classifier")
        # The commented lines for trainingDataSet and classificationDataSet
        # are used for retrieving the files locally for TESTING purposes only

        # trainingDataSet = utilities.getFileContents(trainingData)
        # classificationDataSet = utilities.getFileContents(classificationData)

        print("Fetching testing and classification data")
        testingDataSet = json.loads(s3Util.getFile(testingData))
        classificationDataSet = json.loads(s3Util.getFile(classificationData))
        print("Testing SGD model")
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
        print("Fetched stored SGD classifier")
        # The commented lines for trainingDataSet and classificationDataSet
        # are used for retrieving the files locally for TESTING purposes only

        # trainingDataSet = utilities.getFileContents(trainingData)
        # classificationDataSet = utilities.getFileContents(classificationData)

        print("Fetching prediction data")
        predictionDataSet = json.loads(s3Util.getFile(predictionData))
        print("Predicting dataset against SGD model")
        res = classifer.predict(predictionDataSet)

        print("Result: " + str(res))
        print("success")

        returnObject = json.dumps(
            {'result': 'success', 'prediction': str(res)})
        print("Return object: " + str(returnObject))
        return(returnObject)
    except Exception as e:
        print("failure")
        return(json.dumps({'result': 'error', 'message': str(e)}))


if __name__ == '__main__':
    createModel("testTrainingData.json",
                "testClassificationData.json", "testModelName", "{}")
    trainModel("testTrainingData.json",
               "testClassificationData.json", "testModelName", None)
    testModel("testTrainingData.json",
              "testClassificationData.json", "testModelName", None)
    predictModel("testTrainingData.json", "testModelName", None)
