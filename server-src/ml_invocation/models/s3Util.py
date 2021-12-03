import boto3
import io
import botocore
import os
from botocore.exceptions import NoCredentialsError

BUCKET_NAME = 'mlstudio-bucket'

client = boto3.client(
's3',
aws_access_key_id='',
aws_secret_access_key=''
)

def uploadFile(filePath, objName):
    try:
        client.upload_file(filePath, BUCKET_NAME, os.getenv("userId")+"/"+objName)
        print("Upload Successful")
        return True
    except FileNotFoundError:
        print("The file was not found")
        return False
    except NoCredentialsError:
        print("Credentials not available")
        return False

def getFile(objName):
    print("object name: " + str(objName))
    io_stream = io.BytesIO()
    try:
        client.download_fileobj(BUCKET_NAME, os.getenv("userId")+"/"+objName, io_stream)
        # seek back to the beginning of the file
        io_stream.seek(0)
        data = io_stream.read()
        return data
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "404":
            print("The object does not exist.")
        else:
            raise e

def downloadFile(objName):
    try:
        client.download_file(BUCKET_NAME, objName, 'myfile.txt')
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "404":
            print("The object does not exist.")
        else:
            raise e


# s3 = boto3.resource(
#     's3',
#     aws_access_key_id=ACCESS_KEY_ID,
#     aws_secret_access_key=ACCESS_SECRET_KEY,
#     config=Config(signature_version='s3v4')
# )
# s3.Bucket(BUCKET_NAME).put_object(Key=filePath, Body=data)
