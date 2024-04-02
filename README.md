To send an email notification for every deletion of data to the specified email addresses, you can modify the script to include the email sending functionality. Here's the updated script:

```python
import boto3
from datetime import datetime, timedelta
from botocore.exceptions import ClientError

def delete_old_folders(bucket_name, prefix, older_than_years=8):
    s3 = boto3.client('s3')
    deleted_objects = []

    # Calculate cutoff date
    cutoff_date = datetime.now() - timedelta(days=older_than_years*365)

    # List objects in the bucket with the given prefix
    response = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)

    # Iterate through objects and delete those older than cutoff date
    if 'Contents' in response:
        for obj in response['Contents']:
            key = obj['Key']
            folder_year = key.split('=')[1][:4]  # Extract year from folder name
            folder_date = datetime.strptime(folder_year, "%Y")
            
            if folder_date < cutoff_date:
                print(f"Deleting object: {key}")
                s3.delete_object(Bucket=bucket_name, Key=key)
                deleted_objects.append(key)
    
    return deleted_objects

def send_email_notification(deleted_objects):
    SENDER = "your_ses_verified_email@example.com"
    RECIPIENTS = ["anurag@gmail.com", "gou@gmail.com"]
    SUBJECT = "Data Deletion Notification"
    CHARSET = "UTF-8"

    # Create email body
    email_body = f"The following objects have been deleted:\n\n"
    for obj in deleted_objects:
        email_body += f"- {obj}\n"

    # Create the email message
    email_message = {
        'Subject': {'Data': SUBJECT, 'Charset': CHARSET},
        'Body': {'Text': {'Data': email_body, 'Charset': CHARSET}}
    }

    # Create a new SES client
    ses_client = boto3.client('ses')

    # Try to send the email
    try:
        # Provide the contents of the email
        response = ses_client.send_email(
            Destination={'ToAddresses': RECIPIENTS},
            Message=email_message,
            Source=SENDER
        )
    # Display an error if something goes wrong
    except ClientError as e:
        print(f"Error sending email: {e.response['Error']['Message']}")
    else:
        print("Email sent successfully")

# Example usage
if __name__ == "__main__":
    bucket_name = 'your_bucket_name'
    prefix = 'converted/'
    deleted_objects = delete_old_folders(bucket_name, prefix)
    if deleted_objects:
        print("Deleted objects:")
        for obj in deleted_objects:
            print(obj)
        send_email_notification(deleted_objects)
    else:
        print("No objects deleted.")
```

Ensure to replace `'your_bucket_name'` with your actual S3 bucket name, and set `'your_ses_verified_email@example.com'` to your SES verified email address. This script will send an email notification listing the deleted objects to the specified email addresses every time an object is deleted.
