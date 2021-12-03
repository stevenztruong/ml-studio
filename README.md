# Database configuration:
1/ Create MySQL database instance on AWS RDS:  
1.1/ Under "Settings", specify the "DB instance identifier", "master username" and "master password"  
1.2/ Under "Connectivity", set public access to "Yes"  
1.3/ Under "Database authentication", use "Password authentication"  
1.4/ Keep the rest as default  
2/ After the db instance is deployed and running, connect to your db instance using the endpoint under "Connectivity & security" as host, port #, master username and master password  
3/ Execute the following SQL statements:
``` sql
CREATE DATABASE MLStudio;
use MLStudio;
CREATE TABLE User (
    id int AUTO_INCREMENT PRIMARY KEY, 
    fullName varchar(50) NOT NULL, 
    userName varchar(20) NOT NULL UNIQUE,   
    password varchar(50) NOT NULL,   
    email varchar(50) NOT NULL 
);
CREATE TABLE Model (
    id int AUTO_INCREMENT PRIMARY KEY,   
    userId int,   
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,  
    modelName varchar(20) NOT NULL,   
    modelType varchar(10) NOT NULL,   
    status varchar(10) DEFAULT 'Unknown',   
    parms text 
);
CREATE TABLE Deployment (   
    id int AUTO_INCREMENT PRIMARY KEY,   
    userId int,   
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,     
    modelId int,   
    FOREIGN KEY (modelId) REFERENCES Model(id) ON DELETE CASCADE,       
    deployName varchar(50) NOT NULL,   
    status varchar(10) DEFAULT 'Unknown',   
    description text 
);
```
4/ Replace the following line of code in `/server-src/utils/dbUtil.js`
``` javascript
  host     : 'replace with db instance endpoint under "Connectivity & security"',
  user     : 'replace with master username',
  password : 'replace with master password',
```

# AWS IAM configuration to access AWS S3:
1/ "Add users" under IAM dashboard  
1.1/ Under "Set user details", specify "User name"  
1.2/ Select AWS credential type as "Access key - Programmatic access"  
1.3/ Under "Set permissions", click on "Attach existing policies directly". Search for "AmazonS3FullAccess" and select it  
1.4/ After created the user, remember the "Access key ID" and "Secret access key"  
2/ Under IAM > Users, click on the newly created user, remember the "User ARN" under "Summary" to be use to set up AWS S3 policy later  

# AWS S3 configuration:
1/ Create AWS S3 bucket  
1.1/ Under "General configuration", specify "Bucket name"  
1.2/ Keep the rest as default  
2/ After S3 bucket is created, click on your bucket and remember the bucket ARN  
3/ Go to "Permissions", edit "Bucket policy", replace the following json with your info and paste it under the policy editor then save it  
``` json
{
	"Version": "2012-10-17",
	"Id": "PolicyId1",
	"Statement": [
		{
			"Sid": "PublicPolicy",
			"Effect": "Allow",
			"Principal": {
				"AWS": "Replace this with your User ARN"
			},
			"Action": [
				"s3:ListBucket",
				"s3:ListBucketVersions",
				"s3:GetBucketLocation",
				"s3:Get*",
				"s3:Put*"
			],
			"Resource": "Replace this with your bucket ARN"
		}
	]
}
```

Backend code goes to `server-src`.

Frontend code goes to `client-src`.
