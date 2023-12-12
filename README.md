To create an API with Python and Terraform for deleting data in an S3 bucket named "Ganesh," and sending email notifications to both "anu@gmail.com" and "godi@gmail.com," you can use AWS Lambda, API Gateway, and SES (Simple Email Service). Below is a simplified example:

### 1. Python Script (`delete_old_data.py`):

```python
import boto3
from datetime import datetime, timedelta
import os
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def lambda_handler(event, context):
    # Replace with your S3 bucket name and prefix
    bucket_name = 'Ganesh'
    prefix = 'converted/'

    # Delete old data
    deleted_objects = delete_old_data(bucket_name, prefix)

    # Send email notification
    subject = 'S3 Data Deletion Notification'
    body = f'Old data with prefix "{prefix}" deleted from S3 bucket "{bucket_name}".\nDeleted Objects: {deleted_objects}'
    to_emails = ['anu@gmail.com', 'godi@gmail.com']

    send_email(subject, body, to_emails)

    return {
        'statusCode': 200,
        'body': json.dumps('Data deletion and email notification successful!')
    }

def delete_old_data(bucket_name, prefix):
    s3 = boto3.client('s3')

    # Calculate the date threshold (8+ years ago)
    threshold_date = datetime.now() - timedelta(days=8 * 365)

    # List objects in the S3 bucket
    objects = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)

    # Delete objects older than the threshold date
    deleted_objects = []
    for obj in objects.get('Contents', []):
        last_modified = obj['LastModified'].replace(tzinfo=None)
        if last_modified < threshold_date:
            s3.delete_object(Bucket=bucket_name, Key=obj['Key'])
            deleted_objects.append(obj['Key'])

    return deleted_objects

def send_email(subject, body, to_emails):
    # Replace with your SES configuration
    ses = boto3.client('ses', region_name='your_aws_region')

    # Setup the MIME
    message = MIMEMultipart()
    message['Subject'] = subject
    message.attach(MIMEText(body, 'plain'))

    # Send email to each recipient
    for to_email in to_emails:
        message['To'] = to_email
        ses.send_raw_email(
            Source='your_ses_verified_email@example.com',
            Destinations=[to_email],
            RawMessage={'Data': message.as_string()}
        )
```

### 2. Terraform Script (`main.tf`):

```hcl
provider "aws" {
  region = "your_aws_region"
}

# Lambda function to execute the Python script
resource "aws_lambda_function" "delete_old_data" {
  function_name = "delete_old_data"
  handler      = "delete_old_data.lambda_handler"
  runtime      = "python3.8"
  filename     = "delete_old_data.zip"  # Ensure you create a zip file with your Python script
  source_code_hash = filebase64("delete_old_data.zip")

  environment = {
    variables = {
      BUCKET_NAME = "Ganesh",
      PREFIX      = "converted/"
    }
  }

  role = aws_iam_role.lambda_execution.arn
}

# IAM Role for Lambda function
resource "aws_iam_role" "lambda_execution" {
  name = "lambda_execution_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

# IAM Policy for Lambda function
resource "aws_iam_policy" "lambda_policy" {
  name        = "lambda_policy"
  description = "Policy for Lambda function"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::Ganesh",
        "arn:aws:s3:::Ganesh/*"
      ]
    }
  ]
}
EOF
}

# Attach IAM policy to the Lambda execution role
resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  policy_arn = aws_iam_policy.lambda_policy.arn
  role       = aws_iam_role.lambda_execution.name
}

# SES verified email
resource "aws_ses_domain_identity" "my_identity" {
  domain = "example.com"  # Replace with your domain
}

# API Gateway to trigger Lambda function
resource "aws_api_gateway_rest_api" "my_api" {
  name        = "my_api"
  description = "API for deleting old S3 data"
}

resource "aws_api_gateway_resource" "resource" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  parent_id   = aws_api_gateway_rest_api.my_api.root_resource_id
  path_part   = "delete"
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = aws_api_gateway_rest_api.my_api.id
  resource_id   = aws_api_gateway_resource.resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_rest_api.my_api.id
  resource_id             = aws_api_gateway_resource.resource.id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.delete_old_data.invoke_arn
}

resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [aws_api_gateway_integration.integration]

  rest_api_id = aws_api_gateway_rest_api.my_api.id
  stage_name  = "prod"
}

output "api_url" {
  value = aws_api_gateway_deployment.deployment.invoke_url
}
```

### 3. Deploy the Solution:

1. Run `terraform init` to initialize your Terraform configuration.
2. Run `terraform apply` to deploy the infrastructure.
3. Note the API endpoint URL (`api_url`) provided in the Terraform output.
4. Ensure your SES domain is properly verified, and replace the SES configurations accordingly.
5. You can send a POST request to the API endpoint to trigger the Lambda function, which will delete old data and send email notifications to "anu@gmail.com" and "godi@gmail.com."

Remember, this is a basic example, and you may need to adapt it based on your specific use case, security considerations, and best practices. Ensure to handle sensitive information securely and follow AWS security recommendations.
