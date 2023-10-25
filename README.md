case 1 :

Certainly! You can use Terraform to automate the deployment of a Jupyter Notebook instance. You’d generally do this by creating necessary infrastructure like a Virtual Machine, installing the required packages, and setting up the appropriate network configurations. Below is a simplified example of how you might do this using a Terraform script to set up a Jupyter Notebook on an AWS EC2 instance.

1. **Prerequisites:**
   - Install Terraform.
   - Configure AWS CLI.

2. **Terraform Script (`main.tf`):**
```hcl
provider "aws" {
  region = "us-west-1"
}

resource "aws_instance" "jupyter_instance" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "JupyterNotebook"
  }

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y python3-pip
              pip3 install notebook
              EOF
}

output "public_ip" {
  value = aws_instance.jupyter_instance.public_ip
}
```

3. **Initialize and Apply:**
   - Run `terraform init` to initialize the configuration.
   - Run `terraform apply` to create the infrastructure.

4. **Access Jupyter Notebook:**
   - SSH into the created EC2 instance.
   - Run `jupyter notebook --ip=0.0.0.0 --no-browser` to start the Jupyter Notebook.
   - Access the Jupyter Notebook using the public IP and the token provided.

Note:
- Ensure that you have the necessary permissions and the security group rules allow the required traffic (e.g., SSH, HTTP).
- You might need to modify the `ami`, `instance_type`, and other configurations based on your needs.
- The given script installs Jupyter Notebook in a basic way, and you might want to further configure it based on your needs (e.g., setting up passwords, using virtual environments).



case 2 :: by using file provisioners 

Certainly! You can use a file provisioner to transfer a bash script to the instance and a remote-exec provisioner to execute it. Below is an example of how you might do this:

1. **Create a Bash Script (`setup_jupyter.sh`):**
```bash
#!/bin/bash
sudo apt-get update
sudo apt-get install -y python3-pip
pip3 install notebook
```

2. **Terraform Script (`main.tf`):**
```hcl
provider "aws" {
  region = "us-west-1"
}

resource "aws_instance" "jupyter_instance" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "JupyterNotebook"
  }

  provisioner "file" {
    source      = "setup_jupyter.sh"
    destination = "/tmp/setup_jupyter.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/setup_jupyter.sh",
      "/tmp/setup_jupyter.sh",
    ]
  }

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = file("~/.ssh/id_rsa")
  }
}

output "public_ip" {
  value = aws_instance.jupyter_instance.public_ip
}
```

3. **Initialize and Apply:**
   - Run `terraform init` to initialize the configuration.
   - Run `terraform apply` to create the infrastructure.

4. **Access Jupyter Notebook:**
   - SSH into the created EC2 instance.
   - Run `jupyter notebook --ip=0.0.0.0 --no-browser` to start the Jupyter Notebook.
   - Access the Jupyter Notebook using the public IP and the token provided.

Note:
- Ensure the bash script (`setup_jupyter.sh`) is executable.
- Update the connection block with the appropriate SSH username and private key path.
- Adjust security group rules to allow necessary traffic (SSH, HTTP).
- Depending on the AMI used, you might need to adjust the username in the connection block or other parts of the script.
