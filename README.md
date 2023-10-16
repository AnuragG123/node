import boto3

import json

import logging

import os



# Set up logging

logger = logging.getLogger()

logger.setLevel(logging.INFO)



# Initialize the AWS SDK clients

quicksight_client = boto3.client('quicksight')

secretsmanager_client = boto3.client('secretsmanager')



def get_secret_arn(secret_name):

    try:

        response = secretsmanager_client.describe_secret(SecretId=secret_name)

        secret_arn = response['ARN']

        logger.info(secret_arn)

        return secret_arn

    except Exception as e:

        logger.error(f"Error retrieving secret: {str(e)}")

        return {

            "statusCode": 500,

            "body": "Error retrieving secret"

        }



def lambda_handler(event, context):

    # Retrieve environment variables

    secret_name = os.environ.get('SECRET_NAME')

    aws_account_id = os.environ.get('AWS_ACCOUNT_ID')

    data_source_id = os.environ.get('DATA_SOURCE_ID')

    data_source_name = os.environ.get('DATA_SOURCE_NAME')

    redshift_cluster_hostname = os.environ.get('REDSHIFT_CLUSTER_HOSTNAME')

    redshift_database_name = os.environ.get('REDSHIFT_DATABASE_NAME')

    redshift_cluster_id = os.environ.get('REDSHIFT_CLUSTER_ID')

    quicksight_group_arn = os.environ.get('QUICKSIGHT_GROUP_ARN')



    # Retrieve the secret containing QuickSight credentials from Secrets Manager

    secret_arn = get_secret_arn(secret_name)



    try:

        quicksight_response = quicksight_client.create_data_source(

            AwsAccountId=aws_account_id,

            DataSourceId=data_source_id,

            Name=data_source_name,

            Type='REDSHIFT',

            DataSourceParameters={

                'RedshiftParameters': {

                    'Host': redshift_cluster_hostname,

                    'Port': 5439,

                    'Database': redshift_database_name,

                    'ClusterId': redshift_cluster_id

                }

            },

            Credentials={

                'SecretArn': secret_arn

            },

            Permissions=[

                {

                    'Principal': quicksight_group_arn,

                    'Actions': [

                        'quicksight:DescribeDataSource',

                        'quicksight:UpdateDataSource',

                        'quicksight:DeleteDataSource',

                        'quicksight:CreateDataSource',

                    ]

                },

            ]

        )

        logger.info(f"DataSource created: {quicksight_response}")

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







import boto3

import logging



# Set up logging

logger = logging.getLogger()

logger.setLevel(logging.INFO)



# Initialize the AWS SDK clients

secretsmanager_client = boto3.client('secretsmanager')



def get_secret_arn(secret_name):

    try:

        response = secretsmanager_client.describe_secret(SecretId=secret_name)

        secret_arn = response['ARN']

        logger.info(f"Secret ARN for {secret_name}: {secret_arn}")

        return secret_arn

    except Exception as e:

        logger.error(f"Error retrieving secret {secret_name}: {str(e)}")

        return None



def lambda_handler(event, context):

    # Replace with your list of Secret Manager secret names

    secret_names = ["your-secret-name1", "your-secret-name2", "your-secret-name3"]

    

    # Initialize an empty list to store the Secret ARNs

    secret_arns = []

    

    # Retrieve the Secret ARNs for each secret name

    for secret_name in secret_names:

        secret_arn = get_secret_arn(secret_name)

        if secret_arn:

            secret_arns.append(secret_arn)

    

    if secret_arns:

        # Do something with the list of Secret ARNs (e.g., use them in your application)

        # Example: You can pass the list of Secret ARNs to other functions or services.

        

        # For demonstration purposes, let's log the list of Secret ARNs.

        logger.info("List of Secret ARNs:")

        for secret_arn in secret_arns:

            logger.info(secret_arn)

        

        return {

            "statusCode": 200,

            "body": "Secret ARNs retrieved successfully"

        }

    else:

        return {

            "statusCode": 500,

            "body": "Error retrieving Secret ARNs"

        }

