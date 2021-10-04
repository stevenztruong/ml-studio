from sklearn import naive_bayes

import json
import command_types
import utilities
import s3Util

import sys
import os
sys.path.append(os.getcwd()+'/server-src/ml_invocation')
import models_types

def handlNaiveBayes(command, inputData, classificationData, modelName, parameters, modelType):
    if(command == command_types.CREATE_MODEL):
        return createModel(inputData, classificationData, modelName, parameters, modelType)
    elif(command == command_types.TRAIN_MODEL):
        return trainModel(inputData, classificationData, modelName, parameters)
    elif(command == command_types.TEST_MODEL):
        return testModel(inputData, classificationData, modelName, parameters)
    elif(command == command_types.PREDICT_MODEL):
        return predictModel(inputData, modelName, None)
    else:
        return(json.dumps({'result': 'error', 'message': "Invalid command. Please use a valid command type."}))


def createModel(trainingData, classificationData, modelName, parameters, modelType):
    try:
        classifier = None
        # TODO: add more Naive Bayes algorithms
        if modelType == models_types.GAUSSIAN_NB:
            classifer = naive_bayes.GaussianNB()
            print("Created Gaussian Naive Bayes Classifier")
        elif modelType == models_types.MULTINOMIAL_NB:
            classifer = naive_bayes.MultinomialNB()
            print("Created Multinomial Naive Bayes Classifier")

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
        print("Fetched stored Naive Bayes classifier")
        # The commented lines for trainingDataSet and classificationDataSet
        # are used for retrieving the files locally for TESTING purposes only

        # trainingDataSet = utilities.getFileContents(trainingData)
        # classificationDataSet = utilities.getFileContents(classificationData)

        print("Fetching training and classification data")
        trainingDataSet = json.loads(s3Util.getFile(trainingData))
        classificationDataSet = json.loads(s3Util.getFile(classificationData))
        print("Training Naive Bayes model")
        res = classifer.fit(trainingDataSet, classificationDataSet)

        # print("score: " + str(classifer.predict(trainingDataSet)))

        print("Uploading newly trained Naive Bayes model")
        utilities.storeModel(res, modelName)
        print("success")
        return(json.dumps({'result': 'success'}))
    except Exception as e:
        print("failure")
        return(json.dumps({'result': 'error', 'message': str(e)}))

def testModel(testingData, classificationData, modelName, parameters):
    try:
        classifer = utilities.getModel(modelName)
        print("Fetched stored Naive Bayes classifier")
        # The commented lines for trainingDataSet and classificationDataSet
        # are used for retrieving the files locally for TESTING purposes only

        # trainingDataSet = utilities.getFileContents(trainingData)
        # classificationDataSet = utilities.getFileContents(classificationData)

        print("Fetching testing and classification data")
        testingDataSet = json.loads(s3Util.getFile(testingData))
        classificationDataSet = json.loads(s3Util.getFile(classificationData))
        print("Testing Naive Bayes model")
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
        print("Fetched stored Naive Bayes classifier")
        # The commented lines for trainingDataSet and classificationDataSet
        # are used for retrieving the files locally for TESTING purposes only

        # trainingDataSet = utilities.getFileContents(trainingData)
        # classificationDataSet = utilities.getFileContents(classificationData)

        print("Fetching prediction data")
        predictionDataSet = json.loads(s3Util.getFile(predictionData))
        print("Predicting dataset against Naive Bayes model")
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
    createModel("testTrainingData.json", "testClassificationData.json",
                "testModelNameGaussian", None, models_types.GAUSSIAN_NB)
    createModel("testTrainingData.json", "testClassificationData.json",
                "testModelNameMultinomial", None, models_types.MULTINOMIAL_NB)
    trainModel("testTrainingData.json",
               "testClassificationData.json", "testModelNameGaussian", None)
    trainModel("testTrainingData.json",
               "testClassificationData.json", "testModelNameMultinomial", None)
    testModel("testTrainingData.json", "testClassificationData.json", "testModelNameGaussian", None)
    testModel("testTrainingData.json", "testClassificationData.json", "testModelNameMultinomial", None)
    predictModel("testTrainingData.json", "testModelNameGaussian", None)
    predictModel("testTrainingData.json", "testModelNameMultinomial", None)
