import json
import boto3
import time

ec2 = boto3.client('ec2')

def lambda_handler(event, context):
    # Get the AMI ID from the event or set it manually
    source_ami_id = event.get('source_ami_id', 'ami-xxxxxxxxxxxxxx')  # Replace with the source AMI ID
    
    # Name and description for the new copied AMI
    new_ami_name = event.get('new_ami_name', f'copy-of-{source_ami_id}-{int(time.time())}')
    new_ami_description = event.get('new_ami_description', f'Copy of AMI {source_ami_id}')
    
    try:
        # Copy the AMI
        response = ec2.copy_image(
            SourceRegion='us-west-2',  # Change this to the correct source region
            SourceImageId=source_ami_id,
            Name=new_ami_name,
            Description=new_ami_description
        )
        
        # Return success message with new AMI ID
        return {
            'statusCode': 200,
            'body': json.dumps(f'New AMI created with ID: {response["ImageId"]}')
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error copying AMI: {str(e)}')
        }
