import models_types
import sys
import os
sys.path.append(os.getcwd()+'/ml_invocation/models')
# Uncomment the line below if running this file as a python script
# without the node.js server calling it
# sys.path.append('models')
from svm import handleSVM

def run(command, modelType, trainingData, classificationData, modelName, parameters):
    if(modelType == models_types.SVM):
        result = handleSVM(command, trainingData, classificationData, modelName, parameters)
        print({'result': result})
        sys.stdout.flush()
    elif(modelType == models_types.TEST):
        print("TEST")

if __name__ == '__main__':
    """
        Usage:
        param-A: command operation to run on the model.
        param-B: model type
        param-C: training data file path
        param-D: classification data file path
        param-E: model name
    """
    """
        python ml.py createmodel svm /usr/Documents/file.txt /usr/Documents/file2.txt
    """

    # For the prototype, will support 5 params or 6 params
    if len(sys.argv) == 6:
        run(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], None)
    elif len(sys.argv) == 7:
        run(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6])
    else:
        print(
        """
            invalid_input. Usage:
            ml.py createmodel param-A param-B param-C param-D param-E
            param-A: command operation to run on the model.
            param-B: model type
            param-C: training data file path
            param-D: classification data file path
            param-E: model name
            param-F: For future use - (We can use this to pass the ML model's params specified by the user. For the prototype, we will not support user input parameters)
        """)

        sys.stdout.flush()
