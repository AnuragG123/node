Certainly! Below is a basic structure for the Terraform code to address the conditions you've outlined. Note that you may need to adjust it based on your specific AWS environment, folder structures, and naming conventions.

```hcl
provider "aws" {
  region = "us-east-1" # Update with the appropriate AWS region
}

resource "aws_lambda_function" "delete_old_data_lambda" {
  function_name    = "delete_old_data_lambda"
  runtime          = "python3.8" # Update with the appropriate runtime
  handler          = "delete_old_data.lambda_handler"
  timeout          = 300 # Set an appropriate timeout
  memory_size      = 256 # Set an appropriate memory size
  role             = aws_iam_role.lambda_execution_role.arn
  source_code_hash = filebase64("${path.module}/lambda_function.zip") # Package your Lambda function code

  environment {
    variables = {
      current_year = "${formatdate("YYYY", timestamp())}" # Get the current year
    }
  }
}

resource "aws_iam_role" "lambda_execution_role" {
  name = "delete_old_data_lambda_role"

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

# Define S3 bucket and prefix to target for data deletion
resource "aws_s3_bucket_object" "delete_old_data_trigger" {
  bucket = "tds-prod-bucket" # Update with the appropriate bucket name
  key    = "converted/" # Update with the appropriate prefix
  source = "${path.module}/empty_file.txt" # Provide an empty file or script to trigger Lambda

  depends_on = [aws_lambda_function.delete_old_data_lambda]
}

resource "aws_lambda_permission" "allow_s3_invoke" {
  statement_id  = "AllowExecutionFromS3"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_old_data_lambda.function_name
  principal     = "s3.amazonaws.com"

  source_arn = aws_s3_bucket_object.delete_old_data_trigger.arn
}
```

This is a basic starting point, and you'll need to enhance it based on your specific requirements and environment. The provided Terraform code includes a Lambda function, an IAM role, and an S3 trigger to invoke the Lambda function when an empty file is placed in the specified S3 prefix. Ensure to replace placeholder values such as bucket names, region, etc., with your actual configuration. Also, adjust the Lambda function code according to your specific logic for identifying and deleting old data based on the given conditions.
