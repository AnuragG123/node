import boto3

import json



def connect_quicksight_datasource_and_secretsmanager():

    """Connects QuickSight datasource and SecretsManager."""



    # Create a SecretsManager client.

    client = boto3.client('secretsmanager')



    # Get the secret from SecretsManager.

    secret = client.get_secret_value(SecretId='quicksight-datasource-secret')



    # Parse the secret JSON.

    secret_json = json.loads(secret['SecretString'])



    # Create a QuickSight client.

    quicksight_client = boto3.client('quicksight')



    # Connect to the QuickSight datasource.

    quicksight_client.connect_data_source(

        DataSourceId='quicksight-datasource-id',

        DataSourceCredentials={

            'Username': secret_json['username'],

            'Password': secret_json['password'],

        },

    )



    # Verify that the connection was successful.

    response = quicksight_client.describe_data_source(DataSourceId='quicksight-datasource-id')

    if response['Status'] == 'CONNECTED':

        print('Connection successful!')

    else:

        print('Connection failed!')





if __name__ == '__main__':

    connect_quicksight_datasource_and_secretsmanager()

