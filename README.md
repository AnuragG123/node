The error you're encountering is due to the Lambda function expecting a handler named `lambda_handler` in the module `lambda_function`, but your code doesn't have it.

To fix this, you can either rename your function to `lambda_handler` or adjust the Lambda function configuration to point to the correct handler.

Here's how you can modify your code to use the `lambda_handler`:

```python
import boto3

def lambda_handler(event, context):
    database_name = "your_database_name"
    result = delete_glue_database(database_name)
    return {
        'statusCode': 200 if result else 500,
        'body': "Database deleted successfully" if result else "Failed to delete database"
    }

def delete_glue_database(database_name):
    try:
        # Initialize Glue client
        glue_client = boto3.client('glue')
        
        # Delete the database
        response = glue_client.delete_database(Name=database_name)
        
        # Check if the operation was successful
        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            print(f"Database '{database_name}' deleted successfully.")
            return True
        else:
            print(f"Failed to delete database '{database_name}'.")
            return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False
```

Ensure that your Lambda function's runtime environment is set to Python and that you have the necessary permissions to perform the `glue:DeleteDatabase` action as indicated in the AccessDeniedException error message.
