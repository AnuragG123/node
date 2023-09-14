          Connecting Quicksight with SecretsManager

Introduction:

AWS Secrets Manager is a service that helps to manage secrets securely. A secret is a piece of sensitive data, such as a password, access key, or SSH key. Secrets Manager can store secrets in a secure and encrypted format, and it can rotate secrets automatically.

QuickSight is a business intelligence service that allows to analyse data and create visualizations. QuickSight can connect to a variety of data sources, including Amazon S3, Amazon Redshift, and Microsoft SQL Server.

This document describes how to connect QuickSight and Secrets Manager and sync the credentials.

Context:

In order to connect QuickSight and Secrets Manager, DevOps need to first create a secret in Secrets Manager that contains the database credentials. DevOps can then select this secret in QuickSight. QuickSight will create an IAM role called aws-quicksight-secretsmanager-role-v0 in your account. This role grants users in the account read-only access to the specified secrets.

When a QuickSight user creates an analysis from or views a dashboard that uses a data source with secrets, QuickSight assumes the aws-quicksight-secretsmanager-role-v0 IAM role. This role allows QuickSight to access the secret and retrieve the database credentials.

To ensure that QuickSight can automatically sync the credentials whenever they are rotated, you need to attach a rotation schedule to the secret.

Benefits:

There are several benefits to connecting QuickSight and Secrets Manager:

•	Security: Secrets Manager helps you store secrets securely. The secrets are encrypted at rest and in transit.

•	Compliance: Secrets Manager can help you meet your compliance requirements. For example, you can use Secrets Manager to store secrets that are required to be encrypted by a specific compliance standard.

•	Automation: Secrets Manager can automatically rotate secrets. This helps you to keep your secrets up-to-date and secure.

•	Centralization: Secrets Manager can centralize the management of secrets. This makes it easier to manage and audit your secrets.

Advantages and Disadvantages:

Here are some of the advantages and disadvantages of connecting QuickSight and Secrets Manager:

Advantages:

•	Security: Secrets Manager helps you store secrets securely.

•	Compliance: Secrets Manager can help you meet your compliance requirements.

•	Automation: Secrets Manager can automatically rotate secrets.

•	Centralization: Secrets Manager can centralize the management of secrets.

Disadvantages:

•	Cost: There is a cost associated with using Secrets Manager.

•	Complexity: Secrets Manager can be complex to set up and use.



How to connect QuickSight and Secrets Manager in Console

Step 1: Create a Secret in AWS Secrets Manager

Sign in to AWS Console: Open the web browser and sign in to the AWS Management Console.

Navigate to AWS Secrets Manager: In the AWS Management Console, navigate to the AWS Secrets Manager service. DevOps can find it under the "Security, Identity, & Compliance" section or simply search for "Secrets Manager" in the search bar.

Create a New Secret: Click the "Store a new secret" button to begin creating a new secret.

Choose Secret Type: Select the type of secret DevOps want to create based on the data source. For example, if DevOps are storing a database password, choose "Credentials for Redshift." If it's an API key or other sensitive information, choose "Other type of secrets."

Configure Secret Details: Fill in the required details for the secret. This may include the secret name, user name (if applicable), and the sensitive information (e.g., password or API key). Ensure DevOps provide a meaningful name for the secret as it will be used later when configuring QuickSight.

Review and Create: Review the secret configuration to ensure it's accurate. Click "Next" to proceed, and then click "Store" to create the secret.

Step 2: Grant QuickSight Access to the Secret

"Let's begin with the first step: granting Amazon QuickSight access to our secrets stored in AWS Secrets Manager."

"To do this, you'll need to navigate within Amazon QuickSight to 'Manage QuickSight' and then 'Security & permissions.'"

"Inside 'Security & permissions,' you'll find the option 'Manage in QuickSight access to AWS resources.' This is where the magic happens.

"Step 3: IAM Role Creation

"Once you've specified which secrets QuickSight can access, QuickSight automatically creates an IAM role for you."

"This IAM role, known as 'aws-quicksight-secretsmanager-role-v0,' is your gatekeeper. It grants read-only access to the secrets you've selected."

"The role comes with an associated IAM policy that defines what actions it can perform and what resources it can access."



Step 4: Configure Amazon QuickSight Data Source

Now that you've created the secret and granted QuickSight access to it, you can configure your data source in Amazon QuickSight:

Open Amazon QuickSight Console: Log in to the Amazon QuickSight console using your AWS account credentials.

Create or Edit Data Source: Depending on your use case, you can either create a new data source or edit an existing one. To create a new data source, click "New data source"; to edit an existing one, select it and click "Edit data source."

Select Authentication Method: In the data source configuration, under the authentication section, select "AWS Secrets Manager" as the authentication method.

Choose Secret: From the dropdown list, choose the secret that you created earlier in Step 1. This associates the secret with this data source.

Configure Data Source Settings: Depending on your data source type (e.g., Redshift, RDS, S3, etc.), configure the necessary settings such as the connection details, database name, and query options.

Test Connection: Optionally, you can test the data source connection to ensure it's working correctly.

Save Configuration: Once you've configured all the data source settings, click "Create" or "Save" to save the data source configuration.

Step 5: Permissions and Security

"Let's talk permissions and security within this integration."

"Permissions for secret access are governed by IAM policies. However, here's a key point: permissions are based on the IAM policies of the person making the API call, not the IAM service role's policy."

The IAM service role acts on the account level and is used when an analysis or dashboard is viewed by a user. It can’t be used to authorize secret access when a user creates or updates the data source.

"Users can view the secret ARN in the QuickSight interface, but they can't edit it or access the secrets directly. This adds an extra layer of security.



"Here are some additional things to keep in mind:

o	If you are using a customer managed KMS key to encrypt your secret, ensure that the QuickSight IAM role, aws-quicksight-secretsmanager-role-v0 has kms:Decrypt permissions.

o	You can also use Secrets Manager to store other types of secrets, such as API keys and SSH keys.



Troubleshooting:

If you are having trouble connecting QuickSight and Secrets Manager, here are some things you can check:

•	Make sure that you have created a secret in Secrets Manager that contains the database credentials.

•	Make sure that you have selected the secret in QuickSight.

•	Make sure that the aws-quicksight-secretsmanager-role-v0 IAM role has the necessary permissions.

If you are still having trouble, you can contact AWS Support.



Conclusion:

Connecting QuickSight and Secrets Manager is a secure and efficient way to manage secrets for your QuickSight data sources. By following the steps in this document, you can easily connect the two services and ensure that your secrets are always up-to-date and secure.



