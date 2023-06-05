Redshift cluster:

resource "aws_redshift_cluster" "example" {

  cluster_identifier      = "my-redshift-cluster"

  database_name           = "my_database"

  master_username         = "admin"

  master_password         = "password"

  node_type               = "dc2.large"

  cluster_type            = "single-node"

  publicly_accessible    = false  # Set to true if you want the cluster to be publicly accessible

  iam_roles               = ["arn:aws:iam::123456789012:role/RedshiftRole"]

}

create a Secrets Manager secret:

resource "aws_secretsmanager_secret" "redshift_secret" {

  name = "redshift_secret"

}

resource "aws_secretsmanager_secret_version" "redshift_secret_version" {

  secret_id     = aws_secretsmanager_secret.redshift_secret.id

  secret_string = jsonencode({

    "username"    = "admin",

    "password"    = "password",

    "host"        = aws_redshift_cluster.example.endpoint

    "port"        = aws_redshift_cluster.example.endpoint

    "database"    = "my_database"

  })

}

create an IAM role and attach the necessary policies for Secrets Manager and Redshift:

resource "aws_iam_role" "redshift_iam_role" {

  name = "redshift_iam_role"

  assume_role_policy = jsonencode({

    "Version": "2012-10-17",

    "Statement": [

      {

        "Effect": "Allow",

        "Principal": {

          "Service": "redshift.amazonaws.com"

        },

        "Action": "sts:AssumeRole"

      }

    ]

  })

}

resource "aws_iam_role_policy_attachment" "redshift_secrets_manager_policy_attachment" {

  role       = aws_iam_role.redshift_iam_role.name

  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"

}

resource "aws_iam_role_policy_attachment" "redshift_s3_read_policy_attachment" {

  role       = aws_iam_role.redshift_iam_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"

}

resource "aws_redshift_cluster_iam_role" "redshift_iam_role_attachment" {

  cluster_identifier = aws_redshift_cluster.example.cluster_identifier

  iam_role           = aws_iam_role.redshift_iam_role.arn

}

Verify the Redshift cluster and Secrets Manager integration

Once the Terraform apply command completes successfully, your Redshift cluster and Secrets Manager secret should be created.

You can log in to the AWS Management Console, navigate to the Redshift service, and verify the creation of your cluster.

In the Secrets Manager service, you should see the secret named "redshift_secret" with a version containing the connection details.

You can retrieve the connection details programmatically using the AWS SDK or AWS CLI, or by manually checking the Secrets Manager console.

That's it! You have successfully created an AWS Redshift cluster, connected it to Secrets Manager, and configured the necessary permissions and variables using Terraform
