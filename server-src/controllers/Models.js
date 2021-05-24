'use strict';

const utils = require('../utils/writer.js');
const Models = require('../service/ModelsService');

module.exports.createModel = function createModel (req, res, next) {
  var body = req.swagger.params['body'].value;
  Models.createModel(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteModel = function deleteModel (req, res, next) {
  var modelId = req.swagger.params['modelId'].value;
  Models.deleteModel(modelId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getModelById = function getModelById (req, res, next) {
  var modelId = req.swagger.params['modelId'].value;
  Models.getModelById(modelId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getModels = function getModels (req, res, next) {
  Models.getModels()
    .then(function (response) {
      res.end(JSON.stringify(response));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateModelById = function updateModel (req, res, next) {
  var modelId = req.swagger.params['modelId'].value;
  var body = req.swagger.params['body'].value;
  Models.updateModel(modelId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.uploadData = function uploadData (req, res, next) {

  Models.uploadData(req)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
