'use strict';

var utils = require('../utils/writer.js');
var Users = require('../service/UsersService');
const DISABLE_AUTH = process.env.DISABLE_AUTH === 'true';

module.exports.createUser = function createUser (req, res, next) {
  var body = req.swagger.params['body'].value;
  Users.createUser(body)
    .then(function (response) {
      res.statusCode = response.statusCode;
      res.end(JSON.stringify(response));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteUser = function deleteUser (req, res, next) {
  if (!DISABLE_AUTH && req.user.username !== 'superuser') return utils.writeJson(res, utils.respondWithCode(401, {"status":"Unauthenticated","statusCode":401}));

  var username = req.swagger.params['username'].value;
  Users.deleteUser(username)
    .then(function (response) {
      res.statusCode = response.statusCode;
      res.end(JSON.stringify(response));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUserByName = function getUserByName (req, res, next) {
  if (!DISABLE_AUTH && !req.user) return utils.writeJson(res, utils.respondWithCode(401, {"status":"Unauthenticated","statusCode":401}));

  var username = req.swagger.params['username'].value;
  Users.getUserByName(username)
    .then(function (response) {
      res.end(JSON.stringify(response));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.loginUser = function loginUser (req, res, next) {
  var username = req.swagger.params['username'].value;
  var password = req.swagger.params['password'].value;
  Users.loginUser(username,password)
    .then(function (response) {
      res.statusCode = response.statusCode;
      res.end(JSON.stringify(response));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.logoutUser = function logoutUser (req, res, next) {
  Users.logoutUser()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateUser = function updateUser (req, res, next) {
  if (!DISABLE_AUTH && !req.user) return utils.writeJson(res, utils.respondWithCode(401, {"status":"Unauthenticated","statusCode":401}));

  var username = req.swagger.params['username'].value;
  var body = req.swagger.params['body'].value;
  Users.updateUser(username,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
