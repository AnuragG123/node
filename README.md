import boto3

import json



# AWS service clients

quicksight = boto3.client('quicksight', region_name='your-region')

secretsmanager = boto3.client('secretsmanager', region_name='your-region')



# Name of the QuickSight data source

data_source_name = 'MyRedshiftDataSource'



# ARN of the AWS Secrets Manager secret containing Redshift credentials

secret_arn = 'arn:aws:secretsmanager:your-region:your-account-id:secret:your-secret-name'



# QuickSight data source configuration for Redshift

data_source_config = {

    'DataSourceId': data_source_name,

    'Name': data_source_name,

    'Type': 'REDSHIFT',

    'RedshiftParameters': {

        'Host': 'your-redshift-host',

        'Port': 5439,  # Change to your Redshift port if it's different

        'Database': 'your-redshift-database',

        'ClusterId': 'your-redshift-cluster-id',

        'AwsSecretStoreArn': secret_arn,

    }

}



# Create the data source

response = quicksight.create_data_source(

    AwsAccountId='your-account-id',

    DataSourceId=data_source_name,

    Name=data_source_name,

    DataSourceParameters=data_source_config,

    Permissions=[

        {

            'Principal': 'arn:aws:quicksight:your-region:your-account-id:namespace/default/your-quick-sight-user',

            'Actions': ['quicksight:DescribeDataSource'],

        },

    ]

)



print(json.dumps(response, indent=4))

