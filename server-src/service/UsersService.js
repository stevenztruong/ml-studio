'use strict';

var dbConnection = require('../utils/dbUtil').connection;
const authUtils = require('../utils/authUtils');

/**
 * Create user
 * This can only be done by the logged in user.
 *
 * body User Created user object
 * no response value expected for this operation
 **/
exports.createUser = function(body) {
  return new Promise(function(resolve, reject) {
    console.log(body.username);
    // dbConnection.connect();
    dbConnection.query(`INSERT INTO User (fullName, userName, password, email) VALUES ("${body.fullName}", "${body.username}", "${body.password}", "${body.email}")`, function (error, results, fields) {
      console.log(error);
      if (error) return resolve({"status":error.code,"message":error.sqlMessage,"statusCode":409});
      resolve();
    });

    // dbConnection.end();
  });
}


/**
 * Delete user
 * This can only be done by the logged in user.
 *
 * username String The name that needs to be deleted
 * no response value expected for this operation
 **/
exports.deleteUser = function(username) {
  return new Promise(function(resolve, reject) {
    console.log(username);
    // dbConnection.connect();
    dbConnection.query(`DELETE FROM User WHERE userName = "${username}"`, function (error, results, fields) {
      console.log(error);
      if (results.affectedRows == 0) return resolve({"status":"User not found","statusCode":404})
      resolve();
    });
  });
}


/**
 * Get user by user name
 *
 *
 * username String The name that needs to be fetched. Use user1 for testing.
 * returns User
 **/
exports.getUserByName = function(username) {
  return new Promise(function(resolve, reject) {
    // dbConnection.connect();
    dbConnection.query(`SELECT * from User where userName="${username}"`, function (error, results, fields) {
      console.log(error);
      if (error) return resolve({"status":error.code,"message":error.sqlMessage,"statusCode":500});
      console.log(results);
      resolve(results);
    });

    // dbConnection.end();
  });
}


/**
 * Logs user into the system
 *
 *
 * username String The user name for login
 * password String The password for login in clear text
 * returns String
 **/
exports.loginUser = function(username,password) {
  return new Promise(function(resolve, reject) {
    dbConnection.query(`SELECT * from User where userName="${username}"`, function (error, results, fields) {
      console.log(error);
      if (error) return resolve({"status":error.code,"message":error.sqlMessage,"statusCode":500});
      var user = results[0];
      if (results.length < 1 || user.password !== password) return resolve({"status":"Unauthenticated","statusCode":401});
      user.sub = user.username;
      delete user.password;

      const jwtPayload = {
        id: user.id,
        fullName: user.fullName,
        username: user.userName,
        email: user.email,
        sub: user.userName
      };
      //generate token with user's profile
      const token = authUtils.generateToken(jwtPayload);

      resolve({"status":"Authenticated","statusCode":200,"accessToken": token});
    });
  });
}

/**
 * Logs out current logged in user session
 *
 *
 * no response value expected for this operation
 **/
exports.logoutUser = function() {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Updated user
 * This can only be done by the logged in user.
 *
 * username String name that need to be updated
 * body User Updated user object
 * no response value expected for this operation
 **/
exports.updateUser = function(username,body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}
