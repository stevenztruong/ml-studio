'use strict';

const { spawn } = require('child_process');
const lo = require('lodash');
const fs = require('fs');
const AWS = require('aws-sdk');
const BUCKET_NAME = 'mlstudio-bucket';
const IAM_USER_KEY = 'AKIAQR7PIWMNIAGTK2H3';
const IAM_USER_SECRET = 'AhNcHnHjTwaUmwFb6mmbv/BZrmdEcMQyW/GE8v9A';
var dbConnection = require('../utils/dbUtil').connection;

/**
 * Create a new model and add to your account
 *
 *
 * body Model Model object that needs to be added to the account
 * no response value expected for this operation
 **/
exports.createModel = function(userId, body) {
  return new Promise(function(resolve, reject) {
    console.log(body);
    // dbConnection.connect();
    // TODO: add constraint on modelName
    dbConnection.query(`INSERT INTO Model (userId, modelName, modelType, parms) VALUES (${userId}, "${body.modelName}", "${body.modelType}", '${JSON.stringify(body.parameters)}')`, function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      console.log(fields);
      const childPython = spawn('python3', [__dirname + '/../ml_invocation/ml.py', "createmodel", body.modelType, body.trainingData, body.classificationData, body.modelName, JSON.stringify(body.parameters)], { env: { ...process.env, userId: userId }});
      childPython.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
      })

      childPython.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
      })

      childPython.on('close', (code) => {
          console.log(`child process exited with code: ${code}`);
      })
      resolve();
    });

    // dbConnection.end();
  });
}

exports.trainModel = function(userId, body) {
  return new Promise(function(resolve, reject) {
    console.log(body);
    const childPython = spawn('python3', [__dirname + '/../ml_invocation/ml.py', "trainmodel", body.modelType, body.trainingData, body.classificationData, `${body.modelName}.pickle`, JSON.stringify(body.parameters)], { env: { ...process.env, userId: userId }});
    childPython.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    })

    childPython.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    })

    childPython.on('close', (code) => {
        console.log(`child process exited with code: ${code}`);
    })
    resolve();
  });
}

exports.testModel = function(userId, body) {
  return new Promise(function(resolve, reject) {
    console.log(body);
    const childPython = spawn('python3', [__dirname + '/../ml_invocation/ml.py', "testmodel", body.modelType, body.trainingData, body.classificationData, `${body.modelName}.pickle`, JSON.stringify(body.parameters)], { env: { ...process.env, userId: userId }});
    childPython.stdout.on('data', (data) => {
      const newData = data.toString().split(/(?:\r\n|\r|\n)/g);
      for (let line of newData) {
        if (line.includes("Return object:")) {
          resolve(line);
          break;
        }
      }
      console.log(`stdout: ${data}`);
    })

    childPython.stderr.on('data', (data) => {
      resolve();
      console.error(`stderr: ${data}`);
    })

    childPython.on('close', (code) => {
      resolve();
      console.log(`child process exited with code: ${code}`);
    })
  });
}

exports.predictModel = function(userId, body) {
  return new Promise(function(resolve, reject) {
    console.log(body);
    const childPython = spawn('python3', [__dirname + '/../ml_invocation/ml.py', "predictmodel", body.modelType, body.predictionData, '{}', `${body.modelName}.pickle`, JSON.stringify(body.parameters)], { env: { ...process.env, userId: userId }});
    childPython.stdout.on('data', (data) => {
        const newData = data.toString().split(/(?:\r\n|\r|\n)/g);
        for (let line of newData) {
          if (line.includes("Return object:")) {
            resolve(line);
            break;
          }
        }
        console.log(`stdout: ${data}`);
    })

    childPython.stderr.on('data', (data) => {
        resolve();
        console.error(`stderr: ${data}`);
    })

    childPython.on('close', (code) => {
        resolve();
        console.log(`child process exited with code: ${code}`);
    })
  });
}

/**
 * Delete a model
 *
 *
 * modelId Long Model id to delete
 * no response value expected for this operation
 **/
exports.deleteModel = function(modelId) {
  return new Promise(function(resolve, reject) {
    dbConnection.query(`DELETE FROM Model WHERE id = ${modelId}`, function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      console.log(fields);
      resolve();
    });
  });
}


/**
 * Find model by ID
 * Returns a single model
 *
 * modelId Long ID of model to return
 * returns Model
 **/
exports.getModelById = function(modelId, userId) {
  return new Promise(function(resolve, reject) {
    dbConnection.query(`SELECT * FROM Model WHERE id = ${modelId} AND userId = ${userId}`, function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0)
        results[0].parms = JSON.parse(results[0].parms);
      resolve(results);
    });
  });
}


/**
 * Retrieve all existing models for a user
 *
 *
 * no response value expected for this operation
 **/
exports.getModels = function(userId) {
  return new Promise(function(resolve, reject) {
    // dbConnection.connect();

    // var createTable1 = 'CREATE TABLE User (id int AUTO_INCREMENT PRIMARY KEY,fullName varchar(50) NOT NULL,' +
    //                   'userName varchar(20) NOT NULL,password varchar(50) NOT NULL,email varchar(50) NOT NULL)';

    // var createTable2 =
    // 'CREATE TABLE Model (                                            ' +
    // '  id int AUTO_INCREMENT PRIMARY KEY,                            ' +
    // '  userId int,                                                   ' +
    // '  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,   ' +
    // '  modelName varchar(20) NOT NULL,                               ' +
    // '  modelType varchar(10) NOT NULL,                               ' +
    // '  status varchar(10) DEFAULT "Unknown",                         ' +
    // '  parms text                                                    ' +
    // ')                                                               ';


    // connection.query("SELECT * FROM Model", function (error, results, fields) {
    //   if (error) throw error;
    //   console.log('The solution is: ', results[0]);
    // });

    // dbConnection.query(createTable, function (error, results, fields) {
    //   if (error) throw error;
    //   console.log('The solution is: ', results[0]);
    // });

    dbConnection.query(`SELECT * FROM Model WHERE userId = ${userId}`, function (error, results, fields) {
      lo.forEach (results, function(model) {
        model.parms = JSON.parse(model.parms);
      });
      if (error) throw error;
      resolve(results);
    });

    // dbConnection.end();

  });
}


/**
 * Updates a model
 *
 *
 * modelId Long ID of model that needs to be updated
 * body Model Model object that needs to be updated
 * no response value expected for this operation
 **/
exports.updateModel = function(modelId,body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

exports.uploadData = function(req) {
  const files = req.files;
  var results = new Object;
  lo.forEach(files, function(value, key) {
    results[key] = value.name;
  });
  const s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
  });
  return new Promise(function(resolve, reject) {
    lo.forEach(files, function(value, key) {
      s3bucket.createBucket(function () {
        var params = {
          Bucket: `${BUCKET_NAME}/${req.user.id}`, // ex. /mlstudio-bucket/56/
          Key: value.name,
          Body: value.data
        };
        s3bucket.upload(params, function (err, data) {
          if (err) {
            console.log('error in callback');
            console.log(err);
          }
          console.log('success');
          console.log(data);
        });
      });
    });
    // TODO: Error handling
    resolve(results);
  });
}

exports.downloadData = function(req) {
  const fileName = req.swagger.params['fileName'].value;
  const s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
  });
  return new Promise(function(resolve, reject) {
    s3bucket.createBucket(function () {
      var params = {
        Bucket: `${BUCKET_NAME}/${req.user.id}`, // ex. /mlstudio-bucket/56/
        Key: fileName
      };
      var fileStream = s3bucket.getObject(params).createReadStream();
      return resolve({ fileStream });
    });
  });
}
