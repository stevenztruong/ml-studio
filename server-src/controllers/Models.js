'use strict';

const utils = require('../utils/writer.js');
const Models = require('../service/ModelsService');
const DISABLE_AUTH = process.env.DISABLE_AUTH === 'true';

module.exports.createModel = function createModel (req, res, next) {
  if (!DISABLE_AUTH && !req.user) return utils.writeJson(res, utils.respondWithCode(401, {"status":"Unauthenticated","statusCode":401}));

  var body = req.swagger.params['body'].value;
  Models.createModel(req.user.id, body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.trainModel = function trainModel (req, res, next) {
  if (!DISABLE_AUTH && !req.user) return utils.writeJson(res, utils.respondWithCode(401, {"status":"Unauthenticated","statusCode":401}));

  var body = req.swagger.params['body'].value;
  Models.trainModel(req.user.id, body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteModel = function deleteModel (req, res, next) {
  if (!DISABLE_AUTH && !req.user) return utils.writeJson(res, utils.respondWithCode(401, {"status":"Unauthenticated","statusCode":401}));

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
  if (!DISABLE_AUTH && !req.user) return utils.writeJson(res, utils.respondWithCode(401, {"status":"Unauthenticated","statusCode":401}));

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
  if (!DISABLE_AUTH && !req.user) return utils.writeJson(res, utils.respondWithCode(401, {"status":"Unauthenticated","statusCode":401}));

  Models.getModels(req.user.id)
    .then(function (response) {
      res.end(JSON.stringify(response));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateModelById = function updateModel (req, res, next) {
  if (!DISABLE_AUTH && !req.user) return utils.writeJson(res, utils.respondWithCode(401, {"status":"Unauthenticated","statusCode":401}));

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
  if (!DISABLE_AUTH && !req.user) return utils.writeJson(res, utils.respondWithCode(401, {"status":"Unauthenticated","statusCode":401}));

  Models.uploadData(req)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.downloadData = function downloadData (req, res, next) {
  if (!DISABLE_AUTH && !req.user) return utils.writeJson(res, utils.respondWithCode(401, {"status":"Unauthenticated","statusCode":401}));

  Models.downloadData(req)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
