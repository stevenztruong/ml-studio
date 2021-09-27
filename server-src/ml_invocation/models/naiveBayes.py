from sklearn import naive_bayes

import json
import command_types
import utilities
import s3Util

import sys
import os
sys.path.append(os.getcwd()+'/server-src/ml_invocation')
import models_types

def handlNaiveBayes(command, trainingData, classificationData, modelName, parameters, modelType):
    if(command == command_types.CREATE_MODEL):
        return createModel(trainingData, classificationData, modelName, parameters, modelType)


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


if __name__ == '__main__':
    createModel("testTrainingData.json", "testClassificationData.json",
                "testModelName", None, models_types.GAUSSIAN_NB)
    createModel("testTrainingData.json", "testClassificationData.json",
                "testModelName", None, models_types.MULTINOMIAL_NB)
