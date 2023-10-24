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



# AWS Provider Configuration



provider "aws" {

  region = "us-east-1"  # Change to your desired region

}



# Lambda Function A

resource "aws_lambda_function" "lambda_a" {

  function_name = "lambda_a"

  handler      = "lambda_a.handler"

  runtime      = "python3.8"

  role        = aws_iam_role.lambda_execution_role.arn

  # Add your function code and other configuration here

}



# Lambda Function B

resource "aws_lambda_function" "lambda_b" {

  function_name = "lambda_b"

  handler      = "lambda_b.handler"

  runtime      = "python3.8"

  role        = aws_iam_role.lambda_execution_role.arn

  # Add your function code and other configuration here

}



# IAM Role for Lambda Execution

resource "aws_iam_role" "lambda_execution_role" {

  name = "lambda_execution_role"



  assume_role_policy = jsonencode({

    Version = "2012-10-17",

    Statement = [

      {

        Action = "sts:AssumeRole",

        Effect = "Allow",

        Principal = {

          Service = "lambda.amazonaws.com"

        },

      },

    ],

  })

}



# Lambda A EventBridge Rule

resource "aws_cloudwatch_event_rule" "lambda_a_rule" {

  name        = "lambda_a_rule"

  description = "Trigger Lambda A"

  event_pattern = jsonencode({

    # Define your event pattern here, e.g., custom event or AWS service event

  })

}



resource "aws_cloudwatch_event_target" "lambda_a_target" {

  rule      = aws_cloudwatch_event_rule.lambda_a_rule.name

  target_id = "lambda_a_target"

  arn       = aws_lambda_function.lambda_a.arn

}



# Lambda A invokes Lambda B with the payload

resource "aws_lambda_permission" "invoke_lambda_b" {

  statement_id  = "InvokePermission"

  action        = "lambda:InvokeFunction"

  function_name = aws_lambda_function.lambda_b.arn

  principal     = "events.amazonaws.com"

}



# EventBridge Event Bus (if needed)

resource "aws_cloudwatch_event_bus" "my_event_bus" {

  name = "my_event_bus"

}



# Configure EventBridge event to trigger Lambda B

resource "aws_cloudwatch_event_rule" "lambda_b_rule" {

  name        = "lambda_b_rule"

  description = "Trigger Lambda B"

  event_bus_name = aws_cloudwatch_event_bus.my_event_bus.name

  event_pattern = jsonencode({

    source      = ["custom.myapp"],

    detail_type = ["my.custom.event"],

  })

}



resource "aws_cloudwatch_event_target" "lambda_b_target" {

  rule      = aws_cloudwatch_event_rule.lambda_b_rule.name

  target_id = "lambda_b_target"

  arn       = aws_lambda_function.lambda_b.arn

}



