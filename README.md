
import boto3
import json
import logging
import os

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize the AWS SDK clients
quicksight = boto3.client('quicksight')
secretsmanager = boto3.client('secretsmanager')

def get_secret(secret_name):
    try:
        response = secretsmanager.get_secret_value(SecretId=secret_name)
        secret = json.loads(response['SecretString'])
        return secret
    except Exception as e:
        logger.error(f"Error retrieving secret: {str(e)}")
        return None

def lambda_handler(event, context):
    # Replace with your Secret Manager secret name
    secret_name = "your-secret-name"

    # Retrieve the secret containing QuickSight credentials from Secrets Manager
    secret = get_secret(secret_name)

    if not secret:
        return {
            "statusCode": 500,
            "body": "Error retrieving secret"
        }

    # Extract credentials from the secret
    quicksight_username = secret.get("quicksight_username")
    quicksight_password = secret.get("quicksight_password")

    # Use the credentials to create or update a QuickSight data source
    try:
        response = quicksight.create_data_source(
            AwsAccountId=os.environ['AWS_ACCOUNT_ID'],
            DataSourceId='your-data-source-id',
            Name='Your DataSource Name',
            Type='REDSHIFT',
            DataSourceParameters={
                'RedshiftParameters': {
                    'Host': 'your-redshift-cluster-hostname',
                    'Port': 5439,
                    'Database': 'your-database-name',
                    'ClusterId': 'your-redshift-cluster-id'
                }
            },
            Credentials={
                'CredentialPair': {
                    'Username': quicksight_username,
                    'Password': quicksight_password
                }
            },
            Permissions=[
                {
                    'Principal': 'arn:aws:quicksight:your-region:your-account-id:group/YourQuickSightGroup',
                    'Actions': [
                        'quicksight:DescribeDataSource',
                        'quicksight:UpdateDataSource',
                        'quicksight:DeleteDataSource',
                        'quicksight:CreateDataSource',
                    ]
                },
            ]
        )
        logger.info(f"DataSource created: {response}")
        return {
            "statusCode": 200,
            "body": "DataSource created successfully"
        }
    except Exception as e:
        logger.error(f"Error creating DataSource: {str(e)}")
        return {
            "statusCode": 500,
            "body": "Error creating DataSource"
        }
        
