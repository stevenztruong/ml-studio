var mysql      = require('mysql');
exports.connection = mysql.createConnection({
  host     : 'mlstudiodb.ckvefk2xly8m.us-west-1.rds.amazonaws.com',
  user     : 'mlstudioadmin',
  password : 'dbformlstudio',
  database : 'MLStudio'
});
