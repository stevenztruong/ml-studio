const cookiepkg = require('cookie');
const jwt = require('jsonwebtoken');
const fs = require('fs');


const CONSTANTS = require('./constants').CONSTANTS;
/**************************************************************/


var certfile = __dirname + '/../keys/private.pem';
var cert;
var pubkeyfile = __dirname + '/../keys/public.pem';
var pubkey;
module.exports.fetchUserInfo = function(req, res, next) {
  if((req.user && req.user.username)) {
    // already fetched..
    if(next) {
        return next();
    }
  }

  var tryCookie = false;
  var parts = req.headers && req.headers.authorization && req.headers.authorization.split(' ');

  if (parts && (parts.length === 2) && parts[0].toLowerCase() === 'bearer') {
    req.user = fetchPayloadFromHeader(req);
  } else {
    req.user = fetchPayloadFromCookie(req);
  }
  return next();
};

var fetchPayloadFromCookie = function (req) {
  let payload;
  const cookies = cookiepkg.parse(req.headers.cookie || '');
  const token = cookies[CONSTANTS.COOKIE_NAME];

  if (token) {
    try {
      payload = jwt.verify(token, pubkey, { algorithms: 'RS256' });
      payload.accessToken = token;
    } catch (err) {
      console.log("FAILED to verify Token");
    }
  }

  return payload;
};

const fetchPayloadFromHeader = function (req) {
  var payload;

  var parts = req.headers.authorization.split(' ');

  if ((parts.length === 2) && (parts[0].toLowerCase() === CONSTANTS.BEARER)) {
    var token = parts[1];

    try {
      payload = jwt.verify(token, pubkey,  {algorithms: 'RS256'});
      payload.accessToken = token;
    } catch (err) {
      console.log("FAILED to verify Token");
    }
  }
  return payload;
};

module.exports.generateToken = function(payload) {
  console.log(payload);
  return jwt.sign(payload, cert,  { algorithm: 'RS256', keyid: CONSTANTS.JWK_DEFAULT_KID, expiresIn: CONSTANTS.TOKEN_EXPIRY }); // nn hours
};

const init = function() {
  cert = fs.readFileSync(certfile);
  pubkey = fs.readFileSync(pubkeyfile);
};

init();
