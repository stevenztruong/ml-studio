## Installation

* pip3 install -U scikit-learn

* pip3 install -U boto3

## Running the code


* cd `server-src/ml_invocation`

* Use the commands below to run the code. You can use a full path or relative path when running from the `server-src/ml_invocation` folder

    * `python3 ml.py createmodel svm /Users/farokhc/Documents/sjsu/CMPE295A/ml-studio/server-src/ml_invocation/test/testTrainingData.json /ml_invocation/test/testClassificationData.json`

    * `python3 ml.py createmodel svm test/testTrainingData.json test/testClassificationData.json`