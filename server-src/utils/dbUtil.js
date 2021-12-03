var mysql      = require('mysql');
exports.connection = mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  database : 'MLStudio'
});

exports.s3Connection = {
  bucket_name: '',
  iam_user_key: '',
  iam_user_secret: ''
};
