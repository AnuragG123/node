# Sample payload data

payload = {

    "secret_name": "your-secret-name",

    "data_source_id": "your-data-source-id",

    "data_source_name": "Your DataSource Name",

    "redshift_cluster_hostname": "your-redshift-cluster-hostname",

    "redshift_database_name": "your-database-name",

    "redshift_cluster_id": "your-redshift-cluster-id",

    "quicksight_group_arn": "arn:aws:quicksight:your-region:your-account-id:group/YourQuickSightGroup"

}



# Call the create_quicksight_data_source function with the payload

response = create_quicksight_data_source(**payload)

print(response)





import json

import boto3



def handler(event, context):

    # Generate the payload with the required data

    payload = {

        "quicksight_data_source": "your_data_source_value",

        "quicksight_group_arn": "your_group_arn",

        "vpc_connection_arn": "your_vpc_connection_arn"

    }



    # Trigger Lambda B with the payload

    lambda_client = boto3.client('lambda')

    lambda_name = "lambda_b"  # Replace with your Lambda B function name

    lambda_client.invoke(

        FunctionName=lambda_name,

        InvocationType='Event',

        Payload=json.dumps(payload)

    )



    return {

        "statusCode": 200,

        "body": json.dumps("Lambda A executed successfully and triggered Lambda B.")

    }

