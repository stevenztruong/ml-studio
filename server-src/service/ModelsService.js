'use strict';

const lo = require('lodash');
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
exports.createModel = function(body) {
  return new Promise(function(resolve, reject) {
    console.log(body);
    // dbConnection.connect();
    dbConnection.query(`INSERT INTO Model (userId, modelName, modelType) VALUES (${body.userId}, "${body.modelName}", "${body.modelType}")`, function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      console.log(fields);
      resolve();
    });

    // dbConnection.end();
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
exports.getModelById = function(modelId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "name" : "name",
  "id" : 0,
  "params" : "{}"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Retrieve all existing models for a user
 *
 *
 * no response value expected for this operation
 **/
exports.getModels = function() {
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

    dbConnection.query('SELECT * FROM Model WHERE userId = 1', function (error, results, fields) {
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

exports.uploadData = function(req,body) {
  const files = req.files;
  const s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
  });
  return new Promise(function(resolve, reject) {
    lo.forEach(files, function(value, key) {
      s3bucket.createBucket(function () {
        var params = {
          Bucket: BUCKET_NAME,
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

    resolve({
      trainging_data: files.trainingData.name,
      classification_data: files.classificationData.name
    });
  });
}
