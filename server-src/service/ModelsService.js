'use strict';


/**
 * Create a new model and add to your account
 * 
 *
 * body Model Model object that needs to be added to the account
 * no response value expected for this operation
 **/
exports.createModel = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
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
    resolve();
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
    resolve();
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

