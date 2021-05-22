var mysql      = require('mysql');
exports.connection = mysql.createConnection({
  host     : 'mlstudio-database-instance-1.c11aba7kcep9.us-west-2.rds.amazonaws.com',
  user     : 'mlstudioadmin',
  password : 'dbformlstudio',
  database : 'MLStudio'
});
