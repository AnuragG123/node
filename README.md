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
