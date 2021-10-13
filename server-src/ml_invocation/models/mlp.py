from sklearn import neural_network

import json

import command_types
import utilities
import s3Util


def handleMLP(command, inputData, classificationData, modelName, parameters):
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
        print("test:L : "+str(parameters))
        jsonParameters = json.loads(parameters)

        modelParams = {}

        print("reached")

        # totalLayers = jsonParameters.get('mlpTotalLayers')
        # if(totalLayers != None):
        #     print("total layers parameter present")
        #     modelParams['n_layers'] = int(totalLayers)
        #     print("Successfully read total layersparameter")

        hiddenLayers = jsonParameters.get('mlpHiddenLayers')
        if(hiddenLayers != None):
            print("hidden layers parameter present")
            modelParams['hidden_layer_sizes'] = int(hiddenLayers)
            print("Successfully read hidden layers parameter")

        maximumIterations = jsonParameters.get('mlpMaximumIterations')
        if(maximumIterations != None):
            print('max iters parameter present')
            modelParams['max_iter'] = int(maximumIterations)
            print('Successfully read max iters parameter')

        activationFunction = jsonParameters.get('mlpActivationFunction')
        if(activationFunction != None):
            print('activation function parameter present')
            modelParams['activation'] = str(activationFunction)
            print('Successfully read activation function parameter')

        # print("hidden layers: " + str(modelParams['hidden_layer_sizes']))
        # print("max iterations: " + str(modelParams['max_iter']))

        print("Parameters: " + str(modelParams))
        classifer = neural_network.MLPClassifier(**modelParams)
        print("Created MLP classifier")
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
        print("Fetched stored MLP classifier")
        # The commented lines for trainingDataSet and classificationDataSet
        # are used for retrieving the files locally for TESTING purposes only

        # trainingDataSet = utilities.getFileContents(trainingData)
        # classificationDataSet = utilities.getFileContents(classificationData)

        print("Fetching training and classification data")
        trainingDataSet = json.loads(s3Util.getFile(trainingData))
        classificationDataSet = json.loads(s3Util.getFile(classificationData))
        print("Training MLP model")
        res = classifer.fit(trainingDataSet, classificationDataSet)

        # print("score: " + str(classifer.predict(trainingDataSet)))

        print("Uploading newly trained MLP model")
        utilities.storeModel(res, modelName)
        print("success")
        return(json.dumps({'result': 'success'}))
    except Exception as e:
        print("failure")
        return(json.dumps({'result': 'error', 'message': str(e)}))


def testModel(testingData, classificationData, modelName, parameters):
    try:
        classifer = utilities.getModel(modelName)
        print("Fetched stored MLP classifier")
        # The commented lines for trainingDataSet and classificationDataSet
        # are used for retrieving the files locally for TESTING purposes only

        # trainingDataSet = utilities.getFileContents(trainingData)
        # classificationDataSet = utilities.getFileContents(classificationData)

        print("Fetching testing and classification data")
        testingDataSet = json.loads(s3Util.getFile(testingData))
        classificationDataSet = json.loads(s3Util.getFile(classificationData))
        print("Testing MLP model")
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
        print("Fetched stored MLP classifier")
        # The commented lines for trainingDataSet and classificationDataSet
        # are used for retrieving the files locally for TESTING purposes only

        # trainingDataSet = utilities.getFileContents(trainingData)
        # classificationDataSet = utilities.getFileContents(classificationData)

        print("Fetching prediction data")
        predictionDataSet = json.loads(s3Util.getFile(predictionData))
        print("Predicting dataset against MLP model")
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
